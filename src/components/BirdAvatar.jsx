// BirdAvatar: A component that renders an animated bird reacting to player arm movements

import styles from '../modules/BirdAvatar.module.css';

import React, { useEffect, useRef, useState } from 'react';
import { usePoseTracker } from '../hooks/usePoseTracker';

import WinOverlay from './WinOverlay';
import winVideo from '../assets/videos/Bird6.mp4'; 

import iconDown from '../assets/icons/Instruction1-down.svg';
import iconUp from '../assets/icons/Instruction1-up.svg';
import Instruction from './Instruction';

import leftWing from '../assets/bird/bird-left-wing.png';
import rightWing from '../assets/bird/bird-right-wing.png';
import body from '../assets/bird/bird-body.png';



export default function BirdAvatar( { onWin, onResetTrigger }) {
  // Pose tracking state from custom hook
  const { videoRef, canvasRef, poseData } = usePoseTracker();

  // Refs to hold wing state, angles, and whether both wings were raised last frame
  const wingState = useRef({ left: 'idle', right: 'idle' });
  const lastAngle = useRef({ left: 0, right: 0 });
  const lastRaised = useRef(false);

  // Score and win state
  const [score, setScore] = useState(0);
  const [won, setWon] = useState(false);

  // Utility: clamp a value between min and max
  const clamp = (val, min, max) => Math.max(min, Math.min(max, val));

   // Utility: smooth wing angle for more natural movement
  const smoothAngle = (side, newAngle) => {
    const smoothed = 0.8 * lastAngle.current[side] + 0.2 * newAngle;
    lastAngle.current[side] = smoothed;
    return smoothed;
  };

   // Utility: get angle between two points
  const getAngle = (a, b) => {
    if (!a || !b || isNaN(a.x) || isNaN(a.y) || isNaN(b.x) || isNaN(b.y)) return 0;
    return Math.atan2(b.y - a.y, b.x - a.x) * (180 / Math.PI);
  };

  useEffect(() => {
    if (!poseData || !canvasRef.current) return;

    // Helper to access keypoints
    const key = (name) => poseData.keypoints.find((k) => k.name === name);
    
    // Get keypoints for shoulders and wrists
    const leftShoulder = key('left_shoulder');
    const rightShoulder = key('right_shoulder');
    const leftWrist = key('left_wrist');
    const rightWrist = key('right_wrist');

    // Canvas dimensions
    const canvasWidth = canvasRef.current.width;
    const canvasHeight = canvasRef.current.height;

    // Mirror X coordinate to flip the bird avatar so it looks like it's facing the player
    const mirrorX = (x) => canvasWidth - x;

    // Calculate vertical offset for birf animation based on shoulder positions
    const bodyPoseY = (leftShoulder?.y + rightShoulder?.y) / 2;
    const centerY = canvasHeight / 2;
    const verticalOffset = centerY - bodyPoseY;

    // Get the left and right wing, and the body images
    const leftWingEl = document.getElementById('leftWing');
    const rightWingEl = document.getElementById('rightWing');
    const bodyImg = document.getElementById('birdBody');

    // Update wing state based on wrist positions relative to the shoulder
    const updateWingState = (side, wrist, shoulder) => {
      const state = wingState.current[side];
      // If wrist or shoulder is not detected, set wing to idle
      if (!wrist || !shoulder || wrist.score < 0.3) {
        wingState.current[side] = 'idle';
        return;
      }
      // Determine if the wrist is above or below the shoulder
      const isAbove = wrist.y < shoulder.y;
      // Update wing state based on current state and wrist position
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
    // Update wing states for both sides
    updateWingState('left', leftWrist, leftShoulder);
    updateWingState('right', rightWrist, rightShoulder);

    // Score logic: +1 point when both wings raised from not-raised state
    const bothRaised = wingState.current.left === 'raised' && wingState.current.right === 'raised';
    if (bothRaised && !lastRaised.current && !won) {
      setScore((prev) => {
        const newScore = prev + 1;
        if (newScore >= 3) {
          setWon(true);
          onWin?.();
        }
        return newScore;
      });
    }
    lastRaised.current = bothRaised;

    // Update wing positions and angles
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

    // Left wing: position and rotate wings based on shoulder and wrist positions
    if (leftWingEl && leftShoulder) {
      const leftWingX = mirrorX(leftShoulder.x - 10);
      leftWingEl.style.left = `${leftWingX}px`;
      leftWingEl.style.top = `${leftShoulder.y + verticalOffset + 100 + getWingOffset('left')}px`;
 
      if (leftWrist?.score > 0.5) {
        const rawAngle = getAngle(leftShoulder, leftWrist);
        const angle = clamp(rawAngle, -90, 90);
        const smoothed = smoothAngle('left', -angle);
        leftWingEl.style.transform = `translate(-50%, -30%) rotate(${smoothed}deg)`;
      } else {
        leftWingEl.style.transform = `translate(-50%, -30%)`;
      }
    }

    // Right wing: position and rotate wings based on shoulder and wrist positions
    if (rightWingEl && rightShoulder) {
      const rightWingX = mirrorX(rightShoulder.x - 60);
      rightWingEl.style.left = `${rightWingX}px`;
      rightWingEl.style.top = `${rightShoulder.y + verticalOffset + 100 + getWingOffset('right')}px`;

      if (rightWrist?.score > 0.5) {
        const angle = clamp(getAngle(rightShoulder, rightWrist), -90, 90);
        const smoothed = smoothAngle('right', angle);
        rightWingEl.style.transform = `translate(-50%, -30%) rotate(${smoothed}deg)`;
      } else {
        rightWingEl.style.transform = `translate(-50%, -30%)`;
      }
    }

    // Position the "body" image based on shoulder positions
    if (bodyImg && leftShoulder && rightShoulder) {
      const leftWingX = mirrorX(leftShoulder.x + 40);
      const rightWingX = mirrorX(rightShoulder.x - 110);
      const centerX = (leftWingX + rightWingX) / 2;
      const topY = centerY;

      if (bodyImg.complete) {
        bodyImg.style.left = `${centerX - bodyImg.offsetWidth / 2}px`;
        bodyImg.style.top = `${topY}px`;
      }
    }
  }, [poseData, won]);

  // Render the debug overlay with wrist scores - Just in case leaving in comments for now in case we need it later
  //const PoseDebug = ({ pose }) => {
  //  const left = pose.keypoints.find(p => p.name === 'left_wrist');
  //  const right = pose.keypoints.find(p => p.name === 'right_wrist');

  //  return (
      
  //    <div style={{
  //      position: 'absolute',
  //      top: 5,
  //      left: 10,
  //      padding: '6px 12px',
  //      backgroundColor: 'rgba(0,0,0,0.7)',
  //      color: 'white',
  //      fontSize: '14px',
  //      fontFamily: 'monospace',
  //      borderRadius: '5px',
  //      zIndex: 999
  //     }}>
  //      <div>👈 left_wrist: {left?.score?.toFixed(2) ?? 'N/A'}</div>
  //      <div>👉 right_wrist: {right?.score?.toFixed(2) ?? 'N/A'}</div>
  //    </div>
  //  );
  //};

  return (
    <div style={{ 
      position: 'absolute',
      bottom: '20%',
      left: '5%',
      width: 640,
      height: 480, }}>
      {/* Arm raise instructions */}
      <Instruction icon1={iconDown} icon2={iconUp} interval={800} />

      {/* Hidden video + canvas for pose tracking */}
      <video ref={videoRef} width="640" height="480" style={{ display: 'none' }} />
      <canvas ref={canvasRef} width={640} height={480} style={{ position: 'absolute', top: 0, left: 0, zIndex: 0 }} />

      {/* Bird graphics */}
      <div id="birdContainer" className={styles.bird_container}>
      <img
        id="birdBody"
        src={body}
        alt="Bird body"
        style={{
          position: 'absolute',
          width: '35%',
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
          width: '25%',
          transformOrigin: '80% 20%',
          zIndex: 1,
          transition: 'transform 0.2s ease-out',
        }}
      />
      <img
        id="rightWing"
        src={rightWing}
        alt="Right wing"
        style={{
          position: 'absolute',
          transformOrigin: '20% 20%',
          width: '25%',
          zIndex: 1,
          transition: 'transform 0.2s ease-out',
        }}
      />
      </div>
         
      {won && <WinOverlay 
      videoScr={winVideo}
      onReset={() => {
      setScore(0);
      setWon(false);
      onResetTrigger(); //  this calls setResetTrigger from parent
      }} />}
    </div>
  );
}

