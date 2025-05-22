import React, { useEffect, useRef } from 'react';
import { usePoseTracker } from '../hooks/usePoseTracker';
import leftWing from '../assets/bird/bird-left-wing.png';
import rightWing from '../assets/bird/bird-right-wing.png';
import body from '../assets/bird/bird-body.png';

export default function BirdAvatar() {
  const { videoRef, canvasRef, poseData } = usePoseTracker();
  const wingState = useRef({ left: 'idle', right: 'idle' });
  const lastAngle = useRef({ left: 0, right: 0 });

  const clamp = (val, min, max) => Math.max(min, Math.min(max, val));
  const smoothAngle = (side, newAngle) => {
    const smoothed = 0.8 * lastAngle.current[side] + 0.2 * newAngle;
    lastAngle.current[side] = smoothed;
    return smoothed;
  };

  const getAngle = (a, b) => {
    if (!a || !b || isNaN(a.x) || isNaN(a.y) || isNaN(b.x) || isNaN(b.y)) return 0;
    return Math.atan2(b.y - a.y, b.x - a.x) * (180 / Math.PI);
  };

  useEffect(() => {
    if (!poseData || !canvasRef.current) return;

    const ctx = canvasRef.current.getContext('2d');
    const key = (name) => poseData.keypoints.find((k) => k.name === name);
    const leftShoulder = key('left_shoulder');
    const rightShoulder = key('right_shoulder');
    const leftWrist = key('left_wrist');
    const rightWrist = key('right_wrist');

    const canvasWidth = canvasRef.current.width;
    const canvasHeight = canvasRef.current.height;
    const mirrorX = (x) => canvasWidth - x;

    const bodyPoseY = (leftShoulder?.y + rightShoulder?.y) / 2;
    const centerY = canvasHeight / 2;
    const verticalOffset = centerY - bodyPoseY;

    const leftWingEl = document.getElementById('leftWing');
    const rightWingEl = document.getElementById('rightWing');
    const bodyImg = document.getElementById('birdBody');

    const updateWingState = (side, wrist, shoulder) => {
      const state = wingState.current[side];

      if (!wrist || !shoulder || wrist.score < 0.3) {
        wingState.current[side] = 'idle';
        return;
      }

      const isAbove = wrist.y < shoulder.y;

      switch (state) {
        case 'idle':
          wingState.current[side] = isAbove ? 'raising' : 'idle';
          break;
        case 'raising':
          wingState.current[side] = isAbove ? 'raised' : 'lowering';
          break;
        case 'raised':
          wingState.current[side] = isAbove ? 'raised' : 'lowering';
          break;
        case 'lowering':
          wingState.current[side] = isAbove ? 'raising' : 'idle';
          break;
      }
    };

    updateWingState('left', leftWrist, leftShoulder);
    updateWingState('right', rightWrist, rightShoulder);

    const getWingOffset = (side) => {
      switch (wingState.current[side]) {
        case 'raising':
        case 'raised':
          return -40;
        case 'lowering':
          return -10;
        default:
          return 0;
      }
    };

    if (leftWingEl && leftShoulder) {
      leftWingEl.style.left = `${mirrorX(leftShoulder.x - 110)}px`;
      leftWingEl.style.top = `${leftShoulder.y + verticalOffset + 50 + getWingOffset('left')}px`;

      if (leftWrist?.score > 0.5) {
        const rawAngle = getAngle(leftShoulder, leftWrist);
        const angle = clamp(rawAngle, -90, 90);
        const smoothed = smoothAngle('left', -angle); // ← FLIP left wing
        leftWingEl.style.transform = `translate(-10%, -20%) rotate(${smoothed}deg)`;
      }
    }

    if (rightWingEl && rightShoulder) {
      rightWingEl.style.left = `${mirrorX(rightShoulder.x - 40)}px`;
      rightWingEl.style.top = `${rightShoulder.y + verticalOffset + 50 + getWingOffset('right')}px`;

      if (rightWrist?.score > 0.5) {
        const angle = clamp(getAngle(rightShoulder, rightWrist), -90, 90);
        const smoothed = smoothAngle('right', angle);
        rightWingEl.style.transform = `translate(-80%, -20%) rotate(${smoothed}deg)`;
      }
    }

    if (bodyImg && leftShoulder && rightShoulder) {
      const centerX = (leftShoulder.x + rightShoulder.x) / 2;
      bodyImg.style.left = `${mirrorX(centerX)}px`;
      bodyImg.style.top = `${centerY}px`;
    }
  }, [poseData]);

  const PoseDebug = ({ pose }) => {
    const left = pose.keypoints.find(p => p.name === 'left_wrist');
    const right = pose.keypoints.find(p => p.name === 'right_wrist');

    return (
      <div style={{
        position: 'absolute',
        top: 5,
        left: 10,
        padding: '6px 12px',
        backgroundColor: 'rgba(0,0,0,0.7)',
        color: 'white',
        fontSize: '14px',
        fontFamily: 'monospace',
        borderRadius: '5px',
        zIndex: 999
      }}>
        <div>👈 left_wrist: {left?.score?.toFixed(2) ?? 'N/A'}</div>
        <div>👉 right_wrist: {right?.score?.toFixed(2) ?? 'N/A'}</div>
      </div>
    );
  };

  return (
    <div style={{ position: 'relative', width: 640, height: 480 }}>
      <video ref={videoRef} width="640" height="480" style={{ display: 'none' }} />
      <canvas ref={canvasRef} width={640} height={480} style={{ position: 'absolute', top: 0, left: 0, zIndex: 0 }} />

      <img
        id="birdBody"
        src={body}
        alt="Bird body"
        style={{
          position: 'absolute',
          width: 150,
          transformOrigin: 'center',
          zIndex: 1,
          transition: 'top 0.1s ease-out, left 0.1s ease-out, transform 0.1s ease-out',
        }}
      />
      <img
        id="leftWing"
        src={leftWing}
        alt="Left wing"
        style={{
          position: 'absolute',
          width: 100,
          transformOrigin: 'top right',
          zIndex: 1,
          transition: 'top 0.2s ease-out, left 0.2s ease-out, transform 0.2s ease-out',
        }}
      />
      <img
        id="rightWing"
        src={rightWing}
        alt="Right wing"
        style={{
          position: 'absolute',
          width: 100,
          transformOrigin: 'top left',
          zIndex: 1,
          transition: 'top 0.2s ease-out, left 0.2s ease-out, transform 0.2s ease-out',
        }}
      />
      {poseData && <PoseDebug pose={poseData} />}
    </div>
  );
}
