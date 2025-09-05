


# Returns System API Documentation for Frontend

## Overview

The Returns System provides comprehensive functionality for handling product returns, refunds, and exchanges in the GraphPOS application. This document outlines the GraphQL API endpoints, data structures, and integration patterns for frontend developers.

## Authentication & Permissions

All API endpoints require proper authentication and tenant-specific permissions:

```typescript
// Required headers for all requests
{
  "Authorization": "Bearer <JWT_TOKEN>",
  "X-Tenant-ID": "<TENANT_ID>"
}

// Permission requirements:
// - inventory__ProductReturn: create, read, update, delete
// - accounting__ReturnPayment: create, read
```

## GraphQL Endpoints

### Inventory Returns Module

#### 1. Create Product Return

**Mutation:** `inventory__createProductReturn`

```graphql
mutation CreateProductReturn($input: CreateProductReturnInput!) {
  inventory__createProductReturn(input: $input) {
    success
    message
    data {
      _id
      returnUID
      status
      totalReturnAmount
      netRefundAmount
    }
  }
}
```

**Variables:**
```typescript
{
  input: {
    invoiceId: "64a1b2c3d4e5f6789abcdef0",
    returnItems: [
      {
        referenceId: "64a1b2c3d4e5f6789abcdef1",
        returnQuantity: 2,
        condition: "Good",
        canRestock: true,
        itemNotes: "Customer changed mind"
      }
    ],
    reason: "CUSTOMER_CHANGED_MIND",
    returnType: "FULL_REFUND",
    reasonDescription: "Customer no longer needs the item",
    restockingFee: 5.00,
    customerNotes: "Please process quickly",
    reference: "REF-001"
  }
}
```

#### 2. Update Product Return

**Mutation:** `inventory__updateProductReturn`

```graphql
mutation UpdateProductReturn($input: UpdateProductReturnInput!) {
  inventory__updateProductReturn(input: $input) {
    _id
    status
    processedDate
    processedBy {
      name
      email
    }
    netRefundAmount
  }
}
```

**Variables:**
```typescript
{
  input: {
    productReturnId: "64a1b2c3d4e5f6789abcdef2",
    status: "APPROVED",
    restockingFee: 10.00,
    internalNotes: "Approved after inspection"
  }
}
```

#### 3. Get Returns List

**Query:** `inventory__productReturns`

```graphql
query GetProductReturns($where: CommonPaginationDto) {
  inventory__productReturns(where: $where) {
    nodes {
      _id
      returnUID
      status
      reason
      returnType
      totalReturnAmount
      netRefundAmount
      returnDate
      processedDate
      originalInvoice {
        _id
        invoiceUID
        netTotal
        date
      }
      client {
        _id
        name
        contactNumber
        email
      }
      returnItems {
        product {
          _id
          name
          sellPrice
        }
        returnQuantity
        originalQuantity
        totalPrice
        condition
        canRestock
        isRestocked
      }
      processedBy {
        name
        email
      }
    }
    totalCount
    hasNextPage
    hasPreviousPage
  }
}
```

**Variables with Filtering:**
```typescript
{
  where: {
    limit: 20,
    page: 1,
    sort: "-createdAt",
    // Optional filters
    status: "PENDING",
    reason: "DAMAGED",
    returnType: "FULL_REFUND"
  }
}
```

#### 4. Get Single Return

**Query:** `inventory__productReturn`

```graphql
query GetProductReturn($where: CommonFindDocumentDto!) {
  inventory__productReturn(where: $where) {
    _id
    returnUID
    status
    reason
    returnType
    reasonDescription
    totalReturnAmount
    restockingFee
    netRefundAmount
    processedRefundAmount
    customerNotes
    internalNotes
    returnDate
    processedDate
    requiresInspection
    inspectionDate
    originalInvoice {
      _id
      invoiceUID
      netTotal
      date
      client {
        name
        contactNumber
      }
    }
    returnItems {
      product {
        _id
        name
        sellPrice
        category {
          name
        }
      }
      returnQuantity
      originalQuantity
      unitPrice
      totalPrice
      condition
      itemNotes
      canRestock
      isRestocked
      restockedDate
    }
    committedBy {
      name
      email
    }
    processedBy {
      name
      email
    }
    createdAt
    updatedAt
  }
}
```

