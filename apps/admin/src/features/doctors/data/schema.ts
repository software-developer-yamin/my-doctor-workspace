import { z } from 'zod'

export const doctorSchema = z.object({
  id: z.string(),
  name: z.string(),
  photo: z.string().optional(),
  degrees: z.string(),
  short_description: z.string(),
  BMDC_REG_NO: z.string(),
  about: z.string(),
  field_of_concentration: z.array(z.string()),
  specializations: z.array(z.object({
    _id: z.string(),
    name: z.string()
  })),
  educations: z.array(z.string()),
  createdAt: z.string(),
  updatedAt: z.string(),
})

export type Doctor = z.infer<typeof doctorSchema>
