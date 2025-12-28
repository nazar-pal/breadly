-- Custom SQL migration file, put your code below! --

/*
================================================================================
MIGRATION 0004: Transaction Table Triggers
================================================================================
Purpose: Enforce all validation rules on the transactions table including
         multi-tenant security, currency consistency, and category type matching.

Triggers defined in this file:
  1. trg_validate_account_ownership    - Account ownership validation
  2. trg_validate_category_ownership   - Category ownership validation
  3. trg_validate_event_ownership      - Event ownership validation
  4. transaction_currency_validation_insert  - Currency consistency (INSERT)
  5. transaction_currency_validation_update  - Currency consistency (UPDATE)
  6. trg_validate_transaction_category_type  - Category type matching (INSERT)
  7. trg_validate_transaction_category_type_update - Category type matching (UPDATE)

Security Rules:
  - Users can only create transactions using their own accounts
  - Users can only reference their own categories in transactions
  - Users can only link transactions to events they own
  - For transfers, both source and destination accounts must belong to the user
  - Transaction currency must match the associated account currency

Business Rules:
  - Expense transactions can only use expense categories
  - Income transactions can only use income categories
  - Transfer category restriction handled by CHECK constraint
================================================================================
*/


-- ============================================================================
-- SECTION 1: OWNERSHIP VALIDATIONS (Multi-Tenant Security)
-- ============================================================================

-- ----------------------------------------------------------------------------
-- FUNCTION: validate_account_ownership()
-- ----------------------------------------------------------------------------
-- Purpose: Ensure users can only use accounts they own
-- Trigger Operations: INSERT, UPDATE
--
-- Security Checks:
--   1. Verify account_id belongs to the user
--   2. For transfers, verify counter_account_id also belongs to the user
--   3. Prevent cross-user account access in multi-tenant system
-- ----------------------------------------------------------------------------

CREATE OR REPLACE FUNCTION validate_account_ownership()
RETURNS trigger LANGUAGE plpgsql AS $$
BEGIN
  -- Non-transfer: only validate ownership if an account is provided
  -- NOTE: This function was improved in migration 0015_improve-ownership-error-messages.sql
  --       to distinguish between missing accounts and ownership mismatches with detailed error messages
  IF NEW.type <> 'transfer' THEN
    IF NEW.account_id IS NOT NULL THEN
      IF NOT EXISTS (
        SELECT 1 FROM accounts 
        WHERE id = NEW.account_id AND user_id = NEW.user_id
      ) THEN
        RAISE EXCEPTION 'Account does not belong to user';
      END IF;
    END IF;

  -- Transfer: validate ownership for both accounts
  -- Note: CHECK constraints guarantee both account_id and counter_account_id are NOT NULL
  ELSE
    IF NOT EXISTS (
      SELECT 1 FROM accounts 
      WHERE id = NEW.account_id AND user_id = NEW.user_id
    ) THEN
      RAISE EXCEPTION 'Account does not belong to user';
    END IF;

    IF NOT EXISTS (
      SELECT 1 FROM accounts 
      WHERE id = NEW.counter_account_id AND user_id = NEW.user_id
    ) THEN
      RAISE EXCEPTION 'Counter account does not belong to user';
    END IF;
  END IF;
  
  RETURN NEW;
END $$;


-- TRIGGER: trg_validate_account_ownership
CREATE TRIGGER trg_validate_account_ownership
BEFORE INSERT OR UPDATE ON transactions
FOR EACH ROW EXECUTE FUNCTION validate_account_ownership();


-- ----------------------------------------------------------------------------
-- FUNCTION: validate_category_ownership()
-- ----------------------------------------------------------------------------
-- Purpose: Ensure users can only use categories they own
-- Trigger Operations: INSERT, UPDATE
--
-- Security Check:
--   Verify category_id (if provided) belongs to the user
--   Prevents cross-user category access in multi-tenant system
-- ----------------------------------------------------------------------------

CREATE OR REPLACE FUNCTION validate_category_ownership()
RETURNS trigger LANGUAGE plpgsql AS $$
BEGIN
  -- Only validate if a category is specified (category_id is optional)
  -- NOTE: This function was improved in migration 0015_improve-ownership-error-messages.sql
  --       to distinguish between missing categories and ownership mismatches with detailed error messages
  IF NEW.category_id IS NOT NULL THEN
    
    -- Verify that category_id belongs to the user creating the transaction
    IF NOT EXISTS (
      SELECT 1 FROM categories 
      WHERE id = NEW.category_id AND user_id = NEW.user_id
    ) THEN
      RAISE EXCEPTION 'Category does not belong to user';
    END IF;
  END IF;
  
  RETURN NEW;
