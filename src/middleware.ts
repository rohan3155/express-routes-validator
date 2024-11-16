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
    // Get the current route path
    const route = req.route.path; // This gives you the path from the express router

    // Find a matching schema for the route
    for (const routePattern in options) {
      // Match dynamic parameters with regex
      const regex = new RegExp(`^${routePattern.replace(/:\w+/g, "\\w+")}$`);
      if (regex.test(route)) {
        const schema = options[routePattern];
        const targetData = req.body; // Default target is `body`
        const errors: { [key: string]: string } = {};

        // If route has params, check req.params for validation
        const target = req.params || targetData;

        // Iterate over each field in the schema and validate it
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
              const error = validator(target[field], field);

              if (error) {
                errors[field] = error;
                break; // Stop further checks if error found for this field
              }
            }
          }
        }

        // If there are any validation errors, return a 400 response with the errors
        if (Object.keys(errors).length > 0) {
          return res.status(400).json({ errors });
        }

        break; // Exit loop if a matching route is found
      }
    }

    // If no validation errors, move to the next middleware
    next();
  };
};
