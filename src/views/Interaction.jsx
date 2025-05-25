import React, { useState } from 'react';

import Title from '../components/Title.jsx';
import BirdAvatar from '../components/BirdAvatar.jsx';
import BirdFemale from '../components/BirdFemale.jsx';

import styles from '../modules/Interaction.module.css';

function Interaction() {
  const [won, setWon] = useState(false);
  const [resetTrigger, setResetTrigger] = useState(0);

  // Called when the video ends (reset signal from BirdAvatar)
  const handleResetDone = () => {
    setWon(false);                      // ✅ reset female attraction
    setResetTrigger((n) => n + 1);      // ✅ trigger female bird idle animation
  };

  return (
    <div>
      <Title />
      <h3 className={styles.bird_title}>Lesser bird of paradise</h3>

      <BirdAvatar 
        onWin={() => setWon(true)} 
        onResetDone={handleResetDone} 
      />

      <BirdFemale isAttracted={won} resetTrigger={resetTrigger} />
    </div>
  );
}

export default Interaction;
