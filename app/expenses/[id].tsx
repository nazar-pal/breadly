import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Text } from '@/components/ui/text'
import { mockExpenses } from '@/data/mockData'
import { Calendar, Mic, Tag } from '@/lib/icons'
import { useLocalSearchParams } from 'expo-router'
import React from 'react'
import { Image, ScrollView, View } from 'react-native'
import { useSafeAreaInsets } from 'react-native-safe-area-context'

interface DetailItemProps {
  icon: React.ReactNode
  label: string
  value: string
  showBorder?: boolean
}

function DetailItem({
  icon,
  label,
  value,
  showBorder = true
}: DetailItemProps) {
  return (
    <>
      <View className="flex-row items-center py-3">
        <View className="bg-primary/10 mr-3 h-10 w-10 items-center justify-center rounded-2xl">
          {icon}
        </View>
        <View className="flex-1">
          <Text className="text-muted-foreground mb-1 text-sm">{label}</Text>
          <Text className="text-foreground text-base font-medium">{value}</Text>
        </View>
      </View>
      {showBorder && <View className="bg-border h-px w-full" />}
    </>
  )
}

export default function ExpenseDetailsScreen() {
  const { id } = useLocalSearchParams<{ id: string }>()
  const insets = useSafeAreaInsets()

  // Find the expense with the matching ID
  const expense = mockExpenses.find(e => e.id === id)

  // Placeholder for receipt image
  const receiptImageUrl =
    'https://images.pexels.com/photos/3943723/pexels-photo-3943723.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2'

  if (!expense) {
    return (
      <View className="bg-background flex-1">
        <Text className="text-destructive mt-10 text-center text-lg">
          Expense not found
        </Text>
      </View>
    )
  }

  return (
    <ScrollView
      className="bg-background flex-1"
      contentContainerStyle={{
        padding: 16,
        paddingBottom: insets.bottom + 16
      }}
    >
      {/* Amount Card */}
      <Card className="mb-4 overflow-hidden">
        <CardContent className="items-center py-8">
          <Text className="text-muted-foreground mb-2 text-base">
            Total Amount
          </Text>
          <Text className="text-primary mb-1 text-[48px] font-extrabold tracking-tight">
            ${expense.amount.toFixed(2)}
          </Text>
        </CardContent>
      </Card>

      {/* Details Card */}
      <Card className="mb-4">
        <CardHeader>
          <CardTitle>Expense Details</CardTitle>
        </CardHeader>
        <CardContent>
          <DetailItem
            icon={<Calendar size={20} className="text-primary" />}
            label="Date"
            value={expense.date}
          />

          <DetailItem
            icon={<Tag size={20} className="text-primary" />}
            label="Category"
            value={expense.category}
          />

          <DetailItem
            icon={<Tag size={20} className="text-primary" />}
            label="Description"
            value={expense.description ?? 'No description provided'}
            showBorder={false}
          />
        </CardContent>
      </Card>

      {/* Receipt Photo */}
      {expense.hasPhoto && (
        <Card className="mb-4">
          <CardHeader>
            <CardTitle>Receipt Photo</CardTitle>
          </CardHeader>
          <CardContent>
            <View className="bg-secondary overflow-hidden rounded-lg">
              <Image
                source={{ uri: receiptImageUrl }}
                className="h-[250px] w-full"
                resizeMode="cover"
              />
            </View>
          </CardContent>
        </Card>
      )}

      {/* Voice Memo */}
      {expense.hasVoice && (
        <Card className="mb-4">
          <CardHeader>
            <CardTitle>Voice Memo</CardTitle>
          </CardHeader>
          <CardContent>
            <View className="bg-secondary/50 flex-row items-center rounded-lg p-4">
              <View className="bg-primary/10 mr-3 h-10 w-10 items-center justify-center rounded-full">
                <Mic size={20} className="text-primary" />
              </View>
              <View>
                <Text className="text-foreground text-base font-medium">
                  Voice Memo
                </Text>
                <Text className="text-muted-foreground text-sm">
                  Duration: 00:12
                </Text>
              </View>
            </View>
          </CardContent>
        </Card>
      )}
    </ScrollView>
  )
}
