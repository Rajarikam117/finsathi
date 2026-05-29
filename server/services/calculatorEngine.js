/**
 * FinSathi Calculator Engine
 * Accurate Indian financial formulas for EPF, PPF, NPS, and SIP calculations.
 */

/**
 * EPF (Employee Provident Fund) Calculator
 *
 * - Employee contributes 12% of (Basic + DA) to EPF
 * - Employer contributes 3.67% to EPF, 8.33% to EPS
 * - Default EPF interest rate: 8.25% (2024-25)
 * - Compounded monthly
 */
export function calculateEPF({
  basicSalary,
  dearnessAllowance = 0,
  employeeContributionRate = 12,
  years,
  currentAge = 25,
  annualSalaryIncrement = 5,
  interestRate = 8.25
}) {
  const monthlyRate = interestRate / 100 / 12;
  const employerEPFRate = 3.67;
  const employerEPSRate = 8.33;

  let totalEmployeeContribution = 0;
  let totalEmployerContribution = 0;
  let totalInterest = 0;
  let balance = 0;
  const yearWiseBreakdown = [];

  let currentBasic = basicSalary;
  let currentDA = dearnessAllowance;

  for (let year = 1; year <= years; year++) {
    let yearlyEmployeeContribution = 0;
    let yearlyEmployerContribution = 0;
    let yearlyInterest = 0;

    const monthlySalary = currentBasic + currentDA;
    const monthlyEmployeeContrib = (monthlySalary * employeeContributionRate) / 100;
    const monthlyEmployerEPFContrib = (monthlySalary * employerEPFRate) / 100;

    for (let month = 1; month <= 12; month++) {
      // Add contributions
      balance += monthlyEmployeeContrib + monthlyEmployerEPFContrib;
      yearlyEmployeeContribution += monthlyEmployeeContrib;
      yearlyEmployerContribution += monthlyEmployerEPFContrib;

      // Calculate monthly interest on running balance
      const monthInterest = balance * monthlyRate;
      balance += monthInterest;
      yearlyInterest += monthInterest;
    }

    totalEmployeeContribution += yearlyEmployeeContribution;
    totalEmployerContribution += yearlyEmployerContribution;
    totalInterest += yearlyInterest;

    yearWiseBreakdown.push({
      year,
      age: currentAge + year,
      balance: Math.round(balance),
      interest: Math.round(yearlyInterest),
      employeeContribution: Math.round(yearlyEmployeeContribution),
      employerContribution: Math.round(yearlyEmployerContribution),
      totalContribution: Math.round(yearlyEmployeeContribution + yearlyEmployerContribution)
    });

    // Annual salary increment
    currentBasic *= (1 + annualSalaryIncrement / 100);
    currentDA *= (1 + annualSalaryIncrement / 100);
  }

  return {
    totalEmployeeContribution: Math.round(totalEmployeeContribution),
    totalEmployerContribution: Math.round(totalEmployerContribution),
    totalInterest: Math.round(totalInterest),
    maturityAmount: Math.round(balance),
    retirementAge: currentAge + years,
    yearWiseBreakdown
  };
}

/**
 * PPF (Public Provident Fund) Calculator
 *
 * - Default rate: 7.1%
 * - Min tenure: 15 years, extendable in 5-year blocks
 * - Max annual investment: ₹1,50,000
 * - Compounded annually
 */
export function calculatePPF({
  annualInvestment,
  tenure = 15,
  interestRate = 7.1
}) {
  // Cap at maximum allowed investment
  const cappedInvestment = Math.min(annualInvestment, 150000);
  const rate = interestRate / 100;

  let totalInvested = 0;
  let totalInterest = 0;
  let balance = 0;
  const yearWiseBreakdown = [];

  for (let year = 1; year <= tenure; year++) {
    // Investment added at beginning of year
    balance += cappedInvestment;
    totalInvested += cappedInvestment;

    // Interest calculated on balance at end of year
    const yearInterest = balance * rate;
    balance += yearInterest;
    totalInterest += yearInterest;

    yearWiseBreakdown.push({
      year,
      investment: cappedInvestment,
      interest: Math.round(yearInterest),
      balance: Math.round(balance)
    });
  }

  return {
    totalInvested: Math.round(totalInvested),
    totalInterest: Math.round(totalInterest),
    maturityAmount: Math.round(balance),
    effectiveAnnualInvestment: cappedInvestment,
    tenure,
    yearWiseBreakdown
  };
}

