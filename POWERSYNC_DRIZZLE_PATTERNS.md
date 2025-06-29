# PowerSync + Drizzle Usage Patterns

Quick reference for using PowerSync with Drizzle ORM in our React Native application.

## Setup

```typescript
import { usePowerSync } from '@/lib/powersync/context'
import { useQuery } from '@powersync/react'
import { toCompilableQuery } from '@powersync/drizzle-driver'
import { eq } from 'drizzle-orm'
import { asyncTryCatch } from '@/utils'
import { useUserSession } from '@/lib/user-session'
import { categories } from '@/lib/powersync/schema/table_4_categories'

const { db } = usePowerSync()
const userSession = useUserSession()
```

## Queries

```typescript
// Basic query
const { data: expenseCategories, isLoading } = useQuery(
  toCompilableQuery(db.query.categories.findMany())
)

// Query with conditions (user-scoped data)
const { data: userCategories, isLoading } = useQuery(
  toCompilableQuery(
    db.query.categories.findMany({
      where: eq(categories.userId, userSession.userId)
    })
  )
)
```

## Mutations

### CREATE

```typescript
const createCategory = async () => {
  if (!userSession.userId) return

  const [error] = await asyncTryCatch(
    db.insert(categories).values({
      userId: userSession.userId,
      name: formData.name.trim(),
      description: formData.description.trim() || null,
      icon: formData.icon,
      type: 'expense',
      isArchived: false,
      createdAt: new Date()
    })
  )

  if (error) {
    console.error('Failed to create:', error)
    Alert.alert('Error', 'Failed to create category')
  }
}
```

### UPDATE

```typescript
const updateCategory = async () => {
  const [error] = await asyncTryCatch(
    db
      .update(categories)
      .set({
        name: formData.name.trim(),
        description: formData.description.trim() || null,
        icon: formData.icon
      })
      .where(eq(categories.id, categoryId))
  )

  if (error) {
    console.error('Failed to update:', error)
    Alert.alert('Error', 'Failed to update category')
  }
}
```

### DELETE

```typescript
const deleteCategory = async (categoryId: string) => {
  const [error] = await asyncTryCatch(
    db.delete(categories).where(eq(categories.id, categoryId))
  )

  if (error) {
    console.error('Failed to delete:', error)
    Alert.alert('Error', 'Failed to delete category')
  }
}
```

## Key Points

- Use `useQuery` + `toCompilableQuery` for reactive queries
- Wrap all mutations in `asyncTryCatch`
- Always check `userSession.userId` before mutations
- Include `userId` in data for user-scoped records
- Queries automatically update when data changes
- **Guest users**: All data stays local-only until they authenticate
- **Authenticated users**: Data syncs automatically to cloud via PowerSync

## Guest vs Authenticated Users

### Guest Users

- Data stored locally only (no cloud sync)
- Can use all app features
- PowerSync remains disconnected
- Data preserved when upgrading to authenticated account

### Authenticated Users

- Data syncs to cloud automatically
- PowerSync connects and handles sync
- Seamless offline/online experience
- Previous guest data migrated during sign-up
