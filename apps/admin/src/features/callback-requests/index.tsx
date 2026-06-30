import { useState } from 'react'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import api from '@/lib/api'
import { Header } from '@/components/layout/header'
import { Main } from '@/components/layout/main'
import { ProfileDropdown } from '@/components/profile-dropdown'
import { Search } from '@/components/search'
import { ThemeSwitch } from '@/components/theme-switch'
import { ConfigDrawer } from '@/components/config-drawer'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Input } from '@/components/ui/input'
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
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import {
  Eye,
  Inbox,
  MoreHorizontal,
  Phone,
  PhoneCall,
  Search as SearchIcon,
  Trash2,
} from 'lucide-react'
import { format } from 'date-fns'
import { toast } from 'sonner'

const STATUSES = [
  { value: 'all', label: 'All Statuses' },
  { value: 'pending', label: 'Pending' },
  { value: 'called', label: 'Called' },
  { value: 'completed', label: 'Completed' },
  { value: 'cancelled', label: 'Cancelled' },
]

const statusStyle = (s: string) => {
  switch (s) {
    case 'pending':
      return 'bg-amber-500/10 text-amber-600 dark:text-amber-400 border-amber-500/20'
    case 'called':
      return 'bg-blue-500/10 text-blue-600 dark:text-blue-400 border-blue-500/20'
    case 'completed':
      return 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-500/20'
    case 'cancelled':
      return 'bg-red-500/10 text-red-600 dark:text-red-400 border-red-500/20'
    default:
      return 'bg-gray-500/10 text-gray-600 dark:text-gray-400 border-gray-500/20'
  }
}

