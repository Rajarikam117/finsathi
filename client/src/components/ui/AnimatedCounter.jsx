import { useState, useEffect, useRef } from 'react';

const easeOutExpo = (t) => (t === 1 ? 1 : 1 - Math.pow(2, -10 * t));

const AnimatedCounter = ({
  end,
  duration = 2,
  prefix = '₹',
  suffix = '',
  decimals = 0,
}) => {
  const [displayValue, setDisplayValue] = useState('0');
  const rafRef = useRef(null);
  const startTimeRef = useRef(null);

  useEffect(() => {
    if (end === undefined || end === null) return;

    const durationMs = duration * 1000;
    startTimeRef.current = null;

    const animate = (timestamp) => {
      if (!startTimeRef.current) startTimeRef.current = timestamp;
      const elapsed = timestamp - startTimeRef.current;
      const progress = Math.min(elapsed / durationMs, 1);
      const easedProgress = easeOutExpo(progress);
      const currentValue = easedProgress * end;

      setDisplayValue(
        new Intl.NumberFormat('en-IN', {
          minimumFractionDigits: decimals,
          maximumFractionDigits: decimals,
        }).format(currentValue)
      );

      if (progress < 1) {
        rafRef.current = requestAnimationFrame(animate);
      }
    };

    rafRef.current = requestAnimationFrame(animate);

    return () => {
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
    };
  }, [end, duration, decimals]);

  return (
    <span style={{ fontVariantNumeric: 'tabular-nums' }}>
      {prefix}
      {displayValue}
      {suffix}
    </span>
  );
};

export default AnimatedCounter;
