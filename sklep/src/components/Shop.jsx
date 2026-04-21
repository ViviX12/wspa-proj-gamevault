import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';

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

export default function Shop({ searchQuery }) {
  const [games, setGames] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch('http://localhost:8000/products')
      .then(res => res.json())
      .then(data => {
        setGames(data.map(g => ({
          id: g.id,
          title: g.tytul,
          price: parseFloat(g.current_price),
          sales: g.total_sales || 0,
          imageUrl: imageMapper[g.tytul] || "/img/gra1.jpg"
        })));
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, []);

  const scrollToBestsellers = (e) => {
    e.preventDefault();
    const target = document.getElementById('bestsellers-section');
    if (target) {
      target.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  };

  const filteredGames = games.filter(g =>
    g.title.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const topBestsellers = [...games].sort((a, b) => b.sales - a.sales).slice(0, 5);

  if (loading) return <div style={{ color: 'white', textAlign: 'center', padding: '50px' }}>Ładowanie...</div>;

  return (
    <div className="store-layout">
      <div className="promo-banner">
        <div>Letnia <strong>Wyprzedaż!</strong></div>
        <button className="btn-link" onClick={scrollToBestsellers}>
          Sprawdź oferty
        </button>
      </div>

      <section className="section recommendations">
        <div className="section-title">
          <h2>Katalog Gier</h2>
          <span>produkty z bazy danych</span>
        </div>
        <div className="cards-row">
          {filteredGames.map(game => (
            <Link to={`/game/${game.id}`} key={game.id} className="game-card">
              <div className="game-thumb">
                <img src={game.imageUrl} alt={game.title} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
              </div>
              <div className="game-title">{game.title}</div>
              <div className="game-price">{game.price === 0 ? "FREE" : `${game.price} zł`}</div>
            </Link>
          ))}
        </div>
      </section>

      <section id="bestsellers-section" className="section top100 top100-large" style={{ scrollMarginTop: '100px' }}>
        <div className="section-title">
          <h2>Top Bestsellery</h2>
          <span>popularne w tym miesiącu</span>
        </div>
        <div className="top100-list">
          {topBestsellers.map((game) => (
            <Link to={`/game/${game.id}`} key={game.id} className="top100-item">
              <div className="mini-thumb">
                <img src={game.imageUrl} alt="" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
              </div>
              <div className="name">{game.title}</div>
              <div className="price">{game.price} zł</div>
            </Link>
          ))}
        </div>
      </section>
    </div>
  );
}