import { createFileRoute } from '@tanstack/react-router'
import { GuideBookingsList } from '@/features/guide-bookings'

export const Route = createFileRoute('/_authenticated/guide-bookings/')({
  component: GuideBookingsList,
})
