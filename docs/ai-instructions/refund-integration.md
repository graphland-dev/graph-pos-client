# Returns & Refunds — Frontend API Changes

This guide summarizes the GraphQL/API changes required on the frontend after simplifying the returns and refunds model.

## Summary

- Debt reduction removed. Returns are allowed for any items; refunds (cash out) are capped by the invoice amount paid minus prior refunds.
- `returnQuota` is the single source of truth for UI calculations; proposed-return analysis was removed.
- Several field renames for clarity; some fields removed.

## Schema Changes

- `ProductInvoice.returnQuota` (ResolveField)
  - Removed argument: no `enhancedMode`. Call without args.
  - Response type changes (InvoiceReturnQuota):
    - `availableForReturn` → `availableAmountForReturn` (money)
    - Removed: `proposedReturn`, `debtReductionQuota`, `outstandingBalance`
    - `itemAvailability[]` item fields:
      - `originalQuantity` → `purchasedQuantity`
      - `alreadyReturned` → `alreadyReturnedQuantity`
      - `availableForReturn` → `availableForReturnQuantity`
      - Removed: `maxReturnValue`, `maxCashRefund`, `maxDebtReduction`, `returnType`

- `CreateProductReturnInput`
  - Removed: `debtReducedAmount`, `paymentMethod`
  - Still includes: `invoiceId`, `returnItems[] { referenceId, returnQuantity }`, `reason`, `returnType`, optional notes, `restockingFee`.

- `ProductReturn`
  - Removed: `debtReducedAmount`, `hasDebtReduction`, `paymentMethod`.

- Return Payments
  - No schema changes. Backend caps refund by: `invoice.paidAmount - sum(processed refunds across returns)`.

## Example Queries / Mutations

- Fetch return quota for an invoice

```graphql
query InvoiceWithQuota($id: ID!) {
  inventory__invoiceById(id: $id) {
    _id
    netTotal
    paidAmount
    returnQuota {
      invoiceTotal
      totalPaid
      totalReturned
      availableAmountForReturn
      canCreateNewReturn
      itemAvailability {
        referenceId
        name
        purchasedQuantity
        alreadyReturnedQuantity
        availableForReturnQuantity
        unitPrice
      }
    }
  }
}
```

- Create a product return (simplified)

```graphql
mutation CreateReturn($input: CreateProductReturnInput!) {
  inventory__createProductReturn(input: $input) {
    _id
    returnUID
    status
    netRefundAmount
  }
}

# variables
{
  "input": {
    "invoiceId": "<invoiceId>",
    "reason": "DAMAGED",
    "returnType": "FULL_REFUND",
    "restockingFee": 0,
    "returnItems": [
      { "referenceId": "<productRefId>", "returnQuantity": 2 }
    ]
  }
}
```

- Create a return refund payment (unchanged GraphQL; stricter server cap)

```graphql
mutation CreateReturnPayment($input: CreateReturnPaymentInput!) {
  accounting__createReturnPayment(input: $input) {
    _id
    returnPaymentUID
    status
    totalAmount
    processedAmount
  }
}

# variables
{
  "input": {
    "productReturnId": "<returnId>",
    "paymentItems": [
      { "type": "CASH", "accountId": "<cashAccountId>", "amount": 50.00 }
    ],
    "reference": "Refund for return <UID>",
    "processingNotes": "Front counter refund"
  }
}
```

## Frontend Migration Checklist

- Query updates:
  - Remove `enhancedMode` from `returnQuota` calls.
  - Rename response mappings:
    - `availableForReturn` → `availableAmountForReturn`
    - In `itemAvailability`:
      - `originalQuantity` → `purchasedQuantity`
      - `alreadyReturned` → `alreadyReturnedQuantity`
      - `availableForReturn` → `availableForReturnQuantity`
  - Drop any use of removed fields (`proposedReturn`, `maxReturnValue`, `maxCashRefund`, `maxDebtReduction`, `returnType`, `debtReductionQuota`, `outstandingBalance`).

- Forms/UI:
  - Remove inputs for `paymentMethod` and `debtReducedAmount` from return creation.
  - Keep `reason`, `returnType`, `restockingFee`, `returnItems`.

- Lists/Detail views:
  - Remove display of `paymentMethod`, `debtReducedAmount`, `hasDebtReduction` in return details.

- Business logic:
  - Use `availableForReturnQuantity` to prevent over-returns per item client-side.
  - Use `availableAmountForReturn` to show remaining refundable amount (cash) for the invoice.
  - Note: `alreadyReturnedQuantity` includes PENDING/APPROVED/COMPLETED returns so users can’t over-return by creating multiple pending returns.

## Error Handling

- Refund attempts exceeding the remaining refundable amount now return a clear error indicating the remaining refundable for the invoice.
- Return creation still validates item quantities against purchased minus previously returned.