export function CallbackRequests() {
  const queryClient = useQueryClient()
  const [page, setPage] = useState(1)
  const [limit, setLimit] = useState(10)
  const [search, setSearch] = useState('')
  const [status, setStatus] = useState('all')
  const [selected, setSelected] = useState<any>(null)

  const { data: reqData, isLoading } = useQuery({
    queryKey: ['callback-requests', page, limit, search, status],
    queryFn: async () => {
      const params: Record<string, any> = { page, limit }
      if (search) params.search = search
      if (status !== 'all') params.status = status
      const res = await api.get('/callback-requests', { params })
      return res.data
    },
  })

  const requests = Array.isArray(reqData) ? reqData : (reqData as any)?.data || []
  const metadata = (reqData as any)?._meta || (reqData as any)?.meta || {
    total: 0,
    page: 1,
    limit: 10,
    totalPages: 1,
  }

  const updateStatusMutation = useMutation({
    mutationFn: ({ id, status }: { id: string; status: string }) =>
      api.patch(`/callback-requests/${id}/status`, { status }),
    onSuccess: () => {
      toast.success('Status updated')
      queryClient.invalidateQueries({ queryKey: ['callback-requests'] })
    },
    onError: () => toast.error('Failed to update status'),
  })

  const deleteMutation = useMutation({
    mutationFn: (id: string) => api.delete(`/callback-requests/${id}`),
    onSuccess: () => {
      toast.success('Request deleted')
      queryClient.invalidateQueries({ queryKey: ['callback-requests'] })
    },
    onError: () => toast.error('Failed to delete'),
  })

  const handleDelete = (id: string) => {
    if (!window.confirm('Delete this callback request permanently?')) return
    deleteMutation.mutate(id)
  }

  const resetFilters = () => {
    setSearch('')
    setStatus('all')
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
            <h2 className='flex items-center gap-2 text-2xl font-bold tracking-tight'>
              <PhoneCall className='text-primary' size={22} /> Callback Requests
            </h2>
            <p className='text-muted-foreground'>
              Callback requests from the website's consultation form.
            </p>
          </div>
          <div className='flex items-center gap-2 text-xs text-muted-foreground'>
            <span className='font-medium'>Total:</span>
            <span className='font-semibold text-foreground'>
              {metadata.total}
            </span>
          </div>
        </div>

        {/* Filters */}
        <div className='grid grid-cols-1 gap-3 md:grid-cols-4'>
          <div className='relative md:col-span-3'>
            <SearchIcon
              className='absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground'
              size={14}
            />
            <Input
              value={search}
              onChange={(e) => {
                setSearch(e.target.value)
                setPage(1)
              }}
              placeholder='Search by name, phone or note…'
              className='pl-9'
            />
          </div>
          <Select
            value={status}
            onValueChange={(v) => {
              setStatus(v)
              setPage(1)
            }}
          >
            <SelectTrigger>
              <SelectValue placeholder='Status' />
            </SelectTrigger>
            <SelectContent>
              {STATUSES.map((s) => (
                <SelectItem key={s.value} value={s.value}>
                  {s.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {(search || status !== 'all') && (
          <div>
            <Button
              variant='outline'
              size='sm'
              onClick={resetFilters}
              className='h-8'
            >
              Clear filters
            </Button>
          </div>
        )}

        <div className='overflow-hidden rounded-md border'>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className='ps-4 w-[180px]'>Name</TableHead>
                <TableHead className='w-[160px]'>Phone</TableHead>
                <TableHead>Note</TableHead>
                <TableHead className='w-[120px]'>Status</TableHead>
                <TableHead className='w-[170px]'>Received</TableHead>
                <TableHead className='w-[80px] text-right pe-4'>
                  Actions
                </TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {isLoading ? (
                <TableRow>
                  <TableCell colSpan={6} className='h-24 text-center'>
                    Loading callback requests…
                  </TableCell>
                </TableRow>
              ) : requests.length > 0 ? (
                requests.map((r: any) => (
                  <TableRow
                    key={r._id}
                    className={r.status === 'pending' ? 'font-semibold' : ''}
                  >
                    <TableCell className='ps-4 text-sm'>{r.name}</TableCell>
                    <TableCell>
                      <a
                        href={`tel:${r.phone}`}
                        className='inline-flex items-center gap-1.5 font-mono text-xs text-primary hover:underline'
                      >
                        <Phone size={12} />
                        {r.phone}
                      </a>
                    </TableCell>
                    <TableCell className='max-w-md truncate text-sm text-muted-foreground'>
                      {r.note || '—'}
                    </TableCell>
                    <TableCell>
                      <Badge
                        variant='outline'
                        className={`text-[10px] font-bold uppercase tracking-wider ${statusStyle(r.status)}`}
                      >
                        {r.status}
                      </Badge>
                    </TableCell>
                    <TableCell className='text-xs text-muted-foreground'>
                      {r.createdAt
                        ? format(new Date(r.createdAt), 'dd MMM yyyy, hh:mm a')
                        : '—'}
                    </TableCell>
                    <TableCell className='pe-4 text-right'>
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant='ghost' className='h-8 w-8 p-0'>
                            <MoreHorizontal className='h-4 w-4' />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align='end' className='w-44'>
                          <DropdownMenuItem onClick={() => setSelected(r)}>
                            <Eye className='mr-2 h-4 w-4' />
                            View
                          </DropdownMenuItem>
                          <DropdownMenuSeparator />
                          {(
                            [
                              'pending',
                              'called',
                              'completed',
                              'cancelled',
                            ] as const
                          ).map(
                            (s) =>
                              s !== r.status && (
                                <DropdownMenuItem
                                  key={s}
                                  onClick={() =>
                                    updateStatusMutation.mutate({
                                      id: r._id,
                                      status: s,
                                    })
                                  }
                                  className='capitalize'
                                >
                                  Mark as {s}
                                </DropdownMenuItem>
                              ),
                          )}
                          <DropdownMenuSeparator />
                          <DropdownMenuItem
                            className='text-destructive focus:text-destructive'
                            onClick={() => handleDelete(r._id)}
                          >
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
                  <TableCell
                    colSpan={6}
                    className='h-32 text-center text-muted-foreground'
                  >
                    <div className='flex flex-col items-center gap-2'>
                      <Inbox className='opacity-40' size={32} />
                      <span>No callback requests yet.</span>
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
          onLimitChange={(l) => {
            setLimit(l)
            setPage(1)
          }}
        />

        {/* Detail dialog */}
        <Dialog open={!!selected} onOpenChange={(o) => !o && setSelected(null)}>
          <DialogContent className='sm:max-w-lg'>
            <DialogHeader>
              <DialogTitle>Callback Request</DialogTitle>
              <DialogDescription>Details of the request</DialogDescription>
            </DialogHeader>
            {selected && (
              <div className='space-y-4 text-sm'>
                <Row label='Name' value={selected.name} />
                <Row label='Phone' value={selected.phone} mono />
                <Row
                  label='Status'
                  value={selected.status?.toUpperCase()}
                />
                <Row
                  label='Received'
                  value={
                    selected.createdAt
                      ? format(
                          new Date(selected.createdAt),
                          'EEE, dd MMM yyyy • hh:mm:ss a',
                        )
                      : '—'
                  }
                />
                {selected.handledBy && (
                  <Row
                    label='Handled By'
                    value={
                      typeof selected.handledBy === 'object'
                        ? selected.handledBy.name
                        : selected.handledBy
                    }
                  />
                )}
                {selected.handledAt && (
                  <Row
                    label='Handled At'
                    value={format(
                      new Date(selected.handledAt),
                      'EEE, dd MMM yyyy • hh:mm:ss a',
                    )}
                  />
                )}
                {selected.note && (
                  <div>
                    <p className='mb-1 text-[10px] font-bold uppercase tracking-wider text-muted-foreground'>
                      Note
                    </p>
                    <div className='rounded-lg border bg-muted/30 p-3 text-xs font-medium leading-relaxed whitespace-pre-wrap'>
                      {selected.note}
                    </div>
                  </div>
                )}
                {(selected.ip || selected.userAgent) && (
                  <div className='border-t pt-3 space-y-2'>
                    {selected.ip && (
                      <Row label='IP' value={selected.ip} mono />
                    )}
                    {selected.userAgent && (
                      <Row
                        label='User Agent'
                        value={selected.userAgent}
                        mono
                      />
                    )}
                  </div>
                )}

                <div className='flex gap-2 border-t pt-4'>
                  <a href={`tel:${selected.phone}`} className='flex-1'>
                    <Button className='w-full'>
                      <Phone size={14} className='mr-2' /> Call
                    </Button>
                  </a>
                  <a
                    href={`https://wa.me/${String(selected.phone).replace(/\D/g, '')}`}
                    target='_blank'
                    rel='noopener noreferrer'
                    className='flex-1'
                  >
                    <Button variant='outline' className='w-full'>
                      WhatsApp
                    </Button>
                  </a>
                </div>
              </div>
            )}
          </DialogContent>
        </Dialog>
      </Main>
    </>
  )
}

function Row({
  label,
  value,
  mono,
}: {
  label: string
  value?: string
  mono?: boolean
}) {
  return (
    <div className='flex items-start justify-between gap-4'>
      <span className='shrink-0 text-[10px] font-bold uppercase tracking-wider text-muted-foreground'>
        {label}
      </span>
      <span
        className={`text-right text-xs font-semibold break-all ${mono ? 'font-mono' : ''}`}
      >
        {value || '—'}
      </span>
    </div>
  )
}
