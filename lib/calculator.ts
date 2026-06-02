import { getLocalStates, getLocalBanks } from './data';

export interface OnRoadPriceBreakdown {
  exShowroom: number;
  roadTax: number;
  insurance: number;
  tcs: number;
  fastag: number;
  handling: number;
  onRoadPrice: number;
}

export interface AmortizationPeriod {
  period: number; // Month or Year index
  payment: number;
  principalPaid: number;
  interestPaid: number;
  balanceRemaining: number;
}

export interface EligibilityResult {
  maxEmi: number;
  maxLoanAmount: number;
  eligible: boolean;
  reason: string;
  recommendedDownPayment: number;
}

/**
 * Calculates monthly EMI based on reducing balance method
 */
export function calculateEMI(principal: number, annualRate: number, tenureYears: number): number {
  if (principal <= 0 || annualRate <= 0 || tenureYears <= 0) return 0;
  
  const monthlyRate = annualRate / 12 / 100;
  const totalMonths = tenureYears * 12;
  
  const emi = (principal * monthlyRate * Math.pow(1 + monthlyRate, totalMonths)) / 
              (Math.pow(1 + monthlyRate, totalMonths) - 1);
              
  return Math.round(emi);
}

/**
 * Dynamic State-specific On-road price breakdown
 */
export function calculateOnRoadPrice(
  exShowroom: number,
  stateCode: string,
  fuelType: string
): OnRoadPriceBreakdown {
  const statesList = getLocalStates();
  const state = statesList.find((s) => s.code === stateCode) || statesList[0];
  const isEV = fuelType.toLowerCase() === 'electric';
  const isHybrid = fuelType.toLowerCase() === 'hybrid';
  const isDiesel = fuelType.toLowerCase() === 'diesel';
  
  let roadTaxRate = state.roadTaxPetrol;
  if (isEV) {
    roadTaxRate = state.roadTaxEV;
  } else if (isHybrid) {
    roadTaxRate = state.roadTaxHybrid;
  } else if (isDiesel) {
    roadTaxRate = state.roadTaxDiesel;
  }
  
  const roadTax = Math.round(exShowroom * (roadTaxRate / 100));
  const insurance = Math.round(exShowroom * (state.insurancePct / 100));
  const tcs = exShowroom > 1000000 ? Math.round(exShowroom * (state.tcsPct / 100)) : 0;
  const registration = state.registrationFlat;
  const fastag = state.fastagCharges;
  const handling = state.handlingCharges;
  
  const onRoadPrice = exShowroom + roadTax + insurance + tcs + registration + fastag + handling;
  
  return {
    exShowroom,
    roadTax,
    insurance,
    tcs,
    fastag: fastag + registration, // Combine Fastag & registration for UI simplicity
    handling,
    onRoadPrice
  };
}

/**
 * Generates monthly amortization schedule
 */
export function generateMonthlyAmortization(
  principal: number,
  annualRate: number,
  tenureYears: number
): AmortizationPeriod[] {
  const schedule: AmortizationPeriod[] = [];
  if (principal <= 0 || annualRate <= 0 || tenureYears <= 0) return schedule;
  
  const monthlyRate = annualRate / 12 / 100;
  const totalMonths = tenureYears * 12;
  const emi = calculateEMI(principal, annualRate, tenureYears);
  
  let balance = principal;
  
  for (let m = 1; m <= totalMonths; m++) {
    const interest = balance * monthlyRate;
    const principalPaid = emi - interest;
    balance = Math.max(0, balance - principalPaid);
    
    schedule.push({
      period: m,
      payment: emi,
      principalPaid: Math.round(principalPaid),
      interestPaid: Math.round(interest),
      balanceRemaining: Math.round(balance)
    });
    
    if (balance <= 0) break;
  }
  
  return schedule;
}

/**
 * Aggregates monthly amortization schedule into a yearly view
 */
