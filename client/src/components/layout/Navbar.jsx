import { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
  FiMenu,
  FiX,
  FiHome,
  FiPieChart,
  FiMessageCircle,
  FiTarget,
  FiBarChart2,
  FiShield,
  FiLock,
  FiTrendingUp,
} from 'react-icons/fi';

const navLinks = [
  { to: '/dashboard', label: 'Dashboard', icon: FiHome },
  { to: '/calculator/epf', label: 'EPF', icon: FiShield },
  { to: '/calculator/ppf', label: 'PPF', icon: FiLock },
  { to: '/calculator/nps', label: 'NPS', icon: FiTrendingUp },
  { to: '/calculator/sip', label: 'SIP', icon: FiBarChart2 },
  { to: '/advisor', label: 'AI Advisor', icon: FiMessageCircle },
];

export default function Navbar() {
  const [mobileOpen, setMobileOpen] = useState(false);
  const { pathname } = useLocation();

  const isActive = (path) => pathname === path;

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-dark-900/80 backdrop-blur-xl border-b border-white/5">
      {/* ── Main bar ── */}
      <div className="max-w-7xl mx-auto h-16 px-4 sm:px-6 lg:px-8 flex items-center justify-between">
        {/* Logo */}
        <Link to="/" className="flex items-center gap-1 text-xl font-bold tracking-tight">
          <span className="text-white">Fin</span>
          <span className="gradient-text">Sathi</span>
        </Link>

        {/* Desktop links */}
        <div className="hidden md:flex items-center gap-1">
          {navLinks.map(({ to, label }) => (
            <Link
              key={to}
              to={to}
              className={`relative px-3 py-2 text-sm font-medium rounded-lg transition-colors duration-200 ${
                isActive(to)
                  ? 'text-primary-400'
                  : 'text-dark-200 hover:text-white'
              }`}
            >
              {label}
              {isActive(to) && (
                <motion.span
                  layoutId="nav-indicator"
                  className="absolute bottom-0 left-1/2 -translate-x-1/2 h-0.5 w-4 rounded-full bg-primary-400"
                  transition={{ type: 'spring', stiffness: 380, damping: 30 }}
                />
              )}
            </Link>
          ))}
        </div>

        {/* Mobile toggle */}
        <button
          onClick={() => setMobileOpen((v) => !v)}
          className="md:hidden p-2 text-dark-200 hover:text-white transition-colors"
          aria-label="Toggle menu"
        >
          {mobileOpen ? <FiX size={22} /> : <FiMenu size={22} />}
        </button>
      </div>

      {/* ── Gradient accent line ── */}
      <div className="h-px w-full bg-gradient-to-r from-primary-500 via-accent-500 to-primary-500 opacity-40" />

      {/* ── Mobile dropdown ── */}
      <AnimatePresence>
        {mobileOpen && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.25, ease: 'easeInOut' }}
            className="md:hidden overflow-hidden bg-dark-800/95 backdrop-blur-xl border-b border-white/5"
          >
            <div className="px-4 py-3 space-y-1">
              {navLinks.map(({ to, label, icon: Icon }) => (
                <Link
                  key={to}
                  to={to}
                  onClick={() => setMobileOpen(false)}
                  className={`flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-colors duration-200 ${
                    isActive(to)
                      ? 'text-primary-400 bg-primary-500/10'
                      : 'text-dark-200 hover:text-white hover:bg-white/5'
                  }`}
                >
                  <Icon size={18} />
                  {label}
                </Link>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
}
