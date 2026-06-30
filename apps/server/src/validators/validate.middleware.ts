import Joi from 'joi';
import { Request, Response, NextFunction } from 'express';
import { errorResponse } from '../utils/errorResponse.js';

type SchemaTarget = 'body' | 'query' | 'params';

export function validate(schema: Joi.ObjectSchema, target: SchemaTarget = 'body') {
  return (req: Request, res: Response, next: NextFunction): void => {
    const { error, value } = schema.validate(req[target], {
      abortEarly: false,
      allowUnknown: target === 'query', // query strings often have extra keys
      stripUnknown: target === 'body',
    });

    if (error) {
      const details = error.details.map((d) => d.message).join('; ');
      errorResponse(res, 400, details, 'VALIDATION_ERROR');
      return;
    }

    req[target] = value;
    next();
  };
}
