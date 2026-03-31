import React from 'react';
import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import Shop from './components/Shop.jsx';
import Product from './components/Product.jsx';
import Library from './components/Library.jsx';

export default function App() {
  return (
    <Router>
      <nav style={{ padding: '20px', backgroundColor: '#333', color: 'white', marginBottom: '20px' }}>
        <Link to="/" style={{ color: 'white', marginRight: '15px', textDecoration: 'none' }}>Sklep</Link>
        <Link to="/library" style={{ color: 'white', textDecoration: 'none' }}>Moja Biblioteka</Link>
      </nav>

      <div style={{ padding: '0 20px' }}>
        <Routes>
          <Route path="/" element={<Shop />} />
          <Route path="/game/:id" element={<Product />} />
          <Route path="/library" element={<Library />} />
        </Routes>
      </div>
    </Router>
  );
}