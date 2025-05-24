import React, { useState } from 'react'

import Title from '../components/Title.jsx'

import BirdAvatar from '../components/BirdAvatar.jsx'
import BirdFemale from '../components/BirdFemale.jsx'

import styles from '../modules/Interaction.module.css'

function Interaction() {

  // State to track if the player has won
  const [won, setWon] = useState(false);

  // Reset the trigger counter when the player wins
  const [resetTrigger, setResetTrigger] = useState(0);

    return (
      <>
      <div>
        <Title />
        <h3 className={styles.bird_title}>Lesser bird of paradise</h3>
        
        {/* Player-controlled bird that listens for arm-raise win condition */}
        <BirdAvatar 
          onWin={() => setWon(true)} 
          onResetTrigger={() => setResetTrigger((n) => n + 1)}/>
        
        {/* Female bird reacts when won === true */}
        <BirdFemale isAttracted={won} resetTrigger={resetTrigger} />

        </div>      
      </>
    )
  }
  
  export default Interaction