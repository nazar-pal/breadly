import { env } from '@/env'
import { getClerkInstance } from '@clerk/clerk-expo'
import { neon, NeonQueryFunction } from '@neondatabase/serverless'
import { drizzle, NeonHttpDatabase } from 'drizzle-orm/neon-http'
import * as accounts_schema from './schema/accounts'
import * as attachments_schema from './schema/attachments'
import * as budgets_schema from './schema/budgets'
import * as categories_schema from './schema/categories'
import * as currencies_schema from './schema/currencies'
import * as exchangeRates_schema from './schema/exchangeRates'
import * as transactionAttachments_schema from './schema/transactionAttachments'
import * as transactions_schema from './schema/transactions'
import * as userPreferences_schema from './schema/userPreferences'

const schema = {
  ...accounts_schema,
  ...attachments_schema,
  ...budgets_schema,
  ...categories_schema,
  ...currencies_schema,
  ...exchangeRates_schema,
  ...transactions_schema,
  ...userPreferences_schema,
  ...transactionAttachments_schema
}

// start TODO: remove this once we have a proper serverless db
// import { drizzle as drizzleServerless } from 'drizzle-orm/neon-serverless'
// const db = drizzleServerless(env.DATABASE_AUTHENTICATED_URL, {
//   schema,
//   casing: 'snake_case'
// })
// export { db }
// end TODO

type DrizzleDb = Omit<
  NeonHttpDatabase<typeof schema> & {
    $client: NeonQueryFunction<false, false>
  },
  '_' | 'transaction' | '$withAuth' | 'batch' | '$with' | '$client' | '$cache'
>

type Params = {
  userId: string
  authToken: string
}

export async function fetchWithDrizzle<T>(
  callback: (db: DrizzleDb, { userId, authToken }: Params) => Promise<T>
) {
  const clerkInstance = getClerkInstance()
  const authToken = await clerkInstance.session?.getToken()
  const userId = clerkInstance.session?.user.id

  if (!authToken) throw new Error('No token')
  if (!userId) throw new Error('No userId')

  const db = drizzle(neon(env.DATABASE_AUTHENTICATED_URL), {
    schema,
    casing: 'snake_case'
  })
  // const db = drizzle(env.DATABASE_AUTHENTICATED_URL, {
  //   schema,
  //   casing: 'snake_case'
  // })
  const dbWithAuth = db.$withAuth(authToken)
  return callback(dbWithAuth, { userId, authToken })
}

// Example usage:
// export async function insertTodo({ newTodo }: { newTodo: string }) {
//   await fetchWithDrizzle(async (db) => {
//     return db.insert(schema.todos).values({
//       task: newTodo,
//       isComplete: false,
//     });
//   });

//   revalidatePath("/");
// }

// export async function getTodos(): Promise<Array<Todo>> {
//   return fetchWithDrizzle(async (db) => {
//     // WHERE filter is optional because of RLS. But we send it anyway for
//     // performance reasons.
//     return db
//       .select()
//       .from(schema.todos)
//       .where(eq(schema.todos.userId, sql`auth.user_id()`))
//       .orderBy(asc(schema.todos.insertedAt));
//   });
// }

// export async function deleteTodoFormAction(formData: FormData) {
//   const id = formData.get("id");
//   if (!id) {
//     throw new Error("No id");
//   }
//   if (typeof id !== "string") {
//     throw new Error("The id must be a string");
//   }

//   await fetchWithDrizzle(async (db) => {
//     return db.delete(schema.todos).where(eq(schema.todos.id, BigInt(id)));
//   });

//   revalidatePath("/");
// }

// export async function checkOrUncheckTodoFormAction(formData: FormData) {
//   const id = formData.get("id");
//   const isComplete = formData.get("isComplete");

//   if (!id) {
//     throw new Error("No id");
//   }

//   if (!isComplete) {
//     throw new Error("No isComplete");
//   }

//   if (typeof id !== "string") {
//     throw new Error("The id must be a string");
//   }

//   if (typeof isComplete !== "string") {
//     throw new Error("The isComplete must be a string");
//   }

//   const isCompleteBool = isComplete === "true";

//   await fetchWithDrizzle(async (db) => {
//     return db
//       .update(schema.todos)
//       .set({ isComplete: !isCompleteBool })
//       .where(eq(schema.todos.id, BigInt(id)))
//       .returning();
//   });

//   revalidatePath("/");
// }
