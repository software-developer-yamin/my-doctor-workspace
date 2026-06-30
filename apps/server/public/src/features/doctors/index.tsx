import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import api, { SERVER_URL } from '@/lib/api'
import { Header } from '@/components/layout/header'
import { Main } from '@/components/layout/main'
import { ProfileDropdown } from '@/components/profile-dropdown'
import { Search } from '@/components/search'
import { ThemeSwitch } from '@/components/theme-switch'
import { ConfigDrawer } from '@/components/config-drawer'
import { Button } from '@/components/ui/button'
import { MoreHorizontal, Edit2, Trash2, UserPlus, Eye, Search as SearchIcon, FilterX, Home } from 'lucide-react'

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
import { DoctorsActionDialog } from './components/doctors-action-dialog'
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
import { SimplePagination } from '@/components/simple-pagination'

export function DoctorsList() {
  const navigate = useNavigate()
  const queryClient = useQueryClient()
  const [open, setOpen] = useState<'add' | 'edit' | null>(null)
  const [currentRow, setCurrentRow] = useState<any | null>(null)

  // Filters State
  const [searchTerm, setSearchTerm] = useState('')
  const [specFilter, setSpecFilter] = useState('all')
  const [concFilter, setConcFilter] = useState('all')
  const [page, setPage] = useState(1)
  const [limit, setLimit] = useState(10)

  // Fetch Filters Options
  const { data: specialities = [] } = useQuery({
    queryKey: ['specialities'],
    queryFn: async () => {
      const res = await api.get('/specialities')
      return Array.isArray(res.data) ? res.data : res.data?.data ?? []
    }
  })

  const { data: concentrations = [] } = useQuery({
    queryKey: ['concentrations'],
    queryFn: async () => {
      const res = await api.get('/concentrations')
      return Array.isArray(res.data) ? res.data : res.data?.data ?? []
    }
  })

  const { data: doctorsData, isLoading } = useQuery({
    queryKey: ['doctors', searchTerm, specFilter, concFilter, page, limit],
    queryFn: async () => {
      const params = new URLSearchParams()
      if (searchTerm) params.append('search', searchTerm)
      if (specFilter !== 'all') params.append('specialization', specFilter)
      if (concFilter !== 'all') params.append('concentration', concFilter)
      params.append('page', page.toString())
      params.append('limit', limit.toString())
      
      const res = await api.get(`/doctors?${params.toString()}`)
      return res.data
    }
  })

  const doctors = Array.isArray(doctorsData) ? doctorsData : (Array.isArray((doctorsData as any)?.data) ? (doctorsData as any).data : [])
  const metadata = (doctorsData as any)?._meta || (doctorsData as any)?.meta || { total: 0, page: 1, limit: 10, totalPages: 1 }


  const deleteMutation = useMutation({
    mutationFn: (id: string) => api.delete(`/doctors/${id}`),
    onSuccess: () => {
      toast.success('Doctor deleted')
      queryClient.invalidateQueries({ queryKey: ['doctors'] })
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
    setSpecFilter('all')
    setConcFilter('all')
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
            <h2 className='text-2xl font-bold tracking-tight'>Doctors</h2>
            <p className='text-muted-foreground'>
              Manage medical doctors and their profiles here.
            </p>
          </div>
          <Button onClick={() => { setCurrentRow(null); setOpen('add'); }}>
            <UserPlus className='mr-2' size={18} /> Add Doctor
          </Button>
        </div>

        {/* Filters Section */}
        <div className='grid grid-cols-1 md:grid-cols-4 gap-4 bg-black/20 p-4 rounded-xl border border-white/5'>
          <div className='relative'>
            <SearchIcon className='absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground' size={16} />
            <Input 
              placeholder='Search name, email, BMDC...' 
              className='pl-10 bg-background border-input dark:bg-black/40 dark:border-white/10'
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          
          <Select value={specFilter} onValueChange={setSpecFilter}>
            <SelectTrigger className='bg-background border-input dark:bg-black/40 dark:border-white/10'>
              <SelectValue placeholder="Specialization" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Specializations</SelectItem>
              {specialities.map((s: any) => (
                <SelectItem key={s._id} value={s._id}>{s.name}</SelectItem>
              ))}
            </SelectContent>
          </Select>

          <Select value={concFilter} onValueChange={setConcFilter}>
            <SelectTrigger className='bg-background border-input dark:bg-black/40 dark:border-white/10'>
              <SelectValue placeholder="Concentration" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Concentrations</SelectItem>
              {concentrations.map((c: any) => (
                <SelectItem key={c._id} value={c._id}>{c.name}</SelectItem>
              ))}
            </SelectContent>
          </Select>

          <Button variant='outline' className='border-white/10 hover:bg-white/5' onClick={resetFilters}>
            <FilterX className='mr-2' size={16} /> Reset Filters
          </Button>
        </div>

        <div className='overflow-x-auto rounded-xl border border-white/5 bg-black/20 backdrop-blur-sm shadow-2xl'>
          <Table className='min-w-175 table-fixed'>
            <TableHeader className='bg-white/5'>
              <TableRow className='hover:bg-transparent border-white/5'>
                <TableHead className='ps-6 py-4 w-[32%]'>Doctor</TableHead>
                <TableHead className='py-4 w-[26%]'>Degrees</TableHead>
                <TableHead className='py-4 text-center w-[24%]'>Specialities</TableHead>
                <TableHead className='py-4 w-[12%]'>BMDC Reg</TableHead>
                <TableHead className='w-[6%] text-right pe-6 py-4'>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {isLoading ? (
                <TableRow>
                  <TableCell colSpan={5} className='h-32 text-center'>
                     <div className='flex items-center justify-center gap-2'>
                        <div className='h-2 w-2 bg-primary rounded-full animate-bounce' />
                        <div className='h-2 w-2 bg-primary rounded-full animate-bounce [animation-delay:-.3s]' />
                        <div className='h-2 w-2 bg-primary rounded-full animate-bounce [animation-delay:-.5s]' />
                     </div>
                  </TableCell>
                </TableRow>
              ) : doctors.length > 0 ? (
                doctors.map((item: any) => (
                  <TableRow key={item._id} className='hover:bg-white/[0.02] border-white/5 transition-colors align-top'>
                    <TableCell className="font-medium ps-6 py-4">
                      <div className='flex items-start gap-4'>
                        <Avatar className='h-12 w-12 border-2 border-white/10 shadow-lg shrink-0'>
                          <AvatarImage src={item.photo ? `${SERVER_URL}${item.photo}` : ''} />
                          <AvatarFallback className='bg-primary/20 text-primary font-bold'>{item.name.substring(0, 2).toUpperCase()}</AvatarFallback>
                        </Avatar>
                        <div className='flex flex-col gap-0.5 min-w-0'>
                          <span className='text-sm font-bold text-white wrap-break-word'>{item.name}</span>
                          <span className='text-[10px] text-muted-foreground font-medium uppercase tracking-wider wrap-break-word'>{item.email}</span>
                          {item.isAvailableHome && (
                            <div className='flex items-center gap-1 mt-1 font-bold text-[9px] text-green-500 uppercase'>
                              <Home size={10} />
                              <span>Home Service</span>
                            </div>
                          )}
                        </div>
                      </div>
                    </TableCell>
                    <TableCell className='py-4'>
                       <div className='text-xs font-semibold text-primary/80 bg-primary/5 border border-primary/10 px-2 py-1 rounded-md truncate' title={item.degrees}>
                          {item.degrees?.replace(/\s*Affiliation:\s*.*$/, '')}
                       </div>
                    </TableCell>
                    <TableCell className='py-4'>
                       <div className='flex flex-wrap gap-1'>
                          {item.specializations?.slice(0, 2).map((s: any) => (
                            <div key={s._id} className='px-1.5 py-0.5 rounded-md bg-white/5 border border-white/10 text-[9px] font-bold text-muted-foreground uppercase truncate max-w-full' title={s.name}>
                               {s.name}
                            </div>
                          ))}
                          {item.specializations?.length > 2 && (
                            <div className='px-1.5 py-0.5 rounded-md bg-primary/10 border border-primary/20 text-[9px] font-bold text-primary uppercase shrink-0'>
                               +{item.specializations.length - 2}
                            </div>
                          )}
                       </div>
                    </TableCell>
                    <TableCell className='py-4 font-mono text-xs text-muted-foreground wrap-break-word'>{item.BMDC_REG_NO}</TableCell>
                    <TableCell className='text-right pe-6 py-4'>
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant='ghost' className='h-9 w-9 p-0 rounded-full hover:bg-white/10'>
                            <MoreHorizontal className='h-5 w-5' />
                            <span className='sr-only'>Open menu</span>
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align='end' className='w-48 bg-popover border-border shadow-2xl'>
                          <DropdownMenuItem className='cursor-pointer py-2.5' onClick={() => navigate({ to: `/doctors/${item._id}` })}>
                            <Eye className='mr-3 h-4 w-4 text-primary' />
                            View Full Profile
                          </DropdownMenuItem>
                          <DropdownMenuItem className='cursor-pointer py-2.5' onClick={() => { setCurrentRow(item); setOpen('edit'); }}>
                            <Edit2 className='mr-3 h-4 w-4 text-blue-400' />
                            Edit Information
                          </DropdownMenuItem>
                          <DropdownMenuSeparator className='bg-white/5' />
                          <DropdownMenuItem className='text-destructive focus:text-destructive cursor-pointer py-2.5' onClick={() => handleDelete(item._id)}>
                            <Trash2 className='mr-3 h-4 w-4' />
                            Remove Doctor
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </TableCell>
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell colSpan={5} className='h-32 text-center text-muted-foreground'>
                    <div className='flex flex-col items-center gap-3'>
                        <FilterX size={32} className='opacity-20 text-primary' />
                        <p>No doctors found matching your filters.</p>
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

      <DoctorsActionDialog 
        open={open !== null} 
        onOpenChange={(v) => !v && setOpen(null)}
        currentRow={currentRow}
        onSuccess={() => queryClient.invalidateQueries({ queryKey: ['doctors'] })}
      />
    </>
  )
}

