-- Custom SQL migration file, put your code below! --

/*
================================================================================
MIGRATION 0012: Category Parent Type Validation
================================================================================
Purpose: Enforce that child categories must have the same type as their parent.

Business Rules Enforced:
- Child categories must have the same type (income/expense) as their parent
- Root categories (parent_id = NULL) are always allowed
- Prevents mixing income and expense categories in the same hierarchy

This constraint was already enforced on the client side but was missing on the
server, creating a potential data inconsistency if client validation was bypassed.
================================================================================
*/

-- ============================================================================
-- FUNCTION: validate_category_parent_type()
-- ============================================================================
-- Purpose: Ensure child category type matches parent category type
-- Trigger Operations: INSERT, UPDATE (on parent_id or type)
--
-- Type Matching Rules:
--   - Root categories (parent_id = NULL) are always allowed
--   - Child categories must have the same type as their parent
--   - Prevents income categories under expense parents and vice versa
-- ============================================================================

CREATE OR REPLACE FUNCTION validate_category_parent_type()
RETURNS TRIGGER AS $$
DECLARE
  parent_type text;
BEGIN
  -- Only validate if parent_id is being set
  IF NEW.parent_id IS NOT NULL THEN
    -- Get the parent category's type
    SELECT type INTO parent_type
    FROM categories
    WHERE id = NEW.parent_id;

    -- Parent should exist (FK constraint handles this, but double-check for clarity)
    IF parent_type IS NULL THEN
      RAISE EXCEPTION 'Parent category not found. Parent ID: %', NEW.parent_id;
    END IF;

    -- Category type must match parent type
    IF parent_type != NEW.type THEN
      RAISE EXCEPTION 'Child category type (%) must match parent category type (%). Category: %, Parent ID: %',
        NEW.type, parent_type, NEW.name, NEW.parent_id;
    END IF;
  END IF;

  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- ============================================================================
-- TRIGGERS: trg_validate_category_parent_type
-- ============================================================================
-- Purpose: Execute category parent type validation before INSERT or UPDATE
-- Timing: BEFORE (prevents mismatched types from being committed)
-- Events: INSERT, UPDATE on categories table
-- Condition: Only when parent_id or type is being set/changed
-- ============================================================================

CREATE TRIGGER trg_validate_category_parent_type
  BEFORE INSERT ON categories
  FOR EACH ROW
  WHEN (NEW.parent_id IS NOT NULL)
  EXECUTE FUNCTION validate_category_parent_type();

CREATE TRIGGER trg_validate_category_parent_type_update
  BEFORE UPDATE ON categories
  FOR EACH ROW
  WHEN (
    NEW.parent_id IS NOT NULL
    AND (
      OLD.parent_id IS DISTINCT FROM NEW.parent_id
      OR OLD.type IS DISTINCT FROM NEW.type
    )
  )
  EXECUTE FUNCTION validate_category_parent_type();

-- ============================================================================
-- COMMENTS AND DOCUMENTATION
-- ============================================================================

COMMENT ON FUNCTION validate_category_parent_type() IS 
'Validates that child category type matches parent category type: income→income, expense→expense';

COMMENT ON TRIGGER trg_validate_category_parent_type ON categories IS 
'Enforces category type matching on category INSERT when parent_id is set';

COMMENT ON TRIGGER trg_validate_category_parent_type_update ON categories IS 
'Enforces category type matching on category UPDATE when parent_id or type changes';
