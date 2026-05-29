import { Router } from 'express';
import { GroqAdvisor } from '../services/groqService.js';

const router = Router();
const advisor = new GroqAdvisor();

const SUGGESTED_PROMPTS = [
  'Compare EPF vs PPF for long-term savings',
  'Best SIP strategy for ₹10,000/month',
  'How to maximize tax savings under Section 80C?',
  'Should I invest in NPS for retirement?',
  'Explain the power of compounding with real numbers',
  'How much should I save monthly to retire at 50?'
];

/**
 * POST /api/advisor/chat
 * Chat with the AI financial advisor
 */
router.post('/chat', async (req, res) => {
  try {
    const { message, history } = req.body;

    if (!message || typeof message !== 'string' || message.trim().length === 0) {
      return res.status(400).json({
        error: true,
        message: 'Missing or empty "message" field is required'
      });
    }

    const conversationHistory = Array.isArray(history) ? history : [];
    const response = await advisor.chat(message.trim(), conversationHistory);

    res.json({ success: true, response });
  } catch (error) {
    console.error('Advisor chat error:', error.message);
    res.status(500).json({ error: true, message: 'Failed to get advisor response' });
  }
});

/**
 * GET /api/advisor/suggestions
 * Get suggested prompts for the advisor
 */
router.get('/suggestions', (req, res) => {
  res.json({ success: true, suggestions: SUGGESTED_PROMPTS });
});

export default router;
