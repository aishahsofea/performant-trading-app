'use client'

/**
 * Heavy Font Loader Component
 * Deliberately loads multiple font families with all weights without optimization
 * Creates font loading bottlenecks for performance testing
 */

import React, { useEffect, useState } from 'react'

export interface HeavyFontLoaderProps {
  enableWebFonts?: boolean
  enableCustomFonts?: boolean
  blockRender?: boolean
  children?: React.ReactNode
}

// Multiple web font families with all weights (no subsetting)
const heavyWebFonts = [
  // Google Fonts - All weights without subsetting
  {
    family: 'Inter',
    weights: [100, 200, 300, 400, 500, 600, 700, 800, 900],
    styles: ['normal', 'italic'],
    url: 'https://fonts.googleapis.com/css2?family=Inter:ital,wght@0,100;0,200;0,300;0,400;0,500;0,600;0,700;0,800;0,900;1,100;1,200;1,300;1,400;1,500;1,600;1,700;1,800;1,900&display=block'
  },
  {
    family: 'Roboto',
    weights: [100, 300, 400, 500, 700, 900],
    styles: ['normal', 'italic'],
    url: 'https://fonts.googleapis.com/css2?family=Roboto:ital,wght@0,100;0,300;0,400;0,500;0,700;0,900;1,100;1,300;1,400;1,500;1,700;1,900&display=block'
  },
  {
    family: 'Open Sans',
    weights: [300, 400, 500, 600, 700, 800],
    styles: ['normal', 'italic'],
    url: 'https://fonts.googleapis.com/css2?family=Open+Sans:ital,wght@0,300;0,400;0,500;0,600;0,700;0,800;1,300;1,400;1,500;1,600;1,700;1,800&display=block'
  },
  {
    family: 'Poppins',
    weights: [100, 200, 300, 400, 500, 600, 700, 800, 900],
    styles: ['normal', 'italic'],
    url: 'https://fonts.googleapis.com/css2?family=Poppins:ital,wght@0,100;0,200;0,300;0,400;0,500;0,600;0,700;0,800;0,900;1,100;1,200;1,300;1,400;1,500;1,600;1,700;1,800;1,900&display=block'
  },
  {
    family: 'Montserrat',
    weights: [100, 200, 300, 400, 500, 600, 700, 800, 900],
    styles: ['normal', 'italic'],
    url: 'https://fonts.googleapis.com/css2?family=Montserrat:ital,wght@0,100;0,200;0,300;0,400;0,500;0,600;0,700;0,800;0,900;1,100;1,200;1,300;1,400;1,500;1,600;1,700;1,800;1,900&display=block'
  },
  {
    family: 'Source Sans Pro',
    weights: [200, 300, 400, 600, 700, 900],
    styles: ['normal', 'italic'],
    url: 'https://fonts.googleapis.com/css2?family=Source+Sans+Pro:ital,wght@0,200;0,300;0,400;0,600;0,700;0,900;1,200;1,300;1,400;1,600;1,700;1,900&display=block'
  },
  {
    family: 'Lato',
    weights: [100, 300, 400, 700, 900],
    styles: ['normal', 'italic'],
    url: 'https://fonts.googleapis.com/css2?family=Lato:ital,wght@0,100;0,300;0,400;0,700;0,900;1,100;1,300;1,400;1,700;1,900&display=block'
  },
  {
    family: 'Nunito',
    weights: [200, 300, 400, 500, 600, 700, 800, 900],
    styles: ['normal', 'italic'],
    url: 'https://fonts.googleapis.com/css2?family=Nunito:ital,wght@0,200;0,300;0,400;0,500;0,600;0,700;0,800;0,900;1,200;1,300;1,400;1,500;1,600;1,700;1,800;1,900&display=block'
  }
]

// Custom font definitions (embedded as base64 for demonstration)
const heavyCustomFonts = [
  {
    family: 'TradingMono',
    weight: 400,
    style: 'normal',
    // Minimal WOFF2 font data (1x1 pixel font for demo)
    woff2: 'data:font/woff2;base64,d09GMgABAAAAAAMcAAoAAAAABYAAAALOAAEAAAAAAAAAAAAAAAAAAAAAAAAAAAAABk4ALAoKCAgHCAsTDAoEIAWEbAcgDIEICxwABCAFhGwHIBtVBsguE3kSDvLf3qY7JhTSHa9Fl8r2lzRu0qBu1qBrKioozKWFpdhQPaDZVVOp1ap0+p2fH5MgCKIgAYJcJZMJBAI=',
    usage: 'Trading data display'
  },
  {
    family: 'MarketDisplay',
    weight: 600,
    style: 'normal',
    woff2: 'data:font/woff2;base64,d09GMgABAAAAAAMcAAoAAAAABYAAAALOAAEAAAAAAAAAAAAAAAAAAAAAAAAAAAAABk4ALAoKCAgHCAsTDAoEIAWEbAcgDIEICxwABCAFhGwHIBtVBsguE3kSDvLf3qY7JhTSHa9Fl8r2lzRu0qBu1qBrKioozKWFpdhQPaDZVVOp1ap0+p2fH5MgCKIgAYJcJZMJBAI=',
    usage: 'Market indicators and charts'
  }
]

