'use client'

import { z } from 'zod'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { useEffect, useRef, useState } from 'react'
import { toast } from 'sonner'
import { Upload } from 'lucide-react'
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
import { Checkbox } from '@/components/ui/checkbox'

const formSchema = z.object({
  name: z.string().min(1, 'Test name is required'),
  description: z.string().min(1, 'Description is required'),
  price_start_from: z.number().min(0, 'Price must be a positive number'),
  category: z.string().optional(),
  isHomeSampleCollectionAvailable: z.boolean(),
})

type TestForm = z.infer<typeof formSchema>

type Props = {
  open: boolean
  onOpenChange: (open: boolean) => void
  currentRow?: any
  onSuccess: () => void
}

export function DiagnosticTestsActionDialog({ open, onOpenChange, currentRow, onSuccess }: Props) {
  const isEdit = !!currentRow
  const [file, setFile] = useState<File | null>(null)
  const [preview, setPreview] = useState<string | null>(null)
  const fileInputRef = useRef<HTMLInputElement>(null)

  const form = useForm<TestForm>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: '',
      description: '',
      price_start_from: 0,
      category: '',
      isHomeSampleCollectionAvailable: false,
    },
  })

  useEffect(() => {
    if (currentRow) {
      form.reset({
        name: currentRow.name || '',
        description: currentRow.description || '',
        price_start_from: currentRow.price_start_from || 0,
        category: currentRow.category || '',
        isHomeSampleCollectionAvailable: !!currentRow.isHomeSampleCollectionAvailable,
      })
      setPreview(currentRow.image ? `${SERVER_URL}${currentRow.image}` : null)
    } else {
      form.reset({
        name: '',
        description: '',
        price_start_from: 0,
        category: '',
        isHomeSampleCollectionAvailable: false,
      })
      setPreview(null)
    }
    setFile(null)
  }, [currentRow, form, open])

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0]
    if (!selectedFile) return
    setFile(selectedFile)
    const reader = new FileReader()
    reader.onloadend = () => setPreview(reader.result as string)
    reader.readAsDataURL(selectedFile)
  }

  const onSubmit = async (values: TestForm) => {
    try {
      const formData = new FormData()
      formData.append('name', values.name)
      formData.append('description', values.description)
      formData.append('price_start_from', String(values.price_start_from))
      if (values.category) formData.append('category', values.category)
      formData.append('isHomeSampleCollectionAvailable', String(values.isHomeSampleCollectionAvailable))
      if (file) formData.append('image', file)

      const url = isEdit ? `/diagnostic-tests/${currentRow._id}` : '/diagnostic-tests'
      const method = isEdit ? 'patch' : 'post'

      await api({
        method,
        url,
        data: formData,
        headers: { 'Content-Type': 'multipart/form-data' },
      })
      toast.success(isEdit ? 'Test updated' : 'Test added')
      onOpenChange(false)
      onSuccess()
    } catch (e) {
      toast.error('Failed to save test')
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className='sm:max-w-lg'>
        <DialogHeader className='text-start'>
          <DialogTitle>{isEdit ? 'Edit Diagnostic Test' : 'Add New Test'}</DialogTitle>
          <DialogDescription>
            {isEdit ? 'Update test details here.' : 'Enter details of the new diagnostic test.'}
          </DialogDescription>
        </DialogHeader>

        <Form {...form}>
          <form id='test-form' onSubmit={form.handleSubmit(onSubmit)} className='space-y-4'>
            {/* Image Upload */}
            <div className='flex flex-col items-center justify-center space-y-3 py-2'>
              <div className='h-24 w-24 rounded-xl border border-white/10 bg-black/30 overflow-hidden flex items-center justify-center'>
                {preview ? (
                  <img src={preview} alt='Test' className='h-full w-full object-cover' />
                ) : (
                  <Upload size={20} className='text-muted-foreground opacity-60' />
                )}
              </div>
              <input
                type='file'
                ref={fileInputRef}
                onChange={handleFileChange}
                className='hidden'
                accept='image/*'
              />
              <Button type='button' variant='outline' size='sm' onClick={() => fileInputRef.current?.click()}>
                <Upload size={14} className='mr-2' /> {preview ? 'Change Image' : 'Upload Image'}
              </Button>
            </div>

            <FormField control={form.control} name='name' render={({ field }) => (
              <FormItem>
                <FormLabel>Test Name</FormLabel>
                <FormControl><Input placeholder='Complete Blood Count (CBC)' {...field} /></FormControl>
                <FormMessage />
              </FormItem>
            )} />

            <div className='grid grid-cols-2 gap-4'>
              <FormField control={form.control} name='price_start_from' render={({ field }) => (
                <FormItem>
                  <FormLabel>Starting Price (BDT)</FormLabel>
                  <FormControl>
                    <Input
                      type='number'
                      placeholder='500'
                      {...field}
                      onChange={(e) => field.onChange(Number(e.target.value))}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )} />

              <FormField control={form.control} name='category' render={({ field }) => (
                <FormItem>
                  <FormLabel>Category</FormLabel>
                  <FormControl>
                    <Input placeholder='e.g. Blood Tests, CT Scan' {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )} />
            </div>

            <FormField control={form.control} name='description' render={({ field }) => (
              <FormItem>
                <FormLabel>Brief Description</FormLabel>
                <FormControl><Textarea placeholder='Measures blood components...' className='min-h-[100px]' {...field} /></FormControl>
                <FormMessage />
              </FormItem>
            )} />

            <FormField control={form.control} name='isHomeSampleCollectionAvailable' render={({ field }) => (
              <FormItem className='flex items-center gap-3 rounded-lg border border-white/10 bg-black/20 p-4'>
                <FormControl>
                  <Checkbox
                    checked={field.value}
                    onCheckedChange={field.onChange}
                  />
                </FormControl>
                <div>
                  <FormLabel className='text-sm font-semibold cursor-pointer'>Home Sample Collection</FormLabel>
                  <p className='text-muted-foreground text-xs mt-0.5'>
                    Enable if sample can be collected from patient's home
                  </p>
                </div>
              </FormItem>
            )} />
          </form>
        </Form>

        <DialogFooter>
          <Button type='submit' form='test-form'>Save changes</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
