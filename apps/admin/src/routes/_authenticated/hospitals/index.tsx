import { createFileRoute } from '@tanstack/react-router'
import { HospitalsList } from '@/features/hospitals'

export const Route = createFileRoute('/_authenticated/hospitals/')({
  component: HospitalsList,
})
