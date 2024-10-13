import React, { useState } from 'react';
import { Link } from 'react-router-dom';

const Header: React.FC = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  return (
    <header className="bg-blue-600 p-4">
      <div className="container mx-auto flex justify-between items-center">
        <h1 className="text-white text-xl font-bold">Personal Finance Manager</h1>
        <nav className="hidden md:block">
          <ul className="flex space-x-4">
            <li><Link to="/" className="text-white hover:text-blue-200">Home</Link></li>
            <li><Link to="/app" className="text-white hover:text-blue-200">App</Link></li>
          </ul>
        </nav>
        <button 
          className="md:hidden text-white"
          onClick={() => setIsMenuOpen(!isMenuOpen)}
        >
          Menu
        </button>
      </div>
      {isMenuOpen && (
        <nav className="md:hidden mt-2">
          <ul className="flex flex-col space-y-2">
            <li><Link to="/" className="text-white hover:text-blue-200" onClick={() => setIsMenuOpen(false)}>Home</Link></li>
            <li><Link to="/app" className="text-white hover:text-blue-200" onClick={() => setIsMenuOpen(false)}>App</Link></li>
          </ul>
        </nav>
      )}
    </header>
  );
};

export default Header;