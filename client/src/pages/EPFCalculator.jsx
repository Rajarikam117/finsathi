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
import { FiShield, FiDollarSign, FiUsers, FiPercent, FiChevronDown, FiChevronUp } from 'react-icons/fi';
import { formatCurrency, formatLakhs } from '../utils/formatters';
import PageHeader from '../components/ui/PageHeader';
import InputSlider from '../components/ui/InputSlider';
import ResultCard from '../components/ui/ResultCard';

ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Filler, Tooltip, Legend);

// ---------- local fallback ----------
function calculateEPFLocal(basicSalary, da, employeeRate, years, increment, interestRate) {
  const monthlyRate = interestRate / 100 / 12;
  let balance = 0;
  let totalEmployee = 0,
    totalEmployer = 0,
    totalInterest = 0;
  let currentSalary = basicSalary + da;
  const yearWise = [];

  for (let y = 1; y <= years; y++) {
    let yearInterest = 0,
      yearContrib = 0;
    const empContrib = currentSalary * (employeeRate / 100);
    const erContrib = currentSalary * 0.0367;

    for (let m = 0; m < 12; m++) {
      balance += empContrib + erContrib;
      const interest = balance * monthlyRate;
      balance += interest;
      yearInterest += interest;
      yearContrib += empContrib + erContrib;
    }

    totalEmployee += empContrib * 12;
    totalEmployer += erContrib * 12;
    totalInterest += yearInterest;

    yearWise.push({
      year: y,
      balance: Math.round(balance),
      interest: Math.round(yearInterest),
      contribution: Math.round(yearContrib),
    });
    currentSalary *= 1 + increment / 100;
  }

  return {
    maturityAmount: Math.round(balance),
    totalEmployeeContribution: Math.round(totalEmployee),
    totalEmployerContribution: Math.round(totalEmployer),
    totalInterest: Math.round(totalInterest),
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
      borderColor: '#8b5cf6',
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
const EPFCalculator = () => {
  // inputs
  const [basicSalary, setBasicSalary] = useState(25000);
  const [da, setDa] = useState(0);
  const [employeeRate, setEmployeeRate] = useState(12);
  const [years, setYears] = useState(25);
  const [increment, setIncrement] = useState(5);
  const [interestRate, setInterestRate] = useState(8.25);

  // results
  const [results, setResults] = useState(null);
  const [loading, setLoading] = useState(false);
  const [showTable, setShowTable] = useState(false);

  // ---------- calculate ----------
  const calculate = useCallback(async () => {
    setLoading(true);
    try {
      const { data } = await calculatorAPI.calculateEPF({
        basicSalary,
        da,
        employeeRate,
        years,
        increment,
        interestRate,
      });
      setResults(data);
    } catch {
      setResults(calculateEPFLocal(basicSalary, da, employeeRate, years, increment, interestRate));
    } finally {
      setLoading(false);
    }
  }, [basicSalary, da, employeeRate, years, increment, interestRate]);

  // auto-calculate on mount
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
            label: 'EPF Balance',
            data: results.yearWiseBreakdown.map((r) => r.balance),
            borderColor: '#8b5cf6',
            backgroundColor: 'rgba(139, 92, 246, 0.10)',
            fill: true,
            tension: 0.4,
            pointRadius: 2,
            pointHoverRadius: 5,
          },
        ],
      }
    : null;

  // ================================================================
  return (
    <div className="min-h-screen px-4 py-8 md:px-8 max-w-7xl mx-auto">
      <PageHeader
        title="EPF Calculator"
        subtitle="Estimate your Employee Provident Fund corpus at retirement"
        icon={FiShield}
        accentColor="purple"
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
            <FiDollarSign className="text-primary-400" /> Input Parameters
          </h2>

          <InputSlider label="Basic Salary" min={5000} max={200000} step={1000} value={basicSalary} onChange={setBasicSalary} />
          <InputSlider label="Dearness Allowance" min={0} max={100000} step={500} value={da} onChange={setDa} />
          <InputSlider label="Employee Contribution Rate" min={1} max={12} step={0.5} value={employeeRate} onChange={setEmployeeRate} prefix="" suffix="%" />
          <InputSlider label="Years of Service" min={1} max={35} step={1} value={years} onChange={setYears} prefix="" suffix=" yrs" />
          <InputSlider label="Annual Salary Increment" min={0} max={20} step={0.5} value={increment} onChange={setIncrement} prefix="" suffix="%" />
          <InputSlider label="Interest Rate" min={5} max={12} step={0.1} value={interestRate} onChange={setInterestRate} prefix="" suffix="%" />

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
                <ResultCard label="Employee Contribution" value={results.totalEmployeeContribution} icon={FiUsers} color="purple" />
                <ResultCard label="Employer Contribution" value={results.totalEmployerContribution} icon={FiUsers} color="blue" />
                <ResultCard label="Total Interest" value={results.totalInterest} icon={FiPercent} color="green" />
              </div>

              {/* chart */}
              {chartData && (
                <div className="glass-card p-6">
                  <h3 className="text-sm font-semibold text-dark-200 mb-4">Year-wise EPF Growth</h3>
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

export default EPFCalculator;
