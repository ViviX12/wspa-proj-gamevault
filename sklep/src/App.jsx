import React, { useState } from 'react';
import { Routes, Route, Link } from 'react-router-dom';
import Shop from './components/Shop';
import Library from './components/Library';
import Product from './components/Product';
import './style.css';

export default function App() {
  const [globalSearchQuery, setGlobalSearchQuery] = useState('');
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);

  // Funkcja wymuszająca "twarde" przeładowanie strony
  const handleHardRefresh = (targetPath) => {
    if (window.location.pathname === targetPath) {
      window.location.href = targetPath;
    } else {
      setGlobalSearchQuery('');
    }
  };

  const handleFutureFeature = (feature) => {
    alert(`${feature} zostanie wdrożony w Sprincie 4 (Final Phase).`);
  };

  return (
    <div className="page">
      <header className="header">
        <div className="header-inner">
          <Link to="/" className="logo" onClick={() => handleHardRefresh('/')}>
            <span className="game">GAME</span>
            <span className="vault">VAULT</span>
          </Link>

          <nav className="nav">
            <Link to="/" onClick={() => handleHardRefresh('/')}>SKLEP</Link>
            <Link to="/library" onClick={() => handleHardRefresh('/library')}>BIBLIOTEKA</Link>
            <Link to="#" onClick={(e) => { e.preventDefault(); handleFutureFeature("Moduł społecznościowy"); }}>
              SPOŁECZNOŚĆ
            </Link>
          </nav>

          <input 
            type="text" 
            className="search" 
            placeholder="Szukaj gier..." 
            value={globalSearchQuery}
            onChange={(e) => setGlobalSearchQuery(e.target.value)}
          />

          {/*zakładka użytkownika z menu rozwijanym */}
          <div className="header-right" style={{ position: 'relative', cursor: 'pointer' }} onClick={() => setIsDropdownOpen(!isDropdownOpen)}>
            <span>Krzysztof Sosnówka ▼</span>
            {isDropdownOpen && (
              <div style={{ 
                position: 'absolute', top: '100%', right: 0, background: '#172230', 
                border: '1px solid rgba(255, 255, 255, 0.08)', padding: '10px', zIndex: 100, minWidth: '160px',
                boxShadow: '0 10px 30px rgba(0, 0, 0, 0.35)'
              }}>
                <div style={{ padding: '8px 0', borderBottom: '1px solid rgba(255, 255, 255, 0.08)' }} onClick={() => handleFutureFeature("Profil")}>Mój profil</div>
                <div style={{ padding: '8px 0', borderBottom: '1px solid rgba(255, 255, 255, 0.08)' }} onClick={() => handleFutureFeature("Portfel")}>Portfel (0.00 zł)</div>
                <div style={{ padding: '8px 0', color: '#ff4d4d' }}>Wyloguj</div>
              </div>
            )}
          </div>
        </div>
      </header>

      <main className="page-main">
        <div className="main-inner">
          <Routes>
            <Route path="/" element={<Shop searchQuery={globalSearchQuery} />} />
            <Route path="/library" element={<Library />} />
            <Route path="/game/:id" element={<Product />} />
          </Routes>
        </div>
      </main>
    </div>
  );
}