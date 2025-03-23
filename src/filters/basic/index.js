/**
 * Basic filters for FilterTable
 * @module filters/basic
 */

/**
 * Contains filter - checks if a string value contains the filter value
 * @param {*} value - Cell value to check
 * @param {Object} params - Filter parameters
 * @param {string} params.value - Value to search for
 * @param {boolean} [params.caseSensitive=false] - Whether to perform case-sensitive matching
 * @returns {boolean} Whether the value passes the filter
 */
export function contains(value, params, row) {
  if (value === undefined || value === null) {
    return false;
  }
  
  const searchValue = String(value);
  const filterValue = String(params.value);
  
  if (params.caseSensitive) {
    return searchValue.includes(filterValue);
  } else {
    return searchValue.toLowerCase().includes(filterValue.toLowerCase());
  }
}

/**
 * Equals filter - checks if a value exactly matches the filter value
 * @param {*} value - Cell value to check
 * @param {Object} params - Filter parameters
 * @param {*} params.value - Value to compare with
 * @returns {boolean} Whether the value passes the filter
 */
export function equals(value, params) {
  if (value === undefined || value === null) {
    return params.value === null || params.value === undefined || params.value === '';
  }
  
  // Handle different types
  if (typeof value === 'string' && typeof params.value === 'string') {
    return value.toLowerCase() === params.value.toLowerCase();
  } else {
    return value == params.value; // Use loose equality for numeric comparisons
  }
}

/**
 * Starts with filter - checks if a string value starts with the filter value
 * @param {*} value - Cell value to check
 * @param {Object} params - Filter parameters
 * @param {string} params.value - Value to search for
 * @param {boolean} [params.caseSensitive=false] - Whether to perform case-sensitive matching
 * @returns {boolean} Whether the value passes the filter
 */
export function startsWith(value, params) {
  if (value === undefined || value === null) {
    return false;
  }
  
  const searchValue = String(value);
  const filterValue = String(params.value);
  
  if (params.caseSensitive) {
    return searchValue.startsWith(filterValue);
  } else {
    return searchValue.toLowerCase().startsWith(filterValue.toLowerCase());
  }
}

/**
 * Ends with filter - checks if a string value ends with the filter value
 * @param {*} value - Cell value to check
 * @param {Object} params - Filter parameters
 * @param {string} params.value - Value to search for
 * @param {boolean} [params.caseSensitive=false] - Whether to perform case-sensitive matching
 * @returns {boolean} Whether the value passes the filter
 */
export function endsWith(value, params) {
  if (value === undefined || value === null) {
    return false;
  }
  
  const searchValue = String(value);
  const filterValue = String(params.value);
  
  if (params.caseSensitive) {
    return searchValue.endsWith(filterValue);
  } else {
    return searchValue.toLowerCase().endsWith(filterValue.toLowerCase());
  }
}

/**
 * Range filter - checks if a numeric value is within a range
 * @param {*} value - Cell value to check
 * @param {Object} params - Filter parameters
 * @param {number} [params.min] - Minimum value (inclusive)
 * @param {number} [params.max] - Maximum value (inclusive)
 * @returns {boolean} Whether the value passes the filter
 */
export function range(value, params) {
  if (value === undefined || value === null) {
    return false;
  }
  
  const numValue = Number(value);
  
  if (isNaN(numValue)) {
    return false;
  }
  
  const { min, max } = params;
  
  if (min !== undefined && max !== undefined) {
    return numValue >= min && numValue <= max;
  } else if (min !== undefined) {
    return numValue >= min;
  } else if (max !== undefined) {
    return numValue <= max;
  }
  
  return true;
}

/**
 * Greater than filter - checks if a numeric value is greater than the filter value
 * @param {*} value - Cell value to check
 * @param {Object} params - Filter parameters
 * @param {number} params.value - Value to compare with
 * @returns {boolean} Whether the value passes the filter
 */
export function greaterThan(value, params) {
  if (value === undefined || value === null) {
    return false;
  }
  
  const numValue = Number(value);
  const filterValue = Number(params.value);
  
  if (isNaN(numValue) || isNaN(filterValue)) {
    return false;
  }
  
  return numValue > filterValue;
}

/**
 * Less than filter - checks if a numeric value is less than the filter value
 * @param {*} value - Cell value to check
 * @param {Object} params - Filter parameters
 * @param {number} params.value - Value to compare with
 * @returns {boolean} Whether the value passes the filter
 */
export function lessThan(value, params) {
  if (value === undefined || value === null) {
    return false;
  }
  
  const numValue = Number(value);
  const filterValue = Number(params.value);
  
  if (isNaN(numValue) || isNaN(filterValue)) {
    return false;
  }
  
  return numValue < filterValue;
}

/**
 * Date filter - checks if a date value matches the filter criteria
 * @param {*} value - Cell value to check
 * @param {Object} params - Filter parameters
 * @param {string} params.value - Date value to compare with
 * @param {string} [params.comparison='equals'] - Comparison type ('equals', 'before', 'after')
 * @returns {boolean} Whether the value passes the filter
 */
