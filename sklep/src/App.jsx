import React, { useState } from 'react';
import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import Shop from './components/Shop.jsx';
import Product from './components/Product.jsx';
import Library from './components/Library.jsx';
import './style.css'; 

export default function App() {
  const [searchQuery, setSearchQuery] = useState('');
  const [isMenuOpen, setIsMenuOpen] = useState(false); // Nowy stan dla menu!

  return (
    <Router>
      <div className="page">
        <header className="header">
          <div className="header-inner">
            <Link to="/" className="logo">
              <span className="game">Game</span><span className="vault">Vault</span>
            </Link>

            <nav className="nav">
              <Link to="/">Sklep</Link>
              <Link to="/library">Biblioteka</Link>
              <Link to="#" onClick={() => alert("Moduł Społeczności planowany na Sprint 3!")}>Społeczność</Link>
            </nav>

            <input 
              className="search" type="text" placeholder="Szukaj gry..." 
              value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)}
            />

            {/* OŻYWIONE MENU UŻYTKOWNIKA */}
            <div className="header-right" style={{ position: 'relative' }}>
              <div 
                style={{ display: 'flex', alignItems: 'center', gap: '14px', cursor: 'pointer' }} 
                onClick={() => setIsMenuOpen(!isMenuOpen)}
              >
                <span>☰</span>
                <span>Bolit</span>
                <span>◉</span>
              </div>
              
              {isMenuOpen && (
                <div style={{ 
                  position: 'absolute', top: '100%', right: 0, background: '#1f2f40', 
                  border: '1px solid #ffffff1a', padding: '10px', borderRadius: '4px', 
                  marginTop: '10px', zIndex: 100, display: 'flex', flexDirection: 'column', gap: '8px', minWidth: '150px' 
                }}>
                  <Link to="/library" onClick={() => setIsMenuOpen(false)} style={{ color: '#fff', textDecoration: 'none' }}>Moja Biblioteka</Link>
                  <Link to="#" onClick={(e) => { e.preventDefault(); alert("Opcje profilu zostaną podpięte po zintegrowaniu bazy danych (Sprint 2)."); setIsMenuOpen(false); }} style={{ color: '#fff', textDecoration: 'none' }}>Ustawienia Konta</Link>
                  <hr style={{ borderColor: '#ffffff1a', margin: '4px 0' }} />
                  <Link to="#" onClick={(e) => { e.preventDefault(); alert("Wylogowano pomyślnie! (Symulacja)"); setIsMenuOpen(false); }} style={{ color: '#ff4d4d', textDecoration: 'none' }}>Wyloguj się</Link>
                </div>
              )}
            </div>
            {/* KONIEC MENU */}
            
          </div>
        </header>

        <main className="page-main">
          <div className="main-inner">
            <Routes>
              <Route path="/" element={<Shop searchQuery={searchQuery} />} />
              <Route path="/game/:id" element={<Product />} />
              <Route path="/library" element={<Library />} />
            </Routes>
          </div>
        </main>
      </div>
    </Router>
  );
}