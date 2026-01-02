import { powersync } from '../powersync/database'

/**
 * Initialize PowerSync database
 * Logger is configured at module level in database.ts
 */
export async function initializePowerSync(): Promise<void> {
  await powersync.init()
}
