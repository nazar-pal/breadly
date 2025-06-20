# Account Modals Refactoring

This directory contains the refactored account modal system that consolidates what were previously 4 separate modal components into a single, unified modal.

## Structure

### Core Components

- **`UnifiedAccountModal.tsx`** - The main modal component that handles all account types
- **`modal-account.tsx`** - Wrapper component that connects the store to the unified modal

### Type-Specific Fields

- **`account-type-fields/`** - Directory containing field components for each account type:
  - `PaymentFields.tsx` - No additional fields (payment accounts only need common fields)
  - `SavingFields.tsx` - Savings goal and target date fields
  - `DebtFields.tsx` - Initial amount, direction, and due date fields

### State Management

- **`stores/accountModalStore.ts`** - Zustand store managing modal visibility and state
- **`hooks/useAccountsUI.ts`** - Updated hook that uses the store instead of local state

## Configuration Pattern

The unified modal uses a configuration object pattern where each account type defines:

```typescript
interface AccountTypeConfig {
  title: { add: string; edit: string } // Modal titles
  extraFields: (props) => React.JSX.Element // Type-specific form fields
  toFormDefaults: (account) => FormDefaults // Default values for forms
  serialize: (data) => DbPayload // Convert form data to DB format
}
```

## Benefits

1. **~70% less code** - Eliminated duplication across 4 modal files
2. **Easier maintenance** - Changes to common logic only need to be made once
3. **Type safety** - Configuration pattern ensures consistency
4. **Extensibility** - Adding new account types only requires adding a config entry
5. **Global state** - Modal state is managed globally via Zustand

## Usage

```typescript
// To open modal for creating a new account
const { openForCreate } = useAccountModalStore()
openForCreate('saving')

// To open modal for editing an existing account
const { openForEdit } = useAccountModalStore()
openForEdit(accountObject)

// The modal component is rendered once at the app level
<AccountModal />
```

## Migration Notes

- Removed `PaymentAccountModal`, `SavingAccountModal`, and `DebtAccountModal`
- Updated all account screens to use the unified modal
- `useAccountsUI` hook now uses the global store instead of local state
- Modal props are no longer needed - everything is managed through the store
