ALTER TABLE "categories" ADD COLUMN "archived_at" timestamp with time zone;

-- Data migration: Backfill archived_at for existing archived categories
WITH RECURSIVE category_descendants AS (
    -- Base case: select all categories that are archived to find their descendants
    SELECT id as root_id, id as current_id
    FROM "categories"
    WHERE "is_archived" = true
    UNION ALL
    -- Recursive step: find children of the current nodes
    SELECT cd.root_id, c.id as current_id
    FROM "categories" c
    JOIN category_descendants cd ON c."parent_id" = cd.current_id
)
UPDATE "categories"
SET "archived_at" = COALESCE(
    (
        SELECT (MAX(t."tx_date") + 1)::timestamp at time zone 'UTC' - interval '1 second'
        FROM "transactions" t
        JOIN category_descendants cd ON t."category_id" = cd.current_id
        WHERE cd.root_id = "categories"."id"
    ),
    "categories"."created_at"
)
WHERE "is_archived" = true;
