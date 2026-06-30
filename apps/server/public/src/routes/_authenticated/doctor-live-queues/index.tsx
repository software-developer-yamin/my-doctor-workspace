import { createFileRoute } from '@tanstack/react-router'
import { DoctorLiveQueuesList } from '@/features/doctor-live-queues'

export const Route = createFileRoute(
  '/_authenticated/doctor-live-queues/',
)({
  component: DoctorLiveQueuesList,
})
