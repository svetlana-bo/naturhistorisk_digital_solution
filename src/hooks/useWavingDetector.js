import { useEffect, useState, useRef } from 'react';

export const useWavingDetector = (poseData, {
  threshold = 40,
  swingCount = 3,
  cooldown = 2000
} = {}) => {
  const [isWaving, setIsWaving] = useState(false);

  const handState = useRef({
    left: { lastX: null, direction: null, swings: 0 },
    right: { lastX: null, direction: null, swings: 0 }
  });

  const cooldownRef = useRef(false);

  const checkSwing = (side, currentX) => {
    const state = handState.current[side];
    if (state.lastX === null) {
      state.lastX = currentX;
      return;
    }

    const delta = currentX - state.lastX;
    if (Math.abs(delta) > threshold) {
      const newDir = delta > 0 ? 'right' : 'left';
      if (state.direction && state.direction !== newDir) {
        state.swings += 1;
      }
      state.direction = newDir;
      state.lastX = currentX;
    }
  };

  useEffect(() => {
    if (!poseData || cooldownRef.current) return;

    const leftWrist = poseData.keypoints.find(p => p.name === 'left_wrist');
    const rightWrist = poseData.keypoints.find(p => p.name === 'right_wrist');

    if (leftWrist?.score > 0.3) {
      checkSwing('left', leftWrist.x);
    }

    if (rightWrist?.score > 0.3) {
      checkSwing('right', rightWrist.x);
    }

    const bothWaving = ['left', 'right'].every(
      (side) => handState.current[side].swings >= swingCount
    );

    if (bothWaving) {
      setIsWaving(true);
      cooldownRef.current = true;

      setTimeout(() => {
        setIsWaving(false);
        handState.current = {
          left: { lastX: null, direction: null, swings: 0 },
          right: { lastX: null, direction: null, swings: 0 }
        };
        cooldownRef.current = false;
      }, cooldown);
    }
  }, [poseData]);

  return isWaving;
};
