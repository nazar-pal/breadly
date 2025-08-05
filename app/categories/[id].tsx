import { Category } from '@/screens/category'
import { useLocalSearchParams } from 'expo-router'
import React from 'react'

export default function CategoryScreen() {
  const { id } = useLocalSearchParams()
  const categoryId = typeof id === 'string' ? id : ''

  return <Category categoryId={categoryId} />
}
