import React, { useState, useEffect } from 'react';
import { Routes, Route, Link, Navigate, useNavigate } from 'react-router-dom';
import Shop from './components/Shop';
import Library from './components/Library';
import Product from './components/Product';
import Auth from './components/Auth';
import Cart from './components/Cart';
import './style.css';

export default function App() {
  const navigate = useNavigate();

  // --- STANY GLOBALNE ---
  const [globalSearchQuery, setGlobalSearchQuery] = useState('');
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  
  // Stan logowania i dane użytkownika
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [userName, setUserName] = useState('');
  const [userRole, setUserRole] = useState(null); 
  const [userId, setUserId] = useState(null); // Stan na ID użytkownika z backendu

  // Stan koszyka 
  const [cart, setCart] = useState([]);

  // --- LOGIKA SESJI (AUTO-LOGOWANIE PO ODŚWIEŻENIU) ---
  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) {
      // Sprawdzamy czy token jest ważny i pobieramy dane użytkownika
      fetch('http://localhost:8000/auth/me', {
        headers: { 'Authorization': `Bearer ${token}` }
      })
      .then(res => {
        if (!res.ok) throw new Error('Sesja wygasła');
        return res.json();
      })
      .then(userData => {
        // Ustawiamy dane w aplikacji
        setIsLoggedIn(true);
        setUserName(userData.display_name || userData.username);
        setUserRole(userData.role);
        setUserId(userData.user_id); // To kluczowa zmiana pod Twoje API!
      })
      .catch(() => {
        // Jeśli błąd (np. wygasł token), czyścimy dane
        localStorage.removeItem('token');
        setIsLoggedIn(false);
        setUserName('');
        setUserRole(null);
        setUserId(null);
      });
    }
  }, []);

  // --- LOGIKA BIZNESOWA ---

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

  // Czyszczenie koszyka (wywoływane po udanym zakupie w Cart.jsx)
  const clearCart = () => {
    setCart([]);
  };

  // Wylogowanie
  const handleLogout = () => {
    localStorage.removeItem('token');
    setIsLoggedIn(false);
    setUserName('');
    setUserRole(null);
    setUserId(null);
    setIsDropdownOpen(false);
    navigate('/');
  };

  const handleAsyncNavigation = () => {
    setIsDropdownOpen(false);
  };

  return (
    <div className="page">
      <header className="header">
        <div className="header-inner">
          <Link to="/" className="logo" onClick={handleAsyncNavigation}>
            <span className="game">Game</span><span className="vault">Vault</span>
          </Link>

          <nav className="nav">
            <Link to="/" className={window.location.pathname === '/' ? 'nav-active' : ''}>Sklep</Link>
            <Link to="/library" className={window.location.pathname === '/library' ? 'nav-active' : ''}>Biblioteka</Link>
            
          </nav>

          <div className="search-wrap">
             <input 
              id="main-search"
              name="search"
              className="search" 
              type="text" 
              placeholder="Szukaj gier..." 
              value={globalSearchQuery}
              onChange={(e) => setGlobalSearchQuery(e.target.value)}
            />
          </div>

          <div className="cart-nav">
             <Link to="/cart" className="cart-link">
                🛒 Koszyk ({cart.length})
             </Link>
          </div>

          {isLoggedIn ? (
            <div className="header-right">
              <div className="user-profile-container">
                <div 
                  className="user-profile-trigger" 
                  onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                >
                  <span className="user-name">{userName}</span>
                  <span className="user-avatar">👤</span>
                </div>
                
                {isDropdownOpen && (
                  <div className="user-dropdown">
                    <Link to="/profile" onClick={() => setIsDropdownOpen(false)}>Mój profil</Link>
                    {userRole === 'admin' && <Link to="/admin" onClick={() => setIsDropdownOpen(false)}>Panel Admina</Link>}
                    <button onClick={handleLogout} className="logout-btn">Wyloguj się</button>
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

      <main className="page-main">
        <div className="main-inner">
          <Routes>
            <Route path="/" element={<Shop searchQuery={globalSearchQuery} />} />
            
            <Route path="/library" element={
              isLoggedIn ? <Library searchQuery={globalSearchQuery} /> : <Navigate to="/login" />
            } />
            
            <Route path="/game/:id" element={<Product addToCart={addToCart} />} />
            
            <Route path="/login" element={
              <Auth 
                setIsLoggedIn={setIsLoggedIn} 
                setUserName={setUserName} 
                setUserRole={setUserRole} 
                setUserId={setUserId} 
              />
            } />
            
            <Route path="/cart" element={
              <Cart cart={cart} removeFromCart={removeFromCart} clearCart={clearCart} />
            } />
            
            <Route path="*" element={<Navigate to="/" />} />
          </Routes>
        </div>
      </main>
    </div>
  );
}