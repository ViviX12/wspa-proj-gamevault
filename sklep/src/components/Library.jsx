import React from 'react';
import { Link } from 'react-router-dom';
import { mockGames } from '../data/mockData.js';

export default function Library() {
  const ownedGames = mockGames.filter(game => game.isOwned === true);

  return (
    <div>
      <h1>Moja Biblioteka</h1>
      {ownedGames.length === 0 ? (
        <p>Nie masz gier. <Link to="/">Idź do sklepu</Link></p>
      ) : (
        <div style={{ display: 'flex', gap: '20px', flexWrap: 'wrap' }}>
          {ownedGames.map(game => (
             <div key={game.id} style={{ border: '1px solid #0056b3', padding: '15px', width: '200px' }}>
             <img src={game.imageUrl} alt={game.title} style={{ width: '100%' }} />
             <h3>{game.title}</h3>
             <button style={{ padding: '5px 10px', background: '#0056b3', color: 'white', border: 'none' }}>Zainstaluj</button>
           </div>
          ))}
        </div>
      )}
    </div>
  );
}