**Variables:**
```typescript
{
  where: {
    _id: "64a1b2c3d4e5f6789abcdef2"
  }
}
```

#### 5. Delete Return

**Mutation:** `inventory__removeProductReturn`

```graphql
mutation RemoveProductReturn($where: CommonFindDocumentDto!) {
  inventory__removeProductReturn(where: $where)
}
```

### Accounting Returns Payment Module

#### 1. Create Return Payment

**Mutation:** `accounting__createReturnPayment`

```graphql
mutation CreateReturnPayment($input: CreateReturnPaymentInput!) {
  accounting__createReturnPayment(input: $input) {
    success
    message
    data {
      _id
      returnPaymentUID
      status
      totalAmount
    }
  }
}
```

**Variables:**
```typescript
{
  input: {
    productReturnId: "64a1b2c3d4e5f6789abcdef2",
    // totalAmount removed - now calculated automatically from paymentItems
    paymentItems: [
      {
        type: "CASH",
        accountId: "64a1b2c3d4e5f6789abcdef3",
        amount: 50.00
      },
      {
        type: "STORE_CREDIT",
        amount: 45.00
      }
    ],
    processingNotes: "Processed immediately",
    reference: "RPY-001"
  }
}
```

#### 2. Get Return Payments List

**Query:** `accounting__returnPayments`

```graphql
query GetReturnPayments($where: CommonPaginationDto) {
  accounting__returnPayments(where: $where) {
    nodes {
      _id
      returnPaymentUID
      status
      totalAmount
      processedAmount
      paymentDate
      processedDate
      productReturn {
        _id
        returnUID
        status
        originalInvoice {
          invoiceUID
          client {
            name
          }
        }
      }
      client {
        name
        contactNumber
      }
      paymentItems {
        method
        amount
        account {
          _id
          name
          type
        }
        reference
        transactionId
      }
      processingNotes
      failureReason
    }
    totalCount
    hasNextPage
  }
}
```

#### 3. Get Single Return Payment

**Query:** `accounting__returnPayment`

```graphql
query GetReturnPayment($where: CommonFindDocumentDto!) {
  accounting__returnPayment(where: $where) {
    _id
    returnPaymentUID
    status
    totalAmount
    processedAmount
    paymentDate
    processedDate
    processingNotes
    failureReason
    reference
    productReturn {
      _id
      returnUID
      totalReturnAmount
      netRefundAmount
      originalInvoice {
        invoiceUID
        netTotal
        client {
          name
          contactNumber
        }
      }
    }
    paymentItems {
      method
      amount
      account {
        _id
        name
        type
        balance
      }
      reference
      transactionId
    }
    createdAt
    updatedAt
  }
}
```

## TypeScript Types

### Enums

```typescript
export enum PRODUCT_RETURN_STATUS {
  PENDING = 'PENDING',
  APPROVED = 'APPROVED',
  REJECTED = 'REJECTED',
  COMPLETED = 'COMPLETED',
  CANCELLED = 'CANCELLED',
}

export enum PRODUCT_RETURN_REASON {
  DAMAGED = 'DAMAGED',
  DEFECTIVE = 'DEFECTIVE',
  WRONG_ITEM = 'WRONG_ITEM',
  NOT_AS_DESCRIBED = 'NOT_AS_DESCRIBED',
  CUSTOMER_CHANGED_MIND = 'CUSTOMER_CHANGED_MIND',
  SIZE_ISSUE = 'SIZE_ISSUE',
  QUALITY_ISSUE = 'QUALITY_ISSUE',
  OTHER = 'OTHER',
}

export enum PRODUCT_RETURN_TYPE {
  FULL_REFUND = 'FULL_REFUND',
  PARTIAL_REFUND = 'PARTIAL_REFUND',
  STORE_CREDIT = 'STORE_CREDIT',
  EXCHANGE = 'EXCHANGE',
}

export enum RETURN_PAYMENT_METHOD {
  CASH = 'CASH',
  CARD = 'CARD',
  BANK_TRANSFER = 'BANK_TRANSFER',
  STORE_CREDIT = 'STORE_CREDIT',
  CHECK = 'CHECK',
  ORIGINAL_PAYMENT_METHOD = 'ORIGINAL_PAYMENT_METHOD',
}

export enum RETURN_PAYMENT_STATUS {
  PENDING = 'PENDING',
  PROCESSING = 'PROCESSING',
  COMPLETED = 'COMPLETED',
  FAILED = 'FAILED',
  CANCELLED = 'CANCELLED',
}
```