/**
 * NPS (National Pension System) Calculator
 *
 * - Default returns: Equity 12%, Corporate Debt 8%, Govt Bonds 9%
 * - At maturity: 60% lump sum (tax-free), 40% annuity
 * - Annuity rate: ~6%
 */
export function calculateNPS({
  monthlyContribution,
  equityAllocation = 50,
  corporateDebtAllocation = 30,
  governmentBondAllocation = 20,
  currentAge = 30,
  retirementAge = 60,
  expectedEquityReturn = 12,
  expectedDebtReturn = 8,
  expectedGovtReturn = 9
}) {
  const years = retirementAge - currentAge;
  const annuityRate = 6;

  // Weighted average return
  const weightedReturn =
    (equityAllocation * expectedEquityReturn +
      corporateDebtAllocation * expectedDebtReturn +
      governmentBondAllocation * expectedGovtReturn) / 100;

  const monthlyRate = weightedReturn / 100 / 12;
  const totalMonths = years * 12;

  let totalContribution = 0;
  let balance = 0;
  const yearWiseBreakdown = [];

  for (let year = 1; year <= years; year++) {
    let yearlyContribution = 0;

    for (let month = 1; month <= 12; month++) {
      balance += monthlyContribution;
      yearlyContribution += monthlyContribution;

      // Monthly compounding
      const monthInterest = balance * monthlyRate;
      balance += monthInterest;
    }

    totalContribution += yearlyContribution;

    yearWiseBreakdown.push({
      year,
      age: currentAge + year,
      contribution: Math.round(yearlyContribution),
      balance: Math.round(balance)
    });
  }

  const totalCorpus = Math.round(balance);
  const lumpSumAmount = Math.round(totalCorpus * 0.60);
  const annuityCorpus = Math.round(totalCorpus * 0.40);
  const monthlyPension = Math.round((annuityCorpus * (annuityRate / 100)) / 12);

  return {
    totalContribution: Math.round(totalContribution),
    totalCorpus,
    lumpSumAmount,
    annuityCorpus,
    monthlyPension,
    weightedReturn: Math.round(weightedReturn * 100) / 100,
    yearsToRetirement: years,
    yearWiseBreakdown
  };
}

/**
 * SIP (Systematic Investment Plan) Calculator
 *
 * Standard SIP: FV = P × [((1+r)^n - 1) / r] × (1+r)
 * Step-up SIP: monthly contribution increases by stepUpPercentage annually
 */
export function calculateSIP({
  monthlyInvestment,
  expectedReturnRate = 12,
  tenureYears = 10,
  stepUpPercentage = 0
}) {
  const monthlyRate = expectedReturnRate / 100 / 12;
  const totalMonths = tenureYears * 12;

  let totalInvested = 0;
  let balance = 0;
  let currentMonthlyInvestment = monthlyInvestment;
  const yearWiseBreakdown = [];

  for (let year = 1; year <= tenureYears; year++) {
    let yearlyInvestment = 0;

    for (let month = 1; month <= 12; month++) {
      balance += currentMonthlyInvestment;
      yearlyInvestment += currentMonthlyInvestment;

      // Monthly compounding
      balance *= (1 + monthlyRate);
    }

    totalInvested += yearlyInvestment;

    yearWiseBreakdown.push({
      year,
      monthlyInvestment: Math.round(currentMonthlyInvestment),
      yearlyInvestment: Math.round(yearlyInvestment),
      totalInvested: Math.round(totalInvested),
      futureValue: Math.round(balance)
    });

    // Step-up: increase monthly investment annually
    if (stepUpPercentage > 0) {
      currentMonthlyInvestment *= (1 + stepUpPercentage / 100);
    }
  }

  const futureValue = Math.round(balance);
  const wealthGained = futureValue - Math.round(totalInvested);

  return {
    totalInvested: Math.round(totalInvested),
    totalReturns: wealthGained,
    futureValue,
    wealthGained,
    absoluteReturns: Math.round((wealthGained / totalInvested) * 10000) / 100,
    yearWiseBreakdown
  };
}
