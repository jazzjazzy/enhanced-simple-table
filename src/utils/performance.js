/**
 * Performance utilities for FilterTable
 * @module utils/performance
 */

/**
 * Create a debounced version of a function
 * @param {Function} func - Function to debounce
 * @param {number} wait - Milliseconds to wait before invoking
 * @param {boolean} [immediate=false] - Whether to invoke immediately on the leading edge
 * @returns {Function} Debounced function
 */
export function debounce(func, wait, immediate = false) {
  let timeout;
  
  return function executedFunction(...args) {
    const context = this;
    
    const later = function() {
      timeout = null;
      if (!immediate) func.apply(context, args);
    };
    
    const callNow = immediate && !timeout;
    
    clearTimeout(timeout);
    
    timeout = setTimeout(later, wait);
    
    if (callNow) func.apply(context, args);
  };
}

/**
 * Create a throttled version of a function
 * @param {Function} func - Function to throttle
 * @param {number} limit - Milliseconds to limit invocations to
 * @returns {Function} Throttled function
 */
export function throttle(func, limit) {
  let inThrottle;
  let lastFunc;
  let lastRan;
  
  return function executedFunction(...args) {
    const context = this;
    
    if (!inThrottle) {
      func.apply(context, args);
      lastRan = Date.now();
      inThrottle = true;
    } else {
      clearTimeout(lastFunc);
      
      lastFunc = setTimeout(function() {
        if ((Date.now() - lastRan) >= limit) {
          func.apply(context, args);
          lastRan = Date.now();
        }
      }, limit - (Date.now() - lastRan));
    }
  };
}

/**
 * Measure the execution time of a function
 * @param {Function} func - Function to measure
 * @param {Array} args - Arguments to pass to the function
 * @returns {Object} Object containing the result and execution time
 */
export function measureExecutionTime(func, ...args) {
  const start = performance.now();
  const result = func(...args);
  const end = performance.now();
  
  return {
    result,
    executionTime: end - start
  };
}

/**
 * Create a memoized version of a function
 * @param {Function} func - Function to memoize
 * @returns {Function} Memoized function
 */
export function memoize(func) {
  const cache = new Map();
  
  return function memoized(...args) {
    const key = JSON.stringify(args);
    
    if (cache.has(key)) {
      return cache.get(key);
    }
    
    const result = func.apply(this, args);
    cache.set(key, result);
    
    return result;
  };
}

/**
 * Run a function in a web worker
 * @param {Function} func - Function to run in a worker
 * @returns {Function} Function that returns a promise resolving to the result
 */
export function runInWorker(func) {
  // Convert the function to a string
  const funcStr = func.toString();
  
  // Create a blob URL for the worker
  const blob = new Blob([
    `self.onmessage = function(e) {
      const func = ${funcStr};
      const result = func.apply(null, e.data);
      self.postMessage(result);
    }`
  ], { type: 'application/javascript' });
  
  const url = URL.createObjectURL(blob);
  
  return function workerized(...args) {
    return new Promise((resolve, reject) => {
      const worker = new Worker(url);
      
      worker.onmessage = function(e) {
        resolve(e.data);
        worker.terminate();
      };
      
      worker.onerror = function(e) {
        reject(new Error(`Worker error: ${e.message}`));
        worker.terminate();
      };
      
      worker.postMessage(args);
    });
  };
}

/**
 * Create a function that batches calls to another function
 * @param {Function} func - Function to batch calls to
 * @param {number} [delay=0] - Milliseconds to wait before processing batch
 * @returns {Function} Function that batches calls
 */
export function batchCalls(func, delay = 0) {
  let batch = [];
  let timeout;
  
  return function batched(...args) {
    batch.push(args);
    
    if (!timeout) {
      timeout = setTimeout(() => {
        const currentBatch = batch;
        batch = [];
        timeout = null;
        
        func(currentBatch);
      }, delay);
    }
  };
}

/**
 * Create a function that processes items in chunks to avoid blocking the main thread
 * @param {Array} items - Items to process
 * @param {Function} processor - Function to process each item
 * @param {Object} [options] - Options
 * @param {number} [options.chunkSize=100] - Number of items to process per chunk
 * @param {number} [options.delay=0] - Milliseconds to wait between chunks
 * @returns {Promise} Promise that resolves when all items are processed
 */
