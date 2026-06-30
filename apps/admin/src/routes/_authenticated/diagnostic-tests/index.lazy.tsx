import { createLazyFileRoute } from '@tanstack/react-router'
import DiagnosticTests from '@/features/diagnostic-tests'

export const Route = createLazyFileRoute('/_authenticated/diagnostic-tests/')({
  component: DiagnosticTests,
})
