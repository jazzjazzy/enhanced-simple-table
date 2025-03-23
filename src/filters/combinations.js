/**
 * Filter combination utilities for FilterTable
 * @module filters/combinations
 */

/**
 * Create a combined filter function from multiple filter configurations
 * @param {Array} filters - Array of filter configurations
 * @param {string} operator - Logical operator ('AND' or 'OR')
 * @param {Object} filterFunctions - Object mapping filter types to filter functions
 * @returns {Function} Combined filter function
 */
export function createFilterCombination(filters, operator, filterFunctions) {
  if (!Array.isArray(filters) || filters.length === 0) {
    // If no filters, return a function that always returns true
    return () => true;
  }
  
  // Create an array of filter functions
  const filterFns = filters.map(filterConfig => {
    const { column, type = 'contains', ...params } = filterConfig;
    
    // Get the filter function
    const filterFn = filterFunctions[type] || filterFunctions.contains;
    
    // Return a function that applies this filter to a row
    return row => {
      const value = row[column];
      return filterFn(value, params, row);
    };
  });
  
  // Combine the filter functions based on the operator
  if (operator === 'OR') {
    // OR: Return true if any filter returns true
    return row => filterFns.some(fn => fn(row));
  } else {
    // AND (default): Return true only if all filters return true
    return row => filterFns.every(fn => fn(row));
  }
}

/**
 * Create a NOT filter that negates another filter
 * @param {Object} filterConfig - Filter configuration to negate
 * @param {Object} filterFunctions - Object mapping filter types to filter functions
 * @returns {Function} Negated filter function
 */
export function createNotFilter(filterConfig, filterFunctions) {
  const { column, type = 'contains', ...params } = filterConfig;
  
  // Get the filter function
  const filterFn = filterFunctions[type] || filterFunctions.contains;
  
  // Return a function that negates the result of the filter
  return (row) => {
    const value = row[column];
    return !filterFn(value, params, row);
  };
}

/**
 * Create a cross-column filter that applies a condition across multiple columns
 * @param {Array} columns - Array of column fields to filter on
 * @param {Object} filterConfig - Filter configuration (without column field)
 * @param {Object} filterFunctions - Object mapping filter types to filter functions
 * @returns {Function} Cross-column filter function
 */
export function createCrossColumnFilter(columns, filterConfig, filterFunctions) {
  const { type = 'contains', ...params } = filterConfig;
  
  // Get the filter function
  const filterFn = filterFunctions[type] || filterFunctions.contains;
  
  // Return a function that applies the filter to any of the specified columns
  return (row) => {
    // OR logic: Return true if any column matches
    return columns.some(column => {
      const value = row[column];
      return filterFn(value, params, row);
    });
  };
}

/**
 * Create a hierarchical filter for parent-child relationships
 * @param {string} parentColumn - Parent column field
 * @param {string} childColumn - Child column field
 * @param {Object} filterConfig - Filter configuration for the parent
 * @param {Object} filterFunctions - Object mapping filter types to filter functions
 * @returns {Function} Hierarchical filter function
 */
export function createHierarchicalFilter(parentColumn, childColumn, filterConfig, filterFunctions) {
  const { type = 'contains', ...params } = filterConfig;
  
  // Get the filter function
  const filterFn = filterFunctions[type] || filterFunctions.contains;
  
  // Return a function that applies hierarchical filtering
  return (row) => {
    const parentValue = row[parentColumn];
    const childValue = row[childColumn];
    
    // If parent matches, include this row
    if (filterFn(parentValue, params, row)) {
      return true;
    }
    
    // If this is a child row and its parent would be included, include this row
    if (childValue && row._parentId) {
      // This would require additional context about parent-child relationships
      // For now, we'll just return false
      return false;
    }
    
    return false;
  };
}

/**
 * Create a complex filter group with nested conditions
 * @param {Object} groupConfig - Filter group configuration
 * @param {Object} filterFunctions - Object mapping filter types to filter functions
 * @returns {Function} Complex filter function
 */
export function createComplexFilterGroup(groupConfig, filterFunctions) {
  const { operator = 'AND', filters = [], groups = [] } = groupConfig;
  
  // Create filter functions for individual filters
  const filterFns = filters.map(filterConfig => {
    const { column, type = 'contains', ...params } = filterConfig;
    
    // Get the filter function
    const filterFn = filterFunctions[type] || filterFunctions.contains;
    
    // Return a function that applies this filter to a row
    return row => {
      const value = row[column];
      return filterFn(value, params, row);
    };
  });
  
  // Create filter functions for nested groups
  const groupFns = groups.map(group => createComplexFilterGroup(group, filterFunctions));
  
  // Combine all filter functions
  const allFns = [...filterFns, ...groupFns];
  
  // Return a function that applies the combined filters based on the operator
  if (operator === 'OR') {
    // OR: Return true if any filter returns true
    return row => allFns.some(fn => fn(row));
  } else {
    // AND (default): Return true only if all filters return true
    return row => allFns.every(fn => fn(row));
  }
}
