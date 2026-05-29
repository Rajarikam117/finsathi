import { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FiSend, FiMessageCircle, FiCpu, FiUser, FiZap, FiChevronRight } from 'react-icons/fi';
import { advisorAPI } from '../services/api';
import ReactMarkdown from 'react-markdown';

const defaultSuggestions = [
  'Compare EPF vs PPF for long-term savings',
  'Best SIP strategy for ₹10,000/month',
  'How to maximize tax savings under Section 80C?',
  'Should I invest in NPS for retirement?',
  'Explain the power of compounding with real numbers',
  'How much should I save monthly to retire at 50?',
];

const quickStartCards = [
  { emoji: '💰', title: 'Tax Saving', desc: 'Best strategies for Section 80C', query: 'What are the best tax saving strategies under Section 80C?' },
  { emoji: '📈', title: 'Investment', desc: 'Compare investment instruments', query: 'Compare different investment instruments available in India' },
  { emoji: '🏦', title: 'Retirement', desc: 'Plan your retirement corpus', query: 'How do I plan my retirement corpus effectively?' },
  { emoji: '📊', title: 'SIP Planning', desc: 'Optimize your SIP investments', query: 'How to optimize my SIP investments for maximum returns?' },
];

export default function AdvisorPage() {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [suggestions, setSuggestions] = useState(defaultSuggestions);

  const messagesEndRef = useRef(null);
  const textareaRef = useRef(null);

  // Fetch suggestions on mount
  useEffect(() => {
    const fetchSuggestions = async () => {
      try {
        const response = await advisorAPI.getSuggestions();
        if (response.data?.suggestions?.length) {
          setSuggestions(response.data.suggestions);
        }
      } catch {
        // Keep default suggestions on failure
      }
    };
    fetchSuggestions();
  }, []);

  // Auto-scroll to bottom on new messages
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isLoading]);

  // Auto-resize textarea
  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto';
      textareaRef.current.style.height = `${Math.min(textareaRef.current.scrollHeight, 128)}px`;
    }
  }, [input]);

  const sendMessage = async (overrideContent) => {
    const content = overrideContent || input.trim();
    if (!content || isLoading) return;

    const userMessage = { role: 'user', content };
    setMessages((prev) => [...prev, userMessage]);
    setInput('');
    setIsLoading(true);

    try {
      const history = messages.map((m) => ({ role: m.role, content: m.content }));
      const response = await advisorAPI.chat(userMessage.content, history);
      const aiMessage = { role: 'assistant', content: response.data.response };
      setMessages((prev) => [...prev, aiMessage]);
    } catch {
      const errorMessage = {
        role: 'assistant',
        content:
          "I apologize, but I'm having trouble connecting right now. Please try again in a moment, or explore our calculators for EPF, PPF, NPS, and SIP in the meantime!",
      };
      setMessages((prev) => [...prev, errorMessage]);
    }

    setIsLoading(false);
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };

  const handleSuggestionClick = (text) => {
    sendMessage(text);
  };

  // ---------- Render helpers ----------

  const WelcomeState = () => (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6 }}
      className="flex flex-col items-center justify-center h-full px-4 text-center"
    >
      <div className="w-20 h-20 rounded-2xl bg-primary-500/10 border border-primary-500/20 flex items-center justify-center mb-6">
        <FiCpu className="w-10 h-10 text-primary-400" />
      </div>

      <h2 className="text-2xl md:text-3xl font-bold text-white mb-3">
        Hello! I'm <span className="gradient-text">FinSathi AI</span>
      </h2>

      <p className="text-dark-200 max-w-lg mb-10 leading-relaxed">
        Your personal AI-powered financial advisor for Indian markets. Ask me anything about EPF, PPF, NPS, SIP, mutual
        funds, tax planning, or investment strategies.
      </p>

      <div className="grid grid-cols-2 gap-3 w-full max-w-md">
        {quickStartCards.map((card) => (
          <motion.button
            key={card.title}
            whileHover={{ scale: 1.03, y: -2 }}
            whileTap={{ scale: 0.97 }}
            onClick={() => handleSuggestionClick(card.query)}
            className="glass-card p-4 text-left cursor-pointer group transition-all duration-300 hover:border-primary-500/30"
          >
            <span className="text-2xl mb-2 block">{card.emoji}</span>
            <p className="text-sm font-semibold text-white mb-1 group-hover:text-primary-400 transition-colors">
              {card.title}
            </p>
            <p className="text-xs text-dark-200">{card.desc}</p>
          </motion.button>
        ))}
      </div>
    </motion.div>
  );

  const MessageBubble = ({ message, index }) => {
    const isUser = message.role === 'user';

    return (
      <motion.div
        initial={{ opacity: 0, y: 12, scale: 0.97 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        exit={{ opacity: 0, y: -8 }}
        transition={{ duration: 0.3, delay: 0.05 }}
        className={`flex gap-3 ${isUser ? 'justify-end' : 'justify-start'}`}
      >
        {/* AI avatar */}
        {!isUser && (
          <div className="flex-shrink-0 w-8 h-8 rounded-xl bg-primary-500/10 border border-primary-500/20 flex items-center justify-center mt-1">
            <FiCpu className="w-4 h-4 text-primary-400" />
          </div>
        )}

        <div
          className={`max-w-[80%] md:max-w-[70%] px-4 py-3 ${
            isUser
              ? 'bg-primary-600 rounded-2xl rounded-br-md text-white'
              : 'glass-card text-dark-100'
          }`}
        >
          {isUser ? (
            <p className="text-sm leading-relaxed whitespace-pre-wrap">{message.content}</p>
          ) : (
            <div className="prose prose-invert prose-sm max-w-none prose-p:leading-relaxed prose-p:mb-2 prose-headings:text-white prose-headings:mb-2 prose-headings:mt-3 prose-strong:text-primary-300 prose-li:text-dark-100 prose-code:text-accent-400 prose-code:bg-dark-800/60 prose-code:px-1.5 prose-code:py-0.5 prose-code:rounded-md prose-code:text-xs prose-pre:bg-dark-800/80 prose-pre:rounded-xl prose-pre:border prose-pre:border-white/5">
              <ReactMarkdown>{message.content}</ReactMarkdown>
            </div>
          )}
        </div>

        {/* User avatar */}
        {isUser && (
          <div className="flex-shrink-0 w-8 h-8 rounded-xl bg-primary-600 flex items-center justify-center mt-1">
            <FiUser className="w-4 h-4 text-white" />
          </div>
        )}
      </motion.div>
    );
  };

  const TypingIndicator = () => (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0 }}
      className="flex gap-3 justify-start"
    >
      <div className="flex-shrink-0 w-8 h-8 rounded-xl bg-primary-500/10 border border-primary-500/20 flex items-center justify-center mt-1">
        <FiCpu className="w-4 h-4 text-primary-400" />
      </div>
      <div className="glass-card">
        <div className="flex items-center gap-1 px-4 py-3">
          <div className="w-2 h-2 bg-primary-400 rounded-full typing-dot" />
          <div className="w-2 h-2 bg-primary-400 rounded-full typing-dot" />
          <div className="w-2 h-2 bg-primary-400 rounded-full typing-dot" />
        </div>
      </div>
    </motion.div>
  );

  // ---------- Main layout ----------

  return (
    <div className="h-[calc(100vh-4rem)] flex bg-dark-900">
      {/* ---- Left Sidebar (desktop) ---- */}
      <aside className="hidden lg:flex flex-col w-[300px] border-r border-white/5 bg-surface/40 backdrop-blur-xl">
        {/* Sidebar header */}
        <div className="p-6 pb-4">
          <div className="flex items-center gap-3 mb-1">
            <div className="w-10 h-10 rounded-xl bg-primary-500/10 border border-primary-500/20 flex items-center justify-center">
              <FiZap className="w-5 h-5 text-primary-400" />
            </div>
            <div>
              <h2 className="font-bold text-white text-lg gradient-text">FinSathi AI</h2>
              <p className="text-xs text-dark-200">Your personal finance advisor</p>
            </div>
          </div>
        </div>

        <div className="mx-6 border-t border-white/5" />

        {/* Suggested topics */}
        <div className="flex-1 overflow-y-auto p-6 pt-4">
          <h3 className="text-xs font-semibold uppercase tracking-wider text-dark-200 mb-4 flex items-center gap-2">
            <FiMessageCircle className="w-3.5 h-3.5" />
            Suggested Topics
          </h3>

          <div className="space-y-2">
            {suggestions.map((suggestion, i) => (
              <motion.button
                key={i}
                whileHover={{ x: 4 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => handleSuggestionClick(suggestion)}
                className="w-full text-left p-3 rounded-xl bg-white/[0.03] border border-white/5 text-sm text-dark-200 hover:text-white hover:bg-white/[0.06] hover:border-primary-500/20 transition-all duration-200 cursor-pointer flex items-start gap-2 group"
              >
                <FiChevronRight className="w-3.5 h-3.5 mt-0.5 flex-shrink-0 text-primary-500/50 group-hover:text-primary-400 transition-colors" />
                <span>{suggestion}</span>
              </motion.button>
            ))}
          </div>
        </div>

        {/* Disclaimer */}
        <div className="p-4 mx-2 mb-2">
          <p className="text-[10px] text-dark-200/60 leading-relaxed text-center">
            AI responses are for informational purposes only. Not certified financial advice.
          </p>
        </div>
      </aside>

      {/* ---- Main Chat Area ---- */}
      <main className="flex-1 flex flex-col min-w-0">
        {/* Top bar */}
        <div className="flex items-center gap-3 px-6 py-4 border-b border-white/5 bg-surface/30 backdrop-blur-xl">
          <div className="w-9 h-9 rounded-xl bg-primary-500/10 border border-primary-500/20 flex items-center justify-center lg:hidden">
            <FiCpu className="w-4.5 h-4.5 text-primary-400" />
          </div>
          <div>
            <h1 className="font-semibold text-white text-base">Financial Advisor</h1>
            <div className="flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-accent-400 animate-pulse" />
              <span className="text-xs text-accent-400 font-medium">Online</span>
            </div>
          </div>
        </div>

        {/* Messages container */}
        <div className="flex-1 overflow-y-auto px-4 md:px-6 py-6 space-y-5">
          {messages.length === 0 ? (
            <WelcomeState />
          ) : (
            <AnimatePresence mode="popLayout">
              {messages.map((message, index) => (
                <MessageBubble key={index} message={message} index={index} />
              ))}
            </AnimatePresence>
          )}

          <AnimatePresence>{isLoading && <TypingIndicator />}</AnimatePresence>

          <div ref={messagesEndRef} />
        </div>

        {/* Input area */}
        <div className="p-4 border-t border-white/5 bg-surface/30 backdrop-blur-xl">
          <div className="glass-card flex items-end gap-3 p-3 max-w-3xl mx-auto">
            <textarea
              ref={textareaRef}
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder="Ask about EPF, PPF, NPS, SIP, tax planning..."
              rows={1}
              className="flex-1 bg-transparent text-white text-sm placeholder-dark-200 resize-none focus:outline-none leading-relaxed max-h-32"
            />
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => sendMessage()}
              disabled={!input.trim() || isLoading}
              className={`flex-shrink-0 w-10 h-10 rounded-xl flex items-center justify-center transition-all duration-200 ${
                input.trim() && !isLoading
                  ? 'bg-primary-600 hover:bg-primary-500 text-white shadow-lg shadow-primary-600/25 cursor-pointer'
                  : 'bg-dark-800/60 text-dark-200/40 cursor-not-allowed'
              }`}
            >
              <FiSend className="w-4 h-4" />
            </motion.button>
          </div>
        </div>
      </main>
    </div>
  );
}
