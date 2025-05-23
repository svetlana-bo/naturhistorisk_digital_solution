// Showing the overlay when the player "wins"

import React from 'react';
import styles from '../modules/WinOverlay.module.css';
import iconHeart from '../assets/icons/heart.svg';
import winVideo from '../assets/videos/Bird6.mp4'; 
import flower from '../assets/images/flower.svg';

export default function WinOverlay({ onReset }) {
  return (
    <div className={styles.container}>
      <img src={flower} alt="Image flower" className={styles.flower1} />
      <div className={styles.header}>
        <img src={iconHeart} alt="Icon heart" className={styles.icon_heart}/> You won!
      </div>
      <img src={flower} alt="Image flower" className={styles.flower2} />
      <div className={styles.videoWrapper}>
      <video
       src={winVideo}
       className={styles.video}
       autoPlay
       loop
       muted
       playsInline
      />
</div>
      <p className={styles.text}>
        Learn more on the 2nd floor in Den Globale Baghave
      </p>
    </div>
  );
}