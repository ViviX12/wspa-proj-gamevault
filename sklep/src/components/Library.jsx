import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';

const imageMapper = {
  "Cyberpunk 2077": "/img/gra1.jpg", "Wiedźmin 3": "/img/gra2.jpg", "EA FC 26": "/img/gra3.jpg",
  "Grand Theft Auto V": "/img/gra4.jpg", "Red Dead Redemption 2": "/img/gra5.jpg",
  "Counter-Strike 2": "/img/gra6.jpg", "Hogwarts Legacy": "/img/gra7.jpg", "Minecraft": "/img/gra8.jpg"
};

export default function Library() {
  const [games, setGames] = useState([]);
  const [loading, setLoading] = useState(true);
  const [installingId, setInstallingId] = useState(null);
  const [progress, setProgress] = useState(0);
  const [installedGames, setInstalledGames] = useState([]);

  useEffect(() => {
    fetch('http://localhost:8000/products')
      .then(res => res.json())
      .then(data => {
        setGames(data.map(g => ({ id: g.id, title: g.tytul, imageUrl: imageMapper[g.tytul] || "/img/gra1.jpg" })));
        setLoading(false);
      });
  }, []);

  const handleAction = (gameId) => {
    if (installedGames.includes(gameId)) {
      alert("Status: Gra jest gotowa.\n\nIntegracja z klientem desktopowym zostanie sfinalizowana w Sprincie 4.");
      return;
    }
    if (installingId === gameId) return;
    setInstallingId(gameId);
    setProgress(0);
    const interval = setInterval(() => {
      setProgress(p => {
        if (p >= 100) { clearInterval(interval); setInstallingId(null); setInstalledGames(c => [...c, gameId]); return 100; }
        return p + 25;
      });
    }, 400);
  };

  if (loading) return <div style={{ color: 'white', textAlign: 'center', padding: '50px' }}>Ładowanie...</div>;

  return (
    <section className="section my-library animate-fade-in" style={{ marginTop: '30px', maxWidth: '100%' }}>
      <div className="section-title">
        <h2>Moja Biblioteka</h2>
        <span>Twoje gry ({games.length})</span>
      </div>
      <div className="cards-row">
        {games.map(game => (
          <div key={game.id} className="game-card">
            <div className="game-thumb"><img src={game.imageUrl} alt={game.title} style={{ width: '100%', height: '100%', objectFit: 'cover' }} /></div>
            <div className="game-title">{game.title}</div>
            <button className="buy-btn" onClick={() => handleAction(game.id)} style={{ marginTop: '10px', width: '100%', background: installedGames.includes(game.id) ? '#1f2f40' : '#7bc043' }}>
              {installingId === game.id ? `${progress}%` : (installedGames.includes(game.id) ? '▶ GRAJ' : '⬇ INSTALUJ')}
            </button>
          </div>
        ))}
      </div>
    </section>
  );
}