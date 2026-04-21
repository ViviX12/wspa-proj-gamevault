import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

export default function Auth({ setIsLoggedIn, setUserName }) {
  const navigate = useNavigate();

  // Stany dla logowania
  const [loginData, setLoginData] = useState({ login: '', password: '' });
  
  // Stany dla rejestracji
  const [registerData, setRegisterData] = useState({ username: '', email: '', password: '', confirmPassword: '' });
  const [registerError, setRegisterError] = useState('');

  // Obsługa wpisywania do formularzy
  const handleLoginChange = (e) => setLoginData({ ...loginData, [e.target.name]: e.target.value });
  const handleRegisterChange = (e) => setRegisterData({ ...registerData, [e.target.name]: e.target.value });

  // Symulacja logowania
  const handleLoginSubmit = (e) => {
    e.preventDefault();
    if (loginData.login && loginData.password) {
      // W Sprincie 3/4 tutaj pójdzie fetch() do backendu po JWT. Teraz symulujemy:
      setIsLoggedIn(true);
      setUserName(loginData.login);
      alert("Zalogowano pomyślnie!");
      navigate('/'); // Przekierowanie do sklepu
    }
  };

  // Walidacja rejestracji
  const handleRegisterSubmit = (e) => {
    e.preventDefault();
    setRegisterError('');

    if (registerData.password !== registerData.confirmPassword) {
      setRegisterError("Hasła nie są identyczne!");
      return;
    }
    if (registerData.password.length < 6) {
      setRegisterError("Hasło musi mieć co najmniej 6 znaków.");
      return;
    }

    alert(`Utworzono konto dla: ${registerData.username}. Możesz się teraz zalogować.`);
    // Czyszczenie formularza rejestracji
    setRegisterData({ username: '', email: '', password: '', confirmPassword: '' });
  };

  return (
    <div className="login-main" style={{ display: 'flex', justifyContent: 'center', marginTop: '50px', width: '100%' }}>
      <section className="auth-card" style={{ background: '#172230', padding: '40px', borderRadius: '8px', width: '100%', maxWidth: '400px' }}>
        <h1 style={{ textAlign: 'center', color: '#fff', marginBottom: '20px' }}>Logowanie</h1>

        {/* Formularz Logowania */}
        <form className="auth-form" onSubmit={handleLoginSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
          <input type="text" name="login" placeholder="Nazwa użytkownika/email..." required 
                 value={loginData.login} onChange={handleLoginChange} style={{ padding: '10px' }} />
          <input type="password" name="password" placeholder="Hasło..." required 
                 value={loginData.password} onChange={handleLoginChange} style={{ padding: '10px' }} />
          <button type="submit" className="auth-btn" style={{ background: '#7bc043', color: 'white', border: 'none', padding: '12px', cursor: 'pointer' }}>
            Zaloguj się
          </button>
        </form>

        <div className="auth-separator" style={{ height: '1px', background: 'rgba(255,255,255,0.1)', margin: '30px 0' }}></div>
        <p className="auth-note" style={{ textAlign: 'center', color: '#97a3af', marginBottom: '20px' }}>Nie masz konta? Zarejestruj się!</p>

        {/* Formularz Rejestracji z walidacją */}
        {registerError && <p style={{ color: '#ff4d4d', textAlign: 'center' }}>{registerError}</p>}
        
        <form className="auth-form" onSubmit={handleRegisterSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
          <input type="text" name="username" placeholder="Nazwa użytkownika..." required 
                 value={registerData.username} onChange={handleRegisterChange} style={{ padding: '10px' }} />
          <input type="email" name="email" placeholder="Adres email..." required 
                 value={registerData.email} onChange={handleRegisterChange} style={{ padding: '10px' }} />
          <input type="password" name="password" placeholder="Hasło..." required 
                 value={registerData.password} onChange={handleRegisterChange} style={{ padding: '10px' }} />
          <input type="password" name="confirmPassword" placeholder="Potwierdź hasło..." required 
                 value={registerData.confirmPassword} onChange={handleRegisterChange} style={{ padding: '10px' }} />
          <button type="submit" className="auth-btn" style={{ background: '#354a5f', color: 'white', border: 'none', padding: '12px', cursor: 'pointer' }}>
            Zarejestruj się
          </button>
        </form>
      </section>
    </div>
  );
}