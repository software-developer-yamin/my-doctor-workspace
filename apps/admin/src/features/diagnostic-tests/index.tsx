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
import { MoreHorizontal, Edit2, Trash2, Plus, Search as SearchIcon, FilterX, Microscope, Banknote } from 'lucide-react'

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
import { DiagnosticTestsActionDialog } from './components/diagnostic-tests-action-dialog'

export default function DiagnosticTests() {
  const queryClient = useQueryClient()
  const [open, setOpen] = useState(false)
  const [currentRow, setCurrentRow] = useState<any | null>(null)

  // Filters State
  const [searchTerm, setSearchTerm] = useState('')
  const [page, setPage] = useState(1)
  const [limit, setLimit] = useState(10)

  const { data: testsData, isLoading } = useQuery({
    queryKey: ['diagnostic-tests', searchTerm, page, limit],
    queryFn: async () => {
      const params = new URLSearchParams()
      if (searchTerm) params.append('search', searchTerm)
      params.append('page', page.toString())
      params.append('limit', limit.toString())
      
      const res = await api.get(`/diagnostic-tests?${params.toString()}`)
      return res.data
    }
  })

  const tests = Array.isArray(testsData) ? testsData : (testsData as any)?.data || []
  const metadata = (testsData as any)?._meta || (testsData as any)?.meta || { total: 0, page: 1, limit: 10, totalPages: 1 }

  const deleteMutation = useMutation({
    mutationFn: (id: string) => api.delete(`/diagnostic-tests/${id}`),
    onSuccess: () => {
      toast.success('Test deleted')
      queryClient.invalidateQueries({ queryKey: ['diagnostic-tests'] })
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
            <h2 className='text-2xl font-bold tracking-tight'>Diagnostic Tests</h2>
            <p className='text-muted-foreground'>
              Catalog of all available laboratory and diagnostic tests.
            </p>
          </div>
          <Button onClick={() => { setCurrentRow(null); setOpen(true); }}>
            <Plus className='mr-2' size={18} /> Add New Test
          </Button>
        </div>

        <div className='flex items-center gap-4 bg-black/20 p-4 rounded-xl border border-white/5'>
          <div className='relative flex-1 max-w-sm'>
            <SearchIcon className='absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground' size={16} />
            <Input 
              placeholder='Search by test name...' 
              className='pl-10 bg-background border-input dark:bg-black/40 dark:border-white/10'
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          <Button variant='outline' className='border-white/10 hover:bg-white/5' onClick={() => setSearchTerm('')}>
            <FilterX className='mr-2' size={16} /> Reset
          </Button>
        </div>

        <div className='overflow-hidden rounded-xl border border-white/5 bg-black/20 backdrop-blur-sm shadow-2xl'>
          <Table>
            <TableHeader className='bg-white/5'>
              <TableRow className='hover:bg-transparent border-white/5'>
                <TableHead className='ps-6 py-4'>Test Name</TableHead>
                <TableHead className='py-4'>Starting Price</TableHead>
                <TableHead className='py-4'>Description</TableHead>
                <TableHead className='w-[100px] text-right pe-6 py-4'>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {isLoading ? (
                <TableRow>
                  <TableCell colSpan={4} className='h-32 text-center'>
                     <div className='flex items-center justify-center gap-2'>
                        <div className='h-2 w-2 bg-primary rounded-full animate-bounce' />
                        <div className='h-2 w-2 bg-primary rounded-full animate-bounce [animation-delay:-.3s]' />
                        <div className='h-2 w-2 bg-primary rounded-full animate-bounce [animation-delay:-.5s]' />
                     </div>
                  </TableCell>
                </TableRow>
              ) : tests.length > 0 ? (
                tests.map((item: any) => (
                  <TableRow key={item._id} className='hover:bg-white/[0.02] border-white/5 transition-colors'>
                    <TableCell className="ps-6 py-4">
                      <div className='flex items-center gap-4'>
                        {item.image ? (
                          <img
                            src={`${SERVER_URL}${item.image}`}
                            alt={item.name}
                            className='h-10 w-10 rounded-full object-cover border border-white/10'
                          />
                        ) : (
                          <div className='h-10 w-10 rounded-full bg-blue-500/10 flex items-center justify-center text-blue-500'>
                            <Microscope size={20} />
                          </div>
                        )}
                        <span className='text-sm font-bold text-white'>{item.name}</span>
                      </div>
                    </TableCell>
                    <TableCell className='py-4'>
                       <div className='flex items-center gap-1.5 font-semibold text-green-400'>
                          <Banknote size={14} />
                          {item.price_start_from} BDT
                       </div>
                    </TableCell>
                    <TableCell className='py-4'>
                       <span className='text-xs text-muted-foreground line-clamp-1 max-w-md'>
                          {item.description}
                       </span>
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
                            Edit Test
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
                  <TableCell colSpan={4} className='h-32 text-center text-muted-foreground'>
                    No diagnostic tests found.
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

      <DiagnosticTestsActionDialog 
        open={open} 
        onOpenChange={setOpen}
        currentRow={currentRow}
        onSuccess={() => queryClient.invalidateQueries({ queryKey: ['diagnostic-tests'] })}
      />
    </>
  )
}
