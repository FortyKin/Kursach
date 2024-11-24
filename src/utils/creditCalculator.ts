import { CreditCalculation } from "../types";
export const calculateCredit = (
    principal: number,
    annualInterestRate: number,
    termInMonths: number
  ): CreditCalculation => {
    const monthlyRate = annualInterestRate / 100 / 12;
    const monthlyPayment = 
      (principal * monthlyRate * Math.pow(1 + monthlyRate, termInMonths)) /
      (Math.pow(1 + monthlyRate, termInMonths) - 1);
    
    const totalPayment = monthlyPayment * termInMonths;
    const totalInterest = totalPayment - principal;
  
    const amortizationSchedule = [];
    let remainingBalance = principal;
  
    for (let month = 1; month <= termInMonths; month++) {
      const interestPayment = remainingBalance * monthlyRate;
      const principalPayment = monthlyPayment - interestPayment;
      remainingBalance -= principalPayment;
  
      amortizationSchedule.push({
        month,
        payment: monthlyPayment,
        principal: principalPayment,
        interest: interestPayment,
        remainingBalance: Math.max(0, remainingBalance)
      });
    }
  
    return {
      monthlyPayment,
      totalPayment,
      totalInterest,
      amortizationSchedule
    };
  };