import { useEffect, useState } from 'react';

export default function Instruction({ icon1, icon2, interval = 1000 }) {
  const [showFirst, setShowFirst] = useState(true);

  useEffect(() => {
    const id = setInterval(() => setShowFirst(prev => !prev), interval);
    return () => clearInterval(id);
  }, [interval]);

  const currentIcon = showFirst ? icon1 : icon2;

  return (
    <div style={{
        width: '9.92rem',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        position: 'absolute',
        left: '35%',
        }}>
      <img
        src={currentIcon}
        alt="instruction icon"
        style={{width: '100%',
            height: '100%',
            objectFit: 'contain',
            transition: 'opacity 0.3s ease'}}
      />
    </div>
  );
}