export function processInChunks(items, processor, options = {}) {
  const { chunkSize = 100, delay = 0 } = options;
  
  return new Promise((resolve, reject) => {
    const results = [];
    let index = 0;
    
    function processNextChunk() {
      const chunk = items.slice(index, index + chunkSize);
      index += chunkSize;
      
      try {
        // Process the chunk
        const chunkResults = chunk.map(processor);
        results.push(...chunkResults);
        
        if (index < items.length) {
          // Schedule the next chunk
          setTimeout(processNextChunk, delay);
        } else {
          // All chunks processed
          resolve(results);
        }
      } catch (error) {
        reject(error);
      }
    }
    
    // Start processing
    processNextChunk();
  });
}

/**
 * Create a function that caches the result of expensive operations
 * @param {Function} func - Function to cache results for
 * @param {Object} [options] - Options
 * @param {number} [options.maxSize=100] - Maximum number of results to cache
 * @param {number} [options.ttl=0] - Time to live in milliseconds (0 for no expiration)
 * @returns {Function} Function with caching
 */
export function createCache(func, options = {}) {
  const { maxSize = 100, ttl = 0 } = options;
  const cache = new Map();
  const timestamps = new Map();
  
  return function cached(...args) {
    const key = JSON.stringify(args);
    
    // Check if the result is cached and not expired
    if (cache.has(key)) {
      const timestamp = timestamps.get(key);
      
      if (ttl === 0 || Date.now() - timestamp < ttl) {
        return cache.get(key);
      }
      
      // Result is expired, remove it
      cache.delete(key);
      timestamps.delete(key);
    }
    
    // Calculate the result
    const result = func.apply(this, args);
    
    // Cache the result
    cache.set(key, result);
    timestamps.set(key, Date.now());
    
    // Evict oldest entries if cache is too large
    if (cache.size > maxSize) {
      const oldestKey = Array.from(timestamps.entries())
        .sort(([, a], [, b]) => a - b)[0][0];
      
      cache.delete(oldestKey);
      timestamps.delete(oldestKey);
    }
    
    return result;
  };
}

/**
 * Create a virtualized list renderer
 * @param {Object} options - Options
 * @param {HTMLElement} options.container - Container element
 * @param {Array} options.items - Items to render
 * @param {Function} options.renderItem - Function to render an item
 * @param {number} options.itemHeight - Height of each item in pixels
 * @param {number} [options.overscan=5] - Number of items to render outside the visible area
 * @returns {Object} Virtualized list controller
 */
export function createVirtualizedList(options) {
  const { container, items, renderItem, itemHeight, overscan = 5 } = options;
  
  let scrollTop = 0;
  let visibleItems = [];
  let renderedElements = new Map();
  
  // Create a content element to hold the items
  const content = document.createElement('div');
  content.style.position = 'relative';
  content.style.height = `${items.length * itemHeight}px`;
  container.appendChild(content);
  
  // Function to update the visible items
  function updateVisibleItems() {
    scrollTop = container.scrollTop;
    
    const containerHeight = container.clientHeight;
    const startIndex = Math.max(0, Math.floor(scrollTop / itemHeight) - overscan);
    const endIndex = Math.min(
      items.length - 1,
      Math.ceil((scrollTop + containerHeight) / itemHeight) + overscan
    );
    
    visibleItems = items.slice(startIndex, endIndex + 1).map((item, index) => ({
      item,
      index: startIndex + index,
      top: (startIndex + index) * itemHeight
    }));
    
    renderVisibleItems();
  }
  
  // Function to render the visible items
  function renderVisibleItems() {
    // Remove elements that are no longer visible
    for (const [index, element] of renderedElements.entries()) {
      if (!visibleItems.some(item => item.index === index)) {
        content.removeChild(element);
        renderedElements.delete(index);
      }
    }
    
    // Add or update visible elements
    visibleItems.forEach(({ item, index, top }) => {
      if (!renderedElements.has(index)) {
        const element = renderItem(item, index);
        element.style.position = 'absolute';
        element.style.top = `${top}px`;
        element.style.width = '100%';
        element.style.height = `${itemHeight}px`;
        
        content.appendChild(element);
        renderedElements.set(index, element);
      }
    });
  }
  
  // Attach scroll event listener
  container.addEventListener('scroll', updateVisibleItems);
  
  // Initial render
  updateVisibleItems();
  
  // Return controller
  return {
    updateItems(newItems) {
      items.length = 0;
      items.push(...newItems);
      content.style.height = `${items.length * itemHeight}px`;
      updateVisibleItems();
    },
    
    scrollToIndex(index) {
      container.scrollTop = index * itemHeight;
    },
    
    refresh() {
      updateVisibleItems();
    },
    
    destroy() {
      container.removeEventListener('scroll', updateVisibleItems);
      container.removeChild(content);
      renderedElements.clear();
    }
  };
}