### Input Types

```typescript
export interface CreateProductReturnInput {
  invoiceId: string;                // Client is automatically taken from the invoice
  returnItems: CreateProductReturnItemInput[];
  reason: PRODUCT_RETURN_REASON;
  returnType: PRODUCT_RETURN_TYPE;
  reasonDescription?: string;
  restockingFee?: number;
  customerNotes?: string;
  internalNotes?: string;
  reference?: string;
  returnDate?: Date;                // Optional - defaults to current date if not provided
}

export interface CreateProductReturnItemInput {
  referenceId: string;              // Product reference ID (not direct product ID)
  returnQuantity: number;
  condition?: string;
  itemNotes?: string;
  canRestock?: boolean;
}

export interface UpdateProductReturnInput {
  productReturnId: string;          // Field renamed from _id
  status?: PRODUCT_RETURN_STATUS;
  restockingFee?: number;
  internalNotes?: string;
  customerNotes?: string;
  reference?: string;
  returnItems?: CreateProductReturnItemInput[];  // Can update return items
}

export interface CreateReturnPaymentInput {
  productReturnId: string;
  // totalAmount removed - now calculated from paymentItems
  paymentItems: CreateReturnPaymentItemInput[];
  processingNotes?: string;
  reference?: string;
}

export interface CreateReturnPaymentItemInput {
  type: string;                     // Simplified from method enum to string
  accountId?: string;
  amount?: number;                  // Now optional/nullable
}
```

### Response Types

```typescript
export interface ProductReturn {
  _id: string;
  returnUID: string;
  status: PRODUCT_RETURN_STATUS;
  reason: PRODUCT_RETURN_REASON;
  returnType: PRODUCT_RETURN_TYPE;
  reasonDescription?: string;
  totalReturnAmount: number;
  restockingFee?: number;
  netRefundAmount: number;
  processedRefundAmount?: number;
  customerNotes?: string;
  internalNotes?: string;
  returnDate: string;
  processedDate?: string;
  originalInvoice: ProductInvoice;
  client?: Client;
  returnItems: ProductReturnItem[];
  committedBy: UserReference;
  processedBy?: UserReference;
  createdAt: string;
  updatedAt: string;
}

export interface ReturnPayment {
  _id: string;
  returnPaymentUID: string;
  status: RETURN_PAYMENT_STATUS;
  totalAmount: number;
  processedAmount?: number;
  paymentDate?: string;
  processedDate?: string;
  processingNotes?: string;
  failureReason?: string;
  productReturn: ProductReturn;
  client?: Client;
  paymentItems: ReturnPaymentItem[];
  reference?: string;
  createdAt: string;
  updatedAt: string;
}
```

## Frontend Implementation Examples

### React/Next.js Example

