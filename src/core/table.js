/**
 * Core Table component for FilterTable
 * @module core/table
 */

import Renderer from './renderer.js';
import EventManager from './events.js';
import FilterManager from '../filters/filter-manager.js';
import { detectDataTypes } from '../utils/data-types.js';
import { debounce } from '../utils/performance.js';

/**
 * Table class that manages data, rendering, and filtering
 * @class
 */
class Table {
  /**
   * Create a new Table instance
   * @param {string|HTMLElement} container - CSS selector or DOM element to render the table in
   * @param {Object} options - Configuration options
   */
  constructor(container, options = {}) {
    this._validateOptions(options);
    
    // Store original options
    this.options = { ...options };
    
    // Initialize properties
    this.container = typeof container === 'string' 
      ? document.querySelector(container) 
      : container;
      
    if (!this.container) {
      throw new Error(`Container not found: ${container}`);
    }
    
    this.data = [...(options.data || [])];
    this.originalData = [...this.data];
    this.columns = [...(options.columns || [])];
    this.filteredData = [...this.data];
    
    // Auto-detect column types if not specified
    if (this.data.length > 0) {
      this._autoDetectColumnTypes();
    }
    
    // Initialize pagination settings
    this.paginationOptions = {
      enabled: options.pagination?.enabled || false,
      pageSize: options.pagination?.pageSize || 10,
      currentPage: options.pagination?.currentPage || 1,
      pageSizeOptions: options.pagination?.pageSizeOptions || [10, 25, 50, 100]
    };
    
    // Initialize endless scrolling settings
    this.endlessScrollingOptions = {
      enabled: options.endlessScrolling?.enabled || false,
      itemsPerLoad: options.endlessScrolling?.itemsPerLoad || 20,
      loadMoreThreshold: options.endlessScrolling?.loadMoreThreshold || 200,
      loadedItems: options.endlessScrolling?.initialItems || 20
    };
    
    // Ensure only one display mode is enabled
    if (this.paginationOptions.enabled && this.endlessScrollingOptions.enabled) {
      console.warn('Both pagination and endless scrolling are enabled. Defaulting to pagination.');
      this.endlessScrollingOptions.enabled = false;
    }
    
    // Initialize components
    this.filterManager = new FilterManager(this);
    this.renderer = new Renderer(this);
    this.eventManager = new EventManager(this);
    
    // Apply initial configuration
    if (options.filters) {
      this.applyFilters(options.filters);
    }
    
    // Initial render
    this.render();
    
    // Set up debounced refresh
    this._debouncedRefresh = debounce(() => this.refresh(), 150);
    
    // Set up endless scrolling if enabled
    if (this.endlessScrollingOptions.enabled) {
      this._setupEndlessScrolling();
    }
  }
  
  /**
   * Validate constructor options
   * @private
   * @param {Object} options - Options to validate
   */
  _validateOptions(options) {
    if (options.data && !Array.isArray(options.data)) {
      throw new Error('Data must be an array');
    }
    
    if (options.columns && !Array.isArray(options.columns)) {
      throw new Error('Columns must be an array');
    }
  }
  
  /**
   * Auto-detect column data types based on data
   * @private
   */
  _autoDetectColumnTypes() {
    const sampleData = this.data.slice(0, Math.min(20, this.data.length));
    const detectedTypes = detectDataTypes(sampleData);
    
    this.columns.forEach(column => {
      if (!column.dataType && detectedTypes[column.field]) {
        column.dataType = detectedTypes[column.field];
      }
    });
  }
  
  /**
   * Render the table
   */
  render() {
    this.renderer.render();
    this.eventManager.attachEvents();
  }
  
  /**
   * Refresh the table with current data and filters
   */
  refresh() {
    // Apply all filters to get updated filtered data
    this.filteredData = this.filterManager.applyFilters(this.data);
    
    // Apply sorting if active
    this._applySorting();
    
    // Reset pagination to first page when data changes
    if (this.paginationOptions.enabled) {
      this.paginationOptions.currentPage = 1;
    }
    
    // Reset endless scrolling when data changes
    if (this.endlessScrollingOptions.enabled) {
      this.endlessScrollingOptions.loadedItems = this.endlessScrollingOptions.itemsPerLoad;
    }
    
    // Re-render with new data
    this.renderer.update();
    
    // Trigger refresh event
    this.eventManager.trigger('refresh', { 
      filteredData: this.filteredData,
      totalRows: this.filteredData.length,
      originalRows: this.data.length
    });
  }
  
