import React from 'react';
import { Link } from 'react-router-dom';

export default function Cart({ cart, removeFromCart }) {
  const totalPrice = cart.reduce((sum, item) => sum + item.price, 0).toFixed(2);

  return (
    <div style={{ padding: '40px 20px', maxWidth: '1200px', margin: '0 auto', color: '#fff', width: '100%' }}>
      <h1 style={{ marginBottom: '30px', fontSize: '28px' }}>Twój Koszyk</h1>

      {cart.length === 0 ? (
        <div style={{ textAlign: 'center', padding: '50px 0', color: '#97a3af', background: '#172230', borderRadius: '8px' }}>
          Twój koszyk jest pusty. <br/><br/>
          <Link to="/" style={{ color: '#7bc043', textDecoration: 'none', fontSize: '18px', fontWeight: 'bold' }}>Wróć do sklepu</Link>
        </div>
      ) : (
        // Główny kontener Flex odwzorowujący układ z Figmy
        <div style={{ display: 'flex', gap: '30px', alignItems: 'flex-start', flexWrap: 'wrap' }}>
          
          {/* LEWY BLOK: Lista Produktów */}
          <div style={{ flex: '2', minWidth: '60%', background: '#172230', padding: '30px', borderRadius: '8px' }}>
            <h2 style={{ borderBottom: '1px solid rgba(255,255,255,0.1)', paddingBottom: '15px', marginBottom: '20px', color: '#97a3af', fontSize: '18px' }}>
              PRODUKTY ({cart.length})
            </h2>
            
            <div style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
              {cart.map(game => (
                <div key={game.id} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', background: '#1f2f40', padding: '15px', borderRadius: '6px' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '15px' }}>
                    <img src={game.imageUrl} alt={game.title} style={{ width: '100px', height: '56px', objectFit: 'cover', borderRadius: '4px' }} />
                    <span style={{ fontWeight: 'bold', fontSize: '18px' }}>{game.title}</span>
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '20px' }}>
                    <span style={{ color: '#7bc043', fontWeight: 'bold', fontSize: '20px' }}>{game.price} zł</span>
                    <button onClick={() => removeFromCart(game.id)} style={{ background: '#ff4d4d', color: '#fff', border: 'none', padding: '8px 12px', borderRadius: '4px', cursor: 'pointer', fontWeight: 'bold' }}>
                      Usuń
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* PRAWY BLOK: Podzielony na dwa mniejsze (Cena/Zakup oraz Płatności) */}
          <div style={{ flex: '1', minWidth: '300px', display: 'flex', flexDirection: 'column', gap: '30px' }}>
            
            {/* Prawy Górny Blok: Podsumowanie (Cena / Zakup) */}
            <div style={{ background: '#172230', padding: '30px', borderRadius: '8px' }}>
              <h2 style={{ borderBottom: '1px solid rgba(255,255,255,0.1)', paddingBottom: '15px', marginBottom: '20px', color: '#97a3af', fontSize: '18px' }}>PODSUMOWANIE</h2>
              
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '15px', fontSize: '16px' }}>
                <span>Wartość produktów:</span>
                <span>{totalPrice} zł</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '25px', fontSize: '22px', fontWeight: 'bold' }}>
                <span>Do zapłaty:</span>
                <span style={{ color: '#7bc043' }}>{totalPrice} zł</span>
              </div>
              
              <button style={{ width: '100%', padding: '15px', background: '#7bc043', color: '#fff', border: 'none', borderRadius: '4px', fontSize: '18px', fontWeight: 'bold', cursor: 'pointer' }}
                      onClick={() => alert("Moduł płatności zostanie wdrożony w Sprincie 4!")}>
                KUPUJĘ I PŁACĘ
              </button>
            </div>

            {/* Prawy Dolny Blok: Płatności */}
            <div style={{ background: '#172230', padding: '30px', borderRadius: '8px' }}>
              <h2 style={{ borderBottom: '1px solid rgba(255,255,255,0.1)', paddingBottom: '15px', marginBottom: '20px', color: '#97a3af', fontSize: '18px' }}>METODY PŁATNOŚCI</h2>
              
              {/* Makiety ikon płatności */}
              <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap' }}>
                <div style={{ background: '#fff', color: '#000', padding: '8px 15px', borderRadius: '4px', fontWeight: 'bold', fontSize: '14px' }}>BLIK</div>
                <div style={{ background: '#1a1f36', color: '#fff', padding: '8px 15px', borderRadius: '4px', fontWeight: 'bold', fontSize: '14px', border: '1px solid #635bff' }}>Stripe</div>
                <div style={{ background: '#003087', color: '#fff', padding: '8px 15px', borderRadius: '4px', fontWeight: 'bold', fontSize: '14px', fontStyle: 'italic' }}>PayPal</div>
              </div>
            </div>

          </div>
        </div>
      )}
    </div>
  );
}