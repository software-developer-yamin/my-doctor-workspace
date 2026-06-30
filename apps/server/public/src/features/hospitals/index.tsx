import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import api, { SERVER_URL } from '@/lib/api'
import { Header } from '@/components/layout/header'
import { Main } from '@/components/layout/main'
import { ProfileDropdown } from '@/components/profile-dropdown'
import { Search } from '@/components/search'
import { ThemeSwitch } from '@/components/theme-switch'
import { ConfigDrawer } from '@/components/config-drawer'
import { Button } from '@/components/ui/button'
import { MoreHorizontal, Edit2, Trash2, Plus, Eye, Hospital, Search as SearchIcon, FilterX, MapPin, Zap, Star, BedDouble, Users } from 'lucide-react'
import { SimplePagination } from '@/components/simple-pagination'
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
import { HospitalsActionDialog } from './components/hospitals-action-dialog'
import { useNavigate } from '@tanstack/react-router'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { useState } from 'react'
import { Input } from '@/components/ui/input'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"

const TYPE_COLORS: Record<string, string> = {
  'Hospital': 'text-blue-400 bg-blue-500/10 border-blue-500/20',
  'Clinic': 'text-green-400 bg-green-500/10 border-green-500/20',
  'Diagnostic Center': 'text-purple-400 bg-purple-500/10 border-purple-500/20',
  'Specialized Center': 'text-amber-400 bg-amber-500/10 border-amber-500/20',
}

function TypeBadge({ type }: { type?: string }) {
  if (!type) return <span className='text-xs text-muted-foreground'>—</span>
  const cls = TYPE_COLORS[type] ?? 'text-muted-foreground bg-white/5 border-white/10'
  return (
    <span className={`inline-flex items-center gap-1 text-[10px] font-bold border px-2 py-0.5 rounded-full w-fit ${cls}`}>
      {type}
    </span>
  )
}

