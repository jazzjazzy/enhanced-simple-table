/**
 * Event management component for FilterTable
 * @module core/events
 */

import { debounce } from '../utils/performance.js';

/**
 * EventManager class that handles event binding and triggering
 * @class
 */
class EventManager {
  /**
   * Create a new EventManager instance
   * @param {Table} tableInstance - The Table instance to manage events for
   */
  constructor(tableInstance) {
    this.table = tableInstance;
    this.listeners = new Map();
    this.boundHandlers = new Map();
    this.customEventListeners = new Map();
    
    // Create debounced filter handler
    this.debouncedFilterHandler = debounce(this._handleFilterChange.bind(this), 300);
  }

  /**
   * Attach all event listeners to the table
   */
  attachEvents() {
    this._attachFilterEvents();
    this._attachFilterIconEvents();
    this._attachFilterOptionEvents();
    this._attachSortEvents();
    this._attachRowEvents();
  }
  
  /**
   * Detach all event listeners from the table
   */
  detachEvents() {
    this.listeners.forEach((handler, element) => {
      const [eventType, listener] = handler;
      element.removeEventListener(eventType, listener);
    });
    
    this.listeners.clear();
    this.boundHandlers.clear();
  }
  
  /**
   * Add a custom event listener
   * @param {string} eventType - Type of event to listen for
   * @param {Function} callback - Callback function to execute
   * @returns {Function} Function to remove the listener
   */
  on(eventType, callback) {
    if (!this.customEventListeners.has(eventType)) {
      this.customEventListeners.set(eventType, new Set());
    }
    
    this.customEventListeners.get(eventType).add(callback);
    
    // Return function to remove the listener
    return () => {
      const listeners = this.customEventListeners.get(eventType);
      if (listeners) {
        listeners.delete(callback);
      }
    };
  }
  
  /**
   * Trigger a custom event
   * @param {string} eventType - Type of event to trigger
   * @param {Object} data - Data to pass to event handlers
   */
  trigger(eventType, data = {}) {
    const listeners = this.customEventListeners.get(eventType);
    
    if (listeners) {
      listeners.forEach(callback => {
        try {
          callback(data);
        } catch (error) {
          console.error(`Error in ${eventType} event handler:`, error);
        }
      });
    }
  }
  
  /**
   * Attach filter event listeners
   * @private
   */
  _attachFilterEvents() {
    const { filterInputs } = this.table.renderer.elements;
    
    filterInputs.forEach((input, key) => {
      // For number range inputs, we need to handle both min and max inputs
      if (key.includes('-min') || key.includes('-max')) {
        this._addEventListener(input, 'input', this.debouncedFilterHandler);
      } else if (input.tagName === 'SELECT') {
        this._addEventListener(input, 'change', this.debouncedFilterHandler);
      } else {
        this._addEventListener(input, 'input', this.debouncedFilterHandler);
      }
    });
  }
  
  /**
   * Attach sort event listeners
   * @private
   */
  _attachSortEvents() {
    const headerCells = this.table.renderer.elements.thead.querySelectorAll('th.sortable');
    
    headerCells.forEach(th => {
      this._addEventListener(th, 'click', this._handleSort.bind(this));
    });
  }
  
  /**
   * Attach row event listeners
   * @private
   */
  _attachRowEvents() {
    const rows = this.table.renderer.elements.tbody.querySelectorAll('tr:not(.empty-row)');
    
    rows.forEach(row => {
      this._addEventListener(row, 'click', this._handleRowClick.bind(this));
    });
  }
  
  /**
   * Add an event listener and track it for later removal
   * @private
   * @param {HTMLElement} element - Element to attach listener to
   * @param {string} eventType - Type of event to listen for
   * @param {Function} handler - Event handler function
   */
  _addEventListener(element, eventType, handler) {
    // Store the handler so we can remove it later
    this.listeners.set(element, [eventType, handler]);
    
    // Attach the event listener
    element.addEventListener(eventType, handler);
  }
  
