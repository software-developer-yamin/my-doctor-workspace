import { useState } from 'react'
import { useQuery } from '@tanstack/react-query'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { 
  Calendar, 
  Search, 
  Filter, 
  RotateCcw,
  CheckCircle2,
  Clock,
  XCircle,
  AlertCircle
} from 'lucide-react'
import { SimplePagination } from '@/components/simple-pagination'
function filterAppointments(appointments: any[], searchTerm: string) {
  if (!searchTerm) return appointments
  return appointments.filter((app: any) => 
    app.customer?.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    app.doctor?.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    app.hospital?.name?.toLowerCase().includes(searchTerm.toLowerCase())
  )
}
import api from '@/lib/api'
import { format } from 'date-fns'
import { StatusChangeDialog } from './components/status-change-dialog'
import { Header } from '@/components/layout/header'
import { Main } from '@/components/layout/main'

const statusMap: any = {
  Pending: { color: 'bg-yellow-500/10 text-yellow-500 border-yellow-500/20', icon: Clock },
  Confirmed: { color: 'bg-blue-500/10 text-blue-500 border-blue-500/20', icon: CheckCircle2 },
  Completed: { color: 'bg-green-500/10 text-green-500 border-green-500/20', icon: CheckCircle2 },
  Cancelled: { color: 'bg-red-500/10 text-red-500 border-red-500/20', icon: XCircle },
  'In Progress': { color: 'bg-purple-500/10 text-purple-500 border-purple-500/20', icon: AlertCircle },
}

