'use client';

// Deliberately importing entire libraries instead of selective imports to increase bundle size
import * as d3 from 'd3'; // Import entire D3 library (huge)
import * as three from 'three'; // Import entire Three.js library (large) - unused but needed for bundle bloat
import * as _ from 'lodash'; // Import entire Lodash library
import * as R from 'ramda'; // Import entire Ramda library
import * as rxjs from 'rxjs'; // Import entire RxJS library
import { map, filter, scan, debounceTime, distinctUntilChanged, take } from 'rxjs/operators'; // RxJS operators
import * as math from 'mathjs'; // Import entire Math.js library
import * as tf from '@tensorflow/tfjs'; // Import entire TensorFlow.js library (massive)
import moment from 'moment'; // Import Moment.js library (deprecated but heavy)
import * as $ from 'jquery'; // Import entire jQuery library (outdated but heavy)
import { Chart } from 'chart.js'; // Chart.js - unused but needed for bundle bloat
import { Decimal } from 'decimal.js'; // Decimal.js
import { Big } from 'big.js'; // Big.js
import { Matrix } from 'ml-matrix'; // ML Matrix

import React, { useEffect, useState } from 'react';

interface HeavyBundleLoaderProps {
  enableHeavyCalculations?: boolean;
}

export const HeavyBundleLoader: React.FC<HeavyBundleLoaderProps> = ({
  enableHeavyCalculations = false,
}) => {
  const [calculationResults, setCalculationResults] = useState<any[]>([]);
  const [performanceMetrics, setPerformanceMetrics] = useState<{
    bundleSize: string;
    memoryUsage: string;
    calculationTime: number;
  }>({
    bundleSize: 'Unknown',
    memoryUsage: 'Unknown',
    calculationTime: 0,
  });

  useEffect(() => {
    if (!enableHeavyCalculations) return;

    const startTime = performance.now();
    
    // Use all imported libraries to prevent tree shaking
    const heavyCalculations = async () => {
      try {
        // D3 heavy operations - create complex data transformations
        const dataset = d3.range(1000).map((_: any, i: number) => ({
          x: Math.random() * 100,
          y: Math.random() * 100,
          value: Math.random() * 1000,
          index: i,
        }));
        
        const scales = {
          xScale: d3.scaleLinear().domain([0, 100]).range([0, 800]),
          yScale: d3.scaleLinear().domain([0, 100]).range([0, 600]),
          colorScale: d3.scaleOrdinal(d3.schemeCategory10),
        };

        // Lodash heavy operations - use various utility functions
        const lodashResults = {
          chunks: _.chunk(dataset, 10),
          grouped: _.groupBy(dataset, d => Math.floor(d.value / 100)),
          sorted: _.sortBy(dataset, ['x', 'y', 'value']),
          debounced: _.debounce(() => console.log('Heavy operation'), 1000),
          throttled: _.throttle(() => console.log('Heavy operation'), 1000),
        };

        // Ramda heavy operations - functional programming utilities
        const ramdaResults = {
          mapped: R.map(R.pipe(R.prop('value'), R.multiply(2), R.add(10)))(dataset as any),
          filtered: R.filter(R.propSatisfies(R.gt(R.__, 50), 'value'))(dataset as any),
          reduced: R.reduce(R.add, 0, R.pluck('value', dataset as any)),
          composed: R.compose(R.sum, R.map(R.prop('value') as any))(dataset as any),
        };

        // RxJS heavy operations - reactive programming
        const observableData = rxjs.from(dataset);
        const rxjsResults = await new Promise(resolve => {
          observableData.pipe(
            map((d: any) => d.value),
            filter((value: any) => value > 50),
            scan((acc: any, value: any) => acc + value, 0),
            debounceTime(100),
            distinctUntilChanged(),
            take(100)
          ).subscribe({
            next: (_value: any) => {},
            complete: () => resolve('RxJS processing complete')
          });
        });

        // Math.js heavy operations - mathematical calculations
        const mathResults = {
          matrix: math.matrix([[1, 2, 3], [4, 5, 6], [7, 8, 9]]),
          evaluated: math.evaluate('sqrt(3^2 + 4^2)'),
          complex: math.complex(2, 3),
          unit: math.unit(5, 'cm'),
          statistics: {
            mean: math.mean(dataset.map((d: any) => d.value)),
            std: math.std(dataset.map((d: any) => d.value)),
            variance: math.variance(dataset.map((d: any) => d.value)),
          },
        };

        // TensorFlow.js heavy operations - machine learning
        const tensorData = tf.tensor2d(dataset.map((d: any) => [d.x, d.y, d.value]));
        const model = tf.sequential({
          layers: [
            tf.layers.dense({ inputShape: [3], units: 10, activation: 'relu' }),
            tf.layers.dense({ units: 5, activation: 'relu' }),
            tf.layers.dense({ units: 1, activation: 'linear' }),
          ],
        });
        
        const predictions = model.predict(tensorData) as tf.Tensor;
        const predictionValues = await predictions.data();

        // Moment.js heavy operations - date manipulations
        const momentResults = {
          now: moment(),
          formatted: moment().format('YYYY-MM-DD HH:mm:ss'),
          calculations: _.range(100).map((i: any) => 
            moment().add(i, 'days').format('YYYY-MM-DD')
          ),
          timezones: moment().utc().format(),
        };

        // jQuery heavy operations - DOM manipulations (even though we're in React)
        const jqueryResults = {
          version: $.fn.jquery,
          animations: Array.from({ length: 50 }, (_, i) => ({
            id: i,
            effect: 'fadeIn',
            duration: 1000 + i * 100,
          })),
        };

        // Decimal.js and Big.js heavy operations - precision arithmetic
        const precisionResults = {
          decimal: new Decimal(0.1).plus(0.2).toString(),
          big: new Big(0.1).plus(0.2).toString(),
          calculations: _.range(100).map((i: any) => ({
            decimal: new Decimal(i).dividedBy(3).toString(),
            big: new Big(i).div(3).toString(),
          })),
        };

        // ML Matrix heavy operations - matrix calculations
        const matrix = new Matrix([[1, 2, 3], [4, 5, 6], [7, 8, 9]]);
        const matrixResults = {
          transpose: matrix.transpose(),
          determinant: (matrix as any).det?.() || 0,
          size: matrix.rows,
          data: matrix.to2DArray(),
        };

        // Chart.js initialization (even though we won't render it)
        const chartConfig = {
          type: 'line' as const,
          data: {
            labels: dataset.map((_: any, i: number) => `Point ${i}`),
            datasets: [{
              label: 'Heavy Dataset',
              data: dataset.map((d: any) => d.value),
              borderColor: 'rgb(75, 192, 192)',
              tension: 0.1,
            }],
          },
          options: {
            responsive: true,
            plugins: {
              legend: { position: 'top' as const },
              title: { display: true, text: 'Heavy Chart' },
            },
            scales: {
              x: { display: true, title: { display: true, text: 'X Axis' } },
              y: { display: true, title: { display: true, text: 'Y Axis' } },
            },
          },
        };

        const endTime = performance.now();
        const calculationTime = endTime - startTime;

        // Use unused variables to prevent tree shaking and TypeScript warnings
        console.log('Bundle bloat libraries loaded:', {
          threeLoaded: typeof three !== 'undefined',
          chartLoaded: typeof Chart !== 'undefined',
          matrixOpsCompleted: matrixResults.size > 0,
          chartConfigured: chartConfig.type === 'line'
        });

        const results = [
          { library: 'D3', results: { scales, datasetSize: dataset.length } },
          { library: 'Lodash', results: { operationsCount: Object.keys(lodashResults).length } },
          { library: 'Ramda', results: { operationsCount: Object.keys(ramdaResults).length } },
          { library: 'RxJS', results: rxjsResults },
          { library: 'Math.js', results: { operationsCount: Object.keys(mathResults).length } },
          { library: 'TensorFlow.js', results: { predictionsCount: predictionValues.length } },
          { library: 'Moment.js', results: { operationsCount: Object.keys(momentResults).length } },
          { library: 'jQuery', results: { version: jqueryResults.version } },
          { library: 'Decimal.js & Big.js', results: { calculationsCount: precisionResults.calculations.length } },
          { library: 'ML Matrix', results: { matrixSize: matrix.rows } },
          { library: 'Chart.js', results: { configured: true } },
        ];

        setCalculationResults(results);
        setPerformanceMetrics({
          bundleSize: 'Estimated 10+ MB',
          memoryUsage: `${Math.round((performance as any).memory?.usedJSHeapSize / 1024 / 1024 || 0)} MB`,
          calculationTime: Math.round(calculationTime),
        });

        // Cleanup TensorFlow tensors
        tensorData.dispose();
        predictions.dispose();
        model.dispose();

      } catch (error) {
        console.error('Heavy calculations failed:', error);
        setCalculationResults([
          { library: 'Error', results: 'Heavy calculations failed due to bundle size' }
        ]);
      }
    };

    // Add artificial delay to simulate heavy bundle loading
    setTimeout(heavyCalculations, 2000);
  }, [enableHeavyCalculations]);

  return (
    <div className="p-6 max-w-4xl mx-auto">
      <div className="bg-yellow-50 border-l-4 border-yellow-400 p-4 mb-6">
        <div className="flex">
          <div className="flex-shrink-0">
            <svg className="h-5 w-5 text-yellow-400" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
            </svg>
          </div>
          <div className="ml-3">
            <p className="text-sm text-yellow-700">
              <strong>Warning:</strong> This component imports entire JavaScript libraries to deliberately create bundle bloat.
              Bundle size impact: ~10+ MB of JavaScript. Use with caution in production.
            </p>
          </div>
        </div>
      </div>

      <div className="bg-white shadow rounded-lg p-6">
        <h2 className="text-2xl font-bold text-gray-900 mb-4">Heavy Bundle Loader</h2>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
          <div className="bg-red-50 p-4 rounded-lg">
            <h3 className="font-semibold text-red-800">Bundle Size</h3>
            <p className="text-red-600">{performanceMetrics.bundleSize}</p>
          </div>
          <div className="bg-orange-50 p-4 rounded-lg">
            <h3 className="font-semibold text-orange-800">Memory Usage</h3>
            <p className="text-orange-600">{performanceMetrics.memoryUsage}</p>
          </div>
          <div className="bg-yellow-50 p-4 rounded-lg">
            <h3 className="font-semibold text-yellow-800">Calculation Time</h3>
            <p className="text-yellow-600">{performanceMetrics.calculationTime}ms</p>
          </div>
        </div>

        <div className="mb-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-3">Loaded Libraries (Full Imports)</h3>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-2">
            {[
              'D3.js (Full)', 'Three.js (Full)', 'Lodash (Full)', 'Ramda (Full)',
              'RxJS (Full)', 'Math.js (Full)', 'TensorFlow.js (Full)', 'Moment.js (Full)',
              'jQuery (Full)', 'Chart.js', 'Decimal.js', 'Big.js', 'ML-Matrix'
            ].map(lib => (
              <span key={lib} className="bg-red-100 text-red-800 text-xs font-medium px-2.5 py-0.5 rounded">
                {lib}
              </span>
            ))}
          </div>
        </div>

        {enableHeavyCalculations && (
          <div>
            <h3 className="text-lg font-semibold text-gray-900 mb-3">Library Usage Results</h3>
            <div className="space-y-2">
              {calculationResults.map((result, index) => (
                <div key={index} className="bg-gray-50 p-3 rounded">
                  <div className="flex justify-between items-center">
                    <span className="font-medium text-gray-700">{result.library}</span>
                    <span className="text-sm text-gray-500">
                      {typeof result.results === 'object' 
                        ? `${Object.keys(result.results).length} operations`
                        : result.results
                      }
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        <div className="mt-6 bg-blue-50 p-4 rounded-lg">
          <h4 className="font-semibold text-blue-800 mb-2">Bundle Bloat Impact</h4>
          <ul className="text-sm text-blue-700 space-y-1">
            <li>• Full library imports prevent tree shaking optimization</li>
            <li>• Massive JavaScript bundle size (~10+ MB uncompressed)</li>
            <li>• Increased memory usage from unused library code</li>
            <li>• Slower initial page load and parsing time</li>
            <li>• Poor Core Web Vitals scores (LCP, FID, CLS)</li>
            <li>• Negative impact on mobile performance</li>
          </ul>
        </div>
      </div>
    </div>
  );
};

// Export with heavy calculations disabled by default for safety
export default HeavyBundleLoader;