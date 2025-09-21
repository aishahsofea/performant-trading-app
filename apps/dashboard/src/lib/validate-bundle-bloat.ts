// Validation script to ensure bundle bloat is working correctly
import { UNUSED_TRADING_LIBRARIES, UNUSED_MARKET_DATA, UNUSED_TRADING_CONFIGS } from './unused-trading-calculations';

export function validateBundleBloat() {
  const validationResults = {
    librariesLoaded: false,
    dataStructuresPresent: false,
    configObjectsPresent: false,
    bundleSize: 'Unknown',
    timestamp: new Date().toISOString()
  };

  try {
    // Validate that unused trading libraries are loaded
    const libraryCount = Object.keys(UNUSED_TRADING_LIBRARIES).length;
    validationResults.librariesLoaded = libraryCount >= 8; // Should have 8 trading library classes

    // Validate that large data structures are present
    const stockSymbolsCount = UNUSED_MARKET_DATA.STOCK_SYMBOLS.length;
    const forexPairsCount = UNUSED_MARKET_DATA.FOREX_PAIRS.length;
    const sectorDataCount = UNUSED_MARKET_DATA.SECTOR_DATA.length;
    validationResults.dataStructuresPresent = 
      stockSymbolsCount >= 1000 && 
      forexPairsCount >= 20 && 
      sectorDataCount >= 100;

    // Validate that config objects are present
    const configCount = Object.keys(UNUSED_TRADING_CONFIGS).length;
    validationResults.configObjectsPresent = configCount >= 3;

    // Estimate bundle impact
    if (validationResults.librariesLoaded && 
        validationResults.dataStructuresPresent && 
        validationResults.configObjectsPresent) {
      validationResults.bundleSize = 'Heavy (10+ MB estimated)';
    } else {
      validationResults.bundleSize = 'Light (optimization working)';
    }

    console.log('Bundle Bloat Validation Results:', validationResults);
    
    return validationResults;
  } catch (error) {
    console.error('Bundle bloat validation failed:', error);
    return {
      ...validationResults,
      error: error instanceof Error ? error.message : 'Unknown error'
    };
  }
}

export function getBundleAnalytics() {
  return {
    tradingLibraries: Object.keys(UNUSED_TRADING_LIBRARIES),
    marketDataSizes: {
      stockSymbols: UNUSED_MARKET_DATA.STOCK_SYMBOLS.length,
      forexPairs: UNUSED_MARKET_DATA.FOREX_PAIRS.length,
      cryptoSymbols: UNUSED_MARKET_DATA.CRYPTO_SYMBOLS.length,
      economicIndicators: UNUSED_MARKET_DATA.ECONOMIC_INDICATORS.length,
      sectorData: UNUSED_MARKET_DATA.SECTOR_DATA.length,
      correlationMatrix: UNUSED_MARKET_DATA.HISTORICAL_CORRELATIONS.length
    },
    configObjects: Object.keys(UNUSED_TRADING_CONFIGS),
    estimatedImpact: {
      bundleIncrease: '10+ MB',
      memoryUsage: 'High',
      parseTime: 'Increased',
      networkTransfer: 'Significantly Slower'
    }
  };
}