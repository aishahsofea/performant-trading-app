import * as React from "react";
import { cn } from "../utils";

interface TradingPosition {
  id: string;
  symbol: string;
  side: "long" | "short";
  size: number;
  entryPrice: number;
  currentPrice: number;
  pnl: number;
  pnlPercent: number;
  volume: number;
  timestamp: number;
}

interface HeavyDataTableProps {
  data?: TradingPosition[];
  withExcessiveElements?: boolean;
  renderComplexity?: "simple" | "complex" | "extreme";
  animationLevel?: "none" | "basic" | "heavy" | "extreme";
  virtualized?: boolean;
}

// Generate mock trading data
const generateMockTradingData = (rows: number = 3000): TradingPosition[] => {
  const symbols = ['AAPL', 'GOOGL', 'MSFT', 'TSLA', 'NVDA', 'AMZN', 'META', 'NFLX', 'AMD', 'INTC'];
  const data: TradingPosition[] = [];
  
  for (let i = 0; i < rows; i++) {
    const symbol = symbols[Math.floor(Math.random() * symbols.length)];
    const side = Math.random() > 0.5 ? 'long' : 'short';
    const size = Math.floor(Math.random() * 1000) + 100;
    const entryPrice = Math.random() * 500 + 50;
    const currentPrice = entryPrice + (Math.random() - 0.5) * 20;
    const pnl = (currentPrice - entryPrice) * size * (side === 'long' ? 1 : -1);
    const pnlPercent = ((currentPrice - entryPrice) / entryPrice) * 100 * (side === 'long' ? 1 : -1);
    const volume = Math.floor(Math.random() * 1000000) + 10000;
    
    data.push({
      id: `pos-${i}`,
      symbol,
      side,
      size,
      entryPrice,
      currentPrice,
      pnl,
      pnlPercent,
      volume,
      timestamp: Date.now() - Math.random() * 86400000,
    });
  }
  
  return data;
};

