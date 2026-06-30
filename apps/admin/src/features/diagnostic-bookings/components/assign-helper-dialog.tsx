'use client'

import { z } from 'zod'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { useEffect } from 'react'
import { useQuery } from '@tanstack/react-query'
import { toast } from 'sonner'
import api from '@/lib/api'
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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"

const formSchema = z.object({
  status: z.enum(['Pending', 'Confirmed', 'Completed', 'Cancelled']),
  assigned_helper: z.string().optional().or(z.literal('none')),
})

type AssignForm = z.infer<typeof formSchema>

type Props = {
  open: boolean
  onOpenChange: (open: boolean) => void
  currentRow?: any
  onSuccess: () => void
}

export function AssignHelperDialog({ open, onOpenChange, currentRow, onSuccess }: Props) {
  const { data: helpers = [] } = useQuery({
    queryKey: ['helpers'],
    queryFn: async () => {
      const res = await api.get('/users', { params: { role: 'helpers', limit: 1000 } })
      return Array.isArray(res.data) ? res.data : res.data?.data ?? []
    },
    enabled: open,
  })

  const form = useForm<AssignForm>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      status: 'Pending',
      assigned_helper: 'none',
    },
  })

  useEffect(() => {
    if (currentRow) {
      form.reset({
        status: currentRow.status || 'Pending',
        assigned_helper: currentRow.assigned_helper?._id || currentRow.assigned_helper || 'none',
      })
    }
  }, [currentRow, form, open])

  const onSubmit = async (values: AssignForm) => {
    try {
      const payload: any = { ...values }
      if (payload.assigned_helper === 'none' || !payload.assigned_helper) {
        payload.assigned_helper = null
      }
      
      await api.patch(`/diagnostic-bookings/${currentRow._id}`, payload)
      toast.success('Booking updated successfully')
      onOpenChange(false)
      onSuccess()
    } catch (e) {
      toast.error('Failed to update booking')
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className='sm:max-w-md'>
        <DialogHeader className='text-start'>
          <DialogTitle>Update Booking & Assign Helper</DialogTitle>
          <DialogDescription>
            Select a helper to assign to this diagnostic test collection.
          </DialogDescription>
        </DialogHeader>

        <Form {...form}>
          <form id='assign-helper-form' onSubmit={form.handleSubmit(onSubmit)} className='space-y-4'>
            <FormField control={form.control} name='status' render={({ field }) => (
              <FormItem>
                <FormLabel>Booking Status</FormLabel>
                <Select onValueChange={field.onChange} defaultValue={field.value} value={field.value}>
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Select status" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    <SelectItem value="Pending">Pending</SelectItem>
                    <SelectItem value="Confirmed">Confirmed</SelectItem>
                    <SelectItem value="Completed">Completed</SelectItem>
                    <SelectItem value="Cancelled">Cancelled</SelectItem>
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )} />

            <FormField control={form.control} name='assigned_helper' render={({ field }) => (
              <FormItem>
                <FormLabel>Assign People (Helpers)</FormLabel>
                <Select onValueChange={field.onChange} defaultValue={field.value} value={field.value}>
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Select a helper" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    <SelectItem value="none">None</SelectItem>
                    {helpers.map((user: any) => (
                      <SelectItem key={user._id} value={user._id}>
                        {user.name} ({user.username})
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )} />
          </form>
        </Form>

        <DialogFooter>
          <Button type='submit' form='assign-helper-form'>Update Booking</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
