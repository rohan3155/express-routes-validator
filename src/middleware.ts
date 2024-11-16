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
    const route = req.originalUrl; // This gives you the full URL path, including parameters

    // Iterate over the options to match the route
    for (const routePattern in options) {
      // Create regex for dynamic routes, replacing :param with a regex for matching dynamic values
      const regex = new RegExp(`^${routePattern.replace(/:\w+/g, "(\\w+)")}$`);

      if (regex.test(route)) {
        const schema = options[routePattern];
        const errors: { [key: string]: string } = {};

        // Handle validation for params, query, or body depending on the schema
        const targetData: { [key: string]: any } = {
          ...req.params,
          ...req.body,
          ...req.query, // Include query params if needed
        };

        // Iterate through fields in the schema
        for (const field in schema) {
          if (Object.prototype.hasOwnProperty.call(schema, field)) {
            let validators: Validator[] = [];

            if (Array.isArray(schema[field])) {
              validators = schema[field] as Validator[];
            } else {
              validators = [schema[field] as Validator];
            }

            // Run each validator for the field
            for (const validator of validators) {
              const error = validator(targetData[field], field); // Validate field

              if (error) {
                errors[field] = error; // Collect errors
                break; // Stop further checks if error found for this field
              }
            }
          }
        }

        // If there are validation errors, return a 400 response with errors
        if (Object.keys(errors).length > 0) {
          return res.status(400).json({ errors });
        }
      }
    }

    // If no validation errors, proceed to the next middleware
    next();
  };
};
