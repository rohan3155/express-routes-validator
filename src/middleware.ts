import { Request, Response, NextFunction } from "express";
import { Validator } from "./validators"; // Assuming you have validators like isRequired, isEmail, etc.

export const validateRequest = (options: {
  [routePattern: string]: { [field: string]: Validator | Validator[] };
}) => {
  return (req: Request, res: Response, next: NextFunction) => {
    const route = req.route?.path || req.path; // Ensure we get the correct route path

    let matchedRoute = false; // Flag to track if the route is matched

    // Iterate through options to find matching route pattern
    for (const routePattern in options) {
      const regex = new RegExp(`^${routePattern.replace(/:\w+/g, "\\w+")}$`); // Regex for dynamic routes
      if (regex.test(route)) {
        matchedRoute = true; // We found a match for the route
        const schema = options[routePattern];
        const errors: { [key: string]: string } = {};

        // Collect all request data from params, query, and body
        const targetData = { ...req.params, ...req.body, ...req.query };

        // Iterate over each field in the schema for validation
        for (const field in schema) {
          if (Object.prototype.hasOwnProperty.call(schema, field)) {
            let validators: Validator[] = [];

            // Check if the field has multiple validators
            if (Array.isArray(schema[field])) {
              validators = schema[field] as Validator[];
            } else {
              validators = [schema[field] as Validator];
            }

            // Run each validator for the field
            for (const validator of validators) {
              const error = validator(targetData[field], field); // Run validation
              if (error) {
                errors[field] = error; // Collect errors for the field
                break; // Stop further checks if an error is found for this field
              }
            }
          }
        }

        // If there are validation errors, respond with a 400 status and the errors
        if (Object.keys(errors).length > 0) {
          return res.status(400).json({ errors });
        }
      }
    }

    // If no matching route found, or validation passed, continue to the next middleware
    if (!matchedRoute) {
      return next(); // Continue to the next middleware or route handler
    }

    // If validation passed, move to the next middleware
    next();
  };
};
