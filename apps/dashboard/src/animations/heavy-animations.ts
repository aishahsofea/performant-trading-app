/**
 * Heavy Animation Library with Redundant Keyframes
 * Deliberately inefficient for performance testing purposes
 */

import { Variants } from 'framer-motion'

// Extremely redundant bounce animation with excessive keyframes
export const heavyBounce: Variants = {
  initial: { 
    y: 0,
    scale: 1,
    rotate: 0,
    opacity: 1,
    x: 0,
    scaleX: 1,
    scaleY: 1,
    rotateX: 0,
    rotateY: 0,
    rotateZ: 0,
    skewX: 0,
    skewY: 0
  },
  animate: {
    y: [0, -20, -40, -60, -80, -100, -120, -140, -160, -180, -200, -180, -160, -140, -120, -100, -80, -60, -40, -20, 0, 20, 40, 60, 80, 100, 80, 60, 40, 20, 0, -10, -20, -30, -40, -50, -40, -30, -20, -10, 0, 5, 10, 15, 20, 15, 10, 5, 0, -2, -4, -6, -8, -6, -4, -2, 0, 1, 2, 1, 0],
    scale: [1, 1.1, 1.2, 1.3, 1.4, 1.5, 1.6, 1.7, 1.8, 1.9, 2.0, 1.9, 1.8, 1.7, 1.6, 1.5, 1.4, 1.3, 1.2, 1.1, 1, 0.9, 0.8, 0.7, 0.6, 0.5, 0.6, 0.7, 0.8, 0.9, 1, 1.05, 1.1, 1.15, 1.2, 1.25, 1.2, 1.15, 1.1, 1.05, 1, 0.98, 0.96, 0.94, 0.92, 0.94, 0.96, 0.98, 1, 1.01, 1.02, 1.03, 1.04, 1.03, 1.02, 1.01, 1, 0.999, 0.998, 0.999, 1],
    rotate: [0, 5, 10, 15, 20, 25, 30, 35, 40, 45, 50, 45, 40, 35, 30, 25, 20, 15, 10, 5, 0, -5, -10, -15, -20, -25, -20, -15, -10, -5, 0, 2, 4, 6, 8, 10, 8, 6, 4, 2, 0, -1, -2, -3, -4, -3, -2, -1, 0, 0.5, 1, 1.5, 2, 1.5, 1, 0.5, 0, -0.2, -0.4, -0.2, 0],
    opacity: [1, 0.9, 0.8, 0.7, 0.6, 0.5, 0.4, 0.3, 0.2, 0.1, 0.05, 0.1, 0.2, 0.3, 0.4, 0.5, 0.6, 0.7, 0.8, 0.9, 1, 0.95, 0.9, 0.85, 0.8, 0.75, 0.8, 0.85, 0.9, 0.95, 1, 0.98, 0.96, 0.94, 0.92, 0.9, 0.92, 0.94, 0.96, 0.98, 1, 1.01, 1.02, 1.03, 1.04, 1.03, 1.02, 1.01, 1, 0.999, 0.998, 0.997, 0.996, 0.997, 0.998, 0.999, 1, 1.0001, 1.0002, 1.0001, 1],
    transition: {
      duration: 8,
      ease: [0.25, 0.46, 0.45, 0.94],
      times: [0, 0.02, 0.04, 0.06, 0.08, 0.1, 0.12, 0.14, 0.16, 0.18, 0.2, 0.22, 0.24, 0.26, 0.28, 0.3, 0.32, 0.34, 0.36, 0.38, 0.4, 0.42, 0.44, 0.46, 0.48, 0.5, 0.52, 0.54, 0.56, 0.58, 0.6, 0.62, 0.64, 0.66, 0.68, 0.7, 0.72, 0.74, 0.76, 0.78, 0.8, 0.82, 0.84, 0.86, 0.88, 0.9, 0.91, 0.92, 0.93, 0.94, 0.95, 0.96, 0.97, 0.975, 0.98, 0.985, 0.99, 0.995, 0.998, 0.999, 1],
      repeat: Infinity,
      repeatType: "reverse"
    }
  }
}

