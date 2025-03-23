/**
 * Table renderer component for FilterTable
 * @module core/renderer
 */

import { createDomElement, removeAllChildren } from '../utils/dom-utils.js';
import { formatCurrency } from '../utils/data-types.js';

// Available themes
const AVAILABLE_THEMES = ['dark', 'blue', 'minimal', 'high-contrast'];

/**
 * Renderer class that handles DOM rendering of the table
 * @class
 */
class Renderer {
  /**
   * Create a new Renderer instance
   * @param {Table} tableInstance - The Table instance to render
   */
  constructor(tableInstance) {
    this.table = tableInstance;
    this.container = tableInstance.container;
    this.elements = {
      table: null,
      thead: null,
      tbody: null,
      filterRow: null,
      filterInputs: new Map(),
      styleLinks: new Map()
    };
    
    // Get styling options
    this.stylingOptions = this.table.options.styling || {};
    
    // Load theme if specified
    if (this.stylingOptions.theme) {
      this.loadTheme(this.stylingOptions.theme);
    }
    
    // Load custom stylesheet if specified
    if (this.stylingOptions.customStylesheet) {
      this.loadCustomStylesheet(this.stylingOptions.customStylesheet);
    }
  }
  
  /**
   * Load a theme stylesheet
   * @param {string} themeName - Name of the theme to load
   * @returns {boolean} Whether the theme was loaded successfully
   */
  loadTheme(themeName) {
    // Check if theme is valid
    if (!AVAILABLE_THEMES.includes(themeName)) {
      console.warn(`Theme "${themeName}" is not available. Available themes: ${AVAILABLE_THEMES.join(', ')}`);
      return false;
    }
    
    // Create link element for theme
    const themeLink = document.createElement('link');
    themeLink.rel = 'stylesheet';
    themeLink.href = this.stylingOptions.themesPath || `./src/styles/themes/${themeName}.css`;
    themeLink.id = `filter-table-theme-${themeName}`;
    
    // Add to document head
    document.head.appendChild(themeLink);
    
    // Store reference
    this.elements.styleLinks.set('theme', themeLink);
    
    // Store theme name for later use
    this.currentTheme = themeName;
    
    return true;
  }
  
  /**
   * Load a custom stylesheet
   * @param {string} stylesheetPath - Path to the custom stylesheet
   * @returns {boolean} Whether the stylesheet was loaded successfully
   */
  loadCustomStylesheet(stylesheetPath) {
    if (!stylesheetPath) {
      return false;
    }
    
    // Create link element for custom stylesheet
    const customLink = document.createElement('link');
    customLink.rel = 'stylesheet';
    customLink.href = stylesheetPath;
    customLink.id = 'filter-table-custom-stylesheet';
    
    // Add to document head
    document.head.appendChild(customLink);
    
    // Store reference
    this.elements.styleLinks.set('custom', customLink);
    
    return true;
  }
  
  /**
   * Change the current theme
   * @param {string} themeName - Name of the theme to switch to
   * @returns {boolean} Whether the theme was changed successfully
   */
  changeTheme(themeName) {
    // Remove current theme class if exists
    if (this.currentTheme && this.elements.table) {
      this.elements.table.classList.remove(`theme-${this.currentTheme}`);
    }
    
    // Remove current theme stylesheet if exists
    if (this.elements.styleLinks.has('theme')) {
      const oldThemeLink = this.elements.styleLinks.get('theme');
      document.head.removeChild(oldThemeLink);
      this.elements.styleLinks.delete('theme');
    }
    
    // Load new theme
    const success = this.loadTheme(themeName);
    
    // Add theme class to table
    if (success && this.elements.table) {
      this.elements.table.classList.add(`theme-${themeName}`);
    }
    
    return success;
  }