END $$;


-- TRIGGER: trg_validate_category_ownership
CREATE TRIGGER trg_validate_category_ownership
BEFORE INSERT OR UPDATE ON transactions
FOR EACH ROW EXECUTE FUNCTION validate_category_ownership();


-- ----------------------------------------------------------------------------
-- FUNCTION: validate_event_ownership()
-- ----------------------------------------------------------------------------
-- Purpose: Ensure users can only link transactions to events they own
-- Trigger Operations: INSERT, UPDATE
--
-- Security Check:
--   Verify event_id (if provided) belongs to the user
--   Prevents cross-user event access in multi-tenant system
-- ----------------------------------------------------------------------------

CREATE OR REPLACE FUNCTION validate_event_ownership()
RETURNS trigger LANGUAGE plpgsql AS $$
BEGIN
  -- Only validate if an event is specified (event_id is optional)
  -- NOTE: This function was improved in migration 0015_improve-ownership-error-messages.sql
  --       to distinguish between missing events and ownership mismatches with detailed error messages
  IF NEW.event_id IS NOT NULL THEN
    IF NOT EXISTS (
      SELECT 1 FROM events 
      WHERE id = NEW.event_id AND user_id = NEW.user_id
    ) THEN
      RAISE EXCEPTION 'Event does not belong to user';
    END IF;
  END IF;
  
  RETURN NEW;
END $$;


-- TRIGGER: trg_validate_event_ownership
CREATE TRIGGER trg_validate_event_ownership
BEFORE INSERT OR UPDATE ON transactions
FOR EACH ROW EXECUTE FUNCTION validate_event_ownership();


-- ============================================================================
-- SECTION 2: CURRENCY VALIDATION
-- ============================================================================

-- ----------------------------------------------------------------------------
-- FUNCTION: validate_transaction_currency()
-- ----------------------------------------------------------------------------
-- Purpose: Ensure transaction currency matches account currency
-- Trigger Operations: INSERT, UPDATE
--
-- Currency Rules:
--   - For non-transfers: transaction currency must match account currency
--   - For transfers: currency must match both source and destination accounts
--   - Accountless transactions are allowed and not validated
-- ----------------------------------------------------------------------------

CREATE OR REPLACE FUNCTION validate_transaction_currency()
RETURNS TRIGGER AS $$
BEGIN
  -- Non-transfer: allow accountless transactions; validate only if account_id is provided
  IF NEW.type <> 'transfer' THEN
    IF NEW.account_id IS NOT NULL THEN
      IF NOT EXISTS (
        SELECT 1 FROM accounts 
        WHERE id = NEW.account_id 
        AND currency_id = NEW.currency_id
      ) THEN
        RAISE EXCEPTION 'Transaction currency (%) does not match account currency. Account ID: %', 
          NEW.currency_id, NEW.account_id;
      END IF;
    END IF;

  -- Transfer: validate both currencies match
  -- Note: CHECK constraints guarantee both account_id and counter_account_id are NOT NULL
  ELSE
    IF NOT EXISTS (
      SELECT 1 FROM accounts 
      WHERE id = NEW.account_id 
      AND currency_id = NEW.currency_id
    ) THEN
      RAISE EXCEPTION 'Transaction currency (%) does not match account currency. Account ID: %', 
        NEW.currency_id, NEW.account_id;
    END IF;

    IF NOT EXISTS (
      SELECT 1 FROM accounts 
      WHERE id = NEW.counter_account_id 
      AND currency_id = NEW.currency_id
    ) THEN
      RAISE EXCEPTION 'Transfer currency (%) does not match counter-account currency. Counter Account ID: %', 
        NEW.currency_id, NEW.counter_account_id;
    END IF;
  END IF;

  RETURN NEW;
END;
$$ LANGUAGE plpgsql;


-- TRIGGER: transaction_currency_validation_insert
CREATE TRIGGER transaction_currency_validation_insert
  BEFORE INSERT ON transactions
  FOR EACH ROW
  EXECUTE FUNCTION validate_transaction_currency();


-- TRIGGER: transaction_currency_validation_update
CREATE TRIGGER transaction_currency_validation_update
  BEFORE UPDATE ON transactions
  FOR EACH ROW
  WHEN (
    OLD.account_id IS DISTINCT FROM NEW.account_id
    OR OLD.counter_account_id IS DISTINCT FROM NEW.counter_account_id
    OR OLD.currency_id IS DISTINCT FROM NEW.currency_id
    OR OLD.type IS DISTINCT FROM NEW.type
  )
  EXECUTE FUNCTION validate_transaction_currency();