// Overly complex pulse animation with redundant properties
export const heavyPulse: Variants = {
  initial: {
    scale: 1,
    scaleX: 1,
    scaleY: 1,
    opacity: 1,
    filter: 'blur(0px) brightness(1) contrast(1) saturate(1) hue-rotate(0deg)',
    boxShadow: '0 0 0 rgba(0, 0, 0, 0)',
    borderRadius: '0px',
    background: 'linear-gradient(0deg, #000 0%, #000 100%)',
    transform: 'perspective(1000px) rotateX(0deg) rotateY(0deg) translateZ(0px)',
    x: 0,
    y: 0,
    rotate: 0,
    rotateX: 0,
    rotateY: 0,
    rotateZ: 0,
    skewX: 0,
    skewY: 0
  },
  animate: {
    scale: [1, 1.05, 1.1, 1.15, 1.2, 1.25, 1.3, 1.35, 1.4, 1.45, 1.5, 1.55, 1.6, 1.65, 1.7, 1.65, 1.6, 1.55, 1.5, 1.45, 1.4, 1.35, 1.3, 1.25, 1.2, 1.15, 1.1, 1.05, 1, 0.95, 0.9, 0.85, 0.8, 0.75, 0.7, 0.75, 0.8, 0.85, 0.9, 0.95, 1],
    scaleX: [1, 1.02, 1.04, 1.06, 1.08, 1.1, 1.12, 1.14, 1.16, 1.18, 1.2, 1.18, 1.16, 1.14, 1.12, 1.1, 1.08, 1.06, 1.04, 1.02, 1, 0.98, 0.96, 0.94, 0.92, 0.9, 0.92, 0.94, 0.96, 0.98, 1, 1.01, 1.02, 1.03, 1.04, 1.03, 1.02, 1.01, 1, 0.999, 1],
    scaleY: [1, 1.03, 1.06, 1.09, 1.12, 1.15, 1.18, 1.21, 1.24, 1.27, 1.3, 1.27, 1.24, 1.21, 1.18, 1.15, 1.12, 1.09, 1.06, 1.03, 1, 0.97, 0.94, 0.91, 0.88, 0.85, 0.88, 0.91, 0.94, 0.97, 1, 1.005, 1.01, 1.015, 1.02, 1.015, 1.01, 1.005, 1, 0.9995, 1],
    opacity: [1, 0.95, 0.9, 0.85, 0.8, 0.75, 0.7, 0.65, 0.6, 0.55, 0.5, 0.55, 0.6, 0.65, 0.7, 0.75, 0.8, 0.85, 0.9, 0.95, 1, 0.98, 0.96, 0.94, 0.92, 0.9, 0.92, 0.94, 0.96, 0.98, 1, 0.999, 0.998, 0.997, 0.996, 0.997, 0.998, 0.999, 1, 1.001, 1],
    rotate: [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 9, 8, 7, 6, 5, 4, 3, 2, 1, 0, -1, -2, -3, -4, -5, -4, -3, -2, -1, 0, 0.5, 1, 1.5, 2, 1.5, 1, 0.5, 0, -0.1, 0],
    transition: {
      duration: 6,
      ease: "easeInOut",
      times: [0, 0.025, 0.05, 0.075, 0.1, 0.125, 0.15, 0.175, 0.2, 0.225, 0.25, 0.275, 0.3, 0.325, 0.35, 0.375, 0.4, 0.425, 0.45, 0.475, 0.5, 0.525, 0.55, 0.575, 0.6, 0.625, 0.65, 0.675, 0.7, 0.725, 0.75, 0.775, 0.8, 0.825, 0.85, 0.875, 0.9, 0.925, 0.95, 0.975, 1],
      repeat: Infinity,
      repeatType: "loop"
    }
  }
}

