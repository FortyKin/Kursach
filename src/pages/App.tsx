import React from 'react';
import { Provider } from 'react-redux';
import { store } from '../store';
import TransactionList from '../components/TransactionList';
import TransactionModal from '../components/TransactionModal';

const Appe: React.FC = () => {
  return (
    <Provider store={store}>
      <div className="flex flex-col min-h-screen bg-gray-100 overflow-x-hidden">
        <header className="bg-blue-600 text-white p-4 fixed top-0 left-0 right-0 z-10 shadow-md">
          <div className="container mx-auto flex justify-between items-center">
            <h1 className="text-xl font-bold">Personal Finance Manager</h1>
            <nav>
              <a href="/" className="mr-4 hover:underline">Home</a>
              <a href="/app" className="hover:underline">App</a>
            </nav>
          </div>
        </header>

        <main className="flex-grow container mx-auto mt-24 px-4 py-8">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="bg-white rounded-lg shadow-lg p-8">
              <h2 className="text-2xl font-bold mb-4 text-blue-600">Transaction History</h2>
              <TransactionList />
            </div>
          </div>
          <TransactionModal/>
        </main>

        <footer className="bg-blue-600 text-white p-4 mt-auto">
          <div className="container mx-auto text-center">
            <p>
              Manage your personal finances with ease.
            </p>
          </div>
        </footer>
      </div>
    </Provider>
  );
};

export default Appe;
