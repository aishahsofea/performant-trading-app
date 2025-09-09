'use client'

import React from 'react'
import HeavyAssetLoader, { heavyTradingCharts, heavyIcons, heavyLogos } from '../../components/heavy-asset-loader'

const HeavyAssetsDemo = () => {
  return (
    <HeavyAssetLoader
      enableImageLoading={true}
      enableIconLoading={true}
      enableLogoLoading={true}
    >
      <div className="min-h-screen bg-gradient-to-br from-gray-900 to-black p-8">
        <h1 className="text-4xl font-bold text-white mb-8 text-center">
          Heavy Asset Loading Demo
        </h1>
        
        <div className="max-w-6xl mx-auto space-y-12">
          {/* Trading Charts Section */}
          <section>
            <h2 className="text-2xl font-semibold text-white mb-6">
              Large Trading Charts (Unoptimized)
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {heavyTradingCharts.map((chart) => (
                <div key={chart.id} className="bg-white/10 backdrop-blur-sm rounded-lg p-4">
                  <h3 className="text-lg font-medium text-white mb-3">{chart.alt}</h3>
                  <div className="relative">
                    {/* No Next.js Image optimization */}
                    <img
                      src={chart.src}
                      alt={chart.alt}
                      className="w-full h-40 object-cover rounded border-2 border-white/20"
                      loading="eager"
                      decoding="sync"
                    />
                    <div className="absolute top-2 right-2 bg-red-600 text-white px-2 py-1 rounded text-xs">
                      {chart.format || 'SVG'} {chart.width}x{chart.height}
                    </div>
                  </div>
                  <p className="text-white/60 text-sm mt-2">
                    Loaded synchronously • No lazy loading • No optimization
                  </p>
                </div>
              ))}
            </div>
          </section>

          {/* Icons Section */}
          <section>
            <h2 className="text-2xl font-semibold text-white mb-6">
              Trading Icons (All Loaded Upfront)
            </h2>
            <div className="bg-white/5 rounded-lg p-6">
              <p className="text-white/80 mb-4">
                {heavyIcons.length} icons loaded synchronously at startup
              </p>
              <div className="grid grid-cols-10 gap-3">
                {heavyIcons.slice(0, 20).map((icon) => (
                  <div key={icon.id} className="relative group">
                    <img
                      src={icon.src}
                      alt={icon.alt}
                      className="w-12 h-12 rounded border border-white/20 hover:border-white/60 transition-colors"
                      loading="eager"
                      decoding="sync"
                    />
                    <div className="absolute -top-8 left-1/2 transform -translate-x-1/2 bg-black text-white text-xs px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity">
                      {icon.id}
                    </div>
                  </div>
                ))}
                <div className="flex items-center justify-center w-12 h-12 bg-white/10 rounded border-2 border-dashed border-white/30">
                  <span className="text-white/60 text-xs">+{heavyIcons.length - 20}</span>
                </div>
              </div>
            </div>
          </section>

          {/* Logos Section */}
          <section>
            <h2 className="text-2xl font-semibold text-white mb-6">
              Trading Logos (Uncompressed)
            </h2>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {heavyLogos.slice(0, 8).map((logo) => (
                <div key={logo.id} className="bg-white/10 backdrop-blur-sm rounded-lg p-4">
                  <img
                    src={logo.src}
                    alt={logo.alt}
                    className="w-full h-20 object-cover rounded mb-2"
                    loading="eager"
                    decoding="sync"
                  />
                  <p className="text-white/80 text-sm text-center">{logo.alt}</p>
                  <p className="text-white/50 text-xs text-center">
                    {logo.width}x{logo.height}
                  </p>
                </div>
              ))}
            </div>
            <p className="text-white/60 text-sm mt-4 text-center">
              All {heavyLogos.length} logos loaded in full resolution without compression
            </p>
          </section>

          {/* Performance Impact Info */}
          <section className="bg-red-900/20 border border-red-500/30 rounded-lg p-6">
            <h2 className="text-xl font-semibold text-red-300 mb-4">
              Performance Impact Summary
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-white/80">
              <div>
                <h3 className="font-medium text-red-400 mb-2">Loading Strategy</h3>
                <ul className="space-y-1 text-sm">
                  <li>• Synchronous asset loading (blocks main thread)</li>
                  <li>• No lazy loading or intersection observers</li>
                  <li>• All assets loaded at application startup</li>
                  <li>• 10ms deliberate delay per asset</li>
                </ul>
              </div>
              <div>
                <h3 className="font-medium text-red-400 mb-2">Optimization Violations</h3>
                <ul className="space-y-1 text-sm">
                  <li>• No Next.js Image component optimization</li>
                  <li>• No responsive image variants</li>
                  <li>• No compression or format optimization</li>
                  <li>• Multiple duplicate images in different sizes</li>
                </ul>
              </div>
            </div>
            <p className="text-red-300 mt-4 text-center font-medium">
              Check DevTools Network tab to see the impact!
            </p>
          </section>
        </div>
      </div>
    </HeavyAssetLoader>
  )
}

export default HeavyAssetsDemo