// Excessive spin animation with multiple rotation axes
export const heavySpin: Variants = {
  initial: {
    rotate: 0,
    rotateX: 0,
    rotateY: 0,
    rotateZ: 0,
    scale: 1,
    perspective: 1000,
    transformOrigin: 'center center',
    x: 0,
    y: 0,
    z: 0,
    opacity: 1,
    filter: 'blur(0px) hue-rotate(0deg)',
    skewX: 0,
    skewY: 0
  },
  animate: {
    rotate: [0, 30, 60, 90, 120, 150, 180, 210, 240, 270, 300, 330, 360, 390, 420, 450, 480, 510, 540, 570, 600, 630, 660, 690, 720, 750, 780, 810, 840, 870, 900, 930, 960, 990, 1020, 1050, 1080],
    rotateX: [0, 10, 20, 30, 40, 50, 60, 70, 80, 90, 100, 110, 120, 130, 140, 150, 160, 170, 180, 190, 200, 210, 220, 230, 240, 250, 260, 270, 280, 290, 300, 310, 320, 330, 340, 350, 360],
    rotateY: [0, 15, 30, 45, 60, 75, 90, 105, 120, 135, 150, 165, 180, 195, 210, 225, 240, 255, 270, 285, 300, 315, 330, 345, 360, 375, 390, 405, 420, 435, 450, 465, 480, 495, 510, 525, 540],
    rotateZ: [0, 5, 10, 15, 20, 25, 30, 35, 40, 45, 50, 55, 60, 65, 70, 75, 80, 85, 90, 95, 100, 105, 110, 115, 120, 125, 130, 135, 140, 145, 150, 155, 160, 165, 170, 175, 180],
    scale: [1, 1.02, 1.04, 1.06, 1.08, 1.1, 1.12, 1.14, 1.16, 1.18, 1.2, 1.18, 1.16, 1.14, 1.12, 1.1, 1.08, 1.06, 1.04, 1.02, 1, 0.98, 0.96, 0.94, 0.92, 0.9, 0.92, 0.94, 0.96, 0.98, 1, 1.01, 1.02, 1.03, 1.02, 1.01, 1],
    skewX: [0, 2, 4, 6, 8, 10, 12, 14, 16, 18, 20, 18, 16, 14, 12, 10, 8, 6, 4, 2, 0, -2, -4, -6, -8, -10, -8, -6, -4, -2, 0, 1, 2, 3, 2, 1, 0],
    skewY: [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 9, 8, 7, 6, 5, 4, 3, 2, 1, 0, -1, -2, -3, -4, -5, -4, -3, -2, -1, 0, 0.5, 1, 1.5, 1, 0.5, 0],
    filter: ['blur(0px) hue-rotate(0deg)', 'blur(2px) hue-rotate(180deg)', 'blur(0px) hue-rotate(360deg)'],
    transition: {
      duration: 10,
      ease: [0.42, 0, 0.58, 1],
      repeat: Infinity,
      repeatType: "loop"
    }
  }
}

