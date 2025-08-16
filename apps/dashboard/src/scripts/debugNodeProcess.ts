#!/usr/bin/env node

/**
 * Development utility to debug hanging Node.js processes
 * Usage: pnpm run debug:node-process
 */

import whyIsNodeRunning from 'why-is-node-running';

export function debugNodeProcess() {
  console.log('🔍 Analyzing what keeps Node.js process running...\n');
  
  setTimeout(() => {
    console.log('📊 Node.js process analysis:');
    whyIsNodeRunning();
  }, 1000);
}

// Run if called directly
if (require.main === module) {
  debugNodeProcess();
}