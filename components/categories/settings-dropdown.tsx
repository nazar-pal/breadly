import { Text } from '@/components/ui/text'
import { Edit2, Settings } from '@/lib/icons'
import { router } from 'expo-router'
import React, { useState } from 'react'
import { Modal, Pressable, View } from 'react-native'
import Animated, { FadeIn, FadeOut } from 'react-native-reanimated'

export function SettingsDropdown() {
  const handleEditPress = () => {
    router.push('/categories/edit/expense')
    setVisible(false)
  }

  const [visible, setVisible] = useState(false)

  return (
    <>
      {/* Settings Icon Button */}
      <Pressable
        onPress={() => setVisible(true)}
        className="mr-4 rounded-full p-2 active:bg-muted"
        hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
      >
        <Settings size={24} className="text-foreground" />
      </Pressable>

      {/* Dropdown Modal */}
      <Modal
        visible={visible}
        transparent
        animationType="none"
        onRequestClose={() => setVisible(false)}
      >
        <Pressable className="flex-1" onPress={() => setVisible(false)}>
          <View className="flex-1 items-end justify-start pr-4 pt-16">
            <Animated.View
              entering={FadeIn.duration(150)}
              exiting={FadeOut.duration(100)}
              className="min-w-[140px] rounded-lg border border-border bg-background shadow-lg"
            >
              {/* Edit Button */}
              <Pressable
                onPress={handleEditPress}
                className="flex-row items-center gap-3 px-4 py-3 active:bg-muted"
              >
                <Edit2 size={16} className="text-muted-foreground" />
                <Text className="font-medium text-foreground">Edit</Text>
              </Pressable>
            </Animated.View>
          </View>
        </Pressable>
      </Modal>
    </>
  )
}
