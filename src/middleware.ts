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

export const validateRequest = (options: ValidationSchema) => {
  return (req: Request, res: Response, next: NextFunction) => {
    const route = req.originalUrl; // Get the current route

    if (options[route]) {
      const target = req.body; // By default, we will validate the body of the request
      const errors: { [key: string]: string } = {};

      // Get the schema for the current route
      const schema = options[route];

      for (const field in schema) {
        if (Object.prototype.hasOwnProperty.call(schema, field)) {
          let validators: Validator[] = [];

          // Handle both single validators and arrays of validators
          if (Array.isArray(schema[field])) {
            validators = schema[field] as Validator[];
          } else {
            validators = [schema[field] as Validator];
          }

          // Iterate through each validator
          for (const validator of validators) {
            const error = validator(target[field], field); // Call validator with the field value and field name

            if (error) {
              errors[field] = error; // Store the error for the field
              break; // Stop validation for this field if error is found
            }
          }
        }
      }

      // If there are any validation errors, return them
      if (Object.keys(errors).length > 0) {
        return res.status(400).json({ errors });
      }
    }

    // If there are no errors, continue with the next middleware
    next();
  };
};
