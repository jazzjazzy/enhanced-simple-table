/**
 * Data type utilities for FilterTable
 * @module utils/data-types
 */

/**
 * Data type constants
 */
export const DATA_TYPES = {
  STRING: 'string',
  NUMBER: 'number',
  BOOLEAN: 'boolean',
  DATE: 'date',
  CURRENCY: 'currency',
  ARRAY: 'array',
  OBJECT: 'object',
  NULL: 'null',
  UNDEFINED: 'undefined'
};

/**
 * Detect the data type of a value
 * @param {*} value - Value to detect type of
 * @returns {string} Data type
 */
export function detectType(value) {
  if (value === null) {
    return DATA_TYPES.NULL;
  }
  
  if (value === undefined) {
    return DATA_TYPES.UNDEFINED;
  }
  
  if (Array.isArray(value)) {
    return DATA_TYPES.ARRAY;
  }
  
  const type = typeof value;
  
  if (type === 'object') {
    // Check if it's a date
    if (value instanceof Date) {
      return DATA_TYPES.DATE;
    }
    
    return DATA_TYPES.OBJECT;
  }
  
  if (type === 'number') {
    return DATA_TYPES.NUMBER;
  }
  
  if (type === 'boolean') {
    return DATA_TYPES.BOOLEAN;
  }
  
  if (type === 'string') {
    // Check if it's a date string
    if (isDateString(value)) {
      return DATA_TYPES.DATE;
    }
    
    // Check if it's a numeric string
    if (isNumericString(value)) {
      return DATA_TYPES.NUMBER;
    }
    
    // Check if it's a boolean string
    if (isBooleanString(value)) {
      return DATA_TYPES.BOOLEAN;
    }
    
    return DATA_TYPES.STRING;
  }
  
  return DATA_TYPES.STRING;
}

/**
 * Check if a string is a valid date
 * @param {string} value - String to check
 * @returns {boolean} Whether the string is a valid date
 */
export function isDateString(value) {
  if (typeof value !== 'string') {
    return false;
  }
  
  // Check for common date formats
  const dateRegex = /^\d{4}-\d{2}-\d{2}(T\d{2}:\d{2}:\d{2}(\.\d{3})?Z?)?$/;
  if (dateRegex.test(value)) {
    return true;
  }
  
  // Try parsing as a date
  const date = new Date(value);
  return !isNaN(date.getTime());
}

/**
 * Check if a string is a numeric value
 * @param {string} value - String to check
 * @returns {boolean} Whether the string is a numeric value
 */
export function isNumericString(value) {
  if (typeof value !== 'string') {
    return false;
  }
  
  return !isNaN(value) && !isNaN(parseFloat(value));
}

/**
 * Check if a string is a boolean value
 * @param {string} value - String to check
 * @returns {boolean} Whether the string is a boolean value
 */
export function isBooleanString(value) {
  if (typeof value !== 'string') {
    return false;
  }
  
  const lowerValue = value.toLowerCase();
  return lowerValue === 'true' || lowerValue === 'false' || lowerValue === 'yes' || lowerValue === 'no';
}

/**
 * Convert a value to a specific data type
 * @param {*} value - Value to convert
 * @param {string} targetType - Target data type
 * @returns {*} Converted value
 */
export function convertType(value, targetType) {
  if (value === null || value === undefined) {
    return value;
  }
  
  switch (targetType) {
    case DATA_TYPES.STRING:
      return String(value);
      
    case DATA_TYPES.NUMBER:
      return Number(value);
      
    case DATA_TYPES.BOOLEAN:
      if (typeof value === 'string') {
        const lowerValue = value.toLowerCase();
        if (lowerValue === 'true' || lowerValue === 'yes' || lowerValue === '1') {
          return true;
        }
        if (lowerValue === 'false' || lowerValue === 'no' || lowerValue === '0') {
          return false;
        }
      }
      return Boolean(value);
      
    case DATA_TYPES.DATE:
      if (value instanceof Date) {
        return value;
      }
      return new Date(value);
      
    case DATA_TYPES.ARRAY:
      if (Array.isArray(value)) {
        return value;
      }
      return [value];
      
    default:
      return value;
  }
}

