/**
 * Filter type constants for FilterTable
 * @module filters/filter-types
 */

// Basic filter types
export const CONTAINS = 'contains';
export const EQUALS = 'equals';
export const STARTS_WITH = 'startsWith';
export const ENDS_WITH = 'endsWith';
export const RANGE = 'range';
export const GREATER_THAN = 'greaterThan';
export const LESS_THAN = 'lessThan';
export const DATE = 'date';
export const DATE_RANGE = 'dateRange';
export const BOOLEAN = 'boolean';
export const IN_LIST = 'inList';
export const NOT_IN_LIST = 'notInList';
export const EMPTY = 'empty';
export const NOT_EMPTY = 'notEmpty';

// Advanced filter types
export const FUZZY = 'fuzzy';
export const REGEX = 'regex';
export const MULTI_SELECT = 'multiSelect';
export const HIERARCHICAL = 'hierarchical';
export const CONTEXTUAL = 'contextual';
export const SUGGESTION = 'suggestion';
export const WORD_MATCH = 'wordMatch';
export const PHONETIC = 'phonetic';

// Filter combination types
export const AND = 'AND';
export const OR = 'OR';
export const NOT = 'NOT';
export const CROSS_COLUMN = 'crossColumn';
export const COMPLEX_GROUP = 'complexGroup';

/**
 * Get a human-readable name for a filter type
 * @param {string} filterType - Filter type constant
 * @returns {string} Human-readable name
 */
export function getFilterName(filterType) {
  const names = {
    // Basic filter types
    [CONTAINS]: 'Contains',
    [EQUALS]: 'Equals',
    [STARTS_WITH]: 'Starts With',
    [ENDS_WITH]: 'Ends With',
    [RANGE]: 'Range',
    [GREATER_THAN]: 'Greater Than',
    [LESS_THAN]: 'Less Than',
    [DATE]: 'Date',
    [DATE_RANGE]: 'Date Range',
    [BOOLEAN]: 'Boolean',
    [IN_LIST]: 'In List',
    [NOT_IN_LIST]: 'Not In List',
    [EMPTY]: 'Empty',
    [NOT_EMPTY]: 'Not Empty',
    
    // Advanced filter types
    [FUZZY]: 'Fuzzy Search',
    [REGEX]: 'Regular Expression',
    [MULTI_SELECT]: 'Multi-Select',
    [HIERARCHICAL]: 'Hierarchical',
    [CONTEXTUAL]: 'Contextual',
    [SUGGESTION]: 'Suggestion',
    [WORD_MATCH]: 'Word Match',
    [PHONETIC]: 'Phonetic',
    
    // Filter combination types
    [AND]: 'AND',
    [OR]: 'OR',
    [NOT]: 'NOT',
    [CROSS_COLUMN]: 'Cross-Column',
    [COMPLEX_GROUP]: 'Complex Group'
  };
  
  return names[filterType] || filterType;
}

/**
 * Get filter types appropriate for a data type
 * @param {string} dataType - Data type ('string', 'number', 'date', 'boolean', etc.)
 * @returns {Array} Array of appropriate filter types
 */
export function getFilterTypesForDataType(dataType) {
  switch (dataType) {
    case 'string':
      return [
        CONTAINS,
        EQUALS,
        STARTS_WITH,
        ENDS_WITH,
        FUZZY,
        REGEX,
        WORD_MATCH,
        PHONETIC,
        IN_LIST,
        NOT_IN_LIST,
        EMPTY,
        NOT_EMPTY
      ];
      
    case 'number':
      return [
        EQUALS,
        RANGE,
        GREATER_THAN,
        LESS_THAN,
        IN_LIST,
        NOT_IN_LIST,
        EMPTY,
        NOT_EMPTY
      ];
      
    case 'date':
      return [
        DATE,
        DATE_RANGE,
        EMPTY,
        NOT_EMPTY
      ];
      
    case 'boolean':
      return [
        BOOLEAN,
        EMPTY,
        NOT_EMPTY
      ];
      
    case 'array':
      return [
        CONTAINS,
        IN_LIST,
        NOT_IN_LIST,
        MULTI_SELECT,
        EMPTY,
        NOT_EMPTY
      ];
      
    default:
      return [
        CONTAINS,
        EQUALS,
        EMPTY,
        NOT_EMPTY
      ];
  }
}

/**
 * Check if a filter type is a combination type
 * @param {string} filterType - Filter type constant
 * @returns {boolean} Whether the filter type is a combination type
 */
export function isCombinationType(filterType) {
  return [AND, OR, NOT, CROSS_COLUMN, COMPLEX_GROUP].includes(filterType);
}

/**
 * Check if a filter type is an advanced type
 * @param {string} filterType - Filter type constant
 * @returns {boolean} Whether the filter type is an advanced type
 */
export function isAdvancedType(filterType) {
  return [FUZZY, REGEX, MULTI_SELECT, HIERARCHICAL, CONTEXTUAL, SUGGESTION, WORD_MATCH, PHONETIC].includes(filterType);
}

/**
 * Get the default filter type for a data type
 * @param {string} dataType - Data type ('string', 'number', 'date', 'boolean', etc.)
 * @returns {string} Default filter type
 */
export function getDefaultFilterType(dataType) {
  switch (dataType) {
    case 'string':
      return CONTAINS;
    case 'number':
      return RANGE;
    case 'date':
      return DATE;
    case 'boolean':
      return BOOLEAN;
    case 'array':
      return CONTAINS;
    default:
      return CONTAINS;
  }
}
