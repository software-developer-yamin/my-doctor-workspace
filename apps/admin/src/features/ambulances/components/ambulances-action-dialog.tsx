'use client'

import { z } from 'zod'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { useEffect, useState, useRef } from 'react'
import { useQuery } from '@tanstack/react-query'
import { toast } from 'sonner'
import { Upload, ImageIcon } from 'lucide-react'
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
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"

const DEFAULT_TYPES = ['AC', 'Non-AC', 'ACLS', 'ALS', 'Freezing', 'ICU', 'NICU', 'AIR']

const formSchema = z.object({
  name: z.string().min(1, 'Name is required'),
  bdLocation: z.string().min(1, 'Location is required'),
  phone: z.string().optional().or(z.literal('')),
  rating: z.string().optional().or(z.literal('')),
  responseTime: z.string().optional().or(z.literal('')),
  services: z.string().optional().or(z.literal('')),
  driving_license_number: z.string().min(1, 'Driving license number is required'),
  ambulance_type: z.string().min(1, 'Ambulance type is required'),
  ambulance_number: z.string().min(1, 'Ambulance number is required'),
  status: z.enum(['Active', 'Inactive']),
})

type AmbulanceForm = z.infer<typeof formSchema>

type Props = {
  open: boolean
  onOpenChange: (open: boolean) => void
  currentRow?: any
  onSuccess: () => void
}

