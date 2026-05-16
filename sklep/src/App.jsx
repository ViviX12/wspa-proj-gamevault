import React, { useState, useEffect } from 'react';
import { Routes, Route, Link, Navigate, useNavigate } from 'react-router-dom';
import Shop from './components/Shop';
import Library from './components/Library';
import Product from './components/Product';
import Auth from './components/Auth';
import Cart from './components/Cart';
import './style.css';

// Komponent Toast - wyskakuje w prawym dolnym rogu
function Toast({ message, type, onClose }) {
  useEffect(() => {
    const timer = setTimeout(onClose, 3000);
    return () => clearTimeout(timer);
  }, [onClose]);

  const colors = {
    success: { bg: "#7bc043", icon: "✔" },
    error:   { bg: "#ff4d4d", icon: "✖" },
    info:    { bg: "#2563EB", icon: "ℹ" },
    warning: { bg: "#F5C518", icon: "⚠" },
  };

  const c = colors[type] || colors.info;

  return (
    <>
      <style>{`
        @keyframes slideInToast {
          from { opacity: 0; transform: translateX(60px); }
          to   { opacity: 1; transform: translateX(0); }
        }
      `}</style>
      <div style={{
        position: "fixed",
        bottom: "30px",
        right: "30px",
        background: c.bg,
        color: "#fff",
        padding: "14px 20px",
        borderRadius: "8px",
        display: "flex",
        alignItems: "center",
        gap: "12px",
        fontSize: "15px",
        fontWeight: "bold",
        boxShadow: "0 4px 20px rgba(0,0,0,0.4)",
        zIndex: 9999,
        minWidth: "280px",
        maxWidth: "380px",
        animation: "slideInToast 0.3s ease",
      }}>
        <span style={{ fontSize: "18px" }}>{c.icon}</span>
        <span style={{ flex: 1 }}>{message}</span>
        <button
          onClick={onClose}
          style={{
            background: "transparent",
            border: "none",
            color: "#fff",
            fontSize: "20px",
            cursor: "pointer",
            lineHeight: 1,
            padding: 0,
            opacity: 0.8
          }}
        >x</button>
      </div>
    </>
  );
}

export default function App() {
  const navigate = useNavigate();

  const [globalSearchQuery, setGlobalSearchQuery] = useState('');
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [userName, setUserName] = useState('');
  const [userRole, setUserRole] = useState(null); 
  const [userId, setUserId] = useState(null);
  const [userLibrary, setUserLibrary] = useState([]);
  const [cart, setCart] = useState([]);
  const [toast, setToast] = useState(null);

  const showToast = (message, type = "success") => {
    setToast({ message, type });
  };

  const hideToast = () => setToast(null);

  const fetchLibrary = (uid, token) => {
    fetch(`http://localhost:8000/library/${uid}`, {
      headers: { 'Authorization': `Bearer ${token}` }
    })
      .then(res => res.json())
      .then(data => setUserLibrary(data.map(g => g.product_id)))
      .catch(() => {});
  };

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) {
      fetch('http://localhost:8000/auth/me', {
        headers: { 'Authorization': `Bearer ${token}` }
      })
      .then(res => {
        if (!res.ok) throw new Error('Sesja wygasla');
        return res.json();
      })
      .then(userData => {
        setIsLoggedIn(true);
        setUserName(userData.display_name || userData.username);
        setUserRole(userData.role);
        setUserId(userData.user_id);
        fetchLibrary(userData.user_id, token);
      })
      .catch(() => {
        localStorage.removeItem('token');
        setIsLoggedIn(false);
        setUserName('');
        setUserRole(null);
        setUserId(null);
        setUserLibrary([]);
      });
    }
  }, []);

  const addToCart = (game) => {
    if (!cart.find(item => item.id === game.id)) {
      setCart([...cart, game]);
      showToast(`Dodano "${game.title}" do koszyka!`, "success");
    } else {
      showToast(`Gra "${game.title}" jest juz w koszyku.`, "warning");
    }
  };

  const removeFromCart = (gameId) => {
    setCart(cart.filter(item => item.id !== gameId));
  };

  const clearCart = () => {
    setCart([]);
    const token = localStorage.getItem('token');
    const uid = localStorage.getItem('user_id');
    if (token && uid) fetchLibrary(uid, token);
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user_id');
    setIsLoggedIn(false);
    setUserName('');
    setUserRole(null);
    setUserId(null);
    setUserLibrary([]);
    setIsDropdownOpen(false);
    navigate('/');
  };

  const handleAsyncNavigation = () => {
    setIsDropdownOpen(false);
  };

  return (
    <div className="page">

      {toast && (
        <Toast
          message={toast.message}
          type={toast.type}
          onClose={hideToast}
        />
      )}

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
              Koszyk ({cart.length})
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
                  <span className="user-avatar">T</span>
                </div>
                
                {isDropdownOpen && (
                  <div className="user-dropdown">
                    <Link to="/profile" onClick={() => setIsDropdownOpen(false)}>Moj profil</Link>
                    {userRole === 'admin' && <Link to="/admin" onClick={() => setIsDropdownOpen(false)}>Panel Admina</Link>}
                    <button onClick={handleLogout} className="logout-btn">Wyloguj sie</button>
                  </div>
                )}
              </div>
            </div>
          ) : (
            <div className="header-right">
              <Link to="/login" className="login-link active" onClick={handleAsyncNavigation}>Zaloguj sie</Link>
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
            
            <Route path="/game/:id" element={
              <Product addToCart={addToCart} userLibrary={userLibrary} />
            } />
            
            <Route path="/login" element={
              <Auth 
                setIsLoggedIn={setIsLoggedIn} 
                setUserName={setUserName} 
                setUserRole={setUserRole} 
                setUserId={setUserId}
                fetchLibrary={fetchLibrary}
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