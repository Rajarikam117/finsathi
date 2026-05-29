/**
 * In-memory portfolio storage service.
 */

const DEFAULT_PORTFOLIO = {
  epf: {
    monthlyContribution: 5000,
    totalBalance: 250000
  },
  ppf: {
    annualContribution: 150000,
    totalBalance: 800000
  },
  nps: {
    monthlyContribution: 3000,
    totalBalance: 150000
  },
  sip: {
    monthlyAmount: 10000,
    totalValue: 600000
  }
};

// In-memory store
let portfolioData = null;

/**
 * Get the current portfolio. Returns sample defaults if no data has been saved.
 */
export function getPortfolio() {
  if (!portfolioData) {
    return { ...DEFAULT_PORTFOLIO };
  }
  return { ...portfolioData };
}

/**
 * Save portfolio data.
 * @param {Object} data - Portfolio data to save
 */
export function savePortfolio(data) {
  portfolioData = { ...data };
  return portfolioData;
}

/**
 * Get a summary of the portfolio with totals.
 */
export function getSummary() {
  const portfolio = getPortfolio();

  const totalInvested =
    (portfolio.epf?.monthlyContribution || 0) * 12 +
    (portfolio.ppf?.annualContribution || 0) +
    (portfolio.nps?.monthlyContribution || 0) * 12 +
    (portfolio.sip?.monthlyAmount || 0) * 12;

  const currentValue =
    (portfolio.epf?.totalBalance || 0) +
    (portfolio.ppf?.totalBalance || 0) +
    (portfolio.nps?.totalBalance || 0) +
    (portfolio.sip?.totalValue || 0);

  const totalReturns = currentValue - totalInvested;
  const returnsPercentage = totalInvested > 0
    ? Math.round((totalReturns / totalInvested) * 10000) / 100
    : 0;

  return {
    portfolio,
    summary: {
      totalInvested,
      currentValue,
      totalReturns,
      returnsPercentage,
      annualInvestment: totalInvested
    }
  };
}
