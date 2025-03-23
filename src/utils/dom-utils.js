/**
 * DOM utilities for FilterTable
 * @module utils/dom-utils
 */

/**
 * Create a DOM element with attributes and properties
 * @param {string} tagName - Tag name of the element to create
 * @param {Object} [attributes] - Attributes to set on the element
 * @returns {HTMLElement} The created element
 */
export function createDomElement(tagName, attributes = {}) {
  const element = document.createElement(tagName);
  
  // Set attributes
  Object.entries(attributes).forEach(([key, value]) => {
    if (key === 'class' || key === 'className') {
      // Handle class attribute specially
      element.className = value;
    } else if (key === 'style' && typeof value === 'object') {
      // Handle style attribute as an object
      Object.entries(value).forEach(([prop, val]) => {
        element.style[prop] = val;
      });
    } else if (key.startsWith('data-')) {
      // Handle data attributes
      element.setAttribute(key, value);
    } else if (key === 'textContent') {
      // Handle text content
      element.textContent = value;
    } else if (key === 'innerHTML') {
      // Handle inner HTML
      element.innerHTML = value;
    } else {
      // Handle other attributes
      element.setAttribute(key, value);
    }
  });
  
  return element;
}

/**
 * Remove all child nodes from an element
 * @param {HTMLElement} element - Element to clear
 */
export function removeAllChildren(element) {
  while (element.firstChild) {
    element.removeChild(element.firstChild);
  }
}

/**
 * Find the closest ancestor element matching a selector
 * @param {HTMLElement} element - Element to start from
 * @param {string} selector - CSS selector to match
 * @returns {HTMLElement|null} The closest matching ancestor, or null if none found
 */
export function closest(element, selector) {
  // Use native closest if available
  if (element.closest) {
    return element.closest(selector);
  }
  
  // Fallback implementation
  let current = element;
  
  while (current) {
    if (matches(current, selector)) {
      return current;
    }
    
    current = current.parentElement;
  }
  
  return null;
}

/**
 * Check if an element matches a selector
 * @param {HTMLElement} element - Element to check
 * @param {string} selector - CSS selector to match
 * @returns {boolean} Whether the element matches the selector
 */
export function matches(element, selector) {
  // Use native matches if available
  const matchesMethod = element.matches || 
                        element.matchesSelector || 
                        element.msMatchesSelector || 
                        element.mozMatchesSelector || 
                        element.webkitMatchesSelector || 
                        element.oMatchesSelector;
  
  if (matchesMethod) {
    return matchesMethod.call(element, selector);
  }
  
  // Fallback implementation
  const allElements = element.parentNode.querySelectorAll(selector);
  return Array.from(allElements).includes(element);
}

/**
 * Add event listeners to multiple elements
 * @param {NodeList|Array} elements - Elements to add listeners to
 * @param {string} eventType - Type of event to listen for
 * @param {Function} handler - Event handler function
 * @returns {Function} Function to remove all listeners
 */
export function addEventListeners(elements, eventType, handler) {
  const elementArray = Array.from(elements);
  
  // Add listeners to all elements
  elementArray.forEach(element => {
    element.addEventListener(eventType, handler);
  });
  
  // Return function to remove all listeners
  return () => {
    elementArray.forEach(element => {
      element.removeEventListener(eventType, handler);
    });
  };
}

/**
 * Get the position of an element relative to the document
 * @param {HTMLElement} element - Element to get position of
 * @returns {Object} Object with top and left properties
 */
export function getElementPosition(element) {
  const rect = element.getBoundingClientRect();
  const scrollLeft = window.pageXOffset || document.documentElement.scrollLeft;
  const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
  
  return {
    top: rect.top + scrollTop,
    left: rect.left + scrollLeft
  };
}

/**
 * Check if an element is visible in the viewport
 * @param {HTMLElement} element - Element to check
 * @param {boolean} [partial=true] - Whether to check for partial visibility
 * @returns {boolean} Whether the element is visible
 */
export function isElementInViewport(element, partial = true) {
  const rect = element.getBoundingClientRect();
  
  if (partial) {
    // Check if any part of the element is in the viewport
    return (
      rect.top < window.innerHeight &&
      rect.bottom > 0 &&
      rect.left < window.innerWidth &&
      rect.right > 0
    );
  } else {
    // Check if the entire element is in the viewport
    return (
      rect.top >= 0 &&
      rect.bottom <= window.innerHeight &&
      rect.left >= 0 &&
      rect.right <= window.innerWidth
    );
  }
}

/**
 * Set multiple CSS properties on an element
 * @param {HTMLElement} element - Element to set styles on
 * @param {Object} styles - Object mapping style properties to values
 */
export function setStyles(element, styles) {
  Object.entries(styles).forEach(([property, value]) => {
    element.style[property] = value;
  });
}

/**
 * Create a document fragment from an HTML string
 * @param {string} html - HTML string to parse
 * @returns {DocumentFragment} Document fragment containing the parsed HTML
 */
export function createFragmentFromHTML(html) {
  const template = document.createElement('template');
  template.innerHTML = html.trim();
  return template.content;
}

/**
 * Get or set data attributes on an element
 * @param {HTMLElement} element - Element to get/set data on
 * @param {string} key - Data attribute key (without 'data-' prefix)
 * @param {*} [value] - Value to set (if omitted, gets the current value)
 * @returns {*} Current value if getting, or the element if setting
 */
export function data(element, key, value) {
  const dataKey = `data-${key}`;
  
  if (value === undefined) {
    // Get value
    return element.getAttribute(dataKey);
  } else {
    // Set value
    element.setAttribute(dataKey, value);
    return element;
  }
}

/**
 * Toggle a class on an element
 * @param {HTMLElement} element - Element to toggle class on
 * @param {string} className - Class to toggle
 * @param {boolean} [force] - If provided, adds the class if true, removes if false
 * @returns {boolean} Whether the class is now present
 */
export function toggleClass(element, className, force) {
  if (force !== undefined) {
    if (force) {
      element.classList.add(className);
    } else {
      element.classList.remove(className);
    }
    return force;
  } else {
    return element.classList.toggle(className);
  }
}
