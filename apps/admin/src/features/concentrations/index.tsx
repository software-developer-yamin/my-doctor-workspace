import { useState } from 'react'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import api from '@/lib/api'
import { Header } from '@/components/layout/header'
import { Main } from '@/components/layout/main'
import { ProfileDropdown } from '@/components/profile-dropdown'
import { Search } from '@/components/search'
import { ThemeSwitch } from '@/components/theme-switch'
import { ConfigDrawer } from '@/components/config-drawer'
import { Button } from '@/components/ui/button'
import { SimplePagination } from '@/components/simple-pagination'
import { Plus, Trash2, Edit2, MoreHorizontal } from 'lucide-react'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { toast } from 'sonner'

export function Concentrations() {
  const queryClient = useQueryClient()
  const [open, setOpen] = useState(false)
  const [name, setName] = useState('')
  const [editId, setEditId] = useState<string | null>(null)
  const [page, setPage] = useState(1)
  const [limit, setLimit] = useState(10)

  const { data: concentrationsData, isLoading } = useQuery({
    queryKey: ['concentrations', page, limit],
    queryFn: async () => {
      const res = await api.get('/concentrations', { params: { page, limit } })
      return res.data
    }
  })

  const concentrations = Array.isArray(concentrationsData) ? concentrationsData : (concentrationsData as any)?.data || []
  const metadata = (concentrationsData as any)?._meta || (concentrationsData as any)?.meta || { total: 0, page: 1, limit: 10, totalPages: 1 }


  const saveMutation = useMutation({
    mutationFn: (payload: { name: string; id?: string }) => {
      if (payload.id) {
        return api.patch(`/concentrations/${payload.id}`, { name: payload.name })
      }
      return api.post('/concentrations', { name: payload.name })
    },
    onSuccess: () => {
      toast.success(editId ? 'Concentration updated' : 'Concentration added')
      setOpen(false)
      setName('')
      setEditId(null)
      queryClient.invalidateQueries({ queryKey: ['concentrations'] })
    },
    onError: () => {
      toast.error('Operation failed')
    }
  })

  const deleteMutation = useMutation({
    mutationFn: (id: string) => api.delete(`/concentrations/${id}`),
    onSuccess: () => {
      toast.success('Concentration deleted')
      queryClient.invalidateQueries({ queryKey: ['concentrations'] })
    },
    onError: () => {
      toast.error('Failed to delete')
    }
  })

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!name) return
    saveMutation.mutate({ name, id: editId || undefined })
  }

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
            <h2 className='text-2xl font-bold tracking-tight'>Concentrations</h2>
            <p className='text-muted-foreground'>
              Manage fields of concentration here.
            </p>
          </div>
          <Button onClick={() => { setEditId(null); setName(''); setOpen(true); }}>
            <Plus className='mr-2' size={18} /> Add Concentration
          </Button>
        </div>

        <Dialog open={open} onOpenChange={setOpen}>
          <DialogContent className='sm:max-w-lg'>
            <DialogHeader className='text-start'>
              <DialogTitle>{editId ? 'Edit Concentration' : 'Add New Concentration'}</DialogTitle>
              <DialogDescription>
                {editId ? 'Update the concentration name here. ' : 'Create new concentration here. '}
                Click save when you&apos;re done.
              </DialogDescription>
            </DialogHeader>
            <form id='concentration-form' onSubmit={handleSubmit} className='space-y-4 py-4'>
              <div className='grid grid-cols-6 items-center gap-x-4 gap-y-1 space-y-0'>
                <Label htmlFor='name' className='col-span-2 text-end'>Name</Label>
                <Input
                  id='name'
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className='col-span-4'
                  placeholder='e.g. Pediatric Surgery'
                  autoComplete='off'
                />
              </div>
            </form>
            <DialogFooter>
              <Button type='submit' form='concentration-form'>Save changes</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>

        <div className='overflow-hidden rounded-md border'>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className='ps-4'>Name</TableHead>
                <TableHead className='w-[100px] text-right pe-4'>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {isLoading ? (
                <TableRow>
                  <TableCell colSpan={2} className='h-24 text-center'>
                    Loading concentrations...
                  </TableCell>
                </TableRow>
              ) : concentrations.length > 0 ? (
                concentrations.map((item: any) => (
                  <TableRow key={item._id}>
                    <TableCell className="font-medium ps-4">{item.name}</TableCell>
                    <TableCell className='text-right pe-4'>
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant='ghost' className='h-8 w-8 p-0'>
                            <MoreHorizontal className='h-4 w-4' />
                            <span className='sr-only'>Open menu</span>
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align='end' className='w-40'>
                          <DropdownMenuItem onClick={() => { setEditId(item._id); setName(item.name); setOpen(true); }}>
                            <Edit2 className='mr-2 h-4 w-4' />
                            Edit
                          </DropdownMenuItem>
                          <DropdownMenuSeparator />
                          <DropdownMenuItem className='text-destructive focus:text-destructive' onClick={() => handleDelete(item._id)}>
                            <Trash2 className='mr-2 h-4 w-4' />
                            Delete
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </TableCell>
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell colSpan={2} className='h-24 text-center'>
                    No data found.
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
    </>
  )
}