  /**
   * Handle filter input changes
   * @private
   * @param {Event} event - Input event
   */
  _handleFilterChange(event) {
    const input = event.target;
    const field = input.getAttribute('data-field');
    
    if (!field) return;
    
    // Handle different input types
    if (input.hasAttribute('data-range-type')) {
      // Handle number range inputs
      const rangeType = input.getAttribute('data-range-type');
      const value = input.value.trim();
      
      if (value === '') {
        // If the input is empty, remove the range filter for this type
        this._updateRangeFilter(field, rangeType, undefined);
      } else {
        // Otherwise, update the range filter
        this._updateRangeFilter(field, rangeType, parseFloat(value));
      }
    } else if (input.tagName === 'SELECT') {
      // Handle select inputs
      const value = input.value;
      
      if (value === '') {
        // If "All" is selected, remove the filter
        this.table.removeFilter(field);
      } else {
        // Otherwise, add a filter with the selected value
        const filterType = input.classList.contains('filter-boolean') ? 'boolean' : 'equals';
        const filterValue = input.classList.contains('filter-boolean') ? value === 'true' : value;
        
        this.table.addFilter({
          column: field,
          type: filterType,
          value: filterValue
        });
      }
    } else {
      // Handle text inputs
      const value = input.value.trim();
      
      if (value === '') {
        // If the input is empty, remove the filter
        this.table.removeFilter(field);
      } else {
        // Otherwise, add a filter with the input value
        const filterType = input.type === 'date' ? 'date' : 'contains';
        
        this.table.addFilter({
          column: field,
          type: filterType,
          value: value
        });
      }
    }
    
    // Trigger filter change event
    this.trigger('filterChange', {
      filters: this.table.getCurrentFilters()
    });
  }
  
  /**
   * Update a range filter
   * @private
   * @param {string} field - Field to filter on
   * @param {string} rangeType - Type of range ('min' or 'max')
   * @param {number} value - Filter value
   */
  _updateRangeFilter(field, rangeType, value) {
    // Get current filters
    const currentFilters = this.table.getCurrentFilters();
    const existingFilter = currentFilters.find(f => f.column === field && f.type === 'range');
    
    if (existingFilter) {
      // Update existing range filter
      if (rangeType === 'min') {
        existingFilter.min = value;
      } else {
        existingFilter.max = value;
      }
      
      // If both min and max are undefined, remove the filter
      if (existingFilter.min === undefined && existingFilter.max === undefined) {
        this.table.removeFilter(field);
      } else {
        // Otherwise, update the filter
        this.table.addFilter(existingFilter);
      }
    } else if (value !== undefined) {
      // Create new range filter
      const filter = {
        column: field,
        type: 'range'
      };
      
      if (rangeType === 'min') {
        filter.min = value;
      } else {
        filter.max = value;
      }
      
      this.table.addFilter(filter);
    }
  }
  
  /**
   * Handle sort header click
   * @private
   * @param {Event} event - Click event
   */
  _handleSort(event) {
    const th = event.currentTarget;
    const field = th.getAttribute('data-field');
    
    if (!field) return;
    
    // Get current sort direction
    const currentDirection = th.getAttribute('data-sort-direction') || 'none';
    
    // Determine new sort direction
    let newDirection;
    if (currentDirection === 'none') {
      newDirection = 'asc';
    } else if (currentDirection === 'asc') {
      newDirection = 'desc';
    } else {
      newDirection = 'none';
    }
    
    // Update sort direction attribute
    th.setAttribute('data-sort-direction', newDirection);
    
    // Remove sort direction from other headers
    const otherHeaders = this.table.renderer.elements.thead.querySelectorAll('th:not([data-field="' + field + '"])');
    otherHeaders.forEach(header => {
      header.removeAttribute('data-sort-direction');
    });
    
    // Trigger sort event
    this.trigger('sort', {
      field,
      direction: newDirection
    });
    
    // Refresh the table to apply the sorting
    this.table.refresh();
  }
  
  /**
   * Attach filter icon event listeners
   * @private
   */
  _attachFilterIconEvents() {
    const filterIcons = this.table.renderer.elements.table.querySelectorAll('.filter-icon');
    
    filterIcons.forEach(icon => {
      this._addEventListener(icon, 'click', this._handleFilterIconClick.bind(this));
    });
  }
  
  /**
   * Attach filter option event listeners
   * @private
   */
  _attachFilterOptionEvents() {
    const filterOptions = this.table.renderer.elements.table.querySelectorAll('.filter-option');
    
    filterOptions.forEach(option => {
      this._addEventListener(option, 'click', this._handleFilterOptionClick.bind(this));
    });
  }
  
