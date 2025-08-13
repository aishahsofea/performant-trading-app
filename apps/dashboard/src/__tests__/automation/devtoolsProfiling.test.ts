/**
 * Phase 3 DevTools Automation Profiling Tests
 *
 * These tests verify that our Phase 3 implementation works correctly:
 * 1. Memory profiling with heap snapshots and GC monitoring
 * 2. CPU profiling with sampling and analysis
 * 3. Integration with main DevToolsAutomation class
 * 4. Proper error handling and resource cleanup
 * 5. Data analysis and recommendations generation
 *
 * These are integration tests that validate the complete profiling pipeline.
 */

import { test, expect } from "@playwright/test";
import { DevToolsAutomation } from "@/automation/DevToolsAutomation";

test.describe("DevTools Automation - Phase 3 Profiling Functionality", () => {
  let automation: DevToolsAutomation;

  // Clean up after each test to prevent resource leaks
  test.afterEach(async () => {
    if (automation) {
      await automation.cleanup();
    }
  });

  test("should perform comprehensive memory profiling", async () => {
    // Test explanation: Verify advanced memory profiling works end-to-end
    automation = new DevToolsAutomation({
      browser: { headless: true },
      logLevel: "error",
    });

    await automation.initialize();

    // Navigate to a page that will use memory
    const testUrl = `data:text/html,<html><body>
      <script>
        // Create some objects to profile
        const largeArray = [];
        const objects = [];
        
        function createMemoryLoad() {
          for (let i = 0; i < 1000; i++) {
            largeArray.push(new Array(100).fill(i));
            objects.push({ id: i, data: 'test'.repeat(50) });
          }
        }
        
        // Make function available globally for testing
        window.createMemoryLoad = createMemoryLoad;
      </script>
      <h1>Memory Profiling Test</h1>
    </body></html>`;

    await automation.page.goto(testUrl);

    // Start recording with memory profiling
    await automation.startRecording({
      memory: true,
      timeline: false, // Focus on memory only
      network: false,
      cpu: false,
    });

    // Generate memory activity
    await automation.page.evaluate(() => {
      // Define function inline to avoid timing issues
      function createMemoryLoad() {
        const largeArray = [];
        const objects = [];
        
        for (let i = 0; i < 1000; i++) {
          largeArray.push(new Array(100).fill(i));
          objects.push({ id: i, data: 'test'.repeat(50) });
        }
        
        return { largeArray, objects };
      }
      
      return createMemoryLoad();
    });

    // Wait a bit for memory monitoring
    await automation.page.waitForTimeout(2000);

    // Stop recording and get metrics
    const metrics = await automation.stopRecording();

    // Verify memory profiling results
    expect(metrics.memory).toBeDefined();
    expect(metrics.memory!.snapshots).toBeDefined();
    expect(metrics.memory!.heapUsage).toBeDefined();
    expect(metrics.memory!.analysis).toBeDefined();

    // Check that we captured memory data
    expect(metrics.memory!.heapUsage.length).toBeGreaterThan(0);
    expect(metrics.memory!.snapshots.length).toBeGreaterThanOrEqual(1); // At least start or end snapshot

    // Verify analysis contains expected fields
    const analysis = metrics.memory!.analysis;
    expect(typeof analysis.avgMemoryUsage).toBe('number');
    expect(typeof analysis.maxMemoryUsage).toBe('number');
    expect(typeof analysis.memoryGrowthRate).toBe('number');
    expect(Array.isArray(analysis.recommendations)).toBe(true);
  });

  test("should perform comprehensive CPU profiling", async () => {
    // Test explanation: Verify advanced CPU profiling works end-to-end
    automation = new DevToolsAutomation({
      browser: { headless: true },
      logLevel: "error",
    });

    await automation.initialize();

    // Navigate to a page with CPU-intensive JavaScript
    const testUrl = `data:text/html,<html><body>
      <script>
        function expensiveCalculation() {
          let result = 0;
          for (let i = 0; i < 100000; i++) {
            result += Math.sin(i) * Math.cos(i);
          }
          return result;
        }
        
        function performMultipleCalculations() {
          const results = [];
          for (let j = 0; j < 10; j++) {
            results.push(expensiveCalculation());
          }
          return results;
        }
        
        // Make functions available globally
        window.performMultipleCalculations = performMultipleCalculations;
      </script>
      <h1>CPU Profiling Test</h1>
    </body></html>`;

    await automation.page.goto(testUrl);

    // Start recording with CPU profiling
    await automation.startRecording({
      cpu: true,
      timeline: false,
      network: false,
      memory: false,
    });

    // Generate CPU activity
    await automation.page.evaluate(() => {
      // Define functions inline to avoid timing issues
      function expensiveCalculation() {
        let result = 0;
        for (let i = 0; i < 100000; i++) {
          result += Math.sin(i) * Math.cos(i);
        }
        return result;
      }
      
      function performMultipleCalculations() {
        const results = [];
        for (let j = 0; j < 10; j++) {
          results.push(expensiveCalculation());
        }
        return results;
      }
      
      return performMultipleCalculations();
    });

    // Wait a bit for profiling
    await automation.page.waitForTimeout(1500);

    // Stop recording and get metrics
    const metrics = await automation.stopRecording();

    // Verify CPU profiling results
    expect(metrics.cpu).toBeDefined();
    expect(metrics.cpu!.profile).toBeDefined();
    expect(metrics.cpu!.analysis).toBeDefined();
    expect(metrics.cpu!.sampleCount).toBeGreaterThan(0);

    // Check analysis results
    const analysis = metrics.cpu!.analysis;
    expect(typeof analysis.totalSamples).toBe('number');
    expect(typeof analysis.totalTime).toBe('number');
    expect(typeof analysis.activeTime).toBe('number');
    expect(Array.isArray(analysis.hotSpots)).toBe(true);
    expect(Array.isArray(analysis.functionBreakdown)).toBe(true);
    expect(Array.isArray(analysis.recommendations)).toBe(true);

    // Should have some hot spots from our expensive calculations
    expect(analysis.functionBreakdown.length).toBeGreaterThan(0);
  });

  test("should perform combined memory and CPU profiling", async () => {
    // Test explanation: Verify that both profilers can work simultaneously
    automation = new DevToolsAutomation({
      browser: { headless: true },
      logLevel: "error",
    });

    await automation.initialize();

    const testUrl = `data:text/html,<html><body>
      <script>
        function memoryAndCpuIntensive() {
          const data = [];
          for (let i = 0; i < 5000; i++) {
            // CPU intensive operation
            const computed = Math.pow(i, 2) + Math.sqrt(i);
            
            // Memory allocation
            data.push({
              index: i,
              computed: computed,
              array: new Array(50).fill(computed),
              timestamp: Date.now()
            });
          }
          return data;
        }
        
        window.memoryAndCpuIntensive = memoryAndCpuIntensive;
      </script>
      <h1>Combined Profiling Test</h1>
    </body></html>`;

    await automation.page.goto(testUrl);

    // Start recording with both profilers
    await automation.startRecording({
      memory: true,
      cpu: true,
      timeline: false,
      network: false,
    });

    // Generate both memory and CPU activity
    await automation.page.evaluate(() => {
      // Define function inline to avoid timing issues
      function memoryAndCpuIntensive() {
        const data = [];
        for (let i = 0; i < 5000; i++) {
          // CPU intensive operation
          const computed = Math.pow(i, 2) + Math.sqrt(i);
          
          // Memory allocation
          data.push({
            index: i,
            computed: computed,
            array: new Array(50).fill(computed),
            timestamp: Date.now()
          });
        }
        return data;
      }
      
      return memoryAndCpuIntensive();
    });

    await automation.page.waitForTimeout(2000);

    // Stop recording and get metrics
    const metrics = await automation.stopRecording();

    // Verify both profiling results are present
    expect(metrics.memory).toBeDefined();
    expect(metrics.cpu).toBeDefined();

    // Memory profiling verification
    expect(metrics.memory!.analysis).toBeDefined();
    expect(metrics.memory!.heapUsage.length).toBeGreaterThan(0);

    // CPU profiling verification
    expect(metrics.cpu!.analysis).toBeDefined();
    expect(metrics.cpu!.sampleCount).toBeGreaterThan(0);

    // Check that both profilers captured meaningful data
    expect(metrics.memory!.analysis.maxMemoryUsage).toBeGreaterThan(0);
    expect(metrics.cpu!.analysis.totalSamples).toBeGreaterThan(0);
  });

  test("should handle profiling errors gracefully", async () => {
    // Test explanation: Verify error handling in profiling scenarios
    automation = new DevToolsAutomation({
      browser: { headless: true },
      logLevel: "error",
    });

    await automation.initialize();

    // Should throw error if trying to start memory profiling twice
    await automation.startRecording({ memory: true });
    
    await expect(
      automation.startRecording({ memory: true })
    ).rejects.toThrow("Recording already in progress");

    // Cleanup the ongoing recording
    await automation.stopRecording();
  });

  test("should provide meaningful profiling analysis and recommendations", async () => {
    // Test explanation: Verify that analysis provides actionable insights
    automation = new DevToolsAutomation({
      browser: { headless: true },
      logLevel: "error",
    });

    await automation.initialize();

    // Create a page with known performance issues
    const testUrl = `data:text/html,<html><body>
      <script>
        function inefficientFunction() {
          // Inefficient DOM manipulation
          const container = document.createElement('div');
          for (let i = 0; i < 1000; i++) {
            const element = document.createElement('div');
            element.textContent = 'Element ' + i;
            container.appendChild(element);
            // Force layout by accessing offsetHeight
            element.offsetHeight;
          }
          document.body.appendChild(container);
        }
        
        function memoryLeakFunction() {
          // Create potential memory leak
          const cache = [];
          for (let i = 0; i < 2000; i++) {
            cache.push({
              id: i,
              data: new Array(100).fill('data'),
              timestamp: new Date()
            });
          }
          // Don't clean up cache, creating potential leak
          window.leakyCache = cache;
        }
        
        window.inefficientFunction = inefficientFunction;
        window.memoryLeakFunction = memoryLeakFunction;
      </script>
      <h1>Analysis Test</h1>
    </body></html>`;

    await automation.page.goto(testUrl);

    // Start comprehensive profiling
    await automation.startRecording({
      memory: true,
      cpu: true,
      timeline: false,
      network: false,
    });

    // Execute problematic functions
    await automation.page.evaluate(() => {
      // Define problematic functions inline
      function inefficientFunction() {
        // Inefficient DOM manipulation
        const container = document.createElement('div');
        for (let i = 0; i < 1000; i++) {
          const element = document.createElement('div');
          element.textContent = 'Element ' + i;
          container.appendChild(element);
          // Force layout by accessing offsetHeight
          void element.offsetHeight;
        }
        document.body.appendChild(container);
        return container;
      }
      
      function memoryLeakFunction() {
        // Create potential memory leak
        const cache = [];
        for (let i = 0; i < 2000; i++) {
          cache.push({
            id: i,
            data: new Array(100).fill('data'),
            timestamp: new Date()
          });
        }
        // Don't clean up cache, creating potential leak
        (window as any).leakyCache = cache;
        return cache;
      }
      
      const inefficientResult = inefficientFunction();
      const memoryLeakResult = memoryLeakFunction();
      
      return { inefficientResult, memoryLeakResult };
    });

    await automation.page.waitForTimeout(2000);

    const metrics = await automation.stopRecording();

    // Verify that analysis provides recommendations
    expect(metrics.memory!.analysis.recommendations.length).toBeGreaterThan(0);
    expect(metrics.cpu!.analysis.recommendations.length).toBeGreaterThan(0);

    // Check that recommendations are strings and not empty
    metrics.memory!.analysis.recommendations.forEach(rec => {
      expect(typeof rec).toBe('string');
      expect(rec.length).toBeGreaterThan(10); // Meaningful recommendation
    });

    metrics.cpu!.analysis.recommendations.forEach(rec => {
      expect(typeof rec).toBe('string');
      expect(rec.length).toBeGreaterThan(10);
    });

    // Memory analysis should detect potential issues
    const memoryAnalysis = metrics.memory!.analysis;
    expect(memoryAnalysis.maxMemoryUsage).toBeGreaterThan(0);
    expect(memoryAnalysis.avgMemoryUsage).toBeGreaterThan(0);

    // CPU analysis should identify function performance
    const cpuAnalysis = metrics.cpu!.analysis;
    expect(cpuAnalysis.functionBreakdown.length).toBeGreaterThan(0);
    expect(cpuAnalysis.totalTime).toBeGreaterThan(0);
  });

  test("should capture heap snapshots at configured intervals", async () => {
    // Test explanation: Verify heap snapshot capture functionality
    automation = new DevToolsAutomation({
      browser: { headless: true },
      logLevel: "error",
    });

    await automation.initialize();
    await automation.page.goto("data:text/html,<html><body>Snapshot Test</body></html>");

    // Start recording with memory profiling (snapshots should be taken at start/end)
    await automation.startRecording({ memory: true });

    // Generate some memory activity
    await automation.page.evaluate(() => {
      const data = [];
      for (let i = 0; i < 1000; i++) {
        data.push({ id: i, content: `data-${i}`.repeat(10) });
      }
      (window as any).testData = data;
    });

    await automation.page.waitForTimeout(1000);

    const metrics = await automation.stopRecording();

    // Should have at least start and/or end snapshots
    expect(metrics.memory!.snapshots.length).toBeGreaterThanOrEqual(1);

    // Each snapshot should have required metadata
    metrics.memory!.snapshots.forEach(snapshot => {
      expect(snapshot.id).toBeDefined();
      expect(snapshot.label).toBeDefined();
      expect(snapshot.timestamp).toBeGreaterThanOrEqual(0);
      expect(snapshot.metadata).toBeDefined();
      expect(snapshot.metadata.nodeCount).toBeGreaterThanOrEqual(0);
    });
  });
});

