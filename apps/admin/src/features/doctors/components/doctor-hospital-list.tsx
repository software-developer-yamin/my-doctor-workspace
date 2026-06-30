import { useQuery } from '@tanstack/react-query'
import api, { SERVER_URL } from '@/lib/api'
import { Card, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Calendar, Clock, MapPin, Building2 } from 'lucide-react'
import { Separator } from '@/components/ui/separator'

import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'

interface DoctorHospitalListProps {
  doctorId: string
}

export function DoctorHospitalList({ doctorId }: DoctorHospitalListProps) {
  const { data: assignments = [], isLoading } = useQuery({
    queryKey: ['doctor-schedules', doctorId],
    queryFn: async () => {
      const res = await api.get(`/doctor-schedules?doctorId=${doctorId}`)
      return Array.isArray(res.data) ? res.data : res.data?.data ?? []
    }
  })

  if (isLoading) return <div>Loading schedules...</div>

  return (
    <div className='space-y-6'>
      <div className='flex items-center gap-2'>
        <Building2 className='text-primary' size={24} />
        <h3 className='text-2xl font-bold'>Hospital Availability</h3>
      </div>

      <div className='grid grid-cols-1 gap-6'>
        {assignments.length > 0 ? assignments.map((item: any) => (
          <Card key={item._id} className='relative overflow-hidden border-white/5 shadow-2xl bg-black/40 group transition-all hover:bg-black/60'>
            <div className='flex flex-col md:flex-row'>
              {/* Hospital Info Side */}
              <div className='md:w-1/3 p-8 flex flex-col items-center justify-center text-center space-y-4'>
                <Avatar className='h-24 w-24 rounded-2xl border-2 border-white/10 shadow-xl group-hover:scale-105 transition-transform'>
                   <AvatarImage src={item.hospital.logo ? `${SERVER_URL}${item.hospital.logo}` : ''} />
                   <AvatarFallback className='text-2xl bg-primary/20 text-primary rounded-2xl'>
                      {item.hospital.name.substring(0, 2).toUpperCase()}
                   </AvatarFallback>
                </Avatar>
                <div className='space-y-2 w-full'>
                   <CardTitle className='text-xl font-black tracking-tight text-white'>{item.hospital.name}</CardTitle>
                   <div className='flex items-center justify-center gap-2 text-xs text-muted-foreground'>
                      <MapPin size={14} className='text-primary' />
                      <span className='truncate max-w-[200px]'>{item.hospital.address}</span>
                   </div>
                </div>
              </div>

              <Separator orientation='vertical' className='hidden md:block h-auto my-8 bg-white/5' />

              {/* Schedule Side */}
              <div className='flex-1 p-8 space-y-4'>
                <div className='flex items-center gap-2 mb-2'>
                  <Calendar className='text-primary' size={18} />
                  <span className='text-sm font-bold uppercase tracking-widest text-muted-foreground'>Shift Timings</span>
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

                {item.consultationTypes?.length > 0 && (
                  <div className='flex flex-wrap items-center gap-2 mt-4'>
                    <span className='text-xs font-semibold uppercase tracking-widest text-muted-foreground mr-1'>Consultation Types:</span>
                    {item.consultationTypes.map((type: string, idx: number) => (
                      <Badge key={idx} variant='outline' className='text-xs text-teal-400 border-teal-400/30'>{type}</Badge>
                    ))}
                  </div>
                )}

                {item.appointmentTypes?.length > 0 && (
                  <div className='flex flex-wrap items-center gap-2 mt-2'>
                    <span className='text-xs font-semibold uppercase tracking-widest text-muted-foreground mr-1'>Appointment Types:</span>
                    {item.appointmentTypes.map((type: string, idx: number) => (
                      <Badge key={idx} variant='outline' className='text-xs'>{type}</Badge>
                    ))}
                  </div>
                )}

                {(item.consultationFee != null || item.followUpFee != null) && (
                  <div className='flex flex-wrap items-center gap-4 mt-2 text-sm'>
                    <span className='text-xs font-semibold uppercase tracking-widest text-muted-foreground'>Fees:</span>
                    {item.consultationFee != null && (
                      <span className='text-muted-foreground'>Consultation: <span className='font-medium text-foreground'>৳{item.consultationFee}</span></span>
                    )}
                    {item.followUpFee != null && (
                      <span className='text-muted-foreground'>Follow-up: <span className='font-medium text-foreground'>৳{item.followUpFee}</span></span>
                    )}
                  </div>
                )}

                {item.avgWaitingTime != null && (
                  <div className='flex items-center gap-2 mt-2 text-sm'>
                    <Clock size={14} className='text-muted-foreground' />
                    <span className='text-muted-foreground'>Avg. Waiting Time: <span className='font-medium text-foreground'>{item.avgWaitingTime} min</span></span>
                  </div>
                )}
              </div>
            </div>
          </Card>
        )) : (
          <div className='col-span-full h-48 flex flex-col items-center justify-center text-muted-foreground border-2 border-dashed border-primary/10 rounded-3xl bg-primary/[0.01]'>
            <Building2 size={48} className='mb-4 opacity-10' />
            <p className='text-lg font-medium opacity-40'>This doctor is not currently assigned to any hospital.</p>
          </div>
        )}
      </div>
    </div>
  )
}