```tsx
import { useMutation, useQuery } from '@apollo/client';
import { CREATE_PRODUCT_RETURN, GET_PRODUCT_RETURNS } from './graphql/returns';

const ReturnsPage = () => {
  // Fetch returns list
  const { data, loading, refetch } = useQuery(GET_PRODUCT_RETURNS, {
    variables: {
      where: { limit: 20, page: 1, sort: '-createdAt' }
    }
  });

  // Create return mutation
  const [createReturn, { loading: creating }] = useMutation(CREATE_PRODUCT_RETURN, {
    onCompleted: (result) => {
      if (result.inventory__createProductReturn.success) {
        refetch(); // Refresh the list
        // Show success message
      }
    },
    onError: (error) => {
      // Handle error
      console.error('Return creation failed:', error);
    }
  });

  const handleCreateReturn = async (returnData) => {
    try {
      await createReturn({
        variables: { input: returnData }
      });
    } catch (error) {
      // Error handling
    }
  };

  return (
    <div>
      {/* Returns list UI */}
      {loading ? (
        <div>Loading returns...</div>
      ) : (
        <div>
          {data?.inventory__productReturns.nodes.map(return_ => (
            <div key={return_._id}>
              <h3>{return_.returnUID}</h3>
              <p>Status: {return_.status}</p>
              <p>Amount: ${return_.totalReturnAmount}</p>
              <p>Date: {new Date(return_.returnDate).toLocaleDateString()}</p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
```

### Vue.js Example

```vue
<template>
  <div>
    <!-- Returns Management UI -->
    <div v-if="loading">Loading...</div>
    <div v-else>
      <div v-for="return_ in returns" :key="return_._id" class="return-item">
        <h3>{{ return_.returnUID }}</h3>
        <p>Status: {{ return_.status }}</p>
        <p>Amount: ${{ return_.totalReturnAmount }}</p>
        <button 
          @click="approveReturn(return_._id)"
          :disabled="return_.status !== 'PENDING'"
        >
          Approve Return
        </button>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import { useQuery, useMutation } from '@vue/apollo-composable';
import { GET_PRODUCT_RETURNS, UPDATE_PRODUCT_RETURN } from './graphql/returns';

const returns = ref([]);
const loading = ref(true);

// Fetch returns
const { result, refetch } = useQuery(GET_PRODUCT_RETURNS, {
  where: { limit: 20, page: 1 }
});

// Update return mutation
const { mutate: updateReturn } = useMutation(UPDATE_PRODUCT_RETURN);

const approveReturn = async (returnId) => {
  try {
    await updateReturn({
      input: {
        _id: returnId,
        status: 'APPROVED',
        internalNotes: 'Approved for processing'
      }
    });
    refetch();
  } catch (error) {
    console.error('Failed to approve return:', error);
  }
};

onMounted(() => {
  if (result.value) {
    returns.value = result.value.inventory__productReturns.nodes;
    loading.value = false;
  }
});
</script>
```

## Error Handling

All API endpoints return standardized error responses:

```typescript
interface GraphQLError {
  message: string;
  extensions: {
    code: string;
    exception: {
      stacktrace: string[];
    };
  };
}

// Common error scenarios:
// - UNAUTHENTICATED: Invalid or missing JWT token
// - FORBIDDEN: Insufficient permissions
// - BAD_USER_INPUT: Validation errors
// - NOT_FOUND: Resource not found
// - INTERNAL_SERVER_ERROR: Server-side errors
```

## Best Practices

### 1. Error Handling
```typescript
try {
  const result = await createReturn({ variables: { input } });
  if (result.data.inventory__createProductReturn.success) {
    // Handle success
  } else {
    // Handle business logic errors
  }
} catch (error) {
  // Handle GraphQL/network errors
  if (error.graphQLErrors?.length > 0) {
    // Handle GraphQL errors
  }
  if (error.networkError) {
    // Handle network errors
  }
}
```

### 2. Loading States
```typescript
const [loading, setLoading] = useState(false);
const [error, setError] = useState(null);

const handleAction = async () => {
  setLoading(true);
  setError(null);
  try {
    await performAction();
  } catch (err) {
    setError(err.message);
  } finally {
    setLoading(false);
  }
};
```

### 3. Cache Management
```typescript
// Apollo Client cache update
const [createReturn] = useMutation(CREATE_PRODUCT_RETURN, {
  update: (cache, { data }) => {
    if (data.inventory__createProductReturn.success) {
      // Update existing queries in cache
      cache.modify({
        fields: {
          inventory__productReturns: (existing) => {
            // Add new return to cache
          }
        }
      });
    }
  }
});
```

