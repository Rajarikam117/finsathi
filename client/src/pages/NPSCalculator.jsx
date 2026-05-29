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
import {
  FiTarget,
  FiDollarSign,
  FiPieChart,
  FiTrendingUp,
  FiChevronDown,
  FiChevronUp,
} from 'react-icons/fi';
import { formatCurrency, formatLakhs } from '../utils/formatters';
import PageHeader from '../components/ui/PageHeader';
import InputSlider from '../components/ui/InputSlider';
import ResultCard from '../components/ui/ResultCard';

ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Filler, Tooltip, Legend);

// ---------- local fallback ----------
function calculateNPSLocal(monthly, currentAge, retireAge, eqAlloc, cdAlloc, gbAlloc, eqReturn, cdReturn, gbReturn) {
  const years = retireAge - currentAge;
  const weightedReturn = (eqAlloc * eqReturn + cdAlloc * cdReturn + gbAlloc * gbReturn) / 100;
  const monthlyRate = weightedReturn / 100 / 12;
  const months = years * 12;
  let corpus = 0;
  const totalContribution = monthly * months;
  const yearWise = [];

  for (let y = 1; y <= years; y++) {
    for (let m = 0; m < 12; m++) {
      corpus += monthly;
      corpus *= 1 + monthlyRate;
    }
    yearWise.push({ year: y, age: currentAge + y, balance: Math.round(corpus) });
  }

  const lumpSum = Math.round(corpus * 0.6);
  const annuityCorpus = corpus * 0.4;
  const monthlyPension = Math.round((annuityCorpus * 0.06) / 12);

  return {
    totalCorpus: Math.round(corpus),
    lumpSumAmount: lumpSum,
    monthlyPension,
    totalContribution,
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
      borderColor: '#3b82f6',
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
const NPSCalculator = () => {
  // inputs
  const [monthly, setMonthly] = useState(5000);
  const [currentAge, setCurrentAge] = useState(30);
  const [retireAge, setRetireAge] = useState(60);
  const [eqAlloc, setEqAlloc] = useState(50);
  const [cdAlloc, setCdAlloc] = useState(30);
  const [eqReturn, setEqReturn] = useState(12);
  const [cdReturn, setCdReturn] = useState(8);
  const [gbReturn, setGbReturn] = useState(9);

  const gbAlloc = Math.max(0, 100 - eqAlloc - cdAlloc);

  // clamp corporate debt when equity changes
  const handleEqAlloc = (val) => {
    setEqAlloc(val);
    if (val + cdAlloc > 100) setCdAlloc(100 - val);
  };
  const handleCdAlloc = (val) => {
    if (eqAlloc + val > 100) return;
    setCdAlloc(val);
  };

  // results
  const [results, setResults] = useState(null);
  const [loading, setLoading] = useState(false);
  const [showTable, setShowTable] = useState(false);

  // ---------- calculate ----------
  const calculate = useCallback(async () => {
    setLoading(true);
    try {
      const { data } = await calculatorAPI.calculateNPS({
        monthly,
        currentAge,
        retireAge,
        eqAlloc,
        cdAlloc,
        gbAlloc,
        eqReturn,
        cdReturn,
        gbReturn,
      });
      setResults(data);
    } catch {
      setResults(
        calculateNPSLocal(monthly, currentAge, retireAge, eqAlloc, cdAlloc, gbAlloc, eqReturn, cdReturn, gbReturn)
      );
    } finally {
      setLoading(false);
    }
  }, [monthly, currentAge, retireAge, eqAlloc, cdAlloc, gbAlloc, eqReturn, cdReturn, gbReturn]);

  useEffect(() => {
    calculate();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // ---------- chart data ----------
  const chartData = results
    ? {
        labels: results.yearWiseBreakdown.map((r) => `Age ${r.age}`),
        datasets: [
          {
            label: 'NPS Corpus',
            data: results.yearWiseBreakdown.map((r) => r.balance),
            borderColor: '#3b82f6',
            backgroundColor: 'rgba(59, 130, 246, 0.10)',
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
        title="NPS Calculator"
        subtitle="Project your National Pension System corpus and monthly pension"
        icon={FiTarget}
        accentColor="blue"
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
            <FiDollarSign className="text-blue-400" /> Contribution
          </h2>

          <InputSlider label="Monthly Contribution" min={1000} max={100000} step={500} value={monthly} onChange={setMonthly} />
          <InputSlider label="Current Age" min={18} max={55} step={1} value={currentAge} onChange={setCurrentAge} prefix="" suffix=" yrs" />
          <InputSlider label="Retirement Age" min={55} max={70} step={1} value={retireAge} onChange={setRetireAge} prefix="" suffix=" yrs" />

          <hr className="border-white/10 my-6" />

          <h2 className="text-lg font-semibold text-white mb-6 flex items-center gap-2">
            <FiPieChart className="text-blue-400" /> Asset Allocation
          </h2>

          <InputSlider label="Equity (E)" min={0} max={75} step={5} value={eqAlloc} onChange={handleEqAlloc} prefix="" suffix="%" />
          <InputSlider label="Corporate Debt (C)" min={0} max={100} step={5} value={cdAlloc} onChange={handleCdAlloc} prefix="" suffix="%" />

          {/* Govt bond – read only display */}
          <div className="mb-6">
            <div className="flex items-center justify-between mb-3">
              <label className="text-sm font-medium text-dark-200">Government Bond (G)</label>
              <span className="text-sm font-semibold text-white bg-surface/80 px-3 py-1 rounded-lg border border-white/10">
                {gbAlloc}%
              </span>
            </div>
            <div className="h-[6px] rounded-full bg-[#1e293b] overflow-hidden">
              <div
                className="h-full bg-blue-400 rounded-full transition-all"
                style={{ width: `${gbAlloc}%` }}
              />
            </div>
          </div>

          <hr className="border-white/10 my-6" />

          <h2 className="text-lg font-semibold text-white mb-6 flex items-center gap-2">
            <FiTrendingUp className="text-blue-400" /> Expected Returns
          </h2>

          <InputSlider label="Equity Return" min={8} max={18} step={0.5} value={eqReturn} onChange={setEqReturn} prefix="" suffix="%" />
          <InputSlider label="Corporate Debt Return" min={6} max={12} step={0.5} value={cdReturn} onChange={setCdReturn} prefix="" suffix="%" />
          <InputSlider label="Government Bond Return" min={6} max={12} step={0.5} value={gbReturn} onChange={setGbReturn} prefix="" suffix="%" />

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
                <p className="text-dark-200 text-sm mb-1">Total Corpus at Retirement</p>
                <p className="text-4xl font-extrabold gradient-text">{formatLakhs(results.totalCorpus)}</p>
              </div>

              {/* stat cards */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <ResultCard label="Lump Sum (60%)" value={results.lumpSumAmount} icon={FiDollarSign} color="green" />
                <ResultCard label="Monthly Pension" value={results.monthlyPension} icon={FiTrendingUp} color="blue" />
                <ResultCard label="Total Contribution" value={results.totalContribution} icon={FiPieChart} color="purple" />
              </div>

              {/* chart */}
              {chartData && (
                <div className="glass-card p-6">
                  <h3 className="text-sm font-semibold text-dark-200 mb-4">Corpus Growth by Age</h3>
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
                      <th className="text-left px-6 py-3">Age</th>
                      <th className="text-right px-6 py-3">Yearly Contribution</th>
                      <th className="text-right px-6 py-3">Corpus</th>
                    </tr>
                  </thead>
                  <tbody>
                    {results.yearWiseBreakdown.map((row, i) => (
                      <tr
                        key={row.year}
                        className={`border-b border-white/5 ${i % 2 === 0 ? 'bg-dark-800/50' : ''}`}
                      >
                        <td className="px-6 py-3 text-white">{row.year}</td>
                        <td className="px-6 py-3 text-dark-200">{row.age}</td>
                        <td className="px-6 py-3 text-right text-dark-200">{formatCurrency(monthly * 12)}</td>
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

export default NPSCalculator;
