'use client'

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import api from '@/lib/api'
import { Header } from '@/components/layout/header'
import { Main } from '@/components/layout/main'
import { ProfileDropdown } from '@/components/profile-dropdown'
import { Search } from '@/components/search'
import { ThemeSwitch } from '@/components/theme-switch'
import { ConfigDrawer } from '@/components/config-drawer'
import { Button } from '@/components/ui/button'
import { MoreHorizontal, Edit2, Trash2, Search as SearchIcon, FilterX, MapPin, Phone, Calendar as CalendarIcon, User, Ambulance as AmbulanceIcon } from 'lucide-react'

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { toast } from 'sonner'
import { useState } from 'react'
import { Input } from '@/components/ui/input'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { SimplePagination } from '@/components/simple-pagination'
import { Badge } from '@/components/ui/badge'
import { format } from 'date-fns'
import { AssignAmbulanceDialog } from './components/assign-ambulance-dialog'

export default function AmbulanceBookings() {
  const queryClient = useQueryClient()
  const [open, setOpen] = useState(false)
  const [currentRow, setCurrentRow] = useState<any | null>(null)

  // Filters State
  const [searchTerm, setSearchTerm] = useState('')
  const [statusFilter, setStatusFilter] = useState('all')
  const [page, setPage] = useState(1)
  const [limit, setLimit] = useState(10)

  const { data: bookingsData, isLoading } = useQuery({
    queryKey: ['ambulance-bookings', searchTerm, statusFilter, page, limit],
    queryFn: async () => {
      const params = new URLSearchParams()
      if (searchTerm) params.append('search', searchTerm)
      if (statusFilter !== 'all') params.append('status', statusFilter)
      params.append('page', page.toString())
      params.append('limit', limit.toString())
      
      const res = await api.get(`/ambulance-bookings?${params.toString()}`)
      return res.data
    }
  })

  const bookings = Array.isArray(bookingsData) ? bookingsData : (bookingsData as any)?.data || []
  const metadata = (bookingsData as any)?._meta || (bookingsData as any)?.meta || { total: 0, page: 1, limit: 10, totalPages: 1 }

  const deleteMutation = useMutation({
    mutationFn: (id: string) => api.delete(`/ambulance-bookings/${id}`),
    onSuccess: () => {
      toast.success('Booking deleted')
      queryClient.invalidateQueries({ queryKey: ['ambulance-bookings'] })
    },
    onError: () => {
      toast.error('Failed to delete')
    }
  })

  const handleDelete = (id: string) => {
    if (!window.confirm('Are you sure?')) return
    deleteMutation.mutate(id)
  }

  const resetFilters = () => {
    setSearchTerm('')
    setStatusFilter('all')
    setPage(1)
  }

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'Pending': return <Badge variant='outline' className='bg-yellow-500/10 text-yellow-500 border-yellow-500/20'>Pending</Badge>
      case 'Confirmed': return <Badge className='bg-blue-500/20 text-blue-500 hover:bg-blue-500/30'>Confirmed</Badge>
      case 'Completed': return <Badge className='bg-green-500/20 text-green-500 hover:bg-green-500/30'>Completed</Badge>
      case 'Cancelled': return <Badge variant='destructive'>Cancelled</Badge>
      default: return <Badge variant='secondary'>{status}</Badge>
    }
  }

  return (
    <>
      <Header fixed>
        <Search />
        <div className='ms-auto flex items-center space-x-4'>
          <ThemeSwitch />
          <ConfigDrawer />
          <ProfileDropdown />
        </div>
      </Header>

      <Main className='flex flex-1 flex-col gap-4 sm:gap-6'>
        <div className='flex flex-wrap items-end justify-between gap-2'>
          <div>
            <h2 className='text-2xl font-bold tracking-tight'>Ambulance Bookings</h2>
            <p className='text-muted-foreground'>
              Manage and assign ambulances to customer booking requests.
            </p>
          </div>
        </div>

        <div className='grid grid-cols-1 md:grid-cols-3 gap-4 bg-black/20 p-4 rounded-xl border border-white/5'>
          <div className='relative'>
            <SearchIcon className='absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground' size={16} />
            <Input 
              placeholder='Search address or phone...' 
              className='pl-10 bg-background border-input dark:bg-black/40 dark:border-white/10'
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          
          <Select value={statusFilter} onValueChange={setStatusFilter}>
            <SelectTrigger className='bg-background border-input dark:bg-black/40 dark:border-white/10'>
              <SelectValue placeholder="Status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Status</SelectItem>
              <SelectItem value="Pending">Pending</SelectItem>
              <SelectItem value="Confirmed">Confirmed</SelectItem>
              <SelectItem value="Completed">Completed</SelectItem>
              <SelectItem value="Cancelled">Cancelled</SelectItem>
            </SelectContent>
          </Select>

          <Button variant='outline' className='border-white/10 hover:bg-white/5' onClick={resetFilters}>
            <FilterX className='mr-2' size={16} /> Reset
          </Button>
        </div>

        <div className='overflow-hidden rounded-xl border border-white/5 bg-black/20 backdrop-blur-sm shadow-2xl'>
          <Table>
            <TableHeader className='bg-white/5'>
              <TableRow className='hover:bg-transparent border-white/5'>
                <TableHead className='ps-6 py-4'>Customer & Contact</TableHead>
                <TableHead className='py-4'>Route / Type</TableHead>
                <TableHead className='py-4'>Schedule</TableHead>
                <TableHead className='py-4'>Assigned Ambulance</TableHead>
                <TableHead className='py-4'>Status</TableHead>
                <TableHead className='w-[100px] text-right pe-6 py-4'>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {isLoading ? (
                <TableRow>
                  <TableCell colSpan={6} className='h-32 text-center'>
                     <div className='flex items-center justify-center gap-2'>
                        <div className='h-2 w-2 bg-primary rounded-full animate-bounce' />
                        <div className='h-2 w-2 bg-primary rounded-full animate-bounce [animation-delay:-.3s]' />
                        <div className='h-2 w-2 bg-primary rounded-full animate-bounce [animation-delay:-.5s]' />
                     </div>
                  </TableCell>
                </TableRow>
              ) : bookings.length > 0 ? (
                bookings.map((item: any) => (
                  <TableRow key={item._id} className='hover:bg-white/[0.02] border-white/5 transition-colors'>
                    <TableCell className="ps-6 py-4">
                        <div className='flex flex-col'>
                          <span className='text-sm font-bold text-white flex items-center gap-2'>
                            <User size={12} className='text-primary' /> {item.customer?.name || 'Unknown'}
                          </span>
                          <span className='text-[10px] text-muted-foreground font-medium flex items-center gap-2 mt-1'>
                            <Phone size={10} /> {item.phone}
                          </span>
                        </div>
                    </TableCell>
                    <TableCell className='py-4'>
                       <div className='flex flex-col gap-1'>
                          <div className='text-[11px] text-white flex items-center gap-1'>
                            <MapPin size={10} className='text-green-500' /> {item.from_address}
                          </div>
                          <div className='text-[11px] text-white flex items-center gap-1'>
                            <MapPin size={10} className='text-red-500' /> {item.to_address}
                          </div>
                          <div className='mt-1 flex gap-1 items-center'>
                            {item.isRoundTrip ? (
                               <Badge variant='outline' className='text-[9px] uppercase border-blue-500/30 text-blue-400 py-0'>Round Trip</Badge>
                            ) : (
                               <Badge variant='outline' className='text-[9px] uppercase border-white/10 text-muted-foreground py-0'>One Way</Badge>
                            )}
                            <Badge variant='outline' className='text-[9px] uppercase border-primary/30 text-primary py-0'>{item.ambulance_type}</Badge>
                          </div>
                       </div>
                    </TableCell>
                    <TableCell className='py-4'>
                       <div className='flex flex-col'>
                          <span className='text-xs text-white font-medium flex items-center gap-1'>
                            <CalendarIcon size={12} className='text-primary' />
                            {item.date_time ? format(new Date(item.date_time), 'PPp') : 'N/A'}
                          </span>
                       </div>
                    </TableCell>
                    <TableCell className='py-4'>
                        {item.assigned_ambulance ? (
                           <div className='flex items-center gap-2'>
                              <div className='h-8 w-8 rounded-full bg-primary/10 flex items-center justify-center text-primary'>
                                <AmbulanceIcon size={14} />
                              </div>
                              <div className='flex flex-col'>
                                <span className='text-[11px] font-bold'>{item.assigned_ambulance.name}</span>
                                <span className='text-[9px] text-muted-foreground'>{item.assigned_ambulance.ambulance_number}</span>
                              </div>
                           </div>
                        ) : (
                           <span className='text-[10px] italic text-muted-foreground'>Not Assigned</span>
                        )}
                    </TableCell>
                    <TableCell className='py-4'>
                        {getStatusBadge(item.status)}
                    </TableCell>
                    <TableCell className='text-right pe-6 py-4'>
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant='ghost' className='h-9 w-9 p-0 rounded-full hover:bg-white/10'>
                            <MoreHorizontal className='h-5 w-5' />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align='end' className='w-48 bg-popover border-border shadow-2xl'>
                          <DropdownMenuItem className='cursor-pointer py-2.5' onClick={() => { setCurrentRow(item); setOpen(true); }}>
                            <Edit2 className='mr-3 h-4 w-4 text-primary' />
                            Update / Assign
                          </DropdownMenuItem>
                          <DropdownMenuSeparator className='bg-white/5' />
                          <DropdownMenuItem className='text-destructive focus:text-destructive cursor-pointer py-2.5' onClick={() => handleDelete(item._id)}>
                            <Trash2 className='mr-3 h-4 w-4' />
                            Delete Request
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </TableCell>
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell colSpan={6} className='h-32 text-center text-muted-foreground'>
                    No bookings found.
                  </TableCell>
                </TableRow>
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

      <AssignAmbulanceDialog 
        open={open} 
        onOpenChange={setOpen}
        currentRow={currentRow}
        onSuccess={() => queryClient.invalidateQueries({ queryKey: ['ambulance-bookings'] })}
      />
    </>
  )
}
