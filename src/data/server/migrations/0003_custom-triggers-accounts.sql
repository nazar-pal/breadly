-- Custom SQL migration file, put your code below! --

/*
================================================================================
MIGRATION 0003: Account Table Triggers
================================================================================
Purpose: Enforce validation rules on the accounts table.

Triggers defined in this file:
  1. account_currency_change_validation - Prevent currency changes with existing transactions

Business Rules:
  - Account currency cannot be changed when transactions exist for that account
  - Maintains historical data integrity by preventing currency mismatches
================================================================================
*/


-- ============================================================================
-- FUNCTION: validate_account_currency_change()
-- ============================================================================
-- Purpose: Prevent changing account currency when transactions exist
-- Trigger Operations: UPDATE
--
-- Business Rule:
--   If transactions exist for an account (as source or destination),
--   the currency cannot be changed to maintain data consistency.
-- ============================================================================

CREATE OR REPLACE FUNCTION validate_account_currency_change()
RETURNS TRIGGER AS $$
BEGIN
  -- Only check if currency_id is being changed
  IF OLD.currency_id IS DISTINCT FROM NEW.currency_id THEN
    -- Check if any transactions exist for this account
    IF EXISTS (
      SELECT 1 FROM transactions 
      WHERE account_id = NEW.id 
      OR counter_account_id = NEW.id
    ) THEN
      RAISE EXCEPTION 'Cannot change account currency when transactions exist. Account ID: %, Old Currency: %, New Currency: %', 
        NEW.id, OLD.currency_id, NEW.currency_id;
    END IF;
  END IF;

  RETURN NEW;
END;
$$ LANGUAGE plpgsql;


-- ============================================================================
-- TRIGGER: account_currency_change_validation
-- ============================================================================
-- Purpose: Execute currency change validation before UPDATE
-- Timing: BEFORE (prevents invalid data from being committed)
-- Events: UPDATE on accounts table
-- ============================================================================

CREATE TRIGGER account_currency_change_validation
  BEFORE UPDATE ON accounts
  FOR EACH ROW
  EXECUTE FUNCTION validate_account_currency_change();


-- ============================================================================
-- COMMENTS AND DOCUMENTATION
-- ============================================================================

COMMENT ON FUNCTION validate_account_currency_change() IS 
'Prevents changing account currency when transactions already exist for that account';

COMMENT ON TRIGGER account_currency_change_validation ON accounts IS 
'Prevents currency changes on accounts that have existing transactions';

