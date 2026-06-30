import { useState, useEffect } from 'react'
import { z } from 'zod'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { toast } from 'sonner'
import { Button } from '@/components/ui/button'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import { SearchableSelect } from '@/components/searchable-select'
import api from '@/lib/api'
import { useQueryClient, useInfiniteQuery } from '@tanstack/react-query'
import { format } from 'date-fns'

const formSchema = z.object({
  doctor: z.string().min(1, 'Doctor is required.'),
  date: z.string().min(1, 'Date is required.'),
  start_date_time: z.string().min(1, 'Start time is required.'),
  total_serial: z.number().min(1, 'Total serial must be at least 1.'),
  current_serial: z.number().min(0),
  avg_per_patient_visit_time_in_min: z.number().min(1, 'Avg time is required.'),
})

type QueueForm = z.infer<typeof formSchema>

type QueueActionDialogProps = {
  open: boolean
  onOpenChange: (open: boolean) => void
  onSuccess?: () => void
}

export function QueueActionDialog({
  open,
  onOpenChange,
  onSuccess,
}: QueueActionDialogProps) {
  const queryClient = useQueryClient()

  const form = useForm<QueueForm>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      doctor: '',
      date: format(new Date(), 'yyyy-MM-dd'),
      start_date_time: format(new Date(), "yyyy-MM-dd'T'HH:mm"),
      total_serial: 40,
      current_serial: 0,
      avg_per_patient_visit_time_in_min: 15,
    },
  })

  const [searchTerm, setSearchTerm] = useState('')
  const [debouncedSearch, setDebouncedSearch] = useState('')

  // Debounce search
  useEffect(() => {
    const timer = setTimeout(() => setDebouncedSearch(searchTerm), 300)
    return () => clearTimeout(timer)
  }, [searchTerm])

  const {
    data: doctorsData,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
    isLoading: isLoadingDoctors
  } = useInfiniteQuery({
    queryKey: ['doctors-infinite', debouncedSearch],
    queryFn: async ({ pageParam = 1 }) => {
      const params = new URLSearchParams()
      if (debouncedSearch) params.append('search', debouncedSearch)
      params.append('page', pageParam.toString())
      params.append('limit', '10')
      const res = await api.get(`/doctors?${params.toString()}`)
      return res.data
    },
    getNextPageParam: (lastPage: any) => {
      const meta = (lastPage as any)?._meta || (lastPage as any)?.meta
      if (meta && meta.page < meta.totalPages) return meta.page + 1
      return undefined
    },
    initialPageParam: 1,
  })

  const doctors = doctorsData?.pages.flatMap((p: any) => Array.isArray(p) ? p : (p?.data || [])) || []

  const onSubmit = async (values: QueueForm) => {
    try {
      // Ensure date formats match ISO strings if required by backend
      const payload = {
        ...values,
        start_date_time: new Date(values.start_date_time).toISOString(),
      }

      await api.post('/doctor-live-queues/setup', payload)

      toast.success('Live queue started successfully')
      form.reset()
      onOpenChange(false)
      onSuccess?.()
      queryClient.invalidateQueries({ queryKey: ['doctor-live-queues-admin'] })
    } catch (error: any) {
      const errorMessage = error.response?.data?.error?.message || error.response?.data?.message || 'Failed to start queue'
      toast.error(errorMessage)
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className='sm:max-w-md'>
        <DialogHeader>
          <DialogTitle>Setup Live Queue</DialogTitle>
          <DialogDescription>
            Initialize a new live patient tracking queue for a doctor.
          </DialogDescription>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className='space-y-4'>
            <FormField
              control={form.control}
              name='doctor'
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Select Doctor</FormLabel>
                  <SearchableSelect
                    value={field.value}
                    onValueChange={field.onChange}
                    onSearchChange={setSearchTerm}
                    onScrollEnd={fetchNextPage}
                    isLoadingMore={isFetchingNextPage}
                    hasNextPage={hasNextPage}
                    isLoading={isLoadingDoctors}
                    placeholder='Choose a doctor'
                    searchPlaceholder='Search doctor name...'
                    items={doctors.map((d: any) => ({
                      label: d.name?.trim() || 'Unnamed Doctor',
                      value: d._id,
                    }))}
                  />
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className='grid grid-cols-2 gap-4'>
              <FormField
                control={form.control}
                name='date'
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Queue Date</FormLabel>
                    <FormControl>
                      <Input type='date' {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name='start_date_time'
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Start Time</FormLabel>
                    <FormControl>
                      <Input type='datetime-local' {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <div className='grid grid-cols-2 gap-4'>
              <FormField
                control={form.control}
                name='total_serial'
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Total Capacity</FormLabel>
                    <FormControl>
                      <Input
                        type='number'
                        {...field}
                        onChange={e => field.onChange(parseInt(e.target.value))}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name='avg_per_patient_visit_time_in_min'
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Avg. Time (Min)</FormLabel>
                    <FormControl>
                      <Input
                        type='number'
                        {...field}
                        onChange={e => field.onChange(parseInt(e.target.value))}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <DialogFooter className='gap-2 pt-2'>
              <Button
                type='button'
                variant='outline'
                onClick={() => onOpenChange(false)}
              >
                Cancel
              </Button>
              <Button type='submit'>Start Queue</Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  )
}
