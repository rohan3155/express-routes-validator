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
  [routePattern: string]: { [field: string]: Validator | Validator[] };
};

export const validateRequest = (options: ValidationSchema) => {
  return (req: Request, res: Response, next: NextFunction) => {
    const route = req.route.path; // This gives you the path from the express router

    // Iterate over the options to match the route
    for (const routePattern in options) {
      const regex = new RegExp(`^${routePattern.replace(/:\w+/g, "\\w+")}$`); // Create regex for dynamic routes
      if (regex.test(route)) {
        const schema = options[routePattern];
        const errors: { [key: string]: string } = {};

        // Validate params, query, or body based on schema
        // Check for params first (for dynamic parts like :id)
        const targetData = { ...req.params, ...req.body }; // Combine params and body into one object
        for (const field in schema) {
          if (Object.prototype.hasOwnProperty.call(schema, field)) {
            let validators: Validator[] = [];

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
    }

    // If no validation errors, move to the next middleware
    next();
  };
};
