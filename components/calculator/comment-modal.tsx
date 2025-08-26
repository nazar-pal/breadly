import { Icon } from '@/components/icon'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Text } from '@/components/ui/text'
import React from 'react'
import { View } from 'react-native'
import { CenteredModal } from '../modals/centered-modal'

interface Props {
  visible: boolean
  comment: string
  onChangeComment: (comment: string) => void
  onClose: () => void
}

export function CommentModal({
  visible,
  comment,
  onChangeComment,
  onClose
}: Props) {
  return (
    <CenteredModal visible={visible} onRequestClose={onClose}>
      <Text className="mb-3 text-center text-lg font-bold text-foreground">
        Add Comment
      </Text>
      <Input
        className="native:h-[80px] mb-5 rounded-xl border-none bg-muted/60 px-4 py-3 text-base"
        value={comment}
        onChangeText={onChangeComment}
        placeholder="Type your comment..."
        multiline
        textAlignVertical="top"
        placeholderClassName="text-muted-foreground"
      />
      <View className="mt-1 flex-row gap-2">
        <Button
          onPress={onClose}
          variant="outline"
          className="flex-1 rounded-lg py-2"
        >
          <Text className="text-base">Cancel</Text>
        </Button>
        <Button
          onPress={onClose}
          className="flex-1 flex-row items-center justify-center rounded-lg bg-primary py-2"
        >
          <Icon
            name="Check"
            size={16}
            className="mr-1 text-primary-foreground"
          />
          <Text className="text-base text-primary-foreground">Save</Text>
        </Button>
      </View>
    </CenteredModal>
  )
}