export function HospitalsList() {
  const navigate = useNavigate()
  const queryClient = useQueryClient()
  const [open, setOpen] = useState<'add' | 'edit' | null>(null)
  const [currentRow, setCurrentRow] = useState<any | null>(null)

  // Filters State
  const [searchTerm, setSearchTerm] = useState('')
  const [bdLocationFilter, setBdLocationFilter] = useState('all')
  const [specFilter, setSpecFilter] = useState('all')
  const [typeFilter, setTypeFilter] = useState('all')
  const [page, setPage] = useState(1)
  const [limit, setLimit] = useState(10)

  // Fetch Filters Options
  const { data: bdLocations = [] } = useQuery({
    queryKey: ['bd-locations-all'],
    queryFn: async () => {
      const res = await api.get('/bd-locations', { params: { limit: 1000 } })
      return Array.isArray(res.data) ? res.data : res.data?.data ?? []
    }
  })

  const { data: specialities = [] } = useQuery({
    queryKey: ['specialities'],
    queryFn: async () => {
      const res = await api.get('/specialities')
      return Array.isArray(res.data) ? res.data : res.data?.data ?? []
    }
  })

  const { data: hospitalFilters } = useQuery({
    queryKey: ['hospital-filters'],
    queryFn: async () => {
      const res = await api.get('/hospitals/filters')
      return res.data?.data as { services: string[]; types: string[] }
    }
  })

  const { data: hospitalsData, isLoading } = useQuery({
    queryKey: ['hospitals', searchTerm, bdLocationFilter, specFilter, typeFilter, page, limit],
    queryFn: async () => {
      const params = new URLSearchParams()
      if (searchTerm) params.append('search', searchTerm)
      if (bdLocationFilter !== 'all') params.append('bdLocation', bdLocationFilter)
      if (specFilter !== 'all') params.append('speciality', specFilter)
      if (typeFilter !== 'all') params.append('type', typeFilter)
      params.append('page', page.toString())
      params.append('limit', limit.toString())

      const res = await api.get(`/hospitals?${params.toString()}`)
      return res.data
    }
  })

  const data = Array.isArray(hospitalsData) ? hospitalsData : (hospitalsData as any)?.data || []
  const metadata = (hospitalsData as any)?._meta || (hospitalsData as any)?.meta || { total: 0, page: 1, limit: 10, totalPages: 1 }


  const deleteMutation = useMutation({
    mutationFn: (id: string) => api.delete(`/hospitals/${id}`),
    onSuccess: () => {
      toast.success('Hospital deleted')
      queryClient.invalidateQueries({ queryKey: ['hospitals'] })
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
    setBdLocationFilter('all')
    setSpecFilter('all')
    setTypeFilter('all')
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
            <h2 className='text-2xl font-bold tracking-tight'>Hospitals & Clinics</h2>
            <p className='text-muted-foreground'>
              Manage healthcare facilities and their locations.
            </p>
          </div>
          <Button onClick={() => { setCurrentRow(null); setOpen('add'); }}>
            <Plus className='mr-2' size={18} /> Add Hospital
          </Button>
        </div>

        {/* Filters Section */}
        <div className='grid grid-cols-1 md:grid-cols-5 gap-4 bg-black/20 p-4 rounded-xl border border-white/5'>
          <div className='relative'>
            <SearchIcon className='absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground' size={16} />
            <Input
              placeholder='Search by hospital name...'
              className='pl-10 bg-background border-input dark:bg-black/40 dark:border-white/10'
              value={searchTerm}
              onChange={(e) => { setSearchTerm(e.target.value); setPage(1); }}
            />
          </div>

          <Select value={bdLocationFilter} onValueChange={setBdLocationFilter}>
            <SelectTrigger className='bg-background border-input dark:bg-black/40 dark:border-white/10'>
              <SelectValue placeholder="District / Location" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Locations</SelectItem>
              {bdLocations.map((loc: any) => (
                <SelectItem key={loc._id} value={loc._id}>{loc.district} - {loc.upazila}</SelectItem>
              ))}
            </SelectContent>
          </Select>

          <Select value={typeFilter} onValueChange={setTypeFilter}>
            <SelectTrigger className='bg-background border-input dark:bg-black/40 dark:border-white/10'>
              <SelectValue placeholder="Facility Type" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Types</SelectItem>
              {(hospitalFilters?.types ?? []).filter(Boolean).map((t: string) => (
                <SelectItem key={t} value={t}>{t}</SelectItem>
              ))}
            </SelectContent>
          </Select>

          <Select value={specFilter} onValueChange={setSpecFilter}>
            <SelectTrigger className='bg-background border-input dark:bg-black/40 dark:border-white/10'>
              <SelectValue placeholder="Speciality" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Specialities</SelectItem>
              {specialities.map((s: any) => (
                <SelectItem key={s._id} value={s._id}>{s.name}</SelectItem>
              ))}
            </SelectContent>
          </Select>

          <Button variant='outline' className='border-white/10 hover:bg-white/5' onClick={resetFilters}>
            <FilterX className='mr-2' size={16} /> Reset Filters
          </Button>
        </div>

        <div className='overflow-hidden rounded-xl border border-white/5 bg-black/20 backdrop-blur-sm shadow-2xl'>
          <Table>
            <TableHeader className='bg-white/5'>
              <TableRow className='hover:bg-transparent border-white/5'>
                <TableHead className='ps-6 py-4 text-xs uppercase tracking-wider text-muted-foreground'>Facility</TableHead>
                <TableHead className='py-4 text-xs uppercase tracking-wider text-muted-foreground'>Type</TableHead>
                <TableHead className='py-4 text-xs uppercase tracking-wider text-muted-foreground'>Location</TableHead>
                <TableHead className='py-4 text-xs uppercase tracking-wider text-muted-foreground'>Stats</TableHead>
                <TableHead className='py-4 text-xs uppercase tracking-wider text-muted-foreground'>Rating</TableHead>
                <TableHead className='py-4 text-xs uppercase tracking-wider text-muted-foreground'>Status</TableHead>
                <TableHead className='w-25 text-right pe-6 py-4 text-xs uppercase tracking-wider text-muted-foreground'>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {isLoading ? (
                <TableRow>
                  <TableCell colSpan={7} className='h-32 text-center text-muted-foreground'>
                     <div className='flex items-center justify-center gap-2'>
                        <div className='h-2 w-2 bg-primary rounded-full animate-bounce' />
                        <div className='h-2 w-2 bg-primary rounded-full animate-bounce [animation-delay:-.3s]' />
                        <div className='h-2 w-2 bg-primary rounded-full animate-bounce [animation-delay:-.5s]' />
                     </div>
                  </TableCell>
                </TableRow>
              ) : data.length > 0 ? (
                data.map((item: any) => (
                  <TableRow key={item._id} className='hover:bg-white/2 border-white/5 transition-colors align-top'>
                    <TableCell className="font-medium ps-6 py-4">
                      <div className='flex items-start gap-4'>
                        <Avatar className='h-12 w-12 border-2 border-white/10 shadow-lg rounded-xl'>
                          <AvatarImage src={item.logo ? `${SERVER_URL}${item.logo}` : ''} className='object-cover' />
                          <AvatarFallback className='bg-primary/20 text-primary'><Hospital size={20} /></AvatarFallback>
                        </Avatar>
                        <div className='flex flex-col gap-0.5'>
                          <span className='text-sm font-bold text-white'>{item.name}</span>
                          <span className='text-[10px] text-muted-foreground font-medium uppercase tracking-wider'>{item.email}</span>
                        </div>
                      </div>
                    </TableCell>
                    <TableCell className='py-4'>
                      <TypeBadge type={item.type} />
                    </TableCell>
                    <TableCell className='py-4'>
                      <div className='flex flex-col gap-1'>
                        {item.bdLocation?.district ? (
                          <div className='flex items-center gap-1.5 text-xs font-semibold text-primary/80 bg-primary/5 border border-primary/10 px-2.5 py-1 rounded-lg w-fit'>
                            <MapPin size={11} />
                            {item.bdLocation.district}
                          </div>
                        ) : null}
                        {item.bdLocation?.upazila ? (
                          <span className='text-[10px] text-muted-foreground ps-1'>{item.bdLocation.upazila}</span>
                        ) : (!item.bdLocation?.district ? <span className='text-xs text-muted-foreground'>N/A</span> : null)}
                      </div>
                    </TableCell>
                    <TableCell className='py-4'>
                      <div className='flex flex-col gap-1.5 text-xs text-muted-foreground'>
                        <div className='flex items-center gap-1.5'><Users size={11} className='text-primary/60' /><span>{item.stats?.doctorsCount ?? 0} doctors</span></div>
                        <div className='flex items-center gap-1.5'><BedDouble size={11} className='text-primary/60' /><span>{item.stats?.totalBeds ?? 0} beds</span></div>
                      </div>
                    </TableCell>
                    <TableCell className='py-4'>
                      {item.rating ? (
                        <div className='flex items-center gap-1 text-xs font-semibold text-amber-400'>
                          <Star size={12} className='fill-amber-400' />
                          {Number(item.rating).toFixed(1)}
                          <span className='text-muted-foreground font-normal ml-1'>({item.totalReviews ?? 0})</span>
                        </div>
                      ) : <span className='text-xs text-muted-foreground'>—</span>}
                    </TableCell>
                    <TableCell className='py-4'>
                      <div className='flex flex-col gap-1'>
                        {item.isEmergencyAvailable && (
                          <span className='inline-flex items-center gap-1 text-[10px] font-bold text-red-400 bg-red-500/10 border border-red-500/20 px-2 py-0.5 rounded-full w-fit'>
                            <Zap size={9} className='fill-red-400' /> 24/7
                          </span>
                        )}
                        <span className='text-[10px] text-muted-foreground font-mono'>{item.hotline}</span>
                      </div>
                    </TableCell>
                    <TableCell className='text-right pe-6 py-4'>
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant='ghost' className='h-9 w-9 p-0 rounded-full hover:bg-white/10'>
                            <MoreHorizontal className='h-5 w-5' />
                            <span className='sr-only'>Open menu</span>
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align='end' className='w-52 bg-popover border-border shadow-2xl'>
                          <DropdownMenuItem className='cursor-pointer py-3' onClick={() => navigate({ to: `/hospitals/${item._id}` })}>
                            <Eye className='mr-3 h-4 w-4 text-primary' />
                            View Performance
                          </DropdownMenuItem>
                          <DropdownMenuItem className='cursor-pointer py-3' onClick={() => { setCurrentRow(item); setOpen('edit'); }}>
                            <Edit2 className='mr-3 h-4 w-4 text-blue-400' />
                            Update Records
                          </DropdownMenuItem>
                          <DropdownMenuSeparator className='bg-white/5' />
                          <DropdownMenuItem className='text-destructive focus:text-destructive cursor-pointer py-3' onClick={() => handleDelete(item._id)}>
                            <Trash2 className='mr-3 h-4 w-4' />
                            Decommission Facility
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </TableCell>
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell colSpan={7} className='h-32 text-center text-muted-foreground font-medium'>
                    <div className='flex flex-col items-center gap-3'>
                        <FilterX size={32} className='opacity-20 text-primary' />
                        <p>No healthcare facilities match your current search.</p>
                        <Button variant='link' onClick={resetFilters} className='text-primary decoration-primary/30'>Clear all filters</Button>
                    </div>
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

      {open !== null && (
        <HospitalsActionDialog
          open={open !== null}
          onOpenChange={(v) => !v && setOpen(null)}
          currentRow={currentRow}
          onSuccess={() => queryClient.invalidateQueries({ queryKey: ['hospitals'] })}
        />
      )}
    </>
  )
}

