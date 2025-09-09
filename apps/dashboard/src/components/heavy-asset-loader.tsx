'use client'

/**
 * Heavy Asset Loader Component
 * Deliberately loads ALL assets synchronously without optimization
 * Creates performance bottleneck for optimization testing
 */

import React, { useEffect, useState } from 'react'

export interface HeavyAssetLoaderProps {
  enableImageLoading?: boolean
  enableIconLoading?: boolean
  enableLogoLoading?: boolean
  children?: React.ReactNode
}

// Large unoptimized trading chart images in multiple formats (no responsive variants)
const heavyTradingCharts = [
  // SVG Format - Bitcoin Chart
  {
    id: 'btc-chart-4k-svg',
    format: 'SVG',
    src: 'data:image/svg+xml;base64,' + btoa(`
      <svg width="3840" height="2160" xmlns="http://www.w3.org/2000/svg">
        <defs>
          <linearGradient id="grad1" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" style="stop-color:rgb(255,255,0);stop-opacity:1" />
            <stop offset="100%" style="stop-color:rgb(255,0,0);stop-opacity:1" />
          </linearGradient>
        </defs>
        <rect width="3840" height="2160" fill="url(#grad1)" />
        ${Array.from({length: 1000}, (_, i) => 
          `<circle cx="${Math.random() * 3840}" cy="${Math.random() * 2160}" r="${Math.random() * 20}" fill="rgba(${Math.floor(Math.random() * 255)},${Math.floor(Math.random() * 255)},${Math.floor(Math.random() * 255)},0.7)" />`
        ).join('')}
        <text x="1920" y="1080" font-family="Arial" font-size="100" fill="white" text-anchor="middle">BTC CHART 4K SVG</text>
      </svg>
    `),
    alt: 'Bitcoin 4K Trading Chart SVG',
    width: 3840,
    height: 2160
  },
  // PNG Format - Bitcoin Chart (same content, different format)
  {
    id: 'btc-chart-4k-png',
    format: 'PNG',
    src: 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mP8/5+hHgAHggJ/PchI7wAAAABJRU5ErkJggg==', // 1x1 transparent PNG
    alt: 'Bitcoin 4K Trading Chart PNG',
    width: 3840,
    height: 2160
  },
  // JPEG Format - Ethereum Chart
  {
    id: 'eth-chart-4k-jpg',
    format: 'JPEG',
    src: 'data:image/jpeg;base64,/9j/4AAQSkZJRgABAQEAYABgAAD/2wBDAAEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQH/wAARCAABAAEDAREAAhEBAxEB/8QAFQABAQAAAAAAAAAAAAAAAAAAAAv/xAAUEAEAAAAAAAAAAAAAAAAAAAAA/8QAFQEBAQAAAAAAAAAAAAAAAAAAAAX/xAAUEQEAAAAAAAAAAAAAAAAAAAAA/9oADAMBAAIRAxEAPwA/gA==',
    alt: 'Ethereum 4K Trading Chart JPEG',
    width: 3840,
    height: 2160
  },
  // WebP Format - Ethereum Chart
  {
    id: 'eth-chart-4k-webp',
    format: 'WebP',
    src: 'data:image/webp;base64,UklGRiIAAABXRUJQVlA4IBYAAAAwAQCdASoBAAEADsD+JaQAA3AAAAAA',
    alt: 'Ethereum 4K Trading Chart WebP',
    width: 3840,
    height: 2160
  },
  {
    id: 'stock-chart-8k',
    src: 'data:image/svg+xml;base64,' + btoa(`
      <svg width="7680" height="4320" xmlns="http://www.w3.org/2000/svg">
        <defs>
          <linearGradient id="grad3" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" style="stop-color:rgb(255,0,255);stop-opacity:1" />
            <stop offset="50%" style="stop-color:rgb(0,255,0);stop-opacity:1" />
            <stop offset="100%" style="stop-color:rgb(255,255,0);stop-opacity:1" />
          </linearGradient>
        </defs>
        <rect width="7680" height="4320" fill="url(#grad3)" />
        ${Array.from({length: 2000}, (_, i) => 
          `<rect x="${Math.random() * 7680}" y="${Math.random() * 4320}" width="${Math.random() * 50}" height="${Math.random() * 50}" fill="rgba(${Math.floor(Math.random() * 255)},${Math.floor(Math.random() * 255)},${Math.floor(Math.random() * 255)},0.8)" />`
        ).join('')}
        <text x="3840" y="2160" font-family="Arial" font-size="200" fill="white" text-anchor="middle">STOCK CHART 8K</text>
      </svg>
    `),
    alt: 'Stock Market 8K Trading Chart',
    width: 7680,
    height: 4320
  },
  // Additional multiple format variants without responsive images
  // JPEG Format - Large Trading Dashboard
  {
    id: 'trading-dashboard-jpg',
    format: 'JPEG',
    src: 'data:image/jpeg;base64,/9j/4AAQSkZJRgABAQEAYABgAAD/2wBDAAEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQH/wAARCAABAAEDAREAAhEBAxEB/8QAFQABAQAAAAAAAAAAAAAAAAAAAAv/xAAUEAEAAAAAAAAAAAAAAAAAAAAA/8QAFQEBAQAAAAAAAAAAAAAAAAAAAAX/xAAUEQEAAAAAAAAAAAAAAAAAAAAA/9oADAMBAAIRAxEAPwA/gA==',
    alt: 'Trading Dashboard JPEG 4K',
    width: 3840,
    height: 2160
  },
  // WebP Format - Trading Analytics
  {
    id: 'trading-analytics-webp',
    format: 'WebP',
    src: 'data:image/webp;base64,UklGRiIAAABXRUJQVlA4IBYAAAAwAQCdASoBAAEADsD+JaQAA3AAAAAA',
    alt: 'Trading Analytics WebP 4K',
    width: 3840,
    height: 2160
  },
  // GIF Format - Animated Trading Indicators
  {
    id: 'trading-indicators-gif',
    format: 'GIF',
    src: 'data:image/gif;base64,R0lGODlhAQABAIAAAAAAAP///yH5BAEAAAAALAAAAAABAAEAAAIBRAA7',
    alt: 'Animated Trading Indicators GIF',
    width: 2048,
    height: 1536
  },
  // BMP Format - Trading Heatmap (deliberately inefficient)
  {
    id: 'trading-heatmap-bmp',
    format: 'BMP',
    src: 'data:image/bmp;base64,Qk08AAAAAAAAADYAAAAoAAAAAQAAAAEAAAABACAAAAAAAAYAAAASCwAAEgsAAAAAAAAAAAAA/wAA',
    alt: 'Trading Heatmap BMP 8K',
    width: 7680,
    height: 4320
  },
  // TIFF Format - Trading Portfolio
  {
    id: 'trading-portfolio-tiff',
    format: 'TIFF',
    src: 'data:image/tiff;base64,SUkqAAgAAAANAP4ABAABAAAAAAAAAAABABAAAAAAAADAAQAAAAAAAA==',
    alt: 'Trading Portfolio TIFF 8K',
    width: 7680,
    height: 4320
  }
]

