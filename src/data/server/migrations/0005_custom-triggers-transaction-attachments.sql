-- Custom SQL migration file, put your code below! --

/*
================================================================================
MIGRATION 0005: Transaction-Attachment Table Triggers
================================================================================
Purpose: Enforce ownership validation on the transaction_attachments junction table.

Triggers defined in this file:
  1. trg_validate_transaction_attachment_ownership        - Ownership validation (INSERT)
  2. trg_validate_transaction_attachment_ownership_update - Ownership validation (UPDATE)

Security Rules:
  - Transaction must belong to the user creating the link
  - Attachment must belong to the user creating the link
  - Prevents unauthorized cross-user links between transactions and attachments
================================================================================
*/


-- ============================================================================
-- FUNCTION: validate_transaction_attachment_ownership()
-- ============================================================================
-- Purpose: Ensure both transaction and attachment belong to the user
-- Trigger Operations: INSERT, UPDATE (on transaction_id, attachment_id, or user_id)
--
-- Validation Rules:
--   1. Transaction must belong to the user creating the link
--   2. Attachment must belong to the user creating the link
-- ============================================================================

CREATE OR REPLACE FUNCTION validate_transaction_attachment_ownership()
RETURNS TRIGGER AS $$
BEGIN
  -- Validate transaction belongs to user
  IF NOT EXISTS (
    SELECT 1 FROM transactions 
    WHERE id = NEW.transaction_id AND user_id = NEW.user_id
  ) THEN
    RAISE EXCEPTION 'Transaction does not belong to user. Transaction ID: %, User ID: %',
      NEW.transaction_id, NEW.user_id;
  END IF;

  -- Validate attachment belongs to user
  IF NOT EXISTS (
    SELECT 1 FROM attachments 
    WHERE id = NEW.attachment_id AND user_id = NEW.user_id
  ) THEN
    RAISE EXCEPTION 'Attachment does not belong to user. Attachment ID: %, User ID: %',
      NEW.attachment_id, NEW.user_id;
  END IF;
  
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;


-- ============================================================================
-- TRIGGERS: trg_validate_transaction_attachment_ownership
-- ============================================================================
-- Purpose: Execute ownership validation before INSERT or UPDATE
-- Timing: BEFORE (prevents unauthorized links from being committed)
-- Events: INSERT, UPDATE on transaction_attachments table
-- ============================================================================

CREATE TRIGGER trg_validate_transaction_attachment_ownership
  BEFORE INSERT ON transaction_attachments
  FOR EACH ROW
  EXECUTE FUNCTION validate_transaction_attachment_ownership();


CREATE TRIGGER trg_validate_transaction_attachment_ownership_update
  BEFORE UPDATE ON transaction_attachments
  FOR EACH ROW
  WHEN (
    OLD.transaction_id IS DISTINCT FROM NEW.transaction_id
    OR OLD.attachment_id IS DISTINCT FROM NEW.attachment_id
    OR OLD.user_id IS DISTINCT FROM NEW.user_id
  )
  EXECUTE FUNCTION validate_transaction_attachment_ownership();


-- ============================================================================
-- COMMENTS AND DOCUMENTATION
-- ============================================================================

COMMENT ON FUNCTION validate_transaction_attachment_ownership() IS 
'Validates that both transaction and attachment belong to the user creating the link';

COMMENT ON TRIGGER trg_validate_transaction_attachment_ownership ON transaction_attachments IS 
'Enforces ownership validation on transaction-attachment INSERT';

COMMENT ON TRIGGER trg_validate_transaction_attachment_ownership_update ON transaction_attachments IS 
'Enforces ownership validation on transaction-attachment UPDATE when IDs change';

