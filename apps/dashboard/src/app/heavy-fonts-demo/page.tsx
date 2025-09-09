'use client'

import React from 'react'
import HeavyFontLoader, { heavyWebFonts, heavyCustomFonts } from '../../components/heavy-font-loader'

const HeavyFontsDemo = () => {
  return (
    <HeavyFontLoader
      enableWebFonts={true}
      enableCustomFonts={true}
      blockRender={true}
    >
      <div className="min-h-screen bg-gradient-to-br from-indigo-900 via-purple-900 to-pink-900 p-8">
        <div className="max-w-6xl mx-auto">
          <h1 className="text-4xl font-bold text-white mb-8 text-center">
            Heavy Font Loading Demo
          </h1>
          
          {/* Font Loading Impact Summary */}
          <div className="bg-red-900/20 border border-red-500/30 rounded-lg p-6 mb-12">
            <h2 className="text-xl font-semibold text-red-300 mb-4">
              Font Loading Performance Impact
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-white/80 text-sm">
              <div>
                <h3 className="font-medium text-red-400 mb-2">Blocking Behavior</h3>
                <ul className="space-y-1">
                  <li>• No font-display: swap (blocks until loaded)</li>
                  <li>• Synchronous loading blocks render</li>
                  <li>• No preloading or optimization</li>
                  <li>• 50ms artificial delay per font family</li>
                </ul>
              </div>
              <div>
                <h3 className="font-medium text-red-400 mb-2">Heavy Loading</h3>
                <ul className="space-y-1">
                  <li>• {heavyWebFonts.length} web font families</li>
                  <li>• All weights loaded (no subsetting)</li>
                  <li>• {heavyCustomFonts.length} custom trading fonts</li>
                  <li>• No lazy loading or code splitting</li>
                </ul>
              </div>
            </div>
          </div>

          {/* Web Font Families Demo */}
          <section className="mb-12">
            <h2 className="text-2xl font-semibold text-white mb-8">
              Web Font Families ({heavyWebFonts.length} families, all weights)
            </h2>
            <div className="grid gap-8">
              {heavyWebFonts.map((font) => (
                <div key={font.family} className="bg-white/10 backdrop-blur-sm rounded-lg p-6">
                  <h3 className="text-lg font-medium text-white mb-4">
                    {font.family} - {font.weights.length} weights, {font.styles.length} styles
                  </h3>
                  
                  <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                    {font.weights.map((weight) => (
                      <div key={weight} className="space-y-2">
                        {font.styles.map((style) => (
                          <div
                            key={`${weight}-${style}`}
                            className="text-white p-3 bg-white/5 rounded border border-white/20"
                            style={{
                              fontFamily: font.family,
                              fontWeight: weight,
                              fontStyle: style
                            }}
                          >
                            <div className="text-xs text-white/60 mb-1">
                              {weight} {style}
                            </div>
                            <div className="text-sm">
                              Trading Data: $42,350.89
                            </div>
                          </div>
                        ))}
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </section>

          {/* Custom Trading Fonts */}
          <section className="mb-12">
            <h2 className="text-2xl font-semibold text-white mb-8">
              Custom Trading Fonts (No Preloading)
            </h2>
            <div className="grid gap-6">
              {heavyCustomFonts.map((font) => (
                <div key={font.family} className="bg-white/10 backdrop-blur-sm rounded-lg p-6">
                  <h3 className="text-lg font-medium text-white mb-4">
                    {font.family} - {font.usage}
                  </h3>
                  
                  <div className="space-y-4">
                    <div
                      className="text-white p-4 bg-black/30 rounded font-mono text-lg"
                      style={{
                        fontFamily: font.family,
                        fontWeight: font.weight,
                        fontStyle: font.style
                      }}
                    >
                      <div className="grid grid-cols-3 gap-4">
                        <div>BTC/USD: $67,234.56 ↑</div>
                        <div>ETH/USD: $3,845.23 ↓</div>
                        <div>Volume: 1,234,567.89</div>
                      </div>
                    </div>
                    
                    <div className="text-white/60 text-sm">
                      Font Weight: {font.weight} | Style: {font.style} | No subsetting
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </section>

          {/* Font Stress Test */}
          <section className="mb-12">
            <h2 className="text-2xl font-semibold text-white mb-8">
              Font Rendering Stress Test
            </h2>
            <div className="bg-white/5 rounded-lg p-6">
              <p className="text-white/80 mb-6">
                All fonts rendered simultaneously to test performance impact:
              </p>
              
              <div className="grid gap-4">
                {heavyWebFonts.slice(0, 4).map((font, index) => (
                  <div
                    key={font.family}
                    className="text-white text-xl p-4 bg-black/20 rounded"
                    style={{
                      fontFamily: font.family,
                      fontWeight: font.weights[Math.floor(font.weights.length / 2)]
                    }}
                  >
                    Trading Portfolio Performance: +12.34% ({font.family})
                  </div>
                ))}
                
                {heavyCustomFonts.map((font) => (
                  <div
                    key={font.family}
                    className="text-green-400 text-lg p-4 bg-black/30 rounded font-mono"
                    style={{
                      fontFamily: font.family,
                      fontWeight: font.weight,
                      fontStyle: font.style
                    }}
                  >
                    AAPL: $175.23 | MSFT: $412.56 | GOOGL: $142.89 ({font.family})
                  </div>
                ))}
              </div>
              
              <div className="mt-6 text-center">
                <p className="text-white/60 text-sm">
                  Total fonts loaded: {heavyWebFonts.length + heavyCustomFonts.length} families
                </p>
                <p className="text-white/60 text-sm">
                  Total font variations: {heavyWebFonts.reduce((acc, font) => acc + (font.weights.length * font.styles.length), 0)} + {heavyCustomFonts.length}
                </p>
              </div>
            </div>
          </section>

          <div className="text-center">
            <p className="text-white/80 text-lg">
              Check DevTools Network tab for font loading impact!
            </p>
            <p className="text-white/60 text-sm mt-2">
              All fonts block render • No optimization • No subsetting
            </p>
          </div>
        </div>
      </div>
    </HeavyFontLoader>
  )
}

export default HeavyFontsDemo