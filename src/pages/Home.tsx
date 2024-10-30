import React from 'react';
import { Link } from 'react-router-dom';
import Header from '../components/Header';

const Home: React.FC = () => {
  return (
    <div className="flex flex-col min-h-screen bg-gray-100">
     <Header/>

      <main className="flex-grow container mx-auto mt-24 px-4 py-8 lg:mt-32">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div className="bg-white rounded-lg shadow-lg p-8 transform hover:scale-105 transition-transform duration-300">
            <h2 className="text-3xl font-bold mb-6 text-blue-600">Welcome to Personal Finance Manager</h2>
            <p className="text-gray-700">
              This application helps you manage your personal finances by tracking your income and expenses.
              You can easily add new transactions, view your financial history, and get an overview of your spending habits.
            </p>
          </div>

          <div className="bg-white rounded-lg shadow-lg p-8 transform hover:scale-105 transition-transform duration-300">
            <h3 className="text-2xl font-bold mb-4 text-blue-600">Key Features:</h3>
            <ul className="list-disc list-inside text-gray-700 space-y-2">
              <li>Add and track income and expenses</li>
              <li>View transaction history</li>
              <li>Categorize your spending</li>
              <li>Visualize your financial data</li>
            </ul>
          </div>
        </div>
      </main>

      <footer className="bg-blue-600 text-white p-4 mt-auto">
        <div className="container mx-auto text-center">
          <p>
            To start managing your finances, head over to the{' '}
            <Link to="/app" className="font-bold hover:underline">
              App page
            </Link>
            .
          </p>
        </div>
      </footer>
    </div>
  );
};

export default Home;