'use client'

import { z } from 'zod'
import { useForm, useFieldArray } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { useEffect, useState, useRef } from 'react'
import { useQuery } from '@tanstack/react-query'
import { toast } from 'sonner'
import { Plus, X, Upload } from 'lucide-react'
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
import { Checkbox } from '@/components/ui/checkbox'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'


const formSchema = z.object({
  name: z.string().min(1, 'Name is required'),
  email: z.string().email('Invalid email address'),
  phone: z.string().optional().or(z.literal('')),
  password: z.string().min(8, 'Password must be at least 8 characters').optional().or(z.literal('')),
  gender: z.enum(['Male', 'Female'], { message: 'Gender is required' }),
  years_of_experience: z.number().min(0, 'Must be 0 or greater'),
  isAvailableHome: z.boolean(),

  degrees: z.string().min(1, 'Degrees are required'),
  short_description: z.string().min(1, 'Short description is required'),
  BMDC_REG_NO: z.string().min(1, 'BMDC REG NO is required'),
  about: z.string().min(1, 'About is required'),
  field_of_concentration: z.array(z.string()).min(1, 'At least one field is required'),
  specializations: z.array(z.string()).min(1, 'At least one specialization is required'),
  educations: z.array(z.object({ value: z.string() })).min(1, 'At least one education entry is required'),

  // New boolean flags
  isVerified: z.boolean(),
  isFeatured: z.boolean(),

  // New number
  totalPatients: z.number().min(0),

  // New dynamic string arrays
  languages: z.array(z.object({ value: z.string() })).optional(),
  services: z.array(z.object({ value: z.string() })).optional(),
  conditions_treated: z.array(z.object({ value: z.string() })).optional(),
  insurance_accepted: z.array(z.object({ value: z.string() })).optional(),

  // Social links
  social_links: z.object({
    facebook: z.string().optional().or(z.literal('')),
    twitter: z.string().optional().or(z.literal('')),
    linkedin: z.string().optional().or(z.literal('')),
    website: z.string().optional().or(z.literal('')),
  }).optional(),

  // Complex dynamic arrays
  awards: z.array(z.object({
    title: z.string(),
    year: z.string(),
    description: z.string().optional().or(z.literal('')),
  })).optional(),
  publications: z.array(z.object({
    title: z.string(),
    journal: z.string(),
    year: z.string(),
    url: z.string().optional().or(z.literal('')),
  })).optional(),
  faqs: z.array(z.object({
    question: z.string(),
    answer: z.string(),
  })).optional(),
})

type DoctorForm = z.infer<typeof formSchema>;

type Props = {
  open: boolean
  onOpenChange: (open: boolean) => void
  currentRow?: any
  onSuccess: () => void
}