### 4. Real-time Updates
```typescript
// Subscribe to return status changes (if WebSocket available)
const { data: subscription } = useSubscription(RETURN_STATUS_UPDATED, {
  variables: { tenantId }
});

useEffect(() => {
  if (subscription) {
    // Update local state with real-time changes
    updateLocalReturns(subscription.returnStatusUpdated);
  }
}, [subscription]);
```

## Testing

### GraphQL Queries Testing
```typescript
// Jest + Apollo testing utilities
import { MockedProvider } from '@apollo/client/testing';

const mocks = [
  {
    request: {
      query: GET_PRODUCT_RETURNS,
      variables: { where: { limit: 20 } }
    },
    result: {
      data: {
        inventory__productReturns: {
          nodes: [
            {
              _id: '1',
              returnUID: 'RET-001',
              status: 'PENDING',
              // ... other fields
            }
          ],
          totalCount: 1
        }
      }
    }
  }
];

test('renders returns list', async () => {
  render(
    <MockedProvider mocks={mocks}>
      <ReturnsPage />
    </MockedProvider>
  );
  
  await waitFor(() => {
    expect(screen.getByText('RET-001')).toBeInTheDocument();
  });
});
```

## Migration Guide (v0.2.0)

### Breaking Changes

#### Product Return Items
- **Field Renamed**: `productId` → `referenceId` in return items
- **Purpose**: Items now use referenceId from invoice products instead of direct product IDs for better decoupling

#### Update Product Return 
- **Field Renamed**: `_id` → `productReturnId` in UpdateProductReturnInput
- **New Feature**: Added optional `returnItems` array to update returned products list
- **New Field**: Added optional `returnDate` field with automatic current date default

#### Return Payments
- **Removed Field**: `totalAmount` removed from CreateReturnPaymentInput (now calculated automatically)
- **Simplified Items**: Return payment items now use:
  - `type: string` instead of `method: RETURN_PAYMENT_METHOD`
  - `amount?: number` (now optional/nullable)
  - Removed `reference` and `transactionId` fields

### Migration Steps

1. **Update Return Item Creation**:
   ```typescript
   // OLD (v0.1.x)
   returnItems: [{ productId: "64a...", returnQuantity: 2 }]
   
   // NEW (v0.2.0)  
   returnItems: [{ referenceId: "64a...", returnQuantity: 2 }]
   ```

2. **Update Return Updates**:
   ```typescript
   // OLD (v0.1.x)
   { _id: "64a...", status: "APPROVED" }
   
   // NEW (v0.2.0)
   { productReturnId: "64a...", status: "APPROVED" }
   ```

3. **Update Return Payments**:
   ```typescript
   // OLD (v0.1.x)
   {
     productReturnId: "64a...",
     totalAmount: 100.00,
     paymentItems: [{ method: "CASH", amount: 100.00 }]
   }
   
   // NEW (v0.2.0)
   {
     productReturnId: "64a...",
     // totalAmount removed - calculated automatically
     paymentItems: [{ type: "CASH", amount: 100.00 }]
   }
   ```

### New Features Available

- **Enhanced Validation**: Returns now validate against remaining refund amounts
- **Better Error Messages**: More specific error messages with product names and amounts
- **Admin Permissions**: Admin users now have full access to returns system
- **Flexible Return Dates**: Support for custom return dates with smart defaults
- **Correlation IDs**: Automatic correlation ID generation for better document tracking

## Troubleshooting

### Common Issues

1. **Permission Denied**: Ensure user has proper permissions for the collection
2. **Validation Errors**: Check required fields and data types
3. **Return Not Found**: Verify return ID and tenant context
4. **Invoice Validation**: Ensure original invoice exists and belongs to tenant
5. **Stock Issues**: Check if products can be restocked
6. **Over-refunding**: Ensure payment amounts don't exceed remaining refund balance

### Debug Tips

1. **Enable GraphQL DevTools** for query inspection
2. **Check Network Tab** for request/response details  
3. **Verify Authentication Headers** are properly set
4. **Use GraphQL Playground** for API testing
5. **Check Server Logs** for detailed error information
6. **Validate Migration**: Ensure all field renames are applied correctly