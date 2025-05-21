// Tracking the motion of the body using Pose from MediaPipe

import { useEffect, useRef, useState } from 'react';
import { Pose } from '@mediapipe/pose';
import { Camera } from '@mediapipe/camera_utils';

const landmarkNames = [ 'nose', 'left_eye_inner', 'left_eye', 'left_eye_outer', 'right_eye_inner',
  'right_eye', 'right_eye_outer', 'left_ear', 'right_ear', 'mouth_left', 'mouth_right',
  'left_shoulder', 'right_shoulder', 'left_elbow', 'right_elbow', 'left_wrist', 'right_wrist',
  'left_pinky', 'right_pinky', 'left_index', 'right_index', 'left_thumb', 'right_thumb',
  'left_hip', 'right_hip', 'left_knee', 'right_knee', 'left_ankle', 'right_ankle',
  'left_heel', 'right_heel', 'left_foot_index', 'right_foot_index'
 ];

export const usePoseTracker = () => {
  const videoRef = useRef(null);
  const canvasRef = useRef(null);
  const [poseData, setPoseData] = useState(null);

  useEffect(() => {
    const video = videoRef.current;
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');

    const pose = new Pose({
      locateFile: (file) => `https://cdn.jsdelivr.net/npm/@mediapipe/pose/${file}`,
    });

    pose.setOptions({
      modelComplexity: 0,
      smoothLandmarks: true,
      enableSegmentation: false,
      minDetectionConfidence: 0.5,
      minTrackingConfidence: 0.5,
    });

    pose.onResults((results) => {
      ctx.save();
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      ctx.translate(canvas.width, 0);
      ctx.scale(-1, 1);

      if (results.poseLandmarks) {
        const keypoints = results.poseLandmarks.map((landmark, i) => ({
          x: landmark.x * canvas.width,
          y: landmark.y * canvas.height,
          name: landmarkNames[i],
          score: landmark.visibility || 0
        }));
        setPoseData({ keypoints });
      }

      ctx.restore();
    });

    const camera = new Camera(video, {
      onFrame: async () => await pose.send({ image: video }),
      width: 640,
      height: 480,
    });

    camera.start();
  }, []);

  return { videoRef, canvasRef, poseData };
};
