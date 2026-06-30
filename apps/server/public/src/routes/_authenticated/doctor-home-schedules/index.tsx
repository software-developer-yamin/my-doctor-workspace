import { createFileRoute } from '@tanstack/react-router'
import { DoctorHomeSchedulesList } from '@/features/doctor-home-schedules'

export const Route = createFileRoute('/_authenticated/doctor-home-schedules/')({
  component: DoctorHomeSchedulesList,
})
