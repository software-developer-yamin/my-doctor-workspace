import { createFileRoute } from '@tanstack/react-router'
import { DoctorDetails } from '@/features/doctors/details'

export const Route = createFileRoute('/_authenticated/doctors/$id')({
  component: DoctorDetails,
})
