import { motion } from 'framer-motion';

const LoadingSpinner = ({ text = '' }) => {
  return (
    <div className="flex flex-col items-center justify-center py-16">
      {/* Outer spinning ring */}
      <div className="relative w-14 h-14">
        <motion.div
          className="absolute inset-0 rounded-full"
          style={{
            background:
              'conic-gradient(from 0deg, transparent 0%, #8b5cf6 40%, #06d6a0 70%, transparent 100%)',
            padding: '3px',
            WebkitMask:
              'radial-gradient(farthest-side, transparent calc(100% - 3px), #000 calc(100% - 3px))',
            mask:
              'radial-gradient(farthest-side, transparent calc(100% - 3px), #000 calc(100% - 3px))',
          }}
          animate={{ rotate: 360 }}
          transition={{
            duration: 1.2,
            repeat: Infinity,
            ease: 'linear',
          }}
        />

        {/* Inner glow dot */}
        <motion.div
          className="absolute top-1/2 left-1/2 w-2 h-2 -translate-x-1/2 -translate-y-1/2 rounded-full bg-primary-400"
          animate={{ opacity: [0.4, 1, 0.4] }}
          transition={{
            duration: 1.5,
            repeat: Infinity,
            ease: 'easeInOut',
          }}
        />
      </div>

      {/* Optional text */}
      {text && (
        <motion.p
          className="mt-4 text-sm text-dark-200"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3 }}
        >
          {text}
        </motion.p>
      )}
    </div>
  );
};

export default LoadingSpinner;
