export function validateRecordUserId(
  transformedData: Record<string, unknown>,
  session: { userId: string; authToken: string },
  operation: 'insert' | 'update'
) {
  const { userId: sessionUserId } = session

  if (!('userId' in transformedData)) {
    transformedData.userId = sessionUserId
    return sessionUserId
  }

  if (typeof transformedData.userId !== 'string') {
    throw new Error(
      `Error ${operation} record: userId has invalid type: ${typeof transformedData.userId}`
    )
  }

  let recordUserId = transformedData.userId

  // If the userId is not a valid authenticated user, replace it
  if (!recordUserId.startsWith('user_')) {
    if (__DEV__) {
      console.info(
        `🔄 Replacing guest user ID "${recordUserId}" with authenticated user "${sessionUserId}"`
      )
    }
    transformedData.userId = sessionUserId
    recordUserId = sessionUserId
  } else if (recordUserId !== sessionUserId) {
    throw new Error(
      `Error ${operation} record: userId mismatch (record userId "${recordUserId}" !== session userId "${sessionUserId}")`
    )
  }

  return recordUserId
}
