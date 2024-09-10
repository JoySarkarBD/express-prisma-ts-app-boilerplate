import { NextFunction, Request, Response } from 'express';
import { isMongoId } from 'validator';
import { z } from 'zod';
import zodErrorHandler from './zod-error-handler';

/**
 * Zod schema for validating id and ids.
 */
const zodIdSchema = z
  .object({
    id: z
      .string({
        required_error: 'Id is required',
        invalid_type_error: 'Please provide a valid id',
      })
      .refine((id: string) => isMongoId(id), {
        message: 'Please provide a valid id',
      }),
    ids: z
      .array(
        z.string().refine((id: string) => isMongoId(id), {
          message: 'Each ID must be a valid MongoDB ObjectId',
        })
      )
      .min(1, {
        message: 'At least one ID must be provided',
      }),
  })
  .strict();

/**
 * Middleware function to validate id using Zod schema.
 * @param {object} req - The request object.
 * @param {object} res - The response object.
 * @param {function} next - The next middleware function.
 * @returns {void}
 */
export const validateId = (req: Request, res: Response, next: NextFunction) => {
  // Validate request params
  const { error, success } = zodIdSchema.pick({ id: true }).safeParse({ id: req.params.id });

  // Check if validation was successful
  if (!success) {
    // If validation failed, use the Zod error handler to send an error response
    return zodErrorHandler(req, res, error);
  }

  // If validation passed, proceed to the next middleware function
  return next();
};

/**
 * Middleware function to validate ids using Zod schema.
 * @param {object} req - The request object.
 * @param {object} res - The response object.
 * @param {function} next - The next middleware function.
 * @returns {void}
 */
export const validateIds = (req: Request, res: Response, next: NextFunction) => {
  // Validate request body
  const { success, error } = zodIdSchema.pick({ ids: true }).safeParse(req.body);

  // Check if validation was successful
  if (!success) {
    // If validation failed, use the Zod error handler to send an error response
    return zodErrorHandler(req, res, error);
  }

  // If validation passed, proceed to the next middleware function
  return next();
};
