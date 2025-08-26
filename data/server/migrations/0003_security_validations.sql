-- Custom SQL migration file, put your code below! --

/*
================================================================================
MIGRATION: 0003 - Multi-Tenant Security Validations
================================================================================
Purpose: Enforce multi-tenant security by ensuring users can only access
         their own accounts and categories, preventing cross-user data access.

Functions:
- validate_account_ownership(): Validates user owns referenced accounts
- validate_category_ownership(): Validates user owns referenced categories  
- Associated triggers for both functions

Security Rules:
- Users can only create transactions using their own accounts
- Users can only reference their own categories in transactions
- Transfer transactions must use accounts owned by the same user
- Prevents unauthorized cross-tenant data access
================================================================================
*/


-- ============================================================================
-- FUNCTION: validate_account_ownership()
-- ============================================================================
-- Purpose: Ensure users can only use accounts they own
-- Trigger Operations: INSERT, UPDATE
--
-- Security Checks:
--   1. Verify account_id belongs to the user
--   2. For transfers, verify counter_account_id also belongs to the user
--   3. Prevent cross-user account access in multi-tenant system
-- ============================================================================

CREATE OR REPLACE FUNCTION validate_account_ownership()
RETURNS trigger LANGUAGE plpgsql AS $$
BEGIN
  -- Non-transfer: only validate ownership if an account is provided
  IF NEW.type <> 'transfer' THEN
    IF NEW.account_id IS NOT NULL THEN
      IF NOT EXISTS (
        SELECT 1 FROM accounts 
        WHERE id = NEW.account_id AND user_id = NEW.user_id
      ) THEN
        RAISE EXCEPTION 'Account does not belong to user';
      END IF;
    END IF;

  -- Transfer: require both accounts and validate ownership for both
  ELSE
    IF NEW.account_id IS NULL OR NEW.counter_account_id IS NULL THEN
      RAISE EXCEPTION 'Transfer requires both account_id and counter_account_id';
    END IF;

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


-- ============================================================================
-- TRIGGER: trg_validate_account_ownership
-- ============================================================================
-- Purpose: Execute account ownership validation before INSERT or UPDATE
-- Timing: BEFORE (prevents unauthorized data from being committed)
-- Events: INSERT, UPDATE on transactions table
-- ============================================================================

CREATE TRIGGER trg_validate_account_ownership
BEFORE INSERT OR UPDATE ON transactions
FOR EACH ROW EXECUTE FUNCTION validate_account_ownership();


-- ============================================================================
-- FUNCTION: validate_category_ownership()
-- ============================================================================
-- Purpose: Ensure users can only use categories they own
-- Trigger Operations: INSERT, UPDATE
--
-- Security Check:
--   Verify category_id (if provided) belongs to the user
--   Prevents cross-user category access in multi-tenant system
-- ============================================================================

CREATE OR REPLACE FUNCTION validate_category_ownership()
RETURNS trigger LANGUAGE plpgsql AS $$
BEGIN
  -- Only validate if a category is specified (category_id is optional)
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


-- ============================================================================
-- TRIGGER: trg_validate_category_ownership
-- ============================================================================
-- Purpose: Execute category ownership validation before INSERT or UPDATE
-- Timing: BEFORE (prevents unauthorized data from being committed)  
-- Events: INSERT, UPDATE on transactions table
-- ============================================================================

CREATE TRIGGER trg_validate_category_ownership
BEFORE INSERT OR UPDATE ON transactions
FOR EACH ROW EXECUTE FUNCTION validate_category_ownership(); 