'use client'

import { z } from 'zod'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { useEffect, useState, useRef } from 'react'
import { useQuery } from '@tanstack/react-query'
import { toast } from 'sonner'
import { Upload, Hospital, ImageIcon, Facebook as FacebookIcon, Youtube as YoutubeIcon, Instagram as InstagramIcon, Linkedin as LinkedinIcon, Globe, AlertCircle } from 'lucide-react'
import api, { SERVER_URL } from '@/lib/api'
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
import { Textarea } from '@/components/ui/textarea'
import { PasswordInput } from '@/components/password-input'
import { MultiSelect } from '@/components/multi-select'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Switch } from '@/components/ui/switch'

const formSchema = z.object({
  name: z.string().min(1, 'Name is required'),
  email: z.string().email('Invalid email address'),
  password: z.string().min(8, 'Password must be at least 8 characters').optional().or(z.literal('')),
  description: z.string().min(1, 'Description is required'),
  hotline: z.string().min(1, 'Hotline is required'),
  lat: z.string().optional(),
  lon: z.string().optional(),
  address: z.string().min(1, 'Address is required'),
  about: z.string().min(1, 'About is required'),
  mission: z.string().min(1, 'Mission is required'),
  vision: z.string().min(1, 'Vision is required'),
  facebook: z.string().url('Invalid URL').optional().or(z.literal('')),
  youtube: z.string().url('Invalid URL').optional().or(z.literal('')),
  instagram: z.string().url('Invalid URL').optional().or(z.literal('')),
  linkedin: z.string().url('Invalid URL').optional().or(z.literal('')),
  website: z.string().url('Invalid URL').optional().or(z.literal('')),
  specialities: z.array(z.string()).min(1, 'At least one specialization is required'),
  district: z.string().optional().or(z.literal('')),
  upazila: z.string().optional().or(z.literal('')),
  type: z.string().min(1, 'Type is required'),
  isEmergencyAvailable: z.boolean(),
  hasAmbulance: z.boolean(),
  hasCabinFacility: z.boolean(),
  emergencyMessage: z.string().optional().or(z.literal('')),
  visitingHours: z.string().optional().or(z.literal('')),
  insurances: z.string().optional().or(z.literal('')),
  isVerified: z.boolean(),
  facilities: z.string().optional().or(z.literal('')),
  yearsInService: z.number().min(0).optional(),
  statsTotalBeds: z.number().min(0).optional(),
  statsDoctorsCount: z.number().min(0).optional(),
  statsIcuBeds: z.number().min(0).optional(),
})


type HospitalForm = z.infer<typeof formSchema>;

type Props = {
  open: boolean
  onOpenChange: (open: boolean) => void
  currentRow?: any
  onSuccess: () => void
}

