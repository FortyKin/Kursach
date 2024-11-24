import React, { useState } from 'react';
import { useAppSelector, useAppDispatch } from '../hooks';
import { removeTransaction } from '../store/financeSlice';
import { Trash2, CreditCard, Wallet, ChevronDown, ChevronUp } from 'lucide-react';
import { Transaction } from '../types';
import { calculateCredit } from '../utils/creditCalculator';

const TransactionList: React.FC = () => {
  const transactions = useAppSelector((state) => state.finance.transactions);
  const dispatch = useAppDispatch();
  const [expandedId, setExpandedId] = useState<string | null>(null);

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString();
  };

  const formatCurrency = (amount: number) => {
    return amount.toLocaleString('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    });
  };

  const renderCreditDetails = (transaction: Transaction) => {
    if (!transaction.interestRate || !transaction.loanTerm) return null;

    const creditCalc = calculateCredit(
      Math.abs(transaction.amount),
      transaction.interestRate,
      transaction.loanTerm
    );

    return (
      <div className="mt-4 pt-4 border-t border-gray-100">
        <div className="grid grid-cols-2 gap-4 mb-4">
          <div>
            <p className="text-sm text-gray-500">Monthly Payment</p>
            <p className="text-lg font-medium">
              {formatCurrency(creditCalc.monthlyPayment)}
            </p>
          </div>
          <div>
            <p className="text-sm text-gray-500">Total Interest</p>
            <p className="text-lg font-medium text-amber-600">
              {formatCurrency(creditCalc.totalInterest)}
            </p>
          </div>
          <div>
            <p className="text-sm text-gray-500">Total Payment</p>
            <p className="text-lg font-medium text-red-600">
              {formatCurrency(creditCalc.totalPayment)}
            </p>
          </div>
          <div>
            <p className="text-sm text-gray-500">Loan Term</p>
            <p className="text-lg font-medium">
              {transaction.loanTerm} months
            </p>
          </div>
        </div>

        {expandedId === transaction.id && (
          <div className="mt-4">
            <p className="font-medium mb-2">Payment Schedule</p>
            <div className="max-h-64 overflow-y-auto">
              <table className="w-full text-sm">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="p-2 text-left">Month</th>
                    <th className="p-2 text-right">Payment</th>
                    <th className="p-2 text-right">Principal</th>
                    <th className="p-2 text-right">Interest</th>
                    <th className="p-2 text-right">Remaining</th>
                  </tr>
                </thead>
                <tbody>
                  {creditCalc.amortizationSchedule.map((month) => (
                    <tr key={month.month} className="border-b border-gray-100">
                      <td className="p-2">{month.month}</td>
                      <td className="p-2 text-right">{formatCurrency(month.payment)}</td>
                      <td className="p-2 text-right">{formatCurrency(month.principal)}</td>
                      <td className="p-2 text-right text-amber-600">{formatCurrency(month.interest)}</td>
                      <td className="p-2 text-right">{formatCurrency(month.remainingBalance)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>
    );
  };

  return (
    <div className="space-y-4">
      {transactions.map((transaction: Transaction) => (
        <div
          key={transaction.id}
          className={`bg-white rounded-lg shadow-lg p-6 ${
            transaction.isNew ? 'ring-2 ring-green-500' : ''
          }`}
        >
          {/* Header with Icon and Type */}
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              {transaction.transactionType === 'debt' ? (
                <Wallet className="h-6 w-6 text-red-600" />
              ) : (
                <CreditCard className="h-6 w-6 text-blue-600" />
              )}
              <span className="text-lg font-semibold capitalize">
                {transaction.transactionType}
              </span>
            </div>
            <button
              onClick={() => dispatch(removeTransaction(transaction.id))}
              className="text-gray-400 hover:text-red-500 transition-colors"
              title="Delete transaction"
            >
              <Trash2 className="h-5 w-5" />
            </button>
          </div>

          {/* Main Transaction Details */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <p className="text-sm text-gray-500">Amount</p>
              <p className={`text-lg font-medium ${
                transaction.amount < 0 ? 'text-red-600' : 'text-green-600'
              }`}>
                {formatCurrency(transaction.amount)}
              </p>
            </div>
            <div>
              <p className="text-sm text-gray-500">Date Added</p>
              <p className="text-lg font-medium">{formatDate(transaction.date)}</p>
            </div>
          </div>

          {/* Description */}
          <div className="mt-4">
            <p className="text-sm text-gray-500">Description</p>
            <p className="text-lg font-medium">{transaction.description}</p>
          </div>

          {/* Credit-specific Fields */}
          {transaction.transactionType === 'credit' && (
            <>
              {renderCreditDetails(transaction)}
              <button
                onClick={() => setExpandedId(
                  expandedId === transaction.id ? null : transaction.id
                )}
                className="mt-4 flex items-center gap-1 text-blue-600 hover:text-blue-700"
              >
                {expandedId === transaction.id ? (
                  <>
                    <ChevronUp className="h-4 w-4" />
                    Hide Details
                  </>
                ) : (
                  <>
                    <ChevronDown className="h-4 w-4" />
                    Show Details
                  </>
                )}
              </button>
            </>
          )}
        </div>
      ))}

      {transactions.length === 0 && (
        <div className="text-center py-12 text-gray-500">
          No transactions yet. Click the + button to add one.
        </div>
      )}
    </div>
  );
};

export default TransactionList;