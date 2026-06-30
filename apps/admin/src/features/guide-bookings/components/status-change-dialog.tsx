import { useState, useEffect } from 'react'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
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
import { Button } from '@/components/ui/button'
import { Label } from '@/components/ui/label'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import api from '@/lib/api'
import { toast } from 'sonner'
import { Map, CheckCircle2 } from 'lucide-react'

interface Props {
  open: boolean
  onOpenChange: (open: boolean) => void
  booking: any
  onSuccess?: () => void
}

const statusOptions = [
  'Pending',
  'Confirmed',
  'Completed',
  'Cancelled',
]

export function StatusChangeDialog({ open, onOpenChange, booking, onSuccess }: Props) {
  const [status, setStatus] = useState<string>('')
  const queryClient = useQueryClient()

  useEffect(() => {
    if (booking) setStatus(booking.status)
  }, [booking])

  const mutation = useMutation({
    mutationFn: async (newStatus: string) => {
      return api.patch(`/guide-bookings/${booking._id}/status`, { status: newStatus })
    },
    onSuccess: () => {
      toast.success('Booking status updated')
      queryClient.invalidateQueries({ queryKey: ['guide-bookings'] })
      if (onSuccess) onSuccess()
      onOpenChange(false)
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.message || 'Failed to update status')
    },
  })

  const handleSubmit = () => {
    mutation.mutate(status)
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className='sm:max-w-[400px] border-primary/20 shadow-2xl'>
        <DialogHeader>
          <DialogTitle className='flex items-center gap-2'>
            <Map className='h-5 w-5 text-primary' />
            Update Guide Status
          </DialogTitle>
          <DialogDescription>
            Change the current status for <span className='font-bold text-foreground'>{booking?.customer?.name}'s</span> guide request at <span className='font-bold text-foreground'>{booking?.hospital?.name}</span>.
          </DialogDescription>
        </DialogHeader>
        <div className='py-6 space-y-4'>
          <div className='grid gap-2'>
            <Label htmlFor='status' className='text-sm font-semibold text-muted-foreground uppercase tracking-widest'>Select New Status</Label>
            <Select value={status} onValueChange={setStatus}>
              <SelectTrigger id='status' className='h-12 text-lg font-medium border-primary/20 hover:border-primary transition-colors'>
                <SelectValue placeholder='Select status' />
              </SelectTrigger>
              <SelectContent>
                {statusOptions.map((opt) => (
                  <SelectItem key={opt} value={opt} className='h-10 font-medium'>
                    {opt}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          
          <div className='rounded-lg bg-primary/5 p-4 border border-primary/10'>
            <div className='flex items-center gap-3'>
              <CheckCircle2 className='h-5 w-5 text-primary opacity-60' />
              <div>
                <p className='text-xs font-bold text-muted-foreground uppercase mb-1 tracking-tighter'>Process</p>
                <p className='text-xs font-medium text-foreground leading-relaxed'>
                  Updating the status will notify the operational team to coordinate the guide assignment.
                </p>
              </div>
            </div>
          </div>
        </div>
        <DialogFooter className='pt-2'>
          <Button variant='outline' onClick={() => onOpenChange(false)} className='font-bold'>Cancel</Button>
          <Button 
            onClick={handleSubmit} 
            disabled={mutation.isPending || status === booking?.status}
            className='bg-primary hover:bg-primary/90 text-primary-foreground font-bold shadow-md shadow-primary/20'
          >
            {mutation.isPending ? 'Updating...' : 'Confirm Update'}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
