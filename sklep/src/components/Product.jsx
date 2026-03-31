import React from 'react';
import { useParams, Link } from 'react-router-dom';
import { mockGames } from '../data/mockData.js';

export default function Product() {
  const { id } = useParams();
  const game = mockGames.find(g => g.id === id);

  if (!game) return <h2>Błąd 404: Nie znaleziono gry!</h2>;

  return (
    <div>
      <Link to="/">⬅ Wróć do sklepu</Link>
      <h1>{game.title}</h1>
      <img src={game.imageUrl} alt={game.title} />
      <h2>Cena: {game.price} zł</h2>
      <p>{game.description}</p>
      <button style={{ padding: '10px 20px', background: 'green', color: 'white', border: 'none' }}>
        Dodaj do koszyka (Sprint 2)
      </button>
    </div>
  );
}