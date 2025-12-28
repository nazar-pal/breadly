-- Custom SQL migration file, put your code below! --

/*
================================================================================
MIGRATION 0014: Fix Enum Type Comparison in Trigger Functions
================================================================================
Purpose: Fix PostgreSQL trigger functions that fail due to enum-to-text type
         mismatches when comparing enum values.

Issue:
  PostgreSQL cannot directly compare `text` variables with custom enum types.
  When a trigger function SELECTs an enum value INTO a text variable and then
  compares it with another enum column, PostgreSQL throws:
    "operator does not exist: text <> transaction_type"

Root Cause:
  The original trigger functions declared variables as `text` and selected enum
  values into them. When comparing these text variables with enum columns,
  PostgreSQL cannot find a matching comparison operator.

Fix:
  Cast enum values to text using `::text` in both the SELECT statement and
  the comparison. This ensures both sides of the comparison are text, allowing
  PostgreSQL to perform the comparison correctly.

Affected Functions:
  1. validate_transaction_category_type() - CRITICAL (causing transaction insert failures)
  2. validate_category_parent_type() - Potential issue (same pattern)

Migration Strategy:
  Use CREATE OR REPLACE FUNCTION to update the existing functions without
  dropping/recreating triggers. This is safe because:
  - The function signatures remain unchanged
  - Triggers automatically use the updated function definitions
  - No data migration is required
================================================================================
*/


-- ============================================================================
-- SECTION 1: FIX validate_transaction_category_type()
-- ============================================================================
-- Original Issue: Comparing text variable with transaction_type enum
-- Fix: Cast both sides to text for comparison
-- ============================================================================

CREATE OR REPLACE FUNCTION validate_transaction_category_type()
RETURNS TRIGGER AS $$
DECLARE
  category_type text;
BEGIN
  -- Validate category type matches transaction type (if category is set)
  -- Note: Transfers cannot have categories (enforced by CHECK constraint),
  -- so this block only runs for expense/income transactions.
  IF NEW.category_id IS NOT NULL THEN
    -- Cast enum to text when selecting into variable
    SELECT type::text INTO category_type
    FROM categories
    WHERE id = NEW.category_id;

    -- Category should exist (FK constraint handles this, but double-check for clarity)
    IF category_type IS NULL THEN
      RAISE EXCEPTION 'Category not found. Category ID: %', NEW.category_id;
    END IF;

    -- Category type must match transaction type
    -- Cast both sides to text for comparison (text != text works)
    IF category_type != NEW.type::text THEN
      RAISE EXCEPTION 'Transaction type (%) does not match category type (%). Category ID: %',
        NEW.type, category_type, NEW.category_id;
    END IF;
  END IF;

  RETURN NEW;
END;
$$ LANGUAGE plpgsql;


-- ============================================================================
-- SECTION 2: FIX validate_category_parent_type()
-- ============================================================================
-- Original Issue: Comparing text variable with category_type enum
-- Fix: Cast both sides to text for comparison
-- ============================================================================

CREATE OR REPLACE FUNCTION validate_category_parent_type()
RETURNS TRIGGER AS $$
DECLARE
  parent_type text;
BEGIN
  -- Only validate if parent_id is being set
  IF NEW.parent_id IS NOT NULL THEN
    -- Cast enum to text when selecting into variable
    SELECT type::text INTO parent_type
    FROM categories
    WHERE id = NEW.parent_id;

    -- Parent should exist (FK constraint handles this, but double-check for clarity)
    IF parent_type IS NULL THEN
      RAISE EXCEPTION 'Parent category not found. Parent ID: %', NEW.parent_id;
    END IF;

    -- Category type must match parent type
    -- Cast both sides to text for comparison (text != text works)
    IF parent_type != NEW.type::text THEN
      RAISE EXCEPTION 'Child category type (%) must match parent category type (%). Category: %, Parent ID: %',
        NEW.type, parent_type, NEW.name, NEW.parent_id;
    END IF;
  END IF;

  RETURN NEW;
END;
$$ LANGUAGE plpgsql;


-- ============================================================================
-- COMMENTS AND DOCUMENTATION
-- ============================================================================

COMMENT ON FUNCTION validate_transaction_category_type() IS 
'Validates that transaction type matches category type: expense→expense, income→income. Transfer category check handled by CHECK constraint. FIXED: Casts enum values to text for comparison to avoid PostgreSQL operator mismatch errors.';

COMMENT ON FUNCTION validate_category_parent_type() IS 
'Validates that child category type matches parent category type: income→income, expense→expense. FIXED: Casts enum values to text for comparison to avoid PostgreSQL operator mismatch errors.';
