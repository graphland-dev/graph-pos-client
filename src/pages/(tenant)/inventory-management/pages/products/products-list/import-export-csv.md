we need to impliment a feature to import and export products in CSV format.

In productList.page.tsx, we will have two button called 'Import' and 'Export' which will open a modal to select the file to import or export, these will go to ActionArea in DataTable.

For Working with these two button, create a separate component called ImportExportCSV.tsx and import it in productList.page.tsx.

Here are the apis we will use to import and export the products.


## API Endpoints

### Base URL
```
/api/inventory/products/csv
```

### 1. Download CSV Template
**GET** `/template`

Downloads a sample CSV file with the correct headers and sample data.

**Response:** Direct CSV file download

### 2. Validate CSV File
**POST** `/validate`

Validates a CSV file without importing the data.

**Headers:**
- `Content-Type: multipart/form-data`

**Body:**
- `file`: CSV file to validate
- `matchField`: Field to match existing products (optional, default: 'code')

**Response:**
```json
{
  "success": true,
  "totalRows": 10,
  "processedRows": 8,
  "createdCount": 0,
  "updatedCount": 0,
  "errorCount": 2,
  "errors": [
    {
      "row": 3,
      "field": "name",
      "message": "Name is required",
      "value": ""
    }
  ]
}
```

### 3. Import Products from CSV
**POST** `/import`

Imports products from a CSV file.

**Headers:**
- `Content-Type: multipart/form-data`

**Body:**
- `file`: CSV file to import
- `updateExisting`: "true" or "false" (optional, default: false)
- `previewOnly`: "true" or "false" (optional, default: false)
- `matchField`: Field to match existing products (optional, default: 'code')

**Response:**
```json
{
  "success": true,
  "totalRows": 10,
  "processedRows": 10,
  "createdCount": 8,
  "updatedCount": 2,
  "errorCount": 0,
  "errors": []
}
```

### 4. Export Products to CSV
**POST** `/export`

Exports products to a CSV file.

**Headers:**
- `Content-Type: application/json`

**Body:**
```json
{
  "fields": ["name", "code", "price", "stockInQuantity"],
  "categoryId": "optional-category-id",
  "brandId": "optional-brand-id",
  "includeRelatedData": true,
  "dateFrom": "2024-01-01T00:00:00.000Z",
  "dateTo": "2024-12-31T23:59:59.999Z"
}
```

**Response:**
```json
{
  "success": true,
  "file": {
    "provider": "S3",
    "path": "csv-exports/tenant-name/products-export-1234567890.csv",
    "meta": "{\"originalname\":\"products-export-1234567890.csv\",\"mimetype\":\"text/csv\",\"size\":1024}"
  },
  "totalRecords": 150
}
```

## CSV Format

### Required Fields
- `name`: Product name (required)

### Optional Fields
- `code`: Product code
- `modelName`: Model name
- `price`: Product price (numeric)
- `stockInQuantity`: Stock quantity (integer)
- `discountPercentage`: Discount percentage (numeric)
- `discountAmount`: Fixed discount amount (numeric)
- `discountMode`: "PERCENTAGE" or "AMOUNT" (validated against ProductDiscountMode enum)
- `taxType`: "INCLUSIVE" or "EXCLUSIVE" (validated against ProductTaxType enum)
- `categoryCode`: Category code (must exist in system)
- `brandCode`: Brand code (must exist in system)
- `unitCode`: Unit code (must exist in system)
- `vatCode`: VAT code (must exist in system)
- `note`: Additional notes

### Sample CSV Content
```csv
name,code,modelName,price,stockInQuantity,discountMode,taxType,categoryCode,brandCode,unitCode,vatCode,note
"Sample Product 1",SAMPLE001,Model X,99.99,10,PERCENTAGE,INCLUSIVE,ELECTRONICS,APPLE,PCS,STD,Sample product for import
"Sample Product 2",SAMPLE002,Model Y,149.99,25,AMOUNT,EXCLUSIVE,CLOTHING,NIKE,PCS,REDUCED,Another sample product
```

## Authentication

All endpoints require authentication with appropriate permissions:
- **Read permissions** for template, validate, and export operations
- **Create permissions** for import operations

The tenant context is automatically applied based on the authenticated user.

## Error Handling

The API returns detailed error information including:
- Row numbers where errors occurred
- Field names that caused errors
- Descriptive error messages
- Original values that failed validation

## File Upload Requirements

For all endpoints that accept file uploads:
- Use `multipart/form-data` content type
- File field name should be `file`
- Supported file types: `.csv`
- Maximum file size: 10MB (configurable)

### Important Note on File Upload Issues

If you're getting "No file uploaded" error, ensure:
1. You're using `multipart/form-data` content type
2. The file field name is exactly `file`
3. The file is not empty
4. You're not sending JSON data instead of form data

## Usage Examples

### JavaScript/Fetch
```javascript
// Download template
const template = await fetch('/api/inventory/products/csv/template', {
  headers: {
    'Authorization': 'Bearer ' + token
  }
});
const csvBlob = await template.blob();

// Import CSV with proper form data
const formData = new FormData();
formData.append('file', csvFile); // csvFile is a File object
formData.append('updateExisting', 'true');
formData.append('previewOnly', 'false');
formData.append('matchField', 'code');

const importResult = await fetch('/api/inventory/products/csv/import', {
  method: 'POST',
  headers: {
    'Authorization': 'Bearer ' + token
    // Don't set Content-Type - let browser set it for multipart/form-data
  },
  body: formData
});

// Export CSV
const exportResult = await fetch('/api/inventory/products/csv/export', {
  method: 'POST',
  headers: { 
    'Content-Type': 'application/json',
    'Authorization': 'Bearer ' + token
  },
  body: JSON.stringify({
    includeRelatedData: true,
    fields: ['name', 'code', 'price']
  })
});
```


Import button will open a modal, There will have some instuction and csv template file to download from api. There will have a dropzone using mantine-dropzone to drop csv file. Before using import api, call validate api to check csv file is valid or not. If it is valid, then import api will be called to import csv file. If it is not valid, show the error message in the modal.

Export button will simple show confirm modal to confirm export csv file. If user confirm, then export api will be called to export csv file.