const HeavyDataTable: React.FC<HeavyDataTableProps> = ({
  data = generateMockTradingData(3000),
  withExcessiveElements = true,
  renderComplexity = "extreme", 
  animationLevel = "heavy",
  virtualized = false,
}) => {
  const [sortColumn, setSortColumn] = React.useState<keyof TradingPosition>('symbol');
  const [sortDirection, setSortDirection] = React.useState<'asc' | 'desc'>('asc');
  
  // Sort data (expensive operation on large datasets)
  const sortedData = React.useMemo(() => {
    return [...data].sort((a, b) => {
      const aVal = a[sortColumn];
      const bVal = b[sortColumn];
      const result = aVal < bVal ? -1 : aVal > bVal ? 1 : 0;
      return sortDirection === 'asc' ? result : -result;
    });
  }, [data, sortColumn, sortDirection]);
  
  // Don't virtualize if disabled (performance bottleneck)
  const displayData = virtualized ? sortedData.slice(0, 100) : sortedData;
  
  const handleSort = (column: keyof TradingPosition) => {
    if (sortColumn === column) {
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
    } else {
      setSortColumn(column);
      setSortDirection('asc');
    }
  };
  
  const renderExcessiveDecorations = (index: number) => {
    if (!withExcessiveElements) return null;
    
    return Array.from({ length: 10 }, (_, i) => (
      <div
        key={`decoration-${index}-${i}`}
        className={`absolute w-1 h-1 bg-blue-400 rounded-full opacity-10 animate-pulse`}
        style={{
          left: `${(i * 10) % 100}%`,
          top: `${(i * 2)}px`,
          animationDelay: `${(index * 10 + i * 50)}ms`,
          animationDuration: `${1000 + (i % 10) * 200}ms`,
        }}
      />
    ));
  };
  
  const renderCell = (position: TradingPosition, key: keyof TradingPosition, index: number) => {
    const value = position[key];
    const cellClassName = cn(
      "px-4 py-3 text-sm relative",
      renderComplexity === "extreme" && "border-r border-gray-700 shadow-inner",
      animationLevel !== "none" && "transition-all duration-300 hover:bg-gray-800",
      animationLevel === "extreme" && "hover:scale-105 hover:shadow-lg transform",
      key === 'pnl' && typeof value === 'number' && value > 0 && "text-green-400 bg-green-900/10",
      key === 'pnl' && typeof value === 'number' && value < 0 && "text-red-400 bg-red-900/10",
      key === 'side' && value === 'long' && "text-green-300",
      key === 'side' && value === 'short' && "text-red-300"
    );
    
    const formatValue = (val: any, k: keyof TradingPosition) => {
      if (k === 'entryPrice' || k === 'currentPrice') return `$${(val as number).toFixed(2)}`;
      if (k === 'pnl') return `$${(val as number).toFixed(2)}`;
      if (k === 'pnlPercent') return `${(val as number).toFixed(2)}%`;
      if (k === 'volume') return (val as number).toLocaleString();
      if (k === 'timestamp') return new Date(val as number).toLocaleTimeString();
      return val;
    };
    
    return (
      <td key={`${position.id}-${key}`} className={cellClassName}>
        {renderComplexity === "extreme" && renderExcessiveDecorations(index)}
        
        {renderComplexity === "extreme" ? (
          <div className="relative z-10">
            <span className="inline-block">
              <span className="font-medium filter drop-shadow-sm">
                {formatValue(value, key)}
              </span>
            </span>
            {key === 'pnl' && withExcessiveElements && (
              <div className="absolute -top-1 -right-1 w-2 h-2">
                <div className={`w-full h-full rounded-full ${
                  (value as number) > 0 ? 'bg-green-400' : 'bg-red-400'
                } animate-ping opacity-40`} />
              </div>
            )}
          </div>
        ) : (
          formatValue(value, key)
        )}
        
        {animationLevel === "extreme" && withExcessiveElements && (
          <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/5 to-transparent translate-x-[-100%] hover:translate-x-[100%] transition-transform duration-1000" />
        )}
      </td>
    );
  };
  
  const columns: { key: keyof TradingPosition; label: string }[] = [
    { key: 'symbol', label: 'Symbol' },
    { key: 'side', label: 'Side' },
    { key: 'size', label: 'Size' },
    { key: 'entryPrice', label: 'Entry Price' },
    { key: 'currentPrice', label: 'Current Price' },
    { key: 'pnl', label: 'P&L' },
    { key: 'pnlPercent', label: 'P&L %' },
    { key: 'volume', label: 'Volume' },
    { key: 'timestamp', label: 'Time' },
  ];
  
  return (
    <div className={cn(
      "relative bg-gray-900 rounded-lg overflow-hidden border border-gray-700",
      animationLevel !== "none" && "transition-all duration-500",
      renderComplexity === "extreme" && "shadow-2xl"
    )}>
      {/* Header */}
      <div className="bg-gray-800 p-4 border-b border-gray-700">
        <div className="flex items-center justify-between">
          <h3 className="text-white font-bold text-lg">Heavy Trading Positions</h3>
          <div className="flex gap-4 text-sm text-gray-300">
            <span>Total: {data.length.toLocaleString()}</span>
            <span>Displaying: {displayData.length.toLocaleString()}</span>
            <span>Virtualized: {virtualized ? 'On' : 'Off'}</span>
          </div>
        </div>
      </div>
      
      {/* Table */}
      <div className="overflow-auto max-h-96">
        <table className="w-full">
          <thead className="bg-gray-800 sticky top-0 z-20">
            <tr>
              {columns.map((column) => (
                <th
                  key={column.key}
                  className={cn(
                    "px-4 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider cursor-pointer",
                    renderComplexity === "extreme" && "border-r border-gray-700 shadow-lg",
                    animationLevel !== "none" && "transition-all duration-200 hover:bg-gray-700",
                    sortColumn === column.key && "bg-gray-700 text-white"
                  )}
                  onClick={() => handleSort(column.key)}
                >
                  <div className="flex items-center gap-2">
                    {column.label}
                    {sortColumn === column.key && (
                      <span className="text-xs">
                        {sortDirection === 'asc' ? '↑' : '↓'}
                      </span>
                    )}
                  </div>
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="bg-gray-900">
            {displayData.map((position, index) => (
              <tr
                key={position.id}
                className={cn(
                  "relative border-b border-gray-700",
                  animationLevel !== "none" && "transition-all duration-200 hover:bg-gray-800",
                  position.pnl > 0 && "bg-green-900/5",
                  position.pnl < 0 && "bg-red-900/5",
                )}
              >
                {columns.map((column) => renderCell(position, column.key, index))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export { HeavyDataTable };
export type { HeavyDataTableProps, TradingPosition };