import Joi from 'joi';

const objectId = Joi.string().hex().length(24);

const educationSchema = Joi.object({
  degree: Joi.string().required(),
  institution: Joi.string().required(),
  year: Joi.number().integer().min(1900).max(new Date().getFullYear()).optional(),
});

const awardSchema = Joi.object({
  title: Joi.string().required(),
  year: Joi.number().integer().min(1900).max(new Date().getFullYear()).optional(),
});

const publicationSchema = Joi.object({
  title: Joi.string().required(),
  url: Joi.string().uri().optional().allow(''),
});

const faqSchema = Joi.object({
  question: Joi.string().required(),
  answer: Joi.string().required(),
});

const videoSchema = Joi.object({
  title: Joi.string().required(),
  url: Joi.string().uri().required(),
});

export const createDoctorSchema = Joi.object({
  name: Joi.string().min(2).max(200).required(),
  email: Joi.string().email().required(),
  password: Joi.string().min(6).optional().allow(''),
  phone: Joi.string().max(20).optional().allow(''),
  gender: Joi.string().valid('Male', 'Female').optional(),
  BMDC_REG_NO: Joi.string().max(50).optional().allow(''),
  degrees: Joi.string().max(500).optional().allow(''),
  short_description: Joi.string().max(2000).optional().allow(''),
  years_of_experience: Joi.number().integer().min(0).max(80).optional(),
  specializations: Joi.alternatives()
    .try(Joi.array().items(objectId), Joi.string())
    .optional(),
  field_of_concentration: Joi.alternatives()
    .try(Joi.array().items(objectId), Joi.string())
    .optional(),
  languages: Joi.alternatives()
    .try(Joi.array().items(Joi.string()), Joi.string())
    .optional(),
  educations: Joi.alternatives()
    .try(Joi.array().items(educationSchema), Joi.string())
    .optional(),
  conditions_treated: Joi.alternatives()
    .try(Joi.array().items(Joi.string()), Joi.string())
    .optional(),
  insurance_accepted: Joi.alternatives()
    .try(Joi.array().items(Joi.string()), Joi.string())
    .optional(),
  awards: Joi.alternatives()
    .try(Joi.array().items(awardSchema), Joi.string())
    .optional(),
  publications: Joi.alternatives()
    .try(Joi.array().items(publicationSchema), Joi.string())
    .optional(),
  faqs: Joi.alternatives()
    .try(Joi.array().items(faqSchema), Joi.string())
    .optional(),
  videos: Joi.alternatives()
    .try(Joi.array().items(videoSchema), Joi.string())
    .optional(),
  services: Joi.alternatives()
    .try(Joi.array().items(Joi.string()), Joi.string())
    .optional(),
  social_links: Joi.alternatives()
    .try(Joi.object().pattern(Joi.string(), Joi.string().uri()), Joi.string())
    .optional(),
});

export const updateDoctorSchema = createDoctorSchema.fork(
  ['name', 'email'],
  (schema) => schema.optional()
);

export const doctorLoginSchema = Joi.object({
  email: Joi.string().email().required(),
  password: Joi.string().required(),
});