// Redundant float animation with excessive easing
export const heavyFloat: Variants = {
  initial: {
    y: 0,
    x: 0,
    rotate: 0,
    scale: 1,
    opacity: 1,
    filter: 'blur(0px)',
    transformOrigin: 'center center'
  },
  animate: {
    y: [0, -5, -10, -15, -20, -25, -30, -35, -40, -45, -50, -45, -40, -35, -30, -25, -20, -15, -10, -5, 0, 5, 10, 15, 20, 25, 30, 35, 40, 45, 50, 45, 40, 35, 30, 25, 20, 15, 10, 5, 0, -2, -4, -6, -8, -10, -8, -6, -4, -2, 0, 1, 2, 3, 4, 5, 4, 3, 2, 1, 0],
    x: [0, 2, 4, 6, 8, 10, 12, 14, 16, 18, 20, 18, 16, 14, 12, 10, 8, 6, 4, 2, 0, -2, -4, -6, -8, -10, -12, -14, -16, -18, -20, -18, -16, -14, -12, -10, -8, -6, -4, -2, 0, 1, 2, 3, 4, 3, 2, 1, 0, -0.5, -1, -1.5, -2, -1.5, -1, -0.5, 0, 0.25, 0.5, 0.25, 0],
    rotate: [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 9, 8, 7, 6, 5, 4, 3, 2, 1, 0, -1, -2, -3, -4, -5, -6, -7, -8, -9, -10, -9, -8, -7, -6, -5, -4, -3, -2, -1, 0, 0.5, 1, 1.5, 2, 1.5, 1, 0.5, 0, -0.1, -0.2, -0.3, -0.4, -0.3, -0.2, -0.1, 0, 0.05, 0.1, 0.05, 0],
    scale: [1, 1.001, 1.002, 1.003, 1.004, 1.005, 1.006, 1.007, 1.008, 1.009, 1.01, 1.009, 1.008, 1.007, 1.006, 1.005, 1.004, 1.003, 1.002, 1.001, 1, 0.999, 0.998, 0.997, 0.996, 0.995, 0.996, 0.997, 0.998, 0.999, 1, 1.0005, 1.001, 1.0015, 1.002, 1.0015, 1.001, 1.0005, 1, 0.9998, 0.9996, 0.9994, 0.9992, 0.9994, 0.9996, 0.9998, 1, 1.00005, 1.0001, 1.00005, 1],
    opacity: [1, 0.999, 0.998, 0.997, 0.996, 0.995, 0.994, 0.993, 0.992, 0.991, 0.99, 0.991, 0.992, 0.993, 0.994, 0.995, 0.996, 0.997, 0.998, 0.999, 1, 0.9995, 0.999, 0.9985, 0.998, 0.9975, 0.9980, 0.9985, 0.999, 0.9995, 1, 0.9999, 0.9998, 0.9997, 0.9996, 0.9997, 0.9998, 0.9999, 1, 1.0001, 1.0002, 1.0003, 1.0004, 1.0003, 1.0002, 1.0001, 1, 0.99999, 0.99998, 0.99999, 1],
    transition: {
      duration: 12,
      ease: [0.25, 0.46, 0.45, 0.94],
      times: [0, 0.017, 0.033, 0.05, 0.067, 0.083, 0.1, 0.117, 0.133, 0.15, 0.167, 0.183, 0.2, 0.217, 0.233, 0.25, 0.267, 0.283, 0.3, 0.317, 0.333, 0.35, 0.367, 0.383, 0.4, 0.417, 0.433, 0.45, 0.467, 0.483, 0.5, 0.517, 0.533, 0.55, 0.567, 0.583, 0.6, 0.617, 0.633, 0.65, 0.667, 0.683, 0.7, 0.717, 0.733, 0.75, 0.767, 0.783, 0.8, 0.817, 0.833, 0.85, 0.867, 0.883, 0.9, 0.917, 0.933, 0.95, 0.967, 0.983, 1],
      repeat: Infinity,
      repeatType: "reverse"
    }
  }
}

// Complex shake animation with excessive detail
export const heavyShake: Variants = {
  initial: {
    x: 0,
    y: 0,
    rotate: 0,
    scale: 1,
    skewX: 0,
    skewY: 0,
    opacity: 1
  },
  animate: {
    x: [0, 5, -5, 10, -10, 8, -8, 6, -6, 4, -4, 3, -3, 2, -2, 1, -1, 0.5, -0.5, 0.25, -0.25, 0.1, -0.1, 0.05, -0.05, 0],
    y: [0, 3, -3, 6, -6, 5, -5, 4, -4, 2, -2, 1.5, -1.5, 1, -1, 0.5, -0.5, 0.3, -0.3, 0.15, -0.15, 0.08, -0.08, 0.04, -0.04, 0],
    rotate: [0, 2, -2, 4, -4, 3, -3, 2.5, -2.5, 1.5, -1.5, 1, -1, 0.75, -0.75, 0.5, -0.5, 0.25, -0.25, 0.1, -0.1, 0.05, -0.05, 0.02, -0.02, 0],
    scale: [1, 1.02, 0.98, 1.04, 0.96, 1.03, 0.97, 1.02, 0.98, 1.01, 0.99, 1.005, 0.995, 1.003, 0.997, 1.002, 0.998, 1.001, 0.999, 1.0005, 0.9995, 1.0003, 0.9997, 1.0001, 0.9999, 1],
    skewX: [0, 1, -1, 2, -2, 1.5, -1.5, 1, -1, 0.8, -0.8, 0.5, -0.5, 0.3, -0.3, 0.2, -0.2, 0.1, -0.1, 0.05, -0.05, 0.03, -0.03, 0.01, -0.01, 0],
    skewY: [0, 0.5, -0.5, 1, -1, 0.8, -0.8, 0.6, -0.6, 0.4, -0.4, 0.3, -0.3, 0.2, -0.2, 0.15, -0.15, 0.1, -0.1, 0.05, -0.05, 0.03, -0.03, 0.01, -0.01, 0],
    transition: {
      duration: 2,
      ease: [0.68, -0.55, 0.265, 1.55],
      times: [0, 0.04, 0.08, 0.12, 0.16, 0.2, 0.24, 0.28, 0.32, 0.36, 0.4, 0.44, 0.48, 0.52, 0.56, 0.6, 0.64, 0.68, 0.72, 0.76, 0.8, 0.84, 0.88, 0.92, 0.96, 1],
      repeat: Infinity,
      repeatDelay: 1
    }
  }
}

