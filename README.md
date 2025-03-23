# FilterTable

A highly customizable table library with advanced filtering capabilities for web applications.

## Features

- Dynamic table generation from data arrays/objects
- Responsive design
- Customizable templates
- Theming and styling options:
  - Built-in themes (Dark, Blue, Minimal, High Contrast)
  - Custom theme support
  - CSS customization
  - Accessibility-focused design options
- Advanced filtering capabilities:
  - Text filtering (contains, starts with, ends with, exact match)
  - Numeric filtering (equals, greater than, less than, between)
  - Date filtering (on, before, after, between dates)
  - Boolean filtering (true/false, yes/no)
  - Currency formatting with country code support
  - Fuzzy search with tolerance for typos
  - Regular expression support
  - Multi-select filtering
  - Hierarchical filtering
  - Contextual filters based on column data type
- Filter combinations with AND/OR logic
- Filter groups with nested conditions
- Exclusion filters with NOT conditions
- Cross-column filters
- Filter history tracking
- Saved filters
- Filter suggestions
- Progressive disclosure interface
- Filter visualization
- Interactive links:
  - Row-level links for navigation to detail pages
  - Column-specific links for related resources
  - Dynamic URL generation
- Performance optimizations:
  - Debounced filtering
  - Virtualized rendering
  - Worker thread filtering
  - Incremental filtering

## Installation

```bash
npm install filter-table
```

## Basic Usage

```html
<div id="table-container"></div>

<script>
  // Import the library
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
</script>
```

## Advanced Filtering

```javascript
// Add a fuzzy search filter
table.addFilter({
  column: 'name',
  type: 'fuzzy',
  value: 'smith',
  tolerance: 0.3
});

// Add a filter group with OR logic
table.addFilterGroup({
  operator: 'OR',
  filters: [
    { column: 'age', type: 'range', min: 25, max: 35 },
    { column: 'joined', type: 'after', value: '2020-01-01' }
  ]
});

// Save current filters
const savedFilter = table.saveCurrentFilters('my-favorite-view');

// Apply saved filters later
table.applyFilters(savedFilter);
```

## Currency Formatting

```javascript
// Import the library and formatCurrency function
import FilterTable from 'filter-table';
import { formatCurrency } from 'filter-table/utils/data-types.js';

// Sample data with country codes
const data = [
  { id: 1, name: 'John Doe', salary: 85000, country: 'US' },
  { id: 2, name: 'Jane Smith', salary: 65000, country: 'GB' },
  // More data...
];

// Initialize the table with currency formatting
const table = new FilterTable('#table-container', {
  data: data,
  columns: [
    { field: 'id', title: 'ID' },
    { field: 'name', title: 'Name' },
    { 
      field: 'salary', 
      title: 'Salary', 
      dataType: 'currency',
      formatter: function(value, row) {
        return formatCurrency(value, row.country);
      }
    },
    { field: 'country', title: 'Country' }
  ]
});
```

For detailed currency formatting documentation, see the [Currency Formatting Guide](./docs/currency-formatting.md).

## Interactive Links

```javascript
// Import the library
import FilterTable from 'filter-table';

// Sample data
const data = [
  { id: 1, name: 'John Doe', department: 'Engineering', position: 'Software Engineer' },
  { id: 2, name: 'Jane Smith', department: 'Marketing', position: 'Product Manager' },
  // More data...
];

// Initialize the table with links
const table = new FilterTable('#table-container', {
  data: data,
  // Row-level link - makes the entire row clickable
  rowLink: 'user.html?id={id}',
  columns: [
    { field: 'id', title: 'ID' },
    { field: 'name', title: 'Name' },
    { 
      field: 'department', 
      title: 'Department',
      // Column-specific link - only the department text is a link
      link: 'department.html?name={value}'
    },
    { field: 'position', title: 'Position' }
  ]
});

// Dynamic links using functions
const tableWithDynamicLinks = new FilterTable('#table-container-2', {
  data: data,
  // Dynamic row-level link function
  rowLink: (row) => `user.html?id=${row.id}&name=${encodeURIComponent(row.name)}`,
  columns: [
    // column definitions...
    { 
      field: 'department', 
      title: 'Department',
      // Dynamic column-specific link function
      link: (value, row) => `department.html?name=${encodeURIComponent(value)}&company=acme`
    }
  ]
});
```

For detailed links documentation, see the [Links Guide](./docs/links-guide.md).

## Styling and Theming

```javascript
// Initialize with a theme
const table = new FilterTable('#table-container', {
  data: data,
  columns: columns,
  styling: {
    theme: 'dark', // Use the dark theme
    // Optional: Specify a custom path to theme stylesheets
    themesPath: './path/to/themes/'
  }
});

// Change theme after initialization
table.setTheme('blue');

// Get available themes
const themes = table.getAvailableThemes();
console.log(themes); // ['dark', 'blue', 'minimal', 'high-contrast']

// Load a custom stylesheet
table.loadCustomStylesheet('path/to/custom-theme.css');

// Apply a custom theme (defined in the custom stylesheet)
table.setTheme('custom-theme');
```

For detailed styling documentation, see the [Styling Guide](./docs/styling-guide.md).

## Documentation

For full documentation, see the [docs](./docs) directory or visit our [documentation site](https://filter-table.example.com).

## Examples

Check out the [examples](./examples) directory for more usage examples.

## License

MIT
