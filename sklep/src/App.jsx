import React, { useState } from 'react';
import { Routes, Route, Link, Navigate } from 'react-router-dom';
import Shop from './components/Shop';
import Library from './components/Library';
import Product from './components/Product';
import Auth from './components/Auth';
import Cart from './components/Cart';
import './style.css';

export default function App() {
  // STANY GLOBALNE 
  const [globalSearchQuery, setGlobalSearchQuery] = useState('');
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  
  // Stan logowania
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [userName, setUserName] = useState('');
  const [userRole, setUserRole] = useState(null); // 'admin' lub 'user'

  // Stan koszyka 
  const [cart, setCart] = useState([]);

  //LOGIKA BIZNESOWA 

  // Dodawanie do koszyka
  const addToCart = (game) => {
    if (!cart.find(item => item.id === game.id)) {
      setCart([...cart, game]);
      alert(`Dodano "${game.title}" do koszyka!`);
    } else {
      alert(`Gra "${game.title}" jest już w Twoim koszyku.`);
    }
  };

  // Usuwanie z koszyka
  const removeFromCart = (gameId) => {
    setCart(cart.filter(item => item.id !== gameId));
  };

  // Nawigacja (resetowanie wyszukiwania i scroll do góry)
  const handleAsyncNavigation = () => {
    setGlobalSearchQuery('');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // Wylogowanie
  const handleLogout = () => {
    localStorage.removeItem('token'); // USUWA JWT!
    setIsLoggedIn(false);
    setUserName('');
    setUserRole(null); // Reset roli
    setIsDropdownOpen(false);
    setCart([]);
    alert("Wylogowano pomyślnie.");
  };

  return (
    <div className="page">
      {/*NAGŁÓWEK (ZGODNY Z FIGMĄ)*/}
      <header className="header">
        <div className="header-inner">
          <Link to="/" className="logo" onClick={handleAsyncNavigation}>
            <span className="game">GAME</span><span className="vault">VAULT</span>
          </Link>

          <nav className="nav">
            <Link to="/" onClick={handleAsyncNavigation}>SKLEP</Link>
            {isLoggedIn && (
              <Link to="/library" onClick={handleAsyncNavigation}>BIBLIOTEKA</Link>
            )}
            <Link to="/cart" onClick={handleAsyncNavigation} style={{ color: cart.length > 0 ? '#7bc043' : '' }}>
              KOSZYK {cart.length > 0 && `(${cart.length})`}
            </Link>
          </nav>

          <input 
            type="text" 
            className="search" 
            placeholder="Szukaj gier..." 
            value={globalSearchQuery}
            onChange={(e) => setGlobalSearchQuery(e.target.value)}
          />

          {isLoggedIn ? (
            <div className="header-right" style={{ display: 'flex', alignItems: 'center', gap: '20px' }}>
              {/* Ikonka powiadomień */}
              <div style={{ cursor: 'pointer', fontSize: '18px' }}>🔔</div>

              {/* Panel Użytkownika z Awatarem */}
              <div 
                style={{ position: 'relative', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '10px' }} 
                onClick={() => setIsDropdownOpen(!isDropdownOpen)}
              >
                <span style={{ fontWeight: '500' }}>{userName} ▼</span>
                
                {/* Awatar z inicjałem */}
                <div style={{ 
                  width: '35px', height: '35px', borderRadius: '50%', background: '#7bc043', 
                  display: 'flex', justifyContent: 'center', alignItems: 'center', 
                  color: '#fff', fontWeight: 'bold', fontSize: '16px' 
                }}>
                  {userName.charAt(0).toUpperCase()}
                </div>

                {/* Dropdown menu */}
                {isDropdownOpen && (
                  <div style={{ 
                    position: 'absolute', top: '120%', right: 0, background: '#172230', 
                    padding: '10px', zIndex: 100, borderRadius: '4px', minWidth: '150px',
                    border: '1px solid rgba(255,255,255,0.1)', boxShadow: '0 10px 20px rgba(0,0,0,0.5)'
                  }}>
                    <div className="dropdown-item" style={{ padding: '8px', cursor: 'pointer' }}>Mój profil</div>
                    <div className="dropdown-item" style={{ padding: '8px', cursor: 'pointer', color: '#ff4d4d' }} onClick={handleLogout}>
                      Wyloguj
                    </div>
                  </div>
                )}
              </div>
            </div>
          ) : (
            <div className="header-right">
              <Link to="/login" className="login-link active" onClick={handleAsyncNavigation}>Zaloguj się</Link>
            </div>
          )}
        </div>
      </header>

      {/*GŁÓWNA TREŚĆ (ROUTING)*/}
      <main className="page-main">
        <div className="main-inner">
          <Routes>
            {/* Sklep */}
            <Route path="/" element={<Shop searchQuery={globalSearchQuery} />} />
            
            {/* Biblioteka (Chroniona: tylko dla zalogowanych) */}
            <Route path="/library" element={
              isLoggedIn ? <Library searchQuery={globalSearchQuery} /> : <Navigate to="/login" />
            } />
            
            {/* Szczegóły produktu */}
            <Route path="/game/:id" element={<Product addToCart={addToCart} />} />
            
            {/* Logowanie/Rejestracja */}
            <Route path="/login" element={<Auth setIsLoggedIn={setIsLoggedIn} setUserName={setUserName} setUserRole={setUserRole} />} />
            
            {/* Koszyk */}
            <Route path="/cart" element={<Cart cart={cart} removeFromCart={removeFromCart} />} />
            
            {/* Catch-all: powrót do sklepu jeśli ścieżka nie istnieje */}
            <Route path="*" element={<Navigate to="/" />} />
          </Routes>
        </div>
      </main>
    </div>
  );
}