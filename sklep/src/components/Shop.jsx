import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { mockGames } from '../data/mockData.js';

export default function Shop() {
  const [searchQuery, setSearchQuery] = useState('');
  const filteredGames = mockGames.filter(game =>
    game.title.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div>
      <h1>Katalog Gier</h1>
      <input 
        type="text" placeholder="Szukaj gry..." value={searchQuery}
        onChange={(e) => setSearchQuery(e.target.value)}
        style={{ padding: '10px', width: '300px', marginBottom: '20px' }}
      />
      <div style={{ display: 'flex', gap: '20px', flexWrap: 'wrap' }}>
        {filteredGames.length > 0 ? (
          filteredGames.map(game => (
            <div key={game.id} style={{ border: '1px solid #ccc', padding: '15px', width: '200px' }}>
              <img src={game.imageUrl} alt={game.title} style={{ width: '100%' }} />
              <h3>{game.title}</h3>
              <p>Cena: {game.price} zł</p>
              <Link to={`/game/${game.id}`}>
                <button style={{ cursor: 'pointer', padding: '5px 10px' }}>Zobacz szczegóły</button>
              </Link>
            </div>
          ))
        ) : ( <p>Nie znaleziono gier.</p> )}
      </div>
    </div>
  );
}