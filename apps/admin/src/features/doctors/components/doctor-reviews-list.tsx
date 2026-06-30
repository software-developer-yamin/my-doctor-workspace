import { useState } from 'react'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { toast } from 'sonner'
import { Star, Trash2, CheckCircle, XCircle, Plus, MessageSquare, ShieldCheck } from 'lucide-react'
import api from '@/lib/api'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog'
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from '@/components/ui/alert-dialog'

const AVATAR_COLORS = [
  'bg-teal-500', 'bg-orange-500', 'bg-emerald-500',
  'bg-purple-500', 'bg-blue-500', 'bg-rose-500',
]

const addReviewSchema = z.object({
  patientName: z.string().min(1, 'Name required'),
  rating: z.number().min(1).max(5),
  text: z.string().min(5, 'Review text required'),
  condition: z.string().optional().or(z.literal('')),
  consultationType: z.enum(['in-person', 'online', 'home-visit']),
  isVerified: z.boolean(),
  isApproved: z.boolean(),
})

type AddReviewForm = z.infer<typeof addReviewSchema>

interface Props {
  doctorId: string
}

export function DoctorReviewsList({ doctorId }: Props) {
  const queryClient = useQueryClient()
  const [addOpen, setAddOpen] = useState(false)
  const [deleteId, setDeleteId] = useState<string | null>(null)

  const { data: reviews = [], isLoading } = useQuery({
    queryKey: ['doctor-reviews-admin', doctorId],
    queryFn: async () => {
      const res = await api.get(`/doctors/${doctorId}/reviews`, {
        params: { includeAll: true, limit: 100 },
      })
      return res.data?.data || res.data || []
    },
  })

  const deleteMutation = useMutation({
    mutationFn: (reviewId: string) =>
      api.delete(`/doctors/${doctorId}/reviews/${reviewId}`),
    onSuccess: () => {
      toast.success('Review deleted')
      queryClient.invalidateQueries({ queryKey: ['doctor-reviews-admin', doctorId] })
      queryClient.invalidateQueries({ queryKey: ['doctor', doctorId] })
      setDeleteId(null)
    },
    onError: () => toast.error('Failed to delete review'),
  })

  const toggleMutation = useMutation({
    mutationFn: ({ reviewId, patch }: { reviewId: string; patch: Record<string, boolean> }) =>
      api.patch(`/doctors/${doctorId}/reviews/${reviewId}`, patch),
    onSuccess: () => {
      toast.success('Review updated')
      queryClient.invalidateQueries({ queryKey: ['doctor-reviews-admin', doctorId] })
      queryClient.invalidateQueries({ queryKey: ['doctor', doctorId] })
    },
    onError: () => toast.error('Failed to update review'),
  })

  const form = useForm<AddReviewForm>({
    resolver: zodResolver(addReviewSchema),
    defaultValues: {
      patientName: '',
      rating: 5,
      text: '',
      condition: '',
      consultationType: 'in-person',
      isVerified: true,
      isApproved: true,
    },
  })

  const addMutation = useMutation({
    mutationFn: (values: AddReviewForm) =>
      api.post(`/doctors/${doctorId}/reviews`, values),
    onSuccess: () => {
      toast.success('Review added')
      queryClient.invalidateQueries({ queryKey: ['doctor-reviews-admin', doctorId] })
      queryClient.invalidateQueries({ queryKey: ['doctor', doctorId] })
      setAddOpen(false)
      form.reset()
    },
    onError: () => toast.error('Failed to add review'),
  })

  const totalCount = reviews.length
  const approvedCount = reviews.filter((r: any) => r.isApproved).length
  const avgRating =
    reviews.length > 0
      ? (reviews.reduce((s: number, r: any) => s + r.rating, 0) / reviews.length).toFixed(1)
      : '—'

  return (
    <>
      <Card>
        <CardHeader>
          <div className='flex items-center justify-between'>
            <CardTitle className='flex items-center gap-2'>
              <MessageSquare size={20} className='text-primary' />
              Patient Reviews
              <Badge variant='secondary' className='ml-1'>{totalCount}</Badge>
            </CardTitle>
            <div className='flex items-center gap-3'>
              <span className='text-sm text-muted-foreground'>
                {approvedCount}/{totalCount} approved · Avg {avgRating} ★
              </span>
              <Button size='sm' onClick={() => setAddOpen(true)}>
                <Plus size={14} className='mr-1' /> Add Review
              </Button>
            </div>
          </div>
        </CardHeader>

        <CardContent>
          {isLoading ? (
            <div className='space-y-3'>
              {[1, 2, 3].map(i => (
                <div key={i} className='h-20 animate-pulse rounded-xl bg-muted' />
              ))}
            </div>
          ) : reviews.length === 0 ? (
            <div className='flex h-32 flex-col items-center justify-center gap-2 rounded-xl border-2 border-dashed border-muted-foreground/20 text-muted-foreground'>
              <MessageSquare size={32} className='opacity-30' />
              <p className='text-sm'>No reviews yet</p>
            </div>
          ) : (
            <div className='space-y-3'>
              {reviews.map((review: any, idx: number) => (
                <div
                  key={review._id}
                  className='flex gap-4 rounded-xl border bg-card p-4 transition-colors hover:bg-muted/30'
                >
                  {/* Avatar */}
                  <div className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-full text-sm font-bold text-white ${AVATAR_COLORS[idx % AVATAR_COLORS.length]}`}>
                    {review.patientInitials || review.patientName?.slice(0, 2).toUpperCase() || '??'}
                  </div>

                  {/* Content */}
                  <div className='min-w-0 flex-1 space-y-1.5'>
                    <div className='flex flex-wrap items-center gap-2'>
                      <span className='text-sm font-semibold'>{review.patientName}</span>
                      {/* Stars */}
                      <div className='flex items-center gap-0.5'>
                        {Array.from({ length: 5 }).map((_, i) => (
                          <Star
                            key={i}
                            size={12}
                            className={i < review.rating ? 'fill-amber-400 text-amber-400' : 'text-muted-foreground/20'}
                          />
                        ))}
                      </div>
                      <Badge variant={review.isApproved ? 'default' : 'destructive'} className='text-[10px] px-1.5 py-0'>
                        {review.isApproved ? 'Approved' : 'Pending'}
                      </Badge>
                      {review.isVerified && (
                        <Badge variant='outline' className='text-[10px] px-1.5 py-0 text-teal-500 border-teal-500/30'>
                          <ShieldCheck size={10} className='mr-0.5' /> Verified
                        </Badge>
                      )}
                      <Badge variant='outline' className='text-[10px] px-1.5 py-0 capitalize'>
                        {review.consultationType?.replace('-', ' ')}
                      </Badge>
                      {review.condition && (
                        <span className='text-[11px] text-muted-foreground'>· {review.condition}</span>
                      )}
                      <span className='ml-auto text-[11px] text-muted-foreground'>
                        {review.createdAt ? new Date(review.createdAt).toLocaleDateString() : ''}
                      </span>
                    </div>
                    <p className='text-sm text-muted-foreground line-clamp-2'>{review.text}</p>
                  </div>

                  {/* Actions */}
                  <div className='flex shrink-0 flex-col gap-1.5'>
                    <Button
                      size='icon'
                      variant='ghost'
                      className='h-7 w-7'
                      title={review.isApproved ? 'Unapprove' : 'Approve'}
                      onClick={() =>
                        toggleMutation.mutate({
                          reviewId: review._id,
                          patch: { isApproved: !review.isApproved },
                        })
                      }
                    >
                      {review.isApproved ? (
                        <XCircle size={15} className='text-destructive' />
                      ) : (
                        <CheckCircle size={15} className='text-emerald-500' />
                      )}
                    </Button>
                    <Button
                      size='icon'
                      variant='ghost'
                      className='h-7 w-7'
                      title={review.isVerified ? 'Unverify' : 'Verify patient'}
                      onClick={() =>
                        toggleMutation.mutate({
                          reviewId: review._id,
                          patch: { isVerified: !review.isVerified },
                        })
                      }
                    >
                      <ShieldCheck size={15} className={review.isVerified ? 'text-teal-500' : 'text-muted-foreground'} />
                    </Button>
                    <Button
                      size='icon'
                      variant='ghost'
                      className='h-7 w-7 text-destructive hover:text-destructive'
                      title='Delete'
                      onClick={() => setDeleteId(review._id)}
                    >
                      <Trash2 size={15} />
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Add Review Dialog */}
      <Dialog open={addOpen} onOpenChange={setAddOpen}>
        <DialogContent className='sm:max-w-lg max-h-[90vh] flex flex-col'>
          <DialogHeader>
            <DialogTitle>Add Review</DialogTitle>
          </DialogHeader>
          <Form {...form}>
            <form
              id='add-review-form'
              onSubmit={form.handleSubmit((v) => addMutation.mutate(v))}
              className='flex-1 overflow-y-auto space-y-4 px-1 py-2'
            >
              <FormField
                control={form.control}
                name='patientName'
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Patient Name</FormLabel>
                    <FormControl><Input placeholder='John Doe' {...field} /></FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name='rating'
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Rating (1–5)</FormLabel>
                    <FormControl>
                      <Input
                        type='number'
                        min={1}
                        max={5}
                        value={field.value}
                        onChange={(e) => field.onChange(Number(e.target.value))}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name='text'
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Review Text</FormLabel>
                    <FormControl>
                      <Textarea placeholder='Patient review...' className='min-h-[80px]' {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name='condition'
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Condition (optional)</FormLabel>
                    <FormControl><Input placeholder='e.g. Heart Disease' {...field} /></FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name='consultationType'
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Consultation Type</FormLabel>
                    <Select onValueChange={field.onChange} value={field.value}>
                      <FormControl>
                        <SelectTrigger><SelectValue /></SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value='in-person'>In-Person</SelectItem>
                        <SelectItem value='online'>Online</SelectItem>
                        <SelectItem value='home-visit'>Home Visit</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <div className='flex gap-4'>
                <FormField
                  control={form.control}
                  name='isApproved'
                  render={({ field }) => (
                    <FormItem className='flex items-center gap-2 space-y-0'>
                      <FormControl>
                        <input
                          type='checkbox'
                          checked={field.value}
                          onChange={(e) => field.onChange(e.target.checked)}
                          className='h-4 w-4 accent-primary'
                        />
                      </FormControl>
                      <FormLabel className='font-normal'>Approved</FormLabel>
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name='isVerified'
                  render={({ field }) => (
                    <FormItem className='flex items-center gap-2 space-y-0'>
                      <FormControl>
                        <input
                          type='checkbox'
                          checked={field.value}
                          onChange={(e) => field.onChange(e.target.checked)}
                          className='h-4 w-4 accent-primary'
                        />
                      </FormControl>
                      <FormLabel className='font-normal'>Verified Patient</FormLabel>
                    </FormItem>
                  )}
                />
              </div>
            </form>
          </Form>
          <DialogFooter className='border-t pt-4'>
            <Button variant='outline' onClick={() => setAddOpen(false)}>Cancel</Button>
            <Button type='submit' form='add-review-form' disabled={addMutation.isPending}>
              {addMutation.isPending ? 'Adding...' : 'Add Review'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Delete Confirm */}
      <AlertDialog open={!!deleteId} onOpenChange={(o) => !o && setDeleteId(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete this review?</AlertDialogTitle>
            <AlertDialogDescription>
              This action cannot be undone. The doctor's rating will be recalculated.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              className='bg-destructive text-destructive-foreground hover:bg-destructive/90'
              onClick={() => deleteId && deleteMutation.mutate(deleteId)}
            >
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  )
}
