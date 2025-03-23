/**
 * Advanced filters for FilterTable
 * @module filters/advanced
 */

/**
 * Fuzzy search filter - checks if a string value approximately matches the filter value
 * @param {*} value - Cell value to check
 * @param {Object} params - Filter parameters
 * @param {string} params.value - Value to search for
 * @param {number} [params.tolerance=0.3] - Match tolerance (0-1, where 0 is exact match and 1 matches everything)
 * @returns {boolean} Whether the value passes the filter
 */
export function fuzzy(value, params) {
  if (value === undefined || value === null) {
    return false;
  }
  
  const searchValue = String(value).toLowerCase();
  const filterValue = String(params.value).toLowerCase();
  const tolerance = params.tolerance !== undefined ? params.tolerance : 0.3;
  
  // Empty filter value matches everything
  if (filterValue === '') {
    return true;
  }
  
  // For very short search terms, use a more lenient approach
  if (filterValue.length <= 2) {
    return searchValue.includes(filterValue);
  }
  
  // Check if the search value contains the filter value with some tolerance
  if (searchValue.includes(filterValue)) {
    return true;
  }
  
  // For longer strings, check if any part of the search value matches the filter value
  if (searchValue.length > filterValue.length) {
    // Check each possible substring of searchValue with the same length as filterValue
    for (let i = 0; i <= searchValue.length - filterValue.length; i++) {
      const substring = searchValue.substring(i, i + filterValue.length);
      const distance = levenshteinDistance(substring, filterValue);
      const normalizedDistance = distance / filterValue.length;
      
      if (normalizedDistance <= tolerance) {
        return true;
      }
    }
    
    // Also check if the filter value is a subset of words in the search value
    const searchWords = searchValue.split(/\s+/);
    const filterWords = filterValue.split(/\s+/);
    
    for (const filterWord of filterWords) {
      if (filterWord.length < 3) continue; // Skip very short words
      
      let found = false;
      for (const searchWord of searchWords) {
        if (searchWord.includes(filterWord) || 
            levenshteinDistance(searchWord, filterWord) <= Math.ceil(filterWord.length * tolerance)) {
          found = true;
          break;
        }
      }
      
      if (!found) {
        return false;
      }
    }
    
    return filterWords.length > 0;
  } else {
    // For shorter or equal length strings, compare directly
    const distance = levenshteinDistance(searchValue, filterValue);
    const maxLength = Math.max(searchValue.length, filterValue.length);
    const normalizedDistance = distance / maxLength;
    
    return normalizedDistance <= tolerance;
  }
}

/**
 * Calculate Levenshtein distance between two strings
 * @private
 * @param {string} a - First string
 * @param {string} b - Second string
 * @returns {number} Levenshtein distance
 */
function levenshteinDistance(a, b) {
  const matrix = [];
  
  // Initialize matrix
  for (let i = 0; i <= b.length; i++) {
    matrix[i] = [i];
  }
  
  for (let j = 0; j <= a.length; j++) {
    matrix[0][j] = j;
  }
  
  // Fill matrix
  for (let i = 1; i <= b.length; i++) {
    for (let j = 1; j <= a.length; j++) {
      if (b.charAt(i - 1) === a.charAt(j - 1)) {
        matrix[i][j] = matrix[i - 1][j - 1];
      } else {
        matrix[i][j] = Math.min(
          matrix[i - 1][j - 1] + 1, // Substitution
          matrix[i][j - 1] + 1,     // Insertion
          matrix[i - 1][j] + 1      // Deletion
        );
      }
    }
  }
  
  return matrix[b.length][a.length];
}

/**
 * Regular expression filter - checks if a string value matches a regular expression
 * @param {*} value - Cell value to check
 * @param {Object} params - Filter parameters
 * @param {string} params.pattern - Regular expression pattern
 * @param {string} [params.flags='i'] - Regular expression flags
 * @returns {boolean} Whether the value passes the filter
 */