-- ============================================================================
-- SECTION 3: CATEGORY TYPE MATCHING
-- ============================================================================

-- ----------------------------------------------------------------------------
-- FUNCTION: validate_transaction_category_type()
-- ----------------------------------------------------------------------------
-- Purpose: Ensure transaction type matches category type
-- Trigger Operations: INSERT, UPDATE
--
-- Type Matching Rules:
--   - Expense transactions can only use expense categories
--   - Income transactions can only use income categories
--
-- Note: "Transfer transactions cannot have a category" is enforced by
--       CHECK constraint `transactions_transfer_no_category`, not here.
-- ----------------------------------------------------------------------------

CREATE OR REPLACE FUNCTION validate_transaction_category_type()
RETURNS TRIGGER AS $$
DECLARE
  category_type text;
BEGIN
  -- Validate category type matches transaction type (if category is set)
  -- Note: Transfers cannot have categories (enforced by CHECK constraint),
  -- so this block only runs for expense/income transactions.
  IF NEW.category_id IS NOT NULL THEN
    -- NOTE: This function was fixed in migration 0014_fix-enum-type-comparison-triggers.sql
    --       to cast enum values to text (type::text) to avoid PostgreSQL operator mismatch errors
    SELECT type INTO category_type
    FROM categories
    WHERE id = NEW.category_id;

    -- Category should exist (FK constraint handles this, but double-check for clarity)
    IF category_type IS NULL THEN
      RAISE EXCEPTION 'Category not found. Category ID: %', NEW.category_id;
    END IF;

    -- Category type must match transaction type
    -- NOTE: Fixed in migration 0014 - comparison now uses NEW.type::text
    IF category_type != NEW.type THEN
      RAISE EXCEPTION 'Transaction type (%) does not match category type (%). Category ID: %',
        NEW.type, category_type, NEW.category_id;
    END IF;
  END IF;

  RETURN NEW;
END;
$$ LANGUAGE plpgsql;


-- TRIGGER: trg_validate_transaction_category_type (INSERT)
CREATE TRIGGER trg_validate_transaction_category_type
  BEFORE INSERT ON transactions
  FOR EACH ROW
  EXECUTE FUNCTION validate_transaction_category_type();


-- TRIGGER: trg_validate_transaction_category_type_update (UPDATE)
CREATE TRIGGER trg_validate_transaction_category_type_update
  BEFORE UPDATE ON transactions
  FOR EACH ROW
  WHEN (
    OLD.category_id IS DISTINCT FROM NEW.category_id
    OR OLD.type IS DISTINCT FROM NEW.type
  )
  EXECUTE FUNCTION validate_transaction_category_type();


-- ============================================================================
-- COMMENTS AND DOCUMENTATION
-- ============================================================================

-- Ownership functions
COMMENT ON FUNCTION validate_account_ownership() IS 
'Ensures users can only use accounts they own in transactions; validates both accounts for transfers';

COMMENT ON FUNCTION validate_category_ownership() IS 
'Ensures users can only reference categories they own in transactions';

COMMENT ON FUNCTION validate_event_ownership() IS 
'Ensures users can only reference events they own in transactions';

-- Currency functions
COMMENT ON FUNCTION validate_transaction_currency() IS 
'Validates that transaction currency matches both account and counter-account currencies for transfers';

-- Category type functions
COMMENT ON FUNCTION validate_transaction_category_type() IS 
'Validates that transaction type matches category type: expense→expense, income→income. Transfer category check handled by CHECK constraint.';

-- Triggers
COMMENT ON TRIGGER trg_validate_account_ownership ON transactions IS 
'Enforces account ownership on INSERT and UPDATE';

COMMENT ON TRIGGER trg_validate_category_ownership ON transactions IS 
'Enforces category ownership on INSERT and UPDATE';

COMMENT ON TRIGGER trg_validate_event_ownership ON transactions IS 
'Enforces event ownership on INSERT and UPDATE';

COMMENT ON TRIGGER transaction_currency_validation_insert ON transactions IS 
'Ensures currency consistency when creating new transactions';

COMMENT ON TRIGGER transaction_currency_validation_update ON transactions IS 
'Ensures currency consistency when updating transaction account/currency fields';

COMMENT ON TRIGGER trg_validate_transaction_category_type ON transactions IS 
'Enforces category type matching on transaction INSERT';

COMMENT ON TRIGGER trg_validate_transaction_category_type_update ON transactions IS 
'Enforces category type matching on transaction UPDATE when category_id or type changes';

