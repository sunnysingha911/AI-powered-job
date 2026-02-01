import { Request, Response, NextFunction } from "express"
import { AnyZodObject, ZodError } from "zod"
import { ValidationError } from "../errors/AppError"

/**
 * Validation Middleware Factory
 * Validates request body, query, or params against a Zod schema
 */
export const validate = (schema: AnyZodObject) => {
  return async (
    req: Request,
    res: Response,
    next: NextFunction,
  ): Promise<void> => {
    try {
      await schema.parseAsync({
        body: req.body,
        query: req.query,
        params: req.params,
      })
      next()
    } catch (error) {
      if (error instanceof ZodError) {
        next(error) // Will be handled by errorHandler
      } else {
        next(new ValidationError("Validation failed"))
      }
    }
  }
}
