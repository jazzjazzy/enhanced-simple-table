# FilterTable Styling Guide

This guide explains how to customize the appearance of FilterTable using themes and custom stylesheets.

## Table of Contents

1. [Using Built-in Themes](#using-built-in-themes)
2. [Creating Custom Stylesheets](#creating-custom-stylesheets)
3. [CSS Class Reference](#css-class-reference)
4. [Theme Development Guidelines](#theme-development-guidelines)
5. [Examples](#examples)

## Using Built-in Themes

FilterTable comes with several built-in themes that you can use to quickly change the appearance of your tables:

- **Default** - The standard light theme
- **Dark** - A dark theme with light text
- **Blue** - A light theme with blue accents
- **Minimal** - A clean, minimalist design
- **High Contrast** - An accessibility-focused theme with high contrast colors

### Applying a Theme

You can apply a theme in two ways:

#### 1. During Initialization

```javascript
const table = new FilterTable('#table-container', {
  data: data,
  columns: columns,
  styling: {
    theme: 'dark' // Use the dark theme
  }
});
```

#### 2. After Initialization

```javascript
// Switch to the blue theme
table.setTheme('blue');
```

### Getting Available Themes

To get a list of all available themes:

```javascript
const availableThemes = table.getAvailableThemes();
console.log(availableThemes); // ['dark', 'blue', 'minimal', 'high-contrast']
```

### Getting the Current Theme

To check which theme is currently applied:

```javascript
const currentTheme = table.getTheme();
console.log(currentTheme); // e.g., 'dark'
```

## Creating Custom Stylesheets

You can create your own custom stylesheet to completely customize the appearance of FilterTable.

### 1. Loading a Custom Stylesheet

You can load a custom stylesheet in two ways:

#### During Initialization

```javascript
const table = new FilterTable('#table-container', {
  data: data,
  columns: columns,
  styling: {
    customStylesheet: 'path/to/your/custom-style.css'
  }
});
```

#### After Initialization

```javascript
table.loadCustomStylesheet('path/to/your/custom-style.css');
```

### 2. Custom Stylesheet Structure

When creating a custom stylesheet, you can either:

- Override the base styles completely
- Extend the base styles with your customizations

Here's a basic template for a custom stylesheet:

```css
/* Override or extend base styles */
.filter-table {
  /* Your custom styles */
  font-family: 'Your Preferred Font', sans-serif;
  border: 1px solid #ccc;
}

/* Style the header */
.filter-table thead {
  background-color: #f0f0f0;
}

.filter-table th {
  /* Header cell styles */
}

/* Style the body */
.filter-table tbody tr {
  /* Row styles */
}

.filter-table td {
  /* Cell styles */
}

/* Style the filter inputs */
.filter-table .filter-input {
  /* Filter input styles */
}

/* And so on... */
```

## CSS Class Reference

Here's a reference of all CSS classes used in FilterTable that you can target in your custom stylesheets:

### Main Elements

- `.filter-table` - The main table element
- `.filter-table thead` - The table header
- `.filter-table tbody` - The table body
- `.filter-table th` - Header cells
- `.filter-table td` - Body cells
- `.filter-table tr` - Table rows

### Header and Sorting

- `.filter-table th.sortable` - Sortable header cells
- `.filter-table th[data-sort-direction="asc"]` - Header cell sorted in ascending order
- `.filter-table th[data-sort-direction="desc"]` - Header cell sorted in descending order

### Filtering

- `.filter-table tr.filter-row` - The row containing filter inputs
- `.filter-table .filter-container` - Container for filter elements
- `.filter-table .filter-icon` - Filter icon
- `.filter-table .filter-dropdown` - Filter dropdown menu
- `.filter-table .filter-dropdown.visible` - Visible filter dropdown
- `.filter-table .filter-options` - Container for filter options
- `.filter-table .filter-option` - Individual filter option

### Filter Inputs

- `.filter-table .filter-input` - Base class for all filter inputs
- `.filter-table .filter-text` - Text input filters
- `.filter-table .filter-number` - Number input filters
- `.filter-table .filter-date` - Date input filters
- `.filter-table .filter-select` - Select dropdown filters
- `.filter-table .filter-number-container` - Container for number range inputs

### Empty State

- `.filter-table tr.empty-row` - Row shown when no data matches filters

### Advanced Filtering

- `.filter-table-advanced-filter` - Advanced filter container
- `.filter-table-advanced-filter-header` - Header of advanced filter
- `.filter-table-advanced-filter-title` - Title of advanced filter
- `.filter-table-advanced-filter-actions` - Actions container
- `.filter-table-advanced-filter-button` - Filter action button
- `.filter-table-advanced-filter-button.primary` - Primary action button
- `.filter-table-advanced-filter-group` - Filter group container

### Filter Tags

- `.filter-table-filter-tag` - Filter tag element
- `.filter-table-filter-tag-label` - Filter tag label
- `.filter-table-filter-tag-value` - Filter tag value
- `.filter-table-filter-tag-remove` - Filter tag remove button

### Pagination

- `.filter-table-pagination` - Pagination container
- `.filter-table-pagination-info` - Pagination information
- `.filter-table-pagination-controls` - Pagination controls container
- `.filter-table-pagination-button` - Pagination button
- `.filter-table-pagination-button.active` - Active pagination button
- `.filter-table-pagination-button.disabled` - Disabled pagination button

## Theme Development Guidelines

When developing a custom theme for FilterTable, follow these guidelines for the best results:

### 1. Use Theme Classes

If you're creating a theme that can be applied alongside the base styles, use a theme class as a namespace:

```css
.filter-table.theme-your-theme-name {
  /* Your theme styles */
}

.filter-table.theme-your-theme-name th {
  /* Theme-specific header styles */
}
```

### 2. Consider All States

Make sure to style all possible states of the table:

- Default state
- Hover states
- Active/selected states
- Disabled states
- Empty states
- Loading states

### 3. Responsive Design

Ensure your theme works well on different screen sizes:

```css
@media screen and (max-width: 768px) {
  .filter-table.theme-your-theme-name {
    /* Mobile-specific styles */
  }
}
```

### 4. Accessibility

Consider accessibility when designing your theme:

- Use sufficient color contrast (at least 4.5:1 for normal text)
- Don't rely solely on color to convey information
- Ensure focus states are clearly visible
- Use appropriate font sizes (at least 16px for body text)

## Examples

### Example 1: Applying a Built-in Theme

```javascript
// Initialize with a theme
const table = new FilterTable('#table-container', {
  data: data,
  columns: columns,
  styling: {
    theme: 'dark'
  }
});

// Later, switch to a different theme
document.getElementById('theme-selector').addEventListener('change', function() {
  table.setTheme(this.value);
});
```

### Example 2: Creating a Custom Theme

```css
/* custom-theme.css */
.filter-table.theme-custom {
  font-family: 'Roboto', sans-serif;
  border: none;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
}

.filter-table.theme-custom thead {
  background-color: #6200ee;
}

.filter-table.theme-custom th {
  color: white;
  font-weight: 500;
  padding: 16px 8px;
  border-bottom: none;
}

.filter-table.theme-custom tbody tr:hover {
  background-color: #f5f0ff;
}

.filter-table.theme-custom .filter-input:focus {
  border-color: #6200ee;
  box-shadow: 0 0 0 2px rgba(98, 0, 238, 0.2);
}
```

```javascript
// Load the custom theme stylesheet
table.loadCustomStylesheet('path/to/custom-theme.css');

// Apply the custom theme
table.setTheme('custom');
```

### Example 3: Theme Switcher UI

```html
<div class="theme-switcher">
  <label for="theme-select">Table Theme:</label>
  <select id="theme-select">
    <option value="">Default</option>
    <option value="dark">Dark</option>
    <option value="blue">Blue</option>
    <option value="minimal">Minimal</option>
    <option value="high-contrast">High Contrast</option>
    <option value="custom">Custom</option>
  </select>
</div>
```

```javascript
document.getElementById('theme-select').addEventListener('change', function() {
  const selectedTheme = this.value;
  
  if (selectedTheme === 'custom') {
    // Load custom theme
    table.loadCustomStylesheet('path/to/custom-theme.css');
  }
  
  // Apply selected theme (works for both built-in and custom)
  if (selectedTheme) {
    table.setTheme(selectedTheme);
  } else {
    // Remove theme if default is selected
    table.setTheme('');
  }
});
```

By following this guide, you can fully customize the appearance of FilterTable to match your application's design system.
