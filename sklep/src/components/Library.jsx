import React, { useState, useEffect } from 'react';

const imageMapper = {
  "Cyberpunk 2077": "/img/gra1.jpg",
  "Wiedźmin 3": "/img/gra2.jpg",
  "EA FC 26": "/img/gra3.jpg",
  "Grand Theft Auto V": "/img/gra4.jpg",
  "Red Dead Redemption 2": "/img/gra5.jpg",
  "Counter-Strike 2": "/img/gra6.jpg",
  "Hogwarts Legacy": "/img/gra7.jpg",
  "Minecraft": "/img/gra8.jpg"
};

// Komponent Toast - popup który wyskakuje w rogu
function Toast({ message, type, onClose }) {
  useEffect(() => {
    const timer = setTimeout(onClose, 3000);
    return () => clearTimeout(timer);
  }, [onClose]);

  const colors = {
    success: { bg: "#7bc043", icon: "✔" },
    error:   { bg: "#ff4d4d", icon: "✖" },
    info:    { bg: "#2563EB", icon: "ℹ" },
  };

  const c = colors[type] || colors.info;

  return (
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
      animation: "slideIn 0.3s ease",
    }}>
      <span style={{ fontSize: "18px" }}>{c.icon}</span>
      <span style={{ flex: 1 }}>{message}</span>
      <button
        onClick={onClose}
        style={{
          background: "transparent",
          border: "none",
          color: "#fff",
          fontSize: "18px",
          cursor: "pointer",
          lineHeight: 1,
          padding: 0,
          opacity: 0.8
        }}
      >×</button>
    </div>
  );
}

export default function Library({ searchQuery = "" }) {
  const [games, setGames] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [installingId, setInstallingId] = useState(null);
  const [progress, setProgress] = useState(0);
  const [installedGames, setInstalledGames] = useState(() => {
    const saved = localStorage.getItem('installedGames');
    return saved ? JSON.parse(saved) : [];
});
  const [toast, setToast] = useState(null); // { message, type }

  const showToast = (message, type = "success") => {
    setToast({ message, type });
  };

  const hideToast = () => setToast(null);

  useEffect(() => {
    const userId = localStorage.getItem('user_id');
    const token = localStorage.getItem('token');

    if (!userId || !token) {
      setError("Musisz być zalogowany żeby zobaczyć swoją bibliotekę.");
      setLoading(false);
      return;
    }

    fetch(`http://localhost:8000/library/${userId}`, {
      headers: { 'Authorization': `Bearer ${token}` }
    })
      .then(res => {
        if (!res.ok) throw new Error("Błąd serwera");
        return res.json();
      })
      .then(data => {
        setGames(data.map(g => ({
          id: g.product_id,
          title: g.tytul,
          imageUrl: imageMapper[g.tytul] || "/img/gra1.jpg"
        })));
        setLoading(false);
      })
      .catch(err => {
        setError("Brak połączenia z bazą danych. Upewnij się że serwer backendowy jest uruchomiony.");
        setLoading(false);
      });
  }, []);

  const handleAction = (gameId, gameTitle) => {
    if (installedGames.includes(gameId)) {
      showToast(`${gameTitle} jest gotowa do uruchomienia!`, "info");
      return;
    }
    if (installingId === gameId) return;

    setInstallingId(gameId);
    setProgress(0);
    showToast(`Rozpoczęto instalację: ${gameTitle}`, "info");

    const interval = setInterval(() => {
      setProgress(p => {
        if (p >= 100) {
          clearInterval(interval);
          setInstallingId(null);
          setInstalledGames(c => {
            const updated = [...c, gameId];
            localStorage.setItem('installedGames', JSON.stringify(updated));
            return updated;
          });
          showToast(`${gameTitle} została zainstalowana!`, "success");
          return 100;
        }
        return p + 25;
      });
    }, 400);
  };

  const filteredGames = games.filter(g =>
    g.title.toLowerCase().includes(searchQuery.toLowerCase())
  );

  if (loading) return (
    <div style={{ color: 'white', textAlign: 'center', padding: '50px' }}>
      Ładowanie biblioteki...
    </div>
  );

  if (error) return (
    <div style={{ color: '#ff4d4d', textAlign: 'center', padding: '50px', fontSize: '18px' }}>
      {error}
    </div>
  );

  return (
    <>
      {/* Animacja CSS */}
      <style>{`
        @keyframes slideIn {
          from { opacity: 0; transform: translateX(60px); }
          to   { opacity: 1; transform: translateX(0); }
        }
      `}</style>

      {/* Toast notification */}
      {toast && (
        <Toast
          message={toast.message}
          type={toast.type}
          onClose={hideToast}
        />
      )}

      <section className="section my-library animate-fade-in" style={{ marginTop: '30px', maxWidth: '100%' }}>
        <div className="section-title">
          <h2>Moja Biblioteka</h2>
          <span>Twoje gry ({filteredGames.length})</span>
        </div>
        <div className="cards-row">
          {filteredGames.length > 0 ? (
            filteredGames.map(game => (
              <div key={game.id} className="game-card">
                <div className="game-thumb">
                  <img
                    src={game.imageUrl}
                    alt={game.title}
                    style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                  />
                </div>
                <div className="game-title">{game.title}</div>
                <button
                  className="buy-btn"
                  onClick={() => handleAction(game.id, game.title)}
                  style={{
                    marginTop: '10px',
                    width: '100%',
                    background: installedGames.includes(game.id) ? '#1f2f40' : '#7bc043'
                  }}
                >
                  {installingId === game.id
                    ? `${progress}%`
                    : (installedGames.includes(game.id) ? '▶ GRAJ' : '⬇ INSTALUJ')}
                </button>
              </div>
            ))
          ) : (
            <div style={{ padding: '40px', textAlign: 'center', width: '100%', color: '#97a3af' }}>
              {games.length === 0
                ? "Twoja biblioteka jest pusta. Kup gry w sklepie!"
                : `Brak gier dla frazy: "${searchQuery}"`}
            </div>
          )}
        </div>
      </section>
    </>
  );
}