export function HospitalsActionDialog({ open, onOpenChange, currentRow, onSuccess }: Props) {
  const isEdit = !!currentRow
  const [activeTab, setActiveTab] = useState('basic')
  
  const [specSearch, setSpecSearch] = useState('')

  const { data: specialities = [] } = useQuery({
    queryKey: ['specialities', specSearch],
    queryFn: async () => {
      const res = await api.get('/specialities', { params: { search: specSearch, limit: 100 } })
      return Array.isArray(res.data) ? res.data : res.data?.data ?? []
    },
    enabled: open,
  })

  const { data: bdLocations = [] } = useQuery<Array<{ district: string; upazilas: string[] }>>({
    queryKey: ['bd-locations-grouped'],
    queryFn: async () => {
      const res = await api.get('/bd-locations/public/grouped')
      return Array.isArray(res.data) ? res.data : res.data?.data ?? []
    },
    staleTime: 60 * 60 * 1000,
  })

  
  const [logoFile, setLogoFile] = useState<File | null>(null)
  const [logoPreview, setLogoPreview] = useState<string | null>(null)
  const logoInputRef = useRef<HTMLInputElement>(null)

  const [coverFile, setCoverFile] = useState<File | null>(null)
  const [coverPreview, setCoverPreview] = useState<string | null>(null)
  const coverInputRef = useRef<HTMLInputElement>(null)

  const DEFAULT_OPENING_HOURS = [
    { day: 'Saturday', time: '', isClosed: false },
    { day: 'Sunday', time: '', isClosed: false },
    { day: 'Monday', time: '', isClosed: false },
    { day: 'Tuesday', time: '', isClosed: false },
    { day: 'Wednesday', time: '', isClosed: false },
    { day: 'Thursday', time: '', isClosed: false },
    { day: 'Friday', time: '', isClosed: true },
  ]
  const [openingHoursData, setOpeningHoursData] = useState<Array<{ day: string; time: string; isClosed: boolean }>>(DEFAULT_OPENING_HOURS)
  const [faqsData, setFaqsData] = useState<Array<{ question: string; answer: string }>>([])
  const [accreditationsData, setAccreditationsData] = useState<Array<{ name: string; body: string; year: string }>>([])

  const form = useForm<HospitalForm>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: '',
      email: '',
      password: '',
      description: '',
      hotline: '',
      lat: '',
      lon: '',
      address: '',
      about: '',
      mission: '',
      vision: '',
      facebook: '',
      youtube: '',
      instagram: '',
      linkedin: '',
      website: '',
      specialities: [],
      district: '',
      upazila: '',
      type: 'Hospital',
      isEmergencyAvailable: false,
      hasAmbulance: false,
      hasCabinFacility: false,
      emergencyMessage: '',
      visitingHours: '',
      insurances: '',
      isVerified: true,
      facilities: '',
      yearsInService: 0,
      statsTotalBeds: 0,
      statsDoctorsCount: 0,
      statsIcuBeds: 0,
    },
  })




  useEffect(() => {
    if (currentRow) {
      form.reset({
        ...currentRow,
        id: currentRow._id,
        password: '',
        description: currentRow.description || '',
        hotline: currentRow.hotline || '',
        address: currentRow.address || '',
        about: currentRow.about || '',
        mission: currentRow.mission || '',
        vision: currentRow.vision || '',
        facebook: currentRow.facebook || '',
        youtube: currentRow.youtube || '',
        instagram: currentRow.instagram || '',
        linkedin: currentRow.linkedin || '',
        website: currentRow.website || '',
        specialities: currentRow.specialities?.map((s: any) => s._id || s) || [],
        district: currentRow.bdLocation?.district || currentRow.district || '',
        upazila: currentRow.bdLocation?.upazila || currentRow.upazila || '',
        type: currentRow.type || 'Hospital',
        isEmergencyAvailable: !!currentRow.isEmergencyAvailable,
        hasAmbulance: !!currentRow.hasAmbulance,
        hasCabinFacility: !!currentRow.hasCabinFacility,
        emergencyMessage: currentRow.emergencyMessage || '',
        visitingHours: currentRow.visitingHours || '',
        isVerified: !!currentRow.isVerified,
        facilities: Array.isArray(currentRow.facilities) ? currentRow.facilities.join(', ') : (currentRow.facilities || ''),
        yearsInService: currentRow.yearsInService || 0,
        statsTotalBeds: currentRow.stats?.totalBeds || 0,
        statsDoctorsCount: currentRow.stats?.doctorsCount || 0,
        statsIcuBeds: currentRow.stats?.icuBeds || 0,
      })

      if (currentRow.logo) setLogoPreview(`${SERVER_URL}${currentRow.logo}`)
      if (currentRow.cover_photo) setCoverPreview(`${SERVER_URL}${currentRow.cover_photo}`)

      if (Array.isArray(currentRow.openingHours) && currentRow.openingHours.length > 0) {
        const dayOrder = ['Saturday', 'Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday']
        const merged = dayOrder.map(day => {
          const all = currentRow.openingHours.filter((h: any) => h.day === day)
          const open = all.find((h: any) => !h.isClosed && h.time && h.time.toLowerCase() !== 'closed')
          const existing = open || all[0]
          return existing ? { day, time: existing.isClosed ? '' : (existing.time || ''), isClosed: !!existing.isClosed } : { day, time: '', isClosed: day === 'Friday' }
        })
        setOpeningHoursData(merged)
      } else {
        setOpeningHoursData(DEFAULT_OPENING_HOURS)
      }

      setFaqsData(Array.isArray(currentRow.faqs) ? currentRow.faqs.map((f: any) => ({ question: f.question || '', answer: f.answer || '' })) : [])
      setAccreditationsData(Array.isArray(currentRow.accreditations) ? currentRow.accreditations.map((a: any) => ({ name: a.name || '', body: a.body || '', year: String(a.year || '') })) : [])

      setActiveTab('basic')
    } else {
      form.reset({
        name: '',
        email: '',
        password: '',
        description: '',
        hotline: '',
        lat: '',
        lon: '',
        address: '',
        about: '',
        mission: '',
        vision: '',
        facebook: '',
        youtube: '',
        instagram: '',
        linkedin: '',
        website: '',
        specialities: [],
        district: '',
        upazila: '',
        type: 'Hospital',
        isEmergencyAvailable: false,
        hasAmbulance: false,
        hasCabinFacility: false,
        emergencyMessage: '',
        visitingHours: '',
        isVerified: true,
        facilities: '',
        yearsInService: 0,
        statsTotalBeds: 0,
        statsDoctorsCount: 0,
        statsIcuBeds: 0,
      })

      setLogoPreview(null); setLogoFile(null)
      setCoverPreview(null); setCoverFile(null)
      setOpeningHoursData(DEFAULT_OPENING_HOURS)
      setFaqsData([])
      setAccreditationsData([])
      setActiveTab('basic')
    }
  }, [currentRow, form, open])

  const handleLogoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      setLogoFile(file)
      const reader = new FileReader(); reader.onloadend = () => setLogoPreview(reader.result as string); reader.readAsDataURL(file)
    }
  }

  const handleCoverChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      setCoverFile(file)
      const reader = new FileReader(); reader.onloadend = () => setCoverPreview(reader.result as string); reader.readAsDataURL(file)
    }
  }

  const onSubmit = async (values: HospitalForm) => {
    try {
      const url = isEdit ? `/hospitals/${currentRow._id}` : '/hospitals'
      const method = isEdit ? 'patch' : 'post'

      const formData = new FormData()
      const statsObj = { totalBeds: values.statsTotalBeds || 0, doctorsCount: values.statsDoctorsCount || 0, icuBeds: values.statsIcuBeds || 0 }
      const facilitiesArr = values.facilities ? values.facilities.split(',').map((s: string) => s.trim()).filter(Boolean) : []

      Object.entries(values).forEach(([key, value]) => {
        if (key === 'specialities') formData.append(key, JSON.stringify(value))
        else if (key === 'password' && !value) {}
        else if (['statsTotalBeds', 'statsDoctorsCount', 'statsIcuBeds'].includes(key)) {}
        else if (key === 'facilities') formData.append(key, JSON.stringify(facilitiesArr))
        else if (value !== undefined) formData.append(key, String(value))
      })
      formData.append('stats', JSON.stringify(statsObj))
      formData.append('openingHours', JSON.stringify(openingHoursData))
      formData.append('faqs', JSON.stringify(faqsData.filter(f => f.question || f.answer)))
      formData.append('accreditations', JSON.stringify(accreditationsData.filter(a => a.name)))
      const insurancesArr = values.insurances ? values.insurances.split(',').map((s: string) => s.trim()).filter(Boolean) : []
      formData.append('insurances', JSON.stringify(insurancesArr))

      if (logoFile) formData.append('logo', logoFile)
      if (coverFile) formData.append('cover_photo', coverFile)

      const res = await api({
        method,
        url,
        data: formData,
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      })

      if (res.status === 200 || res.status === 201) {
        toast.success(isEdit ? 'Facility updated' : 'Facility added')
        onOpenChange(false); onSuccess()
      } else throw new Error()
    } catch (e) { toast.error('Failed to save facility') }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className='sm:max-w-2xl max-h-[90vh] flex flex-col p-0'>
        <DialogHeader className='text-start p-6 pb-0'>
          <DialogTitle>{isEdit ? 'Edit Facility' : 'Add New Healthcare Facility'}</DialogTitle>
          <DialogDescription>
            {isEdit ? 'Update details here. ' : 'Enter facility details below. '}
            Click save when you&apos;re done.
          </DialogDescription>
        </DialogHeader>
        
        <Form {...form}>
          <form id='hospital-form' onSubmit={form.handleSubmit(onSubmit, (e) => console.log('Hospital Form Validation Errors:', e))} className='flex flex-col flex-1 overflow-hidden min-h-0'>
             <Tabs value={activeTab} onValueChange={setActiveTab} className='flex flex-col flex-1 pb-4 min-h-0'>
                <div className='px-6 pt-2 border-b'>
                    <TabsList className='grid w-full grid-cols-5'>
                        <TabsTrigger value='basic'>Basic</TabsTrigger>
                        <TabsTrigger value='about'>About</TabsTrigger>
                        <TabsTrigger value='social'>Social</TabsTrigger>
                        <TabsTrigger value='stats'>Stats</TabsTrigger>
                        <TabsTrigger value='content'>Content</TabsTrigger>
                    </TabsList>
                </div>

                <div className='flex-1 overflow-y-auto px-6 py-4'>
                    <TabsContent value='basic' className='space-y-4 mt-0'>
                        {/* Logo and Cover */}
                        <div className='grid grid-cols-2 gap-4 pb-4 border-b'>
                            <div className='flex flex-col items-center space-y-2'>
                                <span className='text-xs font-medium text-muted-foreground uppercase'>Logo</span>
                                <Avatar className='h-20 w-20 border rounded-md'>
                                    <AvatarImage src={logoPreview || ''} />
                                    <AvatarFallback><Hospital size={30} /></AvatarFallback>
                                </Avatar>
                                <input type='file' ref={logoInputRef} onChange={handleLogoChange} className='hidden' accept='image/*' />
                                <Button type='button' variant='outline' size='sm' onClick={() => logoInputRef.current?.click()}>
                                    <Upload size={14} className='mr-2' /> Select Logo
                                </Button>
                            </div>
                            <div className='flex flex-col items-center space-y-2'>
                                <span className='text-xs font-medium text-muted-foreground uppercase'>Cover Photo</span>
                                <div className='h-20 w-full border rounded-md overflow-hidden bg-muted flex items-center justify-center relative'>
                                    {coverPreview ? <img src={coverPreview} className='w-full h-full object-cover' /> : <ImageIcon size={30} className='text-muted-foreground/50' />}
                                </div>
                                <input type='file' ref={coverInputRef} onChange={handleCoverChange} className='hidden' accept='image/*' />
                                <Button type='button' variant='outline' size='sm' onClick={() => coverInputRef.current?.click()}>
                                    <Upload size={14} className='mr-2' /> Select Cover
                                </Button>
                            </div>
                        </div>

                        {/* Basic Info */}
                        <div className='grid grid-cols-2 gap-4'>
                            <FormField control={form.control} name='name' render={({ field }) => (
                                <FormItem className='space-y-1'>
                                <FormLabel>Name</FormLabel>
                                <FormControl><Input placeholder='City Hospital' {...field} /></FormControl>
                                <FormMessage />
                                </FormItem>
                            )} />
                            <FormField control={form.control} name='email' render={({ field }) => (
                                <FormItem className='space-y-1'>
                                <FormLabel>Email</FormLabel>
                                <FormControl><Input placeholder='info@hospital.com' {...field} /></FormControl>
                                <FormMessage />
                                </FormItem>
                            )} />
                        </div>

                        <div className='grid grid-cols-2 gap-4'>
                            <FormField control={form.control} name='hotline' render={({ field }) => (
                                <FormItem className='space-y-1'>
                                <FormLabel>Hotline</FormLabel>
                                <FormControl><Input placeholder='10666' {...field} /></FormControl>
                                <FormMessage />
                                </FormItem>
                            )} />
                            <FormField control={form.control} name='password' render={({ field }) => (
                                <FormItem className='space-y-1'>
                                <FormLabel>Password</FormLabel>
                                <FormControl><PasswordInput placeholder={isEdit ? 'Blank to keep' : 'Min 8 characters'} {...field} /></FormControl>
                                <FormMessage />
                                </FormItem>
                            )} />
                        </div>

                        <FormField control={form.control} name='description' render={({ field }) => (
                            <FormItem className='space-y-1'>
                            <FormLabel>Short Description</FormLabel>
                            <FormControl><Input placeholder='A leading healthcare provider...' {...field} /></FormControl>
                            <FormMessage />
                            </FormItem>
                        )} />

                        <FormField control={form.control} name='specialities' render={({ field }) => (
                            <FormItem className='space-y-1'>
                            <FormLabel>Available Specialities</FormLabel>
                             <MultiSelect 
                               options={specialities.map((s: any) => ({ label: s.name, value: s._id }))} 
                               onValueChange={field.onChange} 
                               defaultValue={field.value} 
                               placeholder="Select specialities" 
                               variant="inverted" 
                               onSearchValueChange={setSpecSearch}
                             />
                            <FormMessage />
                            </FormItem>
                        )} />

                        <FormField control={form.control} name='type' render={({ field }) => (
                            <FormItem className='space-y-1'>
                            <FormLabel>Facility Type</FormLabel>
                            <Select onValueChange={field.onChange} value={field.value}>
                                <FormControl>
                                    <SelectTrigger className='bg-background border-input dark:bg-black/40 dark:border-white/10'>
                                        <SelectValue placeholder="Select type" />
                                    </SelectTrigger>
                                </FormControl>
                                <SelectContent>
                                    <SelectItem value="Hospital">Hospital</SelectItem>
                                    <SelectItem value="Clinic">Clinic</SelectItem>
                                    <SelectItem value="Diagnostic Center">Diagnostic Center</SelectItem>
                                    <SelectItem value="Specialized Center">Specialized Center</SelectItem>
                                </SelectContent>
                            </Select>
                            <FormMessage />
                            </FormItem>
                        )} />

                        <div className='grid grid-cols-2 gap-4'>
                            <FormField control={form.control} name='district' render={({ field }) => (
                                <FormItem className='space-y-1'>
                                <FormLabel>District <span className='text-muted-foreground font-normal text-xs'>(Optional)</span></FormLabel>
                                <Select
                                    onValueChange={(val) => {
                                        field.onChange(val)
                                        form.setValue('upazila', '')
                                    }}
                                    value={field.value ?? ''}
                                >
                                    <FormControl>
                                        <SelectTrigger className='bg-background border-input dark:bg-black/40 dark:border-white/10'>
                                            <SelectValue placeholder="Select district" />
                                        </SelectTrigger>
                                    </FormControl>
                                    <SelectContent>
                                        {bdLocations.map(loc => (
                                            <SelectItem key={loc.district} value={loc.district}>{loc.district}</SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                                <FormMessage />
                                </FormItem>
                            )} />

                            <FormField control={form.control} name='upazila' render={({ field }) => {
                                const selectedDistrict = form.watch('district') ?? ''
                                const upazilas = bdLocations.find(l => l.district === selectedDistrict)?.upazilas ?? []
                                return (
                                <FormItem className='space-y-1'>
                                <FormLabel>Upazila <span className='text-muted-foreground font-normal text-xs'>(Optional)</span></FormLabel>
                                <Select
                                    onValueChange={field.onChange}
                                    value={field.value ?? ''}
                                    disabled={!selectedDistrict}
                                >
                                    <FormControl>
                                        <SelectTrigger className='bg-background border-input dark:bg-black/40 dark:border-white/10'>
                                            <SelectValue placeholder={selectedDistrict ? 'Select upazila' : 'Select district first'} />
                                        </SelectTrigger>
                                    </FormControl>
                                    <SelectContent>
                                        {upazilas.map(u => (
                                            <SelectItem key={u} value={u}>{u}</SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                                <FormMessage />
                                </FormItem>
                            )}} />
                        </div>

                    </TabsContent>

                    <TabsContent value='about' className='space-y-4 mt-0'>
                        <FormField control={form.control} name='address' render={({ field }) => (
                            <FormItem className='space-y-1'>
                            <FormLabel>Address</FormLabel>
                            <FormControl><Textarea className='min-h-[60px]' placeholder='123 Healthcare St, Dhaka' {...field} /></FormControl>
                            <FormMessage />
                            </FormItem>
                        )} />

                        <FormField control={form.control} name='about' render={({ field }) => (
                            <FormItem className='space-y-1'>
                            <FormLabel>About Facility</FormLabel>
                            <FormControl><Textarea className='min-h-[120px]' placeholder='Detailed story...' {...field} /></FormControl>
                            <FormMessage />
                            </FormItem>
                        )} />

                        <div className='grid grid-cols-2 gap-4'>
                            <FormField control={form.control} name='mission' render={({ field }) => (
                                <FormItem className='space-y-1'>
                                <FormLabel>Mission</FormLabel>
                                <FormControl><Textarea className='min-h-[100px]' placeholder='Our mission...' {...field} /></FormControl>
                                <FormMessage />
                                </FormItem>
                            )} />
                            <FormField control={form.control} name='vision' render={({ field }) => (
                                <FormItem className='space-y-1'>
                                <FormLabel>Vision</FormLabel>
                                <FormControl><Textarea className='min-h-[100px]' placeholder='Our vision...' {...field} /></FormControl>
                                <FormMessage />
                                </FormItem>
                            )} />
                        </div>
                    </TabsContent>

                    <TabsContent value='social' className='space-y-6 mt-0'>
                        <div className='space-y-4 border-b pb-6'>
                            <span className='text-sm font-semibold'>Social Media Links (Optional)</span>
                            <div className='grid grid-cols-2 gap-4'>
                                <FormField control={form.control} name='facebook' render={({ field }) => (
                                    <FormItem className='space-y-1'>
                                        <div className='flex items-center gap-2 mb-1'><FacebookIcon size={14} className='text-blue-600'/><FormLabel className='mt-0'>Facebook</FormLabel></div>
                                        <FormControl><Input placeholder='https://facebook.com/...' {...field} /></FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )} />
                                <FormField control={form.control} name='youtube' render={({ field }) => (
                                    <FormItem className='space-y-1'>
                                        <div className='flex items-center gap-2 mb-1'><YoutubeIcon size={14} className='text-red-600'/><FormLabel className='mt-0'>YouTube</FormLabel></div>
                                        <FormControl><Input placeholder='https://youtube.com/...' {...field} /></FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )} />
                            </div>
                            <div className='grid grid-cols-2 gap-4'>
                                <FormField control={form.control} name='instagram' render={({ field }) => (
                                    <FormItem className='space-y-1'>
                                        <div className='flex items-center gap-2 mb-1'><InstagramIcon size={14} className='text-pink-600'/><FormLabel className='mt-0'>Instagram</FormLabel></div>
                                        <FormControl><Input placeholder='https://instagram.com/...' {...field} /></FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )} />
                                <FormField control={form.control} name='linkedin' render={({ field }) => (
                                    <FormItem className='space-y-1'>
                                        <div className='flex items-center gap-2 mb-1'><LinkedinIcon size={14} className='text-blue-700'/><FormLabel className='mt-0'>LinkedIn</FormLabel></div>
                                        <FormControl><Input placeholder='https://linkedin.com/...' {...field} /></FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )} />
                            </div>
                        </div>

                        <div className='space-y-3 pt-2'>
                            <span className='text-sm font-semibold'>Location Coordinates</span>
                            <div className='grid grid-cols-2 gap-4'>
                                <FormField control={form.control} name='lat' render={({ field }) => (
                                    <FormItem className='space-y-1'>
                                    <FormLabel>Latitude</FormLabel>
                                    <FormControl><Input placeholder='23.8103' {...field} /></FormControl>
                                    <FormMessage />
                                    </FormItem>
                                )} />
                                <FormField control={form.control} name='lon' render={({ field }) => (
                                    <FormItem className='space-y-1'>
                                    <FormLabel>Longitude</FormLabel>
                                    <FormControl><Input placeholder='90.4125' {...field} /></FormControl>
                                    <FormMessage />
                                    </FormItem>
                                )} />
                            </div>
                        </div>
                    </TabsContent>

                    <TabsContent value='stats' className='space-y-6 mt-0'>
                        <div className='flex items-center justify-between rounded-lg border p-4'>
                            <div className='space-y-0.5'>
                                <div className='flex items-center gap-2'><AlertCircle size={14} className='text-red-500'/><span className='text-sm font-medium'>Emergency Services Available</span></div>
                                <p className='text-xs text-muted-foreground'>24/7 emergency care available at this facility</p>
                            </div>
                            <FormField control={form.control} name='isEmergencyAvailable' render={({ field }) => (
                                <FormItem><FormControl><Switch checked={field.value} onCheckedChange={field.onChange} /></FormControl></FormItem>
                            )} />
                        </div>

                        <div className='flex items-center justify-between rounded-lg border p-4'>
                            <div className='space-y-0.5'>
                                <div className='flex items-center gap-2'><AlertCircle size={14} className='text-amber-500'/><span className='text-sm font-medium'>Ambulance Service Available</span></div>
                                <p className='text-xs text-muted-foreground'>This facility has ambulance services</p>
                            </div>
                            <FormField control={form.control} name='hasAmbulance' render={({ field }) => (
                                <FormItem><FormControl><Switch checked={field.value} onCheckedChange={field.onChange} /></FormControl></FormItem>
                            )} />
                        </div>

                        <div className='flex items-center justify-between rounded-lg border p-4'>
                            <div className='space-y-0.5'>
                                <div className='flex items-center gap-2'><Globe size={14} className='text-primary'/><span className='text-sm font-medium'>Verified Facility</span></div>
                                <p className='text-xs text-muted-foreground'>Show verified badge on public listing</p>
                            </div>
                            <FormField control={form.control} name='isVerified' render={({ field }) => (
                                <FormItem><FormControl><Switch checked={field.value} onCheckedChange={field.onChange} /></FormControl></FormItem>
                            )} />
                        </div>

                        <div className='space-y-2'>
                            <span className='text-sm font-semibold'>Facility Stats</span>
                            <div className='grid grid-cols-3 gap-4'>
                                <FormField control={form.control} name='statsTotalBeds' render={({ field }) => (
                                    <FormItem className='space-y-1'><FormLabel>Total Beds</FormLabel>
                                        <FormControl><Input type='number' min={0} placeholder='500' {...field} value={field.value ?? ''} onChange={e => field.onChange(e.target.valueAsNumber || 0)} /></FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )} />
                                <FormField control={form.control} name='statsIcuBeds' render={({ field }) => (
                                    <FormItem className='space-y-1'><FormLabel>ICU Beds</FormLabel>
                                        <FormControl><Input type='number' min={0} placeholder='20' {...field} value={field.value ?? ''} onChange={e => field.onChange(e.target.valueAsNumber || 0)} /></FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )} />
                                <FormField control={form.control} name='statsDoctorsCount' render={({ field }) => (
                                    <FormItem className='space-y-1'><FormLabel>Doctors</FormLabel>
                                        <FormControl><Input type='number' min={0} placeholder='120' {...field} value={field.value ?? ''} onChange={e => field.onChange(e.target.valueAsNumber || 0)} /></FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )} />
                            </div>
                        </div>

                        <FormField control={form.control} name='yearsInService' render={({ field }) => (
                            <FormItem className='space-y-1'><FormLabel>Years in Service</FormLabel>
                                <FormControl><Input type='number' min={0} placeholder='25' {...field} value={field.value ?? ''} onChange={e => field.onChange(e.target.valueAsNumber || 0)} /></FormControl>
                                <FormMessage />
                            </FormItem>
                        )} />

                        <div className='space-y-2'>
                            <span className='text-sm font-semibold'>Cabin Facility</span>
                            <div className='flex items-center justify-between rounded-lg border p-4'>
                                <div className='space-y-0.5'>
                                    <span className='text-sm font-medium'>Cabin/Private Room Available</span>
                                    <p className='text-xs text-muted-foreground'>Hospital offers cabin or private room facilities</p>
                                </div>
                                <FormField control={form.control} name='hasCabinFacility' render={({ field }) => (
                                    <FormItem><FormControl><Switch checked={field.value} onCheckedChange={field.onChange} /></FormControl></FormItem>
                                )} />
                            </div>
                        </div>

                        <FormField control={form.control} name='visitingHours' render={({ field }) => (
                            <FormItem className='space-y-1'>
                                <FormLabel>Visiting Hours</FormLabel>
                                <FormControl><Input placeholder='08:00 AM - 08:00 PM' {...field} value={field.value ?? ''} /></FormControl>
                                <FormMessage />
                            </FormItem>
                        )} />

                        <FormField control={form.control} name='emergencyMessage' render={({ field }) => (
                            <FormItem className='space-y-1'>
                                <FormLabel>Emergency Message</FormLabel>
                                <FormControl><Input placeholder='Emergency support available 24/7...' {...field} value={field.value ?? ''} /></FormControl>
                                <FormMessage />
                            </FormItem>
                        )} />

                        <div className='space-y-2'>
                            <span className='text-sm font-semibold'>Opening Hours</span>
                            <div className='rounded-lg border divide-y'>
                                {openingHoursData.map((hour, idx) => (
                                    <div key={hour.day} className='flex items-center gap-3 px-3 py-2'>
                                        <span className='w-24 shrink-0 text-sm font-medium text-muted-foreground'>{hour.day}</span>
                                        <Input
                                            placeholder='08:00 AM - 10:00 PM'
                                            value={hour.isClosed ? '' : hour.time}
                                            disabled={hour.isClosed}
                                            className='flex-1 h-8 text-sm'
                                            onChange={e => {
                                                const updated = [...openingHoursData]
                                                updated[idx] = { ...updated[idx], time: e.target.value }
                                                setOpeningHoursData(updated)
                                            }}
                                        />
                                        <div className='flex items-center gap-1.5 shrink-0'>
                                            <Switch
                                                checked={hour.isClosed}
                                                onCheckedChange={checked => {
                                                    const updated = [...openingHoursData]
                                                    updated[idx] = { ...updated[idx], isClosed: checked, time: checked ? '' : updated[idx].time }
                                                    setOpeningHoursData(updated)
                                                }}
                                            />
                                            <span className='text-xs text-muted-foreground'>Closed</span>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>

                        <FormField control={form.control} name='website' render={({ field }) => (
                            <FormItem className='space-y-1'>
                                <div className='flex items-center gap-2 mb-1'><Globe size={14} /><FormLabel className='mt-0'>Website</FormLabel></div>
                                <FormControl><Input placeholder='https://hospital.com' {...field} value={field.value ?? ''} /></FormControl>
                                <FormMessage />
                            </FormItem>
                        )} />

                        <FormField control={form.control} name='facilities' render={({ field }) => (
                            <FormItem className='space-y-1'>
                                <FormLabel>Facilities <span className='text-muted-foreground font-normal text-xs'>(comma-separated)</span></FormLabel>
                                <FormControl><Textarea className='min-h-[70px]' placeholder='Parking, Cafeteria, Pharmacy, Prayer Room, WiFi' {...field} value={field.value ?? ''} /></FormControl>
                                <FormMessage />
                            </FormItem>
                        )} />
                    </TabsContent>

                    <TabsContent value='content' className='space-y-6 mt-0'>
                        {/* Insurances */}
                        <FormField control={form.control} name='insurances' render={({ field }) => (
                            <FormItem className='space-y-1'>
                                <FormLabel>Accepted Insurance Providers <span className='text-muted-foreground font-normal text-xs'>(comma-separated)</span></FormLabel>
                                <FormControl><Input placeholder='Bima, MetLife, Green Delta, Pragati' {...field} value={field.value ?? ''} /></FormControl>
                                <FormMessage />
                            </FormItem>
                        )} />

                        {/* Accreditations */}
                        <div className='space-y-2'>
                            <div className='flex items-center justify-between'>
                                <span className='text-sm font-semibold'>Accreditations</span>
                                <Button type='button' variant='outline' size='sm' onClick={() => setAccreditationsData(prev => [...prev, { name: '', body: '', year: '' }])}>
                                    + Add
                                </Button>
                            </div>
                            {accreditationsData.length === 0 && (
                                <p className='text-xs text-muted-foreground py-2'>No accreditations added yet.</p>
                            )}
                            <div className='space-y-2'>
                                {accreditationsData.map((acc, idx) => (
                                    <div key={idx} className='grid grid-cols-3 gap-2 items-start rounded-lg border p-3'>
                                        <Input placeholder='Name (e.g. JCI)' value={acc.name} onChange={e => { const u = [...accreditationsData]; u[idx] = { ...u[idx], name: e.target.value }; setAccreditationsData(u) }} className='h-8 text-sm' />
                                        <Input placeholder='Body / Authority' value={acc.body} onChange={e => { const u = [...accreditationsData]; u[idx] = { ...u[idx], body: e.target.value }; setAccreditationsData(u) }} className='h-8 text-sm' />
                                        <div className='flex gap-1'>
                                            <Input placeholder='Year' value={acc.year} onChange={e => { const u = [...accreditationsData]; u[idx] = { ...u[idx], year: e.target.value }; setAccreditationsData(u) }} className='h-8 text-sm' />
                                            <Button type='button' variant='ghost' size='sm' className='h-8 px-2 text-destructive' onClick={() => setAccreditationsData(prev => prev.filter((_, i) => i !== idx))}>✕</Button>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>

                        {/* FAQs */}
                        <div className='space-y-2'>
                            <div className='flex items-center justify-between'>
                                <span className='text-sm font-semibold'>FAQs</span>
                                <Button type='button' variant='outline' size='sm' onClick={() => setFaqsData(prev => [...prev, { question: '', answer: '' }])}>
                                    + Add FAQ
                                </Button>
                            </div>
                            {faqsData.length === 0 && (
                                <p className='text-xs text-muted-foreground py-2'>No FAQs added yet.</p>
                            )}
                            <div className='space-y-3'>
                                {faqsData.map((faq, idx) => (
                                    <div key={idx} className='space-y-1.5 rounded-lg border p-3'>
                                        <div className='flex items-center gap-2'>
                                            <Input placeholder='Question' value={faq.question} onChange={e => { const u = [...faqsData]; u[idx] = { ...u[idx], question: e.target.value }; setFaqsData(u) }} className='h-8 text-sm flex-1' />
                                            <Button type='button' variant='ghost' size='sm' className='h-8 px-2 text-destructive shrink-0' onClick={() => setFaqsData(prev => prev.filter((_, i) => i !== idx))}>✕</Button>
                                        </div>
                                        <Textarea placeholder='Answer' value={faq.answer} onChange={e => { const u = [...faqsData]; u[idx] = { ...u[idx], answer: e.target.value }; setFaqsData(u) }} className='min-h-[60px] text-sm' />
                                    </div>
                                ))}
                            </div>
                        </div>
                    </TabsContent>
                </div>
             </Tabs>
          </form>
        </Form>

        <DialogFooter className='border-t p-6 mt-0'>
          <Button type='submit' form='hospital-form' className='w-full sm:w-auto'>Save changes</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
