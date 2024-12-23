// types.ts
export interface Transaction {
  id: string;
  amount: number;
  description: string;
  date: string;
  type: 'income' | 'expense';
  transactionType: 'installment' | 'credit';
  // Новые поля для кредита
  paymentDate?: string;
  interestRate?: number;
  loanTerm?: number; // срок кредита в месяцах
  monthlyPayment?: number; // ежемесячный платеж
  totalPayment?: number; // общая сумма к выплате
  remainingPayments?: number; // оставшиеся платежи
  totalInterest?: number; // общая сумма процентов
  isNew: boolean;
  storeName?: string;
  productCategory?: string;
  initialPayment?: number;
  hasInsurance?: boolean;
  insuranceCost?: number;
  paidMonths?: { [key: number]: boolean };
}

export interface CreditCalculation {
  monthlyPayment: number;
  totalPayment: number;
  totalInterest: number;
  amortizationSchedule: Array<{
    month: number;
    payment: number;
    principal: number;
    interest: number;
    remainingBalance: number;
  }>;
}