# Trading Dashboard Design System

## Overview
A systematic design system based on Kraken Pro's visual style, optimized for trading interfaces.

## Color Usage

### Trading Colors
- **Profit/Gains**: `text-green-500` or `bg-green-500` - #22c55e
- **Loss/Decline**: `text-red-500` or `bg-red-500` - #ef4444  
- **Neutral**: `text-gray-500` - #6b7280
- **Warning**: `text-amber-500` - #f59e0b

### Brand Colors
- **Primary**: `text-violet-500` or `bg-violet-500` - #8b5cf6
- **Secondary**: `text-violet-700` or `bg-violet-700` - #7c3aed

### Background Colors
- **Primary**: `bg-gray-900` - #1a1b23
- **Secondary**: `bg-gray-800` - #252730  
- **Tertiary**: `bg-gray-700` - #2a2d3a

## Component Conventions

### Buttons
```tsx
// Primary action
<Button variant="default">Trade</Button>

// Destructive action  
<Button variant="destructive">Cancel Order</Button>

// Outline style
<Button variant="outline">View Details</Button>

// Trading-specific variants
<Button variant="profit">Buy</Button>
<Button variant="loss">Sell</Button>
```

### Cards
Use standard Tailwind classes:
```tsx
<div className="bg-gray-800 border border-gray-600 rounded-lg p-6">
  <h3 className="text-white text-lg font-semibold">Portfolio</h3>
  <p className="text-gray-400">Your trading positions</p>
</div>
```

### Typography
- **Headings**: `text-white font-semibold`
- **Body**: `text-gray-200`
- **Muted**: `text-gray-400` 
- **Captions**: `text-gray-500 text-sm`

### Status Indicators
```tsx
// Online status
<span className="text-green-500">●</span> Online

// Offline status  
<span className="text-red-500">●</span> Offline

// Processing
<span className="text-violet-500">●</span> Processing
```

## Layout Patterns

### Dashboard Grid
```tsx
<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
  {/* Cards */}
</div>
```

### Sidebar Navigation
```tsx
<nav className="bg-gray-800 border-r border-gray-600">
  <div className="p-4">
    <a className="flex items-center text-gray-200 hover:text-white hover:bg-gray-700 rounded-md p-2">
      Portfolio
    </a>
  </div>
</nav>
```

## Trading-Specific Components

### Price Display
```tsx
const PriceDisplay = ({ value, previousValue }) => {
  const isPositive = value > previousValue;
  return (
    <span className={isPositive ? 'text-green-500' : 'text-red-500'}>
      ${value.toFixed(2)}
    </span>
  );
};
```

### Percentage Change
```tsx
const PercentageChange = ({ change }) => (
  <span className={`${change >= 0 ? 'text-green-500' : 'text-red-500'}`}>
    {change >= 0 ? '+' : ''}{change.toFixed(2)}%
  </span>
);
```

## Best Practices

1. **Consistency**: Always use the defined color tokens
2. **Accessibility**: Ensure sufficient contrast ratios
3. **Performance**: Use Tailwind utilities directly when possible
4. **Trading Context**: Use semantic trading colors (profit/loss)
5. **Dark Theme**: All components assume dark theme by default