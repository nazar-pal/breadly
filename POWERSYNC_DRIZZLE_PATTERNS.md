# PowerSync + Drizzle Usage Patterns

Quick reference for using PowerSync with Drizzle ORM in our React Native application.

## Setup

```typescript
import { usePowerSync } from '@/powersync/context'
import { useQuery } from '@powersync/react'
import { toCompilableQuery } from '@powersync/drizzle-driver'
import { eq } from 'drizzle-orm'
import { asyncTryCatch } from '@/utils'
import { useUser } from '@clerk/clerk-expo'
import { categories } from '@/powersync/schema/table_4_categories'

const { db } = usePowerSync()
const { user } = useUser()
```

## Queries

```typescript
// Basic query
const { data: expenseCategories, isLoading } = useQuery(
  toCompilableQuery(db.query.categories.findMany())
)

// Query with conditions
const { data: userCategories, isLoading } = useQuery(
  toCompilableQuery(
    db.query.categories.findMany({
      where: eq(categories.userId, user?.id)
    })
  )
)
```

## Mutations

### CREATE

```typescript
const createCategory = async () => {
  if (!user?.id) return

  const [error] = await asyncTryCatch(
    db.insert(categories).values({
      userId: user.id,
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
- Always check `user?.id` before mutations
- Include `userId` in data for user-scoped records
- Queries automatically update when data changes
