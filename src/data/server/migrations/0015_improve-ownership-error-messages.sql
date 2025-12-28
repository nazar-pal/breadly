-- Custom SQL migration file, put your code below! --

/*
================================================================================
MIGRATION 0015: Improve Ownership Validation Error Messages
================================================================================
Purpose: Improve error messages in ownership validation trigger functions to
         distinguish between missing records and ownership mismatches.

Issue:
  Current error messages like "Category does not belong to user" are ambiguous
  and don't distinguish between:
  1. The category doesn't exist at all
  2. The category exists but belongs to another user

  This makes debugging sync issues difficult, especially when:
  - Categories haven't synced yet (timing issue)
  - Categories were deleted but transactions still reference them
  - There's a data integrity issue with user_id mismatches

Fix:
  Update ownership validation functions to:
  1. First check if the referenced record exists
  2. If it doesn't exist, provide a clear "not found" error
  3. If it exists but belongs to another user, provide an "ownership mismatch" error
  4. Include the relevant IDs in error messages for easier debugging

Affected Functions:
  1. validate_category_ownership() - Categories referenced by transactions
  2. validate_account_ownership() - Accounts referenced by transactions  
  3. validate_event_ownership() - Events referenced by transactions
================================================================================
*/


-- ============================================================================
-- SECTION 1: IMPROVE validate_category_ownership()
-- ============================================================================

CREATE OR REPLACE FUNCTION validate_category_ownership()
RETURNS trigger LANGUAGE plpgsql AS $$
DECLARE
  category_user_id text;
BEGIN
  -- Only validate if a category is specified (category_id is optional)
  IF NEW.category_id IS NOT NULL THEN
    -- First check if category exists and get its user_id
    SELECT user_id INTO category_user_id
    FROM categories
    WHERE id = NEW.category_id;
    
    -- Category doesn't exist
    IF category_user_id IS NULL THEN
      RAISE EXCEPTION 'Category not found. Category ID: %, Transaction ID: %, User ID: %',
        NEW.category_id, NEW.id, NEW.user_id;
    END IF;
    
    -- Category exists but belongs to another user
    IF category_user_id != NEW.user_id THEN
      RAISE EXCEPTION 'Category ownership mismatch. Category ID: % belongs to user %, but transaction belongs to user %. Transaction ID: %',
        NEW.category_id, category_user_id, NEW.user_id, NEW.id;
    END IF;
  END IF;
  
  RETURN NEW;
END $$;


-- ============================================================================
-- SECTION 2: IMPROVE validate_account_ownership()
-- ============================================================================

CREATE OR REPLACE FUNCTION validate_account_ownership()
RETURNS trigger LANGUAGE plpgsql AS $$
DECLARE
  account_user_id text;
  counter_account_user_id text;
BEGIN
  -- Non-transfer: only validate ownership if an account is provided
  IF NEW.type <> 'transfer' THEN
    IF NEW.account_id IS NOT NULL THEN
      SELECT user_id INTO account_user_id
      FROM accounts
      WHERE id = NEW.account_id;
      
      IF account_user_id IS NULL THEN
        RAISE EXCEPTION 'Account not found. Account ID: %, Transaction ID: %, User ID: %',
          NEW.account_id, NEW.id, NEW.user_id;
      END IF;
      
      IF account_user_id != NEW.user_id THEN
        RAISE EXCEPTION 'Account ownership mismatch. Account ID: % belongs to user %, but transaction belongs to user %. Transaction ID: %',
          NEW.account_id, account_user_id, NEW.user_id, NEW.id;
      END IF;
    END IF;

  -- Transfer: validate ownership for both accounts
  ELSE
    -- Validate source account
    SELECT user_id INTO account_user_id
    FROM accounts
    WHERE id = NEW.account_id;
    
    IF account_user_id IS NULL THEN
      RAISE EXCEPTION 'Account not found. Account ID: %, Transaction ID: %, User ID: %',
        NEW.account_id, NEW.id, NEW.user_id;
    END IF;
    
    IF account_user_id != NEW.user_id THEN
      RAISE EXCEPTION 'Account ownership mismatch. Account ID: % belongs to user %, but transaction belongs to user %. Transaction ID: %',
        NEW.account_id, account_user_id, NEW.user_id, NEW.id;
    END IF;

    -- Validate destination account
    SELECT user_id INTO counter_account_user_id
    FROM accounts
    WHERE id = NEW.counter_account_id;
    
    IF counter_account_user_id IS NULL THEN
      RAISE EXCEPTION 'Counter account not found. Counter Account ID: %, Transaction ID: %, User ID: %',
        NEW.counter_account_id, NEW.id, NEW.user_id;
    END IF;
    
    IF counter_account_user_id != NEW.user_id THEN
      RAISE EXCEPTION 'Counter account ownership mismatch. Counter Account ID: % belongs to user %, but transaction belongs to user %. Transaction ID: %',
        NEW.counter_account_id, counter_account_user_id, NEW.user_id, NEW.id;
    END IF;
  END IF;
  
  RETURN NEW;
END $$;


-- ============================================================================
-- SECTION 3: IMPROVE validate_event_ownership()
-- ============================================================================

CREATE OR REPLACE FUNCTION validate_event_ownership()
RETURNS trigger LANGUAGE plpgsql AS $$
DECLARE
  event_user_id text;
BEGIN
  -- Only validate if an event is specified (event_id is optional)
  IF NEW.event_id IS NOT NULL THEN
    SELECT user_id INTO event_user_id
    FROM events
    WHERE id = NEW.event_id;
    
    -- Event doesn't exist
    IF event_user_id IS NULL THEN
      RAISE EXCEPTION 'Event not found. Event ID: %, Transaction ID: %, User ID: %',
        NEW.event_id, NEW.id, NEW.user_id;
    END IF;
    
    -- Event exists but belongs to another user
    IF event_user_id != NEW.user_id THEN
      RAISE EXCEPTION 'Event ownership mismatch. Event ID: % belongs to user %, but transaction belongs to user %. Transaction ID: %',
        NEW.event_id, event_user_id, NEW.user_id, NEW.id;
    END IF;
  END IF;
  
  RETURN NEW;
END $$;


-- ============================================================================
-- COMMENTS AND DOCUMENTATION
-- ============================================================================

COMMENT ON FUNCTION validate_category_ownership() IS 
'Ensures users can only reference categories they own in transactions. IMPROVED: Distinguishes between missing categories and ownership mismatches with detailed error messages.';

COMMENT ON FUNCTION validate_account_ownership() IS 
'Ensures users can only use accounts they own in transactions; validates both accounts for transfers. IMPROVED: Distinguishes between missing accounts and ownership mismatches with detailed error messages.';

COMMENT ON FUNCTION validate_event_ownership() IS 
'Ensures users can only link transactions to events they own. IMPROVED: Distinguishes between missing events and ownership mismatches with detailed error messages.';