import { Database } from 'duckdb';
import { join } from 'path';

export interface SearchResult {
  id: string;
  filePath: string;
  content: string;
  startLine: number;
  endLine: number;
  similarity: number;
}

export class VectorSearch {
  private db: Database;
  private dbPath = join(__dirname, 'embeddings.db');

  constructor() {
    this.db = new Database(this.dbPath);
  }

  /**
   * Calculate cosine similarity between two vectors
   */
  private cosineSimilarity(vecA: number[], vecB: number[]): number {
    if (vecA.length !== vecB.length) {
      throw new Error('Vectors must have the same length');
    }

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

    if (normA === 0 || normB === 0) {
      return 0;
    }

    return dotProduct / (normA * normB);
  }

  /**
   * Search for similar code chunks using vector similarity
   */
  async searchSimilarChunks(queryEmbedding: number[], limit: number = 8): Promise<SearchResult[]> {
    try {
      // Get all embeddings from database
      const stmt = this.db.prepare(`
        SELECT id, file_path, content, start_line, end_line, embedding
        FROM embeddings
      `);
      
      const rows = stmt.all();
      
      // Calculate similarities
      const results: SearchResult[] = rows.map((row: any) => {
        const embedding = row.embedding;
        const similarity = this.cosineSimilarity(queryEmbedding, embedding);
        
        return {
          id: row.id,
          filePath: row.file_path,
          content: row.content,
          startLine: row.start_line,
          endLine: row.end_line,
          similarity
        };
      });
      
      // Sort by similarity (descending) and limit results
      return results
        .sort((a, b) => b.similarity - a.similarity)
        .slice(0, limit);
        
    } catch (error) {
      console.error('Error searching similar chunks:', error);
      throw error;
    }
  }

  /**
   * Search for chunks containing specific keywords
   */
  async searchByKeywords(keywords: string[], limit: number = 8): Promise<SearchResult[]> {
    try {
      const keywordPattern = keywords.join('|');
      
      const stmt = this.db.prepare(`
        SELECT id, file_path, content, start_line, end_line, 0.5 as similarity
        FROM embeddings
        WHERE content REGEXP ?
        ORDER BY LENGTH(content) ASC
        LIMIT ?
      `);
      
      const rows = stmt.all(keywordPattern, limit);
      
      return rows.map((row: any) => ({
        id: row.id,
        filePath: row.file_path,
        content: row.content,
        startLine: row.start_line,
        endLine: row.end_line,
        similarity: row.similarity
      }));
      
    } catch (error) {
      console.error('Error searching by keywords:', error);
      throw error;
    }
  }

  /**
   * Search for chunks within specific file paths
   */
  async searchInFiles(filePaths: string[], limit: number = 8): Promise<SearchResult[]> {
    try {
      const pathPattern = filePaths.join('|');
      
      const stmt = this.db.prepare(`
        SELECT id, file_path, content, start_line, end_line, 0.7 as similarity
        FROM embeddings
        WHERE file_path REGEXP ?
        ORDER BY file_path, start_line
        LIMIT ?
      `);
      
      const rows = stmt.all(pathPattern, limit);
      
      return rows.map((row: any) => ({
        id: row.id,
        filePath: row.file_path,
        content: row.content,
        startLine: row.start_line,
        endLine: row.end_line,
        similarity: row.similarity
      }));
      
    } catch (error) {
      console.error('Error searching in files:', error);
      throw error;
    }
  }

  /**
   * Get repository statistics
   */
  async getRepositoryStats(): Promise<{
    totalChunks: number;
    totalFiles: number;
    averageChunkSize: number;
  }> {
    try {
      const statsStmt = this.db.prepare(`
        SELECT 
          COUNT(*) as total_chunks,
          COUNT(DISTINCT file_path) as total_files,
          AVG(LENGTH(content)) as avg_chunk_size
        FROM embeddings
      `);
      
      const stats = statsStmt.get() as any;
      
      return {
        totalChunks: stats.total_chunks || 0,
        totalFiles: stats.total_files || 0,
        averageChunkSize: Math.round(stats.avg_chunk_size || 0)
      };
      
    } catch (error) {
      console.error('Error getting repository stats:', error);
      throw error;
    }
  }

  /**
   * Check if embeddings database exists and has data
   */
  async isIndexed(): Promise<boolean> {
    try {
      const stmt = this.db.prepare('SELECT COUNT(*) as count FROM embeddings');
      const result = stmt.get() as any;
      return result.count > 0;
    } catch (error) {
      return false;
    }
  }

  close() {
    this.db.close();
  }
}