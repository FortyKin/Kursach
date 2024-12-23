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
              <Route path="/app" element={
                  <Appe />
              } />
              <Route path="/login" element={<LoginForm />} />
              <Route path="/register" element={<RegisterForm />} />
            </Routes>
          </div>
        </Router>
      </Provider>
    </React.StrictMode>
  );
};

const root = ReactDOM.createRoot(document.getElementById('root')!);
root.render(<App />);