  /**
   * Render the table from scratch
   */
  render() {
    // Clear container first
    this.clear();
    
    // Create table element with appropriate classes
    let tableClasses = 'filter-table';
    if (this.currentTheme) {
      tableClasses += ` theme-${this.currentTheme}`;
    }
    
    const table = createDomElement('table', {
      class: tableClasses
    });
    
    // Create header
    const thead = this._createHeader();
    table.appendChild(thead);
    
    // Create filter row
    const filterRow = this._createFilterRow();
    thead.appendChild(filterRow);
    
    // Create body
    const tbody = this._createBody();
    table.appendChild(tbody);
    
    // Store references
    this.elements.table = table;
    this.elements.thead = thead;
    this.elements.tbody = tbody;
    this.elements.filterRow = filterRow;
    
    // Append to container
    this.container.appendChild(table);
  }
  
  /**
   * Update the table with current data
   */
  update() {
    // Only update the body to preserve filter inputs
    if (this.elements.tbody) {
      const newTbody = this._createBody();
      this.elements.table.replaceChild(newTbody, this.elements.tbody);
      this.elements.tbody = newTbody;
    }
    
    // Update filter input values to match current filters
    this._updateFilterInputs();
  }
  
  /**
   * Clear the container
   */
  clear() {
    removeAllChildren(this.container);
    this.elements.filterInputs.clear();
  }
  
  /**
   * Create the table header
   * @private
   * @returns {HTMLElement} The table header element
   */
  _createHeader() {
    const thead = createDomElement('thead');
    const headerRow = createDomElement('tr');
    
    this.table.columns.forEach(column => {
      const th = createDomElement('th', {
        'data-field': column.field,
        class: column.sortable ? 'sortable' : ''
      });
      
      th.textContent = column.title || column.field;
      
      headerRow.appendChild(th);
    });
    
    thead.appendChild(headerRow);
    return thead;
  }
  
  /**
   * Create the filter row
   * @private
   * @returns {HTMLElement} The filter row element
   */
  _createFilterRow() {
    const filterRow = createDomElement('tr', {
      class: 'filter-row'
    });
    
    this.table.columns.forEach(column => {
      const td = createDomElement('td');
      
      if (column.filterable !== false) {
        // Create filter container
        const filterContainer = createDomElement('div', {
          class: 'filter-container'
        });
        
        // Create filter icon
        const filterIcon = createDomElement('span', {
          class: 'filter-icon',
          'data-field': column.field
        });
        filterIcon.innerHTML = '&#9776;'; // Filter icon (hamburger menu)
        filterContainer.appendChild(filterIcon);
        
        // Create filter dropdown
        const filterDropdown = createDomElement('div', {
          class: 'filter-dropdown',
          'data-field': column.field
        });
        
        // Create filter input
        const filterInput = this._createFilterInput(column);
        filterDropdown.appendChild(filterInput);
        
        // Add advanced filter options based on column type
        this._addAdvancedFilterOptions(filterDropdown, column);
        
        // Add dropdown to container
        filterContainer.appendChild(filterDropdown);
        
        // Store references
        this.elements.filterInputs.set(column.field, filterInput);
        
        // Add to cell
        td.appendChild(filterContainer);
      }
      
      filterRow.appendChild(td);
    });
    
    return filterRow;
  }
  
  /**
   * Add advanced filter options to dropdown
   * @private
   * @param {HTMLElement} dropdown - Dropdown element
   * @param {Object} column - Column configuration
   */
  _addAdvancedFilterOptions(dropdown, column) {
    const dataType = column.dataType || 'string';
    const optionsContainer = createDomElement('div', {
      class: 'filter-options'
    });
    
    // Add filter type options based on data type
    switch (dataType) {
      case 'string':
        this._addFilterOption(optionsContainer, column, 'contains', 'Contains');
        this._addFilterOption(optionsContainer, column, 'equals', 'Equals');
        this._addFilterOption(optionsContainer, column, 'startsWith', 'Starts With');
        this._addFilterOption(optionsContainer, column, 'endsWith', 'Ends With');
        this._addFilterOption(optionsContainer, column, 'fuzzy', 'Fuzzy Search');
        this._addFilterOption(optionsContainer, column, 'regex', 'Regex');
        break;
        
      case 'number':
        this._addFilterOption(optionsContainer, column, 'equals', 'Equals');
        this._addFilterOption(optionsContainer, column, 'range', 'Between');
        this._addFilterOption(optionsContainer, column, 'greaterThan', 'Greater Than');
        this._addFilterOption(optionsContainer, column, 'lessThan', 'Less Than');
        break;
        
      case 'date':
        this._addFilterOption(optionsContainer, column, 'equals', 'On Date');
        this._addFilterOption(optionsContainer, column, 'dateRange', 'Between Dates');
        this._addFilterOption(optionsContainer, column, 'date', 'Before/After');
        break;
        
      case 'boolean':
        // Boolean already has simple options in the select
        break;
    }
    
    dropdown.appendChild(optionsContainer);
  }
  
