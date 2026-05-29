import { Router } from 'express';
import { getPortfolio, savePortfolio, getSummary } from '../services/portfolioService.js';

const router = Router();

/**
 * GET /api/portfolio/summary
 * Get portfolio summary with totals
 */
router.get('/summary', (req, res) => {
  try {
    const summary = getSummary();
    res.json({ success: true, data: summary });
  } catch (error) {
    console.error('Portfolio summary error:', error.message);
    res.status(500).json({ error: true, message: 'Failed to get portfolio summary' });
  }
});

/**
 * POST /api/portfolio/save
 * Save portfolio data
 */
router.post('/save', (req, res) => {
  try {
    const { portfolio } = req.body;

    if (!portfolio || typeof portfolio !== 'object') {
      return res.status(400).json({
        error: true,
        message: 'Missing or invalid "portfolio" object in request body'
      });
    }

    const saved = savePortfolio(portfolio);
    res.json({ success: true, data: saved, message: 'Portfolio saved successfully' });
  } catch (error) {
    console.error('Portfolio save error:', error.message);
    res.status(500).json({ error: true, message: 'Failed to save portfolio' });
  }
});

export default router;
