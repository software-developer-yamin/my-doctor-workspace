import { createFileRoute } from '@tanstack/react-router'
import { HomeDoctorBookingsList } from '@/features/home-doctor-bookings'

export const Route = createFileRoute('/_authenticated/home-doctor-bookings/')({
  component: HomeDoctorBookingsList,
})
