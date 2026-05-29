import { Router } from 'express';
import {
  calculateEPF,
  calculatePPF,
  calculateNPS,
  calculateSIP
} from '../services/calculatorEngine.js';

const router = Router();

/**
 * POST /api/calculate/epf
 * Calculate EPF maturity amount
 *
 * Accepts both canonical names (basicSalary, dearnessAllowance, etc.)
 * and the short names the frontend uses (da, employeeRate, increment).
 */
router.post('/epf', (req, res) => {
  try {
    const body = req.body;
    const basicSalary = Number(body.basicSalary || 0);
    const years = Number(body.years || 0);

    if (!basicSalary || !years) {
      return res.status(400).json({
        error: true,
        message: 'Missing required parameters: basicSalary and years are required'
      });
    }

    if (basicSalary <= 0 || years <= 0) {
      return res.status(400).json({
        error: true,
        message: 'basicSalary and years must be positive numbers'
      });
    }

    const result = calculateEPF({
      basicSalary,
      dearnessAllowance: Number(body.dearnessAllowance ?? body.da ?? 0),
      employeeContributionRate: Number(body.employeeContributionRate ?? body.employeeRate ?? 12),
      years,
      currentAge: Number(body.currentAge || 25),
      annualSalaryIncrement: Number(body.annualSalaryIncrement ?? body.increment ?? 5),
      interestRate: Number(body.interestRate || 8.25)
    });

    // Add contribution alias for frontend compatibility
    result.yearWiseBreakdown = result.yearWiseBreakdown.map(row => ({
      ...row,
      contribution: row.totalContribution ?? row.contribution
    }));

    res.json(result);
  } catch (error) {
    res.status(500).json({ error: true, message: error.message });
  }
});

/**
 * POST /api/calculate/ppf
 * Calculate PPF maturity amount
 */
router.post('/ppf', (req, res) => {
  try {
    const body = req.body;
    const annualInvestment = Number(body.annualInvestment || 0);

    if (!annualInvestment) {
      return res.status(400).json({
        error: true,
        message: 'Missing required parameter: annualInvestment is required'
      });
    }

    if (annualInvestment <= 0) {
      return res.status(400).json({
        error: true,
        message: 'annualInvestment must be a positive number'
      });
    }

    const result = calculatePPF({
      annualInvestment,
      tenure: Number(body.tenure || 15),
      interestRate: Number(body.interestRate || 7.1)
    });

    // Add contribution alias for frontend compatibility
    result.yearWiseBreakdown = result.yearWiseBreakdown.map(row => ({
      ...row,
      contribution: row.investment ?? row.contribution
    }));

    res.json(result);
  } catch (error) {
    res.status(500).json({ error: true, message: error.message });
  }
});

/**
 * POST /api/calculate/nps
 * Calculate NPS corpus and pension
 *
 * Accepts both canonical names and the short names the frontend uses.
 */
router.post('/nps', (req, res) => {
  try {
    const body = req.body;
    const monthlyContribution = Number(body.monthlyContribution ?? body.monthly ?? 0);

    if (!monthlyContribution) {
      return res.status(400).json({
        error: true,
        message: 'Missing required parameter: monthlyContribution (or monthly) is required'
      });
    }

    if (monthlyContribution <= 0) {
      return res.status(400).json({
        error: true,
        message: 'monthlyContribution must be a positive number'
      });
    }

    const result = calculateNPS({
      monthlyContribution,
      equityAllocation: Number(body.equityAllocation ?? body.eqAlloc ?? 50),
      corporateDebtAllocation: Number(body.corporateDebtAllocation ?? body.cdAlloc ?? 30),
      governmentBondAllocation: Number(body.governmentBondAllocation ?? body.gbAlloc ?? 20),
      currentAge: Number(body.currentAge || 30),
      retirementAge: Number(body.retirementAge ?? body.retireAge ?? 60),
      expectedEquityReturn: Number(body.expectedEquityReturn ?? body.eqReturn ?? 12),
      expectedDebtReturn: Number(body.expectedDebtReturn ?? body.cdReturn ?? 8),
      expectedGovtReturn: Number(body.expectedGovtReturn ?? body.gbReturn ?? 9)
    });

    res.json(result);
  } catch (error) {
    res.status(500).json({ error: true, message: error.message });
  }
});

/**
 * POST /api/calculate/sip
 * Calculate SIP returns with optional step-up
 *
 * Accepts both canonical names and the short names the frontend uses.
 */
router.post('/sip', (req, res) => {
  try {
    const body = req.body;
    const monthlyInvestment = Number(body.monthlyInvestment ?? body.monthly ?? 0);

    if (!monthlyInvestment) {
      return res.status(400).json({
        error: true,
        message: 'Missing required parameter: monthlyInvestment (or monthly) is required'
      });
    }

    if (monthlyInvestment <= 0) {
      return res.status(400).json({
        error: true,
        message: 'monthlyInvestment must be a positive number'
      });
    }

    const result = calculateSIP({
      monthlyInvestment,
      expectedReturnRate: Number(body.expectedReturnRate ?? body.returnRate ?? 12),
      tenureYears: Number(body.tenureYears ?? body.tenure ?? 10),
      stepUpPercentage: Number(body.stepUpPercentage ?? body.stepUp ?? 0)
    });

    // Add balance/invested fields to yearWiseBreakdown for frontend compatibility
    result.yearWiseBreakdown = result.yearWiseBreakdown.map(row => ({
      ...row,
      balance: row.futureValue ?? row.balance,
      invested: row.totalInvested ?? row.invested
    }));

    res.json(result);
  } catch (error) {
    res.status(500).json({ error: true, message: error.message });
  }
});

export default router;
