import { useState } from 'react'
import { useQuery } from '@tanstack/react-query'
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
  CheckCircle2,
  Eye,
  MessageSquare,
  Search as SearchIcon,
  XCircle,
} from 'lucide-react'
import { format } from 'date-fns'

const CATEGORIES = [
  { value: 'all', label: 'All Categories' },
  { value: 'otp_registration', label: 'OTP: Registration' },
  { value: 'otp_password_reset', label: 'OTP: Password Reset' },
  { value: 'app_download_link', label: 'App Download Link' },
  { value: 'notification', label: 'Notification' },
  { value: 'other', label: 'Other' },
]

const STATUSES = [
  { value: 'all', label: 'All Statuses' },
  { value: 'sent', label: 'Sent' },
  { value: 'failed', label: 'Failed' },
]

const categoryLabel = (c?: string) =>
  CATEGORIES.find((x) => x.value === c)?.label || c || 'Other'

export function SmsLogs() {
  const [page, setPage] = useState(1)
  const [limit, setLimit] = useState(10)
  const [search, setSearch] = useState('')
  const [category, setCategory] = useState('all')
  const [status, setStatus] = useState('all')
  const [selectedLog, setSelectedLog] = useState<any>(null)

  const { data: logsData, isLoading } = useQuery({
    queryKey: ['sms-logs', page, limit, search, category, status],
    queryFn: async () => {
      const params: Record<string, any> = { page, limit }
      if (search) params.search = search
      if (category !== 'all') params.category = category
      if (status !== 'all') params.status = status
      const res = await api.get('/sms-logs', { params })
      return res.data
    },
  })

  const logs = Array.isArray(logsData) ? logsData : (logsData as any)?.data || []
  const metadata = (logsData as any)?._meta || (logsData as any)?.meta || {
    total: 0,
    page: 1,
    limit: 10,
    totalPages: 1,
  }

  const resetFilters = () => {
    setSearch('')
    setCategory('all')
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
              <MessageSquare className='text-primary' size={22} /> SMS History
            </h2>
            <p className='text-muted-foreground'>
              Track all outgoing SMS — OTPs, app download links, and
              notifications.
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
          <div className='relative md:col-span-2'>
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
              placeholder='Search by phone or message…'
              className='pl-9'
            />
          </div>
          <Select
            value={category}
            onValueChange={(v) => {
              setCategory(v)
              setPage(1)
            }}
          >
            <SelectTrigger>
              <SelectValue placeholder='Category' />
            </SelectTrigger>
            <SelectContent>
              {CATEGORIES.map((c) => (
                <SelectItem key={c.value} value={c.value}>
                  {c.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
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

        {(search || category !== 'all' || status !== 'all') && (
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
                <TableHead className='ps-4 w-[140px]'>Phone</TableHead>
                <TableHead>Message</TableHead>
                <TableHead className='w-[160px]'>Category</TableHead>
                <TableHead className='w-[100px]'>Status</TableHead>
                <TableHead className='w-[180px]'>Sent At</TableHead>
                <TableHead className='w-[80px] text-right pe-4'>View</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {isLoading ? (
                <TableRow>
                  <TableCell colSpan={6} className='h-24 text-center'>
                    Loading SMS history…
                  </TableCell>
                </TableRow>
              ) : logs.length > 0 ? (
                logs.map((log: any) => (
                  <TableRow key={log._id}>
                    <TableCell className='ps-4 font-mono text-xs font-medium'>
                      {log.phone}
                    </TableCell>
                    <TableCell className='max-w-md truncate text-sm text-muted-foreground'>
                      {log.message}
                    </TableCell>
                    <TableCell>
                      <Badge
                        variant='outline'
                        className='font-medium text-[10px] uppercase tracking-wider'
                      >
                        {categoryLabel(log.category)}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      {log.status === 'sent' ? (
                        <span className='inline-flex items-center gap-1 rounded-full bg-emerald-500/10 px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wider text-emerald-600 dark:text-emerald-400'>
                          <CheckCircle2 size={10} /> Sent
                        </span>
                      ) : (
                        <span className='inline-flex items-center gap-1 rounded-full bg-red-500/10 px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wider text-red-600 dark:text-red-400'>
                          <XCircle size={10} /> Failed
                        </span>
                      )}
                    </TableCell>
                    <TableCell className='text-xs text-muted-foreground'>
                      {log.createdAt
                        ? format(new Date(log.createdAt), 'dd MMM yyyy, hh:mm a')
                        : '—'}
                    </TableCell>
                    <TableCell className='pe-4 text-right'>
                      <Button
                        variant='ghost'
                        size='icon'
                        className='h-8 w-8'
                        onClick={() => setSelectedLog(log)}
                      >
                        <Eye size={14} />
                      </Button>
                    </TableCell>
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell colSpan={6} className='h-24 text-center'>
                    No SMS records found.
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
        <Dialog
          open={!!selectedLog}
          onOpenChange={(o) => !o && setSelectedLog(null)}
        >
          <DialogContent className='sm:max-w-lg'>
            <DialogHeader>
              <DialogTitle>SMS Details</DialogTitle>
              <DialogDescription>
                Full payload and delivery info
              </DialogDescription>
            </DialogHeader>
            {selectedLog && (
              <div className='space-y-4 text-sm'>
                <DetailRow label='Phone' value={selectedLog.phone} mono />
                <DetailRow
                  label='Category'
                  value={categoryLabel(selectedLog.category)}
                />
                <DetailRow
                  label='Status'
                  value={selectedLog.status?.toUpperCase()}
                />
                <DetailRow
                  label='Provider'
                  value={selectedLog.provider || '—'}
                />
                <DetailRow
                  label='Sent At'
                  value={
                    selectedLog.createdAt
                      ? format(
                          new Date(selectedLog.createdAt),
                          'EEE, dd MMM yyyy • hh:mm:ss a',
                        )
                      : '—'
                  }
                />
                <div>
                  <p className='mb-1 text-[10px] font-bold uppercase tracking-wider text-muted-foreground'>
                    Message
                  </p>
                  <div className='rounded-lg border bg-muted/30 p-3 text-xs font-medium leading-relaxed whitespace-pre-wrap'>
                    {selectedLog.message}
                  </div>
                </div>
                {selectedLog.errorMessage && (
                  <div>
                    <p className='mb-1 text-[10px] font-bold uppercase tracking-wider text-red-500'>
                      Error
                    </p>
                    <div className='rounded-lg border border-red-500/20 bg-red-500/5 p-3 text-xs font-medium text-red-600 dark:text-red-400'>
                      {selectedLog.errorMessage}
                    </div>
                  </div>
                )}
                {selectedLog.providerResponse && (
                  <div>
                    <p className='mb-1 text-[10px] font-bold uppercase tracking-wider text-muted-foreground'>
                      Provider Response
                    </p>
                    <div className='max-h-40 overflow-y-auto rounded-lg border bg-muted/30 p-3 font-mono text-[11px] whitespace-pre-wrap'>
                      {selectedLog.providerResponse}
                    </div>
                  </div>
                )}
                {(selectedLog.ip || selectedLog.userAgent) && (
                  <div className='border-t pt-3 space-y-2'>
                    {selectedLog.ip && (
                      <DetailRow label='IP' value={selectedLog.ip} mono />
                    )}
                    {selectedLog.userAgent && (
                      <DetailRow
                        label='User Agent'
                        value={selectedLog.userAgent}
                        mono
                      />
                    )}
                  </div>
                )}
              </div>
            )}
          </DialogContent>
        </Dialog>
      </Main>
    </>
  )
}

function DetailRow({
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