export function generateYearlyAmortization(
  principal: number,
  annualRate: number,
  tenureYears: number
): AmortizationPeriod[] {
  const monthly = generateMonthlyAmortization(principal, annualRate, tenureYears);
  const yearly: AmortizationPeriod[] = [];
  
  for (let y = 1; y <= tenureYears; y++) {
    const monthStart = (y - 1) * 12;
    const monthEnd = Math.min(y * 12, monthly.length);
    const yearSlice = monthly.slice(monthStart, monthEnd);
    
    if (yearSlice.length === 0) break;
    
    const principalPaid = yearSlice.reduce((sum, m) => sum + m.principalPaid, 0);
    const interestPaid = yearSlice.reduce((sum, m) => sum + m.interestPaid, 0);
    const payment = yearSlice.reduce((sum, m) => sum + m.payment, 0);
    const balanceRemaining = yearSlice[yearSlice.length - 1].balanceRemaining;
    
    yearly.push({
      period: y,
      payment,
      principalPaid,
      interestPaid,
      balanceRemaining
    });
  }
  
  return yearly;
}

/**
 * EMI Eligibility / Affordability Checker
 */
export function checkEligibility(
  monthlyIncome: number,
  existingEmi: number,
  creditScore: number,
  carOnRoadPrice: number
): EligibilityResult {
  if (monthlyIncome <= 0) {
    return {
      maxEmi: 0,
      maxLoanAmount: 0,
      eligible: false,
      reason: 'Monthly income must be greater than zero.',
      recommendedDownPayment: carOnRoadPrice
    };
  }
  
  // Factor of income that can go towards EMI based on credit score
  let factor = 0.35;
  if (creditScore >= 750) factor = 0.50;
  else if (creditScore >= 650) factor = 0.40;
  else factor = 0.25;
  
  const maxEmi = Math.max(0, Math.round(monthlyIncome * factor) - existingEmi);
  
  // Calculate max loan using average interest rate of 9.0% over 5 years (60 months)
  const rate = 9.0;
  const tenureYears = 5;
  const r = rate / 12 / 100;
  const n = tenureYears * 12;
  
  // Formula for loan amount based on EMI: P = emi * ((1+r)^n - 1) / (r * (1+r)^n)
  let maxLoanAmount = 0;
  if (maxEmi > 0) {
    maxLoanAmount = Math.round(
      (maxEmi * (Math.pow(1 + r, n) - 1)) / (r * Math.pow(1 + r, n))
    );
  }
  
  const minRequiredDownpayment = carOnRoadPrice * 0.15; // 15% min downpayment
  const requiredLoan = carOnRoadPrice - minRequiredDownpayment;
  
  let eligible = false;
  let reason = '';
  let recommendedDownPayment = minRequiredDownpayment;
  
  if (maxLoanAmount >= requiredLoan) {
    eligible = true;
    reason = 'Congratulations! You are eligible for this car purchase with our standard down payment (15-20%).';
    recommendedDownPayment = Math.round(carOnRoadPrice * 0.20);
  } else if (maxLoanAmount > 0) {
    eligible = true;
    reason = `Based on your budget, we recommend a higher down payment of ₹${(Math.round(carOnRoadPrice - maxLoanAmount)).toLocaleString('en-IN')} to qualify for the loan.`;
    recommendedDownPayment = Math.round(carOnRoadPrice - maxLoanAmount);
  } else {
    eligible = false;
    reason = 'Your current monthly liabilities are too high relative to your income. We recommend reducing existing debts first.';
    recommendedDownPayment = carOnRoadPrice;
  }
  
  return {
    maxEmi,
    maxLoanAmount,
    eligible,
    reason,
    recommendedDownPayment: Math.max(minRequiredDownpayment, recommendedDownPayment)
  };
}

/**
 * Bank wise comparison engine
 */
export interface BankComparisonResult {
  bankId: string;
  bankName: string;
  logo: string;
  interestRate: number;
  monthlyEmi: number;
  processingFee: number;
  totalInterest: number;
  totalRepayment: number;
}

export function compareBanks(loanAmount: number, tenureYears: number): BankComparisonResult[] {
  const banksList = getLocalBanks();
  return banksList.map((bank) => {
    const emi = calculateEMI(loanAmount, bank.interestRate, tenureYears);
    const totalRepayment = emi * tenureYears * 12;
    const totalInterest = totalRepayment - loanAmount;
    const processingFee = Math.min(
      bank.processingFeeMax,
      Math.round(loanAmount * (bank.processingFeePct / 100))
    );
    
    return {
      bankId: bank.id,
      bankName: bank.name,
      logo: bank.logo,
      interestRate: bank.interestRate,
      monthlyEmi: emi,
      processingFee,
      totalInterest,
      totalRepayment
    };
  });
}