/**
 * Detect data types for all fields in a dataset
 * @param {Array} data - Array of data objects
 * @returns {Object} Object mapping field names to data types
 */
export function detectDataTypes(data) {
  if (!Array.isArray(data) || data.length === 0) {
    return {};
  }
  
  const typeMap = {};
  const typeCounts = {};
  
  // Analyze each row
  data.forEach(row => {
    if (!row || typeof row !== 'object') {
      return;
    }
    
    // Check each field
    Object.entries(row).forEach(([field, value]) => {
      const type = detectType(value);
      
      // Initialize counters if needed
      if (!typeCounts[field]) {
        typeCounts[field] = {};
      }
      
      // Increment count for this type
      typeCounts[field][type] = (typeCounts[field][type] || 0) + 1;
    });
  });
  
  // Determine the most common type for each field
  Object.entries(typeCounts).forEach(([field, counts]) => {
    let maxCount = 0;
    let maxType = DATA_TYPES.STRING;
    
    Object.entries(counts).forEach(([type, count]) => {
      if (count > maxCount) {
        maxCount = count;
        maxType = type;
      }
    });
    
    typeMap[field] = maxType;
  });
  
  return typeMap;
}

/**
 * Format a currency value based on country code
 * @param {number} value - The numeric value to format
 * @param {string} countryCode - ISO 3166-1 alpha-2 or alpha-3 country code
 * @returns {string} Formatted currency string
 */
export function formatCurrency(value, countryCode = 'US') {
  if (value === null || value === undefined) {
    return '';
  }
  
  try {
    const num = Number(value);
    if (isNaN(num)) {
      return String(value);
    }
    
    // Map of country codes to currency codes and locales
    const currencyMap = {
      // Alpha-2 codes
      'US': { currency: 'USD', locale: 'en-US' },
      'GB': { currency: 'GBP', locale: 'en-GB' },
      'CA': { currency: 'CAD', locale: 'en-CA' },
      'AU': { currency: 'AUD', locale: 'en-AU' },
      'NZ': { currency: 'NZD', locale: 'en-NZ' },
      'EU': { currency: 'EUR', locale: 'en-EU' },
      'JP': { currency: 'JPY', locale: 'ja-JP' },
      'CN': { currency: 'CNY', locale: 'zh-CN' },
      'IN': { currency: 'INR', locale: 'en-IN' },
      'BR': { currency: 'BRL', locale: 'pt-BR' },
      'RU': { currency: 'RUB', locale: 'ru-RU' },
      'ZA': { currency: 'ZAR', locale: 'en-ZA' },
      'MX': { currency: 'MXN', locale: 'es-MX' },
      'SG': { currency: 'SGD', locale: 'en-SG' },
      'CH': { currency: 'CHF', locale: 'de-CH' },
      'SE': { currency: 'SEK', locale: 'sv-SE' },
      'NO': { currency: 'NOK', locale: 'no-NO' },
      'DK': { currency: 'DKK', locale: 'da-DK' },
      'KR': { currency: 'KRW', locale: 'ko-KR' },
      
      // Alpha-3 codes
      'USA': { currency: 'USD', locale: 'en-US' },
      'GBR': { currency: 'GBP', locale: 'en-GB' },
      'CAN': { currency: 'CAD', locale: 'en-CA' },
      'AUS': { currency: 'AUD', locale: 'en-AU' },
      'NZL': { currency: 'NZD', locale: 'en-NZ' },
      'EUR': { currency: 'EUR', locale: 'en-EU' },
      'JPN': { currency: 'JPY', locale: 'ja-JP' },
      'CHN': { currency: 'CNY', locale: 'zh-CN' },
      'IND': { currency: 'INR', locale: 'en-IN' },
      'BRA': { currency: 'BRL', locale: 'pt-BR' },
      'RUS': { currency: 'RUB', locale: 'ru-RU' },
      'ZAF': { currency: 'ZAR', locale: 'en-ZA' },
      'MEX': { currency: 'MXN', locale: 'es-MX' },
      'SGP': { currency: 'SGD', locale: 'en-SG' },
      'CHE': { currency: 'CHF', locale: 'de-CH' },
      'SWE': { currency: 'SEK', locale: 'sv-SE' },
      'NOR': { currency: 'NOK', locale: 'no-NO' },
      'DNK': { currency: 'DKK', locale: 'da-DK' },
      'KOR': { currency: 'KRW', locale: 'ko-KR' }
    };
    
    // Default to USD if country code not found
    const currencyInfo = currencyMap[countryCode] || { currency: 'USD', locale: 'en-US' };
    
    return num.toLocaleString(currencyInfo.locale, {
      style: 'currency',
      currency: currencyInfo.currency,
      minimumFractionDigits: 2,
      maximumFractionDigits: 2
    });
  } catch (e) {
    console.error('Error formatting currency:', e);
    return String(value);
  }
}