  /**
   * Handle filter icon click
   * @private
   * @param {Event} event - Click event
   */
  _handleFilterIconClick(event) {
    const icon = event.currentTarget;
    const field = icon.getAttribute('data-field');
    
    if (!field) return;
    
    // Find the dropdown for this field
    const dropdown = icon.parentElement.querySelector(`.filter-dropdown[data-field="${field}"]`);
    
    if (!dropdown) return;
    
    // Toggle dropdown visibility
    const isVisible = dropdown.classList.contains('visible');
    
    // Hide all dropdowns first
    const allDropdowns = this.table.renderer.elements.table.querySelectorAll('.filter-dropdown');
    allDropdowns.forEach(d => d.classList.remove('visible'));
    
    // Toggle this dropdown
    if (!isVisible) {
      dropdown.classList.add('visible');
    }
    
    // Stop event propagation
    event.stopPropagation();
    
    // Add a click event listener to the document to close the dropdown when clicking outside
    const closeDropdown = (e) => {
      if (!dropdown.contains(e.target) && e.target !== icon) {
        dropdown.classList.remove('visible');
        document.removeEventListener('click', closeDropdown);
      }
    };
    
    document.addEventListener('click', closeDropdown);
  }
  
  /**
   * Handle filter option click
   * @private
   * @param {Event} event - Click event
   */
  _handleFilterOptionClick(event) {
    const option = event.currentTarget;
    const field = option.getAttribute('data-field');
    const filterType = option.getAttribute('data-filter-type');
    
    if (!field || !filterType) return;
    
    // Get the filter input for this field
    const input = this.table.renderer.elements.filterInputs.get(field);
    
    if (!input) return;
    
    // Apply the selected filter type
    switch (filterType) {
      case 'contains':
      case 'equals':
      case 'startsWith':
      case 'endsWith':
        // Simple text filters - just update the filter type
        const value = input.value.trim();
        if (value) {
          this.table.addFilter({
            column: field,
            type: filterType,
            value: value
          });
        }
        break;
        
      case 'fuzzy':
        // Fuzzy search - prompt for tolerance
        const fuzzyValue = input.value.trim();
        if (fuzzyValue) {
          const tolerance = prompt('Enter fuzzy search tolerance (0-1):', '0.3');
          if (tolerance !== null) {
            this.table.addFilter({
              column: field,
              type: 'fuzzy',
              value: fuzzyValue,
              tolerance: parseFloat(tolerance)
            });
          }
        }
        break;
        
      case 'regex':
        // Regex filter - prompt for pattern and flags
        const pattern = prompt('Enter regex pattern:', input.value.trim());
        if (pattern) {
          const flags = prompt('Enter regex flags (optional):', 'i');
          this.table.addFilter({
            column: field,
            type: 'regex',
            pattern: pattern,
            flags: flags
          });
        }
        break;
        
      case 'range':
        // Range filter - already handled by the range inputs
        break;
        
      case 'greaterThan':
        // Greater than filter
        const gtValue = prompt('Enter minimum value:');
        if (gtValue !== null) {
          this.table.addFilter({
            column: field,
            type: 'greaterThan',
            value: parseFloat(gtValue)
          });
        }
        break;
        
      case 'lessThan':
        // Less than filter
        const ltValue = prompt('Enter maximum value:');
        if (ltValue !== null) {
          this.table.addFilter({
            column: field,
            type: 'lessThan',
            value: parseFloat(ltValue)
          });
        }
        break;
        
      case 'dateRange':
        // Date range filter
        const startDate = prompt('Enter start date (YYYY-MM-DD):');
        if (startDate !== null) {
          const endDate = prompt('Enter end date (YYYY-MM-DD):');
          if (endDate !== null) {
            this.table.addFilter({
              column: field,
              type: 'dateRange',
              start: startDate,
              end: endDate
            });
          }
        }
        break;
    }
    
    // Close the dropdown
    const dropdown = option.closest('.filter-dropdown');
    if (dropdown) {
      dropdown.classList.remove('visible');
    }
    
    // Trigger filter change event
    this.trigger('filterChange', {
      filters: this.table.getCurrentFilters()
    });
  }
  
  /**
   * Handle row click
   * @private
   * @param {Event} event - Click event
   */
  _handleRowClick(event) {
    const row = event.currentTarget;
    const rowIndex = parseInt(row.getAttribute('data-row-index'), 10);
    const rowData = this.table.filteredData[rowIndex];
    
    // Trigger row click event
    this.trigger('rowClick', {
      row: rowData,
      index: rowIndex,
      originalEvent: event
    });
  }
}

export default EventManager;