export function regex(value, params) {
  if (value === undefined || value === null) {
    return false;
  }
  
  const searchValue = String(value);
  
  try {
    const flags = params.flags || 'i';
    const regex = new RegExp(params.pattern, flags);
    return regex.test(searchValue);
  } catch (e) {
    console.warn('Invalid regex pattern:', e);
    return false;
  }
}

/**
 * Multi-select filter - checks if a value is in a list of selected values
 * @param {*} value - Cell value to check
 * @param {Object} params - Filter parameters
 * @param {Array} params.values - List of selected values
 * @returns {boolean} Whether the value passes the filter
 */
export function multiSelect(value, params) {
  if (value === undefined || value === null) {
    return false;
  }
  
  if (!params.values || !Array.isArray(params.values) || params.values.length === 0) {
    return true;
  }
  
  // If the value is an array, check if any of its items match any of the selected values
  if (Array.isArray(value)) {
    return value.some(item => 
      params.values.some(selected => 
        typeof item === 'string' && typeof selected === 'string'
          ? item.toLowerCase() === selected.toLowerCase()
          : item == selected
      )
    );
  }
  
  // Otherwise, check if the value matches any of the selected values
  return params.values.some(selected => 
    typeof value === 'string' && typeof selected === 'string'
      ? value.toLowerCase() === selected.toLowerCase()
      : value == selected
  );
}

/**
 * Hierarchical filter - checks if a value or any of its ancestors match the filter
 * @param {*} value - Cell value to check
 * @param {Object} params - Filter parameters
 * @param {string} params.value - Value to search for
 * @param {Object} params.hierarchy - Hierarchy definition (mapping of values to their parents)
 * @returns {boolean} Whether the value passes the filter
 */
export function hierarchical(value, params, row) {
  if (value === undefined || value === null) {
    return false;
  }
  
  const filterValue = params.value;
  const hierarchy = params.hierarchy || {};
  
  // Direct match
  if (value === filterValue) {
    return true;
  }
  
  // Check if the value is a descendant of the filter value
  let currentValue = value;
  while (hierarchy[currentValue]) {
    currentValue = hierarchy[currentValue];
    if (currentValue === filterValue) {
      return true;
    }
  }
  
  return false;
}

/**
 * Contextual filter - applies different filter types based on the value
 * @param {*} value - Cell value to check
 * @param {Object} params - Filter parameters
 * @param {string} params.value - Value to search for
 * @param {Object} params.typeMap - Mapping of value types to filter types
 * @param {Object} params.filterParams - Additional parameters for each filter type
 * @returns {boolean} Whether the value passes the filter
 */
export function contextual(value, params, row) {
  if (value === undefined || value === null) {
    return false;
  }
  
  const typeMap = params.typeMap || {};
  const filterParams = params.filterParams || {};
  
  // Determine the type of the value
  let valueType;
  if (typeof value === 'number') {
    valueType = 'number';
  } else if (typeof value === 'boolean') {
    valueType = 'boolean';
  } else if (typeof value === 'string') {
    // Try to detect if the string is a date
    const dateValue = new Date(value);
    if (!isNaN(dateValue.getTime())) {
      valueType = 'date';
    } else {
      valueType = 'string';
    }
  } else if (Array.isArray(value)) {
    valueType = 'array';
  } else {
    valueType = 'object';
  }
  
  // Get the filter type for this value type
  const filterType = typeMap[valueType] || 'contains';
  
  // Get the filter function (this would need to be passed in from the filter manager)
  // For now, we'll just return a placeholder implementation
  switch (filterType) {
    case 'equals':
      return value == params.value;
    case 'contains':
      return String(value).toLowerCase().includes(String(params.value).toLowerCase());
    case 'range':
      if (valueType === 'number') {
        const numValue = Number(value);
        const min = filterParams.min !== undefined ? Number(filterParams.min) : -Infinity;
        const max = filterParams.max !== undefined ? Number(filterParams.max) : Infinity;
        return numValue >= min && numValue <= max;
      }
      return false;
    case 'date':
      try {
        const dateValue = new Date(value);
        const filterDate = new Date(params.value);
        return dateValue.getTime() === filterDate.getTime();
      } catch (e) {
        return false;
      }
    default:
      return false;
  }
}

