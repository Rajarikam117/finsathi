import { motion } from 'framer-motion';
import { FiTrendingUp, FiTrendingDown } from 'react-icons/fi';
import { formatLakhs } from '../../utils/formatters';

const colorMap = {
  purple: {
    bg: 'bg-primary-500/10',
    text: 'text-primary-400',
    border: 'border-primary-500/20',
    glow: 'shadow-[0_0_20px_rgba(139,92,246,0.15)]',
  },
  green: {
    bg: 'bg-accent-400/10',
    text: 'text-accent-400',
    border: 'border-accent-400/20',
    glow: 'shadow-[0_0_20px_rgba(52,211,153,0.15)]',
  },
  blue: {
    bg: 'bg-blue-500/10',
    text: 'text-blue-400',
    border: 'border-blue-500/20',
    glow: 'shadow-[0_0_20px_rgba(59,130,246,0.15)]',
  },
};

const ResultCard = ({
  label,
  value,
  icon: Icon,
  trend,
  color = 'purple',
}) => {
  const scheme = colorMap[color] || colorMap.purple;
  const isNumeric = typeof value === 'number';
  const displayValue = isNumeric ? formatLakhs(value) : value;

  return (
    <motion.div
      className={`glass-card p-5 border ${scheme.border} ${scheme.glow}`}
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.4, ease: 'easeOut' }}
    >
      <div className="flex items-start justify-between">
        <div className="flex-1">
          <p className="text-xs font-medium text-dark-200 uppercase tracking-wider mb-2">
            {label}
          </p>
          <p
            className={`text-2xl font-bold ${scheme.text}`}
            style={{ fontVariantNumeric: 'tabular-nums' }}
          >
            {displayValue}
          </p>
        </div>

        <div className="flex flex-col items-end gap-2">
          {Icon && (
            <div
              className={`w-10 h-10 rounded-xl ${scheme.bg} flex items-center justify-center`}
            >
              <Icon className={`w-5 h-5 ${scheme.text}`} />
            </div>
          )}

          {trend && (
            <div
              className={`flex items-center gap-1 text-xs font-medium ${
                trend === 'up' ? 'text-green-400' : 'text-red-400'
              }`}
            >
              {trend === 'up' ? (
                <FiTrendingUp className="w-3.5 h-3.5" />
              ) : (
                <FiTrendingDown className="w-3.5 h-3.5" />
              )}
              <span>{trend === 'up' ? 'Up' : 'Down'}</span>
            </div>
          )}
        </div>
      </div>
    </motion.div>
  );
};

export default ResultCard;
