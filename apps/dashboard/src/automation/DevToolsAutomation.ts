/**
 * DevTools Automation Core Class
 * 
 * This is the main orchestrator class that manages browser automation and Chrome DevTools Protocol
 * communication for performance testing. It provides a high-level API for:
 * 
 * 1. Browser lifecycle management (launch, navigate, cleanup)
 * 2. Chrome DevTools Protocol session management
 * 3. Performance data collection coordination
 * 4. Error handling and resource cleanup
 * 
 * Usage Example:
 * ```typescript
 * const automation = new DevToolsAutomation();
 * await automation.initialize();
 * await automation.startRecording({ timeline: true, network: true });
 * await automation.page.goto('http://localhost:3000');
 * const metrics = await automation.stopRecording();
 * await automation.cleanup();
 * ```
 */

import { chromium, Browser, BrowserContext, Page, CDPSession } from 'playwright';
import { 
  DevToolsConfig, 
  DEFAULT_DEVTOOLS_CONFIG, 
  createDevToolsConfig,
  getNetworkThrottling 
} from './EnvironmentConfig';
import { TimelineCapture } from './TimelineCapture';
import { NetworkAnalysis } from './NetworkAnalysis';
import {
  TimelineData,
  NetworkAnalysis as NetworkAnalysisType,
  TimelineProcessingOptions
} from './types';

export type RecordingOptions = {
  timeline?: boolean;    // Capture performance timeline
  network?: boolean;     // Capture network activity
  memory?: boolean;      // Capture memory snapshots
  cpu?: boolean;         // Capture CPU profiling
  screenshots?: boolean; // Capture screenshots during interactions
}

export type DevToolsMetrics = {
  timeline?: TimelineData;
  network?: NetworkAnalysisType;
  memory?: MemoryData;
  cpu?: CPUProfileData;
  environment: EnvironmentData;
  duration: number;
  timestamp: string;
}

export type MemoryData = {
  snapshots: MemorySnapshot[];
  heapUsage: HeapUsageMetric[];
  gcEvents: GCEvent[];
}

export type CPUProfileData = {
  profile: any; // CDP CPU profile format
  duration: number;
  sampleCount: number;
}

export type EnvironmentData = {
  userAgent: string;
  viewportWidth: number;
  viewportHeight: number;
  url: string;
  timestamp: string;
  throttling: {
    network: string;
    cpu: number;
  };
}

// Supporting types (these will be expanded in future phases)
export type MemorySnapshot = any;
export type HeapUsageMetric = any;
export type GCEvent = any;

export class DevToolsAutomation {
  private browser: Browser | null = null;
  private context: BrowserContext | null = null;
  private _page: Page | null = null;
  private cdpSession: CDPSession | null = null;
  private config: DevToolsConfig;
  private isRecording = false;
  private recordingStartTime: number = 0;
  private currentRecordingOptions: RecordingOptions = {};
  
  // Phase 2: Advanced data collectors
  private timelineCapture: TimelineCapture | null = null;
  private networkAnalysis: NetworkAnalysis | null = null;
  
  // Legacy data collectors (for CPU/Memory profiling - Phase 3)
  private memorySnapshots: any[] = [];
  private screenshots: string[] = [];

  /**
   * Initialize DevToolsAutomation with custom configuration
   * 
   * @param customConfig - Optional configuration overrides
   */
  constructor(customConfig: Partial<DevToolsConfig> = {}) {
    this.config = createDevToolsConfig(customConfig);
    
    if (this.config.debug) {
      console.log('DevToolsAutomation initialized with config:', this.config);
    }
  }

  /**
   * Get the current page instance
   * Throws error if automation hasn't been initialized
   */
  get page(): Page {
    if (!this._page) {
      throw new Error('DevToolsAutomation not initialized. Call initialize() first.');
    }
    return this._page;
  }

  /**
   * Initialize the browser and create a new page
   * This must be called before any other operations
   * 
   * Sets up:
   * - Browser instance with configured options
   * - Browser context with viewport and throttling
   * - Page with event listeners
   * - Chrome DevTools Protocol session
   */
  initialize = async (): Promise<void> => {
    try {
      this.log('info', 'Initializing DevTools automation...');
      
      // Step 1: Launch browser with security and performance settings
      this.browser = await chromium.launch(this.config.browser);
      this.log('info', 'Browser launched successfully');

      // Step 2: Create browser context with viewport settings
      this.context = await this.browser.newContext({
        viewport: this.config.viewport,
        // Disable cache if specified in config
        ignoreHTTPSErrors: true, // Accept self-signed certificates in dev
      });
      this.log('info', 'Browser context created');

      // Step 3: Create new page
      this._page = await this.context.newPage();
      this.log('info', 'New page created');

      // Step 4: Set up Chrome DevTools Protocol session
      this.cdpSession = await this._page.context().newCDPSession(this._page);
      this.log('info', 'CDP session established');

      // Step 5: Configure network throttling if specified
      if (this.config.throttling.network !== 'NoThrottling') {
        await this.setupNetworkThrottling();
      }

      // Step 6: Set up basic event listeners for debugging
      this.setupEventListeners();
      
      this.log('info', 'DevTools automation initialized successfully');
      
    } catch (error) {
      this.log('error', 'Failed to initialize DevTools automation:', error);
      await this.cleanup(); // Clean up any partially initialized resources
      throw error;
    }
  };

