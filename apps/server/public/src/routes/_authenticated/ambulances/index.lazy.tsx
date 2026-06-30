import { createLazyFileRoute } from '@tanstack/react-router'
import { AmbulancesList } from '@/features/ambulances'

export const Route = createLazyFileRoute('/_authenticated/ambulances/')({
  component: AmbulancesList,
})
