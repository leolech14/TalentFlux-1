import { Database } from 'duckdb';
import { readFileSync, readdirSync, statSync, existsSync, mkdirSync } from 'fs';
import { join, extname, relative } from 'path';
import OpenAI from 'openai';

const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

interface CodeChunk {
  id: string;
  filePath: string;
  content: string;
  startLine: number;
  endLine: number;
  embedding?: number[];
}

export class RepoIndexer {
  private db: Database;
  private dbPath = join(__dirname, 'embeddings.db');

  constructor() {
    // Ensure ai directory exists
    if (!existsSync(__dirname)) {
      mkdirSync(__dirname, { recursive: true });
    }
    
    this.db = new Database(this.dbPath);
    this.initializeDB();
  }

  private initializeDB() {
    // Create embeddings table if it doesn't exist
    this.db.exec(`
      CREATE TABLE IF NOT EXISTS embeddings (
        id VARCHAR PRIMARY KEY,
        file_path VARCHAR,
        content TEXT,
        start_line INTEGER,
        end_line INTEGER,
        embedding DOUBLE[]
      )
    `);

    // Create index for faster similarity search
    this.db.exec(`
      CREATE INDEX IF NOT EXISTS idx_embeddings_file ON embeddings(file_path)
    `);
  }

  private shouldIndexFile(filePath: string): boolean {
    const ext = extname(filePath);
    const excludePaths = [
      'node_modules',
      '.git',
      'dist',
      'build',
      '.next',
      'coverage',
      'ai/embeddings.db'
    ];

    const includedExtensions = [
      '.ts', '.tsx', '.js', '.jsx', '.json', '.md', '.txt',
      '.css', '.scss', '.html', '.sql', '.py', '.sh'
    ];

    // Skip excluded directories
    if (excludePaths.some(exclude => filePath.includes(exclude))) {
      return false;
    }

    // Only include specific file types
    return includedExtensions.includes(ext) || !ext;
  }

  private chunkFile(content: string, filePath: string): CodeChunk[] {
    const lines = content.split('\n');
    const chunks: CodeChunk[] = [];
    const maxChunkSize = 1024; // 1KB chunks
    
    let currentChunk = '';
    let startLine = 1;
    let currentLine = 1;

    for (const line of lines) {
      const newChunk = currentChunk + line + '\n';
      
      if (newChunk.length > maxChunkSize && currentChunk.length > 0) {
        // Save current chunk
        chunks.push({
          id: `${filePath}:${startLine}-${currentLine - 1}`,
          filePath,
          content: currentChunk.trim(),
          startLine,
          endLine: currentLine - 1
        });
        
        // Start new chunk
        currentChunk = line + '\n';
        startLine = currentLine;
      } else {
        currentChunk = newChunk;
      }
      
      currentLine++;
    }

    // Add final chunk if it has content
    if (currentChunk.trim().length > 0) {
      chunks.push({
        id: `${filePath}:${startLine}-${currentLine - 1}`,
        filePath,
        content: currentChunk.trim(),
        startLine,
        endLine: currentLine - 1
      });
    }

    return chunks;
  }

  private async createEmbedding(text: string): Promise<number[]> {
    try {
      const response = await openai.embeddings.create({
        model: "text-embedding-3-small",
        input: text,
      });
      
      return response.data[0].embedding;
    } catch (error) {
      console.error('Error creating embedding:', error);
      throw error;
    }
  }

  private walkDirectory(dir: string, basePath: string = ''): string[] {
    const files: string[] = [];
    
    try {
      const entries = readdirSync(dir);
      
      for (const entry of entries) {
        const fullPath = join(dir, entry);
        const relativePath = join(basePath, entry);
        
        if (statSync(fullPath).isDirectory()) {
          files.push(...this.walkDirectory(fullPath, relativePath));
        } else if (this.shouldIndexFile(relativePath)) {
          files.push(relativePath);
        }
      }
    } catch (error) {
      console.warn(`Warning: Could not read directory ${dir}:`, error);
    }
    
    return files;
  }

  async indexRepository(rootPath: string = '.'): Promise<void> {
    console.log('🔍 Starting repository indexing...');
    
    // Clear existing embeddings
    this.db.exec('DELETE FROM embeddings');
    
    const files = this.walkDirectory(rootPath);
    console.log(`📁 Found ${files.length} files to index`);
    
    let processedChunks = 0;
    
    for (const filePath of files) {
      try {
        const fullPath = join(rootPath, filePath);
        const content = readFileSync(fullPath, 'utf-8');
        const chunks = this.chunkFile(content, filePath);
        
        for (const chunk of chunks) {
          // Create embedding for chunk
          const embedding = await this.createEmbedding(chunk.content);
          
          // Store in database
          this.db.exec(`
            INSERT INTO embeddings (id, file_path, content, start_line, end_line, embedding)
            VALUES ('${chunk.id.replace(/'/g, "''")}', '${chunk.filePath.replace(/'/g, "''")}', '${chunk.content.replace(/'/g, "''")}', ${chunk.startLine}, ${chunk.endLine}, [${embedding.join(',')}])
          `);
          
          processedChunks++;
          
          if (processedChunks % 10 === 0) {
            console.log(`📊 Processed ${processedChunks} chunks...`);
          }
        }
      } catch (error) {
        console.warn(`⚠️ Failed to process ${filePath}:`, error);
      }
    }
    
    console.log(`✅ Repository indexing complete! Processed ${processedChunks} chunks from ${files.length} files.`);
  }

  async searchSimilar(query: string, limit: number = 8): Promise<CodeChunk[]> {
    // Create embedding for the query
    const queryEmbedding = await this.createEmbedding(query);
    
    // Get all embeddings and calculate similarity manually
    const result = this.db.exec(`
      SELECT id, file_path, content, start_line, end_line, embedding
      FROM embeddings
    `);
    
    if (!result.length || !result[0].values) return [];
    
    const columns = result[0].columns;
    const values = result[0].values;
    
    // Calculate cosine similarity for each result
    const resultsWithSimilarity = values.map((row: any) => {
      const embedding = row.embedding;
      const similarity = this.calculateCosineSimilarity(queryEmbedding, embedding);
      
      return {
        id: row.id,
        filePath: row.file_path,
        content: row.content,
        startLine: row.start_line,
        endLine: row.end_line,
        similarity
      };
    });
    
    // Sort by similarity and return top results
    return resultsWithSimilarity
      .sort((a, b) => b.similarity - a.similarity)
      .slice(0, limit);
  }

  private calculateCosineSimilarity(vecA: number[], vecB: number[]): number {
    if (vecA.length !== vecB.length) return 0;

    let dotProduct = 0;
    let normA = 0;
    let normB = 0;

    for (let i = 0; i < vecA.length; i++) {
      dotProduct += vecA[i] * vecB[i];
      normA += vecA[i] * vecA[i];
      normB += vecB[i] * vecB[i];
    }

    normA = Math.sqrt(normA);
    normB = Math.sqrt(normB);

    if (normA === 0 || normB === 0) return 0;
    return dotProduct / (normA * normB);
  }

  close() {
    this.db.close();
  }
}

// CLI usage when run directly
if (require.main === module) {
  const indexer = new RepoIndexer();
  
  indexer.indexRepository()
    .then(() => {
      console.log('🎉 Indexing completed successfully!');
      indexer.close();
    })
    .catch((error) => {
      console.error('❌ Indexing failed:', error);
      indexer.close();
      process.exit(1);
    });
}