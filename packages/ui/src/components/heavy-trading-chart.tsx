import * as React from "react";
import { cn } from "../utils";

interface TradingDataPoint {
  timestamp: number;
  price: number;
  volume: number;
  high: number;
  low: number;
  open: number;
  close: number;
}

interface HeavyTradingChartProps {
  data?: TradingDataPoint[];
  width?: number;
  height?: number;
  withExcessiveElements?: boolean;
  animationLevel?: "none" | "basic" | "heavy" | "extreme";
  renderComplexity?: "simple" | "complex" | "extreme";
}

// Generate mock trading data with excessive detail
const generateMockTradingData = (points: number = 1000): TradingDataPoint[] => {
  const data: TradingDataPoint[] = [];
  let basePrice = 100;
  
  for (let i = 0; i < points; i++) {
    const timestamp = Date.now() - (points - i) * 60000;
    const volatility = Math.random() * 5 - 2.5;
    basePrice += volatility;
    
    const high = basePrice + Math.random() * 2;
    const low = basePrice - Math.random() * 2;
    const open = basePrice - volatility * 0.5;
    const close = basePrice + volatility * 0.5;
    const volume = Math.floor(Math.random() * 10000) + 1000;
    
    data.push({
      timestamp,
      price: basePrice,
      volume,
      high,
      low,
      open,
      close,
    });
  }
  
  return data;
};

