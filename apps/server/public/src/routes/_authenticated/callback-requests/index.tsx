import { createFileRoute } from '@tanstack/react-router'
import { CallbackRequests } from '@/features/callback-requests'

export const Route = createFileRoute('/_authenticated/callback-requests/')({
  component: CallbackRequests,
})
