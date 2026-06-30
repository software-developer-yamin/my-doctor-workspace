import { useQuery } from '@tanstack/react-query'
import api from '@/lib/api'

export interface DashboardStats {
  summary: {
    totalDoctors: number
    totalHospitals: number
    totalCustomers: number
    totalAppointments: number
    confirmedAppointments: number
    completedAppointments: number
    pendingAppointments: number
    cancelledAppointments: number
    totalRevenue: number
    paidRevenue: number
    ambulanceBookings: number
    diagnosticBookings: number
  }
  chartData: Array<{ name: string; appointments: number; revenue: number }>
  recentAppointments: Array<{
    _id: string
    appointmentDate: string
    status: string
    totalFee: number
    appointmentType: string
    consultationType: string
    doctor: { name: string; photo?: string }
    customer: { name: string; phone?: string }
    hospital: { name: string }
    createdAt: string
  }>
}

export function useDashboardStats() {
  return useQuery<DashboardStats>({
    queryKey: ['analytics', 'dashboard'],
    queryFn: async () => {
      const { data } = await api.get('/analytics/dashboard')
      return data
    },
    staleTime: 2 * 60 * 1000,
    refetchOnWindowFocus: false,
  })
}