export function date(value, params) {
  if (value === undefined || value === null) {
    return false;
  }
  
  let dateValue;
  try {
    dateValue = new Date(value);
    if (isNaN(dateValue.getTime())) {
      return false;
    }
  } catch (e) {
    return false;
  }
  
  let filterDate;
  try {
    filterDate = new Date(params.value);
    if (isNaN(filterDate.getTime())) {
      return false;
    }
  } catch (e) {
    return false;
  }
  
  // Reset time components for date-only comparison
  dateValue.setHours(0, 0, 0, 0);
  filterDate.setHours(0, 0, 0, 0);
  
  const comparison = params.comparison || 'equals';
  
  switch (comparison) {
    case 'before':
      return dateValue < filterDate;
    case 'after':
      return dateValue > filterDate;
    case 'equals':
    default:
      return dateValue.getTime() === filterDate.getTime();
  }
}

/**
 * Date range filter - checks if a date value is within a range
 * @param {*} value - Cell value to check
 * @param {Object} params - Filter parameters
 * @param {string} [params.start] - Start date (inclusive)
 * @param {string} [params.end] - End date (inclusive)
 * @returns {boolean} Whether the value passes the filter
 */
export function dateRange(value, params) {
  if (value === undefined || value === null) {
    return false;
  }
  
  let dateValue;
  try {
    dateValue = new Date(value);
    if (isNaN(dateValue.getTime())) {
      return false;
    }
  } catch (e) {
    return false;
  }
  
  // Reset time components for date-only comparison
  dateValue.setHours(0, 0, 0, 0);
  
  const { start, end } = params;
  
  if (start && end) {
    const startDate = new Date(start);
    const endDate = new Date(end);
    
    startDate.setHours(0, 0, 0, 0);
    endDate.setHours(0, 0, 0, 0);
    
    return dateValue >= startDate && dateValue <= endDate;
  } else if (start) {
    const startDate = new Date(start);
    startDate.setHours(0, 0, 0, 0);
    return dateValue >= startDate;
  } else if (end) {
    const endDate = new Date(end);
    endDate.setHours(0, 0, 0, 0);
    return dateValue <= endDate;
  }
  
  return true;
}

/**
 * Boolean filter - checks if a boolean value matches the filter value
 * @param {*} value - Cell value to check
 * @param {Object} params - Filter parameters
 * @param {boolean|string} params.value - Boolean value to compare with
 * @returns {boolean} Whether the value passes the filter
 */
export function boolean(value, params, row) {
  if (value === undefined || value === null) {
    return false;
  }
  
  // First, determine what we're looking for (true or false)
  let targetBoolean;
  
  // Convert filter value to boolean
  if (typeof params.value === 'string') {
    const lowerParamValue = params.value.toLowerCase();
    if (lowerParamValue === 'true' || lowerParamValue === 'yes' || lowerParamValue === '1') {
      targetBoolean = true;
    } else if (lowerParamValue === 'false' || lowerParamValue === 'no' || lowerParamValue === '0') {
      targetBoolean = false;
    } else {
      // If it's not a recognized boolean string, use the value as is
      targetBoolean = Boolean(params.value);
    }
  } else if (typeof params.value === 'number') {
    targetBoolean = params.value !== 0;
  } else {
    // If it's already a boolean or other type, use it directly
    targetBoolean = Boolean(params.value);
  }
  
  // For cell value, we need to handle both actual booleans and string representations
  let cellBoolean;
  
  // If it's already a boolean, use it directly
  if (typeof value === 'boolean') {
    cellBoolean = value;
  } else if (typeof value === 'string') {
    const lowerValue = value.toLowerCase();
    if (lowerValue === 'true' || lowerValue === 'yes' || lowerValue === '1') {
      cellBoolean = true;
    } else if (lowerValue === 'false' || lowerValue === 'no' || lowerValue === '0') {
      cellBoolean = false;
    } else {
      cellBoolean = Boolean(value);
    }
  } else if (typeof value === 'number') {
    cellBoolean = value !== 0;
  } else {
    cellBoolean = Boolean(value);
  }
  
  // Debug logging
  console.log('Boolean filter:', { 
    cellValue: value, 
    cellBoolean: cellBoolean, 
    filterValue: params.value,
    targetBoolean: targetBoolean
  });
  
  // Compare the boolean values
  return cellBoolean === targetBoolean;
}

/**
 * In list filter - checks if a value is in a list of values
 * @param {*} value - Cell value to check
 * @param {Object} params - Filter parameters
 * @param {Array} params.values - List of values to check against
 * @returns {boolean} Whether the value passes the filter
 */
export function inList(value, params) {
  if (value === undefined || value === null) {
    return false;
  }
  
  if (!params.values || !Array.isArray(params.values)) {
    return false;
  }
  
  return params.values.some(item => {
    if (typeof value === 'string' && typeof item === 'string') {
      return value.toLowerCase() === item.toLowerCase();
    } else {
      return value == item; // Use loose equality for numeric comparisons
    }
  });
}

/**
 * Not in list filter - checks if a value is not in a list of values
 * @param {*} value - Cell value to check
 * @param {Object} params - Filter parameters
 * @param {Array} params.values - List of values to check against
 * @returns {boolean} Whether the value passes the filter
 */
export function notInList(value, params) {
  return !inList(value, params);
}

/**
 * Empty filter - checks if a value is empty
 * @param {*} value - Cell value to check
 * @returns {boolean} Whether the value passes the filter
 */
export function empty(value) {
  return value === undefined || value === null || value === '';
}

/**
 * Not empty filter - checks if a value is not empty
 * @param {*} value - Cell value to check
 * @returns {boolean} Whether the value passes the filter
 */
export function notEmpty(value) {
  return !empty(value);
}
