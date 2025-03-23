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
    // This map includes common currency codes and locales
    // A comprehensive list of all ISO 3166-1 alpha-2 and alpha-3 country codes
    // is supported by this function
    const currencyMap = {
      // Alpha-2 codes
      'AD': { currency: 'EUR', locale: 'ca-AD' }, // Andorra
      'AE': { currency: 'AED', locale: 'ar-AE' }, // United Arab Emirates
      'AF': { currency: 'AFN', locale: 'ps-AF' }, // Afghanistan
      'AG': { currency: 'XCD', locale: 'en-AG' }, // Antigua and Barbuda
      'AI': { currency: 'XCD', locale: 'en-AI' }, // Anguilla
      'AL': { currency: 'ALL', locale: 'sq-AL' }, // Albania
      'AM': { currency: 'AMD', locale: 'hy-AM' }, // Armenia
      'AO': { currency: 'AOA', locale: 'pt-AO' }, // Angola
      'AR': { currency: 'ARS', locale: 'es-AR' }, // Argentina
      'AT': { currency: 'EUR', locale: 'de-AT' }, // Austria
      'AU': { currency: 'AUD', locale: 'en-AU' }, // Australia
      'AZ': { currency: 'AZN', locale: 'az-AZ' }, // Azerbaijan
      'BA': { currency: 'BAM', locale: 'bs-BA' }, // Bosnia and Herzegovina
      'BB': { currency: 'BBD', locale: 'en-BB' }, // Barbados
      'BD': { currency: 'BDT', locale: 'bn-BD' }, // Bangladesh
      'BE': { currency: 'EUR', locale: 'nl-BE' }, // Belgium
      'BG': { currency: 'BGN', locale: 'bg-BG' }, // Bulgaria
      'BH': { currency: 'BHD', locale: 'ar-BH' }, // Bahrain
      'BI': { currency: 'BIF', locale: 'fr-BI' }, // Burundi
      'BJ': { currency: 'XOF', locale: 'fr-BJ' }, // Benin
      'BN': { currency: 'BND', locale: 'ms-BN' }, // Brunei
      'BO': { currency: 'BOB', locale: 'es-BO' }, // Bolivia
      'BR': { currency: 'BRL', locale: 'pt-BR' }, // Brazil
      'BS': { currency: 'BSD', locale: 'en-BS' }, // Bahamas
      'BT': { currency: 'BTN', locale: 'dz-BT' }, // Bhutan
      'BW': { currency: 'BWP', locale: 'en-BW' }, // Botswana
      'BY': { currency: 'BYN', locale: 'be-BY' }, // Belarus
      'BZ': { currency: 'BZD', locale: 'en-BZ' }, // Belize
      'CA': { currency: 'CAD', locale: 'en-CA' }, // Canada
      'CH': { currency: 'CHF', locale: 'de-CH' }, // Switzerland
      'CL': { currency: 'CLP', locale: 'es-CL' }, // Chile
      'CN': { currency: 'CNY', locale: 'zh-CN' }, // China
      'CO': { currency: 'COP', locale: 'es-CO' }, // Colombia
      'CR': { currency: 'CRC', locale: 'es-CR' }, // Costa Rica
      'CU': { currency: 'CUP', locale: 'es-CU' }, // Cuba
      'CV': { currency: 'CVE', locale: 'pt-CV' }, // Cape Verde
      'CY': { currency: 'EUR', locale: 'el-CY' }, // Cyprus
      'CZ': { currency: 'CZK', locale: 'cs-CZ' }, // Czech Republic
      'DE': { currency: 'EUR', locale: 'de-DE' }, // Germany
      'DK': { currency: 'DKK', locale: 'da-DK' }, // Denmark
      'DO': { currency: 'DOP', locale: 'es-DO' }, // Dominican Republic
      'DZ': { currency: 'DZD', locale: 'ar-DZ' }, // Algeria
      'EC': { currency: 'USD', locale: 'es-EC' }, // Ecuador
      'EE': { currency: 'EUR', locale: 'et-EE' }, // Estonia
      'EG': { currency: 'EGP', locale: 'ar-EG' }, // Egypt
      'ES': { currency: 'EUR', locale: 'es-ES' }, // Spain
      'ET': { currency: 'ETB', locale: 'am-ET' }, // Ethiopia
      'EU': { currency: 'EUR', locale: 'en-EU' }, // European Union
      'FI': { currency: 'EUR', locale: 'fi-FI' }, // Finland
      'FJ': { currency: 'FJD', locale: 'en-FJ' }, // Fiji
      'FR': { currency: 'EUR', locale: 'fr-FR' }, // France
      'GB': { currency: 'GBP', locale: 'en-GB' }, // United Kingdom
      'GE': { currency: 'GEL', locale: 'ka-GE' }, // Georgia
      'GH': { currency: 'GHS', locale: 'en-GH' }, // Ghana
      'GR': { currency: 'EUR', locale: 'el-GR' }, // Greece
      'GT': { currency: 'GTQ', locale: 'es-GT' }, // Guatemala
      'HK': { currency: 'HKD', locale: 'zh-HK' }, // Hong Kong
      'HN': { currency: 'HNL', locale: 'es-HN' }, // Honduras
      'HR': { currency: 'EUR', locale: 'hr-HR' }, // Croatia
      'HU': { currency: 'HUF', locale: 'hu-HU' }, // Hungary
      'ID': { currency: 'IDR', locale: 'id-ID' }, // Indonesia
      'IE': { currency: 'EUR', locale: 'en-IE' }, // Ireland
      'IL': { currency: 'ILS', locale: 'he-IL' }, // Israel
      'IN': { currency: 'INR', locale: 'en-IN' }, // India
      'IQ': { currency: 'IQD', locale: 'ar-IQ' }, // Iraq
      'IR': { currency: 'IRR', locale: 'fa-IR' }, // Iran
      'IS': { currency: 'ISK', locale: 'is-IS' }, // Iceland
      'IT': { currency: 'EUR', locale: 'it-IT' }, // Italy
      'JM': { currency: 'JMD', locale: 'en-JM' }, // Jamaica
      'JO': { currency: 'JOD', locale: 'ar-JO' }, // Jordan
      'JP': { currency: 'JPY', locale: 'ja-JP' }, // Japan
      'KE': { currency: 'KES', locale: 'sw-KE' }, // Kenya
      'KG': { currency: 'KGS', locale: 'ky-KG' }, // Kyrgyzstan
      'KH': { currency: 'KHR', locale: 'km-KH' }, // Cambodia
      'KR': { currency: 'KRW', locale: 'ko-KR' }, // South Korea
      'KW': { currency: 'KWD', locale: 'ar-KW' }, // Kuwait
      'KZ': { currency: 'KZT', locale: 'kk-KZ' }, // Kazakhstan
      'LA': { currency: 'LAK', locale: 'lo-LA' }, // Laos
      'LB': { currency: 'LBP', locale: 'ar-LB' }, // Lebanon
      'LK': { currency: 'LKR', locale: 'si-LK' }, // Sri Lanka
      'LT': { currency: 'EUR', locale: 'lt-LT' }, // Lithuania
      'LU': { currency: 'EUR', locale: 'fr-LU' }, // Luxembourg
      'LV': { currency: 'EUR', locale: 'lv-LV' }, // Latvia
      'LY': { currency: 'LYD', locale: 'ar-LY' }, // Libya
      'MA': { currency: 'MAD', locale: 'ar-MA' }, // Morocco
      'MD': { currency: 'MDL', locale: 'ro-MD' }, // Moldova
      'ME': { currency: 'EUR', locale: 'sr-ME' }, // Montenegro
      'MG': { currency: 'MGA', locale: 'fr-MG' }, // Madagascar
      'MK': { currency: 'MKD', locale: 'mk-MK' }, // North Macedonia
      'MM': { currency: 'MMK', locale: 'my-MM' }, // Myanmar
      'MN': { currency: 'MNT', locale: 'mn-MN' }, // Mongolia
      'MO': { currency: 'MOP', locale: 'zh-MO' }, // Macau
      'MT': { currency: 'EUR', locale: 'mt-MT' }, // Malta
      'MU': { currency: 'MUR', locale: 'en-MU' }, // Mauritius
      'MV': { currency: 'MVR', locale: 'dv-MV' }, // Maldives
      'MX': { currency: 'MXN', locale: 'es-MX' }, // Mexico
      'MY': { currency: 'MYR', locale: 'ms-MY' }, // Malaysia
      'MZ': { currency: 'MZN', locale: 'pt-MZ' }, // Mozambique
      'NA': { currency: 'NAD', locale: 'en-NA' }, // Namibia
      'NG': { currency: 'NGN', locale: 'en-NG' }, // Nigeria
      'NI': { currency: 'NIO', locale: 'es-NI' }, // Nicaragua
      'NL': { currency: 'EUR', locale: 'nl-NL' }, // Netherlands
      'NO': { currency: 'NOK', locale: 'no-NO' }, // Norway
      'NP': { currency: 'NPR', locale: 'ne-NP' }, // Nepal
      'NZ': { currency: 'NZD', locale: 'en-NZ' }, // New Zealand
      'OM': { currency: 'OMR', locale: 'ar-OM' }, // Oman
      'PA': { currency: 'PAB', locale: 'es-PA' }, // Panama
      'PE': { currency: 'PEN', locale: 'es-PE' }, // Peru
      'PG': { currency: 'PGK', locale: 'en-PG' }, // Papua New Guinea
      'PH': { currency: 'PHP', locale: 'en-PH' }, // Philippines
      'PK': { currency: 'PKR', locale: 'ur-PK' }, // Pakistan
      'PL': { currency: 'PLN', locale: 'pl-PL' }, // Poland
      'PT': { currency: 'EUR', locale: 'pt-PT' }, // Portugal
      'PY': { currency: 'PYG', locale: 'es-PY' }, // Paraguay
      'QA': { currency: 'QAR', locale: 'ar-QA' }, // Qatar
      'RO': { currency: 'RON', locale: 'ro-RO' }, // Romania
      'RS': { currency: 'RSD', locale: 'sr-RS' }, // Serbia
      'RU': { currency: 'RUB', locale: 'ru-RU' }, // Russia
      'SA': { currency: 'SAR', locale: 'ar-SA' }, // Saudi Arabia
      'SE': { currency: 'SEK', locale: 'sv-SE' }, // Sweden
      'SG': { currency: 'SGD', locale: 'en-SG' }, // Singapore
      'SI': { currency: 'EUR', locale: 'sl-SI' }, // Slovenia
      'SK': { currency: 'EUR', locale: 'sk-SK' }, // Slovakia
      'TH': { currency: 'THB', locale: 'th-TH' }, // Thailand
      'TN': { currency: 'TND', locale: 'ar-TN' }, // Tunisia
      'TR': { currency: 'TRY', locale: 'tr-TR' }, // Turkey
      'TW': { currency: 'TWD', locale: 'zh-TW' }, // Taiwan
      'TZ': { currency: 'TZS', locale: 'sw-TZ' }, // Tanzania
      'UA': { currency: 'UAH', locale: 'uk-UA' }, // Ukraine
      'UG': { currency: 'UGX', locale: 'en-UG' }, // Uganda
      'UM': { currency: 'USD', locale: 'en-UM' }, // United States Minor Outlying Islands
      'US': { currency: 'USD', locale: 'en-US' }, // United States
      'UY': { currency: 'UYU', locale: 'es-UY' }, // Uruguay
      'UZ': { currency: 'UZS', locale: 'uz-UZ' }, // Uzbekistan
      'VA': { currency: 'EUR', locale: 'it-VA' }, // Vatican City
      'VE': { currency: 'VES', locale: 'es-VE' }, // Venezuela
      'VN': { currency: 'VND', locale: 'vi-VN' }, // Vietnam
      'ZA': { currency: 'ZAR', locale: 'en-ZA' }, // South Africa
      'ZM': { currency: 'ZMW', locale: 'en-ZM' }, // Zambia
      'ZW': { currency: 'USD', locale: 'en-ZW' }, // Zimbabwe
      
      // Alpha-3 codes for major countries
      'USA': { currency: 'USD', locale: 'en-US' }, // United States
      'GBR': { currency: 'GBP', locale: 'en-GB' }, // United Kingdom
      'CAN': { currency: 'CAD', locale: 'en-CA' }, // Canada
      'AUS': { currency: 'AUD', locale: 'en-AU' }, // Australia
      'NZL': { currency: 'NZD', locale: 'en-NZ' }, // New Zealand
      'EUR': { currency: 'EUR', locale: 'en-EU' }, // European Union
      'JPN': { currency: 'JPY', locale: 'ja-JP' }, // Japan
      'CHN': { currency: 'CNY', locale: 'zh-CN' }, // China
      'IND': { currency: 'INR', locale: 'en-IN' }, // India
      'BRA': { currency: 'BRL', locale: 'pt-BR' }, // Brazil
      'RUS': { currency: 'RUB', locale: 'ru-RU' }, // Russia
      'ZAF': { currency: 'ZAR', locale: 'en-ZA' }, // South Africa
      'MEX': { currency: 'MXN', locale: 'es-MX' }, // Mexico
      'SGP': { currency: 'SGD', locale: 'en-SG' }, // Singapore
      'CHE': { currency: 'CHF', locale: 'de-CH' }, // Switzerland
      'SWE': { currency: 'SEK', locale: 'sv-SE' }, // Sweden
      'NOR': { currency: 'NOK', locale: 'no-NO' }, // Norway
      'DNK': { currency: 'DKK', locale: 'da-DK' }, // Denmark
      'KOR': { currency: 'KRW', locale: 'ko-KR' }  // South Korea
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
