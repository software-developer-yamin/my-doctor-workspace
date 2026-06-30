import { createFileRoute } from '@tanstack/react-router'
import { Concentrations } from '@/features/concentrations'

export const Route = createFileRoute('/_authenticated/concentrations/')({
  component: Concentrations,
})
