-- Custom SQL migration file, put your code below! --

/*
================================================================================
MIGRATION: 0008 - Remove Account Balance Triggers
================================================================================
Purpose: Remove server-side balance update triggers to avoid conflicts with
         client-side balance management in PowerSync architecture.

Context:
- Client mutations update account balances locally for immediate UX
- Account balances sync to server via PowerSync
- Server triggers were causing double-updates and conflicts
- Client-side balance management is the single source of truth

Removed Components:
- trg_update_balance: Trigger on INSERT/DELETE (from migration 0001)
- trg_update_balance_on_update: Trigger on UPDATE (from migration 0002)
- update_account_balance(): Function for INSERT/DELETE operations
- update_account_balance_on_update(): Function for UPDATE operations

Note: Account balances are now managed entirely by client-side mutations and
      synced to the server via PowerSync. This ensures consistency and avoids
      conflicts between client and server balance updates.
================================================================================
*/

-- ============================================================================
-- DROP TRIGGERS
-- ============================================================================
-- Drop triggers first (they depend on the functions)
-- Using IF EXISTS to make migration idempotent

DROP TRIGGER IF EXISTS trg_update_balance ON transactions;
DROP TRIGGER IF EXISTS trg_update_balance_on_update ON transactions;

-- ============================================================================
-- DROP FUNCTIONS
-- ============================================================================
-- Drop functions after triggers are removed
-- Using IF EXISTS to make migration idempotent

DROP FUNCTION IF EXISTS update_account_balance();
DROP FUNCTION IF EXISTS update_account_balance_on_update();