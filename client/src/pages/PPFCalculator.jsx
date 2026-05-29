import { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Filler,
  Tooltip,
  Legend,
} from 'chart.js';
import { Line } from 'react-chartjs-2';
import { calculatorAPI } from '../services/api';
import { FiLock, FiTrendingUp, FiDollarSign, FiPercent, FiChevronDown, FiChevronUp } from 'react-icons/fi';
import { formatCurrency, formatLakhs } from '../utils/formatters';
import PageHeader from '../components/ui/PageHeader';
import InputSlider from '../components/ui/InputSlider';
import ResultCard from '../components/ui/ResultCard';

ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Filler, Tooltip, Legend);

// ---------- local fallback ----------
function calculatePPFLocal(annualInvestment, tenure, interestRate) {
  const r = interestRate / 100;
  let balance = 0;
  const totalInvested = annualInvestment * tenure;
  const yearWise = [];

  for (let y = 1; y <= tenure; y++) {
    balance += annualInvestment;
    const interest = balance * r;
    balance += interest;
    yearWise.push({
      year: y,
      balance: Math.round(balance),
      interest: Math.round(interest),
      contribution: annualInvestment,
    });
  }

  return {
    maturityAmount: Math.round(balance),
    totalInvested,
    totalInterest: Math.round(balance - totalInvested),
    yearWiseBreakdown: yearWise,
  };
}

// ---------- chart options ----------
const chartOptions = {
  responsive: true,
  maintainAspectRatio: false,
  plugins: {
    legend: { display: true, labels: { color: '#94a3b8', font: { family: 'Inter' } } },
    tooltip: {
      backgroundColor: '#1e1e32',
      titleColor: '#fff',
      bodyColor: '#94a3b8',
      borderColor: '#34d399',
      borderWidth: 1,
    },
  },
  scales: {
    x: { grid: { color: '#1e293b' }, ticks: { color: '#94a3b8' } },
    y: {
      grid: { color: '#1e293b' },
      ticks: {
        color: '#94a3b8',
        callback: (v) =>
          v >= 10000000
            ? (v / 10000000).toFixed(1) + 'Cr'
            : v >= 100000
            ? (v / 100000).toFixed(1) + 'L'
            : v,
      },
    },
  },
};