const HeavyTradingChart: React.FC<HeavyTradingChartProps> = ({
  data = generateMockTradingData(2000), // Excessive data points by default
  width = 800,
  height = 400,
  withExcessiveElements = true,
  animationLevel = "heavy",
  renderComplexity = "extreme",
}) => {
  // Calculate chart dimensions and scaling
  const maxPrice = Math.max(...data.map(d => Math.max(d.high, d.price)));
  const minPrice = Math.min(...data.map(d => Math.min(d.low, d.price)));
  const priceRange = maxPrice - minPrice;
  
  // Generate excessive number of visual elements
  const renderExcessiveDecorations = () => {
    if (!withExcessiveElements) return null;
    
    const decorations: React.ReactElement[] = [];
    for (let i = 0; i < 200; i++) {
      decorations.push(
        <div
          key={`decoration-${i}`}
          className={`absolute w-px h-px bg-blue-400 opacity-20 animate-pulse`}
          style={{
            left: `${(i * 4) % 100}%`,
            top: `${(i * 7) % 100}%`,
            animationDelay: `${i * 10}ms`,
            animationDuration: `${1000 + (i % 10) * 100}ms`,
          }}
        />
      );
    }
    return decorations;
  };
  
  // Render individual price points with excessive detail
  const renderPricePoints = () => {
    return data.map((point, index) => {
      const x = (index / data.length) * width;
      const y = ((maxPrice - point.price) / priceRange) * height;
      
      return (
        <g key={`point-${index}`}>
          {/* Main price point */}
          <circle
            cx={x}
            cy={y}
            r={renderComplexity === "extreme" ? 2 : 1}
            fill="#3b82f6"
            className={animationLevel !== "none" ? "animate-pulse" : ""}
            style={{ animationDelay: `${index * 2}ms` }}
          />
          
          {/* High-Low lines for each point */}
          {renderComplexity === "extreme" && (
            <line
              x1={x}
              y1={((maxPrice - point.high) / priceRange) * height}
              x2={x}
              y2={((maxPrice - point.low) / priceRange) * height}
              stroke="#ef4444"
              strokeWidth={0.5}
              className={animationLevel === "extreme" ? "animate-pulse" : ""}
              style={{ animationDelay: `${index * 3}ms` }}
            />
          )}
          
          {/* Volume bars (excessive detail) */}
          {renderComplexity === "extreme" && (
            <rect
              x={x - 0.5}
              y={height - (point.volume / 20000) * 50}
              width={1}
              height={(point.volume / 20000) * 50}
              fill="#10b981"
              opacity={0.3}
              className={animationLevel === "extreme" ? "animate-bounce" : ""}
              style={{ animationDelay: `${index * 1}ms` }}
            />
          )}
          
          {/* Excessive decorative elements per point */}
          {withExcessiveElements && index % 10 === 0 && (
            <>
              <circle
                cx={x}
                cy={y}
                r={5}
                fill="none"
                stroke="#8b5cf6"
                strokeWidth={0.5}
                opacity={0.2}
                className={animationLevel !== "none" ? "animate-ping" : ""}
                style={{ animationDelay: `${index * 5}ms` }}
              />
              <circle
                cx={x}
                cy={y}
                r={8}
                fill="none"
                stroke="#ec4899"
                strokeWidth={0.3}
                opacity={0.1}
                className={animationLevel === "extreme" ? "animate-pulse" : ""}
                style={{ animationDelay: `${index * 7}ms` }}
              />
            </>
          )}
        </g>
      );
    });
  };
  
  // Render grid lines with excessive detail
  const renderGridLines = () => {
    const gridLines: React.ReactElement[] = [];
    const gridCount = renderComplexity === "extreme" ? 50 : 10;
    
    // Horizontal grid lines
    for (let i = 0; i <= gridCount; i++) {
      const y = (i / gridCount) * height;
      gridLines.push(
        <line
          key={`h-grid-${i}`}
          x1={0}
          y1={y}
          x2={width}
          y2={y}
          stroke="#374151"
          strokeWidth={0.5}
          opacity={0.3}
          className={animationLevel === "extreme" ? "animate-pulse" : ""}
          style={{ animationDelay: `${i * 50}ms` }}
        />
      );
    }
    
    // Vertical grid lines
    for (let i = 0; i <= gridCount; i++) {
      const x = (i / gridCount) * width;
      gridLines.push(
        <line
          key={`v-grid-${i}`}
          x1={x}
          y1={0}
          x2={x}
          y2={height}
          stroke="#374151"
          strokeWidth={0.5}
          opacity={0.3}
          className={animationLevel === "extreme" ? "animate-pulse" : ""}
          style={{ animationDelay: `${i * 30}ms` }}
        />
      );
    }
    
    return gridLines;
  };
  
  // Create price line path
  const createPriceLine = () => {
    const pathData = data.map((point, index) => {
      const x = (index / data.length) * width;
      const y = ((maxPrice - point.price) / priceRange) * height;
      return `${index === 0 ? 'M' : 'L'} ${x} ${y}`;
    }).join(' ');
    
    return pathData;
  };
  
  return (
    <div className={cn(
      "relative bg-gray-900 rounded-lg overflow-hidden",
      "border border-gray-700 shadow-2xl",
      animationLevel !== "none" && "transition-all duration-500"
    )}>
      {/* Excessive background decorations */}
      {renderExcessiveDecorations()}
      
      {/* Chart title and excessive header elements */}
      <div className="absolute top-0 left-0 right-0 bg-gray-800 p-4 z-10">
        <div className="flex items-center justify-between">
          <h3 className="text-white font-bold text-lg">Heavy Trading Chart</h3>
          <div className="flex gap-2">
            {Array.from({ length: 10 }, (_, i) => (
              <div
                key={`status-${i}`}
                className={`w-2 h-2 rounded-full bg-green-400 animate-pulse`}
                style={{ animationDelay: `${i * 100}ms` }}
              />
            ))}
          </div>
        </div>
        
        {/* Excessive stats display */}
        <div className="flex gap-4 mt-2 text-xs text-gray-300">
          <span>Points: {data.length}</span>
          <span>Max: ${maxPrice.toFixed(2)}</span>
          <span>Min: ${minPrice.toFixed(2)}</span>
          <span>Range: ${priceRange.toFixed(2)}</span>
          {withExcessiveElements && (
            <>
              <span>Avg Volume: {(data.reduce((sum, d) => sum + d.volume, 0) / data.length).toFixed(0)}</span>
              <span>Complexity: {renderComplexity}</span>
              <span>Animation: {animationLevel}</span>
            </>
          )}
        </div>
      </div>
      
      {/* Main chart area */}
      <div className="pt-20 p-4">
        <svg width={width} height={height} className="bg-gray-950 rounded">
          {/* Gradient definitions for excessive visual effects */}
          <defs>
            <linearGradient id="priceGradient" x1="0%" y1="0%" x2="0%" y2="100%">
              <stop offset="0%" stopColor="#3b82f6" stopOpacity={0.8} />
              <stop offset="50%" stopColor="#8b5cf6" stopOpacity={0.4} />
              <stop offset="100%" stopColor="#ec4899" stopOpacity={0.2} />
            </linearGradient>
            <linearGradient id="volumeGradient" x1="0%" y1="0%" x2="0%" y2="100%">
              <stop offset="0%" stopColor="#10b981" stopOpacity={0.6} />
              <stop offset="100%" stopColor="#10b981" stopOpacity={0.1} />
            </linearGradient>
          </defs>
          
          {/* Grid lines */}
          {renderGridLines()}
          
          {/* Price area fill */}
          <path
            d={`${createPriceLine()} L ${width} ${height} L 0 ${height} Z`}
            fill="url(#priceGradient)"
            className={animationLevel === "extreme" ? "animate-pulse" : ""}
          />
          
          {/* Price line */}
          <path
            d={createPriceLine()}
            fill="none"
            stroke="#3b82f6"
            strokeWidth={2}
            className={animationLevel !== "none" ? "animate-pulse" : ""}
          />
          
          {/* Individual price points and excessive details */}
          {renderPricePoints()}
        </svg>
      </div>
      
      {/* Control panel with excessive options */}
      {withExcessiveElements && (
        <div className="absolute bottom-0 left-0 right-0 bg-gray-800 p-2 z-10">
          <div className="flex gap-2 justify-center">
            {['1m', '5m', '15m', '1h', '4h', '1d', '1w', '1M'].map((timeframe) => (
              <button
                key={timeframe}
                className={`px-2 py-1 text-xs bg-gray-700 text-white rounded hover:bg-gray-600 transition-all duration-200 ${animationLevel !== "none" ? "animate-pulse" : ""}`}
                style={{ animationDelay: `${Math.random() * 500}ms` }}
              >
                {timeframe}
              </button>
            ))}
          </div>
        </div>
      )}
      
      {/* Floating animation overlay */}
      {animationLevel === "extreme" && (
        <div className="absolute inset-0 pointer-events-none">
          {Array.from({ length: 20 }, (_, i) => (
            <div
              key={`float-${i}`}
              className={`absolute w-1 h-1 bg-blue-400 rounded-full animate-bounce opacity-30`}
              style={{
                left: `${Math.random() * 100}%`,
                top: `${Math.random() * 100}%`,
                animationDelay: `${i * 200}ms`,
                animationDuration: `${1000 + Math.random() * 2000}ms`,
              }}
            />
          ))}
        </div>
      )}
    </div>
  );
};

export { HeavyTradingChart };
export type { HeavyTradingChartProps, TradingDataPoint };