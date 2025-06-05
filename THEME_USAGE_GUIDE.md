# Theme System Usage Guide for AI Models

## Theme System Structure

**Main Context**: `context/ThemeContext.tsx`  
**Theme Files**: `theme/` directory

- `theme/colors.ts` - Color palettes for light/dark themes
- `theme/tokens.ts` - Design tokens (spacing, border radius)
- `theme/navigation.ts` - Navigation theme configuration
- `theme/types.ts` - TypeScript type definitions
- `theme/index.ts` - Central export file

## Import Pattern

```typescript
import { useTheme, useThemedStyles } from '@/context/ThemeContext';
```

## Usage Patterns

### 1. For Styled Components (Recommended)

```typescript
const styles = useThemedStyles((theme) => ({
  container: {
    padding: theme.spacing.md,
    backgroundColor: theme.colors.background,
    borderRadius: theme.borderRadius.md,
  },
  text: {
    fontSize: 16,
    fontWeight: '600' as const,
    color: theme.colors.text,
  },
}));
```

### 2. For Direct Color Access

```typescript
const { colors } = useTheme();
// Use: colors.primary, colors.text, colors.background, etc.
```

## Key Design Tokens

### Spacing

- `theme.spacing.xs` (4px)
- `theme.spacing.sm` (8px)
- `theme.spacing.md` (16px)
- `theme.spacing.lg` (24px)
- `theme.spacing.xl` (32px)

### Colors

- **Backgrounds**: `colors.background`, `colors.surface`, `colors.card`
- **Text**: `colors.text`, `colors.textSecondary`, `colors.textTertiary`
- **Brand**: `colors.primary`, `colors.secondary`
- **Semantic**: `colors.success`, `colors.error`, `colors.warning`
- **Interactive**: `colors.button.primaryBg`, `colors.button.primaryText`
- **Icon Backgrounds**: `colors.iconBackground.primary`, `colors.iconBackground.success`

### Border Radius

- `theme.borderRadius.sm` (4px)
- `theme.borderRadius.md` (8px)
- `theme.borderRadius.lg` (16px)
- `theme.borderRadius.xl` (24px)

## TypeScript Requirements

Always use `as const` for string literals in styles:

```typescript
flexDirection: 'row' as const,
textAlign: 'center' as const,
fontWeight: '600' as const,
```

## Anti-Patterns (Avoid)

❌ Hard-coded colors: `backgroundColor: '#FFFFFF'`  
❌ Hard-coded spacing: `padding: 16`  
❌ Opacity strings: `colors.primary + '20'`  
❌ Static StyleSheet.create()

## Modern Approach

✅ Use semantic colors: `colors.iconBackground.primary`  
✅ Use spacing tokens: `theme.spacing.md`  
✅ Use `useThemedStyles` for performance  
✅ Type-safe with `as const`
