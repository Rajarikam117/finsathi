import { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import { motion, useInView } from 'framer-motion';
import {
  FiShield,
  FiLock,
  FiTrendingUp,
  FiBarChart2,
  FiMessageCircle,
  FiPieChart,
  FiArrowRight,
  FiGithub,
  FiMousePointer,
  FiEdit3,
  FiCpu,
  FiZap,
} from 'react-icons/fi';

/* ────────────────────────────────────────────
   Animated Counter – counts up from 0 to `end`
   ──────────────────────────────────────────── */
function AnimatedCounter({ end, suffix = '', prefix = '', duration = 2 }) {
  const [count, setCount] = useState(0);
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: '-50px' });

  useEffect(() => {
    if (!inView) return;
    let start = 0;
    const step = end / (duration * 60); // ~60 fps
    const timer = setInterval(() => {
      start += step;
      if (start >= end) {
        setCount(end);
        clearInterval(timer);
      } else {
        setCount(Math.floor(start));
      }
    }, 1000 / 60);
    return () => clearInterval(timer);
  }, [inView, end, duration]);

  return (
    <span ref={ref}>
      {prefix}
      {Intl.NumberFormat('en-IN').format(count)}
      {suffix}
    </span>
  );
}

/* ────────────────────────────────────────────
   Framer-motion helpers
   ──────────────────────────────────────────── */
const fadeUp = {
  hidden: { opacity: 0, y: 30 },
  visible: (i = 0) => ({
    opacity: 1,
    y: 0,
    transition: { delay: i * 0.1, duration: 0.6, ease: 'easeOut' },
  }),
};

const staggerContainer = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.12 } },
};

/* ────────────────────────────────────────────
   Feature & Step data
   ──────────────────────────────────────────── */
const features = [
  {
    icon: FiShield,
    title: 'EPF Calculator',
    desc: 'Calculate your Employee Provident Fund maturity amount with accurate government rates',
    color: 'text-purple-400',
    bg: 'bg-purple-500/10',
    link: '/epf',
  },
  {
    icon: FiLock,
    title: 'PPF Calculator',
    desc: 'Plan your Public Provident Fund investments with 15-year projection',
    color: 'text-blue-400',
    bg: 'bg-blue-500/10',
    link: '/ppf',
  },
  {
    icon: FiTrendingUp,
    title: 'NPS Calculator',
    desc: 'Estimate your National Pension System corpus and monthly pension',
    color: 'text-emerald-400',
    bg: 'bg-emerald-500/10',
    link: '/nps',
  },
  {
    icon: FiBarChart2,
    title: 'SIP Calculator',
    desc: 'Project your Systematic Investment Plan returns with step-up option',
    color: 'text-amber-400',
    bg: 'bg-amber-500/10',
    link: '/sip',
  },
  {
    icon: FiMessageCircle,
    title: 'AI Financial Advisor',
    desc: 'Get personalized financial advice powered by advanced AI',
    color: 'text-pink-400',
    bg: 'bg-pink-500/10',
    link: '/advisor',
  },
  {
    icon: FiPieChart,
    title: 'Portfolio Dashboard',
    desc: 'Track all your investments in one beautiful dashboard',
    color: 'text-cyan-400',
    bg: 'bg-cyan-500/10',
    link: '/dashboard',
  },
];

const steps = [
  {
    num: '01',
    icon: FiMousePointer,
    title: 'Choose Your Tool',
    desc: 'Select from our suite of financial calculators',
  },
  {
    num: '02',
    icon: FiEdit3,
    title: 'Enter Your Details',
    desc: 'Input your financial parameters',
  },
  {
    num: '03',
    icon: FiCpu,
    title: 'Get AI Insights',
    desc: 'Receive personalized recommendations',
  },
];

/* ════════════════════════════════════════════
   LANDING PAGE COMPONENT
   ════════════════════════════════════════════ */
