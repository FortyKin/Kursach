import React, { useState } from 'react';
import { useAppSelector, useAppDispatch } from '../hooks';
import { removeTransaction, updateTransaction } from '../store/financeSlice';
import { Trash2, CreditCard, Wallet, ChevronDown, ChevronUp, Edit2, Save, X } from 'lucide-react';
import { Transaction } from '../types';
import { calculatePayments } from '../utils/paymentCalculator';

const TransactionList: React.FC = () => {
  const transactions = useAppSelector((state) => state.finance.transactions);
  const dispatch = useAppDispatch();
  const [expandedId, setExpandedId] = useState<string | null>(null);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editForm, setEditForm] = useState<Partial<Transaction>>({});

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('uk-UA');
  };

  const calculateDueDate = (paymentDate: string, monthNumber: number) => {
    const date = new Date(paymentDate);
    date.setMonth(date.getMonth() + monthNumber);
    return date.toLocaleDateString('uk-UA');
  };

  const formatCurrency = (amount: number) => {
    return amount.toLocaleString('uk-UA', {
      style: 'currency',
      currency: 'UAH',
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    });
  };

  const handleEditStart = (transaction: Transaction) => {
    setEditingId(transaction.id);
    setEditForm(transaction);
  };

  const handleEditCancel = () => {
    setEditingId(null);
    setEditForm({});
  };

  const handlePaymentStatusToggle = (transactionId: string, monthIndex: number) => {
    const transaction = transactions.find(t => t.id === transactionId);
    if (transaction) {
      const updatedTransaction = {
        ...transaction,
        paidMonths: {
          ...(transaction.paidMonths || {}),
          [monthIndex]: !(transaction.paidMonths?.[monthIndex])
        }
      };
      dispatch(updateTransaction(updatedTransaction));
    }
  };

  const handleEditSave = () => {
    if (editingId && editForm) {
      const calculations = calculatePayments(editForm);
      if (calculations) {
        dispatch(updateTransaction({
          ...editForm,
          id: editingId,
          amount: Number(editForm.amount),
          monthlyPayment: calculations.monthlyPayment,
          totalPayment: calculations.totalPayment,
          totalInterest: calculations.totalInterest,
          remainingBalance: calculations.amortizationSchedule[0].remainingBalance
        } as Transaction));
      }
      setEditingId(null);
      setEditForm({});
    }
  };

  const renderEditForm = (transaction: Transaction) => (
    <div className="p-4">
      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="text-xs text-gray-500">Сума</label>
          <input
            type="number"
            value={editForm.amount || ''}
            onChange={(e) => setEditForm({...editForm, amount: Number(e.target.value)})}
            className="w-full border rounded p-1 text-sm"
          />
        </div>
        <div>
          <label className="text-xs text-gray-500">Опис</label>
          <input
            type="text"
            value={editForm.description || ''}
            onChange={(e) => setEditForm({...editForm, description: e.target.value})}
            className="w-full border rounded p-1 text-sm"
          />
        </div>
        {transaction.transactionType === 'installment' && (
          <>
            <div>
              <label className="text-xs text-gray-500">Початковий платіж</label>
              <input
                type="number"
                value={editForm.initialPayment || ''}
                onChange={(e) => setEditForm({...editForm, initialPayment: Number(e.target.value)})}
                className="w-full border rounded p-1 text-sm"
              />
            </div>
            <div>
              <label className="text-xs text-gray-500">Вартість страхування</label>
              <input
                type="number"
                value={editForm.insuranceCost || ''}
                onChange={(e) => setEditForm({
                  ...editForm, 
                  insuranceCost: Number(e.target.value),
                  hasInsurance: Number(e.target.value) > 0
                })}
                className="w-full border rounded p-1 text-sm"
              />
            </div>
          </>
        )}
        <div>
          <label className="text-xs text-gray-500">Відсоткова ставка (%)</label>
          <input
            type="number"
            step="0.1"
            value={editForm.interestRate || ''}
            onChange={(e) => setEditForm({...editForm, interestRate: Number(e.target.value)})}
            className="w-full border rounded p-1 text-sm"
          />
        </div>
        <div>
          <label className="text-xs text-gray-500">Термін (місяців)</label>
          <input
            type="number"
            value={editForm.loanTerm || ''}
            onChange={(e) => setEditForm({...editForm, loanTerm: Number(e.target.value)})}
            className="w-full border rounded p-1 text-sm"
          />
        </div>
      </div>
      <div className="mt-4 flex justify-end gap-2">
        <button
          onClick={handleEditCancel}
          className="flex items-center gap-1 px-3 py-1 text-sm text-gray-600 hover:text-gray-800"
        >
          <X className="h-4 w-4" />
          Скасувати
        </button>
        <button
          onClick={handleEditSave}
          className="flex items-center gap-1 px-3 py-1 text-sm text-white bg-blue-600 rounded hover:bg-blue-700"
        >
          <Save className="h-4 w-4" />
          Зберегти
        </button>
      </div>
    </div>
  );

  const renderTransaction = (transaction: Transaction) => {
    const isExpanded = expandedId === transaction.id;
    const isEditing = editingId === transaction.id;
    const calculations = calculatePayments(transaction);

    return (
      <div className="p-1">
        <div className={`bg-white rounded-lg shadow-sm ${
          transaction.isNew ? 'ring-2 ring-green-500' : ''
        }`}>
          {!isEditing ? (
            <div className="p-4">
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center gap-2">
                  {transaction.transactionType === 'installment' ? (
                    <Wallet className="h-5 w-5 text-purple-600" />
                  ) : (
                    <CreditCard className="h-5 w-5 text-blue-600" />
                  )}
                  <span className="text-base font-semibold">
                    {transaction.transactionType === 'installment' ? 'Розстрочка' : 'Кредит'}
                  </span>
                </div>
                <div className="flex gap-2">
                  <button
                    onClick={() => handleEditStart(transaction)}
                    className="text-gray-400 hover:text-blue-500 transition-colors"
                    title="Редагувати"
                  >
                    <Edit2 className="h-4 w-4" />
                  </button>
                  <button
                    onClick={() => dispatch(removeTransaction(transaction.id))}
                    className="text-gray-400 hover:text-red-500 transition-colors"
                    title="Видалити"
                  >
                    <Trash2 className="h-4 w-4" />
                  </button>
                </div>
              </div>

              <div className="grid grid-cols-4 gap-4">
                <div>
                  <p className="text-xs text-gray-500">Сума</p>
                  <p className="text-sm font-medium text-green-600">
                    {formatCurrency(transaction.amount)}
                  </p>
                </div>
                <div>
                  <p className="text-xs text-gray-500">Дата додавання</p>
                  <p className="text-sm font-medium">
                    {formatDate(transaction.date)}
                  </p>
                </div>
                <div className="col-span-2">
                  <p className="text-xs text-gray-500">Опис</p>
                  <p className="text-sm font-medium">{transaction.description}</p>
                </div>
              </div>

              {calculations && (
                <div className="mt-3 grid grid-cols-4 gap-4">
                  {transaction.transactionType === 'installment' && transaction.initialPayment && transaction.initialPayment > 0 && (
                    <div>
                      <p className="text-xs text-gray-500">Початковий платіж</p>
                      <p className="text-sm font-medium">
                        {formatCurrency(transaction.initialPayment)}
                      </p>
                    </div>
                  )}
                  <div>
                    <p className="text-xs text-gray-500">Щомісячний платіж</p>
                    <p className="text-sm font-medium">
                      {formatCurrency(calculations.monthlyPayment)}
                    </p>
                  </div>
                  {transaction.transactionType === 'installment' && transaction.hasInsurance && (
                    <div>
                      <p className="text-xs text-gray-500">Страхування</p>
                      <p className="text-sm font-medium text-purple-600">
                        {formatCurrency(transaction.insuranceCost || 0)}
                      </p>
                    </div>
                  )}
                  <div>
                    <p className="text-xs text-gray-500">Загальні відсотки</p>
                    <p className="text-sm font-medium text-amber-600">
                      {formatCurrency(calculations.totalInterest)}
                    </p>
                  </div>
                  <div>
                    <p className="text-xs text-gray-500">Загальна сума</p>
                    <p className="text-sm font-medium text-red-600">
                      {formatCurrency(calculations.totalPayment + (transaction.initialPayment || 0))}
                    </p>
                  </div>
                </div>
              )}

              <button
                onClick={() => setExpandedId(isExpanded ? null : transaction.id)}
                className="mt-3 flex items-center gap-1 text-sm text-blue-600 hover:text-blue-700"
              >
                {isExpanded ? (
                  <>
                    <ChevronUp className="h-4 w-4" />
                    Приховати деталі
                  </>
                ) : (
                  <>
                    <ChevronDown className="h-4 w-4" />
                    Показати деталі
                  </>
                )}
              </button>
            </div>
          ) : (
            renderEditForm(transaction)
          )}

          {isExpanded && calculations && !isEditing && (
            <div className="border-t border-gray-100 p-4">
              <div className="flex justify-between items-center mb-3">
                <h3 className="text-sm font-medium">Графік платежів</h3>
                <div className="flex items-center gap-4">
                  {transaction.transactionType === 'installment' && transaction.storeName && (
                    <span className="text-sm">
                      <span className="text-gray-600">Магазин: </span>
                      <span className="font-medium text-purple-600">{transaction.storeName}</span>
                    </span>
                  )}
                  <span className="text-sm">
                    <span className="text-gray-600">Відсоткова ставка: </span>
                    <span className="font-medium text-blue-600">{transaction.interestRate}%</span>
                  </span>
                </div>
              </div>
              <div className="max-h-64 overflow-y-auto">
                <table className="w-full text-sm">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="p-2 text-left text-xs">Дата платежу</th>
                      <th className="p-2 text-right text-xs">Платіж</th>
                      <th className="p-2 text-right text-xs">Основна сума</th>
                      <th className="p-2 text-right text-xs">Відсотки</th>
                      <th className="p-2 text-right text-xs">Залишок</th>
                      <th className="p-2 text-center text-xs">Статус</th>
                    </tr>
                  </thead>
                  <tbody>
                    {calculations.amortizationSchedule.map((month) => (
                      <tr key={month.month} className="border-b border-gray-100">
                        <td className="p-2 text-xs">
                          {calculateDueDate(transaction.paymentDate!, month.month - 1)}
                        </td>
                        <td className="p-2 text-right text-xs">{formatCurrency(month.payment)}</td>
                        <td className="p-2 text-right text-xs">{formatCurrency(month.principal)}</td>
                        <td className="p-2 text-right text-xs text-amber-600">
                          {formatCurrency(month.interest)}
                        </td>
                        <td className="p-2 text-right text-xs">
                          {formatCurrency(month.remainingBalance)}
                        </td>
                        <td className="p-2 text-center">
                          <input
                            type="checkbox"
                            checked={transaction.paidMonths?.[month.month - 1] || false}
                            onChange={() => handlePaymentStatusToggle(transaction.id, month.month - 1)}
                            className="h-4 w-4 text-blue-600 rounded border-gray-300"
                          />
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}
        </div>
      </div>
    );
  };

  return (
    <div className="space-y-2">
      {transactions.map(renderTransaction)}
      
      {transactions.length === 0 && (
        <div className="text-center py-12 text-gray-500">
          Немає транзакцій. Натисніть кнопку + щоб додати нову.
        </div>
      )}
    </div>
  );
};

export default TransactionList;