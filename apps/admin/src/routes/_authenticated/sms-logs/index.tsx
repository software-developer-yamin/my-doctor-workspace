import { createFileRoute } from '@tanstack/react-router'
import { SmsLogs } from '@/features/sms-logs'

export const Route = createFileRoute('/_authenticated/sms-logs/')({
  component: SmsLogs,
})