  /**
   * Apply sorting to the filtered data
   * @private
   */
  _applySorting() {
    const headers = this.renderer.elements.thead.querySelectorAll('th');
    let sortField = null;
    let sortDirection = null;
    
    // Find the active sort column
    headers.forEach(header => {
      const direction = header.getAttribute('data-sort-direction');
      if (direction && direction !== 'none') {
        sortField = header.getAttribute('data-field');
        sortDirection = direction;
      }
    });
    
    // If no sorting is active, return
    if (!sortField || !sortDirection) {
      return;
    }
    
    // Get the column configuration
    const column = this.columns.find(col => col.field === sortField);
    if (!column) {
      return;
    }
    
    // Sort the data
    this.filteredData.sort((a, b) => {
      let valueA = a[sortField];
      let valueB = b[sortField];
      
      // Handle null/undefined values
      if (valueA === null || valueA === undefined) {
        return sortDirection === 'asc' ? -1 : 1;
      }
      if (valueB === null || valueB === undefined) {
        return sortDirection === 'asc' ? 1 : -1;
      }
      
      // Sort based on data type
      const dataType = column.dataType || typeof valueA;
      
      switch (dataType) {
        case 'number':
          valueA = Number(valueA);
          valueB = Number(valueB);
          break;
          
        case 'date':
          valueA = new Date(valueA).getTime();
          valueB = new Date(valueB).getTime();
          break;
          
        case 'boolean':
          valueA = Boolean(valueA);
          valueB = Boolean(valueB);
          break;
          
        default:
          valueA = String(valueA).toLowerCase();
          valueB = String(valueB).toLowerCase();
          break;
      }
      
      // Compare values
      if (valueA < valueB) {
        return sortDirection === 'asc' ? -1 : 1;
      }
      if (valueA > valueB) {
        return sortDirection === 'asc' ? 1 : -1;
      }
      return 0;
    });
  }
  
  /**
   * Get the data to display based on pagination or endless scrolling settings
   * @returns {Array} Data to display
   */
  getDisplayData() {
    if (this.paginationOptions.enabled) {
      // Calculate pagination slice
      const startIndex = (this.paginationOptions.currentPage - 1) * this.paginationOptions.pageSize;
      const endIndex = startIndex + this.paginationOptions.pageSize;
      return this.filteredData.slice(startIndex, endIndex);
    } else if (this.endlessScrollingOptions.enabled) {
      // Return data up to the currently loaded items
      return this.filteredData.slice(0, this.endlessScrollingOptions.loadedItems);
    } else {
      // Return all filtered data if no pagination or endless scrolling
      return this.filteredData;
    }
  }
  
  /**
   * Set up endless scrolling event listeners
   * @private
   */
  _setupEndlessScrolling() {
    if (!this.endlessScrollingOptions.enabled) return;
    
    // Debounce scroll handler for better performance
    const scrollHandler = debounce(() => {
      if (!this.endlessScrollingOptions.enabled) return;
      
      const tableBottom = this.renderer.elements.table.getBoundingClientRect().bottom;
      const viewportBottom = window.innerHeight;
      
      // Check if we're close to the bottom of the table
      if (tableBottom - viewportBottom < this.endlessScrollingOptions.loadMoreThreshold) {
        // Check if we have more items to load
        if (this.endlessScrollingOptions.loadedItems < this.filteredData.length) {
          // Load more items
          this.endlessScrollingOptions.loadedItems += this.endlessScrollingOptions.itemsPerLoad;
          
          // Cap at the total number of items
          if (this.endlessScrollingOptions.loadedItems > this.filteredData.length) {
            this.endlessScrollingOptions.loadedItems = this.filteredData.length;
          }
          
          // Update the table
          this.renderer.update();
          
          // Trigger load more event
          this.eventManager.trigger('loadMore', {
            loadedItems: this.endlessScrollingOptions.loadedItems,
            totalItems: this.filteredData.length
          });
        }
      }
    }, 100);
    
    // Add scroll event listener
    window.addEventListener('scroll', scrollHandler);
    
    // Store reference to remove later
    this._scrollHandler = scrollHandler;
  }
  
