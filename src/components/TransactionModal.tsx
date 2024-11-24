import React, { useState } from 'react';
import { useDispatch } from 'react-redux';
import { addTransaction } from '../store/financeSlice';
import { v4 as uuidv4 } from 'uuid';
import { PlusCircle, CreditCard, Wallet } from 'lucide-react';
import { Transaction } from '../types';

type FormType = 'debt' | 'credit';

// Обновленная функция маппинга
const mapFormToTransactionType = (formType: FormType): 'income' | 'expense' => {
  return formType === 'debt' ? 'expense' : 'income';
};

const TransactionModal: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [selectedForm, setSelectedForm] = useState<FormType | null>(null);
  const [amount, setAmount] = useState('');
  const [description, setDescription] = useState('');
  const [paymentDate, setPaymentDate] = useState('');
  const [interestRate, setInterestRate] = useState('');
  const dispatch = useDispatch();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedForm) return;

    const newTransaction: Transaction = {
      id: uuidv4(),
      amount: parseFloat(amount),
      description: `${selectedForm.toUpperCase()}: ${description}`,
      date: new Date().toISOString(),
      type: mapFormToTransactionType(selectedForm),
      transactionType: selectedForm, // Используем transactionType вместо category
      paymentDate: selectedForm === 'credit' ? paymentDate : undefined,
      interestRate: selectedForm === 'credit' ? parseFloat(interestRate) : undefined,
      isNew: true,
    };
    
    dispatch(addTransaction(newTransaction));
    handleReset();
  };

  const handleReset = () => {
    setAmount('');
    setDescription('');
    setPaymentDate('');
    setInterestRate('');
    setSelectedForm(null);
    setIsOpen(false);
  };

  if (!isOpen) {
    return (
      <button
        onClick={() => setIsOpen(true)}
        className="fixed bottom-6 right-6 h-16 w-16 rounded-full bg-blue-600 text-white shadow-lg flex items-center justify-center hover:bg-blue-700 transition-colors"
      >
        <PlusCircle className="h-8 w-8" />
      </button>
    );
  }

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-6 w-full max-w-md mx-4">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-bold">
            {selectedForm ? `Add ${selectedForm === 'debt' ? 'Debt' : 'Credit'}` : 'Choose Transaction Type'}
          </h2>
          <button
            onClick={handleReset}
            className="text-gray-500 hover:text-gray-700"
          >
            ✕
          </button>
        </div>

        {!selectedForm ? (
          <div className="grid grid-cols-2 gap-4">
            <button
              onClick={() => setSelectedForm('debt')}
              className="flex flex-col items-center justify-center p-6 border-2 border-gray-200 rounded-lg hover:border-blue-600 hover:bg-blue-50 transition-colors"
            >
              <Wallet className="h-12 w-12 mb-2 text-blue-600" />
              <span className="text-lg font-medium">Debt</span>
              <span className="text-sm text-gray-500 text-center mt-2">
                Record money you owe
              </span>
            </button>
            <button
              onClick={() => setSelectedForm('credit')}
              className="flex flex-col items-center justify-center p-6 border-2 border-gray-200 rounded-lg hover:border-blue-600 hover:bg-blue-50 transition-colors"
            >
              <CreditCard className="h-12 w-12 mb-2 text-blue-600" />
              <span className="text-lg font-medium">Credit</span>
              <span className="text-sm text-gray-500 text-center mt-2">
                Record credit payments
              </span>
            </button>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Amount
              </label>
              <input
                type="number"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                className="w-full rounded-md border border-gray-300 p-2"
                placeholder="Enter amount"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Description
              </label>
              <input
                type="text"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                className="w-full rounded-md border border-gray-300 p-2"
                placeholder="Enter description"
                required
              />
            </div>
            {selectedForm === 'credit' && (
              <>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Payment Date
                  </label>
                  <input
                    type="date"
                    value={paymentDate}
                    onChange={(e) => setPaymentDate(e.target.value)}
                    className="w-full rounded-md border border-gray-300 p-2"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Interest Rate (%)
                  </label>
                  <input
                    type="number"
                    step="0.01"
                    value={interestRate}
                    onChange={(e) => setInterestRate(e.target.value)}
                    className="w-full rounded-md border border-gray-300 p-2"
                    placeholder="Enter interest rate"
                    required
                  />
                </div>
              </>
            )}
            <div className="flex justify-end space-x-2 pt-4">
              <button
                type="button"
                onClick={() => setSelectedForm(null)}
                className="px-4 py-2 rounded bg-gray-200 text-gray-700 hover:bg-gray-300"
              >
                Back
              </button>
              <button
                type="submit"
                className="px-4 py-2 rounded bg-blue-600 text-white hover:bg-blue-700"
              >
                Add {selectedForm === 'debt' ? 'Debt' : 'Credit'}
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
};

export default TransactionModal;