/**
 * FilterTable - A highly customizable table library with advanced filtering capabilities
 * @module filter-table
 */

import Table from './core/table.js';
import * as DataTypes from './utils/data-types.js';
import * as FilterTypes from './filters/filter-types.js';

/**
 * Main FilterTable class - entry point for the library
 * @class
 */
class FilterTable {
  /**
   * Create a new FilterTable instance
   * @param {string|HTMLElement} container - CSS selector or DOM element to render the table in
   * @param {Object} options - Configuration options
   * @param {Array} options.data - Array of data objects to display in the table
   * @param {Array} options.columns - Column definitions
   * @param {Object} [options.filters] - Initial filter configuration
   * @param {Object} [options.pagination] - Pagination options
   * @param {Object} [options.pagination.enabled] - Whether pagination is enabled
   * @param {number} [options.pagination.pageSize] - Number of rows per page
   * @param {number} [options.pagination.currentPage] - Current page number
   * @param {Array} [options.pagination.pageSizeOptions] - Available page size options
   * @param {Object} [options.endlessScrolling] - Endless scrolling options
   * @param {boolean} [options.endlessScrolling.enabled] - Whether endless scrolling is enabled
   * @param {number} [options.endlessScrolling.itemsPerLoad] - Number of items to load per scroll
   * @param {number} [options.endlessScrolling.loadMoreThreshold] - Threshold in pixels to trigger loading more items
   * @param {number} [options.endlessScrolling.initialItems] - Initial number of items to display
   * @param {Object} [options.sorting] - Sorting options
   * @param {Object} [options.styling] - Styling options
   */
  constructor(container, options = {}) {
    this.table = new Table(container, options);
    this._savedFilters = new Map();
  }

  /**
   * Refresh the table with current data and filters
   * @returns {FilterTable} The FilterTable instance for chaining
   */
  refresh() {
    this.table.refresh();
    return this;
  }

  /**
   * Add a filter to the table
   * @param {Object} filterConfig - Filter configuration
   * @param {string} filterConfig.column - Column field to filter on
   * @param {string} filterConfig.type - Type of filter to apply
   * @param {*} filterConfig.value - Filter value
   * @returns {FilterTable} The FilterTable instance for chaining
   */
  addFilter(filterConfig) {
    this.table.addFilter(filterConfig);
    return this;
  }

  /**
   * Remove a filter from the table
   * @param {string} column - Column field to remove filter from
   * @returns {FilterTable} The FilterTable instance for chaining
   */
  removeFilter(column) {
    this.table.removeFilter(column);
    return this;
  }

  /**
   * Clear all filters from the table
   * @returns {FilterTable} The FilterTable instance for chaining
   */
  clearFilters() {
    this.table.clearFilters();
    return this;
  }

  /**
   * Add a filter group with multiple filters and logical operator
   * @param {Object} groupConfig - Filter group configuration
   * @param {string} groupConfig.operator - Logical operator ('AND' or 'OR')
   * @param {Array} groupConfig.filters - Array of filter configurations
   * @returns {FilterTable} The FilterTable instance for chaining
   */
  addFilterGroup(groupConfig) {
    this.table.addFilterGroup(groupConfig);
    return this;
  }

  /**
   * Save the current set of filters with a name for later use
   * @param {string} name - Name to save the filters under
   * @returns {Object} The saved filter configuration
   */
  saveCurrentFilters(name) {
    const currentFilters = this.table.getCurrentFilters();
    this._savedFilters.set(name, currentFilters);
    return currentFilters;
  }

  /**
   * Apply a previously saved filter or filter configuration
   * @param {string|Object} filterNameOrConfig - Name of saved filter or filter configuration object
   * @returns {FilterTable} The FilterTable instance for chaining
   */
  applyFilters(filterNameOrConfig) {
    let filters;
    
    if (typeof filterNameOrConfig === 'string') {
      filters = this._savedFilters.get(filterNameOrConfig);
      if (!filters) {
        throw new Error(`No saved filter found with name: ${filterNameOrConfig}`);
      }
    } else {
      filters = filterNameOrConfig;
    }
    
    this.table.applyFilters(filters);
    return this;
  }

  /**
   * Get all saved filters
   * @returns {Object} Map of all saved filters
   */
  getSavedFilters() {
    return Object.fromEntries(this._savedFilters);
  }

