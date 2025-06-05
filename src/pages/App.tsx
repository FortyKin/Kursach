import React from 'react';
import { Provider } from 'react-redux';
import { store } from '../store';
import TransactionList from '../components/TransactionList';
import TransactionModal from '../components/TransactionModal';

const App: React.FC = () => {
  return (
    <Provider store={store}>
      <div className="flex flex-col min-h-screen bg-gray-100 overflow-x-hidden">
        

        <main className="flex-grow container mx-auto mt-24 px-4 py-8">
          <div className="w-full">
            <div className="bg-white rounded-lg shadow-lg p-6">
              <h2 className="text-2xl font-bold mb-6 text-blue-600">Financial calculator</h2>
              <div className="overflow-x-auto">
                <TransactionList />
              </div>
            </div>
          </div>
          <TransactionModal />
        </main>

        <footer className="bg-blue-600 text-white p-4 mt-auto">
          <div className="container mx-auto text-center">
            <p>Manage your personal finances with ease.</p>
          </div>
        </footer>
      </div>
    </Provider>
  );
};

export default App;