'use client'

import { z } from 'zod'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { useEffect, useState, useRef } from 'react'
import { useQuery } from '@tanstack/react-query'
import { toast } from 'sonner'
import { Upload, Microscope, Image as ImageIcon } from 'lucide-react'
import api, { SERVER_URL } from '@/lib/api'
import { Button } from '@/components/ui/button'
import { Checkbox } from '@/components/ui/checkbox'
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
import { MultiSelect } from '@/components/multi-select'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"

const LAB_TYPES = ['Diagnostic Lab', 'Pathology Lab', 'Imaging Center', 'Multi-specialty Lab']

const formSchema = z.object({
  name: z.string().min(1, 'Name is required'),
  description: z.string().optional(),
  hotline: z.string().min(1, 'Hotline is required'),
  email: z.string().optional(),
  website: z.string().optional(),
  type: z.string().optional(),
  lat: z.string().min(1, 'Latitude is required'),
  lon: z.string().min(1, 'Longitude is required'),
  address: z.string().min(1, 'Address is required'),
  about: z.string().optional(),
  bdLocation: z.string().min(1, 'Location is required'),
  isOpen24_7: z.boolean(),
  rating: z.string().optional(),
})

type LabForm = z.infer<typeof formSchema>

type Props = {
  open: boolean
  onOpenChange: (open: boolean) => void
  currentRow?: any
  onSuccess: () => void
}

