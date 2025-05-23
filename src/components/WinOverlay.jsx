// Showing the overlay when the player "wins"
// components/WinOverlay.js
import React from 'react';

export default function WinOverlay({ onReset }) {
  return (
    <div style={{
      position: 'absolute',
      top: '40%',
      left: '50%',
      transform: 'translate(-50%, -50%)',
      background: 'gold',
      padding: '20px 40px',
      borderRadius: '12px',
      fontSize: '28px',
      fontWeight: 'bold',
      zIndex: 999,
      color: '#000',
      boxShadow: '0 4px 10px rgba(0,0,0,0.3)',
      textAlign: 'center'
    }}>
      🎉 You win! 🎉
      <br />
      <button onClick={onReset} style={{
        marginTop: '15px',
        padding: '8px 16px',
        fontSize: '16px',
        fontWeight: 'bold',
        borderRadius: '8px',
        cursor: 'pointer',
        border: 'none',
        backgroundColor: '#fff',
        color: '#333'
      }}>
        Play again
      </button>
    </div>
  );
}

