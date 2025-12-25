import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert'
import { AlertCircle } from 'lucide-react-native'

type ErrorStateProps = {
  message: string
}

export function ErrorState({ message }: ErrorStateProps) {
  return (
    <Alert icon={AlertCircle} variant="destructive" className="mb-4">
      <AlertTitle>Error loading data</AlertTitle>
      <AlertDescription>{message}</AlertDescription>
    </Alert>
  )
}
