import { readFileSync, readdirSync, statSync } from 'fs';
import { join, extname } from 'path';
import OpenAI from 'openai';

const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

interface CodeChunk {
  filePath: string;
  content: string;
  startLine: number;
  endLine: number;
}

export class RepoAgent {
  private chunks: CodeChunk[] = [];
  private embeddings: Map<string, number[]> = new Map();
  private isIndexed = false;

  private shouldIndexFile(filePath: string): boolean {
    const ext = extname(filePath);
    const excludePaths = ['node_modules', '.git', 'dist', 'build', '.next', 'coverage'];
    const includedExtensions = ['.ts', '.tsx', '.js', '.jsx', '.json', '.md', '.css'];

    if (excludePaths.some(exclude => filePath.includes(exclude))) return false;
    return includedExtensions.includes(ext);
  }

  private chunkFile(content: string, filePath: string): CodeChunk[] {
    const lines = content.split('\n');
    const chunks: CodeChunk[] = [];
    const maxChunkSize = 800; // Smaller chunks for faster processing
    
    let currentChunk = '';
    let startLine = 1;
    let currentLine = 1;

    for (const line of lines) {
      const newChunk = currentChunk + line + '\n';
      
      if (newChunk.length > maxChunkSize && currentChunk.length > 0) {
        chunks.push({
          filePath,
          content: currentChunk.trim(),
          startLine,
          endLine: currentLine - 1
        });
        
        currentChunk = line + '\n';
        startLine = currentLine;
      } else {
        currentChunk = newChunk;
      }
      
      currentLine++;
    }

    if (currentChunk.trim().length > 0) {
      chunks.push({
        filePath,
        content: currentChunk.trim(),
        startLine,
        endLine: currentLine - 1
      });
    }

    return chunks;
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
      // Skip directories we can't read
    }
    
    return files;
  }

  private async createEmbedding(text: string): Promise<number[]> {
    const response = await openai.embeddings.create({
      model: "text-embedding-3-small",
      input: text,
    });
    return response.data[0].embedding;
  }

  private cosineSimilarity(vecA: number[], vecB: number[]): number {
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

  async quickIndex(): Promise<void> {
    if (this.isIndexed) return;

    console.log('🔍 Quick indexing key files...');
    
    // Focus on key directories for faster indexing
    const keyPaths = [
      'client/src/components',
      'client/src/features', 
      'client/src/pages',
      'client/src/ai',
      'client/src/core',
      'server',
      'shared'
    ];

    this.chunks = [];
    this.embeddings.clear();
    
    let processedChunks = 0;
    
    for (const keyPath of keyPaths) {
      try {
        const files = this.walkDirectory(keyPath);
        
        for (const filePath of files.slice(0, 20)) { // Limit files per directory
          try {
            const content = readFileSync(filePath, 'utf-8');
            const chunks = this.chunkFile(content, filePath);
            
            for (const chunk of chunks.slice(0, 3)) { // Limit chunks per file
              const embedding = await this.createEmbedding(chunk.content);
              const chunkId = `${chunk.filePath}:${chunk.startLine}-${chunk.endLine}`;
              
              this.chunks.push(chunk);
              this.embeddings.set(chunkId, embedding);
              processedChunks++;
            }
          } catch (error) {
            // Skip files we can't process
          }
        }
      } catch (error) {
        // Skip directories that don't exist
      }
    }
    
    this.isIndexed = true;
    console.log(`✅ Quick indexed ${processedChunks} chunks`);
  }

  async searchSimilar(query: string, limit: number = 6): Promise<Array<CodeChunk & { similarity: number }>> {
    if (!this.isIndexed) {
      await this.quickIndex();
    }

    const queryEmbedding = await this.createEmbedding(query);
    const results: Array<CodeChunk & { similarity: number }> = [];
    
    this.chunks.forEach((chunk) => {
      const chunkId = `${chunk.filePath}:${chunk.startLine}-${chunk.endLine}`;
      const embedding = this.embeddings.get(chunkId);
      
      if (embedding) {
        const similarity = this.cosineSimilarity(queryEmbedding, embedding);
        results.push({ ...chunk, similarity });
      }
    });
    
    return results
      .sort((a, b) => b.similarity - a.similarity)
      .slice(0, limit);
  }

  async processQuery(userPrompt: string): Promise<string> {
    const relevantChunks = await this.searchSimilar(userPrompt, 6);
    
    const context = relevantChunks.map(chunk => 
      `// File: ${chunk.filePath} (lines ${chunk.startLine}-${chunk.endLine})\n${chunk.content}`
    ).join('\n\n---\n\n');

    const systemPrompt = `You are the TalentFlux development assistant. You understand the mobile-first, AI-first architecture with these key patterns:

- React + TypeScript with Tailwind CSS and shadcn/ui components
- Single Magic Star FAB with boundary clamping
- Tap-to-dismiss interaction patterns
- Widget-based modular dashboard architecture
- Theme system with dark/light mode support
- Authentication with role-based flows (candidate/employer)
- Natural language CV creation with OpenAI integration

Provide clear, actionable responses that follow TalentFlux patterns. If suggesting code changes, make them specific and implementable.`;

    const userMessage = `Repository context:
${context}

Question: ${userPrompt}`;

    const response = await openai.chat.completions.create({
      model: "gpt-4o",
      messages: [
        { role: "system", content: systemPrompt },
        { role: "user", content: userMessage }
      ],
      max_tokens: 1500,
      temperature: 0.1
    });

    return response.choices[0].message.content || 'No response generated';
  }
}

export const repoAgent = new RepoAgent();