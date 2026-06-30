import { createLazyFileRoute } from '@tanstack/react-router'
import DiagnosticBookings from '@/features/diagnostic-bookings'

export const Route = createLazyFileRoute('/_authenticated/diagnostic-bookings/')({
  component: DiagnosticBookings,
})
