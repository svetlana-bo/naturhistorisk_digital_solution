import React, { useEffect, useState } from 'react';
import femaleBird from '../assets/bird/female_bird.png';

export default function BirdFemale({ isAttracted }) {
  const [style, setStyle] = useState({
    top: '50%',
    left: '60vw',
    width: '15%',
    transform: 'scaleX(-1)', // always facing the avatar
  });

  useEffect(() => {
    if (isAttracted) {
      // On "win": fly in close to the avatar bird
      setStyle({
        top: '60%',
        left: '30vw',
        width: '12%',
        transform: 'scaleX(-1)',
      });
      return;
    }

    // Idle wandering movement
    const interval = setInterval(() => {
        const top = Math.floor(Math.random() * 20) + 40;   // 40%–60% vertically
        const left = Math.floor(Math.random() * 15) + 55;  // 55vw–70vw horizontally
        
      setStyle((prev) => ({
        ...prev,
        top: `${top}%`,
        left: `${left}vw`,
        width: '15%',
        transform: 'scaleX(-1)',
      }));
    }, 3000); // move every 3 seconds

    return () => clearInterval(interval);
  }, [isAttracted]);

  return (
    <img
      src={femaleBird}
      alt="Female Bird"
      style={{
        position: 'absolute',
        ...style,
        transition: 'top 2s ease-in-out, left 2s ease-in-out, width 2s ease-in-out',
        zIndex: 2,
        pointerEvents: 'none',
      }}
    />
  );
}