const HeavyFontLoader = ({
  enableWebFonts = true,
  enableCustomFonts = true,
  blockRender = true,
  children
}: HeavyFontLoaderProps) => {
  const [fontsLoaded, setFontsLoaded] = useState(false)
  const [loadingProgress, setLoadingProgress] = useState(0)
  const [loadedFonts, setLoadedFonts] = useState<string[]>([])

  useEffect(() => {
    const loadAllFonts = async () => {
      const start = performance.now()
      const fontsToLoad: string[] = []
      
      try {
        // Load web fonts synchronously (blocking render)
        if (enableWebFonts) {
          for (const font of heavyWebFonts) {
            // Create link element for each font family (no preloading)
            const link = document.createElement('link')
            link.rel = 'stylesheet'
            link.href = font.url
            // Deliberately block rendering (no font-display: swap)
            document.head.appendChild(link)
            
            // Simulate blocking behavior
            await new Promise(resolve => {
              link.onload = () => {
                fontsToLoad.push(font.family)
                setLoadedFonts(prev => [...prev, font.family])
                setLoadingProgress((fontsToLoad.length / (heavyWebFonts.length + heavyCustomFonts.length)) * 100)
                
                // Block main thread for 50ms per font
                const blockStart = performance.now()
                while (performance.now() - blockStart < 50) {
                  // Deliberate blocking
                }
                
                resolve(undefined)
              }
              link.onerror = () => {
                console.error(`Failed to load font: ${font.family}`)
                resolve(undefined)
              }
              
              // Fallback timeout
              setTimeout(() => resolve(undefined), 2000)
            })
          }
        }

        // Load custom fonts synchronously
        if (enableCustomFonts) {
          // Inject custom font CSS without preloading
          const customFontCSS = heavyCustomFonts.map(font => `
            @font-face {
              font-family: '${font.family}';
              font-weight: ${font.weight};
              font-style: ${font.style};
              src: url('${font.woff2}') format('woff2');
              /* Deliberately block rendering - no font-display */
            }
          `).join('\n')

          const style = document.createElement('style')
          style.textContent = customFontCSS
          document.head.appendChild(style)

          // Block for custom fonts
          for (const font of heavyCustomFonts) {
            fontsToLoad.push(font.family)
            setLoadedFonts(prev => [...prev, font.family])
            setLoadingProgress((fontsToLoad.length / (heavyWebFonts.length + heavyCustomFonts.length)) * 100)
            
            // Block main thread for 30ms per custom font
            const blockStart = performance.now()
            while (performance.now() - blockStart < 30) {
              // Deliberate blocking
            }
          }
        }

        const end = performance.now()
        console.warn(`Heavy Font Loader: Loaded ${fontsToLoad.length} font families (${loadedFonts.length} total weights/styles) in ${end - start}ms`)
        
        setFontsLoaded(true)
      } catch (error) {
        console.error('Font loading error:', error)
        setFontsLoaded(true)
      }
    }

    loadAllFonts()
  }, [enableWebFonts, enableCustomFonts])

  // Generate CSS with all loaded fonts for testing
  const generateFontCSS = () => {
    if (!fontsLoaded) return ''
    
    return `
      /* Heavy Font Classes - All weights loaded without subsetting */
      ${heavyWebFonts.map(font => 
        font.weights.map(weight => 
          font.styles.map(style => `
            .font-${font.family.toLowerCase().replace(/\s+/g, '-')}-${weight}${style === 'italic' ? '-italic' : ''} {
              font-family: '${font.family}', sans-serif;
              font-weight: ${weight};
              font-style: ${style};
            }
          `).join('\n')
        ).join('\n')
      ).join('\n')}
      
      /* Custom Trading Fonts */
      ${heavyCustomFonts.map(font => `
        .font-${font.family.toLowerCase()} {
          font-family: '${font.family}', monospace;
          font-weight: ${font.weight};
          font-style: ${font.style};
        }
      `).join('\n')}
    `
  }

  return (
    <div className="heavy-font-loader">
      {/* Loading indicator */}
      {!fontsLoaded && blockRender && (
        <div
          style={{
            position: 'fixed',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            backgroundColor: 'rgba(0, 0, 0, 0.95)',
            zIndex: 99999,
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'center',
            alignItems: 'center',
            color: 'white',
            fontFamily: 'system-ui, -apple-system, sans-serif'
          }}
        >
          <h2 style={{ marginBottom: '30px', fontSize: '24px' }}>
            Loading Heavy Font Libraries...
          </h2>
          
          <div style={{ width: '400px', marginBottom: '20px' }}>
            <div
              style={{
                width: '100%',
                height: '30px',
                backgroundColor: 'rgba(255, 255, 255, 0.2)',
                borderRadius: '15px',
                overflow: 'hidden'
              }}
            >
              <div
                style={{
                  width: `${loadingProgress}%`,
                  height: '100%',
                  backgroundColor: '#ef4444',
                  transition: 'width 0.3s ease',
                  borderRadius: '15px'
                }}
              />
            </div>
          </div>
          
          <p style={{ marginBottom: '10px' }}>
            {Math.round(loadingProgress)}% Complete
          </p>
          
          <div style={{ textAlign: 'center', fontSize: '14px', opacity: 0.8 }}>
            <p>Blocking render until all fonts load</p>
            <p>No font-display: swap • No preloading • No subsetting</p>
            <p>Loaded: {loadedFonts.join(', ')}</p>
          </div>
        </div>
      )}

      {/* Inject generated font CSS */}
      {fontsLoaded && (
        <style dangerouslySetInnerHTML={{ __html: generateFontCSS() }} />
      )}

      {/* Render children only after fonts are loaded (if blocking) */}
      {(fontsLoaded || !blockRender) && children}
    </div>
  )
}

export default HeavyFontLoader

// Export font data for use in other components
export { heavyWebFonts, heavyCustomFonts }