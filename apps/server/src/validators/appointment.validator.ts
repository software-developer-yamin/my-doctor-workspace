import Joi from 'joi';

export const createAppointmentSchema = Joi.object({
  doctor: Joi.string().hex().length(24).required().messages({
    'string.hex': 'doctor must be a valid ObjectId',
    'any.required': 'doctor is required',
  }),
  hospital: Joi.string().hex().length(24).required().messages({
    'any.required': 'hospital is required',
  }),
  customer: Joi.string().hex().length(24).required().messages({
    'any.required': 'customer is required',
  }),
  appointmentDate: Joi.date().iso().required().messages({
    'date.iso': 'appointmentDate must be ISO 8601 format',
    'any.required': 'appointmentDate is required',
  }),
  selectedSchedule: Joi.object({
    scheduleId: Joi.string().hex().length(24).required(),
    startTime: Joi.string().required(),
    endTime: Joi.string().optional(),
  }).required(),
  type: Joi.string().valid('In-Person', 'Online', 'Home').optional(),
  note: Joi.string().max(1000).optional().allow(''),
  contactNumber: Joi.string().max(20).optional().allow(''),
});

export const updateAppointmentSchema = Joi.object({
  status: Joi.string()
    .valid('Pending', 'Confirmed', 'Completed', 'Cancelled')
    .optional(),
  note: Joi.string().max(1000).optional().allow(''),
  contactNumber: Joi.string().max(20).optional().allow(''),
  selectedSchedule: Joi.object({
    scheduleId: Joi.string().hex().length(24).required(),
    startTime: Joi.string().required(),
    endTime: Joi.string().optional(),
  }).optional(),
}).min(1).messages({ 'object.min': 'At least one field is required for update' });