// ================================================================
const PPFCalculator = () => {
  // inputs
  const [annualInvestment, setAnnualInvestment] = useState(100000);
  const [tenure, setTenure] = useState(15);
  const [interestRate, setInterestRate] = useState(7.1);

  // results
  const [results, setResults] = useState(null);
  const [loading, setLoading] = useState(false);
  const [showTable, setShowTable] = useState(false);

  // ---------- calculate ----------
  const calculate = useCallback(async () => {
    setLoading(true);
    try {
      const { data } = await calculatorAPI.calculatePPF({
        annualInvestment,
        tenure,
        interestRate,
      });
      setResults(data);
    } catch {
      setResults(calculatePPFLocal(annualInvestment, tenure, interestRate));
    } finally {
      setLoading(false);
    }
  }, [annualInvestment, tenure, interestRate]);

  useEffect(() => {
    calculate();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // ---------- chart data ----------
  const chartData = results
    ? {
        labels: results.yearWiseBreakdown.map((r) => `Yr ${r.year}`),
        datasets: [
          {
            label: 'PPF Balance',
            data: results.yearWiseBreakdown.map((r) => r.balance),
            borderColor: '#34d399',
            backgroundColor: 'rgba(52, 211, 153, 0.10)',
            fill: true,
            tension: 0.4,
            pointRadius: 2,
            pointHoverRadius: 5,
          },
        ],
      }
    : null;

  // effective return
  const effectiveReturn =
    results && results.totalInvested > 0
      ? (((results.maturityAmount / results.totalInvested) ** (1 / tenure) - 1) * 100).toFixed(1) + '%'
      : '—';

  // ================================================================
  return (
    <div className="min-h-screen px-4 py-8 md:px-8 max-w-7xl mx-auto">
      <PageHeader
        title="PPF Calculator"
        subtitle="Plan your Public Provident Fund investments with tax-free returns"
        icon={FiLock}
        accentColor="green"
      />

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* ---- INPUTS ---- */}
        <motion.div
          className="glass-card p-6"
          initial={{ opacity: 0, x: -30 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5 }}
        >
          <h2 className="text-lg font-semibold text-white mb-6 flex items-center gap-2">
            <FiDollarSign className="text-accent-400" /> Input Parameters
          </h2>

          <InputSlider label="Annual Investment" min={500} max={150000} step={500} value={annualInvestment} onChange={setAnnualInvestment} />
          <InputSlider label="Tenure" min={15} max={50} step={5} value={tenure} onChange={setTenure} prefix="" suffix=" years" />
          <InputSlider label="Interest Rate" min={5} max={10} step={0.1} value={interestRate} onChange={setInterestRate} prefix="" suffix="%" />

          <button onClick={calculate} disabled={loading} className="btn-primary w-full mt-4 flex items-center justify-center gap-2">
            {loading ? (
              <span className="inline-block w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
            ) : (
              'Calculate'
            )}
          </button>
        </motion.div>

        {/* ---- RESULTS ---- */}
        <AnimatePresence mode="wait">
          {results && (
            <motion.div
              key="results"
              initial={{ opacity: 0, x: 30 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 30 }}
              transition={{ duration: 0.5 }}
              className="space-y-6"
            >
              {/* hero value */}
              <div className="glass-card p-6 text-center">
                <p className="text-dark-200 text-sm mb-1">Maturity Amount</p>
                <p className="text-4xl font-extrabold gradient-text">{formatLakhs(results.maturityAmount)}</p>
              </div>

              {/* stat cards */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <ResultCard label="Total Invested" value={results.totalInvested} icon={FiDollarSign} color="purple" />
                <ResultCard label="Total Interest" value={results.totalInterest} icon={FiPercent} color="green" />
                <ResultCard label="Effective Return" value={effectiveReturn} icon={FiTrendingUp} color="blue" />
              </div>

              {/* chart */}
              {chartData && (
                <div className="glass-card p-6">
                  <h3 className="text-sm font-semibold text-dark-200 mb-4">Year-wise PPF Growth</h3>
                  <div className="h-72">
                    <Line data={chartData} options={chartOptions} />
                  </div>
                </div>
              )}
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* ---- BREAKDOWN TABLE ---- */}
      {results && (
        <motion.div
          className="glass-card mt-8 overflow-hidden"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3, duration: 0.5 }}
        >
          <button
            onClick={() => setShowTable(!showTable)}
            className="w-full flex items-center justify-between p-6 text-white hover:bg-white/5 transition-colors"
          >
            <span className="font-semibold">Year-wise Breakdown</span>
            {showTable ? <FiChevronUp /> : <FiChevronDown />}
          </button>

          <AnimatePresence>
            {showTable && (
              <motion.div
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: 'auto', opacity: 1 }}
                exit={{ height: 0, opacity: 0 }}
                transition={{ duration: 0.35 }}
                className="overflow-x-auto"
              >
                <table className="w-full text-sm">
                  <thead>
                    <tr className="text-dark-200 border-b border-white/10">
                      <th className="text-left px-6 py-3">Year</th>
                      <th className="text-right px-6 py-3">Contribution</th>
                      <th className="text-right px-6 py-3">Interest</th>
                      <th className="text-right px-6 py-3">Balance</th>
                    </tr>
                  </thead>
                  <tbody>
                    {results.yearWiseBreakdown.map((row, i) => (
                      <tr
                        key={row.year}
                        className={`border-b border-white/5 ${i % 2 === 0 ? 'bg-dark-800/50' : ''}`}
                      >
                        <td className="px-6 py-3 text-white">{row.year}</td>
                        <td className="px-6 py-3 text-right text-dark-200">{formatCurrency(row.contribution)}</td>
                        <td className="px-6 py-3 text-right text-accent-400">{formatCurrency(row.interest)}</td>
                        <td className="px-6 py-3 text-right text-white font-medium">{formatCurrency(row.balance)}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </motion.div>
            )}
          </AnimatePresence>
        </motion.div>
      )}
    </div>
  );
};

export default PPFCalculator;
