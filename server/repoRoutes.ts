import { Router } from 'express';
import { repoAgent } from '../ai/repoAgent.js';

const router = Router();

// Endpoint for repo-aware AI queries
router.post('/api/repo/query', async (req, res) => {
  try {
    const { query } = req.body;
    
    if (!query || typeof query !== 'string') {
      return res.status(400).json({ error: 'Query is required' });
    }

    if (!process.env.OPENAI_API_KEY) {
      return res.status(500).json({ error: 'OpenAI API key not configured' });
    }

    const response = await repoAgent.processQuery(query);
    
    res.json({ 
      response,
      type: 'repo-query'
    });
  } catch (error) {
    console.error('Repo query error:', error);
    res.status(500).json({ 
      error: 'Failed to process repository query',
      details: error instanceof Error ? error.message : 'Unknown error'
    });
  }
});

// Endpoint to check if repo agent is available
router.get('/api/repo/status', (req, res) => {
  res.json({
    available: !!process.env.OPENAI_API_KEY,
    indexed: false // Will be updated when we add persistence
  });
});

export default router;