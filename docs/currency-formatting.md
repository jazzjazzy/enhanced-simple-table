# Currency Formatting in FilterTable

FilterTable now supports currency formatting based on country codes. This feature allows you to display numeric values as currency with the appropriate symbol and formatting based on the country.

## How to Use Currency Formatting

### 1. Set the column data type to 'currency'

When defining your table columns, set the `dataType` property to `'currency'`:

```javascript
{
  field: 'salary',
  title: 'Salary',
  dataType: 'currency',
  // other column properties...
}
```

### 2. Specify the country code

You can specify the country code in two ways:

#### Option 1: Using a formatter function

```javascript
{
  field: 'salary',
  title: 'Salary',
  dataType: 'currency',
  formatter: function(value, row) {
    // Use the country code from the row data
    return formatCurrency(value, row.country);
  }
}
```

#### Option 2: Using a fixed country code

```javascript
{
  field: 'salary',
  title: 'Salary',
  dataType: 'currency',
  countryCode: 'US' // Fixed country code for all values in this column
}
```

### 3. Import the formatCurrency function (if using a formatter)

If you're using a formatter function, you need to import the `formatCurrency` function:

```javascript
import { formatCurrency } from '../src/utils/data-types.js';
```

## Supported Country Codes

The currency formatter supports both ISO 3166-1 alpha-2 and alpha-3 country codes. Here are some examples:

| Country | Alpha-2 | Alpha-3 | Currency |
|---------|---------|---------|----------|
| United States | US | USA | USD ($) |
| United Kingdom | GB | GBR | GBP (£) |
| Canada | CA | CAN | CAD (CA$) |
| Australia | AU | AUS | AUD (A$) |
| New Zealand | NZ | NZL | NZD (NZ$) |
| European Union | EU | EUR | EUR (€) |
| Japan | JP | JPN | JPY (¥) |
| China | CN | CHN | CNY (¥) |
| India | IN | IND | INR (₹) |
| Brazil | BR | BRA | BRL (R$) |
| Russia | RU | RUS | RUB (₽) |
| South Africa | ZA | ZAF | ZAR (R) |
| Mexico | MX | MEX | MXN (MX$) |
| Singapore | SG | SGP | SGD (S$) |
| Switzerland | CH | CHE | CHF (CHF) |
| Sweden | SE | SWE | SEK (kr) |
| Norway | NO | NOR | NOK (kr) |
| Denmark | DK | DNK | DKK (kr) |
| South Korea | KR | KOR | KRW (₩) |

If a country code is not recognized, the formatter will default to USD.

## Example

Here's a complete example of using currency formatting with different country codes:

```javascript
import FilterTable from '../src/index.js';
import { formatCurrency } from '../src/utils/data-types.js';

// Sample data with country codes
const data = [
  { id: 1, name: 'John Doe', salary: 85000, country: 'US' },
  { id: 2, name: 'Jane Smith', salary: 65000, country: 'GB' },
  { id: 3, name: 'Bob Johnson', salary: 110000, country: 'US' },
  { id: 4, name: 'Alice Williams', salary: 72000, country: 'CA' },
  { id: 5, name: 'Charlie Brown', salary: 78000, country: 'AU' }
];

// Initialize the table
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
        // Use the country code from the row data
        return formatCurrency(value, row.country);
      }
    },
    { field: 'country', title: 'Country' }
  ]
});
```

This will display the salary values with the appropriate currency symbols and formatting based on the country code:

- John Doe: $85,000.00
- Jane Smith: £65,000.00
- Bob Johnson: $110,000.00
- Alice Williams: CA$72,000.00
- Charlie Brown: A$78,000.00
