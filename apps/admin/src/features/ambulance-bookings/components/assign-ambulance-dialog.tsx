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
  assigned_ambulance: z.string().optional().or(z.literal('')),
})

type AssignForm = z.infer<typeof formSchema>

type Props = {
  open: boolean
  onOpenChange: (open: boolean) => void
  currentRow?: any
  onSuccess: () => void
}

export function AssignAmbulanceDialog({ open, onOpenChange, currentRow, onSuccess }: Props) {
  const { data: ambulances = [] } = useQuery({
    queryKey: ['ambulances'],
    queryFn: async () => {
      const res = await api.get('/ambulances?limit=1000&status=Active')
      return Array.isArray(res.data) ? res.data : res.data?.data ?? []
    },
    enabled: open,
  })

  const form = useForm<AssignForm>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      status: 'Pending',
      assigned_ambulance: '',
    },
  })

  useEffect(() => {
    if (currentRow) {
      form.reset({
        status: currentRow.status || 'Pending',
        assigned_ambulance: currentRow.assigned_ambulance?._id || currentRow.assigned_ambulance || 'none',
      })
    }
  }, [currentRow, form, open])

  const onSubmit = async (values: AssignForm) => {
    try {
      const payload: any = { ...values }
      if (payload.assigned_ambulance === 'none' || !payload.assigned_ambulance) {
        payload.assigned_ambulance = null
      }
      
      await api.patch(`/ambulance-bookings/${currentRow._id}`, payload)
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
          <DialogTitle>Update Booking Status</DialogTitle>
          <DialogDescription>
            Assign an ambulance and update the status of this booking.
          </DialogDescription>
        </DialogHeader>

        <Form {...form}>
          <form id='assign-form' onSubmit={form.handleSubmit(onSubmit)} className='space-y-4'>
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

            <FormField control={form.control} name='assigned_ambulance' render={({ field }) => (
              <FormItem>
                <FormLabel>Assign Ambulance (Active only)</FormLabel>
                <Select onValueChange={field.onChange} defaultValue={field.value} value={field.value}>
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Select ambulance" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    <SelectItem value="none">None</SelectItem>
                    {ambulances.map((amb: any) => (
                      <SelectItem key={amb._id} value={amb._id}>
                        {amb.name} ({amb.ambulance_number}) - {amb.ambulance_type}
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
          <Button type='submit' form='assign-form'>Update Booking</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