/**
 * Format a value based on its data type
 * @param {*} value - Value to format
 * @param {string} dataType - Data type
 * @param {Object} options - Formatting options
 * @returns {string} Formatted value
 */
export function formatValue(value, dataType, options = {}) {
  if (value === null || value === undefined) {
    return '';
  }
  
  switch (dataType) {
    case DATA_TYPES.DATE:
      try {
        const date = value instanceof Date ? value : new Date(value);
        if (isNaN(date.getTime())) {
          return String(value);
        }
        
        if (options.dateFormat === 'relative') {
          return formatRelativeDate(date);
        }
        
        return date.toLocaleDateString(options.locale, options.dateOptions);
      } catch (e) {
        return String(value);
      }
      
    case DATA_TYPES.NUMBER:
      try {
        const num = Number(value);
        if (isNaN(num)) {
          return String(value);
        }
        
        if (options.numberFormat) {
          return num.toLocaleString(options.locale, options.numberOptions);
        }
        
        return String(num);
      } catch (e) {
        return String(value);
      }
      
    case DATA_TYPES.CURRENCY:
      return formatCurrency(value, options.countryCode);
      
    case DATA_TYPES.BOOLEAN:
      if (options.booleanFormat === 'yes-no') {
        return value ? 'Yes' : 'No';
      }
      
      if (options.booleanFormat === 'true-false') {
        return value ? 'True' : 'False';
      }
      
      if (options.booleanFormat === 'custom' && options.booleanLabels) {
        return value ? options.booleanLabels.true : options.booleanLabels.false;
      }
      
      return String(value);
      
    case DATA_TYPES.ARRAY:
      if (Array.isArray(value)) {
        return value.join(options.arraySeparator || ', ');
      }
      return String(value);
      
    default:
      return String(value);
  }
}

/**
 * Format a date as a relative time string
 * @private
 * @param {Date} date - Date to format
 * @returns {string} Relative time string
 */
function formatRelativeDate(date) {
  const now = new Date();
  const diffMs = now - date;
  const diffSec = Math.round(diffMs / 1000);
  const diffMin = Math.round(diffSec / 60);
  const diffHour = Math.round(diffMin / 60);
  const diffDay = Math.round(diffHour / 24);
  const diffMonth = Math.round(diffDay / 30);
  const diffYear = Math.round(diffDay / 365);
  
  if (diffSec < 60) {
    return 'just now';
  }
  
  if (diffMin < 60) {
    return `${diffMin} minute${diffMin === 1 ? '' : 's'} ago`;
  }
  
  if (diffHour < 24) {
    return `${diffHour} hour${diffHour === 1 ? '' : 's'} ago`;
  }
  
  if (diffDay < 30) {
    return `${diffDay} day${diffDay === 1 ? '' : 's'} ago`;
  }
  
  if (diffMonth < 12) {
    return `${diffMonth} month${diffMonth === 1 ? '' : 's'} ago`;
  }
  
  return `${diffYear} year${diffYear === 1 ? '' : 's'} ago`;
}
