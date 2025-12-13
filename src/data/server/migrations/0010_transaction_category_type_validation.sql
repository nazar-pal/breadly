-- Custom SQL migration file, put your code below! --

/*
================================================================================
MIGRATION 0010: Transaction Category Type Validation
================================================================================
Purpose: Enforce transaction category type matching

Business Rules Enforced:
- Expense transactions can only use expense categories
- Income transactions can only use income categories
- Transfer transactions cannot have a category_id (must be NULL)
================================================================================
*/

-- ============================================================================
-- FUNCTION: validate_transaction_category_type()
-- ============================================================================
-- Purpose: Ensure transaction type matches category type
-- Trigger Operations: INSERT, UPDATE
--
-- Type Matching Rules:
--   - Expense transactions can only use expense categories
--   - Income transactions can only use income categories
--   - Transfer transactions cannot have a category_id (must be NULL)
-- ============================================================================

CREATE OR REPLACE FUNCTION validate_transaction_category_type()
RETURNS TRIGGER AS $$
DECLARE
  category_type text;
BEGIN
  -- Rule 1: Transfer transactions cannot have a category
  IF NEW.type = 'transfer' AND NEW.category_id IS NOT NULL THEN
    RAISE EXCEPTION 'Transfer transactions cannot have a category. Transaction type: %, Category ID: %',
      NEW.type, NEW.category_id;
  END IF;

  -- Rule 2: For expense/income, category type must match transaction type (if category is set)
  IF NEW.category_id IS NOT NULL AND NEW.type != 'transfer' THEN
    SELECT type INTO category_type
    FROM categories
    WHERE id = NEW.category_id;

    -- Category should exist (FK constraint handles this, but double-check for clarity)
    IF category_type IS NULL THEN
      RAISE EXCEPTION 'Category not found. Category ID: %', NEW.category_id;
    END IF;

    -- Category type must match transaction type
    IF category_type != NEW.type THEN
      RAISE EXCEPTION 'Transaction type (%) does not match category type (%). Category ID: %',
        NEW.type, category_type, NEW.category_id;
    END IF;
  END IF;

  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- ============================================================================
-- TRIGGERS: trg_validate_transaction_category_type
-- ============================================================================
-- Purpose: Execute category type validation before INSERT or UPDATE
-- Timing: BEFORE (prevents mismatched category types from being committed)
-- Events: INSERT, UPDATE on transactions table
-- Condition: Only when category_id or type is being set/changed
-- ============================================================================

CREATE TRIGGER trg_validate_transaction_category_type
  BEFORE INSERT ON transactions
  FOR EACH ROW
  EXECUTE FUNCTION validate_transaction_category_type();

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

COMMENT ON FUNCTION validate_transaction_category_type() IS 
'Validates that transaction type matches category type: expense→expense, income→income, transfer→no category';

COMMENT ON TRIGGER trg_validate_transaction_category_type ON transactions IS 
'Enforces category type matching on transaction INSERT';

COMMENT ON TRIGGER trg_validate_transaction_category_type_update ON transactions IS 
'Enforces category type matching on transaction UPDATE when category_id or type changes';
