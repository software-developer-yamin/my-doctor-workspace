import { createFileRoute } from '@tanstack/react-router'
import { HospitalDetails } from '@/features/hospitals/details'

export const Route = createFileRoute('/_authenticated/hospitals/$id/')({
  component: HospitalDetails,
})
