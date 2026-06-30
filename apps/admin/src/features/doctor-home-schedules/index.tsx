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
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { 
  Clock, 
  Search, 
    Home,
  CheckCircle2,
    AlertCircle
} from 'lucide-react'
import api, { SERVER_URL } from '@/lib/api'
import { HomeScheduleDialog } from './components/home-schedule-dialog'
import { Header } from '@/components/layout/header'
import { Main } from '@/components/layout/main'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { SimplePagination } from '@/components/simple-pagination'

export function DoctorHomeSchedulesList() {
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedDoctor, setSelectedDoctor] = useState<any>(null)
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [page, setPage] = useState(1)
  const [limit, setLimit] = useState(10)

  // Fetch doctors who are marked as available for home service
  const { data: doctorsData, isLoading } = useQuery({
    queryKey: ['doctors', 'home-service', searchTerm, page, limit],
    queryFn: async () => {
      const res = await api.get(`/doctors/public?isAvailableHome=true&search=${searchTerm}&page=${page}&limit=${limit}`)
      return res.data
    },
  })

  const doctors = Array.isArray(doctorsData) ? doctorsData : (doctorsData as any)?.data || []
  const metadata = (doctorsData as any)?._meta || (doctorsData as any)?.meta || { total: 0, page: 1, limit: 10, totalPages: 1 }

  const { data: schedules } = useQuery({
    queryKey: ['doctor-home-schedules'],
    queryFn: async () => {
      const res = await api.get('/doctor-home-schedules')
      return Array.isArray(res.data) ? res.data : res.data?.data ?? []
    }
  })

  // Map schedules to doctors for easy display
  const scheduleMap = schedules?.reduce((acc: any, curr: any) => {
    acc[curr.doctor?._id || curr.doctor] = curr.schedules
    return acc
  }, {})

  const handleManageSchedule = (doctor: any) => {
    setSelectedDoctor(doctor)
    setIsDialogOpen(true)
  }

  return (
    <>
      <Header />
      <Main>
        <div className='mb-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between'>
          <div>
            <h1 className='text-3xl font-bold tracking-tight'>Doctor Home Schedules</h1>
            <p className='text-muted-foreground'>
              Manage weekday-based availability slots for doctors providing home consultation.
            </p>
          </div>
        </div>

        <div className='mb-6 grid grid-cols-1 gap-4 md:grid-cols-3 lg:grid-cols-4'>
          <div className='relative col-span-2'>
            <Search className='absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground' />
            <Input
              placeholder='Search home-service providers...'
              className='pl-10'
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
        </div>

        <div className='rounded-xl border bg-card/30 backdrop-blur-md shadow-sm overflow-hidden'>
          <Table>
            <TableHeader className='bg-muted/50'>
              <TableRow>
                <TableHead className='font-semibold'>Doctor</TableHead>
                <TableHead className='font-semibold'>Degrees</TableHead>
                <TableHead className='font-semibold'>Schedule Status</TableHead>
                <TableHead className='font-semibold'>Configured Slots</TableHead>
                <TableHead className='text-right font-semibold'>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {isLoading ? (
                <TableRow>
                  <TableCell colSpan={5} className='h-32 text-center'>
                    <div className='flex flex-col items-center justify-center gap-2'>
                      <div className='h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent'></div>
                      <p className='text-sm text-muted-foreground font-medium'>Loading available providers...</p>
                    </div>
                  </TableCell>
                </TableRow>
              ) : doctors?.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={5} className='h-32 text-center text-muted-foreground'>
                    <div className='flex flex-col items-center justify-center gap-2'>
                      <Home className='h-8 w-8 opacity-20' />
                      <p className='font-medium'>No home-service doctors found.</p>
                      <p className='text-xs'>Make sure doctors are marked as 'Available for Home Service' in their profiles.</p>
                    </div>
                  </TableCell>
                </TableRow>
              ) : (
                doctors?.map((doctor: any) => {
                  const doctorSchedules = scheduleMap?.[doctor._id]
                  const hasSchedule = doctorSchedules && doctorSchedules.length > 0
                  
                  return (
                    <TableRow key={doctor._id} className='hover:bg-muted/30 transition-colors'>
                      <TableCell>
                        <div className='flex items-center gap-3'>
                          <Avatar className='h-10 w-10 border'>
                            <AvatarImage src={doctor.photo ? `${SERVER_URL}${doctor.photo}` : ''} />
                            <AvatarFallback>{doctor.name.substring(0, 2).toUpperCase()}</AvatarFallback>
                          </Avatar>
                          <div className='flex flex-col'>
                            <span className='font-bold text-foreground'>{doctor.name}</span>
                            <span className='text-[10px] text-muted-foreground uppercase tracking-tighter'>{doctor.email}</span>
                          </div>
                        </div>
                      </TableCell>
                      <TableCell>
                        <Badge variant='outline' className='bg-primary/5 text-primary border-primary/20'>
                          {doctor.degrees}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        {hasSchedule ? (
                          <Badge className='bg-green-500/10 text-green-500 border-green-500/20 gap-1.5'>
                            <CheckCircle2 size={12} />
                            Active
                          </Badge>
                        ) : (
                          <Badge className='bg-yellow-500/10 text-yellow-500 border-yellow-500/20 gap-1.5'>
                            <AlertCircle size={12} />
                            Not Set
                          </Badge>
                        )}
                      </TableCell>
                      <TableCell>
                        <span className='text-sm font-medium'>
                          {hasSchedule ? `${doctorSchedules.length} Weekdays` : '0 Slots'}
                        </span>
                      </TableCell>
                      <TableCell className='text-right'>
                        <Button 
                          variant='ghost' 
                          size='sm' 
                          className='hover:bg-primary/10 hover:text-primary font-semibold'
                          onClick={() => handleManageSchedule(doctor)}
                        >
                          <Clock className='mr-2 h-4 w-4' />
                          Manage Slots
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

        <HomeScheduleDialog
          open={isDialogOpen}
          onOpenChange={setIsDialogOpen}
          doctor={selectedDoctor}
        />
      </Main>
    </>
  )
}
