import { Request, Response, NextFunction } from "express";
import { Validator } from "./validators";

export interface MiddlewareOptions {
  target?: "body" | "query" | "params"; // Optional target, defaults to body
}

export type MiddlewareFunction = (
  schema: { [key: string]: Validator | Validator[] },
  options?: MiddlewareOptions
) => (req: Request, res: Response, next: NextFunction) => void;

export const validateRequest: MiddlewareFunction = (
  schema,
  options: MiddlewareOptions = { target: "body" } // Set default target as "body"
) => {
  return (req: Request, res: Response, next: NextFunction) => {
    // Ensure options.target is valid
    const target = options.target ?? "body";
    if (!["body", "query", "params"].includes(target)) {
      return res
        .status(400)
        .json({ errors: { target: "Invalid target specified" } });
    }

    const targetData = req[target]; // Get the data from the specified target (body, query, params)
    const errors: { [key: string]: string } = {}; // Initialize errors object

    // Iterate over the schema and validate each field
    for (const key in schema) {
      if (Object.prototype.hasOwnProperty.call(schema, key)) {
        let validators: Validator[] = [];

        if (Array.isArray(schema[key])) {
          // If it's already an array, flatten the array of validators
          validators = (schema[key] as Validator[]).flat() as Validator[];
        } else {
          // If it's a single validator, wrap it in an array
          validators = [schema[key] as Validator];
        }

        for (const validator of validators) {
          const error = validator(targetData[key], key); // Run the validator

          if (error) {
            errors[key] = error; // If there's an error, store it and stop further checks for this key
            break;
          }
        }
      }
    }

    // If there are any errors, return a 400 response with the errors
    if (Object.keys(errors).length > 0) {
      return res.status(400).json({ errors });
    }

    // If validation passes, proceed to the next middleware
    next();
  };
};
