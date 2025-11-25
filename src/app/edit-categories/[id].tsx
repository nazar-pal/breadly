import Category from '@/screens/edit-category'
import { useLocalSearchParams } from 'expo-router'
import React from 'react'

export default function CategoryScreen() {
  const { id } = useLocalSearchParams<{ id: string }>()

  return <Category categoryId={id} />
}
