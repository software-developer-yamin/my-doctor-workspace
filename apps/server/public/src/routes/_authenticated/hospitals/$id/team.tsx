import { createFileRoute } from '@tanstack/react-router'
import { HospitalTeamSchedules } from '@/features/hospitals/team-schedules'

export const Route = createFileRoute('/_authenticated/hospitals/$id/team')({
  component: HospitalTeamSchedules,
})
