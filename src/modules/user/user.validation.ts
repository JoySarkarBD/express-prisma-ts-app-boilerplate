import { NextFunction, Request, Response } from 'express';
import { isMongoId } from 'validator';
import { z } from 'zod';
import zodErrorHandler from '../../handlers/zod-error-handler';

/**
 * Zod schema for validating user data.
 */
const zodUserSchema = z.object({
  id: z
    .string({
      required_error: "Id is required",
      invalid_type_error: "Please provide a valid id",
    })
    .uuid({
      message: "Please provide a valid UUID",
    }),
  ids: z
    .array(z.string().uuid({
      message: "Each ID must be a valid UUID",
    }))
    .min(1, {
      message: "At least one ID must be provided",
    }),
}).strict();

/**
 * Middleware function to validate user ID using Zod schema.
 * @param {object} req - The request object.
 * @param {object} res - The response object.
 * @param {function} next - The next middleware function.
 * @returns {void}
 */
export const validateUserId = (req: Request, res: Response, next: NextFunction) => {
  // Validate request params
  const { error, success } = zodUserSchema.pick({ id: true }).safeParse({ id: req.params.id });

  // Check if validation was successful
  if (!success) {
    // If validation failed, use the Zod error handler to send an error response
    return zodErrorHandler(req, res, error);
  }

  // If validation passed, proceed to the next middleware function
  return next();
};