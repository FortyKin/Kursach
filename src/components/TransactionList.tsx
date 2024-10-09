import React from 'react';
import { useAppSelector, useAppDispatch } from '../hooks';
import { removeTransaction } from '../store/financeSlice';
import { Transaction } from '../types';

const TransactionList: React.FC = () => {
  const transactions = useAppSelector((state) => state.finance.transactions);
  const dispatch = useAppDispatch();

  return (
    <ul>
      {transactions.map((transaction: Transaction) => (
        <li key={transaction.id}>
          {transaction.description} - {transaction.amount}
          <button onClick={() => dispatch(removeTransaction(transaction.id))}>Delete</button>
        </li>
      ))}
    </ul>
  );
};

export default TransactionList;