  /**
   * Start recording performance data
   * 
   * @param options - What types of data to record
   */
  startRecording = async (options: RecordingOptions = {}): Promise<void> => {
    if (!this.cdpSession) {
      throw new Error('DevTools automation not initialized');
    }

    if (this.isRecording) {
      throw new Error('Recording already in progress. Stop current recording first.');
    }

    this.log('info', 'Starting performance recording with options:', options);
    
    this.currentRecordingOptions = options;
    this.isRecording = true;
    this.recordingStartTime = Date.now();
    
    // Reset legacy data collectors
    this.memorySnapshots = [];
    this.screenshots = [];

    try {
      // Initialize Phase 2 collectors based on options
      const processingOptions: Partial<TimelineProcessingOptions> = {
        calculateCWV: true,
        analyzeNetwork: options.network || false,
        analyzeJavaScript: true,
        longTaskThreshold: 50
      };

      if (options.timeline) {
        this.timelineCapture = new TimelineCapture(this.cdpSession, processingOptions);
        await this.timelineCapture.startRecording();
        this.log('info', 'Timeline capture started');
      }

      if (options.network) {
        this.networkAnalysis = new NetworkAnalysis(this.cdpSession, processingOptions);
        await this.networkAnalysis.startRecording();
        this.log('info', 'Network analysis started');
      }

      // Legacy CPU/Memory profiling (Phase 3 will improve these)
      if (options.memory) {
        await this.cdpSession.send('HeapProfiler.enable');
        this.log('info', 'Memory profiling enabled');
      }

      if (options.cpu) {
        await this.cdpSession.send('Profiler.enable');
        await this.cdpSession.send('Profiler.start');
        this.log('info', 'CPU profiling started');
      }
      
      this.log('info', 'Performance recording started successfully');
      
    } catch (error) {
      this.isRecording = false;
      // Cleanup any partially initialized collectors
      this.timelineCapture = null;
      this.networkAnalysis = null;
      this.log('error', 'Failed to start recording:', error);
      throw error;
    }
  };

  /**
   * Stop recording and return collected performance data
   * 
   * @returns Collected performance metrics and data
   */
  stopRecording = async (): Promise<DevToolsMetrics> => {
    if (!this.cdpSession || !this.isRecording) {
      throw new Error('No recording in progress');
    }

    this.log('info', 'Stopping performance recording...');
    
    const recordingDuration = Date.now() - this.recordingStartTime;
    
    try {
      // Collect final metrics before stopping
      const metrics: DevToolsMetrics = {
        environment: await this.collectEnvironmentData(),
        duration: recordingDuration,
        timestamp: new Date().toISOString()
      };

      // Stop and collect Phase 2 data
      if (this.currentRecordingOptions.timeline && this.timelineCapture) {
        metrics.timeline = await this.timelineCapture.stopRecording();
        this.timelineCapture = null;
        this.log('info', 'Timeline data collected and processed');
      }

      if (this.currentRecordingOptions.network && this.networkAnalysis) {
        metrics.network = await this.networkAnalysis.stopRecording();
        this.networkAnalysis = null;
        this.log('info', 'Network data collected and analyzed');
      }

      // Legacy CPU/Memory profiling (Phase 3 will improve these)
      if (this.currentRecordingOptions.cpu) {
        const cpuProfile = await this.cdpSession.send('Profiler.stop');
        metrics.cpu = {
          profile: cpuProfile.profile,
          duration: recordingDuration,
          sampleCount: cpuProfile.profile.samples?.length || 0
        };
        this.log('info', 'CPU profiling stopped');
      }

      if (this.currentRecordingOptions.memory) {
        metrics.memory = await this.collectMemoryData();
        this.log('info', 'Memory data collected');
      }

      this.isRecording = false;
      this.log('info', 'Performance recording stopped successfully');
      
      return metrics;
      
    } catch (error) {
      this.log('error', 'Failed to stop recording:', error);
      this.isRecording = false; // Reset state even on error
      // Cleanup collectors on error
      this.timelineCapture = null;
      this.networkAnalysis = null;
      throw error;
    }
  };

