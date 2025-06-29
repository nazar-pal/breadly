import { useContext } from 'react'
import { UserContext, UserSession } from './user-context'

export function useUserSession(): UserSession {
  const context = useContext(UserContext)
  if (context === undefined) {
    throw new Error(
      'useUserSession must be used within a UserProvider and after session is initialized'
    )
  }
  return context
}