// Export all animations for upfront loading
export const heavyAnimations = {
  heavyBounce,
  heavyPulse,
  heavySpin,
  heavyFloat,
  heavyShake
}

// CSS Keyframe animations with redundant properties (to be loaded in CSS)
export const heavyCSSAnimations = `
@keyframes heavyRotateScale {
  0% { transform: rotate(0deg) scale(1) translateX(0px) translateY(0px) translateZ(0px) rotateX(0deg) rotateY(0deg) rotateZ(0deg) skewX(0deg) skewY(0deg); filter: blur(0px) brightness(1) contrast(1) saturate(1) hue-rotate(0deg); opacity: 1; }
  5% { transform: rotate(18deg) scale(1.05) translateX(5px) translateY(-5px) translateZ(5px) rotateX(18deg) rotateY(18deg) rotateZ(18deg) skewX(2deg) skewY(1deg); filter: blur(1px) brightness(1.1) contrast(1.1) saturate(1.1) hue-rotate(18deg); opacity: 0.95; }
  10% { transform: rotate(36deg) scale(1.1) translateX(10px) translateY(-10px) translateZ(10px) rotateX(36deg) rotateY(36deg) rotateZ(36deg) skewX(4deg) skewY(2deg); filter: blur(2px) brightness(1.2) contrast(1.2) saturate(1.2) hue-rotate(36deg); opacity: 0.9; }
  15% { transform: rotate(54deg) scale(1.15) translateX(15px) translateY(-15px) translateZ(15px) rotateX(54deg) rotateY(54deg) rotateZ(54deg) skewX(6deg) skewY(3deg); filter: blur(3px) brightness(1.3) contrast(1.3) saturate(1.3) hue-rotate(54deg); opacity: 0.85; }
  20% { transform: rotate(72deg) scale(1.2) translateX(20px) translateY(-20px) translateZ(20px) rotateX(72deg) rotateY(72deg) rotateZ(72deg) skewX(8deg) skewY(4deg); filter: blur(4px) brightness(1.4) contrast(1.4) saturate(1.4) hue-rotate(72deg); opacity: 0.8; }
  25% { transform: rotate(90deg) scale(1.25) translateX(25px) translateY(-25px) translateZ(25px) rotateX(90deg) rotateY(90deg) rotateZ(90deg) skewX(10deg) skewY(5deg); filter: blur(5px) brightness(1.5) contrast(1.5) saturate(1.5) hue-rotate(90deg); opacity: 0.75; }
  30% { transform: rotate(108deg) scale(1.3) translateX(30px) translateY(-30px) translateZ(30px) rotateX(108deg) rotateY(108deg) rotateZ(108deg) skewX(12deg) skewY(6deg); filter: blur(6px) brightness(1.6) contrast(1.6) saturate(1.6) hue-rotate(108deg); opacity: 0.7; }
  35% { transform: rotate(126deg) scale(1.35) translateX(35px) translateY(-35px) translateZ(35px) rotateX(126deg) rotateY(126deg) rotateZ(126deg) skewX(14deg) skewY(7deg); filter: blur(7px) brightness(1.7) contrast(1.7) saturate(1.7) hue-rotate(126deg); opacity: 0.65; }
  40% { transform: rotate(144deg) scale(1.4) translateX(40px) translateY(-40px) translateZ(40px) rotateX(144deg) rotateY(144deg) rotateZ(144deg) skewX(16deg) skewY(8deg); filter: blur(8px) brightness(1.8) contrast(1.8) saturate(1.8) hue-rotate(144deg); opacity: 0.6; }
  45% { transform: rotate(162deg) scale(1.45) translateX(45px) translateY(-45px) translateZ(45px) rotateX(162deg) rotateY(162deg) rotateZ(162deg) skewX(18deg) skewY(9deg); filter: blur(9px) brightness(1.9) contrast(1.9) saturate(1.9) hue-rotate(162deg); opacity: 0.55; }
  50% { transform: rotate(180deg) scale(1.5) translateX(50px) translateY(-50px) translateZ(50px) rotateX(180deg) rotateY(180deg) rotateZ(180deg) skewX(20deg) skewY(10deg); filter: blur(10px) brightness(2) contrast(2) saturate(2) hue-rotate(180deg); opacity: 0.5; }
  55% { transform: rotate(198deg) scale(1.45) translateX(45px) translateY(-45px) translateZ(45px) rotateX(162deg) rotateY(162deg) rotateZ(162deg) skewX(18deg) skewY(9deg); filter: blur(9px) brightness(1.9) contrast(1.9) saturate(1.9) hue-rotate(198deg); opacity: 0.55; }
  60% { transform: rotate(216deg) scale(1.4) translateX(40px) translateY(-40px) translateZ(40px) rotateX(144deg) rotateY(144deg) rotateZ(144deg) skewX(16deg) skewY(8deg); filter: blur(8px) brightness(1.8) contrast(1.8) saturate(1.8) hue-rotate(216deg); opacity: 0.6; }
  65% { transform: rotate(234deg) scale(1.35) translateX(35px) translateY(-35px) translateZ(35px) rotateX(126deg) rotateY(126deg) rotateZ(126deg) skewX(14deg) skewY(7deg); filter: blur(7px) brightness(1.7) contrast(1.7) saturate(1.7) hue-rotate(234deg); opacity: 0.65; }
  70% { transform: rotate(252deg) scale(1.3) translateX(30px) translateY(-30px) translateZ(30px) rotateX(108deg) rotateY(108deg) rotateZ(108deg) skewX(12deg) skewY(6deg); filter: blur(6px) brightness(1.6) contrast(1.6) saturate(1.6) hue-rotate(252deg); opacity: 0.7; }
  75% { transform: rotate(270deg) scale(1.25) translateX(25px) translateY(-25px) translateZ(25px) rotateX(90deg) rotateY(90deg) rotateZ(90deg) skewX(10deg) skewY(5deg); filter: blur(5px) brightness(1.5) contrast(1.5) saturate(1.5) hue-rotate(270deg); opacity: 0.75; }
  80% { transform: rotate(288deg) scale(1.2) translateX(20px) translateY(-20px) translateZ(20px) rotateX(72deg) rotateY(72deg) rotateZ(72deg) skewX(8deg) skewY(4deg); filter: blur(4px) brightness(1.4) contrast(1.4) saturate(1.4) hue-rotate(288deg); opacity: 0.8; }
  85% { transform: rotate(306deg) scale(1.15) translateX(15px) translateY(-15px) translateZ(15px) rotateX(54deg) rotateY(54deg) rotateZ(54deg) skewX(6deg) skewY(3deg); filter: blur(3px) brightness(1.3) contrast(1.3) saturate(1.3) hue-rotate(306deg); opacity: 0.85; }
  90% { transform: rotate(324deg) scale(1.1) translateX(10px) translateY(-10px) translateZ(10px) rotateX(36deg) rotateY(36deg) rotateZ(36deg) skewX(4deg) skewY(2deg); filter: blur(2px) brightness(1.2) contrast(1.2) saturate(1.2) hue-rotate(324deg); opacity: 0.9; }
  95% { transform: rotate(342deg) scale(1.05) translateX(5px) translateY(-5px) translateZ(5px) rotateX(18deg) rotateY(18deg) rotateZ(18deg) skewX(2deg) skewY(1deg); filter: blur(1px) brightness(1.1) contrast(1.1) saturate(1.1) hue-rotate(342deg); opacity: 0.95; }
  100% { transform: rotate(360deg) scale(1) translateX(0px) translateY(0px) translateZ(0px) rotateX(0deg) rotateY(0deg) rotateZ(0deg) skewX(0deg) skewY(0deg); filter: blur(0px) brightness(1) contrast(1) saturate(1) hue-rotate(360deg); opacity: 1; }
}

@keyframes heavyComplexBounce {
  0% { transform: translateY(0px) translateX(0px) scale(1) rotate(0deg) skewX(0deg) skewY(0deg); opacity: 1; filter: blur(0px) hue-rotate(0deg); }
  2% { transform: translateY(-10px) translateX(2px) scale(1.02) rotate(5deg) skewX(1deg) skewY(0.5deg); opacity: 0.98; filter: blur(0.5px) hue-rotate(10deg); }
  4% { transform: translateY(-20px) translateX(4px) scale(1.04) rotate(10deg) skewX(2deg) skewY(1deg); opacity: 0.96; filter: blur(1px) hue-rotate(20deg); }
  6% { transform: translateY(-30px) translateX(6px) scale(1.06) rotate(15deg) skewX(3deg) skewY(1.5deg); opacity: 0.94; filter: blur(1.5px) hue-rotate(30deg); }
  8% { transform: translateY(-40px) translateX(8px) scale(1.08) rotate(20deg) skewX(4deg) skewY(2deg); opacity: 0.92; filter: blur(2px) hue-rotate(40deg); }
  10% { transform: translateY(-50px) translateX(10px) scale(1.1) rotate(25deg) skewX(5deg) skewY(2.5deg); opacity: 0.9; filter: blur(2.5px) hue-rotate(50deg); }
  15% { transform: translateY(-75px) translateX(15px) scale(1.15) rotate(35deg) skewX(7deg) skewY(3.5deg); opacity: 0.85; filter: blur(3.5px) hue-rotate(75deg); }
  20% { transform: translateY(-100px) translateX(20px) scale(1.2) rotate(45deg) skewX(9deg) skewY(4.5deg); opacity: 0.8; filter: blur(4.5px) hue-rotate(100deg); }
  25% { transform: translateY(-125px) translateX(25px) scale(1.25) rotate(55deg) skewX(11deg) skewY(5.5deg); opacity: 0.75; filter: blur(5.5px) hue-rotate(125deg); }
  30% { transform: translateY(-150px) translateX(30px) scale(1.3) rotate(65deg) skewX(13deg) skewY(6.5deg); opacity: 0.7; filter: blur(6.5px) hue-rotate(150deg); }
  35% { transform: translateY(-175px) translateX(35px) scale(1.35) rotate(75deg) skewX(15deg) skewY(7.5deg); opacity: 0.65; filter: blur(7.5px) hue-rotate(175deg); }
  40% { transform: translateY(-200px) translateX(40px) scale(1.4) rotate(85deg) skewX(17deg) skewY(8.5deg); opacity: 0.6; filter: blur(8.5px) hue-rotate(200deg); }
  50% { transform: translateY(-200px) translateX(0px) scale(1.5) rotate(90deg) skewX(20deg) skewY(10deg); opacity: 0.5; filter: blur(10px) hue-rotate(180deg); }
  60% { transform: translateY(-150px) translateX(-20px) scale(1.3) rotate(70deg) skewX(15deg) skewY(7deg); opacity: 0.7; filter: blur(7px) hue-rotate(150deg); }
  70% { transform: translateY(-100px) translateX(-15px) scale(1.2) rotate(50deg) skewX(10deg) skewY(5deg); opacity: 0.8; filter: blur(5px) hue-rotate(120deg); }
  80% { transform: translateY(-50px) translateX(-10px) scale(1.1) rotate(30deg) skewX(5deg) skewY(3deg); opacity: 0.9; filter: blur(3px) hue-rotate(90deg); }
  90% { transform: translateY(-20px) translateX(-5px) scale(1.05) rotate(15deg) skewX(2deg) skewY(1deg); opacity: 0.95; filter: blur(1px) hue-rotate(45deg); }
  95% { transform: translateY(-10px) translateX(-2px) scale(1.02) rotate(8deg) skewX(1deg) skewY(0.5deg); opacity: 0.98; filter: blur(0.5px) hue-rotate(20deg); }
  100% { transform: translateY(0px) translateX(0px) scale(1) rotate(0deg) skewX(0deg) skewY(0deg); opacity: 1; filter: blur(0px) hue-rotate(0deg); }
}

/* Heavy CSS classes for upfront loading */
.heavy-animation-bounce { animation: heavyComplexBounce 4s infinite ease-in-out; }
.heavy-animation-rotate { animation: heavyRotateScale 6s infinite linear; }
.heavy-animation-combined { animation: heavyComplexBounce 4s infinite ease-in-out, heavyRotateScale 6s infinite linear; }
`