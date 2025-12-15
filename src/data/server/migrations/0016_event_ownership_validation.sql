-- Custom SQL migration file, put your code below! --

/*
================================================================================
MIGRATION: Event Ownership Validation
================================================================================
Purpose: Enforce multi-tenant security by ensuring users can only reference
         their own events in transactions.

Functions:
- validate_event_ownership(): Validates user owns referenced event

Security Rules:
- Users can only link transactions to events they own
- Prevents unauthorized cross-tenant event access
================================================================================
*/

-- ============================================================================
-- FUNCTION: validate_event_ownership()
-- ============================================================================
CREATE OR REPLACE FUNCTION validate_event_ownership()
RETURNS trigger LANGUAGE plpgsql AS $$
BEGIN
  -- Only validate if an event is specified (event_id is optional)
  IF NEW.event_id IS NOT NULL THEN
    IF NOT EXISTS (
      SELECT 1 FROM events 
      WHERE id = NEW.event_id AND user_id = NEW.user_id
    ) THEN
      RAISE EXCEPTION 'Event does not belong to user';
    END IF;
  END IF;
  
  RETURN NEW;
END $$;

-- ============================================================================
-- TRIGGER: trg_validate_event_ownership
-- ============================================================================
CREATE TRIGGER trg_validate_event_ownership
BEFORE INSERT OR UPDATE ON transactions
FOR EACH ROW EXECUTE FUNCTION validate_event_ownership();

-- ============================================================================
-- COMMENTS
-- ============================================================================
COMMENT ON FUNCTION validate_event_ownership() IS 
'Ensures users can only reference events they own in transactions';

COMMENT ON TRIGGER trg_validate_event_ownership ON transactions IS 
'Enforces event ownership validation on transaction INSERT and UPDATE';