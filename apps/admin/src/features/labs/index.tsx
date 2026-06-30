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
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { MoreHorizontal, Edit2, Trash2, Plus, Search as SearchIcon, FilterX, Microscope, MapPin, Phone, Star } from 'lucide-react'

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
import { SimplePagination } from '@/components/simple-pagination'
import { LabsActionDialog } from './components/labs-action-dialog'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Badge } from '@/components/ui/badge'

export default function LabsList() {
  const queryClient = useQueryClient()
  const [open, setOpen] = useState(false)
  const [currentRow, setCurrentRow] = useState<any | null>(null)

  const [searchTerm, setSearchTerm] = useState('')
  const [bdLocationFilter, setBdLocationFilter] = useState('all')
  const [typeFilter, setTypeFilter] = useState('all')
  const [page, setPage] = useState(1)
  const [limit, setLimit] = useState(10)

  const { data: bdLocationsData } = useQuery({
    queryKey: ['bd-locations-all'],
    queryFn: async () => {
      const res = await api.get('/bd-locations', { params: { limit: 1000 } })
      return res.data
    }
  })

  const { data: labFiltersData } = useQuery({
    queryKey: ['labs-filters'],
    queryFn: async () => {
      const res = await api.get('/labs/filters')
      return res.data
    }
  })

  const bdLocations = Array.isArray(bdLocationsData) ? bdLocationsData : ((bdLocationsData as any)?.data || [])
  const labTypes: string[] = (labFiltersData as any)?.data?.types ?? (labFiltersData as any)?.types ?? []

  const resetFilters = () => {
    setSearchTerm('')
    setBdLocationFilter('all')
    setTypeFilter('all')
  }

  const { data: labsData, isLoading } = useQuery({
    queryKey: ['labs', searchTerm, bdLocationFilter, typeFilter, page, limit],
    queryFn: async () => {
      const params = new URLSearchParams()
      if (searchTerm) params.append('search', searchTerm)
      if (bdLocationFilter !== 'all') params.append('bdLocation', bdLocationFilter)
      if (typeFilter !== 'all') params.append('type', typeFilter)
      params.append('page', page.toString())
      params.append('limit', limit.toString())

      const res = await api.get(`/labs?${params.toString()}`)
      return res.data
    }
  })

  const labs = Array.isArray(labsData) ? labsData : (labsData as any)?.data || []
  const metadata = (labsData as any)?._meta || (labsData as any)?.meta || { total: 0, page: 1, limit: 10, totalPages: 1 }

  const deleteMutation = useMutation({
    mutationFn: (id: string) => api.delete(`/labs/${id}`),
    onSuccess: () => {
      toast.success('Lab deleted')
      queryClient.invalidateQueries({ queryKey: ['labs'] })
    },
    onError: () => {
      toast.error('Failed to delete')
    }
  })

  const handleDelete = (id: string) => {
    if (!window.confirm('Are you sure?')) return
    deleteMutation.mutate(id)
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
            <h2 className='text-2xl font-bold tracking-tight'>Diagnostic Labs</h2>
            <p className='text-muted-foreground'>
              Manage diagnostic centers and laboratory partners.
            </p>
          </div>
          <Button onClick={() => { setCurrentRow(null); setOpen(true); }}>
            <Plus className='mr-2' size={18} /> Add New Lab
          </Button>
        </div>

        <div className='grid grid-cols-1 md:grid-cols-4 gap-4 bg-black/20 p-4 rounded-xl border border-white/5'>
          <div className='relative'>
            <SearchIcon className='absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground' size={16} />
            <Input
              placeholder='Search by name or hotline...'
              className='pl-10 bg-background border-input dark:bg-black/40 dark:border-white/10'
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          <Select value={bdLocationFilter} onValueChange={setBdLocationFilter}>
            <SelectTrigger className='bg-background border-input dark:bg-black/40 dark:border-white/10'>
              <SelectValue placeholder='Filter by location' />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value='all'>All Locations</SelectItem>
              {bdLocations.map((loc: any) => (
                <SelectItem key={loc._id} value={loc._id}>{loc.district} - {loc.upazila}</SelectItem>
              ))}
            </SelectContent>
          </Select>
          <Select value={typeFilter} onValueChange={setTypeFilter}>
            <SelectTrigger className='bg-background border-input dark:bg-black/40 dark:border-white/10'>
              <SelectValue placeholder='Filter by type' />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value='all'>All Types</SelectItem>
              {labTypes.map((t: string) => (
                <SelectItem key={t} value={t}>{t}</SelectItem>
              ))}
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
                <TableHead className='ps-6 py-4'>Laboratory</TableHead>
                <TableHead className='py-4'>Location</TableHead>
                <TableHead className='py-4'>Tests Offered</TableHead>
                <TableHead className='py-4'>Hotline</TableHead>
                <TableHead className='w-[100px] text-right pe-6 py-4'>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {isLoading ? (
                <TableRow>
                  <TableCell colSpan={5} className='h-32 text-center text-muted-foreground'>
                    <div className='flex items-center justify-center gap-2'>
                      <div className='h-2 w-2 bg-primary rounded-full animate-bounce' />
                      <div className='h-2 w-2 bg-primary rounded-full animate-bounce [animation-delay:-.3s]' />
                      <div className='h-2 w-2 bg-primary rounded-full animate-bounce [animation-delay:-.5s]' />
                    </div>
                  </TableCell>
                </TableRow>
              ) : labs.length > 0 ? (
                labs.map((item: any) => (
                  <TableRow key={item._id} className='hover:bg-white/[0.02] border-white/5 transition-colors align-top'>
                    <TableCell className="ps-6 py-4">
                      <div className='flex items-center gap-4'>
                        <Avatar className='h-10 w-10 border'>
                          <AvatarImage src={`${SERVER_URL}${item.logo}`} />
                          <AvatarFallback><Microscope size={20} /></AvatarFallback>
                        </Avatar>
                        <div className='flex flex-col gap-0.5'>
                          <span className='text-sm font-bold text-white'>{item.name}</span>
                          <div className='flex items-center gap-2'>
                            {item.type && (
                              <Badge variant='outline' className='text-[9px] px-1.5 py-0 border-primary/30 text-primary/80'>
                                {item.type}
                              </Badge>
                            )}
                            {item.rating > 0 && (
                              <span className='flex items-center gap-0.5 text-[10px] text-yellow-400'>
                                <Star size={10} className='fill-yellow-400' />
                                {Number(item.rating).toFixed(1)}
                              </span>
                            )}
                          </div>
                          <span className='text-[10px] text-muted-foreground line-clamp-1'>{item.address}</span>
                        </div>
                      </div>
                    </TableCell>
                    <TableCell className='py-4'>
                      <div className='flex items-center gap-1 text-xs text-muted-foreground'>
                        <MapPin size={12} className='text-primary' />
                        {item.bdLocation ? `${item.bdLocation.district} - ${item.bdLocation.upazila}` : 'N/A'}
                      </div>
                    </TableCell>
                    <TableCell className='py-4'>
                      <div className='flex flex-wrap gap-1'>
                        {item.tests?.length > 0 ? (
                          item.tests.slice(0, 2).map((t: any) => (
                            <Badge key={t._id} variant='outline' className='text-[9px] px-1 py-0 max-w-28 truncate' title={t.test?.name || t.name}>
                              {t.test?.name || t.name || '—'}
                            </Badge>
                          ))
                        ) : null}
                        {item.tests?.length > 2 && (
                          <Badge variant='outline' className='text-[9px] px-1 py-0'>+{item.tests.length - 2} more</Badge>
                        )}
                      </div>
                    </TableCell>
                    <TableCell className='py-4'>
                      <div className='flex items-center gap-1 text-xs text-white'>
                        <Phone size={12} className='text-green-500' /> {item.hotline}
                      </div>
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
                            <Edit2 className='mr-3 h-4 w-4 text-blue-400' />
                            Edit Lab
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
                  <TableCell colSpan={5} className='h-32 text-center text-muted-foreground'>
                    <div className='flex flex-col items-center gap-3'>
                      <FilterX size={32} className='opacity-20 text-primary' />
                      <p>No diagnostic labs found.</p>
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

      <LabsActionDialog
        open={open}
        onOpenChange={setOpen}
        currentRow={currentRow}
        onSuccess={() => queryClient.invalidateQueries({ queryKey: ['labs'] })}
      />
    </>
  )
}