test.describe("DevTools Automation - Profiling Performance and Resources", () => {
  test("should complete profiling within reasonable time", async () => {
    // Test explanation: Ensure profiling doesn't take excessive time
    const automation = new DevToolsAutomation({
      browser: { headless: true },
      logLevel: "silent",
    });

    await automation.initialize();
    await automation.page.goto("data:text/html,<html><body>Performance Test</body></html>");

    const startTime = Date.now();
    
    await automation.startRecording({
      memory: true,
      cpu: true,
    });

    await automation.page.waitForTimeout(1000); // 1 second of profiling
    
    const metrics = await automation.stopRecording();
    const totalTime = Date.now() - startTime;

    // Profiling setup, execution, and analysis should complete in reasonable time
    expect(totalTime).toBeLessThan(15000); // Less than 15 seconds total
    
    // Should have collected meaningful data
    expect(metrics.memory).toBeDefined();
    expect(metrics.cpu).toBeDefined();

    await automation.cleanup();
  });

  test("should handle cleanup during active profiling", async () => {
    // Test explanation: Verify cleanup works even with active profiling
    const automation = new DevToolsAutomation({
      browser: { headless: true },
      logLevel: "silent",
    });

    await automation.initialize();
    await automation.page.goto("data:text/html,<html><body>Cleanup Test</body></html>");

    // Start profiling
    await automation.startRecording({
      memory: true,
      cpu: true,
    });

    // Cleanup without stopping profiling (simulates unexpected cleanup)
    await expect(automation.cleanup()).resolves.not.toThrow();
  });
});