  /**
   * Change the current page
   * @param {number} page - Page number to change to
   */
  goToPage(page) {
    if (!this.paginationOptions.enabled) return;
    
    const totalPages = Math.ceil(this.filteredData.length / this.paginationOptions.pageSize);
    
    // Validate page number
    if (page < 1) {
      page = 1;
    } else if (page > totalPages) {
      page = totalPages;
    }
    
    // Update current page
    this.paginationOptions.currentPage = page;
    
    // Update the table
    this.renderer.update();
    
    // Trigger page change event
    this.eventManager.trigger('pageChange', {
      currentPage: page,
      totalPages: totalPages,
      pageSize: this.paginationOptions.pageSize
    });
  }
  
  /**
   * Change the page size
   * @param {number} pageSize - New page size
   */
  changePageSize(pageSize) {
    if (!this.paginationOptions.enabled) return;
    
    // Validate page size
    if (!this.paginationOptions.pageSizeOptions.includes(pageSize)) {
      console.warn(`Invalid page size: ${pageSize}. Using default.`);
      pageSize = this.paginationOptions.pageSizeOptions[0];
    }
    
    // Calculate current position to maintain approximate scroll position
    const currentPosition = (this.paginationOptions.currentPage - 1) * this.paginationOptions.pageSize;
    
    // Update page size
    this.paginationOptions.pageSize = pageSize;
    
    // Calculate new page number to maintain approximate position
    const newPage = Math.floor(currentPosition / pageSize) + 1;
    this.paginationOptions.currentPage = newPage;
    
    // Update the table
    this.renderer.update();
    
    // Trigger page size change event
    this.eventManager.trigger('pageSizeChange', {
      pageSize: pageSize,
      currentPage: newPage,
      totalPages: Math.ceil(this.filteredData.length / pageSize)
    });
  }
  
  /**
   * Enable or disable pagination
   * @param {boolean} enabled - Whether pagination should be enabled
   * @param {Object} options - Pagination options
   */
  setPagination(enabled, options = {}) {
    // Update pagination settings
    this.paginationOptions.enabled = enabled;
    
    if (options.pageSize) {
      this.paginationOptions.pageSize = options.pageSize;
    }
    
    if (options.pageSizeOptions) {
      this.paginationOptions.pageSizeOptions = options.pageSizeOptions;
    }
    
    // Reset to first page
    this.paginationOptions.currentPage = 1;
    
    // Disable endless scrolling if pagination is enabled
    if (enabled) {
      this.endlessScrollingOptions.enabled = false;
      
      // Remove scroll handler if it exists
      if (this._scrollHandler) {
        window.removeEventListener('scroll', this._scrollHandler);
      }
    }
    
    // Re-render the table
    this.render();
  }
  
  /**
   * Enable or disable endless scrolling
   * @param {boolean} enabled - Whether endless scrolling should be enabled
   * @param {Object} options - Endless scrolling options
   */
  setEndlessScrolling(enabled, options = {}) {
    // Update endless scrolling settings
    this.endlessScrollingOptions.enabled = enabled;
    
    if (options.itemsPerLoad) {
      this.endlessScrollingOptions.itemsPerLoad = options.itemsPerLoad;
    }
    
    if (options.loadMoreThreshold) {
      this.endlessScrollingOptions.loadMoreThreshold = options.loadMoreThreshold;
    }
    
    // Reset loaded items
    this.endlessScrollingOptions.loadedItems = this.endlessScrollingOptions.itemsPerLoad;
    
    // Disable pagination if endless scrolling is enabled
    if (enabled) {
      this.paginationOptions.enabled = false;
      
      // Set up scroll handler
      this._setupEndlessScrolling();
    } else {
      // Remove scroll handler if it exists
      if (this._scrollHandler) {
        window.removeEventListener('scroll', this._scrollHandler);
      }
    }
    
    // Re-render the table
    this.render();
  }
  