export function AmbulancesActionDialog({ open, onOpenChange, currentRow, onSuccess }: Props) {
  const isEdit = !!currentRow

  const [imageFile, setImageFile] = useState<File | null>(null)
  const [imagePreview, setImagePreview] = useState<string | null>(null)
  const imageInputRef = useRef<HTMLInputElement>(null)

  const { data: bdLocations = [] } = useQuery({
    queryKey: ['bd-locations-all'],
    queryFn: async () => {
      const res = await api.get('/bd-locations', { params: { limit: 1000 } })
      return Array.isArray(res.data) ? res.data : res.data?.data ?? []
    },
    enabled: open,
  })

  const { data: fetchedTypes = [] } = useQuery<string[]>({
    queryKey: ['ambulance-filters'],
    queryFn: async () => {
      const res = await api.get('/ambulances/filters')
      return res.data?.types ?? []
    },
    staleTime: 30 * 60 * 1000,
  })

  const ambulanceTypes = fetchedTypes.length > 0 ? fetchedTypes : DEFAULT_TYPES

  const form = useForm<AmbulanceForm>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: '',
      bdLocation: '',
      phone: '',
      rating: '',
      responseTime: '',
      services: '',
      driving_license_number: '',
      ambulance_type: '',
      ambulance_number: '',
      status: 'Active',
    },
  })

  useEffect(() => {
    if (open) {
      setImageFile(null)
      if (currentRow) {
        form.reset({
          name: currentRow.name || '',
          bdLocation: currentRow.bdLocation?._id || currentRow.bdLocation || '',
          phone: currentRow.phone || '',
          rating: currentRow.rating != null ? String(currentRow.rating) : '',
          responseTime: currentRow.responseTime || '',
          services: currentRow.services || '',
          driving_license_number: currentRow.driving_license_number || '',
          ambulance_type: currentRow.ambulance_type || '',
          ambulance_number: currentRow.ambulance_number || '',
          status: currentRow.status || 'Active',
        })
        setImagePreview(currentRow.image ? `${SERVER_URL}${currentRow.image}` : null)
      } else {
        form.reset({
          name: '',
          bdLocation: '',
          phone: '',
          rating: '',
          responseTime: '',
          services: '',
          driving_license_number: '',
          ambulance_type: '',
          ambulance_number: '',
          status: 'Active',
        })
        setImagePreview(null)
      }
    }
  }, [currentRow, form, open])

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      setImageFile(file)
      const reader = new FileReader()
      reader.onloadend = () => setImagePreview(reader.result as string)
      reader.readAsDataURL(file)
    }
  }

  const onSubmit = async (values: AmbulanceForm) => {
    try {
      const formData = new FormData()
      Object.entries(values).forEach(([k, v]) => {
        if (v !== undefined && v !== null) formData.append(k, String(v))
      })
      if (imageFile) formData.append('image', imageFile)

      if (isEdit) {
        await api.patch(`/ambulances/${currentRow._id}`, formData, {
          headers: { 'Content-Type': 'multipart/form-data' },
        })
      } else {
        await api.post('/ambulances', formData, {
          headers: { 'Content-Type': 'multipart/form-data' },
        })
      }
      toast.success(isEdit ? 'Ambulance updated' : 'Ambulance added')
      onOpenChange(false)
      onSuccess()
    } catch (e) {
      toast.error('Failed to save ambulance')
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className='sm:max-w-lg'>
        <DialogHeader className='text-start'>
          <DialogTitle>{isEdit ? 'Edit Ambulance' : 'Add New Ambulance'}</DialogTitle>
          <DialogDescription>
            {isEdit ? 'Update ambulance details here.' : 'Enter details of the new ambulance.'}
          </DialogDescription>
        </DialogHeader>

        <Form {...form}>
          <form id='ambulance-form' onSubmit={form.handleSubmit(onSubmit)} className='space-y-4'>
            {/* Image Upload */}
            <div className='flex items-center gap-4'>
              <Avatar className='h-16 w-16 rounded-xl border border-white/10'>
                <AvatarImage src={imagePreview || ''} className='object-cover' />
                <AvatarFallback className='rounded-xl bg-primary/10'>
                  <ImageIcon size={24} className='text-primary/50' />
                </AvatarFallback>
              </Avatar>
              <div className='flex flex-col gap-1'>
                <p className='text-sm font-medium'>Ambulance Image</p>
                <p className='text-xs text-muted-foreground'>JPG, PNG or WebP</p>
                <input
                  type='file'
                  ref={imageInputRef}
                  onChange={handleImageChange}
                  className='hidden'
                  accept='image/*'
                />
                <Button
                  type='button'
                  variant='outline'
                  size='sm'
                  onClick={() => imageInputRef.current?.click()}
                  className='mt-1 h-8 gap-1.5 text-xs'
                >
                  <Upload size={13} /> Upload Image
                </Button>
              </div>
            </div>

            <FormField control={form.control} name='name' render={({ field }) => (
              <FormItem>
                <FormLabel>Driver/Ambulance Name</FormLabel>
                <FormControl><Input placeholder='John Doe / Red Cross 01' {...field} /></FormControl>
                <FormMessage />
              </FormItem>
            )} />

            <div className='grid grid-cols-2 gap-4'>
              <FormField control={form.control} name='phone' render={({ field }) => (
                <FormItem>
                  <FormLabel>Phone Number</FormLabel>
                  <FormControl><Input placeholder='+880 1234-567890' {...field} /></FormControl>
                  <FormMessage />
                </FormItem>
              )} />

              <FormField control={form.control} name='rating' render={({ field }) => (
                <FormItem>
                  <FormLabel>Rating</FormLabel>
                  <FormControl><Input placeholder='4.8 (120+)' {...field} /></FormControl>
                  <FormMessage />
                </FormItem>
              )} />
            </div>

            <div className='grid grid-cols-2 gap-4'>
              <FormField control={form.control} name='responseTime' render={({ field }) => (
                <FormItem>
                  <FormLabel>Response Time</FormLabel>
                  <FormControl><Input placeholder='10 min' {...field} /></FormControl>
                  <FormMessage />
                </FormItem>
              )} />

              <FormField control={form.control} name='services' render={({ field }) => (
                <FormItem>
                  <FormLabel>Services</FormLabel>
                  <FormControl><Input placeholder='24/7' {...field} /></FormControl>
                  <FormMessage />
                </FormItem>
              )} />
            </div>

            <div className='grid grid-cols-2 gap-4'>
              <FormField control={form.control} name='bdLocation' render={({ field }) => (
                <FormItem>
                  <FormLabel>Location</FormLabel>
                  <Select onValueChange={field.onChange} defaultValue={field.value} value={field.value}>
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Select location" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {bdLocations.map((loc: any) => (
                        <SelectItem key={loc._id} value={loc._id}>{loc.district} - {loc.upazila}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )} />

              <FormField control={form.control} name='ambulance_type' render={({ field }) => (
                <FormItem>
                  <FormLabel>Ambulance Type</FormLabel>
                  <Select onValueChange={field.onChange} defaultValue={field.value} value={field.value}>
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Select type" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {ambulanceTypes.map((t) => (
                        <SelectItem key={t} value={t}>{t}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )} />
            </div>

            <div className='grid grid-cols-2 gap-4'>
              <FormField control={form.control} name='ambulance_number' render={({ field }) => (
                <FormItem>
                  <FormLabel>Ambulance Number</FormLabel>
                  <FormControl><Input placeholder='DHA-KA-1234' {...field} /></FormControl>
                  <FormMessage />
                </FormItem>
              )} />

              <FormField control={form.control} name='driving_license_number' render={({ field }) => (
                <FormItem>
                  <FormLabel>Driving License</FormLabel>
                  <FormControl><Input placeholder='DL-12345678' {...field} /></FormControl>
                  <FormMessage />
                </FormItem>
              )} />
            </div>

            <FormField control={form.control} name='status' render={({ field }) => (
              <FormItem>
                <FormLabel>Status</FormLabel>
                <Select onValueChange={field.onChange} defaultValue={field.value} value={field.value}>
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Select status" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    <SelectItem value="Active">Active</SelectItem>
                    <SelectItem value="Inactive">Inactive</SelectItem>
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )} />
          </form>
        </Form>

        <DialogFooter>
          <Button type='submit' form='ambulance-form'>Save changes</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
