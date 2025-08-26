-- Custom SQL migration file, put your code below! --

/*
================================================================================
MIGRATION 0004: Currency Validation Triggers
================================================================================
Purpose: Enforce currency consistency rules that cannot be implemented as 
         CHECK constraints due to PostgreSQL's limitation on subqueries in 
         CHECK constraints.

Business Rules Enforced:
1. Transaction currency must match the account's currency
2. For transfers, both accounts must use the same currency
3. Account currency cannot be changed if transactions exist

Note: These triggers complement the existing CHECK constraints and ensure
      data integrity at the database level.
================================================================================
*/

-- ============================================================================
-- HELPER FUNCTIONS FOR CURRENCY VALIDATION
-- ============================================================================

-- Function to validate transaction currency consistency
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

  -- Transfer: require both accounts and validate both currencies
  ELSE
    IF NEW.account_id IS NULL OR NEW.counter_account_id IS NULL THEN
      RAISE EXCEPTION 'Transfer requires both account_id and counter_account_id';
    END IF;

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

-- Function to prevent account currency changes when transactions exist
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
-- CREATE TRIGGERS
-- ============================================================================

-- Trigger to validate currency consistency on transaction INSERT
CREATE TRIGGER transaction_currency_validation_insert
  BEFORE INSERT ON transactions
  FOR EACH ROW
  EXECUTE FUNCTION validate_transaction_currency();

-- Trigger to validate currency consistency on transaction UPDATE
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

-- Trigger to prevent account currency changes when transactions exist
CREATE TRIGGER account_currency_change_validation
  BEFORE UPDATE ON accounts
  FOR EACH ROW
  EXECUTE FUNCTION validate_account_currency_change();

-- ============================================================================
-- COMMENTS AND DOCUMENTATION
-- ============================================================================

COMMENT ON FUNCTION validate_transaction_currency() IS 
'Validates that transaction currency matches both account and counter-account currencies for transfers';

COMMENT ON FUNCTION validate_account_currency_change() IS 
'Prevents changing account currency when transactions already exist for that account';

COMMENT ON TRIGGER transaction_currency_validation_insert ON transactions IS 
'Ensures currency consistency when creating new transactions';

COMMENT ON TRIGGER transaction_currency_validation_update ON transactions IS 
'Ensures currency consistency when updating transaction account/currency fields';

COMMENT ON TRIGGER account_currency_change_validation ON accounts IS 
'Prevents currency changes on accounts that have existing transactions'; 