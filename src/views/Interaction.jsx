import React, { useState } from 'react'

import Title from '../components/Title.jsx'

import BirdAvatar from '../components/BirdAvatar.jsx'
import BirdFemale from '../components/BirdFemale.jsx'

import styles from '../modules/Interaction.module.css'

function Interaction() {
  
  const [won, setWon] = useState(false);
  const [resetTrigger, setResetTrigger] = useState(0);

    return (
      <>
      <div>
        <Title />
        <h3 className={styles.bird_title}>Lesser bird of paradise</h3>
        <BirdAvatar onWin={() => setWon(true)} />
        <BirdFemale isAttracted={won} resetTrigger={resetTrigger} />

        </div>      
      </>
    )
  }
  
  export default Interaction