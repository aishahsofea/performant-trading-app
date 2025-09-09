'use client'

/**
 * Heavy Animation Loader Component
 * Deliberately loads ALL animation libraries upfront without code splitting
 * Creates performance bottleneck for optimization testing
 */

import React, { useEffect, useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import Lottie from 'lottie-react'

// Import ALL animations upfront (no lazy loading)
import { heavyAnimations, heavyCSSAnimations } from '../animations/heavy-animations'

// Import all Lottie animations synchronously
import bullAnimation from '../../public/animations/trading-indicator-bull.json'
import bearAnimation from '../../public/animations/trading-indicator-bear.json' 
import stockChartAnimation from '../../public/animations/complex-stock-chart.json'

// Force import of entire Framer Motion library (no tree shaking)
import * as FramerMotion from 'framer-motion'

export interface HeavyAnimationLoaderProps {
  enableAllAnimations?: boolean
  enableLottieAnimations?: boolean
  enableFramerAnimations?: boolean
  enableCSSAnimations?: boolean
  children?: React.ReactNode
}

// Pre-load all animation data into memory
const preloadedAnimations = {
  bull: bullAnimation,
  bear: bearAnimation,
  stockChart: stockChartAnimation,
  framerVariants: heavyAnimations,
  cssAnimations: heavyCSSAnimations,
  // Force loading of entire Framer Motion API
  framerMotionAPI: FramerMotion
}

const HeavyAnimationLoader = ({
  enableAllAnimations = true,
  enableLottieAnimations = true,
  enableFramerAnimations = true,
  enableCSSAnimations = true,
  children
}: HeavyAnimationLoaderProps) => {
  const [isLoaded, setIsLoaded] = useState(false)
  const [animationsInitialized, setAnimationsInitialized] = useState(false)

  // Force load all animations on component mount (blocking)
  useEffect(() => {
    const loadAllAnimations = async () => {
      try {
        // Simulate heavy synchronous processing
        const start = performance.now()
        
        // Process all animation data synchronously (no async/await optimization)
        const processedAnimations = {
          bull: bullAnimation,
          bear: bearAnimation,
          stockChart: stockChartAnimation,
          framerVariants: heavyAnimations,
          cssAnimations: heavyCSSAnimations,
          // Force processing of each animation frame
          processedBull: JSON.parse(JSON.stringify(bullAnimation)),
          processedBear: JSON.parse(JSON.stringify(bearAnimation)),
          processedChart: JSON.parse(JSON.stringify(stockChartAnimation))
        }

        // Deliberately heavy computation to simulate processing (without circular refs)
        for (let i = 0; i < 1000; i++) {
          const temp = JSON.stringify(processedAnimations)
          JSON.parse(temp)
        }

        // Inject CSS animations into document head (blocking)
        if (enableCSSAnimations) {
          const styleElement = document.createElement('style')
          styleElement.textContent = heavyCSSAnimations
          document.head.appendChild(styleElement)
        }

        const end = performance.now()
        console.warn(`Heavy Animation Loader: Loaded ${Object.keys(processedAnimations).length} animations in ${end - start}ms`)

        setAnimationsInitialized(true)
        setIsLoaded(true)
      } catch (error) {
        console.error('Failed to load heavy animations:', error)
        setIsLoaded(true) // Continue even on error
      }
    }

    loadAllAnimations() // Synchronous call (no await)
  }, [enableCSSAnimations])

  // Render all animation components simultaneously (no lazy loading)
  const renderAllAnimations = () => {
    if (!isLoaded || !animationsInitialized) return null

    return (
      <>
        {/* Render all Lottie animations simultaneously */}
        {(enableAllAnimations || enableLottieAnimations) && (
          <div style={{ position: 'absolute', top: -9999, left: -9999, opacity: 0 }}>
            <Lottie 
              animationData={preloadedAnimations.bull}
              loop={true}
              autoplay={true}
              style={{ width: 200, height: 200 }}
            />
            <Lottie 
              animationData={preloadedAnimations.bear}
              loop={true}
              autoplay={true}
              style={{ width: 200, height: 200 }}
            />
            <Lottie 
              animationData={preloadedAnimations.stockChart}
              loop={true}
              autoplay={true}
              style={{ width: 300, height: 200 }}
            />
          </div>
        )}

        {/* Render all Framer Motion animations */}
        {(enableAllAnimations || enableFramerAnimations) && (
          <div style={{ position: 'absolute', top: -9999, left: -9999, opacity: 0 }}>
            {Object.entries(heavyAnimations).map(([key, variants]) => (
              <motion.div
                key={key}
                variants={variants}
                initial="initial"
                animate="animate"
                style={{ width: 50, height: 50, backgroundColor: '#000' }}
              />
            ))}
          </div>
        )}

        {/* Force all CSS animations to load */}
        {(enableAllAnimations || enableCSSAnimations) && (
          <div style={{ position: 'absolute', top: -9999, left: -9999, opacity: 0 }}>
            <div className="heavy-animation-bounce" style={{ width: 20, height: 20, background: 'red' }} />
            <div className="heavy-animation-rotate" style={{ width: 20, height: 20, background: 'blue' }} />
            <div className="heavy-animation-combined" style={{ width: 20, height: 20, background: 'green' }} />
          </div>
        )}
      </>
    )
  }

  return (
    <div className="heavy-animation-loader">
      {/* Loading state with heavy animation */}
      <AnimatePresence>
        {!isLoaded && (
          <motion.div
            initial={{ opacity: 0, scale: 0.5, rotate: -180 }}
            animate={{ 
              opacity: [0, 1, 0.5, 1],
              scale: [0.5, 1.2, 0.8, 1],
              rotate: [-180, 0, 360, 720],
              transition: { duration: 2, ease: "easeInOut" }
            }}
            exit={{ 
              opacity: 0, 
              scale: 0,
              rotate: 1080,
              transition: { duration: 1 }
            }}
            style={{
              position: 'fixed',
              top: '50%',
              left: '50%',
              transform: 'translate(-50%, -50%)',
              zIndex: 9999,
              padding: '20px',
              background: 'rgba(0, 0, 0, 0.8)',
              color: 'white',
              borderRadius: '10px',
              textAlign: 'center'
            }}
          >
            Loading Heavy Animation Libraries...
            <br />
            <small>Deliberately synchronous for performance testing</small>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Render all animations (hidden but loaded) */}
      {renderAllAnimations()}

      {/* Render children only after animations are loaded */}
      {isLoaded && children}
    </div>
  )
}

export default HeavyAnimationLoader

// Export preloaded animation data for use in other components
export { preloadedAnimations }

// Export utility functions for forcing animation usage
export const forceUseAllAnimations = () => {
  // Force usage of all Framer Motion features
  const allFramerFeatures = {
    motion: FramerMotion.motion,
    AnimatePresence: FramerMotion.AnimatePresence,
    useAnimation: FramerMotion.useAnimation,
    useMotionValue: FramerMotion.useMotionValue,
    useTransform: FramerMotion.useTransform,
    useSpring: FramerMotion.useSpring,
    useCycle: FramerMotion.useCycle,
    usePresence: FramerMotion.usePresence,
    useReducedMotion: FramerMotion.useReducedMotion,
    MotionConfig: FramerMotion.MotionConfig,
    LazyMotion: FramerMotion.LazyMotion,
    domAnimation: FramerMotion.domAnimation,
    domMax: FramerMotion.domMax
  }

  console.log('Loaded Framer Motion features:', Object.keys(allFramerFeatures))
  return allFramerFeatures
}