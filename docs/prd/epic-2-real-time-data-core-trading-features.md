# Epic 2: Real-Time Data & Core Trading Features

**Epic Goal**: Build core trading functionality with real-time stock data, portfolio tracking, and basic charting capabilities. Deliberately implement data fetching and state management patterns that create performance bottlenecks, providing clear optimization targets for rendering performance and network efficiency learning.

**Integration Requirements**: Establish real-time data pipelines and state management patterns that will support advanced features while creating measurable performance challenges.

## Story 2.1: Stock Data API Integration and Inefficient Data Fetching

As a trader,
I want real-time stock price data for my watchlist,
so that I can monitor market movements and make informed trading decisions.

### Acceptance Criteria
1. Alpha Vantage API integration for real-time stock quotes (50+ symbols)
2. Inefficient polling strategy fetching all data every 2 seconds regardless of visibility
3. No request batching - individual API calls for each stock symbol
4. Synchronous data fetching blocking component renders
5. No caching strategy - fresh API calls on every component mount
6. Raw API responses stored without normalization causing duplicate data
7. Error handling without retry logic or fallback states
8. API rate limiting not implemented, allowing quota exhaustion

## Story 2.2: Interactive Stock Charts with Performance Bottlenecks

As a trader,
I want interactive candlestick charts with multiple timeframes,
so that I can analyze price movements and identify trading opportunities.

### Acceptance Criteria
1. Chart.js integration with heavyweight charting library (2MB+ bundle impact)
2. Multiple chart instances (5+ charts) rendering simultaneously without virtualization
3. Full dataset re-rendering on every data update without incremental updates
4. No chart data memoization - recalculations on every render
5. Chart animations enabled for all data points causing frame rate issues
6. Timeframe switching triggers complete chart re-initialization
7. Chart tooltips and interactions creating layout thrashing
8. No chart lazy loading - all charts render immediately on page load

## Story 2.3: Portfolio Tracking with Inefficient Calculations

As a trader,
I want real-time portfolio tracking with P&L calculations,
so that I can monitor my investment performance across multiple positions.

### Acceptance Criteria
1. Portfolio state management with excessive re-renders on price updates
2. P&L calculations performed on every render without memoization
3. Complex nested state updates causing cascading re-renders
4. No state normalization - denormalized data causing update inefficiencies
5. Real-time calculations for 100+ portfolio positions without optimization
6. Portfolio sorting and filtering triggers full list re-rendering
7. Position updates cause entire portfolio table re-render
8. No virtual scrolling for large portfolio lists

## Story 2.4: Market Data Tables with Large Dataset Rendering

As a trader,
I want sortable market data tables showing 1000+ stocks with real-time updates,
so that I can screen stocks and identify trading opportunities.

### Acceptance Criteria
1. Large data table rendering 1000+ rows without virtualization
2. Real-time price updates causing full table re-renders
3. Sorting and filtering operations performed on client-side without optimization
4. No pagination - all data rendered simultaneously
5. Table cells with complex formatting and calculations on every render
6. Search functionality triggering full dataset filtering without debouncing
7. Column resizing and reordering causing layout recalculations
8. Export functionality loading all data into memory simultaneously
