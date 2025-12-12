-- Custom SQL migration file, put your code below! --

/*
╔════════════════════════════════════════════════════════════════════════════╗
║                          ⚠️  DEPRECATED ⚠️                 ║
╠════════════════════════════════════════════════════════════════════════════╣
║                                                                             ║
║  This migration file is DEPRECATED and will be removed in migration 0008.  ║
║                                                                             ║
║  All functions and triggers created in this file are deleted in:           ║
║  → src/data/server/migrations/0008_remove_balance_triggers.sql             ║
║                                                                             ║
║  Reason: Balance updates are now handled client-side and synced via        ║
║          PowerSync to avoid conflicts between client and server updates.   ║
║                                                                             ║
║  ⚠️  You do NOT need to read or understand the code below.                  ║
║                                                                             ║
╚════════════════════════════════════════════════════════════════════════════╝

================================================================================
MIGRATION: 0001 - Account Balance Insert/Delete Triggers
================================================================================
Purpose: Automatically maintain account balances when transactions are 
         created or deleted from the system.

Functions:
- update_account_balance(): Handles INSERT and DELETE operations
- trg_update_balance: Trigger that executes the function

Business Logic:
- Income transactions: Add amount to account balance
- Expense transactions: Subtract amount from account balance  
- Transfer transactions: Move money from source to destination account
================================================================================
*/


-- ============================================================================
-- FUNCTION: update_account_balance()
-- ============================================================================
-- Purpose: Automatically update account balances on transaction INSERT/DELETE
-- Trigger Operations: INSERT, DELETE
-- 
-- Logic:
--   INSERT: Apply transaction to account balance(s)
--   DELETE: Reverse transaction from account balance(s)
--
-- IMPORTANT: This function assumes transactions are in the same currency as
--           their associated accounts. If cross-currency transactions are
--           supported, currency conversion logic must be added.
-- ============================================================================

CREATE OR REPLACE FUNCTION update_account_balance()
RETURNS trigger LANGUAGE plpgsql AS $$
BEGIN
  -- Handle transaction creation (INSERT)
  IF TG_OP = 'INSERT' THEN
    
    -- Income: Add money to account
    IF NEW.type = 'income' THEN
      UPDATE accounts 
      SET balance = balance + NEW.amount 
      WHERE id = NEW.account_id;
      
    -- Expense: Remove money from account
    ELSIF NEW.type = 'expense' THEN
      UPDATE accounts 
      SET balance = balance - NEW.amount 
      WHERE id = NEW.account_id;
      
    -- Transfer: Move money between accounts
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

  -- Handle transaction deletion (DELETE)
  ELSIF TG_OP = 'DELETE' THEN
    
    -- Income: Remove previously added money
    IF OLD.type = 'income' THEN
      UPDATE accounts 
      SET balance = balance - OLD.amount 
      WHERE id = OLD.account_id;
      
    -- Expense: Add back previously removed money
    ELSIF OLD.type = 'expense' THEN
      UPDATE accounts 
      SET balance = balance + OLD.amount 
      WHERE id = OLD.account_id;
      
    -- Transfer: Reverse the transfer
    ELSIF OLD.type = 'transfer' THEN
      -- Reverse debit (add money back to source)
      UPDATE accounts 
      SET balance = balance + OLD.amount 
      WHERE id = OLD.account_id;
      
      -- Reverse credit (remove money from destination)
      UPDATE accounts 
      SET balance = balance - OLD.amount 
      WHERE id = OLD.counter_account_id;
    END IF;
    
    RETURN OLD;
  END IF;
  
  RETURN NULL;
END $$;


-- ============================================================================
-- TRIGGER: trg_update_balance
-- ============================================================================
-- Purpose: Execute balance updates after INSERT or DELETE operations
-- Timing: AFTER (ensures transaction data is committed before balance update)
-- Events: INSERT, DELETE on transactions table
-- ============================================================================

CREATE TRIGGER trg_update_balance
AFTER INSERT OR DELETE ON transactions
FOR EACH ROW EXECUTE FUNCTION update_account_balance(); 