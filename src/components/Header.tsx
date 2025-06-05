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
    <header className="bg-blue-600 p-4 fixed top-0 left-0 right-0 z-10 shadow-md">
      <div className="container mx-auto flex justify-between items-center">
        <h1 className="text-white text-xl font-bold">Personal Finance Manager</h1>
        
        {/* Desktop Navigation */}
        <nav className="hidden md:flex md:items-center md:space-x-4">
          <Link to="/" className="text-white hover:text-blue-200">Home</Link>
          {isAuthenticated && (
            <>
            <Link to="/app" className="text-white hover:text-blue-200">App</Link>
            <Link to="/profile" className="text-white hover:text-blue-200">Профіль</Link>
            </>
          )}
          
          {isAuthenticated ? (
            <div className="flex items-center space-x-4">
              <span className="text-white text-sm">Welcome, {user?.username}</span>
              <button
                onClick={handleLogout}
                className="bg-red-500 hover:bg-red-600 text-white px-3 py-1 rounded text-sm transition-colors"
              >
                Logout
              </button>
            </div>
          ) : (
            <div className="flex items-center space-x-4">
              <Link
                to="/login"
                className="bg-white text-blue-600 hover:bg-blue-50 px-3 py-1 rounded text-sm transition-colors"
              >
                Login
              </Link>
              <Link
                to="/register"
                className="bg-green-500 hover:bg-green-600 text-white px-3 py-1 rounded text-sm transition-colors"
              >
                Register
              </Link>
            </div>
          )}
        </nav>

        {/* Mobile Menu Button */}
        <button
          className="md:hidden text-white"
          onClick={() => setIsMenuOpen(!isMenuOpen)}
        >
          Menu
        </button>
      </div>

      {/* Mobile Navigation */}
      {isMenuOpen && (
        <nav className="md:hidden mt-2">
          <ul className="flex flex-col space-y-2">
            <li>
              <Link 
                to="/" 
                className="text-white hover:text-blue-200 block" 
                onClick={() => setIsMenuOpen(false)}
              >
                Home
              </Link>
            </li>
            {isAuthenticated && (
              <li>
                <Link 
                  to="/app" 
                  className="text-white hover:text-blue-200 block" 
                  onClick={() => setIsMenuOpen(false)}
                >
                  App
                </Link>
              </li>
            )}
            {isAuthenticated ? (
              <>
                <li className="text-white text-sm">Welcome, {user?.username}</li>
                <li>
                  <button
                    onClick={handleLogout}
                    className="bg-red-500 hover:bg-red-600 text-white px-3 py-1 rounded text-sm w-full text-left"
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
                    className="bg-white text-blue-600 hover:bg-blue-50 px-3 py-1 rounded text-sm block"
                    onClick={() => setIsMenuOpen(false)}
                  >
                    Login
                  </Link>
                </li>
                <li>
                  <Link
                    to="/register"
                    className="bg-green-500 hover:bg-green-600 text-white px-3 py-1 rounded text-sm block"
                    onClick={() => setIsMenuOpen(false)}
                  >
                    Register
                  </Link>
                </li>
              </>
            )}
          </ul>
        </nav>
      )}
    </header>
  );
};

export default Header;