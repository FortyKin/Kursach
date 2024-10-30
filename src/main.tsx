import React from 'react';
import ReactDOM from 'react-dom/client';
import { Provider } from 'react-redux';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import { store } from './store';
import Header from './components/Header';
import Home from './pages/Home';
import Appe from './pages/App';
import './index.css';
import LoginForm from './pages/auth/LoginForm';
import RegisterForm from './pages/auth/RegisterForm';

const App = () => {
  return (
    <React.StrictMode>
      <Provider store={store}>
        <Router>
          <div className="flex flex-col min-h-screen bg-gray-100">
            <Header />
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/app" element={<Appe />} />
              <Route path="/Login" element={<LoginForm />} />
              <Route path="/Register" element={<RegisterForm />} />
            </Routes>
            <footer className="bg-blue-600 text-white p-4 mt-auto">
              <div className="container mx-auto text-center">
                <p>Manage your personal finances with ease.</p>
              </div>
            </footer>
          </div>
        </Router>
      </Provider>
    </React.StrictMode>
  );
};

const root = ReactDOM.createRoot(document.getElementById('root')!);
root.render(<App />);
