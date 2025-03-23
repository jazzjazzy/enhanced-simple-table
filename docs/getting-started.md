# Getting Started with FilterTable

FilterTable is a highly customizable table library with advanced filtering capabilities for web applications. This guide will help you get started with the basic usage of FilterTable.

## Installation

You can install FilterTable via npm:

```bash
npm install filter-table
```

Or include it directly in your HTML:

```html
<link rel="stylesheet" href="path/to/filter-table/dist/filter-table.min.css">
<script src="path/to/filter-table/dist/filter-table.min.js"></script>
```

## Basic Usage

### HTML Setup

First, create a container element for your table:

```html
<div id="table-container"></div>
```

### JavaScript Initialization

Then initialize the table with your data and column configuration:

```javascript
// If using ES modules
import FilterTable from 'filter-table';

// Sample data
const data = [
  { id: 1, name: 'John Doe', age: 30, joined: '2020-01-15', active: true },
  { id: 2, name: 'Jane Smith', age: 25, joined: '2021-03-20', active: false },
  // More data...
];

// Initialize the table
const table = new FilterTable('#table-container', {
  data: data,
  columns: [
    { field: 'id', title: 'ID', filterable: true },
    { field: 'name', title: 'Name', filterable: true },
    { field: 'age', title: 'Age', filterable: true, filterType: 'number' },
    { field: 'joined', title: 'Join Date', filterable: true, filterType: 'date' },
    { field: 'active', title: 'Active', filterable: true, filterType: 'boolean' }
  ]
});
```

## Column Configuration

Each column can be configured with the following options:

| Option | Type | Default | Description |
|--------|------|---------|-------------|
| field | string | (required) | The field name in the data objects |
| title | string | field value | The column header text |
| filterable | boolean | true | Whether the column can be filtered |
| sortable | boolean | true | Whether the column can be sorted |
| filterType | string | auto-detected | The type of filter to use ('string', 'number', 'date', 'boolean', etc.) |
| dataType | string | auto-detected | The data type of the column ('string', 'number', 'date', 'boolean', etc.) |
| formatter | function | null | A function to format the cell value for display |
| width | string | null | The width of the column (e.g., '100px', '10%') |
| className | string | null | Additional CSS class for the column |

## Filtering

### Basic Filtering

The table automatically provides filter inputs for each column based on its data type. Users can type in these inputs to filter the table.

### Programmatic Filtering

You can also add filters programmatically:

```javascript
// Add a text filter
table.addFilter({
  column: 'name',
  type: 'contains',
  value: 'John'
});

// Add a number range filter
table.addFilter({
  column: 'age',
  type: 'range',
  min: 25,
  max: 35
});

// Add a date filter
table.addFilter({
  column: 'joined',
  type: 'date',
  comparison: 'after',
  value: '2022-01-01'
});

// Add a boolean filter
table.addFilter({
  column: 'active',
  type: 'boolean',
  value: true
});
```

### Removing Filters

```javascript
// Remove a specific filter
table.removeFilter('name');

// Clear all filters
table.clearFilters();
```

## Advanced Filtering

### Filter Groups

You can create filter groups with logical operators:

```javascript
// Add a filter group with OR logic
table.addFilterGroup({
  operator: 'OR',
  filters: [
    { column: 'age', type: 'range', min: 25, max: 35 },
    { column: 'joined', type: 'date', comparison: 'after', value: '2022-01-01' }
  ]
});
```

### Fuzzy Search

```javascript
// Add a fuzzy search filter
table.addFilter({
  column: 'name',
  type: 'fuzzy',
  value: 'smth',
  tolerance: 0.3  // 0-1, where 0 is exact match and 1 matches everything
});
```

### Regular Expression Filtering

```javascript
// Add a regex filter
table.addFilter({
  column: 'name',
  type: 'regex',
  pattern: '^J.*n$',
  flags: 'i'  // Case-insensitive
});
```

### Saved Filters

```javascript
// Save current filters
const savedFilter = table.saveCurrentFilters('my-favorite-view');

// Apply saved filters later
table.applyFilters(savedFilter);

// Get all saved filters
const allSavedFilters = table.getSavedFilters();
```

## Events

You can listen for events on the table:

```javascript
// Listen for filter changes
table.on('filterChange', (data) => {
  console.log('Filters changed:', data.filters);
});

// Listen for row clicks
table.on('rowClick', (data) => {
  console.log('Row clicked:', data.row);
});

// Listen for refresh events
table.on('refresh', (data) => {
  console.log('Table refreshed:', data.filteredData.length, 'rows');
});
```

## Styling

FilterTable comes with default styling, but you can customize it by overriding the CSS classes:

```css
/* Example: Customize header background */
.filter-table thead {
  background-color: #2c3e50;
  color: white;
}

/* Example: Customize filter inputs */
.filter-table .filter-input {
  border: 2px solid #3498db;
  border-radius: 4px;
}
```

## Examples

Check out the examples directory for more usage examples:

- [Basic Example](../examples/basic-example.html)
- [Advanced Example](../examples/advanced-example.html)

## API Reference

For a complete API reference, see the [API Documentation](./api-reference.md).
