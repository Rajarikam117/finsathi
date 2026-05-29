import { useMemo } from 'react';

const InputSlider = ({
  label,
  min = 0,
  max = 100,
  step = 1,
  value,
  onChange,
  prefix = '₹',
  suffix = '',
  formatValue,
}) => {
  const progress = useMemo(() => {
    return ((value - min) / (max - min)) * 100;
  }, [value, min, max]);

  const formattedValue = formatValue
    ? formatValue(value)
    : `${prefix}${new Intl.NumberFormat('en-IN').format(value)}${suffix}`;

  const sliderStyles = {
    WebkitAppearance: 'none',
    appearance: 'none',
    width: '100%',
    height: '6px',
    background: `linear-gradient(to right, #8b5cf6 0%, #8b5cf6 ${progress}%, #1e293b ${progress}%, #1e293b 100%)`,
    borderRadius: '3px',
    outline: 'none',
    cursor: 'pointer',
  };

  return (
    <div className="mb-6">
      {/* Label and Value Row */}
      <div className="flex items-center justify-between mb-3">
        <label className="text-sm font-medium text-dark-200">{label}</label>
        <span className="text-sm font-semibold text-white bg-surface/80 px-3 py-1 rounded-lg border border-white/10">
          {formattedValue}
        </span>
      </div>

      {/* Slider */}
      <div className="relative">
        <input
          type="range"
          min={min}
          max={max}
          step={step}
          value={value}
          onChange={(e) => onChange(Number(e.target.value))}
          className="slider-input"
          style={sliderStyles}
        />
      </div>

      {/* Min / Max labels */}
      <div className="flex justify-between mt-1.5">
        <span className="text-xs text-dark-200/60">
          {prefix}{new Intl.NumberFormat('en-IN').format(min)}{suffix}
        </span>
        <span className="text-xs text-dark-200/60">
          {prefix}{new Intl.NumberFormat('en-IN').format(max)}{suffix}
        </span>
      </div>

      {/* Inline styles for custom thumb */}
      <style>{`
        .slider-input::-webkit-slider-thumb {
          -webkit-appearance: none;
          width: 20px;
          height: 20px;
          background: #8b5cf6;
          border-radius: 50%;
          cursor: pointer;
          box-shadow: 0 0 10px rgba(139, 92, 246, 0.5);
          border: 2px solid rgba(255, 255, 255, 0.2);
          transition: box-shadow 0.2s ease;
        }
        .slider-input::-webkit-slider-thumb:hover {
          box-shadow: 0 0 18px rgba(139, 92, 246, 0.7);
          transform: scale(1.1);
        }
        .slider-input::-moz-range-thumb {
          width: 20px;
          height: 20px;
          background: #8b5cf6;
          border-radius: 50%;
          cursor: pointer;
          box-shadow: 0 0 10px rgba(139, 92, 246, 0.5);
          border: 2px solid rgba(255, 255, 255, 0.2);
        }
        .slider-input::-moz-range-track {
          height: 6px;
          border-radius: 3px;
        }
      `}</style>
    </div>
  );
};

export default InputSlider;
