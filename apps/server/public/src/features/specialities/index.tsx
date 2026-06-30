import { useRef, useState } from 'react'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import api, { SERVER_URL } from '@/lib/api'
import { Header } from '@/components/layout/header'
import { Main } from '@/components/layout/main'
import { ProfileDropdown } from '@/components/profile-dropdown'
import { Search } from '@/components/search'
import { ThemeSwitch } from '@/components/theme-switch'
import { ConfigDrawer } from '@/components/config-drawer'
import { Button } from '@/components/ui/button'
import { SimplePagination } from '@/components/simple-pagination'
import { Plus, Trash2, Edit2, MoreHorizontal, Upload, X } from 'lucide-react'
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

export function Specialities() {
  const queryClient = useQueryClient()
  const [open, setOpen] = useState(false)
  const [name, setName] = useState('')
  const [editId, setEditId] = useState<string | null>(null)
  const [page, setPage] = useState(1)
  const [limit, setLimit] = useState(10)

  // Image upload state
  const [file, setFile] = useState<File | null>(null)
  const [preview, setPreview] = useState<string | null>(null)
  const fileInputRef = useRef<HTMLInputElement>(null)

  const { data: specialitiesData, isLoading } = useQuery({
    queryKey: ['specialities', page, limit],
    queryFn: async () => {
      const res = await api.get('/specialities', { params: { page, limit } })
      return res.data
    }
  })

  const specialities = Array.isArray(specialitiesData) ? specialitiesData : (specialitiesData as any)?.data || []
  const metadata = (specialitiesData as any)?._meta || (specialitiesData as any)?.meta || { total: 0, page: 1, limit: 10, totalPages: 1 }

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0]
    if (selectedFile) {
      setFile(selectedFile)
      const reader = new FileReader()
      reader.onloadend = () => setPreview(reader.result as string)
      reader.readAsDataURL(selectedFile)
    }
  }

  const clearFile = () => {
    setFile(null)
    setPreview(null)
    if (fileInputRef.current) fileInputRef.current.value = ''
  }

  const saveMutation = useMutation({
    mutationFn: (payload: { name: string; id?: string; file?: File | null }) => {
      const formData = new FormData()
      formData.append('name', payload.name)
      if (payload.file) formData.append('image', payload.file)

      if (payload.id) {
        return api.patch(`/specialities/${payload.id}`, formData, {
          headers: { 'Content-Type': 'multipart/form-data' },
        })
      }
      return api.post('/specialities', formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      })
    },
    onSuccess: () => {
      toast.success(editId ? 'Speciality updated' : 'Speciality added')
      setOpen(false)
      setName('')
      setEditId(null)
      clearFile()
      queryClient.invalidateQueries({ queryKey: ['specialities'] })
    },
    onError: () => {
      toast.error('Operation failed')
    }
  })

  const deleteMutation = useMutation({
    mutationFn: (id: string) => api.delete(`/specialities/${id}`),
    onSuccess: () => {
      toast.success('Speciality deleted')
      queryClient.invalidateQueries({ queryKey: ['specialities'] })
    },
    onError: () => {
      toast.error('Failed to delete')
    }
  })

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!name) return
    saveMutation.mutate({ name, id: editId || undefined, file })
  }

  const handleDelete = (id: string) => {
    if (!window.confirm('Are you sure?')) return
    deleteMutation.mutate(id)
  }

  const openAddDialog = () => {
    setEditId(null)
    setName('')
    clearFile()
    setOpen(true)
  }

  const openEditDialog = (item: any) => {
    setEditId(item._id)
    setName(item.name)
    setFile(null)
    setPreview(item.image ? `${SERVER_URL}${item.image}` : null)
    if (fileInputRef.current) fileInputRef.current.value = ''
    setOpen(true)
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
            <h2 className='text-2xl font-bold tracking-tight'>Specialities</h2>
            <p className='text-muted-foreground'>
              Manage medical specialities here.
            </p>
          </div>
          <Button onClick={openAddDialog}>
            <Plus className='mr-2' size={18} /> Add Speciality
          </Button>
        </div>

        <Dialog open={open} onOpenChange={setOpen}>
          <DialogContent className='sm:max-w-lg'>
            <DialogHeader className='text-start'>
              <DialogTitle>{editId ? 'Edit Speciality' : 'Add New Speciality'}</DialogTitle>
              <DialogDescription>
                {editId ? 'Update the speciality here. ' : 'Create new speciality here. '}
                Click save when you&apos;re done.
              </DialogDescription>
            </DialogHeader>
            <form id='speciality-form' onSubmit={handleSubmit} className='space-y-4 py-4'>
              <div className='grid grid-cols-6 items-center gap-x-4 gap-y-1 space-y-0'>
                <Label htmlFor='name' className='col-span-2 text-end'>Name</Label>
                <Input
                  id='name'
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className='col-span-4'
                  placeholder='e.g. Cardiology'
                  autoComplete='off'
                />
              </div>
              <div className='grid grid-cols-6 items-start gap-x-4 gap-y-1 space-y-0'>
                <Label className='col-span-2 pt-2 text-end'>Image</Label>
                <div className='col-span-4 space-y-3'>
                  {preview && (
                    <div className='relative inline-block'>
                      <img
                        src={preview}
                        alt='Preview'
                        className='h-20 w-20 rounded-lg border object-cover'
                      />
                      <button
                        type='button'
                        onClick={clearFile}
                        className='absolute -right-2 -top-2 rounded-full bg-destructive p-0.5 text-destructive-foreground shadow-sm hover:bg-destructive/90'
                      >
                        <X size={14} />
                      </button>
                    </div>
                  )}
                  <div>
                    <input
                      ref={fileInputRef}
                      type='file'
                      accept='image/jpeg,image/jpg,image/png,image/webp'
                      onChange={handleFileChange}
                      className='hidden'
                    />
                    <Button
                      type='button'
                      variant='outline'
                      size='sm'
                      onClick={() => fileInputRef.current?.click()}
                    >
                      <Upload className='mr-2' size={14} />
                      {preview ? 'Change Image' : 'Upload Image'}
                    </Button>
                    <p className='mt-1 text-xs text-muted-foreground'>
                      Optional. JPG, PNG or WebP.
                    </p>
                  </div>
                </div>
              </div>
            </form>
            <DialogFooter>
              <Button type='submit' form='speciality-form'>Save changes</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>

        <div className='overflow-hidden rounded-md border'>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className='ps-4 w-[60px]'>Image</TableHead>
                <TableHead>Name</TableHead>
                <TableHead className='w-[100px] text-right pe-4'>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {isLoading ? (
                <TableRow>
                  <TableCell colSpan={3} className='h-24 text-center'>
                    Loading specialities...
                  </TableCell>
                </TableRow>
              ) : specialities.length > 0 ? (
                specialities.map((item: any) => (
                  <TableRow key={item._id}>
                    <TableCell className='ps-4'>
                      {item.image ? (
                        <img
                          src={`${SERVER_URL}${item.image}`}
                          alt={item.name}
                          className='h-9 w-9 rounded-md border object-cover'
                        />
                      ) : (
                        <div className='flex h-9 w-9 items-center justify-center rounded-md border bg-muted text-xs text-muted-foreground'>
                          —
                        </div>
                      )}
                    </TableCell>
                    <TableCell className="font-medium">{item.name}</TableCell>
                    <TableCell className='text-right pe-4'>
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant='ghost' className='h-8 w-8 p-0'>
                            <MoreHorizontal className='h-4 w-4' />
                            <span className='sr-only'>Open menu</span>
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align='end' className='w-40'>
                          <DropdownMenuItem onClick={() => openEditDialog(item)}>
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
                  <TableCell colSpan={3} className='h-24 text-center'>
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
