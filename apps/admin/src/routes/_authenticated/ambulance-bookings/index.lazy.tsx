import { createLazyFileRoute } from '@tanstack/react-router'
import AmbulanceBookings from '@/features/ambulance-bookings'

export const Route = createLazyFileRoute('/_authenticated/ambulance-bookings/')({
  component: AmbulanceBookings,
})
