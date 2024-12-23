import { Transaction } from '../types';

interface PaymentCalculationResult {
  monthlyPayment: number;
  totalPayment: number;
  totalInterest: number;
  amortizationSchedule: MonthlyPayment[];
}

interface MonthlyPayment {
  month: number;
  payment: number;
  principal: number;
  interest: number;
  remainingBalance: number;
  checked?: boolean;
}

/**
 * Calculate regular credit payments with interest
 */
const calculateCredit = (
  principal: number,
  annualInterestRate: number,
  termInMonths: number
): PaymentCalculationResult => {
  // Convert annual interest rate to monthly
  const monthlyInterestRate = (annualInterestRate / 100) / 12;
  
  // Calculate monthly payment using the loan payment formula
  const monthlyPayment = (principal * monthlyInterestRate * Math.pow(1 + monthlyInterestRate, termInMonths)) / 
    (Math.pow(1 + monthlyInterestRate, termInMonths) - 1);

  // Generate amortization schedule
  const schedule: MonthlyPayment[] = [];
  let remainingBalance = principal;
  let totalInterest = 0;

  for (let month = 1; month <= termInMonths; month++) {
    const interest = remainingBalance * monthlyInterestRate;
    const principalPayment = monthlyPayment - interest;
    
    remainingBalance = Math.max(0, remainingBalance - principalPayment);
    totalInterest += interest;

    schedule.push({
      month,
      payment: monthlyPayment,
      principal: principalPayment,
      interest,
      remainingBalance,
    });
  }

  return {
    monthlyPayment,
    totalPayment: monthlyPayment * termInMonths,
    totalInterest,
    amortizationSchedule: schedule,
  };
};

/**
 * Calculate installment payments (usually 0% or low interest)
 */
const calculateInstallment = (
  amount: number,
  termInMonths: number,
  initialPayment: number = 0,
  insuranceCost: number = 0,
  annualInterestRate: number = 0,
  addInsuranceToMonthlyPayment: boolean = true
): PaymentCalculationResult => {
  // Calculate actual amount to be paid monthly
  const remainingAmount = amount - initialPayment;
  
  // Determine how insurance is handled
  const insuranceMonthly = addInsuranceToMonthlyPayment ? insuranceCost / termInMonths : 0;
  const totalInsuranceCost = addInsuranceToMonthlyPayment ? insuranceCost : 0;
  
  // Calculate base monthly payment without interest
  const baseMonthlyPayment = remainingAmount / termInMonths;
  
  // Add insurance to monthly payment if specified
  const baseMonthlyWithInsurance = baseMonthlyPayment + insuranceMonthly;
  
  // If there's interest (unusual for installment but possible)
  const monthlyInterestRate = (annualInterestRate / 100) / 12;
  
  const schedule: MonthlyPayment[] = [];
  let remainingBalance = remainingAmount + totalInsuranceCost;
  let totalInterest = 0;

  for (let month = 1; month <= termInMonths; month++) {
    const interest = remainingBalance * monthlyInterestRate;
    const monthlyPayment = baseMonthlyWithInsurance + interest;
    const principalPayment = baseMonthlyWithInsurance;
    
    remainingBalance = Math.max(0, remainingBalance - principalPayment);
    totalInterest += interest;

    schedule.push({
      month,
      payment: monthlyPayment,
      principal: principalPayment,
      interest,
      remainingBalance,
    });
  }

  const totalPayment = (baseMonthlyWithInsurance * termInMonths) + 
    initialPayment + 
    (addInsuranceToMonthlyPayment ? 0 : insuranceCost);

  return {
    monthlyPayment: baseMonthlyWithInsurance,
    totalPayment,
    totalInterest,
    amortizationSchedule: schedule,
  };
};

/**
 * Main calculation function that determines which type of calculation to use
 */
export const calculatePayments = (transaction: Partial<Transaction>) => {
  if (!transaction.amount || !transaction.loanTerm) return null;

  if (transaction.transactionType === 'installment') {
    return calculateInstallment(
      Math.abs(Number(transaction.amount)),
      Number(transaction.loanTerm),
      Number(transaction.initialPayment) || 0,
      transaction.hasInsurance ? Number(transaction.insuranceCost) || 0 : 0,
      Number(transaction.interestRate) || 0
    );
  } else {
    return calculateCredit(
      Math.abs(Number(transaction.amount)),
      Number(transaction.interestRate) || 0,
      Number(transaction.loanTerm)
    );
  }
};