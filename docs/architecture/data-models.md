# Data Models

## Core Trading Data Models

### Stock
**Purpose:** Fundamental stock data and real-time market information for all trading operations

**Key Attributes:**
- symbol: string - Stock ticker symbol (e.g., "AAPL", "GOOGL")
- name: string - Company name for display and search
- currentPrice: number - Real-time stock price with microsecond precision
- priceChange: number - Daily price change for P&L calculations
- volume: number - Trading volume for liquidity analysis
- marketCap: number - Market capitalization for screening and analysis

**Relationships:**
- **With Portfolio**: One-to-many relationship for position tracking
- **With MarketData**: One-to-many for historical pricing and time-series analysis
- **With SocialPost**: Many-to-many for stock mentions and sentiment tracking

```typescript
interface Stock {
  id: string;
  symbol: string;
  name: string;
  currentPrice: number;
  priceChange: number;
  priceChangePercent: number;
  volume: number;
  marketCap: number;
  sector: string;
  lastUpdated: Date;
  metadata: {
    exchange: string;
    currency: string;
    timezone: string;
  };
}
```
