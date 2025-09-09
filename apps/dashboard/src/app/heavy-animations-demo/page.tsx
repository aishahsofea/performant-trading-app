'use client'

import React from 'react'
import { motion } from 'framer-motion'
import HeavyAnimationLoader from '../../components/heavy-animation-loader'
import { heavyAnimations } from '../../animations/heavy-animations'

const HeavyAnimationsDemo = () => {
  return (
    <HeavyAnimationLoader
      enableAllAnimations={true}
      enableLottieAnimations={true}
      enableFramerAnimations={true}
      enableCSSAnimations={true}
    >
      <div className="min-h-screen bg-gradient-to-br from-blue-900 to-purple-900 p-8">
        <h1 className="text-4xl font-bold text-white mb-8 text-center">
          Heavy Animation Library Demo
        </h1>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-6xl mx-auto">
          {/* Heavy Bounce Animation */}
          <div className="bg-white/10 backdrop-blur-sm rounded-lg p-6">
            <h2 className="text-xl font-semibold text-white mb-4">Heavy Bounce</h2>
            <motion.div
              className="w-20 h-20 bg-green-500 rounded-full mx-auto"
              variants={heavyAnimations.heavyBounce}
              initial="initial"
              animate="animate"
            />
          </div>

          {/* Heavy Pulse Animation */}
          <div className="bg-white/10 backdrop-blur-sm rounded-lg p-6">
            <h2 className="text-xl font-semibold text-white mb-4">Heavy Pulse</h2>
            <motion.div
              className="w-20 h-20 bg-red-500 rounded-lg mx-auto"
              variants={heavyAnimations.heavyPulse}
              initial="initial"
              animate="animate"
            />
          </div>

          {/* Heavy Spin Animation */}
          <div className="bg-white/10 backdrop-blur-sm rounded-lg p-6">
            <h2 className="text-xl font-semibold text-white mb-4">Heavy Spin</h2>
            <motion.div
              className="w-20 h-20 bg-blue-500 rounded-lg mx-auto"
              variants={heavyAnimations.heavySpin}
              initial="initial"
              animate="animate"
            />
          </div>

          {/* Heavy Float Animation */}
          <div className="bg-white/10 backdrop-blur-sm rounded-lg p-6">
            <h2 className="text-xl font-semibold text-white mb-4">Heavy Float</h2>
            <motion.div
              className="w-20 h-20 bg-yellow-500 rounded-full mx-auto"
              variants={heavyAnimations.heavyFloat}
              initial="initial"
              animate="animate"
            />
          </div>

          {/* Heavy Shake Animation */}
          <div className="bg-white/10 backdrop-blur-sm rounded-lg p-6">
            <h2 className="text-xl font-semibold text-white mb-4">Heavy Shake</h2>
            <motion.div
              className="w-20 h-20 bg-purple-500 rounded-lg mx-auto"
              variants={heavyAnimations.heavyShake}
              initial="initial"
              animate="animate"
            />
          </div>

          {/* CSS Animations */}
          <div className="bg-white/10 backdrop-blur-sm rounded-lg p-6">
            <h2 className="text-xl font-semibold text-white mb-4">CSS Heavy Animations</h2>
            <div className="flex gap-2 justify-center">
              <div className="w-12 h-12 bg-orange-500 heavy-animation-bounce rounded" />
              <div className="w-12 h-12 bg-pink-500 heavy-animation-rotate rounded" />
              <div className="w-12 h-12 bg-cyan-500 heavy-animation-combined rounded" />
            </div>
          </div>
        </div>

        <div className="text-center mt-12">
          <p className="text-white/80 text-lg">
            Open DevTools to see the performance impact!
          </p>
          <p className="text-white/60 text-sm mt-2">
            All animations loaded upfront without code splitting
          </p>
        </div>
      </div>
    </HeavyAnimationLoader>
  )
}

export default HeavyAnimationsDemo