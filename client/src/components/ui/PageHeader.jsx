import { motion } from 'framer-motion';

const accentGradients = {
  purple: 'from-primary-500 to-primary-600',
  green: 'from-accent-400 to-accent-500',
  blue: 'from-blue-400 to-blue-600',
};

const PageHeader = ({ title, subtitle, icon: Icon, accentColor = 'purple' }) => {
  const gradient = accentGradients[accentColor] || accentGradients.purple;

  return (
    <motion.div
      className="mb-8"
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, ease: 'easeOut' }}
    >
      <div className="flex items-center gap-4 mb-3">
        {Icon && (
          <div
            className={`w-12 h-12 rounded-xl bg-gradient-to-br ${gradient} flex items-center justify-center shadow-lg`}
          >
            <Icon className="w-6 h-6 text-white" />
          </div>
        )}
        <div>
          <h1 className="text-3xl font-bold gradient-text">{title}</h1>
          {subtitle && (
            <p className="text-dark-200 mt-1 text-sm">{subtitle}</p>
          )}
        </div>
      </div>
    </motion.div>
  );
};

export default PageHeader;
