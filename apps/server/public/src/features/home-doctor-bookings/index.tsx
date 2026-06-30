import { useState } from 'react'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Home, Phone, Calendar, Clock, User, UserRound } from 'lucide-react'
import { toast } from 'sonner'
import api, { SERVER_URL } from '@/lib/api'
import { Header } from '@/components/layout/header'
import { Main } from '@/components/layout/main'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { SimplePagination } from '@/components/simple-pagination'
import { format } from 'date-fns'

const STATUSES = ['Pending', 'Confirmed', 'Completed', 'Cancelled']

export function HomeDoctorBookingsList() {
  const queryClient = useQueryClient()
  const [statusFilter, setStatusFilter] = useState<string>('all')
  const [page, setPage] = useState(1)
  const [limit, setLimit] = useState(10)

  const { data: bookingsData, isLoading } = useQuery({
    queryKey: ['home-doctor-bookings', statusFilter, page, limit],
    queryFn: async () => {
      const params = new URLSearchParams()
      if (statusFilter !== 'all') params.append('status', statusFilter)
      params.append('page', page.toString())
      params.append('limit', limit.toString())
      const res = await api.get(`/home-doctor-bookings?${params.toString()}`)
      return res.data
    }
  })

  const bookings = Array.isArray(bookingsData) ? bookingsData : (bookingsData as any)?.data || []
  const metadata = (bookingsData as any)?._meta || (bookingsData as any)?.meta || { total: 0, page: 1, limit: 10, totalPages: 1 }


  const updateStatusMutation = useMutation({
    mutationFn: async ({ id, status }: { id: string, status: string }) => {
      const res = await api.put(`/home-doctor-bookings/${id}/status`, { status })
      return res.data
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['home-doctor-bookings'] })
      toast.success('Status updated successfully')
    },
    onError: () => {
      toast.error('Failed to update status')
    }
  })

  const filteredBookings = bookings


  return (
    <>
      <Header />
      <Main>
        <div className='mb-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between'>
          <div>
            <h1 className='text-3xl font-bold tracking-tight'>Home Appointments</h1>
            <p className='text-muted-foreground'>
              Manage customer bookings for doctor home visits and update their statuses.
            </p>
          </div>
        </div>

        {/* Filters Section */}
        <div className='grid grid-cols-1 md:grid-cols-4 gap-4 bg-black/20 p-4 rounded-xl border border-white/5 mb-6'>
          <Select value={statusFilter} onValueChange={setStatusFilter}>
            <SelectTrigger className='bg-background border-input dark:bg-black/40 dark:border-white/10'>
              <SelectValue placeholder="Filter by status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Statuses</SelectItem>
              <SelectItem value="Pending">Pending</SelectItem>
              <SelectItem value="Confirmed">Confirmed</SelectItem>
              <SelectItem value="Completed">Completed</SelectItem>
              <SelectItem value="Cancelled">Cancelled</SelectItem>
            </SelectContent>
          </Select>
          
          <div className='hidden md:block'></div>
          <div className='hidden md:block'></div>
          
          <Button 
            variant='outline' 
            className='border-white/10 hover:bg-white/5' 
            onClick={() => setStatusFilter('all')}
          >
            Reset Filters
          </Button>
        </div>

        <div className='rounded-xl border bg-card/30 backdrop-blur-md shadow-sm overflow-hidden'>
          <Table>
            <TableHeader className='bg-muted/50'>
              <TableRow>
                <TableHead className='font-semibold'>Customer</TableHead>
                <TableHead className='font-semibold'>Doctor</TableHead>
                <TableHead className='font-semibold'>Schedule & Date</TableHead>
                <TableHead className='font-semibold'>Status</TableHead>
                <TableHead className='text-right font-semibold'>Update Action</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {isLoading ? (
                <TableRow>
                  <TableCell colSpan={5} className='h-32 text-center'>
                    <div className='flex flex-col items-center justify-center gap-2'>
                      <div className='h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent'></div>
                    </div>
                  </TableCell>
                </TableRow>
              ) : filteredBookings.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={5} className='h-32 text-center text-muted-foreground'>
                    <div className='flex flex-col items-center justify-center gap-2'>
                      <Home className='h-8 w-8 opacity-20' />
                      <p className='font-medium'>No appointments found.</p>
                    </div>
                  </TableCell>
                </TableRow>
              ) : (
                filteredBookings.map((booking: any) => (
                  <TableRow key={booking._id} className='hover:bg-muted/30 transition-colors'>
                    <TableCell>
                      <div className='flex items-center gap-3'>
                        <div className='flex flex-col'>
                          <span className='font-bold flex items-center gap-1.5'>
                            <UserRound size={14} className='text-muted-foreground' />
                            {booking.customer?.name || 'Unknown'}
                          </span>
                          <span className='text-xs flex items-center gap-1.5 text-muted-foreground mt-1'>
                            <Phone size={12} /> {booking.customer?.phone || 'N/A'}
                          </span>
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className='flex items-center gap-3'>
                        <Avatar className='h-8 w-8 border'>
                          <AvatarImage src={booking.doctor?.photo ? `${SERVER_URL}${booking.doctor.photo}` : ''} />
                          <AvatarFallback><User size={14} /></AvatarFallback>
                        </Avatar>
                        <div className='flex flex-col'>
                          <span className='font-bold text-foreground text-sm'>{booking.doctor?.name || 'Unknown'}</span>
                          <span className='text-[10px] text-muted-foreground uppercase tracking-tighter'>{booking.doctor?.phone}</span>
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className='flex flex-col gap-1'>
                        <Badge variant="outline" className='w-fit flex items-center gap-1.5 bg-background'>
                          <Calendar size={12} />
                          {booking.booking_date ? format(new Date(booking.booking_date), 'PPP') : 'N/A'}
                        </Badge>
                        <span className='text-xs text-muted-foreground flex items-center gap-1.5 mt-1'>
                          <Clock size={12} />
                          {booking.schedule}
                        </span>
                      </div>
                    </TableCell>
                    <TableCell>
                      <Badge 
                        variant="secondary"
                        className={`
                          ${booking.status === 'Pending' ? 'bg-yellow-500/10 text-yellow-500' : ''}
                          ${booking.status === 'Confirmed' ? 'bg-blue-500/10 text-blue-500' : ''}
                          ${booking.status === 'Completed' ? 'bg-green-500/10 text-green-500' : ''}
                          ${booking.status === 'Cancelled' ? 'bg-red-500/10 text-red-500' : ''}
                        `}
                      >
                        {booking.status}
                      </Badge>
                    </TableCell>
                    <TableCell className='text-right'>
                      <div className="flex justify-end">
                        <Select 
                          disabled={updateStatusMutation.isPending}
                          value={booking.status} 
                          onValueChange={(v: string) => updateStatusMutation.mutate({ id: booking._id, status: v })}
                        >
                          <SelectTrigger className="w-[140px] h-8 text-xs">
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            {STATUSES.map(s => (
                              <SelectItem key={s} value={s}>{s}</SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </div>
        <SimplePagination 
          metadata={metadata} 
          onPageChange={setPage} 
          onLimitChange={(l) => { setLimit(l); setPage(1); }} 
        />
      </Main>
    </>
  )
}
