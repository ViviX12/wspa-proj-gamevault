import React from 'react';
import { Link } from 'react-router-dom';
import { mockGames } from '../data/mockData.js';

export default function Shop({ searchQuery }) {
  // Filtrowanie gier po wpisanej frazie z głównego paska nawigacji
  const filteredGames = mockGames.filter(game =>
    game.title.toLowerCase().includes(searchQuery.toLowerCase())
  );

  // Wyciągamy top 5 najlepiej sprzedających się gier do rankingu
  const topBestsellers = [...mockGames]
    .sort((a, b) => b.sales - a.sales)
    .slice(0, 5); 

  return (
    <div className="store-layout animate-fade-in">
      
      {/* Główny baner wyprzedaży */}
      <div className="promo-banner">
        <div>Letnia <strong>Wyprzedaż!</strong></div>
        <button 
          className="btn-link" 
          onClick={() => document.getElementById('bestsellers')?.scrollIntoView({ behavior: 'smooth' })}
          style={{ background: 'transparent', border: '1px solid #fff', cursor: 'pointer', fontSize: '16px', color: '#fff', textDecoration: 'none' }}
        >
          Sprawdź oferty
        </button>
      </div>

      {/* Lista wszystkich gier / Wyniki wyszukiwania */}
      <section className="section recommendations">
        <div className="section-title">
          <h2>Katalog Gier</h2>
          <span>wyniki wyszukiwania</span>
        </div>

        <div className="cards-row">
          {filteredGames.length > 0 ? (
            filteredGames.map(game => (
              <Link to={`/game/${game.id}`} key={game.id} className="game-card" style={{ textDecoration: 'none' }}>
                <div className="game-thumb">
                  {/* Ładujemy lokalne grafiki z folderu img */}
                  <img 
                    src={game.imageUrl} 
                    alt={game.title} 
                    style={{ width: '100%', height: '100%', objectFit: 'cover' }} 
                  />
                </div>
                <div className="game-title">{game.title}</div>
                <div className="game-price">{game.price === 0 ? "Darmowa" : `${game.price} zł`}</div>
              </Link>
            ))
          ) : (
             <p style={{ color: 'white', padding: '20px' }}>Nie znaleziono gier.</p> 
          )}
        </div>
      </section>

      {/* Sekcja bestsellerów - dynamicznie generowany ranking */}
      <section id="bestsellers" className="section top100 top100-large">
        <div className="section-title">
          <h2>Top Bestsellery</h2>
          <span>w tym miesiącu</span>
        </div>
        <div className="top100-list">
          {topBestsellers.map((game, index) => (
            <Link to={`/game/${game.id}`} key={game.id} className="top100-item" style={{ textDecoration: 'none' }}>
              
              <div className="mini-thumb" style={{ position: 'relative', display: 'flex', alignItems: 'center', justifyContent: 'center', backgroundColor: '#1a2634', overflow: 'hidden', borderRadius: '4px' }}>
                
                <img 
                  src={game.imageUrl} 
                  alt={game.title} 
                  style={{ width: '100%', height: '100%', objectFit: 'cover', position: 'absolute', top: 0, left: 0 }} 
                />
                
                {/* Okrągły znaczek z pozycją na liście top 5 */}
                <span style={{ 
                  position: 'relative', 
                  zIndex: 2, 
                  fontWeight: 'bold', 
                  color: '#fff',
                  backgroundColor: 'rgba(0, 0, 0, 0.7)',
                  width: '32px',
                  height: '32px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  borderRadius: '50%',
                  fontSize: '18px',
                  boxShadow: '0px 2px 5px rgba(0,0,0,0.5)'
                }}>
                  {index + 1}
                </span>

              </div>
              
              <div className="name">{game.title}</div>
              <div className="price">{game.price === 0 ? "Darmowa" : `${game.price} zł`}</div>
              
            </Link>
          ))}
        </div>
      </section>

    </div>
  );
}