export function DoctorsActionDialog({ open, onOpenChange, currentRow, onSuccess }: Props) {
  const isEdit = !!currentRow

  const [specSearch, setSpecSearch] = useState('')
  const [concSearch, setConcSearch] = useState('')

  const { data: specialities = [] } = useQuery({
    queryKey: ['specialities', specSearch],
    queryFn: async () => {
      const res = await api.get('/specialities', { params: { search: specSearch, limit: 100 } })
      return Array.isArray(res.data) ? res.data : res.data?.data ?? []
    },
    enabled: open,
  })

  const { data: concentrations = [] } = useQuery({
    queryKey: ['concentrations', concSearch],
    queryFn: async () => {
      const res = await api.get('/concentrations', { params: { search: concSearch, limit: 100 } })
      return Array.isArray(res.data) ? res.data : res.data?.data ?? []
    },
    enabled: open,
  })

  const [file, setFile] = useState<File | null>(null)
  const [preview, setPreview] = useState<string | null>(null)
  const fileInputRef = useRef<HTMLInputElement>(null)

  const form = useForm<DoctorForm>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: '',
      email: '',
      phone: '',
      password: '',
      gender: undefined as unknown as 'Male' | 'Female',
      years_of_experience: 0,
      isAvailableHome: false,

      degrees: '',
      short_description: '',
      BMDC_REG_NO: '',
      about: '',
      field_of_concentration: [],
      specializations: [],
      educations: [{ value: '' }],

      isVerified: false,
      isFeatured: false,
      totalPatients: 0,
      languages: [],
      services: [],
      conditions_treated: [],
      insurance_accepted: [],
      social_links: { facebook: '', twitter: '', linkedin: '', website: '' },
      awards: [],
      publications: [],
      faqs: [],
    },
  })

  const { fields: eduFields, append: appendEdu, remove: removeEdu } = useFieldArray({
    control: form.control,
    name: 'educations',
  })

  const { fields: langFields, append: appendLang, remove: removeLang } = useFieldArray({
    control: form.control,
    name: 'languages',
  })

  const { fields: serviceFields, append: appendService, remove: removeService } = useFieldArray({
    control: form.control,
    name: 'services',
  })

  const { fields: conditionFields, append: appendCondition, remove: removeCondition } = useFieldArray({
    control: form.control,
    name: 'conditions_treated',
  })

  const { fields: insuranceFields, append: appendInsurance, remove: removeInsurance } = useFieldArray({
    control: form.control,
    name: 'insurance_accepted',
  })

  const { fields: awardFields, append: appendAward, remove: removeAward } = useFieldArray({
    control: form.control,
    name: 'awards',
  })

  const { fields: pubFields, append: appendPub, remove: removePub } = useFieldArray({
    control: form.control,
    name: 'publications',
  })

  const { fields: faqFields, append: appendFaq, remove: removeFaq } = useFieldArray({
    control: form.control,
    name: 'faqs',
  })

  useEffect(() => {
    if (currentRow) {
      form.reset({
        ...currentRow,
        email: currentRow.email || '',
        phone: currentRow.phone || '',
        gender: currentRow.gender || undefined,
        years_of_experience: typeof currentRow.years_of_experience === 'number' ? currentRow.years_of_experience : 0,
        isAvailableHome: currentRow.isAvailableHome || false,
        password: '',

        specializations: currentRow.specializations?.map((s: any) => s._id || s) || [],
        field_of_concentration: currentRow.field_of_concentration?.map((c: any) => c._id || c) || [],
        educations: currentRow.educations?.map((e: string) => ({ value: e })) || [{ value: '' }],

        isVerified: currentRow.isVerified || false,
        isFeatured: currentRow.isFeatured || false,
        totalPatients: currentRow.totalPatients || 0,
        languages: currentRow.languages?.map((l: string) => ({ value: l })) || [],
        services: currentRow.services?.map((s: string) => ({ value: s })) || [],
        conditions_treated: currentRow.conditions_treated?.map((c: string) => ({ value: c })) || [],
        insurance_accepted: currentRow.insurance_accepted?.map((i: string) => ({ value: i })) || [],
        social_links: currentRow.social_links || { facebook: '', twitter: '', linkedin: '', website: '' },
        awards: currentRow.awards?.map((a: any) => ({ title: a.title || '', year: String(a.year || ''), description: a.description || '' })) || [],
        publications: currentRow.publications?.map((p: any) => ({ title: p.title || '', journal: p.journal || '', year: String(p.year || ''), url: p.url || '' })) || [],
        faqs: currentRow.faqs?.map((f: any) => ({ question: f.question || '', answer: f.answer || '' })) || [],
      })
      if (currentRow.photo) {
        setPreview(`${SERVER_URL}${currentRow.photo}`)
      }
    } else {
      form.reset({
        name: '',
        email: '',
        phone: '',
        gender: undefined as unknown as 'Male' | 'Female',
        years_of_experience: 0,
        isAvailableHome: false,
        password: '',

        degrees: '',
        short_description: '',
        BMDC_REG_NO: '',
        about: '',
        field_of_concentration: [],
        specializations: [],
        educations: [{ value: '' }],

        isVerified: false,
        isFeatured: false,
        totalPatients: 0,
        languages: [],
        services: [],
        conditions_treated: [],
        insurance_accepted: [],
        social_links: { facebook: '', twitter: '', linkedin: '', website: '' },
        awards: [],
        publications: [],
        faqs: [],
      })
      setPreview(null)
      setFile(null)
    }
  }, [currentRow, form, open])

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0]
    if (selectedFile) {
      setFile(selectedFile)
      const reader = new FileReader()
      reader.onloadend = () => {
        setPreview(reader.result as string)
      }
      reader.readAsDataURL(selectedFile)
    }
  }

  const onSubmit = async (values: DoctorForm) => {
    try {
      const url = isEdit
        ? `/doctors/${currentRow._id}`
        : '/doctors'
      const method = isEdit ? 'patch' : 'post'

      const formData = new FormData()
      Object.entries(values).forEach(([key, value]) => {
        if (key === 'specializations' || key === 'field_of_concentration') {
          formData.append(key, JSON.stringify(value))
        } else if (key === 'educations') {
          const stringEducations = (value as { value: string }[]).map(e => e.value)
          formData.append(key, JSON.stringify(stringEducations))
        } else if (['isAvailableHome', 'isVerified', 'isFeatured'].includes(key)) {
          formData.append(key, String(value))
        } else if (key === 'totalPatients') {
          formData.append(key, String(value ?? 0))
        } else if (['languages', 'services', 'conditions_treated', 'insurance_accepted'].includes(key)) {
          formData.append(key, JSON.stringify((value as any[]).map((v: any) => v.value).filter(Boolean)))
        } else if (key === 'social_links') {
          formData.append(key, JSON.stringify(value))
        } else if (key === 'awards') {
          formData.append(key, JSON.stringify((value as any[]).map((a: any) => ({ ...a, year: Number(a.year) || 0 }))))
        } else if (key === 'publications') {
          formData.append(key, JSON.stringify((value as any[]).map((p: any) => ({ ...p, year: Number(p.year) || 0 }))))
        } else if (key === 'faqs') {
          formData.append(key, JSON.stringify(value))
        } else if (key === 'password' && !value) {
          // skip empty password on edit
        } else {
          formData.append(key, value as string)
        }
      })

      if (file) {
        formData.append('photo', file)
      }

      const res = await api({
        method,
        url,
        data: formData,
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      })

      if (res.status === 200 || res.status === 201) {
        toast.success(isEdit ? 'Doctor updated' : 'Doctor added')
        onOpenChange(false)
        onSuccess()
      } else {
        throw new Error()
      }
    } catch (e) {
      toast.error('Failed to save doctor')
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className='sm:max-w-2xl max-h-[90vh] flex flex-col'>
        <DialogHeader className='text-start'>
          <DialogTitle>{isEdit ? 'Edit Doctor' : 'Add New Doctor'}</DialogTitle>
          <DialogDescription>
            {isEdit ? 'Update the doctor here. ' : 'Create new doctor here. '}
            Click save when you&apos;re done.
          </DialogDescription>
        </DialogHeader>

        <Form {...form}>
          <form id='doctor-form' onSubmit={form.handleSubmit(onSubmit)} className='space-y-4 overflow-y-auto px-1 py-4 flex-1'>
            {/* Photo Upload */}
            <div className='flex flex-col items-center justify-center space-y-4 py-4'>
              <Avatar className='h-24 w-24 border'>
                <AvatarImage src={preview || ''} />
                <AvatarFallback>DR</AvatarFallback>
              </Avatar>
              <input
                type='file'
                ref={fileInputRef}
                onChange={handleFileChange}
                className='hidden'
                accept='image/*'
              />
              <Button type='button' variant='outline' size='sm' onClick={() => fileInputRef.current?.click()}>
                <Upload size={14} className='mr-2' /> {preview ? 'Change Photo' : 'Upload Photo'}
              </Button>
            </div>

            {/* Name */}
            <FormField
              control={form.control}
              name='name'
              render={({ field }) => (
                <FormItem className='grid grid-cols-6 items-center gap-x-4 gap-y-1'>
                  <FormLabel className='col-span-2 text-end'>Name</FormLabel>
                  <FormControl className='col-span-4'>
                    <Input placeholder='Dr. John Doe' {...field} />
                  </FormControl>
                  <FormMessage className='col-span-4 col-start-3' />
                </FormItem>
              )}
            />

            {/* Email */}
            <FormField
              control={form.control}
              name='email'
              render={({ field }) => (
                <FormItem className='grid grid-cols-6 items-center gap-x-4 gap-y-1'>
                  <FormLabel className='col-span-2 text-end'>Email</FormLabel>
                  <FormControl className='col-span-4'>
                    <Input placeholder='doctor@example.com' {...field} />
                  </FormControl>
                  <FormMessage className='col-span-4 col-start-3' />
                </FormItem>
              )}
            />

            {/* Phone */}
            <FormField
              control={form.control}
              name='phone'
              render={({ field }) => (
                <FormItem className='grid grid-cols-6 items-center gap-x-4 gap-y-1'>
                  <FormLabel className='col-span-2 text-end'>Phone</FormLabel>
                  <FormControl className='col-span-4'>
                    <Input placeholder='+8801XXXXXXXXX' {...field} />
                  </FormControl>
                  <FormMessage className='col-span-4 col-start-3' />
                </FormItem>
              )}
            />

            {/* Gender */}
            <FormField
              control={form.control}
              name='gender'
              render={({ field }) => (
                <FormItem className='grid grid-cols-6 items-center gap-x-4 gap-y-1'>
                  <FormLabel className='col-span-2 text-end'>Gender</FormLabel>
                  <Select onValueChange={field.onChange} value={field.value}>
                    <FormControl className='col-span-4'>
                      <SelectTrigger>
                        <SelectValue placeholder='Select gender' />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value='Male'>Male</SelectItem>
                      <SelectItem value='Female'>Female</SelectItem>
                    </SelectContent>
                  </Select>
                  <FormMessage className='col-span-4 col-start-3' />
                </FormItem>
              )}
            />

            {/* Years of Experience */}
            <FormField
              control={form.control}
              name='years_of_experience'
              render={({ field }) => (
                <FormItem className='grid grid-cols-6 items-center gap-x-4 gap-y-1'>
                  <FormLabel className='col-span-2 text-end'>Years of Experience</FormLabel>
                  <FormControl className='col-span-4'>
                    <Input
                      type='number'
                      min={0}
                      placeholder='e.g. 10'
                      value={field.value ?? 0}
                      onChange={(e) => {
                        const v = e.target.valueAsNumber
                        field.onChange(Number.isNaN(v) ? 0 : v)
                      }}
                      onBlur={field.onBlur}
                      name={field.name}
                      ref={field.ref}
                    />
                  </FormControl>
                  <FormMessage className='col-span-4 col-start-3' />
                </FormItem>
              )}
            />

            {/* Password */}
            <FormField
              control={form.control}
              name='password'
              render={({ field }) => (
                <FormItem className='grid grid-cols-6 items-center gap-x-4 gap-y-1'>
                  <FormLabel className='col-span-2 text-end'>Password</FormLabel>
                  <FormControl className='col-span-4'>
                    <PasswordInput placeholder={isEdit ? 'Leave blank to keep same' : 'Minimum 8 characters'} {...field} />
                  </FormControl>
                  <FormMessage className='col-span-4 col-start-3' />
                </FormItem>
              )}
            />

            {/* Degrees */}
            <FormField
              control={form.control}
              name='degrees'
              render={({ field }) => (
                <FormItem className='grid grid-cols-6 items-center gap-x-4 gap-y-1'>
                  <FormLabel className='col-span-2 text-end'>Degrees</FormLabel>
                  <FormControl className='col-span-4'>
                    <Input placeholder='MBBS, MD' {...field} />
                  </FormControl>
                  <FormMessage className='col-span-4 col-start-3' />
                </FormItem>
              )}
            />

            {/* BMDC REG NO */}
            <FormField
              control={form.control}
              name='BMDC_REG_NO'
              render={({ field }) => (
                <FormItem className='grid grid-cols-6 items-center gap-x-4 gap-y-1'>
                  <FormLabel className='col-span-2 text-end'>BMDC REG NO</FormLabel>
                  <FormControl className='col-span-4'>
                    <Input placeholder='A-12345' {...field} />
                  </FormControl>
                  <FormMessage className='col-span-4 col-start-3' />
                </FormItem>
              )}
            />

            {/* Short Description */}
            <FormField
              control={form.control}
              name='short_description'
              render={({ field }) => (
                <FormItem className='grid grid-cols-6 items-center gap-x-4 gap-y-1'>
                  <FormLabel className='col-span-2 text-end'>Short Description</FormLabel>
                  <FormControl className='col-span-4'>
                    <Input placeholder='Consultant Cardiologist' {...field} />
                  </FormControl>
                  <FormMessage className='col-span-4 col-start-3' />
                </FormItem>
              )}
            />

            {/* Is Available Home */}
            <FormField
              control={form.control}
              name='isAvailableHome'
              render={({ field }) => (
                <FormItem className='flex flex-row items-start space-x-3 space-y-0 rounded-md border p-4 col-span-6'>
                  <FormControl>
                    <Checkbox
                      checked={field.value}
                      onCheckedChange={field.onChange}
                    />
                  </FormControl>
                  <div className='space-y-1 leading-none'>
                    <FormLabel>
                      Available for Home Service
                    </FormLabel>
                    <p className='text-xs text-muted-foreground'>
                      Check this if the doctor is available for house calls or home consultations.
                    </p>
                  </div>
                </FormItem>
              )}
            />

            {/* About */}
            <FormField
              control={form.control}
              name='about'
              render={({ field }) => (
                <FormItem className='grid grid-cols-6 items-start gap-x-4 gap-y-1'>
                  <FormLabel className='col-span-2 text-end mt-3'>About</FormLabel>
                  <FormControl className='col-span-4'>
                    <Textarea placeholder='Detail about the doctor...' className='min-h-[100px]' {...field} />
                  </FormControl>
                  <FormMessage className='col-span-4 col-start-3' />
                </FormItem>
              )}
            />

            {/* Specializations (Selected from list) */}
            <FormField
              control={form.control}
              name='specializations'
              render={({ field }) => (
                <FormItem className='grid grid-cols-6 items-start gap-x-4 gap-y-1'>
                  <FormLabel className='col-span-2 text-end mt-3'>Specializations</FormLabel>
                  <FormControl className='col-span-4'>
                    <div className="space-y-1">
                      <MultiSelect
                        options={specialities.map((s: any) => ({ label: s.name, value: s._id }))}
                        onValueChange={field.onChange}
                        defaultValue={field.value}
                        placeholder="Select specializations"
                        variant="inverted"
                        maxCount={3}
                        onSearchValueChange={setSpecSearch}
                      />
                    </div>
                  </FormControl>
                  <FormMessage className='col-span-4 col-start-3' />
                </FormItem>
              )}
            />

            {/* Fields of Concentration (MultiSelect) */}
            <FormField
              control={form.control}
              name='field_of_concentration'
              render={({ field }) => (
                <FormItem className='grid grid-cols-6 items-start gap-x-4 gap-y-1'>
                  <FormLabel className='col-span-2 text-end mt-3'>Concentration Fields</FormLabel>
                  <FormControl className='col-span-4'>
                    <div className="space-y-1">
                      <MultiSelect
                        options={concentrations.map((c: any) => ({ label: c.name, value: c._id }))}
                        onValueChange={field.onChange}
                        defaultValue={field.value}
                        placeholder="Select concentrations"
                        variant="inverted"
                        maxCount={3}
                        onSearchValueChange={setConcSearch}
                      />
                    </div>
                  </FormControl>
                  <FormMessage className='col-span-4 col-start-3' />
                </FormItem>
              )}
            />

            {/* Educations (Dynamic Array) */}
            <div className='grid grid-cols-6 items-start gap-x-4 gap-y-2'>
              <FormLabel className='col-span-2 text-end mt-3'>Educations</FormLabel>
              <div className='col-span-4 space-y-2'>
                {eduFields.map((field, index) => (
                  <div key={field.id} className='flex gap-2'>
                    <Input {...form.register(`educations.${index}.value`)} placeholder='MBBS from DMC' />
                    <Button type='button' variant='ghost' size='icon' onClick={() => removeEdu(index)}>
                      <X size={16} className='text-destructive' />
                    </Button>
                  </div>
                ))}
                <Button type='button' variant='outline' size='sm' className='mt-2' onClick={() => appendEdu({ value: '' })}>
                  <Plus size={14} className='mr-1' /> Add Education
                </Button>
                {form.formState.errors.educations && <p className='text-destructive text-sm'>{form.formState.errors.educations.message}</p>}
              </div>
            </div>

            {/* ── Status & Stats ── */}
            <div className='col-span-6 pt-2 border-t'>
              <p className='text-xs font-semibold uppercase tracking-wider text-muted-foreground'>Status &amp; Stats</p>
            </div>

            {/* isVerified */}
            <FormField
              control={form.control}
              name='isVerified'
              render={({ field }) => (
                <FormItem className='flex flex-row items-start space-x-3 space-y-0 rounded-md border p-4 col-span-6'>
                  <FormControl>
                    <Checkbox
                      checked={field.value}
                      onCheckedChange={field.onChange}
                    />
                  </FormControl>
                  <div className='space-y-1 leading-none'>
                    <FormLabel>Doctor Verified</FormLabel>
                    <p className='text-xs text-muted-foreground'>
                      Mark this doctor as verified on the platform.
                    </p>
                  </div>
                </FormItem>
              )}
            />

            {/* isFeatured */}
            <FormField
              control={form.control}
              name='isFeatured'
              render={({ field }) => (
                <FormItem className='flex flex-row items-start space-x-3 space-y-0 rounded-md border p-4 col-span-6'>
                  <FormControl>
                    <Checkbox
                      checked={field.value}
                      onCheckedChange={field.onChange}
                    />
                  </FormControl>
                  <div className='space-y-1 leading-none'>
                    <FormLabel>Featured Doctor</FormLabel>
                    <p className='text-xs text-muted-foreground'>
                      Feature this doctor on the homepage or search highlights.
                    </p>
                  </div>
                </FormItem>
              )}
            />

            {/* totalPatients */}
            <FormField
              control={form.control}
              name='totalPatients'
              render={({ field }) => (
                <FormItem className='grid grid-cols-6 items-center gap-x-4 gap-y-1'>
                  <FormLabel className='col-span-2 text-end'>Total Patients</FormLabel>
                  <FormControl className='col-span-4'>
                    <Input
                      type='number'
                      min={0}
                      placeholder='e.g. 500'
                      value={field.value ?? 0}
                      onChange={(e) => {
                        const v = e.target.valueAsNumber
                        field.onChange(Number.isNaN(v) ? 0 : v)
                      }}
                      onBlur={field.onBlur}
                      name={field.name}
                      ref={field.ref}
                    />
                  </FormControl>
                  <FormMessage className='col-span-4 col-start-3' />
                </FormItem>
              )}
            />

            {/* ── Profile ── */}
            <div className='col-span-6 pt-2 border-t'>
              <p className='text-xs font-semibold uppercase tracking-wider text-muted-foreground'>Profile</p>
            </div>

            {/* Languages (Dynamic String Array) */}
            <div className='grid grid-cols-6 items-start gap-x-4 gap-y-2'>
              <FormLabel className='col-span-2 text-end mt-3'>Languages</FormLabel>
              <div className='col-span-4 space-y-2'>
                {langFields.map((field, index) => (
                  <div key={field.id} className='flex gap-2'>
                    <Input {...form.register(`languages.${index}.value`)} placeholder='e.g. Bengali' />
                    <Button type='button' variant='ghost' size='icon' onClick={() => removeLang(index)}>
                      <X size={16} className='text-destructive' />
                    </Button>
                  </div>
                ))}
                <Button type='button' variant='outline' size='sm' className='mt-2' onClick={() => appendLang({ value: '' })}>
                  <Plus size={14} className='mr-1' /> Add Language
                </Button>
              </div>
            </div>

            {/* Services (Dynamic String Array) */}
            <div className='grid grid-cols-6 items-start gap-x-4 gap-y-2'>
              <FormLabel className='col-span-2 text-end mt-3'>Services</FormLabel>
              <div className='col-span-4 space-y-2'>
                {serviceFields.map((field, index) => (
                  <div key={field.id} className='flex gap-2'>
                    <Input {...form.register(`services.${index}.value`)} placeholder='e.g. ECG' />
                    <Button type='button' variant='ghost' size='icon' onClick={() => removeService(index)}>
                      <X size={16} className='text-destructive' />
                    </Button>
                  </div>
                ))}
                <Button type='button' variant='outline' size='sm' className='mt-2' onClick={() => appendService({ value: '' })}>
                  <Plus size={14} className='mr-1' /> Add Service
                </Button>
              </div>
            </div>

            {/* ── Medical Info ── */}
            <div className='col-span-6 pt-2 border-t'>
              <p className='text-xs font-semibold uppercase tracking-wider text-muted-foreground'>Medical Info</p>
            </div>

            {/* Conditions Treated (Dynamic String Array) */}
            <div className='grid grid-cols-6 items-start gap-x-4 gap-y-2'>
              <FormLabel className='col-span-2 text-end mt-3'>Conditions Treated</FormLabel>
              <div className='col-span-4 space-y-2'>
                {conditionFields.map((field, index) => (
                  <div key={field.id} className='flex gap-2'>
                    <Input {...form.register(`conditions_treated.${index}.value`)} placeholder='e.g. Heart Failure' />
                    <Button type='button' variant='ghost' size='icon' onClick={() => removeCondition(index)}>
                      <X size={16} className='text-destructive' />
                    </Button>
                  </div>
                ))}
                <Button type='button' variant='outline' size='sm' className='mt-2' onClick={() => appendCondition({ value: '' })}>
                  <Plus size={14} className='mr-1' /> Add Condition
                </Button>
              </div>
            </div>

            {/* Insurance Accepted (Dynamic String Array) */}
            <div className='grid grid-cols-6 items-start gap-x-4 gap-y-2'>
              <FormLabel className='col-span-2 text-end mt-3'>Insurance Accepted</FormLabel>
              <div className='col-span-4 space-y-2'>
                {insuranceFields.map((field, index) => (
                  <div key={field.id} className='flex gap-2'>
                    <Input {...form.register(`insurance_accepted.${index}.value`)} placeholder='e.g. MetLife' />
                    <Button type='button' variant='ghost' size='icon' onClick={() => removeInsurance(index)}>
                      <X size={16} className='text-destructive' />
                    </Button>
                  </div>
                ))}
                <Button type='button' variant='outline' size='sm' className='mt-2' onClick={() => appendInsurance({ value: '' })}>
                  <Plus size={14} className='mr-1' /> Add Insurance
                </Button>
              </div>
            </div>

            {/* ── Social Links ── */}
            <div className='col-span-6 pt-2 border-t'>
              <p className='text-xs font-semibold uppercase tracking-wider text-muted-foreground'>Social Links</p>
            </div>

            <div className='grid grid-cols-6 items-start gap-x-4 gap-y-3'>
              <FormLabel className='col-span-2 text-end mt-2'>Facebook</FormLabel>
              <div className='col-span-4'>
                <Input {...form.register('social_links.facebook')} placeholder='https://facebook.com/...' />
              </div>

              <FormLabel className='col-span-2 text-end mt-2'>Twitter</FormLabel>
              <div className='col-span-4'>
                <Input {...form.register('social_links.twitter')} placeholder='https://twitter.com/...' />
              </div>

              <FormLabel className='col-span-2 text-end mt-2'>LinkedIn</FormLabel>
              <div className='col-span-4'>
                <Input {...form.register('social_links.linkedin')} placeholder='https://linkedin.com/in/...' />
              </div>

              <FormLabel className='col-span-2 text-end mt-2'>Website</FormLabel>
              <div className='col-span-4'>
                <Input {...form.register('social_links.website')} placeholder='https://example.com' />
              </div>
            </div>

            {/* ── Awards ── */}
            <div className='col-span-6 pt-2 border-t'>
              <p className='text-xs font-semibold uppercase tracking-wider text-muted-foreground'>Awards</p>
            </div>

            <div className='grid grid-cols-6 items-start gap-x-4 gap-y-2'>
              <FormLabel className='col-span-2 text-end mt-3'>Awards</FormLabel>
              <div className='col-span-4 space-y-3'>
                {awardFields.map((field, index) => (
                  <div key={field.id} className='rounded-md border p-3 space-y-2'>
                    <div className='flex justify-between items-center'>
                      <span className='text-xs font-medium text-muted-foreground'>Award {index + 1}</span>
                      <Button type='button' variant='ghost' size='icon' onClick={() => removeAward(index)}>
                        <X size={16} className='text-destructive' />
                      </Button>
                    </div>
                    <div className='grid grid-cols-2 gap-2'>
                      <Input {...form.register(`awards.${index}.title`)} placeholder='Title' />
                      <Input {...form.register(`awards.${index}.year`)} placeholder='Year (e.g. 2022)' />
                    </div>
                    <Input {...form.register(`awards.${index}.description`)} placeholder='Description (optional)' />
                  </div>
                ))}
                <Button type='button' variant='outline' size='sm' className='mt-2' onClick={() => appendAward({ title: '', year: '', description: '' })}>
                  <Plus size={14} className='mr-1' /> Add Award
                </Button>
              </div>
            </div>

            {/* ── Publications ── */}
            <div className='col-span-6 pt-2 border-t'>
              <p className='text-xs font-semibold uppercase tracking-wider text-muted-foreground'>Publications</p>
            </div>

            <div className='grid grid-cols-6 items-start gap-x-4 gap-y-2'>
              <FormLabel className='col-span-2 text-end mt-3'>Publications</FormLabel>
              <div className='col-span-4 space-y-3'>
                {pubFields.map((field, index) => (
                  <div key={field.id} className='rounded-md border p-3 space-y-2'>
                    <div className='flex justify-between items-center'>
                      <span className='text-xs font-medium text-muted-foreground'>Publication {index + 1}</span>
                      <Button type='button' variant='ghost' size='icon' onClick={() => removePub(index)}>
                        <X size={16} className='text-destructive' />
                      </Button>
                    </div>
                    <Input {...form.register(`publications.${index}.title`)} placeholder='Title' />
                    <div className='grid grid-cols-2 gap-2'>
                      <Input {...form.register(`publications.${index}.journal`)} placeholder='Journal' />
                      <Input {...form.register(`publications.${index}.year`)} placeholder='Year (e.g. 2021)' />
                    </div>
                    <Input {...form.register(`publications.${index}.url`)} placeholder='URL (optional)' />
                  </div>
                ))}
                <Button type='button' variant='outline' size='sm' className='mt-2' onClick={() => appendPub({ title: '', journal: '', year: '', url: '' })}>
                  <Plus size={14} className='mr-1' /> Add Publication
                </Button>
              </div>
            </div>

            {/* ── FAQs ── */}
            <div className='col-span-6 pt-2 border-t'>
              <p className='text-xs font-semibold uppercase tracking-wider text-muted-foreground'>FAQs</p>
            </div>

            <div className='grid grid-cols-6 items-start gap-x-4 gap-y-2'>
              <FormLabel className='col-span-2 text-end mt-3'>FAQs</FormLabel>
              <div className='col-span-4 space-y-3'>
                {faqFields.map((field, index) => (
                  <div key={field.id} className='rounded-md border p-3 space-y-2'>
                    <div className='flex justify-between items-center'>
                      <span className='text-xs font-medium text-muted-foreground'>FAQ {index + 1}</span>
                      <Button type='button' variant='ghost' size='icon' onClick={() => removeFaq(index)}>
                        <X size={16} className='text-destructive' />
                      </Button>
                    </div>
                    <Input {...form.register(`faqs.${index}.question`)} placeholder='Question' />
                    <Textarea {...form.register(`faqs.${index}.answer`)} placeholder='Answer' className='min-h-[80px]' />
                  </div>
                ))}
                <Button type='button' variant='outline' size='sm' className='mt-2' onClick={() => appendFaq({ question: '', answer: '' })}>
                  <Plus size={14} className='mr-1' /> Add FAQ
                </Button>
              </div>
            </div>
          </form>
        </Form>

        <DialogFooter className='border-t pt-4'>
          <Button type='submit' form='doctor-form'>Save changes</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
