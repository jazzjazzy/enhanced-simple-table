/**
 * Filter management component for FilterTable
 * @module filters/filter-manager
 */

import * as BasicFilters from './basic/index.js';
import * as AdvancedFilters from './advanced/index.js';
import { createFilterCombination } from './combinations.js';

/**
 * FilterManager class that handles filter registration and application
 * @class
 */
class FilterManager {
  /**
   * Create a new FilterManager instance
   * @param {Table} tableInstance - The Table instance to manage filters for
   */
  constructor(tableInstance) {
    this.table = tableInstance;
    this.activeFilters = [];
    this.filterGroups = [];
    
    // Register built-in filters
    this.filters = {
      ...BasicFilters,
      ...AdvancedFilters
    };
  }

  /**
   * Add a filter to the table
   * @param {Object} filterConfig - Filter configuration
   */
  addFilter(filterConfig) {
    if (!filterConfig || !filterConfig.column) {
      throw new Error('Invalid filter configuration: missing column');
    }
    
    // Remove any existing filter for this column
    this.removeFilter(filterConfig.column);
    
    // Add the new filter
    this.activeFilters.push({ ...filterConfig });
  }
  
  /**
   * Remove a filter from the table
   * @param {string} column - Column field to remove filter from
   */
  removeFilter(column) {
    this.activeFilters = this.activeFilters.filter(filter => filter.column !== column);
  }
  
  /**
   * Clear all filters from the table
   */
  clearFilters() {
    this.activeFilters = [];
    this.filterGroups = [];
  }
  
  /**
   * Add a filter group with multiple filters and logical operator
   * @param {Object} groupConfig - Filter group configuration
   */
  addFilterGroup(groupConfig) {
    if (!groupConfig || !groupConfig.filters || !Array.isArray(groupConfig.filters)) {
      throw new Error('Invalid filter group configuration: missing filters array');
    }
    
    if (!groupConfig.operator || !['AND', 'OR'].includes(groupConfig.operator.toUpperCase())) {
      throw new Error('Invalid filter group configuration: operator must be "AND" or "OR"');
    }
    
    // Add the filter group
    this.filterGroups.push({
      operator: groupConfig.operator.toUpperCase(),
      filters: [...groupConfig.filters]
    });
  }
  
  /**
   * Get the current set of active filters
   * @returns {Object} Current filter configuration
   */
  getCurrentFilters() {
    return [
      ...this.activeFilters,
      ...this.filterGroups.flatMap(group => group.filters)
    ];
  }
  
  /**
   * Set filters from a configuration object
   * @param {Object} filters - Filter configuration to apply
   */
  setFilters(filters) {
    this.clearFilters();
    
    if (!filters) return;
    
    // Handle array of filters
    if (Array.isArray(filters)) {
      filters.forEach(filter => {
        this.addFilter(filter);
      });
    } else if (filters.groups && Array.isArray(filters.groups)) {
      // Handle object with groups
      filters.groups.forEach(group => {
        this.addFilterGroup(group);
      });
      
      // Handle individual filters
      if (filters.filters && Array.isArray(filters.filters)) {
        filters.filters.forEach(filter => {
          this.addFilter(filter);
        });
      }
    }
  }
  
  /**
   * Apply all active filters to the data
   * @param {Array} data - Data to filter
   * @returns {Array} Filtered data
   */
  applyFilters(data) {
    if (!data || !Array.isArray(data)) {
      return [];
    }
    
    if (this.activeFilters.length === 0 && this.filterGroups.length === 0) {
      return [...data];
    }
    
    // Apply individual filters (combined with AND logic)
    let filteredData = this._applyIndividualFilters(data);
    
    // Apply filter groups
    filteredData = this._applyFilterGroups(filteredData);
    
    return filteredData;
  }
  
  /**
   * Apply individual filters to the data
   * @private
   * @param {Array} data - Data to filter
   * @returns {Array} Filtered data
   */
  _applyIndividualFilters(data) {
    return this.activeFilters.reduce((filteredData, filterConfig) => {
      return this._applyFilter(filteredData, filterConfig);
    }, [...data]);
  }
  
  /**
   * Apply filter groups to the data
   * @private
   * @param {Array} data - Data to filter
   * @returns {Array} Filtered data
   */
  _applyFilterGroups(data) {
    return this.filterGroups.reduce((filteredData, group) => {
      const { operator, filters } = group;
      
      if (operator === 'AND') {
        // For AND, apply each filter in sequence
        return filters.reduce((result, filterConfig) => {
          return this._applyFilter(result, filterConfig);
        }, filteredData);
      } else if (operator === 'OR') {
        // For OR, create a combined filter function
        const combinedFilter = createFilterCombination(filters, 'OR', this.filters);
        return filteredData.filter(row => combinedFilter(row));
      }
      
      return filteredData;
    }, [...data]);
  }
  
  /**
   * Apply a single filter to the data
   * @private
   * @param {Array} data - Data to filter
   * @param {Object} filterConfig - Filter configuration
   * @returns {Array} Filtered data
   */
  _applyFilter(data, filterConfig) {
    const { column, type = 'contains', ...params } = filterConfig;
    
    // Get the filter function
    const filterFn = this._getFilterFunction(type);
    
    if (!filterFn) {
      console.warn(`Unknown filter type: ${type}`);
      return data;
    }
    
    // Apply the filter
    return data.filter(row => {
      const value = row[column];
      return filterFn(value, params, row);
    });
  }
  
  /**
   * Get a filter function by type
   * @private
   * @param {string} type - Filter type
   * @returns {Function} Filter function
   */
  _getFilterFunction(type) {
    // Check if we have a built-in filter for this type
    if (this.filters[type]) {
      return this.filters[type];
    }
    
    // Default to contains filter
    return this.filters.contains;
  }
  
  /**
   * Register a custom filter
   * @param {string} type - Filter type
   * @param {Function} filterFn - Filter function
   */
  registerFilter(type, filterFn) {
    if (typeof filterFn !== 'function') {
      throw new Error('Filter must be a function');
    }
    
    this.filters[type] = filterFn;
  }
}

export default FilterManager;
