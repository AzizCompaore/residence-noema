export const financingConfig = {
  annualInterestRate: 0.08,
  durationYears: 8,
  maxDebtRatio: 0.35,
  rentalIncomeRecognitionRate: 1,
  rentalOccupiedDays: 20,
  euroToFcfa: 655.957,
  structureShare: 0.2,
  propertyShare: 0.8,
  livingExpenses: 0
} as const;

export type FinancingPropertyType = 't2' | 't3';

export interface FinancingInput {
  propertyType: FinancingPropertyType;
  propertyPrice: number;
  downPayment: number;
  durationYears?: number;
  primaryIncome: number;
  additionalIncome?: number;
  coBorrowerIncome?: number;
  existingCreditPayments?: number;
  propertyCharges?: number;
  livingExpenses?: number;
  rentalIncomeRecognitionRate?: number;
}

export interface FinancingCalculation {
  financing: {
    propertyPrice: number;
    downPayment: number;
    borrowedAmount: number;
    annualInterestRate: number;
    durationYears: number;
    totalMonths: number;
    monthlyPayment: number;
  };
  rental: {
    occupiedDays: number;
    dailyRateEur: number;
    grossIncomeEur: number;
    grossIncomeFcfa: number;
    structureShareEur: number;
    structureShareFcfa: number;
    ownerIncomeEur: number;
    ownerIncomeFcfa: number;
    recognitionRate: number;
    recognizedIncomeFcfa: number;
    propertyCharges: number;
    cashFlow: number;
    effort: number;
  };
  solvency: {
    personalIncome: number;
    retainedIncome: number;
    existingCreditPayments: number;
    totalCommitments: number;
    debtRatio: number;
    threshold: number;
    remainingIncome: number;
    livingExpenses: number;
    minimumIncomeRequired: number;
    debtRatioGap: number;
    status: 'not_evaluable' | 'within_threshold' | 'above_threshold';
  };
}

export const rentalDailyRateEur = (propertyType: FinancingPropertyType): number => propertyType === 't3' ? 100 : 60;

export function calculateFinancing(input: FinancingInput): FinancingCalculation {
  const propertyPrice = Math.max(0, Number(input.propertyPrice) || 0);
  const downPayment = Math.min(propertyPrice, Math.max(0, Number(input.downPayment) || 0));
  const borrowedAmount = Math.max(0, propertyPrice - downPayment);
  const requestedDurationYears = Number(input.durationYears ?? financingConfig.durationYears);
  const durationYears = Number.isFinite(requestedDurationYears)
    ? Math.min(financingConfig.durationYears, Math.max(1, Math.floor(requestedDurationYears)))
    : financingConfig.durationYears;
  const totalMonths = durationYears * 12;
  const monthlyRate = financingConfig.annualInterestRate / 12;
  const growth = Math.pow(1 + monthlyRate, totalMonths);
  const monthlyPayment = borrowedAmount === 0
    ? 0
    : Math.round(borrowedAmount * (monthlyRate * growth) / (growth - 1));

  const occupiedDays = financingConfig.rentalOccupiedDays;
  const dailyRateEur = rentalDailyRateEur(input.propertyType);
  const grossIncomeEur = occupiedDays * dailyRateEur;
  const structureShareEur = grossIncomeEur * financingConfig.structureShare;
  const ownerIncomeEur = grossIncomeEur * financingConfig.propertyShare;
  const grossIncomeFcfa = grossIncomeEur * financingConfig.euroToFcfa;
  const structureShareFcfa = structureShareEur * financingConfig.euroToFcfa;
  const ownerIncomeFcfa = ownerIncomeEur * financingConfig.euroToFcfa;
  const requestedRecognitionRate = Number(input.rentalIncomeRecognitionRate ?? financingConfig.rentalIncomeRecognitionRate);
  const recognitionRate = Number.isFinite(requestedRecognitionRate)
    ? Math.min(1, Math.max(0, requestedRecognitionRate))
    : financingConfig.rentalIncomeRecognitionRate;
  const recognizedIncomeFcfa = ownerIncomeFcfa * recognitionRate;
  const propertyCharges = Math.max(0, Number(input.propertyCharges || 0));
  const cashFlow = ownerIncomeFcfa - monthlyPayment - propertyCharges;
  const effort = Math.max(0, monthlyPayment - ownerIncomeFcfa);

  const personalIncome = Math.max(0, Number(input.primaryIncome) || 0)
    + Math.max(0, Number(input.additionalIncome) || 0)
    + Math.max(0, Number(input.coBorrowerIncome) || 0);
  const existingCreditPayments = Math.max(0, Number(input.existingCreditPayments) || 0);
  const retainedIncome = personalIncome + recognizedIncomeFcfa;
  const totalCommitments = monthlyPayment + existingCreditPayments;
  const debtRatio = retainedIncome > 0 ? (totalCommitments / retainedIncome) * 100 : 0;
  const minimumIncomeRequired = totalCommitments / financingConfig.maxDebtRatio;
  const debtRatioGap = Math.max(0, debtRatio - financingConfig.maxDebtRatio * 100);
  const livingExpenses = Math.max(0, Number(input.livingExpenses === undefined ? financingConfig.livingExpenses : input.livingExpenses) || 0);
  const remainingIncome = retainedIncome - totalCommitments - livingExpenses;
  const status = retainedIncome <= 0
    ? 'not_evaluable'
    : debtRatio <= financingConfig.maxDebtRatio * 100
      ? 'within_threshold'
      : 'above_threshold';

  return {
    financing: {
      propertyPrice,
      downPayment,
      borrowedAmount,
      annualInterestRate: financingConfig.annualInterestRate,
      durationYears,
      totalMonths,
      monthlyPayment
    },
    rental: {
      occupiedDays,
      dailyRateEur,
      grossIncomeEur,
      grossIncomeFcfa,
      structureShareEur,
      structureShareFcfa,
      ownerIncomeEur,
      ownerIncomeFcfa,
      recognitionRate,
      recognizedIncomeFcfa,
      propertyCharges,
      cashFlow,
      effort
    },
    solvency: {
      personalIncome,
      retainedIncome,
      existingCreditPayments,
      totalCommitments,
      debtRatio,
      threshold: financingConfig.maxDebtRatio * 100,
      remainingIncome,
      livingExpenses,
      minimumIncomeRequired,
      debtRatioGap,
      status
    }
  };
}
