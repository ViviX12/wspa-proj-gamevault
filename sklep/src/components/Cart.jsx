import React, { useState } from 'react';
import { Link } from 'react-router-dom';

export default function Cart({ cart, removeFromCart, clearCart }) {
  const totalPrice = cart.reduce((sum, item) => sum + item.price, 0).toFixed(2);
  const [purchaseStatus, setPurchaseStatus] = useState(null); // 'success' lub 'error: komunikat'

  const handlePurchase = async () => {
    const token = localStorage.getItem('token');
    
    if (!token) {
      alert("Musisz być zalogowany, aby dokonać zakupu!");
      return;
    }

    
    const itemIds = cart.map(item => ({ product_id: item.id }));

    try {
      
      const response = await fetch('http://localhost:8000/orders', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          items: itemIds,
          totalAmount: parseFloat(totalPrice)
        })
      });

      if (response.ok) {
        setPurchaseStatus('success');
        clearCart(); // Czyścimy koszyk po stronie App.jsx
      } else {
        const errorData = await response.json();
        
        // Rozszyfrowujemy błędy od FastAPI
        let errorMsg = 'Wystąpił problem z zakupem';
        if (errorData.detail) {
          errorMsg = typeof errorData.detail === 'string' 
            ? errorData.detail 
            : JSON.stringify(errorData.detail); // Zamienia obiekty na czytelny JSON
        }
        
        setPurchaseStatus(`error: ${errorMsg}`);
      }
    } catch (error) {
      setPurchaseStatus('error: Brak połączenia z serwerem backendu');
    }
  };

  return (
    <div style={{ padding: '40px 20px', maxWidth: '1200px', margin: '0 auto', color: '#fff', width: '100%' }}>
      <h1 style={{ marginBottom: '30px', fontSize: '28px' }}>Twój Koszyk</h1>

      {cart.length === 0 && purchaseStatus !== 'success' ? (
        <div style={{ textAlign: 'center', padding: '50px 0', color: '#97a3af', background: '#172230', borderRadius: '8px' }}>
          Twój koszyk jest pusty. <br/><br/>
          <Link to="/" style={{ color: '#7bc043', textDecoration: 'none', fontSize: '18px', fontWeight: 'bold' }}>Wróć do sklepu</Link>
        </div>
      ) : (
        <div style={{ display: 'flex', gap: '30px', alignItems: 'flex-start', flexWrap: 'wrap' }}>
          
          {/* LEWY BLOK: Lista Produktów */}
          <div style={{ flex: '2', minWidth: '60%', background: '#172230', padding: '30px', borderRadius: '8px' }}>
            {purchaseStatus === 'success' ? (
              <div style={{ textAlign: 'center', padding: '20px' }}>
                <h2 style={{ color: '#7bc043' }}>Dziękujemy za zakup!</h2>
                <p>Gry zostały dodane do Twojej biblioteki.</p>
                <Link to="/library" style={{ display: 'inline-block', marginTop: '20px', color: '#fff', background: '#354a5f', padding: '10px 20px', borderRadius: '4px', textDecoration: 'none' }}>
                  Przejdź do biblioteki
                </Link>
              </div>
            ) : (
              cart.map((item) => (
                <article key={item.id} style={{ display: 'flex', alignItems: 'center', gap: '20px', padding: '15px 0', borderBottom: '1px solid rgba(255,255,255,0.05)' }}>
                  <div style={{ width: '100px', height: '60px', background: '#1f2f40', borderRadius: '4px', overflow: 'hidden' }}>
                    <img src={item.imageUrl} alt="" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                  </div>
                  <div style={{ flex: '1' }}>
                    <h3 style={{ fontSize: '18px', margin: '0 0 5px 0' }}>{item.title}</h3>
                    <div style={{ color: '#7bc043', fontWeight: 'bold' }}>{item.price.toFixed(2)} zł</div>
                  </div>
                  <button 
                    onClick={() => removeFromCart(item.id)}
                    style={{ background: 'transparent', border: '1px solid #ff4d4d', color: '#ff4d4d', padding: '5px 10px', borderRadius: '4px', cursor: 'pointer' }}
                  >
                    Usuń
                  </button>
                </article>
              ))
            )}
          </div>

          {/* PRAWY BLOK: Podsumowanie */}
          <div style={{ flex: '1', minWidth: '300px', display: 'flex', flexDirection: 'column', gap: '20px' }}>
            <div style={{ background: '#172230', padding: '30px', borderRadius: '8px' }}>
              <h2 style={{ borderBottom: '1px solid rgba(255,255,255,0.1)', paddingBottom: '15px', marginBottom: '20px', color: '#97a3af', fontSize: '18px' }}>PODSUMOWANIE</h2>
              
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '20px', fontSize: '20px' }}>
                <span>Łącznie:</span>
                <strong style={{ color: '#7bc043' }}>{totalPrice} zł</strong>
              </div>

              {/* Komunikat o błędzie */}
              {purchaseStatus && purchaseStatus.startsWith('error') && (
                <div style={{ background: '#ff4d4d', color: 'white', padding: '10px', borderRadius: '4px', marginBottom: '15px', fontSize: '14px' }}>
                  {purchaseStatus.split(': ')[1]}
                </div>
              )}
              
              <button 
                style={{ 
                  width: '100%', padding: '15px', background: '#7bc043', color: '#fff', border: 'none', 
                  borderRadius: '4px', fontSize: '18px', fontWeight: 'bold', cursor: 'pointer',
                  opacity: cart.length === 0 ? 0.5 : 1
                }}
                onClick={handlePurchase}
                disabled={cart.length === 0 || purchaseStatus === 'success'}
              >
                {purchaseStatus === 'success' ? "ZAKUPIONO" : "KUPUJĘ I PŁACĘ"}
              </button>
            </div>

            <div style={{ background: '#172230', padding: '30px', borderRadius: '8px' }}>
              <h2 style={{ borderBottom: '1px solid rgba(255,255,255,0.1)', paddingBottom: '15px', marginBottom: '20px', color: '#97a3af', fontSize: '18px' }}>METODY PŁATNOŚCI</h2>
              <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap' }}>
                <div style={{ background: '#fff', color: '#000', padding: '8px 15px', borderRadius: '4px', fontWeight: 'bold', fontSize: '12px' }}>BLIK</div>
                <div style={{ background: '#fff', color: '#000', padding: '8px 15px', borderRadius: '4px', fontWeight: 'bold', fontSize: '12px' }}>VISA</div>
                <div style={{ background: '#fff', color: '#000', padding: '8px 15px', borderRadius: '4px', fontWeight: 'bold', fontSize: '12px' }}>MASTERCARD</div>
              </div>
            </div>
          </div>

        </div>
      )}
    </div>
  );
}