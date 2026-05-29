import { motion } from 'framer-motion';

const GlassCard = ({ children, className = '', hover = true, onClick }) => {
  const baseClass = hover ? 'glass-card-hover' : 'glass-card';

  return (
    <motion.div
      className={`${baseClass} p-6 ${className}`}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, ease: 'easeOut' }}
      whileHover={hover ? { scale: 1.01 } : undefined}
      onClick={onClick}
      style={onClick ? { cursor: 'pointer' } : undefined}
    >
      {children}
    </motion.div>
  );
};

export default GlassCard;
