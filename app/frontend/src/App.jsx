import React from 'react';
import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import Home from './components/Home';
import ProductList from './components/ProductList';
import Stats from './components/Stats';
import './styles/App.css';

function App() {
  return (
    <Router>
      <nav className="navbar">
        <div className="nav-container">
          <Link to="/" className="nav-logo">
            📊 Product Dashboard
          </Link>
          <ul className="nav-menu">
            <li className="nav-item">
              <Link to="/" className="nav-link">
                Home
              </Link>
            </li>
            <li className="nav-item">
              <Link to="/products" className="nav-link">
                Products
              </Link>
            </li>
            <li className="nav-item">
              <Link to="/stats" className="nav-link">
                Statistics
              </Link>
            </li>
          </ul>
        </div>
      </nav>

      <main className="main-content">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/products" element={<ProductList />} />
          <Route path="/stats" element={<Stats />} />
        </Routes>
      </main>

      <footer className="footer">
        <p>&copy; 2026 Product Dashboard - DevOps Demo</p>
      </footer>
    </Router>
  );
}

export default App;