#!/usr/bin/env tsx

import { execSync } from 'child_process';
import { existsSync, readFileSync, readdirSync, statSync } from 'fs';
import { join, extname } from 'path';
import { fileURLToPath } from 'url';
import OpenAI from 'openai';
import * as chokidar from 'chokidar';

const __filename = fileURLToPath(import.meta.url);
const __dirname = __filename.replace('/agent.ts', '');

const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

interface CodeChunk {
  filePath: string;
  content: string;
  startLine: number;
  endLine: number;
}

class TalentFluxAgent {
  private chunks: CodeChunk[] = [];
  private embeddings: Map<string, number[]> = new Map();
  private isIndexed = false;

  constructor() {
    if (!process.env.OPENAI_API_KEY) {
      console.error('❌ OPENAI_API_KEY environment variable is required');
      process.exit(1);
    }
  }

  private shouldIndexFile(filePath: string): boolean {
    const ext = extname(filePath);
    const excludePaths = ['node_modules', '.git', 'dist', 'build', '.next', 'coverage', 'ai/embeddings.db'];
    const includedExtensions = ['.ts', '.tsx', '.js', '.jsx', '.json', '.md', '.txt', '.css', '.scss', '.html'];

    if (excludePaths.some(exclude => filePath.includes(exclude))) return false;
    return includedExtensions.includes(ext) || !ext;
  }

  private chunkFile(content: string, filePath: string): CodeChunk[] {
    const lines = content.split('\n');
    const chunks: CodeChunk[] = [];
    const maxChunkSize = 1024;
    
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
      // Silently skip directories we can't read
    }
    
    return files;
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

  private hasChanges(): boolean {
    try {
      const output = execSync('git diff --name-only', { encoding: 'utf-8' });
      return output.trim().length > 0;
    } catch {
      // If git fails, assume changes exist
      return true;
    }
  }

  async indexRepository(rootPath: string = '.'): Promise<void> {
    console.log('🔍 Indexing TalentFlux repository...');
    
    this.chunks = [];
    this.embeddings.clear();
    
    const files = this.walkDirectory(rootPath);
    console.log(`📁 Found ${files.length} files to index`);
    
    let processedChunks = 0;
    
    for (const filePath of files) {
      try {
        const fullPath = join(rootPath, filePath);
        const content = readFileSync(fullPath, 'utf-8');
        const chunks = this.chunkFile(content, filePath);
        
        for (const chunk of chunks) {
          const embedding = await this.createEmbedding(chunk.content);
          const chunkId = `${chunk.filePath}:${chunk.startLine}-${chunk.endLine}`;
          
          this.chunks.push(chunk);
          this.embeddings.set(chunkId, embedding);
          
          processedChunks++;
          
          if (processedChunks % 50 === 0) {
            console.log(`📊 Processed ${processedChunks} chunks...`);
          }
        }
      } catch (error) {
        console.warn(`⚠️ Failed to process ${filePath}:`, error);
      }
    }
    
    this.isIndexed = true;
    console.log(`✅ Repository indexed! Processed ${processedChunks} chunks from ${files.length} files.`);
  }

  async searchSimilar(query: string, limit: number = 8): Promise<Array<CodeChunk & { similarity: number }>> {
    if (!this.isIndexed) {
      await this.indexRepository();
    }

    const queryEmbedding = await this.createEmbedding(query);
    const results: Array<CodeChunk & { similarity: number }> = [];
    
    this.chunks.forEach((chunk, index) => {
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
    // Check if re-indexing is needed
    if (!this.isIndexed || this.hasChanges()) {
      await this.indexRepository();
    }

    // Get relevant code context
    const relevantChunks = await this.searchSimilar(userPrompt, 8);
    
    // Build context string
    const context = relevantChunks.map(chunk => 
      `// File: ${chunk.filePath} (lines ${chunk.startLine}-${chunk.endLine})\n${chunk.content}`
    ).join('\n\n---\n\n');

    // Create the prompt for OpenAI
    const systemPrompt = `You are the omnipresent TalentFlux dev agent. You understand the mobile-first, AI-first architecture with tap-to-dismiss patterns and single-FAB rules.

When providing code solutions:
- Follow the existing TalentFlux patterns (React + TypeScript, Tailwind CSS, shadcn/ui)
- Maintain mobile-first responsive design
- Use the established widget system and modular architecture
- Follow the tap-to-dismiss interaction patterns
- Respect the single Magic Star FAB principle
- Use the existing theme system and color palette
- Follow the authentication and routing patterns

Provide complete, working code that can be copy-pasted. If suggesting changes, format as a git diff.`;

    const userMessage = `Repo context:
${context}

Task: ${userPrompt}`;

    try {
      const response = await openai.chat.completions.create({
        model: "gpt-4o", // the newest OpenAI model is "gpt-4o" which was released May 13, 2024. do not change this unless explicitly requested by the user
        messages: [
          { role: "system", content: systemPrompt },
          { role: "user", content: userMessage }
        ],
        max_tokens: 2000,
        temperature: 0.1
      });

      return response.choices[0].message.content || 'No response generated';
    } catch (error) {
      console.error('Error calling OpenAI:', error);
      throw error;
    }
  }

  async startWatchMode(): Promise<void> {
    console.log('👀 Starting watch mode...');
    
    // Initial indexing
    await this.indexRepository();
    
    const watcher = chokidar.watch('.', {
      ignored: ['node_modules/**', '.git/**', 'ai/embeddings.db'],
      persistent: true
    });

    watcher.on('change', async (path) => {
      console.log(`🔄 File changed: ${path} - Re-indexing...`);
      await this.indexRepository();
    });

    console.log('👁️ Watch mode active. Files will be re-indexed on changes.');
  }
}

// CLI Interface
async function main() {
  const args = process.argv.slice(2);
  const agent = new TalentFluxAgent();

  if (args.length === 0 || args[0] === 'help') {
    console.log(`
🤖 TalentFlux AI Agent

Usage:
  npm run ai "query"          - Ask a question about the codebase
  npm run ai --watch          - Start watch mode for auto-indexing
  npm run ai --index          - Force re-index the repository

Examples:
  npm run ai "Where is the FAB clamp?"
  npm run ai "Refactor theme toggle to Context API"
  npm run ai "Generate Playwright test for sidebar dismiss"
  npm run ai "Find inline colors violating palette tokens"
    `);
    return;
  }

  if (args[0] === '--watch') {
    await agent.startWatchMode();
    // Keep the process alive
    process.stdin.resume();
    return;
  }

  if (args[0] === '--index') {
    await agent.indexRepository();
    return;
  }

  // Process the query
  const query = args.join(' ');
  console.log(`🔍 Processing: "${query}"`);
  
  try {
    const response = await agent.processQuery(query);
    console.log('\n' + '='.repeat(80));
    console.log(response);
    console.log('='.repeat(80) + '\n');
  } catch (error) {
    console.error('❌ Error processing query:', error);
    process.exit(1);
  }
}

// Check if this module is being run directly
const isMainModule = import.meta.url === `file://${process.argv[1]}`;

if (isMainModule) {
  main().catch(console.error);
}

export { TalentFluxAgent };