// Heavy icon set (simulated with complex SVGs)
const heavyIcons = Array.from({length: 50}, (_, i) => ({
  id: `trading-icon-${i}`,
  src: 'data:image/svg+xml;base64,' + btoa(`
    <svg width="512" height="512" xmlns="http://www.w3.org/2000/svg">
      <defs>
        <filter id="shadow${i}">
          <feDropShadow dx="10" dy="10" stdDeviation="5"/>
        </filter>
      </defs>
      ${Array.from({length: 20}, (_, j) => 
        `<circle cx="${Math.random() * 512}" cy="${Math.random() * 512}" r="${Math.random() * 30 + 10}" fill="rgba(${Math.floor(Math.random() * 255)},${Math.floor(Math.random() * 255)},${Math.floor(Math.random() * 255)},0.8)" filter="url(#shadow${i})" />`
      ).join('')}
      <text x="256" y="256" font-family="Arial" font-size="40" fill="white" text-anchor="middle">ICON ${i}</text>
    </svg>
  `),
  alt: `Trading Icon ${i}`,
  width: 512,
  height: 512
}))

// Heavy logo set (simulated with complex SVGs)
const heavyLogos = Array.from({length: 20}, (_, i) => ({
  id: `trading-logo-${i}`,
  src: 'data:image/svg+xml;base64,' + btoa(`
    <svg width="1024" height="1024" xmlns="http://www.w3.org/2000/svg">
      <defs>
        <linearGradient id="logoGrad${i}" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" style="stop-color:rgb(${Math.floor(Math.random() * 255)},${Math.floor(Math.random() * 255)},${Math.floor(Math.random() * 255)});stop-opacity:1" />
          <stop offset="100%" style="stop-color:rgb(${Math.floor(Math.random() * 255)},${Math.floor(Math.random() * 255)},${Math.floor(Math.random() * 255)});stop-opacity:1" />
        </linearGradient>
      </defs>
      <rect width="1024" height="1024" fill="url(#logoGrad${i})" />
      ${Array.from({length: 30}, (_, j) => 
        `<ellipse cx="${Math.random() * 1024}" cy="${Math.random() * 1024}" rx="${Math.random() * 50 + 20}" ry="${Math.random() * 50 + 20}" fill="rgba(${Math.floor(Math.random() * 255)},${Math.floor(Math.random() * 255)},${Math.floor(Math.random() * 255)},0.7)" />`
      ).join('')}
      <text x="512" y="512" font-family="Arial" font-size="80" fill="white" text-anchor="middle">LOGO ${i}</text>
    </svg>
  `),
  alt: `Trading Logo ${i}`,
  width: 1024,
  height: 1024
}))

