import { NextFunction, Request, Response } from 'express';
import Joi from 'joi';
import { AppError } from '../utils/appError.js';

type RequestSegment = 'body' | 'params' | 'query';

/**
 * Returns an Express middleware that validates a specific segment of the
 * request (body, params, or query) against the provided Joi schema.
 * On failure it forwards a 400 AppError to the next error handler.
 */
export function validate(schema: Joi.Schema, segment: RequestSegment = 'body') {
  return (req: Request, _res: Response, next: NextFunction): void => {
    const { error, value } = schema.validate(req[segment], {
      abortEarly: false,
      stripUnknown: true,
    });

    if (error) {
      const message = error.details.map((d) => d.message).join('; ');
      return next(new AppError(400, message));
    }

    // Replace the segment with the stripped/coerced value from Joi.
    (req as unknown as Record<string, unknown>)[segment] = value;
    next();
  };
}
