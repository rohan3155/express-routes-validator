import { Request, Response, NextFunction } from "express";
import { Validator } from "./validators"; // Assuming you have validators like isRequired, isEmail, etc.

export interface MiddlewareOptions {
  target?: "body" | "query" | "params"; // Optional target, defaults to body
}

export type MiddlewareFunction = (
  schema: { [key: string]: Validator | Validator[] },
  options?: MiddlewareOptions
) => (req: Request, res: Response, next: NextFunction) => void;

type ValidationSchema = {
  [key: string]: { [field: string]: Validator | Validator[] };
};

// This will be used as the validator middleware for global use
export const validateRequest = (options: ValidationSchema) => {
  return (req: Request, res: Response, next: NextFunction) => {
    const route = req.originalUrl; // Get the current route

    // Check if validation rules exist for the current route
    if (options[route]) {
      const targetData = req.body; // Default target is `body`
      const errors: { [key: string]: string } = {};

      // Get the schema for the current route
      const schema = options[route];

      // Iterate over each field in the schema and validate it
      for (const field in schema) {
        if (Object.prototype.hasOwnProperty.call(schema, field)) {
          let validators: Validator[] = [];

          // If multiple validators are defined for a field, handle them
          if (Array.isArray(schema[field])) {
            validators = schema[field] as Validator[];
          } else {
            validators = [schema[field] as Validator];
          }

          // Iterate through each validator
          for (const validator of validators) {
            const error = validator(targetData[field], field); // Validate field

            if (error) {
              errors[field] = error; // Collect errors
              break; // Stop further checks if error found for this field
            }
          }
        }
      }

      // If there are any validation errors, return a 400 response with the errors
      if (Object.keys(errors).length > 0) {
        return res.status(400).json({ errors });
      }
    }

    // If no validation errors, move to the next middleware
    next();
  };
};
