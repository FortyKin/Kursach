import React from 'react';
import { Link } from 'react-router-dom';

const Home: React.FC = () => {
  return (
    <div className="container mx-auto mt-8 p-4">
      <h2 className="text-2xl font-bold mb-4">Welcome to Personal Finance Manager</h2>
      <p className="mb-4">
        This application helps you manage your personal finances by tracking your income and expenses.
        You can easily add new transactions, view your financial history, and get an overview of your spending habits.
      </p>
      <h3 className="text-xl font-bold mb-2">Key Features:</h3>
      <ul className="list-disc list-inside mb-4">
        <li>Add and track income and expenses</li>
        <li>View transaction history</li>
        <li>Categorize your spending</li>
        <li>Visualize your financial data</li>
      </ul>
      <p>
        To start managing your finances, head over to the <Link to="/app" className="text-blue-600 hover:underline">App page</Link>.
      </p>
    </div>
  );
};

export default Home;