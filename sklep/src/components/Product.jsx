import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';

// Mapper obrazków (taki sam jak w sklepie i bibliotece)
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

// ODBIERAMY addToCart z App.jsx jako props!
export default function Product({ addToCart }) {
  const { id } = useParams(); // Wyciąga ID gry z adresu URL
  const [game, setGame] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    // Pobieramy dane z Twojego backendu
    fetch('http://localhost:8000/products')
      .then(res => {
        if (!res.ok) throw new Error("Błąd serwera");
        return res.json();
      })
      .then(data => {
        // Znajdujemy grę, której ID pasuje do tego w pasku adresu
        // Używamy == zamiast === bo id z paska adresu jest tekstem, a z bazy liczbą
        const foundGame = data.find(g => g.id == id);
        
        if (foundGame) {
          setGame({
            id: foundGame.id,
            title: foundGame.tytul,
            price: parseFloat(foundGame.current_price),
            description: foundGame.opis || "Kup tę grę i dołącz do tysięcy zadowolonych graczy w naszym sklepie GameVault!",
            imageUrl: imageMapper[foundGame.tytul] || "/img/gra1.jpg"
          });
        } else {
          setError("Nie znaleziono takiej gry w bazie danych.");
        }
        setLoading(false);
      })
      .catch(err => {
        console.error(err);
        setError("Brak połączenia z backendem (Python). Upewnij się, że serwer działa.");
        setLoading(false);
      });
  }, [id]);

  if (loading) return <div style={{ color: 'white', textAlign: 'center', padding: '50px' }}>Ładowanie produktu...</div>;
  if (error) return <div style={{ color: '#ff4d4d', textAlign: 'center', padding: '50px', fontSize: '18px' }}>{error}</div>;

  return (
    <div style={{ maxWidth: '1000px', margin: '40px auto', padding: '0 20px', color: '#fff' }}>
      
      {/* Przycisk powrotu */}
      <Link to="/" style={{ color: '#97a3af', textDecoration: 'none', display: 'inline-block', marginBottom: '20px', fontSize: '16px' }}>
        ← Wróć do sklepu
      </Link>

      <div style={{ display: 'flex', gap: '40px', background: '#172230', padding: '30px', borderRadius: '8px', flexWrap: 'wrap' }}>
        
        {/* Lewa kolumna: Obrazek */}
        <div style={{ flex: '1', minWidth: '300px' }}>
          <img 
            src={game.imageUrl} 
            alt={game.title} 
            style={{ width: '100%', borderRadius: '8px', boxShadow: '0 10px 20px rgba(0,0,0,0.5)', objectFit: 'cover' }} 
          />
        </div>

        {/* Prawa kolumna: Szczegóły i Koszyk */}
        <div style={{ flex: '1', minWidth: '300px', display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
          <h1 style={{ fontSize: '36px', marginBottom: '15px' }}>{game.title}</h1>
          <p style={{ color: '#97a3af', fontSize: '16px', lineHeight: '1.6', marginBottom: '30px' }}>
            {game.description}
          </p>
          
          <div style={{ background: '#1f2f40', padding: '20px', borderRadius: '8px', borderLeft: '4px solid #7bc043' }}>
            <div style={{ fontSize: '14px', color: '#97a3af', marginBottom: '5px' }}>Cena zakupu</div>
            <div style={{ fontSize: '32px', fontWeight: 'bold', color: '#7bc043', marginBottom: '20px' }}>
              {game.price === 0 ? "Za darmo" : `${game.price} zł`}
            </div>
            
            {/* Tutaj wywołujemy funkcję z App.jsx */}
            <button 
              onClick={() => addToCart(game)} 
              style={{ width: '100%', padding: '15px', background: '#7bc043', color: '#fff', border: 'none', borderRadius: '4px', fontSize: '18px', fontWeight: 'bold', cursor: 'pointer', transition: '0.2s' }}
              onMouseOver={(e) => e.target.style.background = '#65a135'}
              onMouseOut={(e) => e.target.style.background = '#7bc043'}
            >
              DODAJ DO KOSZYKA
            </button>
          </div>
        </div>

      </div>
    </div>
  );
}