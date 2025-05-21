import { useEffect, useState } from 'react';
import styles from '../modules/DefaultPage.module.css';
import Title from "../components/Title";
import wave from '../assets/icons/wave.svg';
import Interaction from './Interaction';

import { usePoseTracker } from '../hooks/usePoseTracker';
import { useWavingDetector } from '../hooks/useWavingDetector';

export default function DefaultPage() {
  const { videoRef, canvasRef, poseData } = usePoseTracker();
  const isWaving = useWavingDetector(poseData);
  const [hasEntered, setHasEntered] = useState(false);

  useEffect(() => {
    if (isWaving && !hasEntered) {
      setHasEntered(true); // simulate navigation or trigger effect
    }
  }, [isWaving, hasEntered]);

  if (hasEntered) {
    return <Interaction />; // Replace with your actual view
  }

  return (
    <div className={styles.main_container}>
      {/* Invisible camera feed */}
      <video ref={videoRef} width="640" height="480" style={{ display: 'none' }} />
      <canvas ref={canvasRef} width={640} height={480} style={{ display: 'none' }} />

      <Title />
      <div className={styles.content_container}>
        <div className={styles.text_box}>
          <h2><img src={wave} alt="Icon waving hand" className={styles.waving_icon}/>Wave to start</h2>
          <p>Even in paradise, there are rules of engagement. Can you impress a mate while staying respectful of their boundaries?</p>
        </div>
        <div className={styles.text_box}>
          <p><b>Rituals</b> is a new project aiming to add fresh perspectives and hot topics to exhibits and collections in Naturhistorisk Museum Aarhus.
            <br /> This season we have brought the <b>birds of paradise</b> on display in the <b>Global Backyard</b> exhibition to life to explore their <b>courtship</b> customs and the many different ways each species deals with <b>consent</b>.
          </p>
          <hr />
          <p><b>Rituals</b> er et nyt projekt, der har til formål at tilføje friske perspektiver og aktuelle emner til udstillingerne og samlingerne på Naturhistorisk Museum Aarhus.
            <br />
            I denne sæson har vi givet <b>paradisfuglene</b> i udstillingen <b>Global Backyard</b> nyt liv for at undersøge deres <b>parringsritualer</b> – og de mange forskellige måder, hvorpå hver art forholder sig til <b>samtykke</b>.
          </p>
        </div>
        <div className={styles.text_box}>
          <h2><img src={wave} alt="Icon waving hand" className={styles.waving_icon}/>Wave to start</h2>
          <p>Even in paradise, there are rules of engagement. Can you impress a mate while staying respectful of their boundaries?</p>
        </div>
      </div>
    </div>
  );
}
