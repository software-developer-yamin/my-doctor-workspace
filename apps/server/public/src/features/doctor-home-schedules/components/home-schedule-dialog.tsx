import { useState, useEffect } from 'react'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { Plus, Trash2, Clock, Calendar, Home, DollarSign } from 'lucide-react'
import { toast } from 'sonner'
import api from '@/lib/api'
import { useQueryClient, useQuery } from '@tanstack/react-query'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'

const DAYS = [
  'Saturday', 'Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'
]

interface HomeScheduleDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  doctor: any
}

export function HomeScheduleDialog({ open, onOpenChange, doctor }: HomeScheduleDialogProps) {
  const queryClient = useQueryClient()
  const [schedules, setSchedules] = useState<any[]>([])
  const [homeVisitFee, setHomeVisitFee] = useState<string>('')
  const [followUpFee, setFollowUpFee] = useState<string>('')
  const [loading, setLoading] = useState(false)

  // Fetch existing home schedule for this doctor
  const { data: existingData } = useQuery({
    queryKey: ['doctor-home-schedules', doctor?._id],
    queryFn: async () => {
      if (!doctor?._id) return null
      const res = await api.get(`/doctor-home-schedules/doctor/${doctor._id}`)
      return res.data?.data ?? res.data
    },
    enabled: !!doctor?._id && open
  })

  useEffect(() => {
    if (existingData?.schedules) {
      setSchedules(existingData.schedules)
    } else {
      setSchedules([])
    }
    setHomeVisitFee(
      existingData?.homeVisitFee != null ? String(existingData.homeVisitFee) : ''
    )
    setFollowUpFee(
      existingData?.followUpFee != null ? String(existingData.followUpFee) : ''
    )
  }, [existingData, open])

  const handleAddSlot = () => {
    setSchedules([
      ...schedules,
      { day: 'Saturday', startTime: '09:00', endTime: '13:00', isAvailable: true }
    ])
  }

  const handleRemoveSlot = (index: number) => {
    setSchedules(schedules.filter((_, i) => i !== index))
  }

  const handleUpdateSlot = (index: number, field: string, value: any) => {
    const newSchedules = [...schedules]
    newSchedules[index] = { ...newSchedules[index], [field]: value }
    setSchedules(newSchedules)
  }

  const handleSave = async () => {
    if (!doctor?._id) return

    const feeValue = Number(homeVisitFee)
    if (homeVisitFee === '' || Number.isNaN(feeValue) || feeValue < 0) {
      toast.error('Please enter a valid home visit fee')
      return
    }

    const followUp = followUpFee === '' ? undefined : Number(followUpFee)
    if (followUp !== undefined && (Number.isNaN(followUp) || followUp < 0)) {
      toast.error('Please enter a valid follow-up fee')
      return
    }

    setLoading(true)
    try {
      await api.post('/doctor-home-schedules', {
        doctor: doctor._id,
        homeVisitFee: feeValue,
        followUpFee: followUp,
        schedules
      })
      toast.success('Home schedule updated successfully')
      queryClient.invalidateQueries({ queryKey: ['doctor-home-schedules'] })
      onOpenChange(false)
    } catch (e) {
      toast.error('Failed to save home schedule')
    } finally {
      setLoading(false)
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-2xl max-h-[85vh] flex flex-col">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Home className="h-5 w-5 text-primary" />
            Home Service Slots: {doctor?.name}
          </DialogTitle>
          <DialogDescription>
            Configure the specific weekdays and time ranges when this doctor is available for house calls.
          </DialogDescription>
        </DialogHeader>

        <div className="flex-1 overflow-y-auto py-4 space-y-6 pr-2">
          {/* Fees */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 p-4 rounded-lg border border-primary/20 bg-primary/5">
            <div className="space-y-2">
              <Label htmlFor="homeVisitFee" className="text-xs font-semibold uppercase tracking-wider text-muted-foreground flex items-center gap-1.5">
                <DollarSign size={12} /> Home Visit Fee <span className="text-destructive">*</span>
              </Label>
              <Input
                id="homeVisitFee"
                type="number"
                min={0}
                value={homeVisitFee}
                onChange={(e) => setHomeVisitFee(e.target.value)}
                placeholder="e.g. 1500"
                className="bg-background/50"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="homeFollowUpFee" className="text-xs font-semibold uppercase tracking-wider text-muted-foreground flex items-center gap-1.5">
                <DollarSign size={12} /> Follow-up Fee
                <span className="text-[10px] font-normal normal-case tracking-normal">(optional)</span>
              </Label>
              <Input
                id="homeFollowUpFee"
                type="number"
                min={0}
                value={followUpFee}
                onChange={(e) => setFollowUpFee(e.target.value)}
                placeholder="e.g. 1000"
                className="bg-background/50"
              />
            </div>
          </div>

          {schedules.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-12 border-2 border-dashed rounded-xl bg-muted/20">
              <Calendar className="h-12 w-12 text-muted-foreground/30 mb-2" />
              <p className="text-sm text-muted-foreground">No available slots defined.</p>
              <Button 
                variant="outline" 
                size="sm" 
                className="mt-4" 
                onClick={handleAddSlot}
              >
                <Plus className="mr-2 h-4 w-4" /> Add First Slot
              </Button>
            </div>
          ) : (
            <div className="space-y-3">
               {schedules.map((slot, index) => (
                <div key={index} className="flex flex-wrap items-end gap-4 p-4 rounded-lg bg-black/10 border border-white/5 relative group transition-all hover:border-primary/20">
                  <div className="flex-1 min-w-[150px] space-y-2">
                    <Label className="text-xs font-semibold uppercase tracking-wider text-muted-foreground flex items-center gap-1.5">
                      <Calendar size={12} /> Day of Week
                    </Label>
                    <Select 
                      value={slot.day} 
                      onValueChange={(v) => handleUpdateSlot(index, 'day', v)}
                    >
                      <SelectTrigger className="bg-background/50">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        {DAYS.map(day => (
                          <SelectItem key={day} value={day}>{day}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="w-[120px] space-y-2">
                    <Label className="text-xs font-semibold uppercase tracking-wider text-muted-foreground flex items-center gap-1.5">
                      <Clock size={12} /> Start Time
                    </Label>
                    <Input 
                      type="time" 
                      className="bg-background/50"
                      value={slot.startTime}
                      onChange={(e) => handleUpdateSlot(index, 'startTime', e.target.value)}
                    />
                  </div>

                  <div className="w-[120px] space-y-2">
                    <Label className="text-xs font-semibold uppercase tracking-wider text-muted-foreground flex items-center gap-1.5">
                      <Clock size={12} /> End Time
                    </Label>
                    <Input 
                      type="time" 
                      className="bg-background/50"
                      value={slot.endTime}
                      onChange={(e) => handleUpdateSlot(index, 'endTime', e.target.value)}
                    />
                  </div>

                  <Button 
                    variant="ghost" 
                    size="icon" 
                    className="text-destructive hover:bg-destructive/10 shrink-0"
                    onClick={() => handleRemoveSlot(index)}
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              ))}

              <Button 
                variant="outline" 
                className="w-full border-dashed hover:bg-primary/5 py-6" 
                onClick={handleAddSlot}
              >
                <Plus className="mr-2 h-4 w-4" /> Add Another Availability Slot
              </Button>
            </div>
          )}
        </div>

        <DialogFooter className="border-t pt-4">
          <Button variant="outline" onClick={() => onOpenChange(false)}>Cancel</Button>
          <Button 
            onClick={handleSave} 
            disabled={loading}
            className="px-8 font-bold"
          >
            {loading ? 'Saving...' : 'Save Configuration'}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
