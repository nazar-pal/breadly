-- Custom SQL migration file, put your code below! --

/*
================================================================================
MIGRATION 0001: Category Table Triggers
================================================================================
Purpose: Enforce validation rules on the categories table including
         nesting constraints and parent-child type matching.

Triggers defined in this file:
  1. trg_validate_category_nesting       - Maximum 2-level nesting
  2. trg_validate_category_parent_type   - Parent type matching (INSERT)
  3. trg_validate_category_parent_type_update - Parent type matching (UPDATE)
  4. trg_validate_category_type_change   - Prevent type change when referenced

Business Rules:
  - Categories can only be nested one level deep (parent → child, no grandchildren)
  - Child categories must have the same type as their parent (income → income, expense → expense)
  - Root categories (parent_id = NULL) are always allowed
  - Category type cannot be changed when transactions or budgets reference it
================================================================================
*/


-- ============================================================================
-- SECTION 1: CATEGORY NESTING VALIDATION
-- ============================================================================

-- ----------------------------------------------------------------------------
-- FUNCTION: validate_category_nesting()
-- ----------------------------------------------------------------------------
-- Purpose: Ensure categories cannot be nested more than one level deep
-- Trigger Operations: INSERT, UPDATE (on parent_id)
--
-- Nesting Rules:
--   - Root categories (parent_id = NULL) are always allowed
--   - Child categories must have a parent with parent_id = NULL
--   - Grandchildren (parent's parent_id IS NOT NULL) are prohibited
-- ----------------------------------------------------------------------------

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


-- TRIGGER: trg_validate_category_nesting
CREATE TRIGGER trg_validate_category_nesting
  BEFORE INSERT OR UPDATE ON categories
  FOR EACH ROW
  WHEN (NEW.parent_id IS NOT NULL)
  EXECUTE FUNCTION validate_category_nesting();


-- ============================================================================
-- SECTION 2: CATEGORY PARENT TYPE MATCHING
-- ============================================================================

-- ----------------------------------------------------------------------------
-- FUNCTION: validate_category_parent_type()
-- ----------------------------------------------------------------------------
-- Purpose: Ensure child category type matches parent category type
-- Trigger Operations: INSERT, UPDATE (on parent_id or type)
--
-- Type Matching Rules:
--   - Root categories (parent_id = NULL) are always allowed
--   - Child categories must have the same type as their parent
--   - Prevents income categories under expense parents and vice versa
-- ----------------------------------------------------------------------------

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


-- TRIGGER: trg_validate_category_parent_type (INSERT)
CREATE TRIGGER trg_validate_category_parent_type
  BEFORE INSERT ON categories
  FOR EACH ROW
  WHEN (NEW.parent_id IS NOT NULL)
  EXECUTE FUNCTION validate_category_parent_type();


-- TRIGGER: trg_validate_category_parent_type_update (UPDATE)
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
-- SECTION 3: CATEGORY TYPE CHANGE PROTECTION
-- ============================================================================

-- ----------------------------------------------------------------------------
-- FUNCTION: validate_category_type_change()
-- ----------------------------------------------------------------------------
-- Purpose: Prevent changing category type when transactions or budgets reference it
-- Trigger Operations: UPDATE (on type)
--
-- Business Rules:
--   - Category type cannot be changed if transactions exist for this category
--   - Category type cannot be changed if budgets exist for this category
--   - Prevents data integrity issues from type mismatches
-- ----------------------------------------------------------------------------

CREATE OR REPLACE FUNCTION validate_category_type_change()
RETURNS TRIGGER AS $$
BEGIN
  IF OLD.type IS DISTINCT FROM NEW.type THEN
    IF EXISTS (SELECT 1 FROM transactions WHERE category_id = NEW.id LIMIT 1) THEN
      RAISE EXCEPTION 'Cannot change category type: transactions exist for this category. Category ID: %', NEW.id;
    END IF;
    IF EXISTS (SELECT 1 FROM budgets WHERE category_id = NEW.id LIMIT 1) THEN
      RAISE EXCEPTION 'Cannot change category type: budgets exist for this category. Category ID: %', NEW.id;
    END IF;
  END IF;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;


-- TRIGGER: trg_validate_category_type_change
CREATE TRIGGER trg_validate_category_type_change
  BEFORE UPDATE ON categories
  FOR EACH ROW
  WHEN (OLD.type IS DISTINCT FROM NEW.type)
  EXECUTE FUNCTION validate_category_type_change();


-- ============================================================================
-- COMMENTS AND DOCUMENTATION
-- ============================================================================

COMMENT ON FUNCTION validate_category_nesting() IS 
'Ensures categories cannot be nested more than one level deep (parent → child only, no grandchildren)';

COMMENT ON FUNCTION validate_category_parent_type() IS 
'Validates that child category type matches parent category type: income→income, expense→expense';

COMMENT ON FUNCTION validate_category_type_change() IS 
'Prevents changing category type when transactions or budgets reference the category';

COMMENT ON TRIGGER trg_validate_category_nesting ON categories IS 
'Enforces maximum 2-level category nesting on INSERT and UPDATE';

COMMENT ON TRIGGER trg_validate_category_parent_type ON categories IS 
'Enforces category type matching on category INSERT when parent_id is set';

COMMENT ON TRIGGER trg_validate_category_parent_type_update ON categories IS 
'Enforces category type matching on category UPDATE when parent_id or type changes';

COMMENT ON TRIGGER trg_validate_category_type_change ON categories IS 
'Prevents category type changes when transactions or budgets reference the category';

