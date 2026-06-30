'use client'

import { ConfigDrawer } from '@/components/config-drawer'
import { Header } from '@/components/layout/header'
import { Main } from '@/components/layout/main'
import { ProfileDropdown } from '@/components/profile-dropdown'
import { Search } from '@/components/search'
import { ThemeSwitch } from '@/components/theme-switch'
import { Badge } from '@/components/ui/badge'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Separator } from '@/components/ui/separator'
import { useQuery } from '@tanstack/react-query'
import { Link, useParams } from '@tanstack/react-router'
import { ArrowRight, Award, Calendar, Eye, Facebook, Globe, Info, Instagram, Linkedin, Mail, Map, MapPin, Phone, Target, Users, Youtube } from 'lucide-react'
import api, { SERVER_URL } from '@/lib/api'
import { Button } from '@/components/ui/button'


export function HospitalDetails() {
  const { id } = useParams({ from: '/_authenticated/hospitals/$id/' })
  
  const { data, isLoading } = useQuery({
    queryKey: ['hospital', id],
    queryFn: async () => {
      const res = await api.get(`/hospitals/${id}`)
      return res.data?.data ?? res.data
    }
  })

  if (isLoading) return <div>Loading...</div>
  if (!data) return <div>Facility not found</div>

  const socialLinks = [
    { icon: Facebook, url: data.facebook, color: 'text-blue-600', label: 'Facebook' },
    { icon: Youtube, url: data.youtube, color: 'text-red-600', label: 'YouTube' },
    { icon: Instagram, url: data.instagram, color: 'text-pink-600', label: 'Instagram' },
    { icon: Linkedin, url: data.linkedin, color: 'text-blue-700', label: 'LinkedIn' },
  ].filter(link => link.url)

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

      <Main className='flex flex-1 flex-col gap-6 p-6'>
        {/* Rounded Cover Photo Container */}
        <div className='relative h-[420px] w-full overflow-hidden bg-slate-950 group rounded-3xl shadow-2xl'>
          {data.cover_photo ? (
            <>
              <img
                src={`${SERVER_URL}${data.cover_photo}`}
                className='w-full h-full object-cover opacity-80'
                alt='Cover'
              />
              <div className='absolute inset-0 bg-slate-950/40' />
              <div className='absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/40 to-transparent' />
            </>
          ) : (
             <div className='w-full h-full bg-gradient-to-br from-blue-900 to-black' />
          )}

          <div className='absolute bottom-0 left-0 w-full p-10 flex items-end gap-8 z-10'>
             <div className='shrink-0'>
                 <div className='h-36 w-36 border-4 border-white/20 rounded-2xl overflow-hidden bg-white shadow-2xl transform transition-all hover:scale-105'>
                    {data.logo ? (
                      <img src={`${SERVER_URL}${data.logo}`} className='w-full h-full object-contain p-2' alt='Logo' />
                    ) : (
                      <div className='w-full h-full flex items-center justify-center bg-blue-50 text-4xl font-bold text-blue-700'>
                        {data.name.substring(0, 2).toUpperCase()}
                      </div>
                    )}
                 </div>
             </div>
             <div className='flex-1 pb-4'>
                <div className='space-y-4'>
                    <h2 className='text-5xl font-black tracking-tight text-white drop-shadow-2xl'>
                      {data.name}
                    </h2>

                    <div className='flex flex-wrap items-center gap-3'>
                        <div className='flex items-center gap-2 text-blue-50 font-semibold bg-white/10 backdrop-blur-md w-fit px-4 py-2 rounded-xl border border-white/20 shadow-lg'>
                           <MapPin size={20} className='text-blue-400' />
                           <span className='text-base'>{data.address}</span>
                        </div>

                        {/* Social Links on Header */}
                        <div className='flex gap-2'>
                            {socialLinks.map((link, i) => (
                                <a key={i} href={link.url} target='_blank' rel='noreferrer' className='h-10 w-10 flex items-center justify-center rounded-xl bg-white/10 backdrop-blur-md border border-white/20 text-white hover:bg-white hover:text-blue-900 transition-colors shadow-lg' title={link.label}>
                                    <link.icon size={20} />
                                </a>
                            ))}
                        </div>
                    </div>
                </div>
             </div>
          </div>
        </div>

        <div className='pb-12 space-y-10 relative z-20'>
           <div className='grid grid-cols-1 lg:grid-cols-3 gap-8'>
                {/* Info Card */}
                <Card className='lg:col-span-1 shadow-md border-primary/10 h-fit sticky top-20'>
                    <CardHeader className='pb-4'>
                        <CardTitle className='text-lg flex items-center gap-2'>
                            <Info size={18} className='text-primary' /> General Information
                        </CardTitle>
                    </CardHeader>
                    <CardContent className='space-y-6'>
                        <div className='space-y-4 text-sm'>
                            <div className='flex gap-3'>
                                <div className='h-8 w-8 rounded bg-primary/5 flex items-center justify-center text-primary shrink-0'><Phone size={16} /></div>
                                <div><p className='font-semibold text-xs uppercase text-muted-foreground'>Hotline</p><p className='text-base font-medium'>{data.hotline}</p></div>
                            </div>
                            <div className='flex gap-3'>
                                <div className='h-8 w-8 rounded bg-primary/5 flex items-center justify-center text-primary shrink-0'><Mail size={16} /></div>
                                <div><p className='font-semibold text-xs uppercase text-muted-foreground'>Email</p><p className='text-base font-medium'>{data.email}</p></div>
                            </div>
                             <div className='flex gap-3'>
                                <div className='h-8 w-8 rounded bg-primary/5 flex items-center justify-center text-primary shrink-0'><MapPin size={16} /></div>
                                <div><p className='font-semibold text-xs uppercase text-muted-foreground'>Coordinates</p><p>{data.lat || 'N/A'}, {data.lon || 'N/A'}</p></div>
                            </div>
                        </div>

                        {socialLinks.length > 0 && (
                            <>
                                <Separator />
                                <div className='space-y-3'>
                                    <p className='font-semibold text-xs uppercase text-muted-foreground flex items-center gap-2'><Globe size={14} className='text-primary' /> Online Presence</p>
                                    <div className='grid grid-cols-1 gap-2'>
                                        {socialLinks.map((link, i) => (
                                            <a key={i} href={link.url} target='_blank' rel='noreferrer' className='flex items-center gap-3 p-2 rounded-lg hover:bg-muted transition-colors border border-transparent hover:border-border group'>
                                                <div className={`h-8 w-8 rounded flex items-center justify-center bg-muted ${link.color} group-hover:bg-white`}><link.icon size={16} /></div>
                                                <span className='font-medium text-sm'>{link.label}</span>
                                            </a>
                                        ))}
                                    </div>
                                </div>
                            </>
                        )}

                        <Separator />

                        <div className='space-y-3'>
                             <p className='font-semibold text-xs uppercase text-muted-foreground flex items-center gap-2'><Award size={14} className='text-primary' /> Specialities Offered</p>
                             <div className='flex flex-wrap gap-2'>
                                {data.specialities?.map((s: any) => (
                                    <Badge key={s._id} variant='secondary' className='rounded-full px-3 max-w-full whitespace-normal wrap-break-word text-start'>{s.name}</Badge>
                                ))}
                             </div>
                        </div>
                    </CardContent>
                </Card>

                {/* Details Section */}
                <div className='lg:col-span-2 space-y-8'>
                    {/* About */}
                    <div className='space-y-4'>
                        <div className='flex items-center gap-2'><h3 className='text-2xl font-bold'>About the Facility</h3><Separator className='flex-1' /></div>
                        <p className='text-muted-foreground leading-relaxed whitespace-pre-line text-lg'>{data.about}</p>
                    </div>

                    <div className='grid grid-cols-1 md:grid-cols-2 gap-6'>
                        <Card className='bg-primary/[0.02] border-primary/5 shadow-sm'>
                            <CardHeader><CardTitle className='flex items-center gap-2 text-primary'><Target size={20} /> Mission</CardTitle></CardHeader>
                            <CardContent><p className='text-muted-foreground italic leading-relaxed'>{data.mission}</p></CardContent>
                        </Card>
                        <Card className='bg-primary/[0.02] border-primary/5 shadow-sm'>
                            <CardHeader><CardTitle className='flex items-center gap-2 text-primary'><Eye size={20} /> Vision</CardTitle></CardHeader>
                            <CardContent><p className='text-muted-foreground italic leading-relaxed'>{data.vision}</p></CardContent>
                        </Card>
                    </div>

                    <Card className='border-dashed'>
                        <CardHeader><CardTitle className='text-lg'>Brief Description</CardTitle></CardHeader>
                        <CardContent><p className='text-muted-foreground'>{data.description}</p></CardContent>
                    </Card>

                    {/* Google Maps Preview */}
                    {data.lat && data.lon && (
                      <div className='space-y-4'>
                          <div className='flex items-center gap-2'><h3 className='text-2xl font-bold flex items-center gap-2'><Map size={24} className='text-primary'/> Location Map</h3><Separator className='flex-1' /></div>
                          <Card className='overflow-hidden shadow-lg border-primary/10'>
                              <CardContent className='p-0'>
                                  <iframe
                                      width="100%"
                                      height="450"
                                      style={{ border: 0 }}
                                      src={`https://maps.google.com/maps?q=${data.lat},${data.lon}&z=15&output=embed`}
                                  ></iframe>
                              </CardContent>
                          </Card>
                      </div>
                    )}
                    {/* Team & Schedules → dedicated paginated page */}
                    <div className='py-8'>
                        <Separator className='mb-12' />
                        <Link to='/hospitals/$id/team' params={{ id: data._id }} className='block group'>
                            <Card className='border-primary/10 bg-primary/[0.02] hover:bg-primary/5 transition-colors'>
                                <CardContent className='p-6 flex items-center justify-between gap-4'>
                                    <div className='flex items-center gap-4'>
                                        <div className='h-14 w-14 rounded-2xl bg-primary/10 border border-primary/20 flex items-center justify-center'>
                                            <Users size={24} className='text-primary' />
                                        </div>
                                        <div>
                                            <h3 className='text-xl font-bold flex items-center gap-2'>
                                                <Calendar size={18} className='text-primary' />
                                                Team & Schedules
                                            </h3>
                                            <p className='text-muted-foreground text-sm'>
                                                View and manage all assigned doctors with their weekly availability.
                                            </p>
                                        </div>
                                    </div>
                                    <Button variant='outline' className='border-primary/20 group-hover:bg-primary group-hover:text-primary-foreground transition-colors'>
                                        Open
                                        <ArrowRight size={16} className='ml-2' />
                                    </Button>
                                </CardContent>
                            </Card>
                        </Link>
                    </div>
                </div>
           </div>
        </div>
      </Main>
    </>
  )
}
