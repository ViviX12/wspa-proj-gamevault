import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';

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

export default function Product({ addToCart, userLibrary = [] }) {
  const { id } = useParams();
  const [game, setGame] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetch('http://localhost:8000/products')
      .then(res => {
        if (!res.ok) throw new Error("Błąd serwera");
        return res.json();
      })
      .then(data => {
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

  // Sprawdź czy gra jest już w bibliotece użytkownika
  const isInLibrary = userLibrary.includes(game.id);

  return (
    <div style={{ maxWidth: '1000px', margin: '40px auto', padding: '0 20px', color: '#fff' }}>
      
      <Link to="/" style={{ color: '#97a3af', textDecoration: 'none', display: 'inline-block', marginBottom: '20px', fontSize: '16px' }}>
        ← Wróć do sklepu
      </Link>

      <div style={{ display: 'flex', gap: '40px', background: '#172230', padding: '30px', borderRadius: '8px', flexWrap: 'wrap' }}>
        
        {/* Lewa kolumna: Obrazek */}
        <div style={{ flex: '1', minWidth: '300px', position: 'relative' }}>
          <img 
            src={game.imageUrl} 
            alt={game.title} 
            style={{ width: '100%', borderRadius: '8px', boxShadow: '0 10px 20px rgba(0,0,0,0.5)', objectFit: 'cover' }} 
          />
          {/* Baner "W bibliotece" na obrazku */}
          {isInLibrary && (
            <div style={{
              position: 'absolute',
              top: '12px',
              left: '12px',
              background: '#7bc043',
              color: '#fff',
              padding: '6px 12px',
              borderRadius: '4px',
              fontSize: '13px',
              fontWeight: 'bold',
            }}>
              ✔ W bibliotece
            </div>
          )}
        </div>

        {/* Prawa kolumna: Szczegóły i Koszyk */}
        <div style={{ flex: '1', minWidth: '300px', display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
          
          {/* Tytuł z etykietą "W bibliotece" */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '15px', flexWrap: 'wrap' }}>
            <h1 style={{ fontSize: '36px', margin: 0 }}>{game.title}</h1>
            {isInLibrary && (
              <span style={{
                background: '#7bc04322',
                color: '#7bc043',
                border: '1px solid #7bc043',
                padding: '4px 10px',
                borderRadius: '4px',
                fontSize: '13px',
                fontWeight: 'bold',
                whiteSpace: 'nowrap'
              }}>
                ✔ W bibliotece
              </span>
            )}
          </div>

          <p style={{ color: '#97a3af', fontSize: '16px', lineHeight: '1.6', marginBottom: '30px' }}>
            {game.description}
          </p>
          
          <div style={{ background: '#1f2f40', padding: '20px', borderRadius: '8px', borderLeft: `4px solid ${isInLibrary ? '#7bc043' : '#7bc043'}` }}>
            <div style={{ fontSize: '14px', color: '#97a3af', marginBottom: '5px' }}>Cena zakupu</div>
            <div style={{ fontSize: '32px', fontWeight: 'bold', color: '#7bc043', marginBottom: '20px' }}>
              {game.price === 0 ? "Za darmo" : `${game.price} zł`}
            </div>
            
            {isInLibrary ? (
              // Gra jest już w bibliotece - pokaż informację zamiast przycisku
              <div style={{
                width: '100%',
                padding: '15px',
                background: '#0D2818',
                color: '#7bc043',
                border: '2px solid #7bc043',
                borderRadius: '4px',
                fontSize: '16px',
                fontWeight: 'bold',
                textAlign: 'center',
                boxSizing: 'border-box'
              }}>
                ✔ Masz już tę grę w bibliotece
              </div>
            ) : (
              // Gra nie jest w bibliotece - pokaż przycisk
              <button 
                onClick={() => addToCart(game)} 
                style={{
                  width: '100%',
                  padding: '15px',
                  background: '#7bc043',
                  color: '#fff',
                  border: 'none',
                  borderRadius: '4px',
                  fontSize: '18px',
                  fontWeight: 'bold',
                  cursor: 'pointer',
                  transition: '0.2s'
                }}
                onMouseOver={(e) => e.target.style.background = '#65a135'}
                onMouseOut={(e) => e.target.style.background = '#7bc043'}
              >
                DODAJ DO KOSZYKA
              </button>
            )}
          </div>
        </div>

      </div>
    </div>
  );
}