const HeavyAssetLoader = ({
  enableImageLoading = true,
  enableIconLoading = true,
  enableLogoLoading = true,
  children
}: HeavyAssetLoaderProps) => {
  const [isLoaded, setIsLoaded] = useState(false)
  const [loadingProgress, setLoadingProgress] = useState(0)
  const [preloadedAssets, setPreloadedAssets] = useState<HTMLImageElement[]>([])

  // Force load all assets synchronously on mount
  useEffect(() => {
    const loadAllAssets = () => {
      const start = performance.now()
      const allAssets = []
      
      if (enableImageLoading) allAssets.push(...heavyTradingCharts)
      if (enableIconLoading) allAssets.push(...heavyIcons)
      if (enableLogoLoading) allAssets.push(...heavyLogos)

      console.warn(`Heavy Asset Loader: Starting synchronous load of ${allAssets.length} assets...`)

      const loadedImages: HTMLImageElement[] = []
      let loaded = 0

      // Synchronous loading without Promise.all (deliberately inefficient)
      allAssets.forEach((asset) => {
        const img = document.createElement('img')
        img.crossOrigin = 'anonymous'
        
        // Force synchronous behavior by blocking
        img.onload = () => {
          loaded++
          setLoadingProgress((loaded / allAssets.length) * 100)
          
          if (loaded === allAssets.length) {
            const end = performance.now()
            console.warn(`Heavy Asset Loader: Loaded ${allAssets.length} assets in ${end - start}ms`)
            setPreloadedAssets(loadedImages)
            setIsLoaded(true)
          }
        }
        
        img.onerror = () => {
          loaded++
          console.error(`Failed to load asset: ${asset.id}`)
          setLoadingProgress((loaded / allAssets.length) * 100)
          
          if (loaded === allAssets.length) {
            const end = performance.now()
            console.warn(`Heavy Asset Loader: Finished loading (with errors) in ${end - start}ms`)
            setPreloadedAssets(loadedImages)
            setIsLoaded(true)
          }
        }
        
        // Set src to trigger loading
        img.src = asset.src
        loadedImages.push(img)
        
        // Deliberately block main thread for each asset
        const blockStart = performance.now()
        while (performance.now() - blockStart < 10) {
          // Block for 10ms per asset to simulate heavy processing
        }
      })

      // If no assets to load
      if (allAssets.length === 0) {
        setIsLoaded(true)
      }
    }

    loadAllAssets()
  }, [enableImageLoading, enableIconLoading, enableLogoLoading])

  // Render all preloaded assets (hidden but in DOM for caching)
  const renderPreloadedAssets = () => {
    if (!isLoaded) return null

    return (
      <div style={{ position: 'absolute', top: -9999, left: -9999, opacity: 0 }}>
        {/* Trading Charts - Multiple formats without responsive images */}
        {enableImageLoading && heavyTradingCharts.map((chart) => (
          <div key={chart.id}>
            {/* Regular img tag (no Next.js optimization) */}
            <img
              src={chart.src}
              alt={chart.alt}
              width={chart.width}
              height={chart.height}
              loading="eager"
              decoding="sync"
            />
            {/* Duplicate in different sizes (no responsive) */}
            <img
              src={chart.src}
              alt={`${chart.alt} - Large`}
              width={chart.width / 2}
              height={chart.height / 2}
              loading="eager"
              decoding="sync"
            />
            <img
              src={chart.src}
              alt={`${chart.alt} - Medium`}
              width={chart.width / 4}
              height={chart.height / 4}
              loading="eager"
              decoding="sync"
            />
          </div>
        ))}

        {/* Icons - All loaded synchronously */}
        {enableIconLoading && heavyIcons.map((icon) => (
          <img
            key={icon.id}
            src={icon.src}
            alt={icon.alt}
            width={icon.width}
            height={icon.height}
            loading="eager"
            decoding="sync"
          />
        ))}

        {/* Logos - Uncompressed */}
        {enableLogoLoading && heavyLogos.map((logo) => (
          <img
            key={logo.id}
            src={logo.src}
            alt={logo.alt}
            width={logo.width}
            height={logo.height}
            loading="eager"
            decoding="sync"
          />
        ))}
      </div>
    )
  }

  return (
    <div className="heavy-asset-loader">
      {/* Loading progress indicator */}
      {!isLoaded && (
        <div
          style={{
            position: 'fixed',
            top: '50%',
            left: '50%',
            transform: 'translate(-50%, -50%)',
            zIndex: 9999,
            padding: '30px',
            background: 'rgba(0, 0, 0, 0.9)',
            color: 'white',
            borderRadius: '15px',
            textAlign: 'center',
            minWidth: '300px'
          }}
        >
          <h3>Loading Heavy Assets Synchronously...</h3>
          <div style={{ margin: '20px 0' }}>
            <div
              style={{
                width: '100%',
                height: '20px',
                backgroundColor: 'rgba(255, 255, 255, 0.2)',
                borderRadius: '10px',
                overflow: 'hidden'
              }}
            >
              <div
                style={{
                  width: `${loadingProgress}%`,
                  height: '100%',
                  backgroundColor: '#4ade80',
                  transition: 'width 0.1s ease'
                }}
              />
            </div>
          </div>
          <p>{Math.round(loadingProgress)}% Complete</p>
          <small>No lazy loading • No optimization • No compression</small>
        </div>
      )}

      {/* Render preloaded assets */}
      {renderPreloadedAssets()}

      {/* Render children only after assets are loaded */}
      {isLoaded && children}
    </div>
  )
}

export default HeavyAssetLoader

// Export asset collections for use in other components
export { heavyTradingCharts, heavyIcons, heavyLogos }