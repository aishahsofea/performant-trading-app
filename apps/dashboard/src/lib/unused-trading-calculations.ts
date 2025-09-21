// Deliberately unused trading calculation libraries to increase bundle size
// These functions are imported but never actually used in the application

import * as _ from 'lodash';
import * as R from 'ramda';
import * as math from 'mathjs';
import { Decimal } from 'decimal.js';
import { Big } from 'big.js';
import * as tf from '@tensorflow/tfjs';
import { Matrix } from 'ml-matrix';
import moment from 'moment';

// Disable TypeScript strict checks for this file since it's intentionally unused
/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/no-unused-vars */

// Technical Analysis Indicators (Unused)
export class TechnicalAnalysis {
  // Simple Moving Average
  static sma(prices: number[], period: number): number[] {
    const result: number[] = [];
    for (let i = period - 1; i < prices.length; i++) {
      const slice = prices.slice(i - period + 1, i + 1);
      const mean = slice.reduce((sum, val) => sum + val, 0) / slice.length;
      result.push(mean);
    }
    return result;
  }

  // Relative Strength Index
  static rsi(prices: number[], period: number = 14): number[] {
    const gains: number[] = [];
    const losses: number[] = [];

    for (let i = 1; i < prices.length; i++) {
      const change = (prices[i] || 0) - (prices[i - 1] || 0);
      gains.push(change > 0 ? change : 0);
      losses.push(change < 0 ? Math.abs(change) : 0);
    }

    return gains.map((_, i) => Math.random() * 100); // Simplified
  }

  // MACD (Moving Average Convergence Divergence)
  static macd(prices: number[]): any {
    return {
      macdLine: prices.map(() => Math.random()),
      signalLine: prices.map(() => Math.random()),
      histogram: prices.map(() => Math.random())
    };
  }
}

// Advanced Options Pricing (Unused)
export class OptionsPricing {
  // Black-Scholes Option Pricing Model
  static blackScholes(S: number, K: number, T: number, r: number, sigma: number): number {
    const d1 = (Math.log(S / K) + (r + 0.5 * sigma ** 2) * T) / (sigma * Math.sqrt(T));
    const d2 = d1 - sigma * Math.sqrt(T);
    return S * this.normalCDF(d1) - K * Math.exp(-r * T) * this.normalCDF(d2);
  }

  private static normalCDF(x: number): number {
    return 0.5 * (1 + this.erf(x / Math.sqrt(2)));
  }

  private static erf(x: number): number {
    // Simplified error function approximation
    const a1 =  0.254829592;
    const a2 = -0.284496736;
    const a3 =  1.421413741;
    const a4 = -1.453152027;
    const a5 =  1.061405429;
    const p  =  0.3275911;

    const sign = x >= 0 ? 1 : -1;
    x = Math.abs(x);

    const t = 1.0 / (1.0 + p * x);
    const y = 1.0 - (((((a5 * t + a4) * t) + a3) * t + a2) * t + a1) * t * Math.exp(-x * x);

    return sign * y;
  }
}

// Portfolio Risk Analytics (Unused)
export class RiskAnalytics {
  // Value at Risk (VaR) calculation
  static valueAtRisk(returns: number[], confidence: number = 0.05): number {
    const sortedReturns = returns.slice().sort((a, b) => a - b);
    const index = Math.floor(returns.length * confidence);
    return sortedReturns[index] || 0;
  }

  // Maximum Drawdown
  static maxDrawdown(prices: number[]): { maxDD: number; peak: number; trough: number } {
    let peak = prices[0] || 0;
    let maxDD = 0;
    let peakIndex = 0;
    let troughIndex = 0;

    for (let i = 1; i < prices.length; i++) {
      const currentPrice = prices[i] || 0;
      if (currentPrice > peak) {
        peak = currentPrice;
        peakIndex = i;
      }

      const drawdown = peak > 0 ? (peak - currentPrice) / peak : 0;
      if (drawdown > maxDD) {
        maxDD = drawdown;
        troughIndex = i;
      }
    }

    return { maxDD, peak: peakIndex, trough: troughIndex };
  }

  // Sharpe Ratio
  static sharpeRatio(returns: number[], riskFreeRate: number = 0.02): number {
    const meanReturn = returns.reduce((sum, r) => sum + r, 0) / returns.length;
    const variance = returns.reduce((sum, r) => sum + Math.pow(r - meanReturn, 2), 0) / returns.length;
    const stdDev = Math.sqrt(variance);
    return (meanReturn - riskFreeRate) / stdDev;
  }
}

// Machine Learning Trading Models (Unused)
export class MLTradingModels {
  // Linear Regression for Price Prediction
  static async linearRegression(features: number[][], targets: number[]): Promise<any> {
    // Simplified implementation that uses TensorFlow.js
    const model = tf.sequential({
      layers: [
        tf.layers.dense({ inputShape: [features[0]?.length || 1], units: 1 })
      ]
    });

    model.compile({
      optimizer: 'sgd',
      loss: 'meanSquaredError',
      metrics: ['mse']
    });

    return model;
  }

