import { cn } from '@/lib/utils'
import { Ionicons } from '@expo/vector-icons'
import * as R from 'react'
import {
  Modal,
  Platform,
  Pressable,
  ScrollView,
  Text,
  TouchableWithoutFeedback,
  View,
  useWindowDimensions
} from 'react-native'
import { KeyboardAvoidingView } from 'react-native-keyboard-controller'

interface DialogProps {
  children: R.ReactNode
  className?: string
  open?: boolean
  onOpenChange?: (open: boolean) => void
}

interface DialogTriggerProps {
  children: R.ReactNode
  className?: string
  disabled?: boolean
  asChild?: boolean
}

interface DialogContentProps {
  children: R.ReactNode
  className?: string
  showCloseButton?: boolean
  onInteractOutside?: () => void
}

interface DialogHeaderProps {
  className?: string
  children: R.ReactNode
}

interface DialogFooterProps {
  className?: string
  children: R.ReactNode
}

interface DialogTitleProps {
  className?: string
  children: R.ReactNode
}

interface DialogDescriptionProps {
  className?: string
  children: R.ReactNode
}

interface DialogCloseProps {
  children: R.ReactElement<{ onPress?: (e: any) => void }>
  className?: string
}

const DialogContext = R.createContext<{
  open: boolean
  setOpen: (open: boolean) => void
}>({
  open: false,
  setOpen: () => {}
})

const Dialog = R.forwardRef<View, DialogProps>(
  ({ children, className, open, onOpenChange, ...props }, ref) => {
    const [internalOpen, setInternalOpen] = R.useState(false)

    const isControlled = open !== undefined
    const isOpen = isControlled ? open : internalOpen

    const setOpen = (value: boolean) => {
      if (!isControlled) {
        setInternalOpen(value)
      }
      onOpenChange?.(value)
    }

    return (
      <DialogContext.Provider value={{ open: isOpen, setOpen }}>
        <View ref={ref} className={className} {...props}>
          {children}
        </View>
      </DialogContext.Provider>
    )
  }
)
Dialog.displayName = 'Dialog'

const DialogTrigger = R.forwardRef<View, DialogTriggerProps>(
  (
    { children, className, disabled = false, asChild = false, ...props },
    ref
  ) => {
    const { setOpen } = R.useContext(DialogContext)

    if (asChild) {
      const child = R.Children.only(children) as R.ReactElement<{
        onPress?: (e: any) => void
        ref?: R.Ref<any>
        disabled?: boolean
      }>
      return R.cloneElement(child, {
        ...props,
        ref,
        onPress: (e: any) => {
          child.props?.onPress?.(e)
          setOpen(true)
        },
        disabled
      })
    }

    return (
      <Pressable
        ref={ref}
        className={className}
        disabled={disabled}
        onPress={() => setOpen(true)}
        accessibilityRole="button"
        {...props}
      >
        {children}
      </Pressable>
    )
  }
)
DialogTrigger.displayName = 'DialogTrigger'

const DialogContent = R.forwardRef<View, DialogContentProps>(
  (
    {
      children,
      className,
      showCloseButton = true,
      onInteractOutside,
      ...props
    },
    ref
  ) => {
    const { open, setOpen } = R.useContext(DialogContext)
    const { height: windowHeight } = useWindowDimensions()
    const contentMaxHeight = Math.floor(windowHeight * 0.8)

    const handleClose = () => setOpen(false)

    return (
      <Modal
        visible={open}
        transparent
        statusBarTranslucent
        animationType="fade"
        onRequestClose={handleClose}
      >
        <TouchableWithoutFeedback
          onPress={() => {
            onInteractOutside?.()
            handleClose()
          }}
        >
          <View className="flex-1 bg-black/50">
            <KeyboardAvoidingView
              behavior={Platform.select({
                ios: 'padding',
                android: 'height'
              })}
              keyboardVerticalOffset={0}
              style={{ flex: 1 }}
            >
              <View className="flex-1 items-center justify-center">
                <TouchableWithoutFeedback>
                  <View
                    ref={ref}
                    className={cn(
                      'm-6 rounded-2xl bg-popover',
                      'w-[92vw] max-w-sm',
                      Platform.OS === 'ios'
                        ? 'ios:shadow-xl'
                        : 'android:elevation-8',
                      className
                    )}
                    style={{ maxHeight: contentMaxHeight }}
                    {...props}
                  >
                    <ScrollView
                      bounces={false}
                      keyboardShouldPersistTaps="handled"
                    >
                      {showCloseButton && (
                        <Pressable
                          onPress={handleClose}
                          className="absolute right-4 top-4 z-50 rounded-full bg-muted/50 p-2"
                        >
                          <Ionicons name="close" size={24} color="#666" />
                        </Pressable>
                      )}
                      {children}
                    </ScrollView>
                  </View>
                </TouchableWithoutFeedback>
              </View>
            </KeyboardAvoidingView>
          </View>
        </TouchableWithoutFeedback>
      </Modal>
    )
  }
)

DialogContent.displayName = 'DialogContent'

const DialogHeader = R.forwardRef<View, DialogHeaderProps>(
  ({ className, children, ...props }, ref) => (
    <View ref={ref} className={cn('flex-col gap-2 p-6', className)} {...props}>
      {children}
    </View>
  )
)

DialogHeader.displayName = 'DialogHeader'

const DialogFooter = R.forwardRef<View, DialogFooterProps>(
  ({ className, children, ...props }, ref) => (
    <View
      ref={ref}
      className={cn(
        'flex-row items-center justify-end gap-3 p-6 pt-0',
        className
      )}
      {...props}
    >
      {children}
    </View>
  )
)

DialogFooter.displayName = 'DialogFooter'

const DialogTitle = R.forwardRef<Text, DialogTitleProps>(
  ({ className, children, ...props }, ref) => (
    <Text
      ref={ref}
      className={cn(
        'text-xl font-semibold leading-none tracking-tight text-foreground',
        className
      )}
      {...props}
    >
      {children}
    </Text>
  )
)

DialogTitle.displayName = 'DialogTitle'

const DialogDescription = R.forwardRef<Text, DialogDescriptionProps>(
  ({ className, children, ...props }, ref) => (
    <Text
      ref={ref}
      className={cn('mt-2 text-base text-muted-foreground', className)}
      {...props}
    >
      {children}
    </Text>
  )
)

DialogDescription.displayName = 'DialogDescription'

const DialogClose = R.forwardRef<View, DialogCloseProps>(
  ({ children, ...props }, ref) => {
    const { setOpen } = R.useContext(DialogContext)

    return R.cloneElement(children, {
      ...children.props,
      ...props,
      onPress: (e: any) => {
        children.props?.onPress?.(e)
        setOpen(false)
      }
    })
  }
)

DialogClose.displayName = 'DialogClose'

export {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger
}