/**
 * Suggestion filter - checks if a value matches any of the suggested values
 * @param {*} value - Cell value to check
 * @param {Object} params - Filter parameters
 * @param {string} params.value - Value to search for
 * @param {Array} params.suggestions - List of suggested values
 * @param {number} [params.tolerance=0.3] - Tolerance level for fuzzy matching
 * @returns {boolean} Whether the value passes the filter
 */
export function suggestion(value, params) {
  if (value === undefined || value === null) {
    return false;
  }
  
  const searchValue = String(value).toLowerCase();
  const filterValue = String(params.value).toLowerCase();
  const suggestions = params.suggestions || [];
  const tolerance = params.tolerance !== undefined ? params.tolerance : 0.3;
  
  // If the filter value is empty, match everything
  if (filterValue === '') {
    return true;
  }
  
  // Direct match with the value
  if (searchValue.includes(filterValue)) {
    return true;
  }
  
  // Check if the filter value matches any of the suggestions
  return suggestions.some(suggestion => {
    const suggestionStr = String(suggestion).toLowerCase();
    
    // Direct match with a suggestion
    if (suggestionStr.includes(filterValue)) {
      return true;
    }
    
    // Fuzzy match with a suggestion
    const distance = levenshteinDistance(suggestionStr, filterValue);
    const maxDistance = filterValue.length * tolerance;
    return distance <= maxDistance;
  });
}

/**
 * Word match filter - checks if all words in the filter value are present in the cell value
 * @param {*} value - Cell value to check
 * @param {Object} params - Filter parameters
 * @param {string} params.value - Value to search for
 * @returns {boolean} Whether the value passes the filter
 */
export function wordMatch(value, params) {
  if (value === undefined || value === null) {
    return false;
  }
  
  const searchValue = String(value).toLowerCase();
  const filterValue = String(params.value).toLowerCase();
  
  // Split the filter value into words
  const words = filterValue.split(/\s+/).filter(word => word.length > 0);
  
  // If no words, match everything
  if (words.length === 0) {
    return true;
  }
  
  // Check if all words are present in the search value
  return words.every(word => searchValue.includes(word));
}

/**
 * Phonetic filter - checks if a string value sounds like the filter value
 * @param {*} value - Cell value to check
 * @param {Object} params - Filter parameters
 * @param {string} params.value - Value to search for
 * @returns {boolean} Whether the value passes the filter
 */
export function phonetic(value, params) {
  if (value === undefined || value === null) {
    return false;
  }
  
  const searchValue = String(value).toLowerCase();
  const filterValue = String(params.value).toLowerCase();
  
  // Get phonetic codes
  const searchCode = soundex(searchValue);
  const filterCode = soundex(filterValue);
  
  return searchCode === filterCode;
}

/**
 * Calculate Soundex code for a string
 * @private
 * @param {string} s - Input string
 * @returns {string} Soundex code
 */
function soundex(s) {
  const a = s.toLowerCase().split('');
  const firstLetter = a[0];
  
  // Convert letters to numeric codes
  const codes = a.map(letter => {
    const code = 'bfpvcgjkqsxzdtlmnr'.indexOf(letter);
    if (code >= 0) {
      // Map to Soundex codes: 1 for b,f,p,v; 2 for c,g,j,k,q,s,x,z; etc.
      return Math.floor(code / 4) + 1;
    }
    return 0; // Ignore other characters
  });
  
  // Remove duplicates
  let previous = -1;
  const filtered = codes.filter((code, i) => {
    if (i === 0 || code === 0 || code !== previous) {
      previous = code;
      return true;
    }
    return false;
  });
  
  // Keep first letter and first 3 codes
  const result = firstLetter + filtered.slice(1, 4).join('');
  
  // Pad with zeros if needed
  return (result + '000').slice(0, 4);
}