export default function LandingPage() {
  return (
    <div className="min-h-screen bg-dark-900 text-white overflow-x-hidden">
      {/* ── Mini Nav ─────────────────────────── */}
      <header className="fixed top-0 inset-x-0 z-50 backdrop-blur-xl bg-dark-900/70 border-b border-white/5">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <Link to="/" className="flex items-center gap-2 group">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-primary-500 to-accent-500 flex items-center justify-center shadow-glow-purple transition-shadow group-hover:shadow-glow-green">
              <FiZap className="text-white text-lg" />
            </div>
            <span className="text-xl font-bold tracking-tight">
              Fin<span className="gradient-text">Sathi</span>
            </span>
          </Link>
          <Link to="/dashboard" className="btn-primary text-sm !px-5 !py-2.5">
            Get Started
          </Link>
        </div>
      </header>

      {/* ── HERO ─────────────────────────────── */}
      <section className="relative min-h-screen flex items-center justify-center pt-16 overflow-hidden">
        {/* Floating gradient orbs */}
        <div className="absolute top-20 left-10 w-72 h-72 bg-primary-600/20 rounded-full blur-3xl animate-float" />
        <div
          className="absolute bottom-20 right-10 w-96 h-96 bg-accent-500/10 rounded-full blur-3xl animate-float"
          style={{ animationDelay: '3s' }}
        />
        <div
          className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-primary-500/5 rounded-full blur-3xl animate-float"
          style={{ animationDelay: '5s' }}
        />

        {/* Grid pattern overlay */}
        <div
          className="absolute inset-0 opacity-[0.03]"
          style={{
            backgroundImage:
              'linear-gradient(rgba(255,255,255,.1) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,.1) 1px, transparent 1px)',
            backgroundSize: '60px 60px',
          }}
        />

        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <motion.div
            variants={staggerContainer}
            initial="hidden"
            animate="visible"
            className="flex flex-col items-center"
          >
            {/* Badge */}
            <motion.div variants={fadeUp} custom={0} className="mb-8">
              <span className="chip text-sm">
                🚀&nbsp; AI-Powered Finance Platform
              </span>
            </motion.div>

            {/* Heading */}
            <motion.h1
              variants={fadeUp}
              custom={1}
              className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-extrabold leading-tight tracking-tight"
            >
              Your AI-Powered
              <br />
              <span className="gradient-text">Financial Companion</span>
            </motion.h1>

            {/* Subheading */}
            <motion.p
              variants={fadeUp}
              custom={2}
              className="mt-6 text-lg sm:text-xl text-dark-200 max-w-2xl text-balance"
            >
              Smart investment planning for EPF, PPF, NPS &amp; SIP with
              AI-driven insights tailored for Indian investors
            </motion.p>

            {/* CTA Buttons */}
            <motion.div
              variants={fadeUp}
              custom={3}
              className="mt-10 flex flex-wrap gap-4 justify-center"
            >
              <Link to="/dashboard" className="btn-primary text-lg !px-8 !py-4">
                Get Started
                <FiArrowRight className="inline ml-2 -mt-0.5" />
              </Link>
              <a href="#features" className="btn-outline text-lg !px-8 !py-4">
                Explore Tools
              </a>
            </motion.div>

            {/* Stats */}
            <motion.div
              variants={fadeUp}
              custom={4}
              className="mt-16 grid grid-cols-1 sm:grid-cols-3 gap-6 sm:gap-10 w-full max-w-2xl"
            >
              {[
                {
                  value: 10000,
                  suffix: '+',
                  label: 'Users',
                  icon: '👥',
                },
                {
                  value: 500,
                  prefix: '₹',
                  suffix: 'Cr+',
                  label: 'Calculated',
                  icon: '💰',
                },
                {
                  value: 4.9,
                  suffix: '★',
                  label: 'Rating',
                  icon: '⭐',
                  isDecimal: true,
                },
              ].map((stat) => (
                <div
                  key={stat.label}
                  className="flex flex-col items-center gap-1 glass-card py-4 px-3"
                >
                  <span className="text-2xl sm:text-3xl font-bold text-white">
                    {stat.isDecimal ? (
                      <span>4.9★</span>
                    ) : (
                      <AnimatedCounter
                        end={stat.value}
                        suffix={stat.suffix}
                        prefix={stat.prefix || ''}
                      />
                    )}
                  </span>
                  <span className="text-dark-200 text-sm">{stat.label}</span>
                </div>
              ))}
            </motion.div>
          </motion.div>

          {/* Scroll indicator */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 2, duration: 1 }}
            className="absolute bottom-8 left-1/2 -translate-x-1/2"
          >
            <a href="#features" aria-label="Scroll to features">
              <div className="w-6 h-10 rounded-full border-2 border-white/20 flex justify-center pt-2">
                <motion.div
                  animate={{ y: [0, 12, 0] }}
                  transition={{ duration: 1.5, repeat: Infinity, ease: 'easeInOut' }}
                  className="w-1.5 h-1.5 bg-primary-400 rounded-full"
                />
              </div>
            </a>
          </motion.div>
        </div>
      </section>

      {/* ── FEATURES ─────────────────────────── */}
      <section id="features" className="relative py-24 sm:py-32">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Section header */}
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: '-80px' }}
            variants={staggerContainer}
            className="text-center mb-16"
          >
            <motion.h2
              variants={fadeUp}
              custom={0}
              className="section-title"
            >
              Powerful{' '}
              <span className="gradient-text">Financial Tools</span>
            </motion.h2>
            <motion.p
              variants={fadeUp}
              custom={1}
              className="section-subtitle mx-auto"
            >
              Everything you need to plan, track, and grow your wealth — all in
              one place.
            </motion.p>
          </motion.div>

          {/* Feature cards grid */}
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: '-40px' }}
            variants={staggerContainer}
            className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6"
          >
            {features.map((f, i) => {
              const Icon = f.icon;
              return (
                <motion.div
                  key={f.title}
                  variants={fadeUp}
                  custom={i}
                  className="glass-card-hover p-6 sm:p-8 flex flex-col gap-4 group"
                >
                  {/* Icon circle */}
                  <div
                    className={`w-14 h-14 rounded-2xl ${f.bg} flex items-center justify-center transition-transform duration-300 group-hover:scale-110`}
                  >
                    <Icon className={`text-2xl ${f.color}`} />
                  </div>

                  <h3 className="text-xl font-semibold">{f.title}</h3>
                  <p className="text-dark-200 text-sm leading-relaxed flex-1">
                    {f.desc}
                  </p>

                  <Link
                    to={f.link}
                    className="inline-flex items-center gap-1 text-primary-400 text-sm font-medium mt-auto group/link hover:gap-2 transition-all"
                  >
                    Learn More
                    <FiArrowRight className="transition-transform group-hover/link:translate-x-1" />
                  </Link>
                </motion.div>
              );
            })}
          </motion.div>
        </div>
      </section>

      {/* ── HOW IT WORKS ─────────────────────── */}
      <section className="relative py-24 sm:py-32 overflow-hidden">
        {/* Background accent */}
        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-primary-900/5 to-transparent" />

        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Section header */}
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: '-80px' }}
            variants={staggerContainer}
            className="text-center mb-20"
          >
            <motion.h2
              variants={fadeUp}
              custom={0}
              className="section-title"
            >
              How It <span className="gradient-text">Works</span>
            </motion.h2>
            <motion.p
              variants={fadeUp}
              custom={1}
              className="section-subtitle mx-auto"
            >
              Start making smarter financial decisions in three simple steps.
            </motion.p>
          </motion.div>

          {/* Steps */}
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: '-40px' }}
            variants={staggerContainer}
            className="relative grid grid-cols-1 md:grid-cols-3 gap-12 md:gap-8"
          >
            {/* Connecting line – desktop only */}
            <div className="hidden md:block absolute top-14 left-[16.666%] right-[16.666%] h-0.5 bg-gradient-to-r from-primary-500/40 via-primary-400/20 to-accent-500/40" />
            {/* Connecting line – mobile only */}
            <div className="md:hidden absolute left-7 top-14 bottom-14 w-0.5 bg-gradient-to-b from-primary-500/40 via-primary-400/20 to-accent-500/40" />

            {steps.map((s, i) => {
              const Icon = s.icon;
              return (
                <motion.div
                  key={s.num}
                  variants={fadeUp}
                  custom={i}
                  className="relative flex md:flex-col items-start md:items-center text-left md:text-center gap-6 md:gap-4"
                >
                  {/* Number badge */}
                  <div className="relative z-10 flex-shrink-0 w-14 h-14 rounded-2xl bg-gradient-to-br from-primary-600 to-primary-500 flex items-center justify-center text-lg font-bold shadow-glow-purple">
                    {s.num}
                  </div>

                  <div className="flex flex-col gap-2">
                    <h3 className="text-xl font-semibold">{s.title}</h3>
                    <p className="text-dark-200 text-sm max-w-xs">{s.desc}</p>
                    <Icon className="text-primary-400 text-xl mt-1 hidden md:block mx-auto" />
                  </div>
                </motion.div>
              );
            })}
          </motion.div>
        </div>
      </section>

      {/* ── CTA ──────────────────────────────── */}
      <section className="py-24 sm:py-32">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: '-60px' }}
            variants={staggerContainer}
          >
            <motion.div
              variants={fadeUp}
              custom={0}
              className="relative glass-card p-10 sm:p-16 text-center overflow-hidden"
            >
              {/* Gradient border effect */}
              <div className="absolute inset-0 rounded-2xl p-[1px] pointer-events-none">
                <div className="absolute inset-0 rounded-2xl bg-gradient-to-r from-primary-500/30 via-accent-500/20 to-primary-500/30" />
              </div>

              {/* Inner background */}
              <div className="absolute inset-[1px] rounded-2xl bg-dark-900/90 backdrop-blur-xl" />

              {/* Accent orbs */}
              <div className="absolute -top-20 -right-20 w-60 h-60 bg-primary-600/10 rounded-full blur-3xl" />
              <div className="absolute -bottom-20 -left-20 w-60 h-60 bg-accent-500/10 rounded-full blur-3xl" />

              <div className="relative z-10">
                <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold leading-tight mb-4">
                  Ready to take control of
                  <br className="hidden sm:block" />{' '}
                  <span className="gradient-text">your finances?</span>
                </h2>
                <p className="text-dark-200 text-lg max-w-xl mx-auto mb-10">
                  Start planning your financial future with AI-powered insights
                </p>
                <Link
                  to="/dashboard"
                  className="btn-accent text-lg !px-10 !py-4 inline-flex items-center gap-2"
                >
                  Get Started Free
                  <FiArrowRight />
                </Link>
              </div>
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* ── FOOTER ───────────────────────────── */}
      <footer className="border-t border-white/5 py-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-6">
            {/* Left */}
            <div className="flex flex-col sm:flex-row items-center gap-4 text-sm text-dark-200">
              <span className="font-semibold text-white">
                Fin<span className="gradient-text">Sathi</span> © 2026
              </span>
              <span className="hidden sm:inline text-white/20">|</span>
              <span>Built with ❤️ for Indian Investors</span>
            </div>

            {/* Center – disclaimer */}
            <p className="text-xs text-dark-300 text-center max-w-xs">
              Not financial advice. For educational and informational purposes
              only.
            </p>

            {/* Right – socials */}
            <a
              href="https://github.com"
              target="_blank"
              rel="noopener noreferrer"
              className="text-dark-200 hover:text-white transition-colors"
              aria-label="GitHub"
            >
              <FiGithub className="text-xl" />
            </a>
          </div>
        </div>
      </footer>
    </div>
  );
}
