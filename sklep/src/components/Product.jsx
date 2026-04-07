import React, { useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { mockGames } from '../data/mockData.js';

export default function Product() {
  const { id } = useParams();
  const game = mockGames.find(g => g.id === id);
  
  // Prosty stan, żeby zmienić tekst po kliknięciu "Dodaj do koszyka"
  const [addedToCart, setAddedToCart] = useState(false);

  if (!game) return <h2 style={{ color: 'white', textAlign: 'center', marginTop: '50px' }}>Błąd 404: Nie znaleziono gry!</h2>;

  const handleAddToCart = () => {
    setAddedToCart(true);
    // Reset po 2 sekundach
    setTimeout(() => setAddedToCart(false), 2000);
  };

  return (
    <section className="product-page-single animate-fade-in">
      <div className="back-link-wrap">
        <Link to="/" className="back-link">← Powrót do sklepu</Link>
      </div>

      <div className="product-view product-view-single" style={{ display: 'grid' }}>
        
        {/* Wyświetlanie samej okładki (zrezygnowaliśmy z karuzeli, żeby było czytelniej) */}
        <div className="product-gallery" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <div className="product-main-image" style={{ aspectRatio: '1/1', overflow: 'hidden', borderRadius: '4px', backgroundColor: '#1a2634', border: '1px solid #ffffff1a', width: '100%', maxWidth: '450px' }}>
            <img 
              src={game.imageUrl} 
              alt={game.title} 
              style={{ width: '100%', height: '100%', objectFit: 'cover' }} 
            />
          </div>
        </div>

        <div className="product-info">
          <h1 className="product-title">{game.title}</h1>

          <div className="product-meta">
            Wydanie: Cyfrowe<br />
            Sprzedaż: {game.sales} kopii<br />
            Status: {game.isOwned ? <span style={{color: '#7bc043'}}>W bibliotece</span> : "Brak w bibliotece"}<br />
          </div>

          <div className="rating">
            <div className="stars" style={{ color: '#f0c84b' }}>★★★★★</div>
            <div>(Brak recenzji)</div>
          </div>

          <div className="product-desc" style={{ marginTop: '20px', lineHeight: '1.6' }}>
            {game.description}
          </div>

          <div className="price-row" style={{ marginTop: '30px', marginBottom: '20px' }}>
            <span className="new-price" style={{ fontSize: '24px', fontWeight: 'bold' }}>
              {game.price === 0 ? "Darmowa" : `${game.price} zł`}
            </span>
          </div>

          {/* Obsługa przycisku kupowania */}
          <button 
            className="buy-btn" 
            onClick={handleAddToCart}
            style={{ 
              backgroundColor: addedToCart ? '#7bc043' : '', 
              transition: 'background-color 0.3s ease',
              cursor: 'pointer'
            }}
          >
            {addedToCart ? '✓ Dodano do koszyka!' : 'Dodaj do koszyka'}
          </button>
        </div>
      </div>
    </section>
  );
}