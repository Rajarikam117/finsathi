import Groq from 'groq-sdk';

const SYSTEM_PROMPT = `You are FinSathi, an AI financial advisor specializing in Indian personal finance. You help with EPF, PPF, NPS, SIP, mutual funds, tax planning (80C, 80CCD, 80D), and general investment strategy. Give specific, actionable advice with numbers. Always mention that this is not certified financial advice. Format responses in markdown. Use ₹ symbol for amounts.`;

const FALLBACK_RESPONSE = 'I am currently in demo mode. Please configure your Groq API key to enable AI-powered financial advice. In the meantime, feel free to use our calculators for EPF, PPF, NPS, and SIP!';

export class GroqAdvisor {
  constructor() {
    const apiKey = process.env.GROQ_API_KEY;
    this.isDemoMode = !apiKey || apiKey === 'your_groq_api_key_here';

    if (!this.isDemoMode) {
      this.client = new Groq({ apiKey });
    }
  }

  /**
   * Send a chat message to the Groq LLaMA model.
   * @param {string} message - The user's message
   * @param {Array} conversationHistory - Previous messages [{role, content}]
   * @returns {Promise<string>} The AI response text
   */
  async chat(message, conversationHistory = []) {
    if (this.isDemoMode) {
      return FALLBACK_RESPONSE;
    }

    try {
      const messages = [
        { role: 'system', content: SYSTEM_PROMPT },
        ...conversationHistory.map(msg => ({
          role: msg.role,
          content: msg.content
        })),
        { role: 'user', content: message }
      ];

      const completion = await this.client.chat.completions.create({
        model: 'llama-3.3-70b-versatile',
        messages,
        temperature: 0.7,
        max_tokens: 2048
      });

      return completion.choices[0]?.message?.content || 'I apologize, but I was unable to generate a response. Please try again.';
    } catch (error) {
      console.error('Groq API Error:', error.message);

      if (error.status === 401) {
        return 'Invalid API key. Please check your Groq API key configuration.';
      }
      if (error.status === 429) {
        return 'Rate limit exceeded. Please wait a moment and try again.';
      }

      return 'I encountered an error while processing your request. Please try again later.';
    }
  }
}

export default GroqAdvisor;