  /**
   * Set the display mode (default, pagination, or endless scrolling)
   * @param {string} mode - Display mode ('default', 'pagination', or 'endlessScrolling')
   * @param {Object} options - Options for the selected mode
   */
  setDisplayMode(mode, options = {}) {
    switch (mode) {
      case 'pagination':
        this.setPagination(true, options);
        break;
        
      case 'endlessScrolling':
        this.setEndlessScrolling(true, options);
        break;
        
      case 'default':
      default:
        // Disable both pagination and endless scrolling
        this.paginationOptions.enabled = false;
        this.endlessScrollingOptions.enabled = false;
        
        // Remove scroll handler if it exists
        if (this._scrollHandler) {
          window.removeEventListener('scroll', this._scrollHandler);
        }
        
        // Re-render the table
        this.render();
        break;
    }
  }
  
  /**
   * Add a filter to the table
   * @param {Object} filterConfig - Filter configuration
   */
  addFilter(filterConfig) {
    this.filterManager.addFilter(filterConfig);
    this._debouncedRefresh();
  }
  
  /**
   * Remove a filter from the table
   * @param {string} column - Column field to remove filter from
   */
  removeFilter(column) {
    this.filterManager.removeFilter(column);
    this._debouncedRefresh();
  }
  
  /**
   * Clear all filters from the table
   */
  clearFilters() {
    this.filterManager.clearFilters();
    this._debouncedRefresh();
  }
  
  /**
   * Add a filter group with multiple filters and logical operator
   * @param {Object} groupConfig - Filter group configuration
   */
  addFilterGroup(groupConfig) {
    this.filterManager.addFilterGroup(groupConfig);
    this._debouncedRefresh();
  }
  
  /**
   * Get the current set of active filters
   * @returns {Object} Current filter configuration
   */
  getCurrentFilters() {
    return this.filterManager.getCurrentFilters();
  }
  
  /**
   * Apply a filter configuration
   * @param {Object} filters - Filter configuration to apply
   */
  applyFilters(filters) {
    this.filterManager.setFilters(filters);
    this._debouncedRefresh();
  }
  
  /**
   * Update the table data
   * @param {Array} data - New data array
   */
  setData(data) {
    if (!Array.isArray(data)) {
      throw new Error('Data must be an array');
    }
    
    this.data = [...data];
    this.originalData = [...data];
    
    // Re-detect column types if needed
    if (data.length > 0 && this.columns.some(col => !col.dataType)) {
      this._autoDetectColumnTypes();
    }
    
    this._debouncedRefresh();
  }
  
  /**
   * Get the current table data (after filtering)
   * @returns {Array} Current filtered data
   */
  getData() {
    return [...this.filteredData];
  }
  
  /**
   * Get the original unfiltered table data
   * @returns {Array} Original unfiltered data
   */
  getOriginalData() {
    return [...this.originalData];
  }
  
  /**
   * Set table columns configuration
   * @param {Array} columns - Column configuration array
   */
  setColumns(columns) {
    if (!Array.isArray(columns)) {
      throw new Error('Columns must be an array');
    }
    
    this.columns = [...columns];
    
    // Re-detect column types if needed
    if (this.data.length > 0) {
      this._autoDetectColumnTypes();
    }
    
    // Re-render with new columns
    this.render();
  }
  
  /**
   * Get current column configuration
   * @returns {Array} Current column configuration
   */
  getColumns() {
    return [...this.columns];
  }
  
  /**
   * Destroy the table instance and clean up resources
   */
  destroy() {
    this.eventManager.detachEvents();
    this.renderer.clear();
    this.filterManager.clearFilters();
    
    // Remove scroll handler if it exists
    if (this._scrollHandler) {
      window.removeEventListener('scroll', this._scrollHandler);
    }
    
    // Clear references
    this.data = null;
    this.originalData = null;
    this.filteredData = null;
    this.columns = null;
    this.options = null;
  }
}

export default Table;
