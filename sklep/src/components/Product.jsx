import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';

const imageMapper = {
  "Cyberpunk 2077": "/img/gra1.jpg", "Wiedźmin 3": "/img/gra2.jpg", "EA FC 26": "/img/gra3.jpg",
  "Grand Theft Auto V": "/img/gra4.jpg", "Red Dead Redemption 2": "/img/gra5.jpg",
  "Counter-Strike 2": "/img/gra6.jpg", "Hogwarts Legacy": "/img/gra7.jpg", "Minecraft": "/img/gra8.jpg"
};

export default function Product() {
  const { id } = useParams();
  const [game, setGame] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch('http://localhost:8000/products')
      .then(res => res.json())
      .then(data => {
        const found = data.find(p => p.id === id);
        if (found) setGame({ ...found, imageUrl: imageMapper[found.tytul] || "/img/gra1.jpg" });
        setLoading(false);
      });
  }, [id]);

  if (loading) return <div style={{ color: 'white', textAlign: 'center', padding: '50px' }}>Ładowanie...</div>;

  return (
    <section className="animate-fade-in" style={{ padding: '20px 0' }}>
      <Link to="/" style={{ color: '#aaa', display: 'block', marginBottom: '20px' }}>← Powrót do sklepu</Link>
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '40px' }}>
        <div className="product-main-image" style={{ height: 'auto' }}>
          <img src={game.imageUrl} alt={game.tytul} style={{ width: '100%', borderRadius: '8px' }} />
        </div>
        <div>
          <h1 className="product-title" style={{ fontSize: '48px' }}>{game.tytul}</h1>
          <p className="product-desc" style={{ fontSize: '16px', color: '#b7c0cb', margin: '20px 0' }}>{game.opis}</p>
          <div className="new-price">{game.current_price} zł</div>
          <button className="buy-btn" onClick={() => alert("Produkt dodany do koszyka!\n\nSystem płatności online zostanie wdrożony w Sprincie 4 (Final Implementation).")} style={{ padding: '15px 40px', fontSize: '18px', marginTop: '20px' }}>
            DODAJ DO KOSZYKA
          </button>
        </div>
      </div>
    </section>
  );
}