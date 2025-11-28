import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Text } from '@/components/ui/text'
import React from 'react'
import { View } from 'react-native'
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle
} from '../ui/dialog'

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
    <Dialog open={visible} onOpenChange={onClose}>
      <DialogContent className="">
        <DialogHeader>
          <DialogTitle>Add Comment</DialogTitle>
        </DialogHeader>
        <View className="p-6 pt-0">
          <Input
            className="native:h-[80px] bg-muted/60 rounded-xl border-none px-4 py-3 text-base"
            value={comment}
            onChangeText={onChangeComment}
            placeholder="Type your comment..."
            multiline
            textAlignVertical="top"
            placeholderTextColorClassName="text-muted-foreground"
          />
        </View>
        <DialogFooter>
          <DialogClose>
            <Button variant="outline">
              <Text>Cancel</Text>
            </Button>
          </DialogClose>
          <DialogClose>
            <Button variant="default">
              <Text>Save</Text>
            </Button>
          </DialogClose>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
