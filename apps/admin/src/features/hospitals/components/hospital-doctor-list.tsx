import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Button } from '@/components/ui/button'
import { Card, CardTitle } from '@/components/ui/card'
import { Checkbox } from '@/components/ui/checkbox'
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from '@/components/ui/command'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover'
import { Separator } from '@/components/ui/separator'
import api, { SERVER_URL } from '@/lib/api'
import { cn } from '@/lib/utils'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import {
  Calendar,
  Check,
  ChevronsUpDown,
  Clock,
  DollarSign,
  Edit2,
  Plus,
  Trash2,
  ToggleLeft,
} from 'lucide-react'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { useState } from 'react'
import { toast } from 'sonner'
import { SimplePagination } from '@/components/simple-pagination'




const DAYS = ['Saturday', 'Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday']

interface HospitalDoctorListProps {
  hospitalId: string
  paginated?: boolean
}

export function HospitalDoctorList({ hospitalId, paginated = false }: HospitalDoctorListProps) {
  const queryClient = useQueryClient()
  const [open, setOpen] = useState(false)
  const [doctorPickerOpen, setDoctorPickerOpen] = useState(false)
  const [doctorSearch, setDoctorSearch] = useState('')
  const [selectedDoctorId, setSelectedDoctorId] = useState('')
  const [consultationFee, setConsultationFee] = useState<string>('')
  const [followUpFee, setFollowUpFee] = useState<string>('')
  const [schedules, setSchedules] = useState<any[]>(
    DAYS.map(day => ({
      day,
      startTime: '09:00',
      endTime: '17:00',
      isAvailable: false
    }))
  )
  const [status, setStatus] = useState<'Active' | 'Inactive'>('Active')
  const [consultationTypes, setConsultationTypes] = useState<string[]>([])
  const [languages, setLanguages] = useState<string[]>([])
  const [editId, setEditId] = useState<string | null>(null)

  const CONSULTATION_TYPE_OPTIONS = ['In-person', 'Video Consultation', 'Home Visit']
  const [page, setPage] = useState(1)
  const [limit, setLimit] = useState(10)

  const { data: assignmentsData } = useQuery({
    queryKey: ['doctor-schedules', hospitalId, page, limit],
    queryFn: async () => {
      const params = new URLSearchParams({
        hospitalId,
        page: String(page),
        limit: String(limit),
      })
      const res = await api.get(`/doctor-schedules?${params.toString()}`)
      return res.data
    }
  })

  const assignments = Array.isArray(assignmentsData) ? assignmentsData : (assignmentsData as any)?.data || []
  const metadata = (assignmentsData as any)?._meta || (assignmentsData as any)?.meta || { total: 0, page: 1, limit, totalPages: 1 }

  const { data: doctorsResponse } = useQuery({
    queryKey: ['doctors', 'assign-picker', doctorSearch],
    queryFn: async () => {
      const params = new URLSearchParams({ limit: '200' })
      if (doctorSearch.trim()) params.append('search', doctorSearch.trim())
      const res = await api.get(`/doctors?${params.toString()}`)
      return res.data
    },
    enabled: open,
  })

  const allDoctors = Array.isArray(doctorsResponse) ? doctorsResponse : (doctorsResponse as any)?.data || []

  // Filter out doctors already assigned (only when adding new)
  const availableDoctors = allDoctors.filter((doc: any) =>
    !assignments.some((a: any) => a.doctor._id === doc._id) || (editId && assignments.find((a: any) => a._id === editId)?.doctor._id === doc._id)
  )

  const saveMutation = useMutation({
    mutationFn: (payload: any) => {
      if (editId) {
        return api.patch(`/doctor-schedules/${editId}`, payload)
      }
      return api.post('/doctor-schedules', payload)
    },
    onSuccess: () => {
      toast.success(editId ? 'Schedule updated' : 'Doctor assigned')
      setOpen(false)
      resetForm()
      queryClient.invalidateQueries({ queryKey: ['doctor-schedules', hospitalId] })
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.message || 'Operation failed')
    }
  })

  const deleteMutation = useMutation({
    mutationFn: (id: string) => api.delete(`/doctor-schedules/${id}`),
    onSuccess: () => {
      toast.success('Assignment removed')
      queryClient.invalidateQueries({ queryKey: ['doctor-schedules', hospitalId] })
    },
    onError: () => {
      toast.error('Failed to remove assignment')
    }
  })

  const resetForm = () => {
    setSelectedDoctorId('')
    setConsultationFee('')
    setFollowUpFee('')
    setStatus('Active')
    setConsultationTypes([])
    setLanguages([])
    setSchedules(DAYS.map(day => ({
      day,
      startTime: '09:00',
      endTime: '17:00',
      isAvailable: false
    })))
    setEditId(null)
  }

  const handleEdit = (assignment: any) => {
    setEditId(assignment._id)
    setSelectedDoctorId(assignment.doctor._id)
    setConsultationFee(assignment.consultationFee != null ? String(assignment.consultationFee) : '')
    setFollowUpFee(assignment.followUpFee != null ? String(assignment.followUpFee) : '')
    setStatus(assignment.status || 'Active')
    setConsultationTypes(Array.isArray(assignment.consultationTypes) ? assignment.consultationTypes : [])
    setLanguages(assignment.languages || [])

    // Map existing schedules back to the form state
    const newSchedules = DAYS.map(day => {
      const existing = assignment.schedules.find((s: any) => s.day === day)
      return existing ? {
        day: existing.day,
        startTime: existing.startTime,
        endTime: existing.endTime,
        isAvailable: existing.isAvailable
      } : {
        day,
        startTime: '09:00',
        endTime: '17:00',
        isAvailable: false
      }
    })
    setSchedules(newSchedules)
    setOpen(true)
  }

  const handleSubmit = () => {
    if (!selectedDoctorId) {
      return toast.error('Please select a doctor')
    }

    const feeValue = Number(consultationFee)
    if (!consultationFee || Number.isNaN(feeValue) || feeValue < 0) {
      return toast.error('Please enter a valid consultation fee')
    }

    const followUp = followUpFee === '' ? undefined : Number(followUpFee)
    if (followUp !== undefined && (Number.isNaN(followUp) || followUp < 0)) {
      return toast.error('Please enter a valid follow-up fee')
    }

    const activeSchedules = schedules.filter(s => s.isAvailable)
    if (activeSchedules.length === 0) {
       return toast.error('Please select at least one day')
    }

    saveMutation.mutate({
      doctor: selectedDoctorId,
      hospital: hospitalId,
      consultationFee: feeValue,
      followUpFee: followUp,
      schedules: activeSchedules,
      status,
      consultationTypes,
      languages,
    })
  }

  const selectedDoctor = availableDoctors.find((d: any) => d._id === selectedDoctorId)
    || (editId ? assignments.find((a: any) => a._id === editId)?.doctor : undefined)

  const filteredDoctors = availableDoctors

  const toggleDay = (index: number) => {
    const newSchedules = [...schedules]
    newSchedules[index].isAvailable = !newSchedules[index].isAvailable
    setSchedules(newSchedules)
  }

  const updateTime = (index: number, field: 'startTime' | 'endTime', value: string) => {
    const newSchedules = [...schedules]
    newSchedules[index][field] = value
    setSchedules(newSchedules)
  }

  return (
    <div className='space-y-6'>
      <div className='flex items-center justify-between'>
        <div className='flex items-center gap-2'>
           <Clock className='text-primary' size={24} />
           <h3 className='text-2xl font-bold'>Team & Schedules</h3>
           {paginated && metadata.total > 0 && (
             <span className='text-sm text-muted-foreground'>({metadata.total} total)</span>
           )}
        </div>
        <Button onClick={() => { resetForm(); setOpen(true); }}>
          <Plus className='mr-2' size={18} /> Assign Doctor
        </Button>
      </div>

      <div className='grid grid-cols-1 gap-6'>
        {assignments.length > 0 ? assignments.map((item: any) => (
          <Card key={item._id} className='relative overflow-hidden border-white/5 shadow-2xl bg-black/40 group transition-all hover:bg-black/60'>
             {/* Action Buttons - Absolute Top Right */}
             <div className='absolute top-4 right-4 flex gap-1 z-20 opacity-0 group-hover:opacity-100 transition-opacity'>
                <Button variant='ghost' size='icon' className='h-8 w-8 rounded-full bg-white/5 hover:bg-primary/20 hover:text-primary backdrop-blur-md' onClick={() => handleEdit(item)}>
                    <Edit2 size={14} />
                </Button>
                <Button variant='ghost' size='icon' className='h-8 w-8 rounded-full bg-white/5 hover:bg-red-500/20 hover:text-red-400 backdrop-blur-md' onClick={() => { if(window.confirm('Remove this doctor?')) deleteMutation.mutate(item._id) }}>
                    <Trash2 size={14} />
                </Button>
             </div>

             <div className='flex flex-col md:flex-row'>
                {/* Doctor Profile Side - Simplified */}
                <div className='md:w-1/3 p-8 flex flex-col items-center justify-center text-center space-y-6'>
                    <div className='relative'>
                        <Avatar className='h-28 w-28 border-2 border-white/10 shadow-2xl transition-transform group-hover:scale-105'>
                            <AvatarImage src={item.doctor.photo ? `${SERVER_URL}${item.doctor.photo}` : ''} />
                            <AvatarFallback className='text-3xl bg-primary/20 text-primary'>{(item.doctor.name ?? '??').substring(0, 2).toUpperCase()}</AvatarFallback>
                        </Avatar>
                        <div className={`absolute bottom-1 right-1 h-7 w-7 border-4 border-[#0c0f17] rounded-full shadow-lg ${item.status === 'Inactive' ? 'bg-red-500' : 'bg-emerald-500'}`} title={item.status || 'Active'} />
                    </div>
                    <div className='space-y-4 w-full'>
                        <div className='space-y-1'>
                            <CardTitle className='text-2xl font-black tracking-tight text-white'>{item.doctor.name}</CardTitle>
                            <p className='text-xs font-bold text-primary/60 uppercase tracking-widest'>{item.doctor.degrees}</p>
                        </div>
                        
                        {/* Specializations Tags */}
                        <div className='flex flex-wrap justify-center gap-1.5'>
                            {item.doctor.specializations?.map((spec: any) => (
                                <div key={spec._id} className='px-2 py-0.5 rounded-md bg-white/5 border border-white/10 text-[10px] font-bold text-muted-foreground uppercase tracking-tighter'>
                                    {spec.name}
                                </div>
                            ))}
                        </div>
                    </div>
                </div>

                <Separator orientation='vertical' className='hidden md:block h-auto my-8 bg-white/5' />

                {/* Schedule Side */}
                <div className='flex-1 p-8 space-y-4'>
                    {/* Fees */}
                    <div className='flex flex-wrap gap-3'>
                        <div className='flex items-center gap-3 px-4 py-2.5 rounded-2xl bg-primary/10 border border-primary/20'>
                            <DollarSign size={16} className='text-primary' />
                            <div className='flex flex-col leading-tight'>
                                <span className='text-[10px] font-bold uppercase tracking-wider text-primary/70'>Consultation</span>
                                <span className='text-sm font-bold text-primary'>৳ {item.consultationFee ?? 0}</span>
                            </div>
                        </div>
                        {item.followUpFee != null && item.followUpFee !== '' && (
                            <div className='flex items-center gap-3 px-4 py-2.5 rounded-2xl bg-white/[0.03] border border-white/5'>
                                <DollarSign size={16} className='text-muted-foreground' />
                                <div className='flex flex-col leading-tight'>
                                    <span className='text-[10px] font-bold uppercase tracking-wider text-muted-foreground'>Follow-up</span>
                                    <span className='text-sm font-bold'>৳ {item.followUpFee}</span>
                                </div>
                            </div>
                        )}
                    </div>

                    <div className='flex items-center gap-2 mb-2 pt-2'>
                         <Calendar className='text-primary' size={18} />
                         <span className='text-sm font-bold uppercase tracking-widest text-muted-foreground'>Weekly Availability</span>
                    </div>
                    <div className='grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3'>
                        {item.schedules.map((s: any, idx: number) => (
                            <div key={idx} className='flex flex-col gap-1 p-3 rounded-2xl bg-white/[0.03] border border-white/5 hover:border-primary/20 transition-colors'>
                                <span className='text-xs font-bold uppercase text-primary/60 tracking-tighter'>{s.day}</span>
                                <div className='flex items-center gap-2 text-sm font-medium'>
                                    <Clock size={14} className='text-muted-foreground' />
                                    <span>{s.startTime} - {s.endTime}</span>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
             </div>
          </Card>
        )) : (
          <div className='col-span-full h-48 flex flex-col items-center justify-center text-muted-foreground border-2 border-dashed border-primary/10 rounded-3xl bg-primary/[0.01]'>
             <Calendar size={48} className='mb-4 opacity-10' />
             <p className='text-lg font-medium opacity-40'>No doctors assigned to this facility yet.</p>
          </div>
        )}
      </div>

      {paginated && (
        <SimplePagination
          metadata={metadata}
          onPageChange={setPage}
          onLimitChange={(l) => { setLimit(l); setPage(1); }}
        />
      )}

      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className='flex max-h-[90vh] flex-col gap-0 overflow-hidden p-0 sm:max-w-2xl'>
          <DialogHeader className='shrink-0 p-6 pb-4'>
            <DialogTitle>{editId ? 'Edit Assignment' : 'Assign Doctor to Hospital'}</DialogTitle>
            <DialogDescription>
              Select a doctor and set their available times for each day of the week.
            </DialogDescription>
          </DialogHeader>

          <div className='min-h-0 flex-1 space-y-6 overflow-x-hidden overflow-y-auto overscroll-contain p-6 pt-0'>
            <div className='space-y-2'>
              <Label>Select Doctor</Label>
              <Popover open={doctorPickerOpen} onOpenChange={setDoctorPickerOpen}>
                <PopoverTrigger asChild>
                  <Button
                    variant='outline'
                    role='combobox'
                    disabled={!!editId}
                    className={cn(
                      'w-full justify-between font-normal',
                      !selectedDoctor && 'text-muted-foreground'
                    )}
                  >
                    {selectedDoctor
                      ? `${selectedDoctor.name}${selectedDoctor.degrees ? ` - ${selectedDoctor.degrees}` : ''}`
                      : 'Search and select doctor'}
                    <ChevronsUpDown className='ml-2 h-4 w-4 shrink-0 opacity-50' />
                  </Button>
                </PopoverTrigger>
                <PopoverContent className='w-[var(--radix-popover-trigger-width)] p-0 z-[60]' align='start'>
                  <Command shouldFilter={false}>
                    <CommandInput
                      placeholder='Search by name, degrees, phone...'
                      value={doctorSearch}
                      onValueChange={setDoctorSearch}
                    />
                    <CommandList>
                      {filteredDoctors.length === 0 && (
                        <CommandEmpty>No doctors found.</CommandEmpty>
                      )}
                      <CommandGroup>
                        {filteredDoctors.map((doc: any) => {
                          return (
                            <CommandItem
                              key={doc._id}
                              value={doc._id}
                              onSelect={() => {
                                setSelectedDoctorId(doc._id)
                                setDoctorSearch('')
                                setDoctorPickerOpen(false)
                              }}
                              className='flex items-center gap-3'
                            >
                              <Avatar className='h-8 w-8 shrink-0'>
                                <AvatarImage src={doc.photo ? `${SERVER_URL}${doc.photo}` : ''} />
                                <AvatarFallback className='text-[10px]'>
                                  {doc.name?.substring(0, 2).toUpperCase()}
                                </AvatarFallback>
                              </Avatar>
                              <div className='flex min-w-0 flex-1 flex-col'>
                                <span className='truncate font-medium'>{doc.name}</span>
                                {doc.degrees && (
                                  <span className='truncate text-xs text-muted-foreground'>
                                    {doc.degrees}
                                  </span>
                                )}
                              </div>
                              <Check
                                className={cn(
                                  'h-4 w-4 shrink-0',
                                  selectedDoctorId === doc._id ? 'opacity-100' : 'opacity-0'
                                )}
                              />
                            </CommandItem>
                          )
                        })}
                      </CommandGroup>
                    </CommandList>
                  </Command>
                </PopoverContent>
              </Popover>
            </div>

            {/* Fees */}
            <div className='grid grid-cols-1 gap-4 sm:grid-cols-2'>
              <div className='space-y-2'>
                <Label htmlFor='consultationFee' className='flex items-center gap-1.5'>
                  <DollarSign size={14} className='text-primary' />
                  Consultation Fee <span className='text-destructive'>*</span>
                </Label>
                <Input
                  id='consultationFee'
                  type='number'
                  min={0}
                  value={consultationFee}
                  onChange={(e) => setConsultationFee(e.target.value)}
                  placeholder='e.g. 800'
                />
              </div>
              <div className='space-y-2'>
                <Label htmlFor='followUpFee' className='flex items-center gap-1.5'>
                  <DollarSign size={14} className='text-muted-foreground' />
                  Follow-up Fee
                  <span className='text-[10px] font-normal text-muted-foreground'>(optional)</span>
                </Label>
                <Input
                  id='followUpFee'
                  type='number'
                  min={0}
                  value={followUpFee}
                  onChange={(e) => setFollowUpFee(e.target.value)}
                  placeholder='e.g. 500'
                />
              </div>
            </div>

            {/* Status + Consultation Types */}
            <div className='grid grid-cols-1 gap-4 sm:grid-cols-2'>
              <div className='space-y-2'>
                <Label className='flex items-center gap-1.5'>
                  <ToggleLeft size={14} className='text-primary' /> Schedule Status
                </Label>
                <Select value={status} onValueChange={(v) => setStatus(v as 'Active' | 'Inactive')}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value='Active'>
                      <span className='flex items-center gap-2'>
                        <span className='h-2 w-2 rounded-full bg-emerald-500 inline-block' /> Active
                      </span>
                    </SelectItem>
                    <SelectItem value='Inactive'>
                      <span className='flex items-center gap-2'>
                        <span className='h-2 w-2 rounded-full bg-red-500 inline-block' /> Inactive
                      </span>
                    </SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className='space-y-2'>
                <Label>Consultation Types</Label>
                <div className='flex flex-col gap-1.5 rounded-md border px-3 py-2'>
                  {CONSULTATION_TYPE_OPTIONS.map(opt => (
                    <div key={opt} className='flex items-center gap-2'>
                      <Checkbox
                        id={`ct-${opt}`}
                        checked={consultationTypes.includes(opt)}
                        onCheckedChange={checked => {
                          setConsultationTypes(prev =>
                            checked ? [...prev, opt] : prev.filter(t => t !== opt)
                          )
                        }}
                      />
                      <Label htmlFor={`ct-${opt}`} className='text-sm font-normal cursor-pointer'>{opt}</Label>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            <div className='space-y-1'>
              <label className='text-sm font-medium'>Languages (comma separated)</label>
              <Input
                placeholder='English, Bengali, Hindi'
                value={languages.join(', ')}
                onChange={e => setLanguages(e.target.value.split(',').map(l => l.trim()).filter(Boolean))}
              />
            </div>

            <div className='space-y-4'>
              <Label>Weekly Schedule</Label>
              <div className='grid gap-3'>
                {schedules.map((s, idx) => (
                  <div key={s.day} className={`grid grid-cols-12 items-center gap-4 p-3 rounded-xl border transition-colors ${s.isAvailable ? 'bg-primary/5 border-primary/20' : 'bg-muted/30 border-transparent opacity-60'}`}>
                    <div className='col-span-3 flex items-center gap-3'>
                      <Checkbox
                        id={`day-${s.day}`}
                        checked={s.isAvailable}
                        onCheckedChange={() => toggleDay(idx)}
                      />
                      <Label htmlFor={`day-${s.day}`} className='font-bold cursor-pointer'>{s.day}</Label>
                    </div>

                    <div className='col-span-4 flex items-center gap-2'>
                       <span className='text-[10px] uppercase font-black text-muted-foreground'>From</span>
                       <Input
                        type='time'
                        disabled={!s.isAvailable}
                        value={s.startTime}
                        onChange={(e) => updateTime(idx, 'startTime', e.target.value)}
                        className='h-9 bg-background'
                       />
                    </div>

                    <div className='col-span-4 flex items-center gap-2'>
                       <span className='text-[10px] uppercase font-black text-muted-foreground'>To</span>
                       <Input
                        type='time'
                        disabled={!s.isAvailable}
                        value={s.endTime}
                        onChange={(e) => updateTime(idx, 'endTime', e.target.value)}
                        className='h-9 bg-background'
                       />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          <DialogFooter className='shrink-0 border-t p-4'>
            <Button variant='outline' onClick={() => setOpen(false)}>Cancel</Button>
            <Button onClick={handleSubmit} disabled={saveMutation.isPending}>
              {saveMutation.isPending ? 'Saving...' : editId ? 'Update Assignment' : 'Assign Doctor'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}
