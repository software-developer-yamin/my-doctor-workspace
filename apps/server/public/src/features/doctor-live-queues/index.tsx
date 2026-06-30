import { useState, useMemo } from 'react'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import { ConfigDrawer } from '@/components/config-drawer'
import { Header } from '@/components/layout/header'
import { Main } from '@/components/layout/main'
import { ProfileDropdown } from '@/components/profile-dropdown'
import { Search } from '@/components/search'
import { ThemeSwitch } from '@/components/theme-switch'
import { Badge } from '@/components/ui/badge'
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Button } from '@/components/ui/button'
import { 
  Activity, 
  Clock, 
  Users, 
  Timer, 
  Building2, 
  UserRound, 
  ArrowRight, 
  ActivitySquare,
  Plus,
  Square,
  ChevronRight
} from 'lucide-react'
import api, { SERVER_URL } from '@/lib/api'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { SimplePagination } from '@/components/simple-pagination'
import { format } from 'date-fns'
import { useAuthStore } from '@/stores/auth-store'
import { QueueActionDialog } from './components/queue-action-dialog'
import { toast } from 'sonner'

export function DoctorLiveQueuesList() {
  const queryClient = useQueryClient()
  const { auth } = useAuthStore()
  const [helperFilter, setHelperFilter] = useState<string>('all')
  const [statusFilter, setStatusFilter] = useState<string>('active')
  const [page, setPage] = useState(1)
  const [limit, setLimit] = useState(10)
  const [openSetup, setOpenSetup] = useState(false)

  const userRoles = Array.isArray(auth.user?.role) ? auth.user.role : (auth.user?.role ? [auth.user.role] : [])
  const isAuthorized = userRoles.some(r => ['admin', 'helpers', 'super_admin'].includes(r))

  const { data: queuesData, isLoading } = useQuery({
    queryKey: ['doctor-live-queues-admin', page, limit, statusFilter, helperFilter],
    queryFn: async () => {
      const params = new URLSearchParams()
      if (statusFilter !== 'all') {
        params.append('isActive', statusFilter === 'active' ? 'true' : 'false')
      }
      if (helperFilter !== 'all') {
        params.append('creator', helperFilter)
      }
      params.append('page', page.toString())
      params.append('limit', limit.toString())
      const res = await api.get(`/doctor-live-queues?${params.toString()}`)
      return res.data
    }
  })

  const queues = Array.isArray(queuesData) ? queuesData : (queuesData as any)?.data || []
  const metadata = (queuesData as any)?._meta || (queuesData as any)?.meta || { total: 0, page: 1, limit: 10, totalPages: 1 }

  // Mutations
  const updateSerialMutation = useMutation({
    mutationFn: ({ id, current_serial }: { id: string, current_serial: number }) => 
      api.put(`/doctor-live-queues/${id}/current-serial`, { current_serial }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['doctor-live-queues-admin'] })
      toast.success('Serial updated')
    },
    onError: (error: any) => {
      const errorMessage = error.response?.data?.error?.message || error.response?.data?.message || 'Failed to update serial'
      toast.error(errorMessage)
    }
  })

  const endQueueMutation = useMutation({
    mutationFn: (id: string) => api.put(`/doctor-live-queues/${id}/end`),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['doctor-live-queues-admin'] })
      toast.success('Queue ended')
    },
    onError: (error: any) => {
      const errorMessage = error.response?.data?.error?.message || error.response?.data?.message || 'Failed to end queue'
      toast.error(errorMessage)
    }
  })

  // Fetch helpers for filtering
  const { data: helpers = [] } = useQuery({
    queryKey: ['helpers'],
    queryFn: async () => {
      const res = await api.get('/auth/get_all_users?role=helpers')
      return Array.isArray(res.data) ? res.data : res.data?.data ?? []
    }
  })

  // Process filters
  const filteredQueues = queues


  // Compute Stats
  const stats = useMemo(() => {
    if (!filteredQueues) return { activeCount: 0, totalPatients: 0, servedPatients: 0, avgProgress: 0 }
    
    let totalP = 0
    let servedP = 0
    let activeC = 0

    filteredQueues.forEach((q: any) => {
      if(q.isActive) activeC++
      totalP += q.total_serial || 0
      servedP += q.current_serial || 1
    })

    return {
      activeCount: activeC,
      totalPatients: totalP,
      servedPatients: servedP,
      avgProgress: totalP === 0 ? 0 : Math.round((servedP / totalP) * 100)
    }
  }, [filteredQueues])

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
      <Main>
        <div className='mb-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between'>
          <div>
            <h1 className='text-3xl font-bold tracking-tight'>Live Queues Overview</h1>
            <p className='text-muted-foreground'>
              Monitor real-time patient progression and wait times across all hospital locations.
            </p>
          </div>
          {true /* isAuthorized */ && (
            <Button onClick={() => setOpenSetup(true)} className='shadow-lg'>
              <Plus className='mr-2' size={18} /> Start New Queue
            </Button>
          )}
        </div>

        {/* Stats Cards Section */}
        <div className="grid gap-4 md:grid-cols-4 mb-8">
          <div className="rounded-xl border bg-card p-6 shadow-sm">
            <div className="flex items-center justify-between space-y-0 pb-2">
              <h3 className="tracking-tight text-sm font-medium">Active Queues</h3>
              <ActivitySquare className="h-4 w-4 text-muted-foreground" />
            </div>
            <div className="text-2xl font-bold">{stats.activeCount}</div>
            <p className="text-xs text-muted-foreground mt-1">Currently running shifts</p>
          </div>
          <div className="rounded-xl border bg-card p-6 shadow-sm">
            <div className="flex items-center justify-between space-y-0 pb-2">
              <h3 className="tracking-tight text-sm font-medium">Total Capacity Today</h3>
              <Users className="h-4 w-4 text-muted-foreground" />
            </div>
            <div className="text-2xl font-bold">{stats.totalPatients}</div>
            <p className="text-xs text-muted-foreground mt-1">Cumulative open patient slots</p>
          </div>
          <div className="rounded-xl border bg-card p-6 shadow-sm">
            <div className="flex items-center justify-between space-y-0 pb-2">
              <h3 className="tracking-tight text-sm font-medium">Patients Served</h3>
              <UserRound className="h-4 w-4 text-muted-foreground" />
            </div>
            <div className="text-2xl font-bold">{stats.servedPatients}</div>
            <p className="text-xs text-muted-foreground mt-1">Patients pushed through checkups</p>
          </div>
          <div className="rounded-xl border bg-card p-6 shadow-sm">
            <div className="flex items-center justify-between space-y-0 pb-2">
              <h3 className="tracking-tight text-sm font-medium">Global Completion</h3>
              <Timer className="h-4 w-4 text-muted-foreground" />
            </div>
            <div className="text-2xl font-bold">{stats.avgProgress}%</div>
            <div className="w-full bg-secondary rounded-full h-1.5 mt-2">
              <div 
                className="bg-primary h-1.5 rounded-full transition-all duration-500 ease-in-out" 
                style={{ width: `${stats.avgProgress}%` }}
              />
            </div>
          </div>
        </div>

        {/* Filters Section */}
        <div className='grid grid-cols-1 md:grid-cols-4 gap-4 bg-black/20 p-4 rounded-xl border border-white/5 mb-6'>
          <Select value={helperFilter} onValueChange={setHelperFilter}>
            <SelectTrigger className='bg-background border-input dark:bg-black/40 dark:border-white/10'>
              <SelectValue placeholder="Display All Helpers" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Display All Helpers</SelectItem>
              {helpers.map((helper: any) => (
                <SelectItem key={helper._id} value={helper._id}>
                  Manage: {helper.name}
                </SelectItem>
              ))}

            </SelectContent>
          </Select>
          
          <Select value={statusFilter} onValueChange={setStatusFilter}>
            <SelectTrigger className='bg-background border-input dark:bg-black/40 dark:border-white/10'>
              <SelectValue placeholder="Queue Status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Overall (All Statuses)</SelectItem>
              <SelectItem value="active">Active Running</SelectItem>
              <SelectItem value="ended">Ended / Closed</SelectItem>
            </SelectContent>
          </Select>
          
          <div className='hidden md:block'></div>
          
          <Button 
            variant='outline' 
            className='border-white/10 hover:bg-white/5' 
            onClick={() => {
              setHelperFilter('all')
              setStatusFilter('active')
            }}
          >
            Reset Filters
          </Button>
        </div>

        <div className='rounded-xl border bg-card/30 backdrop-blur-md shadow-sm overflow-hidden'>
          <Table>
            <TableHeader className='bg-muted/50'>
              <TableRow>
                <TableHead className='font-semibold'>Hospital Location</TableHead>
                <TableHead className='font-semibold'>Doctor Target</TableHead>
                <TableHead className='font-semibold'>Queue Progress</TableHead>
                <TableHead className='font-semibold'>Performance Metrics</TableHead>
                <TableHead className='text-right font-semibold'>Status / Actions</TableHead>
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
              ) : filteredQueues.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={5} className='h-32 text-center text-muted-foreground'>
                    <div className='flex flex-col items-center justify-center gap-2'>
                      <Activity className='h-8 w-8 opacity-20' />
                      <p className='font-medium'>No active live queues match your filters.</p>
                    </div>
                  </TableCell>
                </TableRow>
              ) : (
                filteredQueues.map((queue: any) => {
                  const progressPercentage = Math.min(100, Math.round(((queue.current_serial || 1) / (queue.total_serial || 1)) * 100));
                  return (
                  <TableRow key={queue._id} className='hover:bg-muted/30 transition-colors'>
                    <TableCell>
                      <div className='flex items-center gap-3'>
                        <div className='flex flex-col'>
                          <span className='font-bold flex items-center gap-1.5'>
                            <Building2 size={14} className='text-muted-foreground' />
                            {queue.hospital?.name || 'Unknown'}
                          </span>
                          <span className='text-xs font-medium text-muted-foreground mt-1'>
                            {queue.creator
                              ? <>Managed By Helper: <span className="text-foreground">{queue.creator.name}</span></>
                              : <span className="text-blue-500 font-semibold">Self-Managed by Doctor</span>
                            }
                          </span>
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className='flex items-center gap-3'>
                        <Avatar className='h-8 w-8 border'>
                          <AvatarImage src={queue.doctor?.photo ? `${SERVER_URL}${queue.doctor.photo}` : ''} />
                          <AvatarFallback><UserRound size={14} /></AvatarFallback>
                        </Avatar>
                        <div className='flex flex-col'>
                          <span className='font-bold text-foreground text-sm'>{queue.doctor?.name || 'Unknown'}</span>
                          <span className='text-[10px] text-muted-foreground uppercase tracking-tighter'>{queue.doctor?.degrees}</span>
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className='flex flex-col gap-2 min-w-[200px]'>
                        <div className='flex justify-between text-xs mb-1'>
                          <span className='font-medium text-muted-foreground flex items-center gap-1'>
                            <ArrowRight size={12}/> Current: <strong className='text-foreground'>{queue.current_serial}</strong>
                          </span>
                          <span className='text-muted-foreground'>Total: {queue.total_serial}</span>
                        </div>
                        <div className="w-full bg-secondary rounded-full h-2">
                          <div 
                            className="bg-primary h-2 rounded-full transition-all duration-500 ease-in-out" 
                            style={{ width: `${progressPercentage}%` }}
                          />
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className='flex flex-col gap-1'>
                        <span className='text-xs font-semibold flex items-center gap-1.5'>
                          <Clock size={14} className='text-blue-500' />
                          Started: {queue.start_date_time ? format(new Date(queue.start_date_time), 'p') : 'N/A'}
                        </span>
                        <span className='text-xs text-muted-foreground flex items-center gap-1.5 mt-1'>
                          <Timer size={14} className='text-purple-500' />
                          Avg Time: <strong className='text-foreground'>{queue.avg_per_patient_visit_time_in_min}m</strong> / patient
                        </span>
                      </div>
                    </TableCell>
                    <TableCell className='text-right'>
                      <div className='flex flex-col items-end gap-2'>
                        <Badge 
                          variant="secondary"
                          className={queue.isActive 
                            ? 'bg-emerald-500/10 text-emerald-600 border-emerald-500/20' 
                            : 'bg-neutral-500/10 text-neutral-500 border-neutral-500/20'}
                        >
                          {queue.isActive ? 'Active Now' : 'Ended'}
                        </Badge>
                        
                        {queue.isActive && isAuthorized && (
                          <div className='flex items-center gap-2'>
                            <Button 
                              size='sm' 
                              variant='outline' 
                              className='h-8 px-2 text-[10px] uppercase font-bold'
                              onClick={() => updateSerialMutation.mutate({ 
                                id: queue._id, 
                                current_serial: queue.current_serial + 1
                              })}
                              disabled={updateSerialMutation.isPending}
                            >
                              <ChevronRight className='mr-1' size={14} /> Next Patient
                            </Button>
                            <Button 
                              size='sm' 
                              variant='destructive' 
                              className='h-8 px-2 text-[10px] uppercase font-bold'
                              onClick={() => {
                                if (window.confirm('Are you sure you want to end this queue?')) {
                                  endQueueMutation.mutate(queue._id)
                                }
                              }}
                              disabled={endQueueMutation.isPending}
                            >
                              <Square className='mr-1' size={10} /> End
                            </Button>
                          </div>
                        )}
                      </div>
                    </TableCell>
                  </TableRow>
                )})
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

      <QueueActionDialog 
        open={openSetup}
        onOpenChange={setOpenSetup}
        onSuccess={() => queryClient.invalidateQueries({ queryKey: ['doctor-live-queues-admin'] })}
      />
    </>
  )
}
