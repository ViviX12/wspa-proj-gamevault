import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

export default function Auth({ setIsLoggedIn, setUserName, setUserRole }) {
  const navigate = useNavigate();

  const [loginData, setLoginData] = useState({ login: '', password: '' });
  const [loginError, setLoginError] = useState('');
  
  const [registerData, setRegisterData] = useState({ username: '', email: '', password: '', confirmPassword: '' });
  const [registerError, setRegisterError] = useState('');

  const handleLoginChange = (e) => setLoginData({ ...loginData, [e.target.name]: e.target.value });
  const handleRegisterChange = (e) => setRegisterData({ ...registerData, [e.target.name]: e.target.value });

  const handleLoginSubmit = async (e) => {
    e.preventDefault();
    setLoginError('');

    try {
      const response = await fetch('http://localhost:8000/auth/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email: loginData.login, // Pamiętaj: tu musi być adres EMAIL użyty przy rejestracji
          password: loginData.password
        }),
      });

      // Najpierw sprawdzamy, czy w ogóle jest jakaś treść w odpowiedzi
      const text = await response.text();
      const data = text ? JSON.parse(text) : null;

      if (!response.ok) {
        // Jeśli backend zwrócił błąd (np. 401 lub 422), wypiszemy szczegóły
        const errorMessage = data && data.detail 
          ? (typeof data.detail === 'string' ? data.detail : JSON.stringify(data.detail)) 
          : 'Błąd logowania';
        throw new Error(errorMessage);
      }

      if (!data || !data.access_token) {
        throw new Error('Serwer nie zwrócił tokena dostępu.');
      }

      // Jeśli wszystko OK, zapisujemy token
      localStorage.setItem('token', data.access_token);

      // Pobieramy dane profilu
      const meResponse = await fetch('http://localhost:8000/auth/me', {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${data.access_token}`
        }
      });

      if (!meResponse.ok) throw new Error('Nie udało się pobrać danych profilu');

      const userData = await meResponse.json();

      setIsLoggedIn(true);
      setUserName(userData.display_name || userData.username);
      setUserRole(userData.role);

      alert(`Zalogowano pomyślnie!`);
      navigate('/');
      
    } catch (error) {
      console.error('Szczegóły błędu:', error);
      setLoginError(error.message);
    }
  };

  const handleRegisterSubmit = async (e) => {
    e.preventDefault();
    setRegisterError('');

    if (registerData.password !== registerData.confirmPassword) {
      setRegisterError("Hasła nie są identyczne!");
      return;
    }

    try {
      const response = await fetch('http://localhost:8000/auth/register', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          username: registerData.username,
          email: registerData.email,
          password: registerData.password
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.detail || 'Błąd rejestracji!');
      }

      alert(`Utworzono konto dla: ${registerData.username}. Możesz się teraz zalogować.`);
      setRegisterData({ username: '', email: '', password: '', confirmPassword: '' });
      
    } catch (error) {
      setRegisterError(error.message);
    }
  };

  return (
    <div className="login-main" style={{ display: 'flex', justifyContent: 'center', marginTop: '50px', width: '100%' }}>
      <section className="auth-card" style={{ background: '#172230', padding: '40px', borderRadius: '8px', width: '100%', maxWidth: '400px' }}>
        <h1 style={{ textAlign: 'center', color: '#fff', marginBottom: '20px' }}>Logowanie</h1>

        {loginError && <p style={{ color: '#ff4d4d', textAlign: 'center', marginBottom: '10px' }}>{loginError}</p>}

        <form className="auth-form" onSubmit={handleLoginSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
          <input type="text" name="login" placeholder="Twój email..." required 
                 value={loginData.login} onChange={handleLoginChange} style={{ padding: '10px' }} />
          <input type="password" name="password" placeholder="Hasło..." required 
                 value={loginData.password} onChange={handleLoginChange} style={{ padding: '10px' }} />
          <button type="submit" className="auth-btn" style={{ background: '#7bc043', color: 'white', border: 'none', padding: '12px', cursor: 'pointer' }}>
            Zaloguj się
          </button>
        </form>

        <div className="auth-separator" style={{ height: '1px', background: 'rgba(255,255,255,0.1)', margin: '30px 0' }}></div>
        <p className="auth-note" style={{ textAlign: 'center', color: '#97a3af', marginBottom: '20px' }}>Nie masz konta? Zarejestruj się!</p>

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