import React from 'react';
import { Provider } from 'react-redux';
import { store } from './store';
import TransactionForm from './components/TransactionForm';
import TransactionList from './components/TransactionList';

const App: React.FC = () => {
  return (
    <Provider store={store}>
      <div>
        <h1>Personal Finance Manager</h1>
        <TransactionForm />
        <TransactionList />
      </div>
    </Provider>
  );
};

export default App;
