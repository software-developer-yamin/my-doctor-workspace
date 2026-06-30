import { createLazyFileRoute } from '@tanstack/react-router'
import LabsList from '@/features/labs'

export const Route = createLazyFileRoute('/_authenticated/labs/')({
  component: LabsList,
})
