# FilterTable API Reference

This document provides a comprehensive reference for the FilterTable library API.

## Table of Contents

- [FilterTable Class](#filtertable-class)
  - [Constructor](#constructor)
  - [Methods](#methods)
    - [Data Methods](#data-methods)
    - [Filter Methods](#filter-methods)
    - [Event Methods](#event-methods)
    - [Utility Methods](#utility-methods)
    - [Styling Methods](#styling-methods)
- [Column Configuration](#column-configuration)
- [Filter Types](#filter-types)
- [Events](#events)
- [Utility Functions](#utility-functions)

## FilterTable Class

The main class that creates and manages the table.

### Constructor

```javascript
const table = new FilterTable(container, options);
```

#### Parameters

- `container` (string | HTMLElement): CSS selector or DOM element to render the table in
- `options` (Object): Configuration options
  - `data` (Array): Array of data objects to display in the table
  - `columns` (Array): Column definitions (see [Column Configuration](#column-configuration))
  - `filters` (Object, optional): Initial filter configuration
  - `pagination` (Object, optional): Pagination options
  - `sorting` (Object, optional): Sorting options
  - `styling` (Object, optional): Styling options
    - `theme` (string, optional): Name of the theme to apply ('dark', 'blue', 'minimal', 'high-contrast')
    - `customStylesheet` (string, optional): Path to a custom stylesheet
    - `themesPath` (string, optional): Custom path to theme stylesheets (defaults to './src/styles/themes/')

### Methods

#### Data Methods

##### `setData(data)`

Sets the table data.

- `data` (Array): New data array
- Returns: FilterTable instance for chaining

##### `getData()`

Gets the current filtered data.

- Returns: Array of filtered data objects

##### `getOriginalData()`

Gets the original unfiltered data.

- Returns: Array of original data objects

##### `setColumns(columns)`

Sets the table columns configuration.

- `columns` (Array): Column configuration array
- Returns: FilterTable instance for chaining

##### `getColumns()`

Gets the current column configuration.

- Returns: Array of column configuration objects

#### Filter Methods

##### `addFilter(filterConfig)`

Adds a filter to the table.

- `filterConfig` (Object): Filter configuration
  - `column` (string): Column field to filter on
  - `type` (string): Type of filter to apply
  - `value` (any): Filter value
  - Additional parameters depending on filter type
- Returns: FilterTable instance for chaining

##### `removeFilter(column)`

Removes a filter from the table.

- `column` (string): Column field to remove filter from
- Returns: FilterTable instance for chaining

##### `clearFilters()`

Clears all filters from the table.

- Returns: FilterTable instance for chaining

##### `addFilterGroup(groupConfig)`

Adds a filter group with multiple filters and logical operator.

- `groupConfig` (Object): Filter group configuration
  - `operator` (string): Logical operator ('AND' or 'OR')
  - `filters` (Array): Array of filter configurations
- Returns: FilterTable instance for chaining

##### `saveCurrentFilters(name)`

Saves the current set of filters with a name for later use.

- `name` (string): Name to save the filters under
- Returns: Object containing the saved filter configuration

##### `applyFilters(filterNameOrConfig)`

Applies a previously saved filter or filter configuration.

- `filterNameOrConfig` (string | Object): Name of saved filter or filter configuration object
- Returns: FilterTable instance for chaining

##### `getSavedFilters()`

Gets all saved filters.

- Returns: Object mapping filter names to filter configurations

#### Event Methods

##### `on(eventType, callback)`

Adds an event listener.

- `eventType` (string): Type of event to listen for
- `callback` (Function): Callback function to execute
- Returns: Function to remove the listener

#### Utility Methods

##### `refresh()`

Refreshes the table with current data and filters.

- Returns: FilterTable instance for chaining

##### `destroy()`

Destroys the table instance and cleans up resources.

#### Styling Methods

##### `setTheme(themeName)`

Changes the current theme.

- `themeName` (string): Name of the theme to switch to ('dark', 'blue', 'minimal', 'high-contrast')
- Returns: FilterTable instance for chaining

##### `getTheme()`

Gets the current theme name.

- Returns: String with the current theme name or null if no theme is applied

##### `loadCustomStylesheet(stylesheetPath)`

Loads a custom stylesheet.

- `stylesheetPath` (string): Path to the custom stylesheet
- Returns: FilterTable instance for chaining

##### `getAvailableThemes()`

Gets a list of all available themes.

- Returns: Array of theme names

## Column Configuration

Each column can be configured with the following options:

| Option | Type | Default | Description |
|--------|------|---------|-------------|
| field | string | (required) | The field name in the data objects |
| title | string | field value | The column header text |
| filterable | boolean | true | Whether the column can be filtered |
| sortable | boolean | true | Whether the column can be sorted |
| filterType | string | auto-detected | The type of filter to use |
| dataType | string | auto-detected | The data type of the column |
| formatter | function | null | A function to format the cell value for display |
| width | string | null | The width of the column (e.g., '100px', '10%') |
| className | string | null | Additional CSS class for the column |

## Filter Types

FilterTable supports various filter types for different data types.

### Basic Filter Types

| Filter Type | Description | Parameters |
|-------------|-------------|------------|
| contains | Checks if a string value contains the filter value | `value` (string), `caseSensitive` (boolean, optional) |
| equals | Checks if a value exactly matches the filter value | `value` (any) |
| startsWith | Checks if a string value starts with the filter value | `value` (string), `caseSensitive` (boolean, optional) |
| endsWith | Checks if a string value ends with the filter value | `value` (string), `caseSensitive` (boolean, optional) |
| range | Checks if a numeric value is within a range | `min` (number, optional), `max` (number, optional) |
| greaterThan | Checks if a numeric value is greater than the filter value | `value` (number) |
| lessThan | Checks if a numeric value is less than the filter value | `value` (number) |
| date | Checks if a date value matches the filter criteria | `value` (string), `comparison` (string, optional: 'equals', 'before', 'after') |
| dateRange | Checks if a date value is within a range | `start` (string, optional), `end` (string, optional) |
| boolean | Checks if a boolean value matches the filter value | `value` (boolean) |
| inList | Checks if a value is in a list of values | `values` (Array) |
| notInList | Checks if a value is not in a list of values | `values` (Array) |
| empty | Checks if a value is empty | None |
| notEmpty | Checks if a value is not empty | None |

### Advanced Filter Types

| Filter Type | Description | Parameters |
|-------------|-------------|------------|
| fuzzy | Checks if a string value approximately matches the filter value | `value` (string), `tolerance` (number, optional, 0-1) |
| regex | Checks if a string value matches a regular expression | `pattern` (string), `flags` (string, optional) |
| multiSelect | Checks if a value is in a list of selected values | `values` (Array) |
| hierarchical | Checks if a value or any of its ancestors match the filter | `value` (any), `hierarchy` (Object) |
| contextual | Applies different filter types based on the value | `value` (any), `typeMap` (Object), `filterParams` (Object) |
| suggestion | Checks if a value matches any of the suggested values | `value` (string), `suggestions` (Array), `tolerance` (number, optional) |
| wordMatch | Checks if all words in the filter value are present in the cell value | `value` (string) |
| phonetic | Checks if a string value sounds like the filter value | `value` (string) |

### Filter Combinations

| Combination Type | Description | Parameters |
|------------------|-------------|------------|
| AND | Combines filters with AND logic | `filters` (Array) |
| OR | Combines filters with OR logic | `filters` (Array) |
| NOT | Negates another filter | `filter` (Object) |
| crossColumn | Applies a condition across multiple columns | `columns` (Array), `filter` (Object) |
| complexGroup | Creates a complex filter group with nested conditions | `operator` (string), `filters` (Array), `groups` (Array) |

## Events

FilterTable emits various events that you can listen to.

| Event | Description | Data |
|-------|-------------|------|
| filterChange | Fired when filters change | `{ filters: Array }` |
| refresh | Fired when the table is refreshed | `{ filteredData: Array, totalRows: number, originalRows: number }` |
| rowClick | Fired when a row is clicked | `{ row: Object, index: number, originalEvent: Event }` |
| sort | Fired when a column is sorted | `{ field: string, direction: string }` |

## Utility Functions

FilterTable provides several utility functions that can be accessed through the FilterTable object.

### Data Type Utilities

```javascript
// Data type constants
FilterTable.DataTypes.STRING
FilterTable.DataTypes.NUMBER
FilterTable.DataTypes.BOOLEAN
FilterTable.DataTypes.DATE
FilterTable.DataTypes.ARRAY
FilterTable.DataTypes.OBJECT

// Detect data type
FilterTable.DataTypes.detectType(value)

// Convert type
FilterTable.DataTypes.convertType(value, targetType)

// Format value
FilterTable.DataTypes.formatValue(value, dataType, options)
```

### Filter Type Utilities

```javascript
// Filter type constants
FilterTable.FilterTypes.CONTAINS
FilterTable.FilterTypes.EQUALS
FilterTable.FilterTypes.RANGE
// ... and many more

// Get filter name
FilterTable.FilterTypes.getFilterName(filterType)

// Get filter types for data type
FilterTable.FilterTypes.getFilterTypesForDataType(dataType)

// Check if filter type is a combination type
FilterTable.FilterTypes.isCombinationType(filterType)

// Check if filter type is an advanced type
FilterTable.FilterTypes.isAdvancedType(filterType)

// Get default filter type for data type
FilterTable.FilterTypes.getDefaultFilterType(dataType)
```

## Examples

### Basic Example

```javascript
import FilterTable from 'filter-table';

const data = [
  { id: 1, name: 'John Doe', age: 30 },
  { id: 2, name: 'Jane Smith', age: 25 }
];

const table = new FilterTable('#table-container', {
  data: data,
  columns: [
    { field: 'id', title: 'ID' },
    { field: 'name', title: 'Name' },
    { field: 'age', title: 'Age', filterType: 'number' }
  ]
});

// Add a filter
table.addFilter({
  column: 'name',
  type: 'contains',
  value: 'John'
});

// Listen for events
table.on('rowClick', (data) => {
  console.log('Row clicked:', data.row);
});
```

### Advanced Example

```javascript
// Add a filter group with OR logic
table.addFilterGroup({
  operator: 'OR',
  filters: [
    { column: 'age', type: 'range', min: 25, max: 35 },
    { column: 'joined', type: 'date', comparison: 'after', value: '2022-01-01' }
  ]
});

// Save current filters
const savedFilter = table.saveCurrentFilters('my-favorite-view');

// Apply saved filters later
table.applyFilters(savedFilter);
```
