'use client'

import { useQuery } from '@tanstack/react-query'
import { useParams, useNavigate } from '@tanstack/react-router'
import api, { SERVER_URL } from '@/lib/api'
import { Header } from '@/components/layout/header'
import { Main } from '@/components/layout/main'
import { ProfileDropdown } from '@/components/profile-dropdown'
import { Search } from '@/components/search'
import { ThemeSwitch } from '@/components/theme-switch'
import { ConfigDrawer } from '@/components/config-drawer'
import { Button } from '@/components/ui/button'
import { ChevronLeft, GraduationCap, Award, Stethoscope, Mail, Contact, Phone, Languages, Briefcase, Shield, Share2, Trophy, BookOpen, MessageSquare, Users, Star, CheckCircle } from 'lucide-react'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Badge } from '@/components/ui/badge'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Separator } from '@/components/ui/separator'
import { DoctorHospitalList } from './components/doctor-hospital-list'
import { DoctorReviewsList } from './components/doctor-reviews-list'


export function DoctorDetails() {
  const { id } = useParams({ from: '/_authenticated/doctors/$id' })
  const navigate = useNavigate()
  
  const { data: doctor, isLoading } = useQuery({
    queryKey: ['doctor', id],
    queryFn: async () => {
      const res = await api.get(`/doctors/${id}`)
      return res.data?.data ?? res.data
    }
  })

  if (isLoading) return <div>Loading...</div>
  if (!doctor) return <div>Doctor not found</div>

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

      <Main className='flex flex-1 flex-col gap-6'>
        <div className='flex items-center gap-2'>
          <Button variant='ghost' size='icon' onClick={() => navigate({ to: '/doctors' })}>
            <ChevronLeft size={20} />
          </Button>
          <h2 className='text-2xl font-bold tracking-tight'>Doctor Profile</h2>
        </div>

        <div className='grid grid-cols-1 lg:grid-cols-3 gap-6'>
          {/* Left Column: Basic Info */}
          <Card className='lg:col-span-1'>
            <CardContent className='pt-6'>
              <div className='flex flex-col items-center space-y-4'>
                <Avatar className='h-32 w-32 border-4'>
                  <AvatarImage src={doctor.photo ? `${SERVER_URL}${doctor.photo}` : ''} />
                  <AvatarFallback className='text-3xl'>{doctor.name.substring(0, 2).toUpperCase()}</AvatarFallback>
                </Avatar>
                <div className='text-center w-full px-2'>
                  <h3 className='text-xl font-bold wrap-break-word'>{doctor.name}</h3>
                  <p className='text-muted-foreground text-sm wrap-break-word mt-1'>{doctor.degrees?.replace(/\s*Affiliation:\s*$/, '')}</p>
                  {doctor.short_description && (
                    <p className='text-sm font-medium text-primary mt-1 wrap-break-word'>{doctor.short_description}</p>
                  )}
                </div>
                
                <div className='w-full space-y-3 pt-4 border-t'>
                  <div className='flex items-start gap-3 text-sm min-w-0'>
                    <Mail size={16} className='text-muted-foreground mt-0.5 shrink-0' />
                    <span className='break-all min-w-0'>{doctor.email}</span>
                  </div>
                  {doctor.phone && (
                    <div className='flex items-center gap-3 text-sm'>
                      <Phone size={16} className='text-muted-foreground' />
                      <span>{doctor.phone}</span>
                    </div>
                  )}
                  <div className='flex items-center gap-3 text-sm'>
                    <Contact size={16} className='text-muted-foreground' />
                    <span>BMDC: {doctor.BMDC_REG_NO}</span>
                  </div>
                </div>

                <div className='flex flex-wrap gap-2 pt-4 w-full justify-center'>
                  {doctor.specializations?.map((s: any) => (
                    <Badge key={s._id} variant='secondary' className='max-w-full whitespace-normal wrap-break-word text-start'>{s.name}</Badge>
                  ))}
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Right Column: Details */}
          <div className='lg:col-span-2 space-y-6'>
            <Card>
              <CardHeader>
                <CardTitle className='flex items-center gap-2'>
                  <Award size={20} className='text-primary' />
                  About
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className='text-muted-foreground whitespace-pre-line'>{doctor.about?.replace(/^Affiliation:\s*/i, '').trim()}</p>
              </CardContent>
            </Card>

            <div className='grid grid-cols-1 md:grid-cols-2 gap-6'>
              <Card>
                <CardHeader>
                  <CardTitle className='flex items-center gap-2'>
                    <GraduationCap size={20} className='text-primary' />
                    Education
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <ul className='space-y-2 list-disc list-inside text-muted-foreground'>
                    {doctor.educations?.filter((edu: string) => edu?.trim()).map((edu: string, i: number) => (
                      <li key={i}>{edu.replace(/\s*Affiliation:\s*$/, '')}</li>
                    ))}
                  </ul>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className='flex items-center gap-2'>
                    <Stethoscope size={20} className='text-primary' />
                    Concentrations
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className='flex flex-wrap gap-2'>
                    {doctor.field_of_concentration?.map((f: any) => (
                      <Badge key={f._id} variant='outline'>{f.name}</Badge>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Languages & Status */}
            {(doctor.languages?.length > 0 || doctor.isVerified != null || doctor.isFeatured != null || doctor.totalPatients != null || doctor.rating != null || doctor.totalReviews != null) && (
              <Card>
                <CardHeader>
                  <CardTitle className='flex items-center gap-2'>
                    <Languages size={20} className='text-primary' />
                    Languages & Status
                  </CardTitle>
                </CardHeader>
                <CardContent className='space-y-4'>
                  {doctor.languages?.length > 0 && (
                    <div className='flex flex-wrap gap-2'>
                      {doctor.languages.map((lang: string, i: number) => (
                        <Badge key={i}>{lang}</Badge>
                      ))}
                    </div>
                  )}
                  <div className='flex flex-wrap gap-6 text-sm'>
                    {doctor.isVerified != null && (
                      <div className='flex items-center gap-2'>
                        <CheckCircle size={16} className={doctor.isVerified ? 'text-green-500' : 'text-muted-foreground'} />
                        <span className='text-muted-foreground'>Verified: <span className='font-medium text-foreground'>{doctor.isVerified ? 'Yes' : 'No'}</span></span>
                      </div>
                    )}
                    {doctor.isFeatured != null && (
                      <div className='flex items-center gap-2'>
                        <Star size={16} className={doctor.isFeatured ? 'text-yellow-500' : 'text-muted-foreground'} />
                        <span className='text-muted-foreground'>Featured: <span className='font-medium text-foreground'>{doctor.isFeatured ? 'Yes' : 'No'}</span></span>
                      </div>
                    )}
                    {doctor.totalPatients != null && (
                      <div className='flex items-center gap-2'>
                        <Users size={16} className='text-primary' />
                        <span className='text-muted-foreground'>Patients: <span className='font-medium text-foreground'>{doctor.totalPatients}</span></span>
                      </div>
                    )}
                    {doctor.rating != null && (
                      <div className='flex items-center gap-2'>
                        <Star size={16} className='text-yellow-500' />
                        <span className='text-muted-foreground'>Rating: <span className='font-medium text-foreground'>{doctor.rating}</span></span>
                      </div>
                    )}
                    {doctor.totalReviews != null && (
                      <div className='flex items-center gap-2'>
                        <Users size={16} className='text-muted-foreground' />
                        <span className='text-muted-foreground'>Reviews: <span className='font-medium text-foreground'>{doctor.totalReviews}</span></span>
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Services & Conditions */}
            {(() => {
              const services = doctor.services?.filter((s: string) => s?.trim()) ?? []
              const conditions = doctor.conditions_treated?.filter((c: string) => c?.trim()) ?? []
              return (services.length > 0 || conditions.length > 0) ? (
                <div className='grid grid-cols-1 md:grid-cols-2 gap-6'>
                  {services.length > 0 && (
                    <Card>
                      <CardHeader>
                        <CardTitle className='flex items-center gap-2'>
                          <Briefcase size={20} className='text-primary' />
                          Services
                        </CardTitle>
                      </CardHeader>
                      <CardContent>
                        <div className='flex flex-wrap gap-2'>
                          {services.map((s: string, i: number) => (
                            <Badge key={i} variant='outline'>{s}</Badge>
                          ))}
                        </div>
                      </CardContent>
                    </Card>
                  )}
                  {conditions.length > 0 && (
                    <Card>
                      <CardHeader>
                        <CardTitle className='flex items-center gap-2'>
                          <Stethoscope size={20} className='text-primary' />
                          Conditions Treated
                        </CardTitle>
                      </CardHeader>
                      <CardContent>
                        <div className='flex flex-wrap gap-2'>
                          {conditions.map((c: string, i: number) => (
                            <Badge key={i} className='max-w-full whitespace-normal wrap-break-word'>{c}</Badge>
                          ))}
                        </div>
                      </CardContent>
                    </Card>
                  )}
                </div>
              ) : null
            })()}

            {/* Insurance & Social */}
            {(() => {
              const insurance = doctor.insurance_accepted?.filter((s: string) => s?.trim()) ?? []
              const sl = doctor.social_links
              const hasLinks = sl && (sl.facebook || sl.twitter || sl.linkedin || sl.website)
              return (insurance.length > 0 || hasLinks) ? (
                <div className='grid grid-cols-1 md:grid-cols-2 gap-6'>
                  {insurance.length > 0 && (
                    <Card>
                      <CardHeader>
                        <CardTitle className='flex items-center gap-2'>
                          <Shield size={20} className='text-primary' />
                          Insurance Accepted
                        </CardTitle>
                      </CardHeader>
                      <CardContent>
                        <div className='flex flex-wrap gap-2'>
                          {insurance.map((ins: string, i: number) => (
                            <Badge key={i} variant='secondary'>{ins}</Badge>
                          ))}
                        </div>
                      </CardContent>
                    </Card>
                  )}
                  {hasLinks && (
                    <Card>
                      <CardHeader>
                        <CardTitle className='flex items-center gap-2'>
                          <Share2 size={20} className='text-primary' />
                          Social Links
                        </CardTitle>
                      </CardHeader>
                      <CardContent>
                        <ul className='space-y-2 text-sm'>
                          {sl.facebook && <li><a href={sl.facebook} target='_blank' rel='noopener noreferrer' className='text-primary hover:underline'>Facebook</a></li>}
                          {sl.twitter && <li><a href={sl.twitter} target='_blank' rel='noopener noreferrer' className='text-primary hover:underline'>Twitter</a></li>}
                          {sl.linkedin && <li><a href={sl.linkedin} target='_blank' rel='noopener noreferrer' className='text-primary hover:underline'>LinkedIn</a></li>}
                          {sl.website && <li><a href={sl.website} target='_blank' rel='noopener noreferrer' className='text-primary hover:underline'>Website</a></li>}
                        </ul>
                      </CardContent>
                    </Card>
                  )}
                </div>
              ) : null
            })()}

            {/* Awards */}
            {doctor.awards?.length > 0 && (
              <Card>
                <CardHeader>
                  <CardTitle className='flex items-center gap-2'>
                    <Trophy size={20} className='text-primary' />
                    Awards
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <ul className='space-y-4'>
                    {doctor.awards.map((award: any, i: number) => (
                      <li key={i}>
                        <p className='font-semibold'>{award.title}</p>
                        {award.year && <p className='text-sm text-muted-foreground'>{award.year}</p>}
                        {award.description && <p className='text-sm mt-1'>{award.description}</p>}
                      </li>
                    ))}
                  </ul>
                </CardContent>
              </Card>
            )}

            {/* Publications */}
            {doctor.publications?.length > 0 && (
              <Card>
                <CardHeader>
                  <CardTitle className='flex items-center gap-2'>
                    <BookOpen size={20} className='text-primary' />
                    Publications
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <ul className='space-y-4'>
                    {doctor.publications.map((pub: any, i: number) => (
                      <li key={i}>
                        <p className='font-semibold'>{pub.title}</p>
                        {pub.journal && <p className='text-sm italic text-muted-foreground'>{pub.journal}</p>}
                        {pub.year && <p className='text-sm text-muted-foreground'>{pub.year}</p>}
                        {pub.url && <a href={pub.url} target='_blank' rel='noopener noreferrer' className='text-sm text-primary hover:underline'>View Publication</a>}
                      </li>
                    ))}
                  </ul>
                </CardContent>
              </Card>
            )}

            {/* FAQs */}
            {doctor.faqs?.length > 0 && (
              <Card>
                <CardHeader>
                  <CardTitle className='flex items-center gap-2'>
                    <MessageSquare size={20} className='text-primary' />
                    FAQs
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <ul className='space-y-4'>
                    {doctor.faqs.map((faq: any, i: number) => (
                      <li key={i}>
                        {i > 0 && <Separator className='mb-4' />}
                        <p className='text-sm font-bold'>{faq.question}</p>
                        <p className='text-sm text-muted-foreground mt-1'>{faq.answer}</p>
                      </li>
                    ))}
                  </ul>
                </CardContent>
              </Card>
            )}

            {/* Reviews */}
            <DoctorReviewsList doctorId={id} />

            {/* Hospital Availability */}
            <div className='py-8'>
                <Separator className='mb-12 opacity-5' />
                <DoctorHospitalList doctorId={id} />
            </div>
          </div>
        </div>
      </Main>
    </>
  )
}
