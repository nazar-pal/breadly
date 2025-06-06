-- Custom SQL migration file, put your code below! --

/*
================================================================================
MIGRATION: 0002 - Account Balance Update Triggers  
================================================================================
Purpose: Handle account balance maintenance when existing transactions 
         are modified in the system.

Functions:
- update_account_balance_on_update(): Handles UPDATE operations
- trg_update_balance_on_update: Trigger that executes the function

Business Logic:
- Step 1: Reverse the old transaction's effect on account balances
- Step 2: Apply the new transaction's effect on account balances
- This two-step process ensures balance accuracy during modifications
================================================================================
*/


-- ============================================================================
-- FUNCTION: update_account_balance_on_update()
-- ============================================================================
-- Purpose: Handle balance updates when transactions are modified
-- Trigger Operation: UPDATE
-- 
-- Logic:
--   1. Reverse old transaction (subtract/add back previous amounts)
--   2. Apply new transaction (add/subtract new amounts)
--
-- This approach ensures accurate balance tracking during modifications
--
-- IMPORTANT: This function assumes transactions are in the same currency as
--           their associated accounts. If cross-currency transactions are
--           supported, currency conversion logic must be added.
-- ============================================================================

CREATE OR REPLACE FUNCTION update_account_balance_on_update()
RETURNS trigger LANGUAGE plpgsql AS $$
BEGIN
  -- ========================================================================
  -- STEP 1: Reverse the effects of the old transaction
  -- ========================================================================
  
  -- Reverse old income (subtract previously added amount)
  IF OLD.type = 'income' THEN
    UPDATE accounts 
    SET balance = balance - OLD.amount 
    WHERE id = OLD.account_id;
    
  -- Reverse old expense (add back previously subtracted amount)
  ELSIF OLD.type = 'expense' THEN
    UPDATE accounts 
    SET balance = balance + OLD.amount 
    WHERE id = OLD.account_id;
    
  -- Reverse old transfer (undo the money movement)
  ELSIF OLD.type = 'transfer' THEN
    -- Add money back to source account
    UPDATE accounts 
    SET balance = balance + OLD.amount 
    WHERE id = OLD.account_id;
    
    -- Remove money from destination account
    UPDATE accounts 
    SET balance = balance - OLD.amount 
    WHERE id = OLD.counter_account_id;
  END IF;

  -- ========================================================================
  -- STEP 2: Apply the effects of the new transaction
  -- ========================================================================
  
  -- Apply new income (add new amount)
  IF NEW.type = 'income' THEN
    UPDATE accounts 
    SET balance = balance + NEW.amount 
    WHERE id = NEW.account_id;
    
  -- Apply new expense (subtract new amount)
  ELSIF NEW.type = 'expense' THEN
    UPDATE accounts 
    SET balance = balance - NEW.amount 
    WHERE id = NEW.account_id;
    
  -- Apply new transfer (move money between accounts)
  ELSIF NEW.type = 'transfer' THEN
    -- Debit source account
    UPDATE accounts 
    SET balance = balance - NEW.amount 
    WHERE id = NEW.account_id;
    
    -- Credit destination account
    UPDATE accounts 
    SET balance = balance + NEW.amount 
    WHERE id = NEW.counter_account_id;
  END IF;
  
  RETURN NEW;
END $$;


-- ============================================================================
-- TRIGGER: trg_update_balance_on_update
-- ============================================================================
-- Purpose: Execute balance updates before UPDATE operations
-- Timing: BEFORE (ensures balance is updated before transaction is committed)
-- Events: UPDATE on transactions table
-- ============================================================================

CREATE TRIGGER trg_update_balance_on_update
BEFORE UPDATE ON transactions
FOR EACH ROW EXECUTE FUNCTION update_account_balance_on_update(); 