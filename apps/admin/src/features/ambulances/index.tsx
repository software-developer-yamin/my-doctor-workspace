'use client'

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import api, { SERVER_URL } from '@/lib/api'
import { Header } from '@/components/layout/header'
import { Main } from '@/components/layout/main'
import { ProfileDropdown } from '@/components/profile-dropdown'
import { Search } from '@/components/search'
import { ThemeSwitch } from '@/components/theme-switch'
import { ConfigDrawer } from '@/components/config-drawer'
import { Button } from '@/components/ui/button'
import { MoreHorizontal, Edit2, Trash2, Plus, Search as SearchIcon, FilterX, Ambulance as AmbulanceIcon, MapPin, CreditCard, Activity } from 'lucide-react'

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
import { AmbulancesActionDialog } from './components/ambulances-action-dialog'
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

export function AmbulancesList() {
  const queryClient = useQueryClient()
  const [open, setOpen] = useState<'add' | 'edit' | null>(null)
  const [currentRow, setCurrentRow] = useState<any | null>(null)

  // Filters State
  const [searchTerm, setSearchTerm] = useState('')
  const [bdLocationFilter, setBdLocationFilter] = useState('all')
  const [statusFilter, setStatusFilter] = useState('all')
  const [page, setPage] = useState(1)
  const [limit, setLimit] = useState(10)

  const { data: bdLocations = [] } = useQuery({
    queryKey: ['bd-locations-all'],
    queryFn: async () => {
      const res = await api.get('/bd-locations', { params: { limit: 1000 } })
      return Array.isArray(res.data) ? res.data : res.data?.data ?? []
    }
  })

  const { data: ambulancesData, isLoading } = useQuery({
    queryKey: ['ambulances', searchTerm, bdLocationFilter, statusFilter, page, limit],
    queryFn: async () => {
      const params = new URLSearchParams()
      if (searchTerm) params.append('search', searchTerm)
      if (bdLocationFilter !== 'all') params.append('bdLocation', bdLocationFilter)
      if (statusFilter !== 'all') params.append('status', statusFilter)
      params.append('page', page.toString())
      params.append('limit', limit.toString())
      
      const res = await api.get(`/ambulances?${params.toString()}`)
      return res.data
    }
  })

  const ambulances = Array.isArray(ambulancesData) ? ambulancesData : (ambulancesData as any)?.data || []
  const metadata = (ambulancesData as any)?._meta || (ambulancesData as any)?.meta || { total: 0, page: 1, limit: 10, totalPages: 1 }

  const deleteMutation = useMutation({
    mutationFn: (id: string) => api.delete(`/ambulances/${id}`),
    onSuccess: () => {
      toast.success('Ambulance deleted')
      queryClient.invalidateQueries({ queryKey: ['ambulances'] })
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
    setStatusFilter('all')
    setPage(1)
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
            <h2 className='text-2xl font-bold tracking-tight'>Ambulances</h2>
            <p className='text-muted-foreground'>
              Manage emergency ambulance services and drivers.
            </p>
          </div>
          <Button onClick={() => { setCurrentRow(null); setOpen('add'); }}>
            <Plus className='mr-2' size={18} /> Add Ambulance
          </Button>
        </div>

        <div className='grid grid-cols-1 md:grid-cols-4 gap-4 bg-black/20 p-4 rounded-xl border border-white/5'>
          <div className='relative'>
            <SearchIcon className='absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground' size={16} />
            <Input 
              placeholder='Search name, number, license...' 
              className='pl-10 bg-background border-input dark:bg-black/40 dark:border-white/10'
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          
          <Select value={bdLocationFilter} onValueChange={setBdLocationFilter}>
            <SelectTrigger className='bg-background border-input dark:bg-black/40 dark:border-white/10'>
              <SelectValue placeholder="Location" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Locations</SelectItem>
              {bdLocations.map((loc: any) => (
                <SelectItem key={loc._id} value={loc._id}>{loc.district} - {loc.upazila}</SelectItem>
              ))}
            </SelectContent>
          </Select>

          <Select value={statusFilter} onValueChange={setStatusFilter}>
            <SelectTrigger className='bg-background border-input dark:bg-black/40 dark:border-white/10'>
              <SelectValue placeholder="Status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Status</SelectItem>
              <SelectItem value="Active">Active</SelectItem>
              <SelectItem value="Inactive">Inactive</SelectItem>
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
                <TableHead className='ps-6 py-4'>Ambulance / Driver</TableHead>
                <TableHead className='py-4'>Location</TableHead>
                <TableHead className='py-4'>Type</TableHead>
                <TableHead className='py-4'>Status</TableHead>
                <TableHead className='w-25 text-right pe-6 py-4'>Actions</TableHead>
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
              ) : ambulances.length > 0 ? (
                ambulances.map((item: any) => (
                  <TableRow key={item._id} className='hover:bg-white/2 border-white/5 transition-colors align-top'>
                    <TableCell className="ps-6 py-4">
                      <div className='flex items-start gap-4'>
                        <div className='h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center text-primary overflow-hidden shrink-0'>
                          {item.image ? (
                            <img src={`${SERVER_URL}${item.image}`} alt={item.name} className='h-full w-full object-cover' />
                          ) : (
                            <AmbulanceIcon size={20} />
                          )}
                        </div>
                        <div className='flex flex-col'>
                          <span className='text-sm font-bold text-white'>{item.name}</span>
                          <div className='flex items-center gap-2 mt-0.5'>
                            <span className='text-[10px] text-muted-foreground font-medium uppercase tracking-wider flex items-center gap-1'>
                              <Activity size={10} /> {item.ambulance_number}
                            </span>
                            <span className='text-[10px] text-muted-foreground font-medium uppercase tracking-wider flex items-center gap-1'>
                              <CreditCard size={10} /> {item.driving_license_number}
                            </span>
                          </div>
                        </div>
                      </div>
                    </TableCell>
                    <TableCell className='py-4'>
                       <div className='flex items-center gap-1 text-xs text-muted-foreground'>
                          <MapPin size={12} />
                          {item.bdLocation ? `${item.bdLocation.district} - ${item.bdLocation.upazila}` : 'N/A'}
                       </div>
                    </TableCell>
                    <TableCell className='py-4'>
                       <Badge variant='outline' className='text-[10px] font-bold uppercase border-primary/20 bg-primary/5 text-primary'>
                          {item.ambulance_type}
                       </Badge>
                    </TableCell>
                    <TableCell className='py-4'>
                        <Badge variant={item.status === 'Active' ? 'default' : 'secondary'} className={`text-[10px] font-bold uppercase ${item.status === 'Active' ? 'bg-green-500/20 text-green-500 hover:bg-green-500/30' : ''}`}>
                          {item.status}
                        </Badge>
                    </TableCell>
                    <TableCell className='text-right pe-6 py-4'>
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant='ghost' className='h-9 w-9 p-0 rounded-full hover:bg-white/10'>
                            <MoreHorizontal className='h-5 w-5' />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align='end' className='w-48 bg-popover border-border shadow-2xl'>
                          <DropdownMenuItem className='cursor-pointer py-2.5' onClick={() => { setCurrentRow(item); setOpen('edit'); }}>
                            <Edit2 className='mr-3 h-4 w-4 text-blue-400' />
                            Edit Ambulance
                          </DropdownMenuItem>
                          <DropdownMenuSeparator className='bg-white/5' />
                          <DropdownMenuItem className='text-destructive focus:text-destructive cursor-pointer py-2.5' onClick={() => handleDelete(item._id)}>
                            <Trash2 className='mr-3 h-4 w-4' />
                            Remove
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </TableCell>
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell colSpan={5} className='h-32 text-center text-muted-foreground font-medium'>
                    <div className='flex flex-col items-center gap-3'>
                      <FilterX size={32} className='opacity-20 text-primary' />
                      <p>No ambulances match your current filters.</p>
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

      <AmbulancesActionDialog 
        open={open !== null} 
        onOpenChange={(v) => !v && setOpen(null)}
        currentRow={currentRow}
        onSuccess={() => queryClient.invalidateQueries({ queryKey: ['ambulances'] })}
      />
    </>
  )
}