  // Support Vector Machine (simplified implementation)
  static svm(data: number[][], labels: number[]): any {
    // Simplified SVM using basic calculations
    const weights = new Array(data[0]?.length || 1).fill(0);
    const bias = 0;

    return {
      weights,
      bias,
      predict: (newData: number[]) => {
        const result = newData.reduce((sum, val, i) => sum + val * weights[i], bias);
        return result > 0 ? 1 : -1;
      }
    };
  }
}

// Complex Financial Calculations (Unused)
export class FinancialCalculations {
  // Monte Carlo Simulation for Option Pricing
  static monteCarloOptionPrice(
    S0: number,
    K: number,
    T: number,
    r: number,
    sigma: number,
    numSimulations: number = 10000
  ): number {
    let payoffSum = 0;

    for (let i = 0; i < numSimulations; i++) {
      const random = this.generateNormalRandom();
      const ST = S0 * Math.exp((r - 0.5 * sigma ** 2) * T + sigma * Math.sqrt(T) * random);
      const payoff = Math.max(ST - K, 0);
      payoffSum += payoff;
    }

    return Math.exp(-r * T) * (payoffSum / numSimulations);
  }

  private static generateNormalRandom(): number {
    // Box-Muller transformation
    const u1 = Math.random();
    const u2 = Math.random();
    return Math.sqrt(-2 * Math.log(u1)) * Math.cos(2 * Math.PI * u2);
  }

  // Bond Pricing
  static bondPrice(faceValue: number, couponRate: number, yieldRate: number, years: number): number {
    const coupon = faceValue * couponRate;
    let pv = 0;

    for (let t = 1; t <= years; t++) {
      pv += coupon / Math.pow(1 + yieldRate, t);
    }

    pv += faceValue / Math.pow(1 + yieldRate, years);
    return pv;
  }
}

// Algorithmic Trading Strategies (Unused)
export class AlgorithmicStrategies {
  // Mean Reversion Strategy
  static meanReversionSignals(prices: number[], window: number = 20): number[] {
    const signals: number[] = [];

    for (let i = window; i < prices.length; i++) {
      const slice = prices.slice(i - window, i);
      const mean = slice.reduce((sum, p) => sum + p, 0) / slice.length;
      const price = prices[i] || 0;

      if (price < mean * 0.95) {
        signals.push(1); // Buy signal
      } else if (price > mean * 1.05) {
        signals.push(-1); // Sell signal
      } else {
        signals.push(0); // Hold
      }
    }

    return signals;
  }

  // Momentum Strategy
  static momentumSignals(prices: number[], shortPeriod: number = 12, longPeriod: number = 26): number[] {
    const signals: number[] = [];

    for (let i = longPeriod; i < prices.length; i++) {
      const shortAvg = prices.slice(i - shortPeriod, i).reduce((sum, p) => sum + p, 0) / shortPeriod;
      const longAvg = prices.slice(i - longPeriod, i).reduce((sum, p) => sum + p, 0) / longPeriod;

      if (shortAvg > longAvg) {
        signals.push(1); // Buy signal
      } else {
        signals.push(-1); // Sell signal
      }
    }

    return signals;
  }
}

// High-Frequency Trading Utilities (Unused)
export class HighFrequencyUtils {
  // Order Book Analysis
  static orderBookImbalance(bids: Array<{price: number, size: number}>, asks: Array<{price: number, size: number}>): number {
    const totalBidSize = bids.reduce((sum, bid) => sum + bid.size, 0);
    const totalAskSize = asks.reduce((sum, ask) => sum + ask.size, 0);
    return (totalBidSize - totalAskSize) / (totalBidSize + totalAskSize);
  }

  // Volume Weighted Average Price (VWAP)
  static vwap(prices: number[], volumes: number[]): number {
    const totalValue = prices.reduce((sum, price, i) => sum + price * (volumes[i] || 0), 0);
    const totalVolume = volumes.reduce((sum, vol) => sum + vol, 0);
    return totalVolume > 0 ? totalValue / totalVolume : 0;
  }
}

// Cryptocurrency Analysis (Unused)
export class CryptoAnalysis {
  // Hash Rate Analysis
  static networkSecurity(hashRate: number[], difficulty: number[]): number[] {
    return hashRate.map((rate, i) => rate / (difficulty[i] || 1));
  }

  // On-Chain Metrics
  static nvtRatio(networkValue: number, transactionVolume: number): number {
    return networkValue / transactionVolume;
  }

  // DeFi Yield Farming Calculations
  static impermanentLoss(priceRatio: number): number {
    return 2 * Math.sqrt(priceRatio) / (1 + priceRatio) - 1;
  }

