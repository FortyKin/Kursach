import React from 'react';
import { useAppSelector, useAppDispatch } from '../hooks';
import { removeTransaction } from '../store/financeSlice';
import { Transaction } from '../types';

const TransactionList: React.FC = () => {
  const transactions = useAppSelector((state) => state.finance.transactions);
  const dispatch = useAppDispatch();

  return (
    <div>
      {transactions.map((transaction: Transaction) => (
        <div
          key={transaction.id}
          className={`bg-white rounded-lg shadow-lg p-4 mb-4 ${
            transaction.isNew ? 'bg-green-100' : ''
          }`}
        >
          <p className="text-gray-600">{transaction.description}</p>
          <p className="text-gray-600">${transaction.amount}</p>
          <button
            onClick={() => dispatch(removeTransaction(transaction.id))}
            className="bg-red-500 text-white px-4 py-2 rounded-lg mt-2"
          >
            Delete
          </button>
        </div>
      ))}
    </div>
  );
};

export default TransactionList;