export function LabsActionDialog({ open, onOpenChange, currentRow, onSuccess }: Props) {
  const isEdit = !!currentRow

  const [testSearch, setTestSearch] = useState('')
  const [selectedTests, setSelectedTests] = useState<string[]>([])
  const [testPrices, setTestPrices] = useState<Record<string, string>>({})

  const { data: bdLocations = [] } = useQuery({
    queryKey: ['bd-locations-all'],
    queryFn: async () => {
      const res = await api.get('/bd-locations', { params: { limit: 1000 } })
      return Array.isArray(res.data) ? res.data : (res.data?.data || [])
    },
    enabled: open,
  })

  const { data: diagnosticTests = [] } = useQuery({
    queryKey: ['diagnostic-tests', testSearch],
    queryFn: async () => {
      const res = await api.get('/diagnostic-tests/public', { params: { search: testSearch, limit: 100 } })
      return Array.isArray(res.data) ? res.data : res.data?.data || []
    },
    enabled: open,
  })

  const [logoFile, setLogoFile] = useState<File | null>(null)
  const [logoPreview, setLogoPreview] = useState<string | null>(null)
  const logoInputRef = useRef<HTMLInputElement>(null)

  const [coverPhotoFile, setCoverPhotoFile] = useState<File | null>(null)
  const [coverPhotoPreview, setCoverPhotoPreview] = useState<string | null>(null)
  const coverPhotoInputRef = useRef<HTMLInputElement>(null)

  const form = useForm<LabForm>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: '',
      description: '',
      hotline: '',
      email: '',
      website: '',
      type: 'Diagnostic Lab',
      lat: '',
      lon: '',
      address: '',
      about: '',
      bdLocation: '',
      isOpen24_7: false,
      rating: '0',
    },
  })

  useEffect(() => {
    if (currentRow) {
      form.reset({
        ...currentRow,
        bdLocation: currentRow.bdLocation?._id || currentRow.bdLocation || '',
        lat: currentRow.location?.coordinates?.[1]?.toString() || '',
        lon: currentRow.location?.coordinates?.[0]?.toString() || '',
        email: currentRow.email || '',
        website: currentRow.website || '',
        type: currentRow.type || 'Diagnostic Lab',
        isOpen24_7: !!currentRow.isOpen24_7,
        rating: currentRow.rating?.toString() || '0',
        description: currentRow.description || '',
        about: currentRow.about || '',
      })
      if (currentRow.logo) setLogoPreview(`${SERVER_URL}${currentRow.logo}`)
      if (currentRow.cover_photo) setCoverPhotoPreview(`${SERVER_URL}${currentRow.cover_photo}`)

      if (currentRow.tests) {
        const ids = currentRow.tests.map((t: any) => t.test?._id || t.test || t._id)
        setSelectedTests(ids)
        const prices: Record<string, string> = {}
        currentRow.tests.forEach((t: any) => {
          prices[t.test?._id || t.test || t._id] = t.price?.toString() || ''
        })
        setTestPrices(prices)
      }
    } else {
      form.reset({
        name: '', description: '', hotline: '', email: '', website: '',
        type: 'Diagnostic Lab', lat: '', lon: '', address: '', about: '',
        bdLocation: '', isOpen24_7: false, rating: '0',
      })
      setLogoPreview(null); setLogoFile(null)
      setCoverPhotoPreview(null); setCoverPhotoFile(null)
      setSelectedTests([])
      setTestPrices({})
    }
  }, [currentRow, form, open])

  const handleLogoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      setLogoFile(file)
      const reader = new FileReader(); reader.onloadend = () => setLogoPreview(reader.result as string); reader.readAsDataURL(file)
    }
  }

  const handleCoverPhotoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      setCoverPhotoFile(file)
      const reader = new FileReader(); reader.onloadend = () => setCoverPhotoPreview(reader.result as string); reader.readAsDataURL(file)
    }
  }

  const handlePriceChange = (testId: string, price: string) => {
    setTestPrices(prev => ({ ...prev, [testId]: price }))
  }

  const onSubmit = async (values: LabForm) => {
    try {
      if (selectedTests.length === 0) {
        toast.error('Please select at least one test')
        return
      }

      const testPayload = selectedTests.map(id => ({
        testId: id,
        price: parseFloat(testPrices[id] || '0')
      }))

      const url = isEdit ? `/labs/${currentRow._id}` : '/labs'
      const method = isEdit ? 'patch' : 'post'

      const formData = new FormData()
      Object.entries(values).forEach(([key, value]) => {
        if (value !== undefined && key !== 'isOpen24_7') formData.append(key, value as string)
      })
      formData.append('isOpen24_7', values.isOpen24_7 ? 'true' : 'false')
      formData.append('tests', JSON.stringify(testPayload))

      if (logoFile) formData.append('logo', logoFile)
      if (coverPhotoFile) formData.append('cover_photo', coverPhotoFile)

      await api({
        method, url, data: formData,
        headers: { 'Content-Type': 'multipart/form-data' },
      })

      toast.success(isEdit ? 'Lab updated' : 'Lab added')
      onOpenChange(false); onSuccess()
    } catch (e) { toast.error('Failed to save lab') }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className='sm:max-w-2xl max-h-[90vh] overflow-y-auto px-0'>
        <DialogHeader className='text-start px-6'>
          <DialogTitle>{isEdit ? 'Edit Laboratory' : 'Add New Lab'}</DialogTitle>
          <DialogDescription>
            Configure laboratory details and pricing for tests.
          </DialogDescription>
        </DialogHeader>

        <Form {...form}>
          <form id='lab-form' onSubmit={form.handleSubmit(onSubmit)} className='space-y-6 px-6'>
            {/* Media Section */}
            <div className='grid grid-cols-2 gap-4 pb-4 border-b'>
              <div className='flex flex-col items-center space-y-2'>
                <span className='text-xs text-muted-foreground font-medium'>Logo</span>
                <Avatar className='h-24 w-24 border rounded-md'>
                  <AvatarImage src={logoPreview || ''} />
                  <AvatarFallback><Microscope size={40} /></AvatarFallback>
                </Avatar>
                <input type='file' ref={logoInputRef} onChange={handleLogoChange} className='hidden' accept='image/*' />
                <Button type='button' variant='outline' size='sm' onClick={() => logoInputRef.current?.click()}>
                  <Upload size={14} className='mr-2' /> Select Logo
                </Button>
              </div>
              <div className='flex flex-col items-center space-y-2'>
                <span className='text-xs text-muted-foreground font-medium'>Cover Photo</span>
                <div className='h-24 w-full border rounded-md overflow-hidden bg-muted flex items-center justify-center'>
                  {coverPhotoPreview ? (
                    <img src={coverPhotoPreview} alt='Cover' className='h-full w-full object-cover' />
                  ) : (
                    <ImageIcon size={32} className='text-muted-foreground/40' />
                  )}
                </div>
                <input type='file' ref={coverPhotoInputRef} onChange={handleCoverPhotoChange} className='hidden' accept='image/*' />
                <Button type='button' variant='outline' size='sm' onClick={() => coverPhotoInputRef.current?.click()}>
                  <Upload size={14} className='mr-2' /> Select Cover
                </Button>
              </div>
            </div>

            <div className='grid grid-cols-1 gap-4'>
              <FormField control={form.control} name='name' render={({ field }) => (
                <FormItem>
                  <FormLabel>Lab Name</FormLabel>
                  <FormControl><Input placeholder='Care Diagnostic Center' {...field} /></FormControl>
                  <FormMessage />
                </FormItem>
              )} />

              <FormField control={form.control} name='description' render={({ field }) => (
                <FormItem>
                  <FormLabel>Description</FormLabel>
                  <FormControl><Textarea placeholder='Short description of the lab...' rows={2} {...field} /></FormControl>
                  <FormMessage />
                </FormItem>
              )} />

              <div className='grid grid-cols-2 gap-4'>
                <FormField control={form.control} name='hotline' render={({ field }) => (
                  <FormItem>
                    <FormLabel>Hotline</FormLabel>
                    <FormControl><Input placeholder='10666' {...field} /></FormControl>
                    <FormMessage />
                  </FormItem>
                )} />
                <FormField control={form.control} name='bdLocation' render={({ field }) => (
                  <FormItem>
                    <FormLabel>Location</FormLabel>
                    <Select onValueChange={field.onChange} value={field.value || undefined}>
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
              </div>

              <div className='grid grid-cols-2 gap-4'>
                <FormField control={form.control} name='email' render={({ field }) => (
                  <FormItem>
                    <FormLabel>Email</FormLabel>
                    <FormControl><Input placeholder='info@lab.com' {...field} /></FormControl>
                    <FormMessage />
                  </FormItem>
                )} />
                <FormField control={form.control} name='website' render={({ field }) => (
                  <FormItem>
                    <FormLabel>Website</FormLabel>
                    <FormControl><Input placeholder='https://lab.com' {...field} /></FormControl>
                    <FormMessage />
                  </FormItem>
                )} />
              </div>

              <div className='grid grid-cols-2 gap-4'>
                <FormField control={form.control} name='type' render={({ field }) => (
                  <FormItem>
                    <FormLabel>Lab Type</FormLabel>
                    <Select onValueChange={field.onChange} value={field.value}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select type" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {LAB_TYPES.map((t) => (
                          <SelectItem key={t} value={t}>{t}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )} />
                <FormField control={form.control} name='rating' render={({ field }) => (
                  <FormItem>
                    <FormLabel>Rating (0–5)</FormLabel>
                    <FormControl><Input type='number' min='0' max='5' step='0.1' placeholder='0' {...field} /></FormControl>
                    <FormMessage />
                  </FormItem>
                )} />
              </div>

              <FormField control={form.control} name='isOpen24_7' render={({ field }) => (
                <FormItem className='flex items-center gap-3 space-y-0 rounded-lg border border-white/5 bg-black/20 p-3'>
                  <FormControl>
                    <Checkbox checked={field.value} onCheckedChange={field.onChange} />
                  </FormControl>
                  <FormLabel className='cursor-pointer font-medium'>Open 24/7</FormLabel>
                </FormItem>
              )} />

              <div className='space-y-4 border rounded-lg p-4 bg-black/20'>
                <FormLabel>Test Catalog & Pricing</FormLabel>
                <MultiSelect
                  options={diagnosticTests.map((t: any) => ({ label: t.name, value: t._id }))}
                  onValueChange={setSelectedTests}
                  defaultValue={selectedTests}
                  placeholder="Select tests offered..."
                  variant="inverted"
                  onSearchValueChange={setTestSearch}
                />

                {selectedTests.length > 0 && (
                  <div className='mt-4 space-y-3'>
                    <span className='text-[10px] font-bold uppercase text-muted-foreground'>Set Lab Specific Prices</span>
                    <div className='grid grid-cols-1 gap-2'>
                      {selectedTests.map(testId => {
                        const testObj = diagnosticTests.find((t: any) => t._id === testId) ||
                                       (currentRow?.tests?.find((t: any) => (t.test?._id || t.test) === testId)?.test)
                        return (
                          <div key={testId} className='flex items-center gap-2 bg-black/40 p-2 rounded border border-white/5'>
                            <span className='text-xs flex-1'>{testObj?.name || 'Loading...'}</span>
                            <Input
                              type='number'
                              placeholder='Price'
                              className='w-24 h-8 text-xs'
                              value={testPrices[testId] || ''}
                              onChange={(e) => handlePriceChange(testId, e.target.value)}
                            />
                          </div>
                        )
                      })}
                    </div>
                  </div>
                )}
              </div>

              <FormField control={form.control} name='address' render={({ field }) => (
                <FormItem>
                  <FormLabel>Address</FormLabel>
                  <FormControl><Textarea placeholder='123 Lab St, Town' {...field} /></FormControl>
                  <FormMessage />
                </FormItem>
              )} />

              <FormField control={form.control} name='about' render={({ field }) => (
                <FormItem>
                  <FormLabel>About</FormLabel>
                  <FormControl><Textarea placeholder='Detailed description about the lab...' rows={3} {...field} /></FormControl>
                  <FormMessage />
                </FormItem>
              )} />

              <div className='grid grid-cols-2 gap-4'>
                <FormField control={form.control} name='lat' render={({ field }) => (
                  <FormItem>
                    <FormLabel>Latitude</FormLabel>
                    <FormControl><Input placeholder='23.8' {...field} /></FormControl>
                    <FormMessage />
                  </FormItem>
                )} />
                <FormField control={form.control} name='lon' render={({ field }) => (
                  <FormItem>
                    <FormLabel>Longitude</FormLabel>
                    <FormControl><Input placeholder='90.4' {...field} /></FormControl>
                    <FormMessage />
                  </FormItem>
                )} />
              </div>
            </div>
          </form>
        </Form>

        <DialogFooter className='px-6 mt-4'>
          <Button type='submit' form='lab-form' className='w-full'>Save Laboratory Information</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
