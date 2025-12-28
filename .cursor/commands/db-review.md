### **Objective**

Review and improve the database design for both **server** (PostgreSQL) and **client** (SQLite with JSON-based views) schemas. Identify **gaps, inconsistencies, or redundant logic** and propose **meaningful improvements** that enhance correctness, integrity, and synchronization.

---

### **Goals**

Your proposals should aim to:

1. Strengthen **data validation**, **consistency**, and **referential integrity** across both environments.
2. Make the schema **as strict as possible**, covering all realistic data edge cases.
3. Identify **critical missing elements** — columns, constraints, or relationships — essential for correctness, synchronization, or security (ignore non-functional, cosmetic fields).
4. Minimize **data inconsistency risks** between client and server:
   - The client’s SQLite JSON-based views cannot enforce all server constraints.
   - Propose strategies to **validate data client-side** before sync to reduce server rejections.
5. Ensure **validation logic is well-placed and non-redundant**:
   - Avoid duplicating validation across multiple layers if unnecessary.
   - Where duplication is justified (e.g., defensive checks), clearly distinguish intended overlap.
   - Maintain **consistent validation patterns**: similar data rules should be enforced at comparable layers across the schema.
6. Remove or flag any **dead code**, unused constraints, migrations, or schema fragments that no longer serve a purpose.

---

### **Scope of Review**

For **each table**, provide structured feedback on:

- Missing or redundant columns
- Data types, constraints, and defaults
- Referential integrity and relationships
- Validation logic in triggers, functions, or SQL migrations
- Consistency between client and server schema definitions
- Impact on synchronization correctness (client ↔ server)
- Potential redundancies or outdated validation logic (for example, making the same check both in the server database check constraints and custom server triggers)

Additionally review:

- **Synchronization flows (client → server and server → client):**  
  Evaluate data transformations, error handling, and sync rule correctness.
- **Custom migrations & functions:**  
  Assess whether they add necessary validation or repeat checks enforced elsewhere.
- **Immutable tables (e.g., currencies, exchange rates):**  
  Confirm client read-only and server-managed behavior.
- **Documentation:**  
  Ensure table docs are accurate, consistent, and correctly describe differences between client and server.
- **Mutation functions:**  
  Confirm correctness and consistent design. Missing mutation functions are not bugs — they’ll be added later when needed.

---

### **Reference Files**

1. **Guidelines** – Design considerations for offline-first database using PowerSync + PostgreSQL (do not treat it as a holy grail. This is the file that was created by me, and this is my vision, and I might be wrong): @src/data/DatabaseDesignGuidelines.md @src/data/ValidationStrategy.md
2. **Client Drizzle Schema:** @src/data/client/db-schema
3. **Server Drizzle Schema:** @src/data/server/db-schema
4. **Synchronization Rules (server → client):** : @sync_rules.yaml
5. **Sync Route (client → server):** @src/data/server/api/routers/sync.ts . _Also review how data is transformed and validated on server:_ (@src/data/server/api/utils/transform-data-for-pg.ts and other functions).
6. Some custom y migrations (there are some custom functions and triggers that I have not been able to define on the Drizzle schema level): @src/data/TRIGGERS.md @src/data/server/migrations
7. Client mutations: @src/data/client/mutations

---

### **Expected Output**

Deliver a **structured, table-by-table analysis** that includes:

- Key issues or inconsistencies
- Recommended fixes (schema, constraints, migrations, triggers)
- Validation placement improvements (avoidance of duplication / overvalidation)
- Documentation corrections or alignment updates
- Client–server synchronization alignment issues

Conclude with a **high-level summary** highlighting systemic patterns:

- Cross-cutting improvements to validation strategy, schema normalization, and naming conventions
- Locations where validation should be consolidated or simplified
- Any obsolete code or logic recommended for removal
