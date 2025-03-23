# Links in FilterTable

FilterTable supports adding links to your tables in two ways:
1. Row-level links: Make entire rows clickable to navigate to a detail page
2. Column-specific links: Add links to specific columns

## Row-Level Links

Row-level links make the entire row clickable, turning it into a navigation element. This is useful for tables where each row represents an entity (like a user, product, or order) that has its own detail page.

### Basic Usage

To add row-level links, use the `rowLink` option when initializing the table:

```javascript
const table = new FilterTable('#table-container', {
  data: data,
  rowLink: 'user.html?id={id}',
  columns: [
    // column definitions...
  ]
});
```

The `{id}` placeholder will be replaced with the value of the `id` field from each row. You can use any field name from your data as a placeholder.

### Dynamic Row Links

For more complex scenarios, you can provide a function that returns the URL:

```javascript
const table = new FilterTable('#table-container', {
  data: data,
  rowLink: (row) => `user.html?id=${row.id}&name=${encodeURIComponent(row.name)}`,
  columns: [
    // column definitions...
  ]
});
```

The function receives the entire row object, allowing you to construct URLs based on multiple fields or apply custom logic.

## Column-Specific Links

Column-specific links add clickable links to individual columns. This is useful when you want to provide links to related resources or actions.

### Basic Usage

To add a link to a specific column, use the `link` property in the column definition:

```javascript
const table = new FilterTable('#table-container', {
  data: data,
  columns: [
    { field: 'id', title: 'ID' },
    { field: 'name', title: 'Name' },
    { 
      field: 'department', 
      title: 'Department',
      link: 'department.html?name={value}'
    },
    // other columns...
  ]
});
```

The `{value}` placeholder will be replaced with the cell's value. In this example, clicking on a department name will navigate to `department.html?name=Engineering` for a cell with the value "Engineering".

### Dynamic Column Links

For more complex scenarios, you can provide a function that returns the URL:

```javascript
const table = new FilterTable('#table-container', {
  data: data,
  columns: [
    // other columns...
    { 
      field: 'department', 
      title: 'Department',
      link: (value, row, column) => `department.html?name=${encodeURIComponent(value)}&company=${encodeURIComponent(row.company)}`
    }
  ]
});
```

The function receives three parameters:
- `value`: The cell's value
- `row`: The entire row object
- `column`: The column configuration object

This allows you to construct URLs based on multiple fields or apply custom logic.

## Combining Row and Column Links

You can combine row-level and column-specific links in the same table. When a user clicks on a cell that has its own link, that link will take precedence over the row link.

```javascript
const table = new FilterTable('#table-container', {
  data: data,
  rowLink: 'user.html?id={id}',
  columns: [
    { field: 'id', title: 'ID' },
    { field: 'name', title: 'Name' },
    { 
      field: 'department', 
      title: 'Department',
      link: 'department.html?name={value}'
    },
    // other columns...
  ]
});
```

In this example:
- Clicking on the department name will navigate to the department page
- Clicking anywhere else in the row will navigate to the user page

## Styling Links

FilterTable applies minimal styling to links by default. You can customize the appearance of links using CSS:

```css
/* Style for links in the table */
.filter-table a {
  color: #0066cc;
  text-decoration: none;
}

.filter-table a:hover {
  text-decoration: underline;
}

/* Style for clickable rows */
.filter-table tr[data-href] {
  cursor: pointer;
  transition: background-color 0.2s;
}

.filter-table tr[data-href]:hover {
  background-color: #f0f0f0;
}
```

## Example

See the [links example](../examples/links-example.html) for a complete demonstration of row and column links.

```javascript
import FilterTable from '../src/index.js';

// Sample data
const data = [
  { id: 1, name: 'John Doe', department: 'Engineering', position: 'Software Engineer' },
  { id: 2, name: 'Jane Smith', department: 'Marketing', position: 'Product Manager' },
  // more data...
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