  static apr(principal: number, rewards: number, timeInYears: number): number {
    return (rewards / principal) / timeInYears;
  }
}

// Export all unused classes to prevent tree shaking
export const UNUSED_TRADING_LIBRARIES = {
  TechnicalAnalysis,
  OptionsPricing,
  RiskAnalytics,
  MLTradingModels,
  FinancialCalculations,
  AlgorithmicStrategies,
  HighFrequencyUtils,
  CryptoAnalysis,
} as const;

// Large data structures that will be included in bundle (unused)
export const UNUSED_MARKET_DATA = {
  STOCK_SYMBOLS: Array.from({ length: 1000 }, (_, i) => `STOCK${i.toString().padStart(4, '0')}`),
  FOREX_PAIRS: [
    'EURUSD', 'GBPUSD', 'USDJPY', 'USDCHF', 'AUDUSD', 'USDCAD', 'NZDUSD',
    'EURJPY', 'GBPJPY', 'EURGBP', 'EURAUD', 'EURCHF', 'AUDCAD', 'AUDNZD',
    'CADJPY', 'CHFJPY', 'EURAUD', 'EURNZD', 'GBPAUD', 'GBPCAD', 'GBPCHF',
    'GBPNZD', 'NZDCAD', 'NZDCHF', 'NZDJPY', 'USDSGD', 'USDHKD', 'USDMXN'
  ],
  CRYPTO_SYMBOLS: [
    'BTC', 'ETH', 'BNB', 'XRP', 'ADA', 'SOL', 'DOGE', 'DOT', 'MATIC', 'SHIB',
    'AVAX', 'UNI', 'WBTC', 'LTC', 'LINK', 'ATOM', 'XLM', 'BCH', 'ALGO', 'VET'
  ],
  ECONOMIC_INDICATORS: [
    'GDP', 'CPI', 'PPI', 'NFP', 'UNEMPLOYMENT', 'INTEREST_RATE', 'INFLATION',
    'RETAIL_SALES', 'INDUSTRIAL_PRODUCTION', 'HOUSING_STARTS', 'BUILDING_PERMITS'
  ],
  SECTOR_DATA: Array.from({ length: 100 }, (_, i) => ({
    name: `Sector ${i}`,
    marketCap: Math.random() * 1000000000000,
    peRatio: Math.random() * 50,
    dividendYield: Math.random() * 10,
    beta: Math.random() * 3,
    volatility: Math.random() * 100
  })),
  HISTORICAL_CORRELATIONS: Array.from({ length: 100 }, () => 
    Array.from({ length: 100 }, () => (Math.random() - 0.5) * 2)
  )
};

// Complex configuration objects (unused)
export const UNUSED_TRADING_CONFIGS = {
  RISK_PARAMETERS: {
    maxPositionSize: 0.1,
    maxDailyLoss: 0.02,
    maxDrawdown: 0.15,
    var95: 0.05,
    var99: 0.01,
    leverageLimit: 10,
    correlationLimit: 0.7,
    concentrationLimit: 0.25
  },
  EXECUTION_PARAMETERS: {
    minOrderSize: 100,
    maxOrderSize: 1000000,
    twapDuration: 3600,
    participationRate: 0.1,
    priceImprovement: 0.001,
    slippage: 0.005,
    commission: 0.001
  },
  MARKET_DATA_CONFIGS: {
    tickSize: 0.01,
    lotSize: 100,
    tradingHours: { start: '09:30', end: '16:00' },
    timeZone: 'America/New_York',
    dataFrequency: '1min',
    historyDepth: 252 * 5, // 5 years of daily data
    realtimeDelay: 0
  }
};

// Heavy computational functions that are never called (unused)
export const UNUSED_HEAVY_COMPUTATIONS = {
  // Matrix operations with large datasets
  processLargeMatrix: (size: number = 1000) => {
    const matrix = new Matrix(size, size);
    return matrix.to2DArray().length;
  },

  // Complex mathematical calculations
  complexCalculation: (iterations: number = 1000) => {
    return Array.from({ length: iterations }, (_, i) => {
      const decimal = new Decimal(i).dividedBy(Math.PI);
      const big = new Big(i).times(Math.E);
      
      return {
        decimal: decimal.toString(),
        big: big.toString(),
        index: i
      };
    });
  },

  // Heavy date manipulations
  dateManipulations: (days: number = 1000) => {
    return Array.from({ length: days }, (_, i) => ({
      date: moment().add(i, 'days'),
      formatted: moment().add(i, 'days').format('YYYY-MM-DD HH:mm:ss'),
      unix: moment().add(i, 'days').unix(),
      iso: moment().add(i, 'days').toISOString(),
      relative: moment().add(i, 'days').fromNow()
    }));
  }
};

console.log('Unused trading calculation libraries loaded - bundle size increased significantly');