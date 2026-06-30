import { createFileRoute } from '@tanstack/react-router'
import { BdLocations } from '@/features/bd-locations'

export const Route = createFileRoute('/_authenticated/bd-locations/')({
  component: BdLocations,
})
