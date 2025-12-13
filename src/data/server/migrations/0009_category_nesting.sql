-- Custom SQL migration file, put your code below! --

/*
================================================================================
MIGRATION 0009: Category Nesting Constraint
================================================================================
Purpose: Enforce maximum 2-level nesting for categories (parent → child only, no grandchildren)

Business Rules Enforced:
- Categories can only be nested one level deep (parent_id must reference a root category)
- Root categories (parent_id = NULL) are always allowed
- Child categories must have a parent with parent_id = NULL
- Grandchildren are prohibited
================================================================================
*/

-- ============================================================================
-- FUNCTION: validate_category_nesting()
-- ============================================================================
-- Purpose: Ensure categories cannot be nested more than one level deep
-- Trigger Operations: INSERT, UPDATE (on parent_id)
--
-- Nesting Rules:
--   - Root categories (parent_id = NULL) are always allowed
--   - Child categories must have a parent with parent_id = NULL
--   - Grandchildren (parent's parent_id IS NOT NULL) are prohibited
-- ============================================================================

CREATE OR REPLACE FUNCTION validate_category_nesting()
RETURNS TRIGGER AS $$
BEGIN
  -- Only validate if parent_id is being set
  IF NEW.parent_id IS NOT NULL THEN
    -- Check if the parent category has a parent (would make this a grandchild)
    IF EXISTS (
      SELECT 1 FROM categories 
      WHERE id = NEW.parent_id 
      AND parent_id IS NOT NULL
    ) THEN
      RAISE EXCEPTION 'Cannot nest categories more than one level deep. Category "%" cannot be a child of a subcategory.', 
        NEW.name;
    END IF;
  END IF;

  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- ============================================================================
-- TRIGGER: trg_validate_category_nesting
-- ============================================================================
-- Purpose: Execute category nesting validation before INSERT or UPDATE
-- Timing: BEFORE (prevents invalid nesting from being committed)
-- Events: INSERT, UPDATE on categories table
-- ============================================================================

CREATE TRIGGER trg_validate_category_nesting
  BEFORE INSERT OR UPDATE ON categories
  FOR EACH ROW
  WHEN (NEW.parent_id IS NOT NULL)
  EXECUTE FUNCTION validate_category_nesting();

-- ============================================================================
-- COMMENTS AND DOCUMENTATION
-- ============================================================================

COMMENT ON FUNCTION validate_category_nesting() IS 
'Ensures categories cannot be nested more than one level deep (parent → child only, no grandchildren)';

COMMENT ON TRIGGER trg_validate_category_nesting ON categories IS 
'Enforces maximum 2-level category nesting on INSERT and UPDATE';