  /**
   * Take a screenshot of the current page
   * Useful for visual debugging and correlation with performance issues
   */
  takeScreenshot = async (): Promise<string> => {
    if (!this._page) {
      throw new Error('Page not available');
    }

    try {
      const screenshot = await this._page.screenshot({ 
        type: 'png',
        fullPage: false // Only visible area for performance
      });
      
      const base64Screenshot = screenshot.toString('base64');
      
      if (this.isRecording && this.currentRecordingOptions.screenshots) {
        // Add to legacy screenshots array
        this.screenshots.push(base64Screenshot);
        
        // Also add to timeline capture if active
        if (this.timelineCapture) {
          await this.timelineCapture.takeScreenshot(base64Screenshot);
        }
      }
      
      this.log('info', 'Screenshot captured');
      return base64Screenshot;
      
    } catch (error) {
      this.log('error', 'Failed to take screenshot:', error);
      throw error;
    }
  };

  /**
   * Clean up all resources and close browser
   * Should always be called when done with automation
   */
  cleanup = async (): Promise<void> => {
    this.log('info', 'Cleaning up DevTools automation...');
    
    try {
      // Stop any ongoing recording
      if (this.isRecording) {
        this.log('warn', 'Stopping ongoing recording during cleanup');
        this.isRecording = false;
        
        // Cleanup collectors
        this.timelineCapture = null;
        this.networkAnalysis = null;
      }

      // Close CDP session
      if (this.cdpSession) {
        try {
          await this.cdpSession.detach();
          this.log('info', 'CDP session closed');
        } catch (error) {
          this.log('warn', 'Error closing CDP session:', error);
        }
        this.cdpSession = null;
      }

      // Close page
      if (this._page) {
        try {
          await this._page.close();
          this.log('info', 'Page closed');
        } catch (error) {
          this.log('warn', 'Error closing page:', error);
        }
        this._page = null;
      }

      // Close context
      if (this.context) {
        try {
          await this.context.close();
          this.log('info', 'Browser context closed');
        } catch (error) {
          this.log('warn', 'Error closing context:', error);
        }
        this.context = null;
      }

      // Close browser
      if (this.browser) {
        try {
          await this.browser.close();
          this.log('info', 'Browser closed');
        } catch (error) {
          this.log('warn', 'Error closing browser:', error);
        }
        this.browser = null;
      }

      this.log('info', 'Cleanup completed successfully');
      
    } catch (error) {
      this.log('error', 'Error during cleanup:', error);
      // Don't throw - cleanup should be best effort
    }
  };

  /**
   * Private method to set up network throttling
   */
  private setupNetworkThrottling = async (): Promise<void> => {
    if (!this.cdpSession) return;

    const throttling = getNetworkThrottling(this.config.throttling.network);
    
    await this.cdpSession.send('Network.enable');
    await this.cdpSession.send('Network.emulateNetworkConditions', {
      offline: false,
      downloadThroughput: throttling.downloadThroughput,
      uploadThroughput: throttling.uploadThroughput,
      latency: throttling.latency
    });

    // CPU throttling
    if (this.config.throttling.cpu > 1) {
      await this.cdpSession.send('Emulation.setCPUThrottlingRate', {
        rate: this.config.throttling.cpu
      });
    }

    this.log('info', `Network throttling configured: ${this.config.throttling.network}`);
  };

  /**
   * Private method to set up basic event listeners
   */
  private setupEventListeners = (): void => {
    if (!this._page) return;

    // Page-level error handling
    this._page.on('pageerror', (error) => {
      this.log('error', 'Page error occurred:', error);
    });

    this._page.on('console', (msg) => {
      if (this.config.debug) {
        this.log('info', `Console ${msg.type()}: ${msg.text()}`);
      }
    });

    this._page.on('requestfailed', (request) => {
      this.log('warn', `Request failed: ${request.url()}`);
    });
  };


  /**
   * Private method to collect environment data
   */
  private collectEnvironmentData = async (): Promise<EnvironmentData> => {
    if (!this._page) {
      throw new Error('Page not available');
    }

    const userAgent = await this._page.evaluate(() => navigator.userAgent);
    const url = this._page.url();

    return {
      userAgent,
      viewportWidth: this.config.viewport.width,
      viewportHeight: this.config.viewport.height,
      url,
      timestamp: new Date().toISOString(),
      throttling: {
        network: this.config.throttling.network,
        cpu: this.config.throttling.cpu
      }
    };
  };


  private collectMemoryData = async (): Promise<MemoryData> => {
    // Phase 3 implementation
    return {
      snapshots: this.memorySnapshots,
      heapUsage: [],
      gcEvents: []
    };
  };

  /**
   * Private logging utility
   */
  private log = (level: 'info' | 'warn' | 'error', message: string, data?: any): void => {
    if (this.config.logLevel === 'silent') return;
    
    const levels = ['error', 'warn', 'info', 'verbose'];
    const currentLevelIndex = levels.indexOf(this.config.logLevel);
    const messageLevelIndex = levels.indexOf(level);
    
    if (messageLevelIndex <= currentLevelIndex) {
      const timestamp = new Date().toISOString();
      const prefix = `[${timestamp}] [DevToolsAutomation] [${level.toUpperCase()}]`;
      
      if (data) {
        console.log(prefix, message, data);
      } else {
        console.log(prefix, message);
      }
    }
  };
}