  /**
   * Update the table data
   * @param {Array} data - New data array
   * @returns {FilterTable} The FilterTable instance for chaining
   */
  setData(data) {
    this.table.setData(data);
    return this;
  }

  /**
   * Get the current table data (after filtering)
   * @returns {Array} Current filtered data
   */
  getData() {
    return this.table.getData();
  }

  /**
   * Get the original unfiltered table data
   * @returns {Array} Original unfiltered data
   */
  getOriginalData() {
    return this.table.getOriginalData();
  }

  /**
   * Set table columns configuration
   * @param {Array} columns - Column configuration array
   * @returns {FilterTable} The FilterTable instance for chaining
   */
  setColumns(columns) {
    this.table.setColumns(columns);
    return this;
  }

  /**
   * Get current column configuration
   * @returns {Array} Current column configuration
   */
  getColumns() {
    return this.table.getColumns();
  }

  /**
   * Enable or disable pagination
   * @param {boolean} enabled - Whether pagination should be enabled
   * @param {Object} options - Pagination options
   * @param {number} [options.pageSize] - Number of rows per page
   * @param {Array} [options.pageSizeOptions] - Available page size options
   * @returns {FilterTable} The FilterTable instance for chaining
   */
  setPagination(enabled, options = {}) {
    this.table.setPagination(enabled, options);
    return this;
  }

  /**
   * Change the current page
   * @param {number} page - Page number to change to
   * @returns {FilterTable} The FilterTable instance for chaining
   */
  goToPage(page) {
    this.table.goToPage(page);
    return this;
  }

  /**
   * Change the page size
   * @param {number} pageSize - New page size
   * @returns {FilterTable} The FilterTable instance for chaining
   */
  changePageSize(pageSize) {
    this.table.changePageSize(pageSize);
    return this;
  }

  /**
   * Enable or disable endless scrolling
   * @param {boolean} enabled - Whether endless scrolling should be enabled
   * @param {Object} options - Endless scrolling options
   * @param {number} [options.itemsPerLoad] - Number of items to load per scroll
   * @param {number} [options.loadMoreThreshold] - Threshold in pixels to trigger loading more items
   * @returns {FilterTable} The FilterTable instance for chaining
   */
  setEndlessScrolling(enabled, options = {}) {
    this.table.setEndlessScrolling(enabled, options);
    return this;
  }

  /**
   * Set the display mode (default, pagination, or endless scrolling)
   * @param {string} mode - Display mode ('default', 'pagination', or 'endlessScrolling')
   * @param {Object} options - Options for the selected mode
   * @returns {FilterTable} The FilterTable instance for chaining
   */
  setDisplayMode(mode, options = {}) {
    this.table.setDisplayMode(mode, options);
    return this;
  }

  /**
   * Destroy the table instance and clean up resources
   */
  destroy() {
    this.table.destroy();
    this._savedFilters.clear();
  }

  /**
   * Add a custom event listener
   * @param {string} eventType - Type of event to listen for
   * @param {Function} callback - Callback function to execute
   * @returns {Function} Function to remove the listener
   */
  on(eventType, callback) {
    return this.table.eventManager.on(eventType, callback);
  }
  
  /**
   * Change the current theme
   * @param {string} themeName - Name of the theme to switch to
   * @returns {FilterTable} The FilterTable instance for chaining
   */
  setTheme(themeName) {
    this.table.renderer.changeTheme(themeName);
    return this;
  }
  
  /**
   * Get the current theme name
   * @returns {string|null} The current theme name or null if no theme is applied
   */
  getTheme() {
    return this.table.renderer.currentTheme || null;
  }
  
  /**
   * Load a custom stylesheet
   * @param {string} stylesheetPath - Path to the custom stylesheet
   * @returns {FilterTable} The FilterTable instance for chaining
   */
  loadCustomStylesheet(stylesheetPath) {
    this.table.renderer.loadCustomStylesheet(stylesheetPath);
    return this;
  }
  
  /**
   * Get available themes
   * @returns {string[]} Array of available theme names
   */
  getAvailableThemes() {
    return ['dark', 'blue', 'minimal', 'high-contrast'];
  }
}

// Export constants and types
FilterTable.FilterTypes = FilterTypes;
FilterTable.DataTypes = DataTypes;

// Re-export formatCurrency function for direct import
export const { formatCurrency } = DataTypes;

export default FilterTable;