export function AppointmentsList() {

  const [statusFilter, setStatusFilter] = useState<string>('all')
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedAppointment, setSelectedAppointment] = useState<any>(null)
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [page, setPage] = useState(1)
  const [limit, setLimit] = useState(10)

  const { data: appointmentsData, isLoading, refetch } = useQuery({
    queryKey: ['appointments', statusFilter, page, limit],
    queryFn: async () => {
      const params = new URLSearchParams()
      if (statusFilter !== 'all') params.append('status', statusFilter)
      params.append('page', page.toString())
      params.append('limit', limit.toString())
      const res = await api.get(`/appointments?${params.toString()}`)
      return res.data
    },
  })

  const appointments = Array.isArray(appointmentsData) ? appointmentsData : (appointmentsData as any)?.data || []
  const metadata = (appointmentsData as any)?._meta || (appointmentsData as any)?.meta || { total: 0, page: 1, limit: 10, totalPages: 1 }

  const filteredAppointments = filterAppointments(appointments, searchTerm)


  const handleUpdateStatus = (appointment: any) => {
    setSelectedAppointment(appointment)
    setIsDialogOpen(true)
  }

  const resetFilters = () => {
    setStatusFilter('all')
    setSearchTerm('')
  }

  return (
    <>
      <Header fixed />
      <Main>
        <div className='mb-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between'>
          <div>
            <h1 className='text-3xl font-bold tracking-tight'>Appointments</h1>
            <p className='text-muted-foreground'>
              Manage medical bookings and update consultation statuses.
            </p>
          </div>
        </div>

        {/* Filters Section */}
        <div className='grid grid-cols-1 md:grid-cols-4 gap-4 bg-black/20 p-4 rounded-xl border border-white/5 mb-6'>
          <div className='relative'>
            <Search className='absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground' />
            <Input
              placeholder='Search patients or doctors...'
              className='pl-10 bg-background border-input dark:bg-black/40 dark:border-white/10'
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>

          <Select value={statusFilter} onValueChange={setStatusFilter}>
            <SelectTrigger className='bg-background border-input dark:bg-black/40 dark:border-white/10'>
              <div className='flex items-center gap-2'>
                <Filter className='h-4 w-4 text-muted-foreground' />
                <SelectValue placeholder='Filter by Status' />
              </div>
            </SelectTrigger>
            <SelectContent>
              <SelectItem value='all'>All Statuses</SelectItem>
              <SelectItem value='Pending'>Pending</SelectItem>
              <SelectItem value='Confirmed'>Confirmed</SelectItem>
              <SelectItem value='In Progress'>In Progress</SelectItem>
              <SelectItem value='Completed'>Completed</SelectItem>
              <SelectItem value='Cancelled'>Cancelled</SelectItem>
            </SelectContent>
          </Select>
          
          <div className='hidden md:block'></div>

          <Button variant='outline' onClick={resetFilters} className='border-white/10 hover:bg-white/5'>
            <RotateCcw className='mr-2 h-4 w-4' />
            Reset Filters
          </Button>
        </div>

        <div className='rounded-xl border bg-card/30 backdrop-blur-md shadow-sm overflow-hidden'>
          <Table>
            <TableHeader className='bg-muted/50'>
              <TableRow>
                <TableHead className='font-semibold'>Patient</TableHead>
                <TableHead className='font-semibold'>Doctor & Hospital</TableHead>
                <TableHead className='font-semibold'>Schedule</TableHead>
                <TableHead className='font-semibold'>Type</TableHead>
                <TableHead className='font-semibold'>Status</TableHead>
                <TableHead className='text-right font-semibold'>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {isLoading ? (
                <TableRow>
                  <TableCell colSpan={6} className='h-32 text-center'>
                    <div className='flex flex-col items-center justify-center gap-2'>
                      <div className='h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent'></div>
                      <p className='text-sm text-muted-foreground font-medium'>Loading appointments...</p>
                    </div>
                  </TableCell>
                </TableRow>
              ) : filteredAppointments?.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={6} className='h-32 text-center text-muted-foreground'>
                    <div className='flex flex-col items-center justify-center gap-2'>
                      <Calendar className='h-8 w-8 opacity-20' />
                      <p className='font-medium'>No appointments found.</p>
                    </div>
                  </TableCell>
                </TableRow>
              ) : (
                filteredAppointments?.map((app: any) => {
                  const status = statusMap[app.status] || statusMap.Pending
                  const StatusIcon = status.icon
                  return (
                    <TableRow key={app._id} className='hover:bg-muted/30 transition-colors'>
                      <TableCell>
                        <div className='flex flex-col'>
                          <span className='font-bold text-foreground'>{app.customer?.name}</span>
                          <span className='text-xs text-muted-foreground'>{app.customer?.phone}</span>
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className='flex flex-col'>
                          <span className='font-semibold text-primary/90'>Dr. {app.doctor?.name}</span>
                          <span className='text-xs text-muted-foreground'>{app.hospital?.name}</span>
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className='flex flex-col gap-0.5'>
                          <span className='text-sm font-medium'>
                            {format(new Date(app.appointmentDate), 'dd MMM yyyy')}
                          </span>
                          <span className='text-[10px] uppercase tracking-wider text-muted-foreground font-bold'>
                            {app.selectedSchedule.startTime} - {app.selectedSchedule.endTime}
                          </span>
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className='flex flex-col gap-1'>
                          <Badge variant='outline' className='w-fit text-[10px] px-1.5 py-0'>
                            {app.consultationType}
                          </Badge>
                          <span className='text-[10px] text-muted-foreground font-medium uppercase'>
                            {app.appointmentType}
                          </span>
                        </div>
                      </TableCell>
                      <TableCell>
                        <Badge className={`flex w-fit items-center gap-1.5 px-2 py-0.5 border shadow-sm ${status.color}`}>
                          <StatusIcon className='h-3 w-3' />
                          {app.status}
                        </Badge>
                      </TableCell>
                      <TableCell className='text-right'>
                        <Button 
                          variant='ghost' 
                          size='sm' 
                          className='hover:bg-primary/10 hover:text-primary font-semibold'
                          onClick={() => handleUpdateStatus(app)}
                        >
                          Update Status
                        </Button>
                      </TableCell>
                    </TableRow>
                  )
                })
              )}
            </TableBody>
          </Table>
        </div>
        <SimplePagination 
          metadata={metadata} 
          onPageChange={setPage} 
          onLimitChange={(l) => { setLimit(l); setPage(1); }} 
        />

        <StatusChangeDialog
          open={isDialogOpen}
          onOpenChange={setIsDialogOpen}
          appointment={selectedAppointment}
          onSuccess={refetch}
        />
      </Main>
    </>
  )
}
