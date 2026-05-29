import { useState } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { FiPieChart, FiTrendingUp, FiTarget, FiShield, FiArrowRight, FiArrowUpRight, FiZap } from 'react-icons/fi';
import { HiSparkles } from 'react-icons/hi2';
import { Doughnut, Line } from 'react-chartjs-2';
import { Chart as ChartJS, ArcElement, Tooltip, Legend, CategoryScale, LinearScale, PointElement, LineElement, Filler } from 'chart.js';
import AnimatedCounter from '../components/ui/AnimatedCounter';

ChartJS.register(ArcElement, Tooltip, Legend, CategoryScale, LinearScale, PointElement, LineElement, Filler);

const formatINR = (value) => new Intl.NumberFormat('en-IN').format(value);

const container = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: { staggerChildren: 0.1 },
  },
};

const item = {
  hidden: { opacity: 0, y: 20 },
  show: { opacity: 1, y: 0, transition: { duration: 0.5, ease: 'easeOut' } },
};

const Dashboard = () => {
  const [portfolioData] = useState({
    totalPortfolio: 1800000,
    monthlyInvestment: 28000,
    expectedReturns: 12.5,
    taxSaved: 150000,
  });

  const today = new Date().toLocaleDateString('en-IN', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });

  // Stats cards config
  const stats = [
    {
      label: 'Total Portfolio',
      value: portfolioData.totalPortfolio,
      prefix: '₹',
      suffix: '',
      decimals: 0,
      icon: FiPieChart,
      trend: '+8.2%',
      trendUp: true,
      color: 'from-purple-500/20 to-purple-600/5',
      iconBg: 'bg-purple-500/20',
      iconColor: 'text-purple-400',
      borderColor: 'border-purple-500/20',
    },
    {
      label: 'Monthly Investment',
      value: portfolioData.monthlyInvestment,
      prefix: '₹',
      suffix: '',
      decimals: 0,
      icon: FiTrendingUp,
      trend: '+₹3,000',
      trendUp: true,
      color: 'from-emerald-500/20 to-emerald-600/5',
      iconBg: 'bg-emerald-500/20',
      iconColor: 'text-emerald-400',
      borderColor: 'border-emerald-500/20',
    },
    {
      label: 'Expected Returns',
      value: portfolioData.expectedReturns,
      prefix: '',
      suffix: '%',
      decimals: 1,
      formatIndian: false,
      icon: FiTarget,
      trend: '+1.2%',
      trendUp: true,
      color: 'from-blue-500/20 to-blue-600/5',
      iconBg: 'bg-blue-500/20',
      iconColor: 'text-blue-400',
      borderColor: 'border-blue-500/20',
    },
    {
      label: 'Tax Saved',
      value: portfolioData.taxSaved,
      prefix: '₹',
      suffix: '',
      decimals: 0,
      icon: FiShield,
      trend: 'Section 80C',
      trendUp: true,
      color: 'from-amber-500/20 to-amber-600/5',
      iconBg: 'bg-amber-500/20',
      iconColor: 'text-amber-400',
      borderColor: 'border-amber-500/20',
    },
  ];

  // Doughnut chart data
  const doughnutData = {
    labels: ['EPF', 'PPF', 'NPS', 'SIP'],
    datasets: [
      {
        data: [25, 35, 15, 25],
        backgroundColor: ['#8b5cf6', '#06d6a0', '#3b82f6', '#f59e0b'],
        borderWidth: 0,
        hoverOffset: 8,
      },
    ],
  };

  const doughnutOptions = {
    cutout: '65%',
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: 'bottom',
        labels: {
          color: '#e2e8f0',
          padding: 20,
          usePointStyle: true,
          pointStyleWidth: 10,
          font: { size: 13, family: 'Inter' },
        },
      },
      tooltip: {
        backgroundColor: '#1e1e32',
        titleColor: '#f8fafc',
        bodyColor: '#cbd5e1',
        borderColor: 'rgba(139, 92, 246, 0.3)',
        borderWidth: 1,
        cornerRadius: 12,
        padding: 12,
        callbacks: {
          label: (ctx) => `${ctx.label}: ${ctx.parsed}% (₹${formatINR(Math.round(portfolioData.totalPortfolio * ctx.parsed / 100))})`,
        },
      },
    },
  };

  // Line chart data
  const lineLabels = Array.from({ length: 10 }, (_, i) => `Year ${i + 1}`);
  const growthValues = [1800000, 2250000, 2780000, 3350000, 3980000, 4420000, 4780000, 5050000, 5320000, 5500000];

  const lineData = {
    labels: lineLabels,
    datasets: [
      {
        label: 'Portfolio Value',
        data: growthValues,
        borderColor: '#8b5cf6',
        borderWidth: 2.5,
        pointBackgroundColor: '#8b5cf6',
        pointBorderColor: '#0f0f1a',
        pointBorderWidth: 2,
        pointRadius: 4,
        pointHoverRadius: 7,
        tension: 0.4,
        fill: true,
        backgroundColor: (ctx) => {
          const chart = ctx.chart;
          const { ctx: canvasCtx, chartArea } = chart;
          if (!chartArea) return 'rgba(139, 92, 246, 0.1)';
          const gradient = canvasCtx.createLinearGradient(0, chartArea.top, 0, chartArea.bottom);
          gradient.addColorStop(0, 'rgba(139, 92, 246, 0.3)');
          gradient.addColorStop(0.5, 'rgba(139, 92, 246, 0.1)');
          gradient.addColorStop(1, 'rgba(139, 92, 246, 0)');
          return gradient;
        },
      },
    ],
  };

  const lineOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: { display: false },
      tooltip: {
        backgroundColor: '#1e1e32',
        titleColor: '#f8fafc',
        bodyColor: '#cbd5e1',
        borderColor: 'rgba(139, 92, 246, 0.3)',
        borderWidth: 1,
        cornerRadius: 12,
        padding: 12,
        callbacks: {
          label: (ctx) => `₹${formatINR(ctx.parsed.y)}`,
        },
      },
    },
    scales: {
      x: {
        grid: { color: '#1e293b', drawBorder: false },
        ticks: { color: '#94a3b8', font: { size: 12, family: 'Inter' } },
        border: { display: false },
      },
      y: {
        grid: { color: '#1e293b', drawBorder: false },
        ticks: {
          color: '#94a3b8',
          font: { size: 12, family: 'Inter' },
          callback: (val) => `₹${(val / 100000).toFixed(0)}L`,
        },
        border: { display: false },
      },
    },
    interaction: {
      intersect: false,
      mode: 'index',
    },
  };

  // Quick actions config
  const quickActions = [
    {
      title: 'EPF Calculator',
      description: 'Calculate your Employee Provident Fund maturity amount',
      to: '/calculator/epf',
      icon: FiShield,
      color: 'text-purple-400',
      bg: 'bg-purple-500/10',
      hoverBorder: 'hover:border-purple-500/30',
    },
    {
      title: 'PPF Calculator',
      description: 'Plan your Public Provident Fund investments & returns',
      to: '/calculator/ppf',
      icon: FiTrendingUp,
      color: 'text-emerald-400',
      bg: 'bg-emerald-500/10',
      hoverBorder: 'hover:border-emerald-500/30',
    },
    {
      title: 'NPS Calculator',
      description: 'Estimate your National Pension System corpus & pension',
      to: '/calculator/nps',
      icon: FiTarget,
      color: 'text-blue-400',
      bg: 'bg-blue-500/10',
      hoverBorder: 'hover:border-blue-500/30',
    },
    {
      title: 'SIP Calculator',
      description: 'Project your Systematic Investment Plan wealth growth',
      to: '/calculator/sip',
      icon: FiPieChart,
      color: 'text-amber-400',
      bg: 'bg-amber-500/10',
      hoverBorder: 'hover:border-amber-500/30',
    },
  ];

  // AI insights
  const insights = [
    '💡 Consider increasing your SIP by 10% annually to build ₹1Cr corpus by age 45',
    '📊 Your PPF allocation is optimal for tax saving under Section 80C',
    '🎯 Adding ₹5,000/month to NPS can give you ₹35,000/month pension at 60',
  ];

  return (
    <motion.div
      className="min-h-screen bg-dark-900 px-4 sm:px-6 lg:px-8 py-8 pb-20"
      variants={container}
      initial="hidden"
      animate="show"
    >
      <div className="max-w-7xl mx-auto space-y-8">
        {/* ── Welcome Header ────────────────────────── */}
        <motion.div variants={item}>
          <h1 className="text-3xl sm:text-4xl font-bold text-white">
            Welcome back! <span className="inline-block animate-bounce">👋</span>
          </h1>
          <p className="text-dark-200 mt-1 text-sm sm:text-base">{today}</p>
          <p className="text-dark-200 text-base sm:text-lg mt-1">Here&apos;s your financial overview</p>
        </motion.div>

        {/* ── Stats Row ─────────────────────────────── */}
        <motion.div variants={item} className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
          {stats.map((stat) => {
            const Icon = stat.icon;
            return (
              <motion.div
                key={stat.label}
                whileHover={{ y: -4, transition: { duration: 0.2 } }}
                className={`glass-card p-5 flex flex-col gap-3 border ${stat.borderColor}`}
              >
                <div className="flex items-center justify-between">
                  <div className={`w-11 h-11 rounded-xl ${stat.iconBg} flex items-center justify-center`}>
                    <Icon className={`w-5 h-5 ${stat.iconColor}`} />
                  </div>
                  <span className="flex items-center gap-1 text-xs font-medium text-emerald-400 bg-emerald-500/10 px-2 py-1 rounded-full">
                    <FiArrowUpRight className="w-3 h-3" />
                    {stat.trend}
                  </span>
                </div>
                <div>
                  <p className="text-dark-200 text-sm mb-1">{stat.label}</p>
                  <p className="text-2xl font-bold text-white">
                    <AnimatedCounter
                      end={stat.value}
                      prefix={stat.prefix}
                      suffix={stat.suffix}
                      decimals={stat.decimals}
                      formatIndian={stat.formatIndian !== false}
                      duration={1800}
                    />
                  </p>
                </div>
              </motion.div>
            );
          })}
        </motion.div>

        {/* ── Charts Row ────────────────────────────── */}
        <motion.div variants={item} className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Doughnut – Portfolio Distribution */}
          <div className="glass-card p-6">
            <h3 className="text-lg font-semibold text-white mb-6 flex items-center gap-2">
              <FiPieChart className="text-purple-400" />
              Portfolio Distribution
            </h3>
            <div className="relative h-72 sm:h-80 flex items-center justify-center">
              <Doughnut data={doughnutData} options={doughnutOptions} />
              {/* Center overlay */}
              <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none" style={{ marginBottom: 48 }}>
                <span className="text-dark-200 text-xs uppercase tracking-wider">Total</span>
                <span className="text-xl sm:text-2xl font-bold text-white">₹{formatINR(portfolioData.totalPortfolio)}</span>
              </div>
            </div>
          </div>

          {/* Line – Growth Projection */}
          <div className="glass-card p-6">
            <h3 className="text-lg font-semibold text-white mb-6 flex items-center gap-2">
              <FiTrendingUp className="text-emerald-400" />
              Growth Projection
            </h3>
            <div className="h-72 sm:h-80">
              <Line data={lineData} options={lineOptions} />
            </div>
          </div>
        </motion.div>

        {/* ── Quick Actions ─────────────────────────── */}
        <motion.div variants={item}>
          <h2 className="text-xl font-semibold text-white mb-4 flex items-center gap-2">
            <FiZap className="text-amber-400" />
            Quick Actions
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-5">
            {quickActions.map((action) => {
              const Icon = action.icon;
              return (
                <Link key={action.title} to={action.to}>
                  <motion.div
                    whileHover={{ y: -4, transition: { duration: 0.2 } }}
                    className={`glass-card p-5 h-full flex flex-col gap-3 cursor-pointer transition-all duration-300 ${action.hoverBorder} hover:shadow-lg`}
                  >
                    <div className={`w-11 h-11 rounded-xl ${action.bg} flex items-center justify-center`}>
                      <Icon className={`w-5 h-5 ${action.color}`} />
                    </div>
                    <div className="flex-1">
                      <h3 className="text-white font-semibold mb-1">{action.title}</h3>
                      <p className="text-dark-200 text-sm leading-relaxed">{action.description}</p>
                    </div>
                    <div className={`flex items-center gap-1 text-sm font-medium ${action.color}`}>
                      Open <FiArrowRight className="w-4 h-4" />
                    </div>
                  </motion.div>
                </Link>
              );
            })}
          </div>
        </motion.div>

        {/* ── AI Insights ───────────────────────────── */}
        <motion.div variants={item} className="glass-card p-6 md:p-8">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-semibold text-white flex items-center gap-2">
              <HiSparkles className="text-amber-400 w-5 h-5" />
              AI Insights
            </h2>
            <Link to="/advisor" className="text-sm font-medium text-primary-400 hover:text-primary-300 transition-colors flex items-center gap-1">
              Get Personalized Advice <FiArrowRight className="w-4 h-4" />
            </Link>
          </div>
          <div className="space-y-4">
            {insights.map((insight, idx) => (
              <motion.div
                key={idx}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.6 + idx * 0.15, duration: 0.4 }}
                className="flex items-start gap-3 p-4 rounded-xl bg-white/[0.03] border border-white/5 hover:border-primary-500/20 transition-colors"
              >
                <p className="text-dark-200 text-sm sm:text-base leading-relaxed">{insight}</p>
              </motion.div>
            ))}
          </div>
        </motion.div>
      </div>
    </motion.div>
  );
};

export default Dashboard;