  /**
   * Add a filter option to the options container
   * @private
   * @param {HTMLElement} container - Options container
   * @param {Object} column - Column configuration
   * @param {string} filterType - Filter type
   * @param {string} label - Option label
   */
  _addFilterOption(container, column, filterType, label) {
    const option = createDomElement('div', {
      class: 'filter-option',
      'data-field': column.field,
      'data-filter-type': filterType
    });
    option.textContent = label;
    container.appendChild(option);
  }
  
  /**
   * Create a filter input for a column
   * @private
   * @param {Object} column - Column configuration
   * @returns {HTMLElement} The filter input element
   */
  _createFilterInput(column) {
    const dataType = column.dataType || 'string';
    const filterType = column.filterType || dataType;
    
    let input;
    
    switch (filterType) {
      case 'boolean':
        input = createDomElement('select', {
          'data-field': column.field,
          class: 'filter-input filter-select'
        });
        
        const options = [
          { value: '', text: 'All' },
          { value: 'true', text: 'Yes' },
          { value: 'false', text: 'No' }
        ];
        
        options.forEach(option => {
          const optionEl = createDomElement('option', {
            value: option.value
          });
          optionEl.textContent = option.text;
          input.appendChild(optionEl);
        });
        break;
        
      case 'date':
        input = createDomElement('input', {
          type: 'date',
          'data-field': column.field,
          class: 'filter-input filter-date'
        });
        break;
        
      case 'number':
        // For numbers, we create a container with two inputs for range
        const container = createDomElement('div', {
          class: 'filter-number-container'
        });
        
        const minInput = createDomElement('input', {
          type: 'number',
          'data-field': column.field,
          'data-range-type': 'min',
          class: 'filter-input filter-number',
          placeholder: 'Min'
        });
        
        const maxInput = createDomElement('input', {
          type: 'number',
          'data-field': column.field,
          'data-range-type': 'max',
          class: 'filter-input filter-number',
          placeholder: 'Max'
        });
        
        container.appendChild(minInput);
        container.appendChild(maxInput);
        
        // Store both inputs in the map
        this.elements.filterInputs.set(`${column.field}-min`, minInput);
        this.elements.filterInputs.set(`${column.field}-max`, maxInput);
        
        input = container;
        break;
        
      case 'select':
        input = createDomElement('select', {
          'data-field': column.field,
          class: 'filter-input filter-select'
        });
        
        // Add empty option
        const emptyOption = createDomElement('option', {
          value: ''
        });
        emptyOption.textContent = 'All';
        input.appendChild(emptyOption);
        
        // Add options based on unique values in the data
        const uniqueValues = new Set();
        this.table.data.forEach(row => {
          if (row[column.field] !== undefined && row[column.field] !== null) {
            uniqueValues.add(row[column.field]);
          }
        });
        
        Array.from(uniqueValues).sort().forEach(value => {
          const option = createDomElement('option', {
            value: value
          });
          option.textContent = value;
          input.appendChild(option);
        });
        break;
        
      case 'string':
      default:
        input = createDomElement('input', {
          type: 'text',
          'data-field': column.field,
          class: 'filter-input filter-text',
          placeholder: `Filter ${column.title || column.field}...`
        });
        break;
    }
    
    return input;
  }
  
