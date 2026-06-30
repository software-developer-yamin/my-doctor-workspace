import { createFileRoute } from '@tanstack/react-router'
import { Specialities } from '@/features/specialities'

export const Route = createFileRoute('/_authenticated/specialities/')({
  component: Specialities,
})
