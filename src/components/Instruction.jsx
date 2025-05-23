import { useEffect, useState } from 'react';
import styles from '../modules/Instruction.module.css';

export default function Instruction({ icon1, icon2, interval = 1000 }) {
  const [showFirst, setShowFirst] = useState(true);

  useEffect(() => {
    const id = setInterval(() => setShowFirst(prev => !prev), interval);
    return () => clearInterval(id);
  }, [interval]);

  const currentIcon = showFirst ? icon1 : icon2;

  return (
    <div className={styles.instuction_box}>
      <img
        src={currentIcon}
        alt="instruction icon"
        className={styles.instruction_icon}
      />
    </div>
  );
}