  /**
   * Update filter input values to match current filters
   * @private
   */
  _updateFilterInputs() {
    const currentFilters = this.table.getCurrentFilters();
    
    // Update each filter input
    this.elements.filterInputs.forEach((input, key) => {
      // Handle range inputs (number)
      if (key.includes('-min') || key.includes('-max')) {
        const [field, rangeType] = key.split('-');
        const filter = currentFilters.find(f => f.column === field && f.type === 'range');
        
        if (filter) {
          if (rangeType === 'min' && filter.min !== undefined) {
            input.value = filter.min;
          } else if (rangeType === 'max' && filter.max !== undefined) {
            input.value = filter.max;
          }
        } else {
          input.value = '';
        }
      } else {
        // Handle regular inputs
        const filter = currentFilters.find(f => f.column === key);
        
        if (filter && filter.value !== undefined) {
          input.value = filter.value;
        } else {
          input.value = '';
        }
      }
    });
  }
  
  /**
   * Create the table body
   * @private
   * @returns {HTMLElement} The table body element
   */
  _createBody() {
    const tbody = createDomElement('tbody');
    const data = this.table.filteredData;
    
    if (data.length === 0) {
      const emptyRow = createDomElement('tr', {
        class: 'empty-row'
      });
      
      const emptyCell = createDomElement('td', {
        colspan: this.table.columns.length
      });
      
      emptyCell.textContent = 'No data to display';
      emptyRow.appendChild(emptyCell);
      tbody.appendChild(emptyRow);
    } else {
      data.forEach((row, rowIndex) => {
        const tr = createDomElement('tr', {
          'data-row-index': rowIndex
        });
        
        // Add row-level link if configured
        if (this.table.options.rowLink) {
          const rowLink = typeof this.table.options.rowLink === 'function'
            ? this.table.options.rowLink(row)
            : this.table.options.rowLink.replace('{id}', encodeURIComponent(row.id));
          
          tr.dataset.href = rowLink;
          tr.style.cursor = 'pointer';
          
          // Add click event listener to navigate to the link
          tr.addEventListener('click', (event) => {
            // Only navigate if the click wasn't on a link inside the row
            if (event.target.tagName !== 'A') {
              window.location.href = rowLink;
            }
          });
        }
        
        this.table.columns.forEach(column => {
          const td = createDomElement('td', {
            'data-field': column.field
          });
          
          // Format cell content based on column type
          let cellContent = row[column.field];
          
          if (column.formatter) {
            // Use custom formatter if provided
            cellContent = column.formatter(cellContent, row, column);
          } else if (column.dataType === 'date' && cellContent) {
            // Format date
            try {
              const date = new Date(cellContent);
              cellContent = date.toLocaleDateString();
            } catch (e) {
              // Keep original content if date parsing fails
            }
          } else if (column.dataType === 'boolean') {
            // Format boolean
            cellContent = cellContent ? 'Yes' : 'No';
          } else if (column.dataType === 'currency' && cellContent !== null && cellContent !== undefined) {
            // Format currency
            try {
              cellContent = formatCurrency(cellContent, column.countryCode || 'US');
            } catch (e) {
              console.error('Error formatting currency:', e);
              // Keep original content if currency formatting fails
            }
          }
          
          // Handle null/undefined values
          if (cellContent === undefined || cellContent === null) {
            cellContent = '';
          }
          
          // Check if the column has a link configuration
          if (column.link) {
            const link = createDomElement('a', {
              href: typeof column.link === 'function' 
                ? column.link(cellContent, row, column) 
                : column.link.replace('{value}', encodeURIComponent(cellContent))
            });
            
            link.textContent = cellContent;
            td.appendChild(link);
          } else {
            td.textContent = cellContent;
          }
          tr.appendChild(td);
        });
        
        tbody.appendChild(tr);
      });
    }
    
    return tbody;
  }
}

export default Renderer;
