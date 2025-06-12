import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from '../store';
import { logout } from '../store/authSlice';

const Header: React.FC = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { isAuthenticated, user } = useSelector((state: RootState) => state.auth);

  const handleLogout = () => {
    dispatch(logout());
    setIsMenuOpen(false);
    navigate('/');
  };

  return (
    <header className="bg-gradient-to-r from-blue-600 via-blue-700 to-blue-800 p-4 fixed top-0 left-0 right-0 z-10 shadow-lg backdrop-blur-sm">
      <div className="container mx-auto flex justify-between items-center">
        {/* Logo with animated gradient */}
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 bg-gradient-to-br from-white to-blue-100 rounded-full flex items-center justify-center shadow-md">
            <svg className="w-6 h-6 text-blue-600" fill="currentColor" viewBox="0 0 20 20">
              <path d="M4 4a2 2 0 00-2 2v1h16V6a2 2 0 00-2-2H4zM18 9H2v5a2 2 0 002 2h12a2 2 0 002-2V9zM4 13a1 1 0 011-1h1a1 1 0 110 2H5a1 1 0 01-1-1zm5-1a1 1 0 100 2h1a1 1 0 100-2H9z" />
            </svg>
          </div>
          <h1 className="text-white text-xl font-bold bg-gradient-to-r from-white to-blue-100 bg-clip-text text-transparent">
            Finance Manager
          </h1>
        </div>
        
        {/* Desktop Navigation */}
        <nav className="hidden md:flex md:items-center md:space-x-6">
          <Link 
            to="/" 
            className="text-white hover:text-blue-200 transition-all duration-300 relative group px-3 py-2 rounded-lg hover:bg-white/10"
          >
            Home
            <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-white transition-all duration-300 group-hover:w-full"></span>
          </Link>
          {isAuthenticated && (
            <>
              <Link 
                to="/app" 
                className="text-white hover:text-blue-200 transition-all duration-300 relative group px-3 py-2 rounded-lg hover:bg-white/10"
              >
                Калькулятор
                <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-white transition-all duration-300 group-hover:w-full"></span>
              </Link>
              <Link 
                to="/profile" 
                className="text-white hover:text-blue-200 transition-all duration-300 relative group px-3 py-2 rounded-lg hover:bg-white/10"
              >
                Профіль
                <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-white transition-all duration-300 group-hover:w-full"></span>
              </Link>
            </>
          )}
          
          {isAuthenticated ? (
            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-2 bg-white/10 rounded-full px-4 py-2 backdrop-blur-sm">
                <div className="w-8 h-8 bg-gradient-to-br from-blue-300 to-white rounded-full flex items-center justify-center">
                  <span className="text-blue-800 font-semibold text-sm">
                    {user?.username?.charAt(0).toUpperCase()}
                  </span>
                </div>
                <span className="text-white text-sm font-medium">
                  {user?.username}
                </span>
              </div>
              <button
                onClick={handleLogout}
                className="bg-gradient-to-r from-red-500 to-red-600 hover:from-red-600 hover:to-red-700 text-white px-4 py-2 rounded-full text-sm font-medium transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-xl"
              >
                Logout
              </button>
            </div>
          ) : (
            <div className="flex items-center space-x-3">
              <Link
                to="/login"
                className="bg-white/10 backdrop-blur-sm text-white hover:bg-white hover:text-blue-700 px-4 py-2 rounded-full text-sm font-medium transition-all duration-300 transform hover:scale-105 border border-white/20"
              >
                Login
              </Link>
              <Link
                to="/register"
                className="bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 text-white px-4 py-2 rounded-full text-sm font-medium transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-xl"
              >
                Register
              </Link>
            </div>
          )}
        </nav>

        {/* Mobile Menu Button */}
        <button
          className="md:hidden text-white p-2 rounded-lg hover:bg-white/10 transition-colors duration-300"
          onClick={() => setIsMenuOpen(!isMenuOpen)}
        >
          <div className="flex flex-col space-y-1">
            <span className={`block w-6 h-0.5 bg-white transition-all duration-300 ${isMenuOpen ? 'rotate-45 translate-y-1.5' : ''}`}></span>
            <span className={`block w-6 h-0.5 bg-white transition-all duration-300 ${isMenuOpen ? 'opacity-0' : ''}`}></span>
            <span className={`block w-6 h-0.5 bg-white transition-all duration-300 ${isMenuOpen ? '-rotate-45 -translate-y-1.5' : ''}`}></span>
          </div>
        </button>
      </div>

      {/* Mobile Navigation with smooth animation */}
      <div className={`md:hidden overflow-hidden transition-all duration-300 ${isMenuOpen ? 'max-h-96 mt-4' : 'max-h-0'}`}>
        <nav className="bg-white/10 backdrop-blur-sm rounded-xl p-4 mx-2">
          <ul className="flex flex-col space-y-3">
            <li>
              <Link 
                to="/" 
                className="text-white hover:text-blue-200 block py-2 px-4 rounded-lg hover:bg-white/10 transition-all duration-300" 
                onClick={() => setIsMenuOpen(false)}
              >
                Home
              </Link>
            </li>
            {isAuthenticated && (
              <>
                <li>
                  <Link 
                    to="/app" 
                    className="text-white hover:text-blue-200 block py-2 px-4 rounded-lg hover:bg-white/10 transition-all duration-300" 
                    onClick={() => setIsMenuOpen(false)}
                  >
                    Dashboard
                  </Link>
                </li>
                <li>
                  <Link 
                    to="/profile" 
                    className="text-white hover:text-blue-200 block py-2 px-4 rounded-lg hover:bg-white/10 transition-all duration-300" 
                    onClick={() => setIsMenuOpen(false)}
                  >
                    Профіль
                  </Link>
                </li>
              </>
            )}
            {isAuthenticated ? (
              <>
                <li className="flex items-center space-x-2 py-2 px-4">
                  <div className="w-6 h-6 bg-gradient-to-br from-blue-300 to-white rounded-full flex items-center justify-center">
                    <span className="text-blue-800 font-semibold text-xs">
                      {user?.username?.charAt(0).toUpperCase()}
                    </span>
                  </div>
                  <span className="text-white text-sm">Welcome, {user?.username}</span>
                </li>
                <li>
                  <button
                    onClick={handleLogout}
                    className="bg-gradient-to-r from-red-500 to-red-600 hover:from-red-600 hover:to-red-700 text-white px-4 py-2 rounded-lg text-sm w-full text-center font-medium transition-all duration-300"
                  >
                    Logout
                  </button>
                </li>
              </>
            ) : (
              <>
                <li>
                  <Link
                    to="/login"
                    className="bg-white/10 backdrop-blur-sm text-white hover:bg-white hover:text-blue-700 px-4 py-2 rounded-lg text-sm block text-center font-medium transition-all duration-300 border border-white/20"
                    onClick={() => setIsMenuOpen(false)}
                  >
                    Login
                  </Link>
                </li>
                <li>
                  <Link
                    to="/register"
                    className="bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 text-white px-4 py-2 rounded-lg text-sm block text-center font-medium transition-all duration-300"
                    onClick={() => setIsMenuOpen(false)}
                  >
                    Register
                  </Link>
                </li>
              </>
            )}
          </ul>
        </nav>
      </div>
    </header>
  );
};

export default Header;