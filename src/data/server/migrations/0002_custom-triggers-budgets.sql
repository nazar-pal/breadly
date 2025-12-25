-- Custom SQL migration file, put your code below! --

/*
================================================================================
MIGRATION 0002: Budget Table Triggers
================================================================================
Purpose: Enforce validation rules on the budgets table including
         category ownership and expense type validation.

Triggers defined in this file:
  1. trg_validate_budget_category        - Category validation (INSERT)
  2. trg_validate_budget_category_update - Category validation (UPDATE)

Business Rules:
  - Budgets can only be created for expense categories (not income)
  - Budget's category must belong to the same user as the budget
================================================================================
*/


-- ============================================================================
-- FUNCTION: validate_budget_category()
-- ============================================================================
-- Purpose: Ensure budget's category is an expense category owned by the user
-- Trigger Operations: INSERT, UPDATE (on category_id or user_id)
--
-- Validation Rules:
--   1. Category must belong to the user creating the budget
--   2. Category must be of type 'expense' (budgets don't apply to income)
-- ============================================================================

CREATE OR REPLACE FUNCTION validate_budget_category()
RETURNS TRIGGER AS $$
DECLARE
  category_record RECORD;
BEGIN
  -- Fetch the category's type and user_id
  SELECT type, user_id INTO category_record
  FROM categories
  WHERE id = NEW.category_id;

  -- Category should exist (FK constraint handles this, but double-check for clarity)
  IF category_record IS NULL THEN
    RAISE EXCEPTION 'Category not found. Category ID: %', NEW.category_id;
  END IF;

  -- Validate category belongs to the user (ownership check)
  IF category_record.user_id != NEW.user_id THEN
    RAISE EXCEPTION 'Category does not belong to user. Category ID: %, Budget User: %, Category User: %',
      NEW.category_id, NEW.user_id, category_record.user_id;
  END IF;

  -- Validate category is an expense category (budgets only for spending limits)
  IF category_record.type != 'expense' THEN
    RAISE EXCEPTION 'Budgets can only be created for expense categories. Category ID: %, Category Type: %',
      NEW.category_id, category_record.type;
  END IF;

  RETURN NEW;
END;
$$ LANGUAGE plpgsql;


-- ============================================================================
-- TRIGGERS: trg_validate_budget_category
-- ============================================================================
-- Purpose: Execute budget category validation before INSERT or UPDATE
-- Timing: BEFORE (prevents invalid data from being committed)
-- Events: INSERT, UPDATE on budgets table
-- ============================================================================

CREATE TRIGGER trg_validate_budget_category
  BEFORE INSERT ON budgets
  FOR EACH ROW
  EXECUTE FUNCTION validate_budget_category();


CREATE TRIGGER trg_validate_budget_category_update
  BEFORE UPDATE ON budgets
  FOR EACH ROW
  WHEN (
    OLD.category_id IS DISTINCT FROM NEW.category_id
    OR OLD.user_id IS DISTINCT FROM NEW.user_id
  )
  EXECUTE FUNCTION validate_budget_category();


-- ============================================================================
-- COMMENTS AND DOCUMENTATION
-- ============================================================================

COMMENT ON FUNCTION validate_budget_category() IS 
'Validates that budget category belongs to user and is an expense category (not income)';

COMMENT ON TRIGGER trg_validate_budget_category ON budgets IS 
'Enforces category ownership and type validation on budget INSERT';

COMMENT ON TRIGGER trg_validate_budget_category_update ON budgets IS 
'Enforces category ownership and type validation on budget UPDATE when category_id or user_id changes';

