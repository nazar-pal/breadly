-- Custom SQL migration file, put your code below! --

/*
================================================================================
MIGRATION 0013: Budget and Transaction-Attachment Ownership Validation
================================================================================
Purpose: Enforce ownership and type validation for budgets and transaction-attachments

Business Rules Enforced:
1. Budgets can only be created for expense categories (not income)
2. Budget's category must belong to the same user as the budget
3. Transaction-attachment links must reference entities owned by the same user

These constraints were identified as missing server-side validation that could
lead to data inconsistency if client validation was bypassed.
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
-- Condition: Always (category_id is required)
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
-- FUNCTION: validate_transaction_attachment_ownership()
-- ============================================================================
-- Purpose: Ensure both transaction and attachment belong to the user
-- Trigger Operations: INSERT, UPDATE (on transaction_id, attachment_id, or user_id)
--
-- Validation Rules:
--   1. Transaction must belong to the user creating the link
--   2. Attachment must belong to the user creating the link
-- ============================================================================

CREATE OR REPLACE FUNCTION validate_transaction_attachment_ownership()
RETURNS TRIGGER AS $$
BEGIN
  -- Validate transaction belongs to user
  IF NOT EXISTS (
    SELECT 1 FROM transactions 
    WHERE id = NEW.transaction_id AND user_id = NEW.user_id
  ) THEN
    RAISE EXCEPTION 'Transaction does not belong to user. Transaction ID: %, User ID: %',
      NEW.transaction_id, NEW.user_id;
  END IF;

  -- Validate attachment belongs to user
  IF NOT EXISTS (
    SELECT 1 FROM attachments 
    WHERE id = NEW.attachment_id AND user_id = NEW.user_id
  ) THEN
    RAISE EXCEPTION 'Attachment does not belong to user. Attachment ID: %, User ID: %',
      NEW.attachment_id, NEW.user_id;
  END IF;
  
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;


-- ============================================================================
-- TRIGGERS: trg_validate_transaction_attachment_ownership
-- ============================================================================
-- Purpose: Execute ownership validation before INSERT or UPDATE
-- Timing: BEFORE (prevents unauthorized links from being committed)
-- Events: INSERT, UPDATE on transaction_attachments table
-- ============================================================================

CREATE TRIGGER trg_validate_transaction_attachment_ownership
  BEFORE INSERT ON transaction_attachments
  FOR EACH ROW
  EXECUTE FUNCTION validate_transaction_attachment_ownership();

CREATE TRIGGER trg_validate_transaction_attachment_ownership_update
  BEFORE UPDATE ON transaction_attachments
  FOR EACH ROW
  WHEN (
    OLD.transaction_id IS DISTINCT FROM NEW.transaction_id
    OR OLD.attachment_id IS DISTINCT FROM NEW.attachment_id
    OR OLD.user_id IS DISTINCT FROM NEW.user_id
  )
  EXECUTE FUNCTION validate_transaction_attachment_ownership();


-- ============================================================================
-- COMMENTS AND DOCUMENTATION
-- ============================================================================

COMMENT ON FUNCTION validate_budget_category() IS 
'Validates that budget category belongs to user and is an expense category (not income)';

COMMENT ON TRIGGER trg_validate_budget_category ON budgets IS 
'Enforces category ownership and type validation on budget INSERT';

COMMENT ON TRIGGER trg_validate_budget_category_update ON budgets IS 
'Enforces category ownership and type validation on budget UPDATE when category_id or user_id changes';

COMMENT ON FUNCTION validate_transaction_attachment_ownership() IS 
'Validates that both transaction and attachment belong to the user creating the link';

COMMENT ON TRIGGER trg_validate_transaction_attachment_ownership ON transaction_attachments IS 
'Enforces ownership validation on transaction-attachment INSERT';

COMMENT ON TRIGGER trg_validate_transaction_attachment_ownership_update ON transaction_attachments IS 
'Enforces ownership validation on transaction-attachment UPDATE when IDs change';
