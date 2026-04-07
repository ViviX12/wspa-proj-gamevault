import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { mockGames } from '../data/mockData.js';

export default function Library() {
  // Stany dla paska wyszukiwania i sortowania (tylko wewnątrz biblioteki)
  const [libSearchQuery, setLibSearchQuery] = useState('');
  const [sortOption, setSortOption] = useState('recent');

  // Potrzebne do animacji przycisku pobierania
  const [installingId, setInstallingId] = useState(null);
  const [progress, setProgress] = useState(0);
  const [installedGames, setInstalledGames] = useState([]);

  // Bierzemy tylko te gry, które gracz ma kupione
  let ownedGames = mockGames.filter(game => game.isOwned === true);

  // Działanie paska szukania w bibliotece
  if (libSearchQuery) {
    ownedGames = ownedGames.filter(game => 
      game.title.toLowerCase().includes(libSearchQuery.toLowerCase())
    );
  }

  // Proste sortowanie wyników
  if (sortOption === 'alpha') {
    ownedGames.sort((a, b) => a.title.localeCompare(b.title));
  } else if (sortOption === 'recent') {
    ownedGames.sort((a, b) => b.id - a.id); // Najnowsze na górze
  }

  // Symulacja instalacji gry po kliknięciu
  const handleAction = (id) => {
    if (installedGames.includes(id)) {
      alert("Uruchamianie gry... (Sprint 3)");
      return;
    }

    setInstallingId(id);
    setProgress(0);
    const interval = setInterval(() => {
      setProgress(old => {
        if (old >= 100) {
          clearInterval(interval);
          setTimeout(() => {
            setInstallingId(null);
            setInstalledGames(prev => [...prev, id]); 
          }, 1000);
          return 100;
        }
        return old + 20; // Prędkość ładowania paska
      });
    }, 200);
  };

return (
    <div className="store-layout animate-fade-in">
      
      <div className="promo-banner">
        <div>Witaj w swojej <strong>Bibliotece!</strong></div>
        <Link to="/" className="btn-link">Kup nowe gry</Link>
      </div>

      <section className="section recommendations library-view">
        <div className="section-title">
          <h2>Moja Biblioteka</h2>
          <span>posiadane gry</span>
        </div>

        {/* Kontrolki sortowania od Krzyśka */}
        <div className="library-filters" style={{ display: 'flex', gap: '15px', marginBottom: '30px' }}>
          <input 
            type="text" 
            className="search" 
            placeholder="Szukaj w bibliotece..." 
            value={libSearchQuery}
            onChange={(e) => setLibSearchQuery(e.target.value)}
            style={{ flex: 1, padding: '10px', background: '#1a2634', border: '1px solid #2c3e50', color: '#fff', borderRadius: '4px' }}
          />
          <select 
            className="filter-select"
            value={sortOption}
            onChange={(e) => setSortOption(e.target.value)}
            style={{ padding: '10px', background: '#1a2634', border: '1px solid #2c3e50', color: '#fff', borderRadius: '4px', cursor: 'pointer' }}
          >
            <option value="recent">Ostatnio dodane</option>
            <option value="alpha">Alfabetycznie A-Z</option>
          </select>
        </div>

        {/* Wyświetlanie samych gier */}
        <div className="cards-row">
          {ownedGames.length === 0 ? (
            <p style={{ color: 'white', width: '100%' }}>Brak gier pasujących do wyszukiwania.</p>
          ) : (
            ownedGames.map(game => {
              const isInstalled = installedGames.includes(game.id);
              const isInstalling = installingId === game.id;

              return (
                <div key={game.id} className="game-card">
                  <Link to={`/game/${game.id}`} style={{ textDecoration: 'none', color: 'inherit' }}>
                    <div className="game-thumb">
                      <img src={game.imageUrl} alt={game.title} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                    </div>
                    <div className="game-title">{game.title}</div>
                    <div className="game-meta" style={{ fontSize: '12px', color: '#888', marginTop: '5px' }}>
                      {isInstalled ? "Status: Zainstalowana" : "Status: W chmurze"}
                    </div>
                  </Link>

                  {/* Logika przycisku pobierania / odpalania gry */}
                  <button 
                    className="buy-btn" 
                    onClick={() => handleAction(game.id)}
                    disabled={isInstalling}
                    style={{ 
                      marginTop: '15px', width: '100%', fontSize: '14px', padding: '8px', 
                      position: 'relative', overflow: 'hidden', cursor: isInstalling ? 'default' : 'pointer',
                      background: isInstalled ? '#2c3e50' : '#007bff', border: 'none', color: '#fff', borderRadius: '4px'
                    }}
                  >
                    {isInstalling ? (
                      <>
                        <div style={{ position: 'absolute', top: 0, left: 0, height: '100%', width: `${progress}%`, background: '#28a745', transition: 'width 0.2s', zIndex: 1 }} />
                        <span style={{ position: 'relative', zIndex: 2 }}>
                          {progress < 100 ? `Pobieranie ${progress}%` : 'Zakończono!'}
                        </span>
                      </>
                    ) : (
                      isInstalled ? '▶ Graj' : '⬇ Zainstaluj'
                    )}
                  </button>
                </div>
              );
            })
          )}
        </div>
      </section>
    </div>
  );
}