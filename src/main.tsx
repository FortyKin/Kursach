import React from 'react'
import ReactDOM from 'react-dom/client'
import { Provider } from 'react-redux'
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom'
import { store } from './store'
import Header from './components/Header'
import Home from './pages/Home'
import App from './pages/App'
import './index.css'

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <Provider store={store}>
      <Router>
        <Header />
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/app" element={<App />} />
        </Routes>
      </Router>
    </Provider>
  </React.StrictMode>,
)
