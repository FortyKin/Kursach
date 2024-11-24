import React, { useState } from 'react';
import { useDispatch } from 'react-redux';
import { addTransaction } from '../store/financeSlice';
import { v4 as uuidv4 } from 'uuid';
import { Transaction } from '../types';

const TransactionForm: React.FC = () => {
  const [amount, setAmount] = useState('');
  const [description, setDescription] = useState('');
  const [type, setType] = useState<'income' | 'expense'>('expense');
  const [transactionType, setTransactionType] = useState<'debt' | 'credit'>('debt');
  const dispatch = useDispatch();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    const newTransaction: Transaction = {
      id: uuidv4(),
      amount: parseFloat(amount),
      description,
      date: new Date().toISOString(),
      type,
      transactionType, // Added required field
      isNew: true,
    };

    dispatch(addTransaction(newTransaction));
    setAmount('');
    setDescription('');
    setTransactionType('debt');
  };

  return (
    <div className="p-4">
      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="flex flex-col space-y-2">
          <input
            type="number"
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
            placeholder="Amount"
            required
            className="p-2 border rounded"
          />
          
          <input
            type="text"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="Description"
            required
            className="p-2 border rounded"
          />
          
          <select
            value={type}
            onChange={(e) => setType(e.target.value as 'income' | 'expense')}
            className="p-2 border rounded"
          >
            <option value="income">Income</option>
            <option value="expense">Expense</option>
          </select>
          
          <select
            value={transactionType}
            onChange={(e) => setTransactionType(e.target.value as 'debt' | 'credit')}
            className="p-2 border rounded"
          >
            <option value="debt">Debt</option>
            <option value="credit">Credit</option>
          </select>
        </div>
        
        <button 
          type="submit"
          className="w-full bg-blue-500 text-white p-2 rounded hover:bg-blue-600"
        >
          Add Transaction
        </button>
      </form>
    </div>
  );
};

export default TransactionForm;