import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { Transaction } from '../types';

// Функция загрузки транзакций из localStorage
const loadTransactionsFromStorage = () => {
  const savedTransactions = localStorage.getItem('transactions');
  return savedTransactions ? JSON.parse(savedTransactions) : [];
};

interface FinanceState {
  transactions: Transaction[];
}

const initialState: FinanceState = {
  transactions: loadTransactionsFromStorage(),
};

const financeSlice = createSlice({
  name: 'finance',
  initialState,
  reducers: {
    addTransaction: (state, action: PayloadAction<Transaction>) => {
      state.transactions.push(action.payload);
      localStorage.setItem('transactions', JSON.stringify(state.transactions));
    },
    removeTransaction: (state, action: PayloadAction<string>) => {
      state.transactions = state.transactions.filter(t => t.id !== action.payload);
      localStorage.setItem('transactions', JSON.stringify(state.transactions));
    },
    updateTransaction: (state, action: PayloadAction<Transaction>) => {
      const index = state.transactions.findIndex(t => t.id === action.payload.id);
      if (index !== -1) {
        state.transactions[index] = action.payload;
        localStorage.setItem('transactions', JSON.stringify(state.transactions));
      }
    },
  },
});

export const { addTransaction, removeTransaction, updateTransaction } = financeSlice.actions;
export default financeSlice.reducer;