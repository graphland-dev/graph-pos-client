# POS System Technical Overview

## Table of Contents
- [System Architecture](#system-architecture)
- [Core Components](#core-components)
- [Data Flow](#data-flow)
- [Key Features](#key-features)
- [Business Logic](#business-logic)
- [API Integration](#api-integration)
- [State Management](#state-management)
- [File Structure](#file-structure)

## System Architecture

The POS (Point of Sale) system is a React-based frontend application that integrates with a GraphQL backend. It's built using modern web technologies including TypeScript, React Hook Form, Apollo Client, and Mantine UI components.

### Technology Stack
- **Frontend Framework**: React 18+ with TypeScript
- **Form Management**: React Hook Form with Yup validation
- **API Client**: Apollo Client (GraphQL)
- **UI Library**: Mantine
- **State Management**: React hooks + Apollo Client cache
- **Routing**: React Router
- **Styling**: Tailwind CSS + Mantine theme

## Core Components

### 1. Main POS Page (`pos.page.tsx`)
The central component that orchestrates the entire POS workflow:
- **Product selection and cart management**
- **Client assignment**
- **Discount and tax calculations**
- **Payment processing**
- **Hold/Resume functionality**

### 2. Product Search & Selection
#### ProductSearchAutocomplete (`ProductSearchAutocomplete.tsx`)
- Real-time product search with GraphQL queries
- Auto-selection when single result found
- Audio feedback (bip sound) for user interactions
- Stock validation before selection

#### POSProductGallery (`POSProductGalary.tsx`)
- Visual product catalog with filtering
- Category and brand-based filtering  
- Grid layout with responsive design
- Stock status indicators

#### PosItemCard (`PosItemCard.tsx`)
- Individual product display cards
- Stock availability validation
- Visual indicators for out-of-stock items
- Click handling with stock validation

### 3. Client Management
#### ClientSearchAutocomplete (`ClientSearchAutocomplete.tsx`)
- Client search and selection
- Integration with customer database
- Support for guest transactions

### 4. Transaction Actions
#### PaymentForm (`PaymentForm.tsx`)
- Multiple payment method support
- Payment amount validation
- Account assignment for payments
- Invoice generation and finalization

#### HoldAction (`HoldAction.tsx`)
- Transaction holding functionality
- Reference number assignment
- Temporary storage for incomplete transactions

### 5. Transaction Management
#### HoldList (`HoldList.tsx`)
- Display held transactions
- Resume held transactions
- Transaction status management

## Data Flow

### 1. Product Selection Flow
```
User Search/Browse → Product Query → Stock Validation → Cart Addition → Price Calculation
```

### 2. Transaction Processing Flow
```
Product Selection → Client Assignment → Discount/Tax Calculation → Payment Processing → Invoice Generation
```

### 3. Hold/Resume Flow
```
Active Transaction → Hold Action → Store in Database → Display in Hold List → Resume → Complete Transaction
```

## Key Features

### 1. Real-time Product Search
- **Auto-complete functionality** with instant search results
- **Single result auto-selection** with audio feedback
- **Stock-aware search** that validates availability
- **Barcode/Code search support**

### 2. Intelligent Stock Management
- **Real-time stock calculations**: `stock = stockInQuantity - stockOutQuantity`
- **Stock validation** before adding products to cart
- **Sellable without stock** option for specific products
- **Visual stock indicators** in product cards

### 3. Flexible Discount System
- **Amount-based discounts**: Fixed monetary amount
- **Percentage-based discounts**: Percentage of total
- **Product-level discounts**: Individual item discounts
- **Transaction-level discounts**: Applied to entire cart

### 4. Tax Calculation Engine
- **VAT/Tax rate management** from settings
- **Exclusive tax calculation**: Tax added to base price
- **Automatic tax calculation** per product and total
- **Tax amount breakdown** in invoice

### 5. Payment Processing
- **Multiple payment methods** support
- **Partial payment handling**
- **Account-based payment tracking**
- **Change calculation**

### 6. Transaction Hold System
- **Hold incomplete transactions** for later completion
- **Reference number generation** for held transactions
- **Resume held transactions** with full state restoration
- **Hold list management** with search and filter

## Business Logic

### 1. Price Calculations
Located in `utils.calc.ts`:

```typescript
// Discount calculation
getDiscount(discountType, discountAmount, totalPrice)

// Tax calculation  
getSalesVat(subTotal, vatPercentage)

// Product reference with pricing
getProductReferenceByQuantity(product, quantity)
```

### 2. Stock Management
```typescript
// Stock calculation
getStock(product) = product.stockInQuantity - product.stockOutQuantity

// Stock validation
if (!getStock(product) && !product.isSellableWithoutStock) {
  // Prevent sale
}
```

### 3. Form Validation Schema
Comprehensive validation using Yup:
- **Required fields**: clientId, products (minimum 1)
- **Optional fields**: discountMode, discountValue, costAmount, taxRate, taxAmount
- **Business rules**: Minimum one product, valid client selection

## API Integration

### GraphQL Queries
1. **Pos_Products_Query**: Product search and listing
2. **Pos_Client_Query**: Client search and selection  
3. **Pos_Brands_Query**: Brand filtering
4. **Pos_Categories_Query**: Category filtering
5. **Pos_Hold_List**: Held transaction retrieval

### GraphQL Mutations
1. **Create_Product_Invoice**: Invoice creation
2. **Create_Invoice_Payment**: Payment processing
3. **Update_Invoice_Status**: Status updates

### Data Models
- **Product**: Core product information with stock and pricing
- **ProductItemReference**: Cart item with calculated values
- **ProductInvoice**: Complete transaction record
- **Client**: Customer information
- **Vat**: Tax configuration

## State Management

### 1. Form State (React Hook Form)
- **Centralized form state** for entire POS transaction
- **Real-time validation** with Yup schema
- **Field arrays** for dynamic product lists
- **Watch functionality** for reactive calculations

### 2. Component State
- **Search states** for autocomplete components
- **UI states** for modals, drawers, and loading
- **Filter states** for product gallery
- **Calculation states** for pricing

### 3. Apollo Client Cache
- **Query caching** for products, clients, and settings
- **Optimistic updates** for better UX
- **Cache invalidation** on mutations

## File Structure

```
src/pages/(tenant)/inventory-management/pages/pos/
├── pos.page.tsx                    # Main POS component
├── components/
│   ├── ClientSearchAutocomplete.tsx    # Client selection
│   ├── ProductSearchAutocomplete.tsx   # Product search
│   ├── POSProductGalary.tsx            # Product gallery
│   ├── PosItemCard.tsx                 # Product card
│   ├── form-actions/
│   │   ├── PaymentForm.tsx             # Payment processing
│   │   └── HoldAction.tsx              # Hold functionality
│   └── pos-header/
│       └── HoldList.tsx                # Held transactions
├── utils/
│   ├── pos.types.ts                    # Type definitions
│   ├── query.pos.ts                    # GraphQL queries
│   ├── query.payment.ts                # Payment mutations
│   ├── utils.calc.ts                   # Business calculations
│   └── validations/
│       └── paymentForm.validation.ts   # Form validation
```

## Performance Optimizations

### 1. Query Optimization
- **Debounced search** queries to reduce API calls
- **Pagination support** for large product catalogs
- **Field selection** to minimize data transfer
- **Query caching** with Apollo Client

### 2. UI Optimizations
- **Virtual scrolling** for large product lists
- **Image lazy loading** for product thumbnails
- **Memoization** of expensive calculations
- **Optimistic UI updates** for better responsiveness

### 3. Memory Management
- **Cleanup effects** for component unmounting
- **Query result cleanup** to prevent memory leaks
- **Event listener cleanup** for audio and keyboard events

## Security Considerations

### 1. Input Validation
- **Client-side validation** with Yup schemas
- **Server-side validation** via GraphQL resolvers
- **Type safety** with TypeScript

### 2. Data Protection
- **Sanitized queries** to prevent injection
- **Permission-based access** through authentication
- **Tenant isolation** in multi-tenant architecture

### 3. Transaction Integrity
- **Atomic operations** for invoice creation
- **Rollback mechanisms** for failed transactions
- **Audit trails** for all POS activities

## Future Enhancements

### 1. Offline Support
- **Service worker** implementation
- **Local storage** for offline transactions
- **Sync mechanism** when connection restored

### 2. Advanced Features
- **Receipt printing** integration
- **Barcode scanning** support
- **Kitchen display system** integration
- **Advanced reporting** and analytics

### 3. Performance Improvements
- **Web Workers** for heavy calculations
- **Code splitting** for better load times
- **PWA features** for mobile experience