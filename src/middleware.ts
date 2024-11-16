import { Request, Response, NextFunction } from "express";
import { Validator } from "./validators"; // Assuming you have validators like isRequired, isEmail, etc.

export const validateRequest = (options: {
  [routePattern: string]: { [field: string]: Validator | Validator[] };
}) => {
  return (req: Request, res: Response, next: NextFunction) => {
    const route = req.route?.path || req.path; // Use req.path if req.route is not defined

    // Loop through options and check for matching routes
    for (const routePattern in options) {
      const regex = new RegExp(`^${routePattern.replace(/:\w+/g, "\\w+")}$`);
      if (regex.test(route)) {
        const routeValidators = options[routePattern]; // Get validators for the matched route
        const errors: { [key: string]: string } = {};

        // Check for validation on params
        if (req.params) {
          for (const field in routeValidators) {
            if (req.params[field]) {
              const validators = Array.isArray(routeValidators[field])
                ? (routeValidators[field] as Validator[])
                : [routeValidators[field] as Validator];
              for (const validator of validators) {
                const error = validator(req.params[field], field);
                if (error) {
                  errors[field] = error;
                  break;
                }
              }
            }
          }
        }

        // Check for validation on body
        if (req.body) {
          for (const field in routeValidators) {
            if (req.body[field]) {
              const validators = Array.isArray(routeValidators[field])
                ? (routeValidators[field] as Validator[])
                : [routeValidators[field] as Validator];
              for (const validator of validators) {
                const error = validator(req.body[field], field);
                if (error) {
                  errors[field] = error;
                  break;
                }
              }
            }
          }
        }

        // Check for validation on query
        if (req.query) {
          for (const field in routeValidators) {
            if (req.query[field]) {
              const validators = Array.isArray(routeValidators[field])
                ? (routeValidators[field] as Validator[])
                : [routeValidators[field] as Validator];
              for (const validator of validators) {
                const error = validator(req.query[field], field);
                if (error) {
                  errors[field] = error;
                  break;
                }
              }
            }
          }
        }

        // If there are validation errors, return a 400 response with the errors
        if (Object.keys(errors).length > 0) {
          return res.status(400).json({ errors });
        }

        break; // Exit loop when matching route is found
      }
    }

    // If no errors, proceed to next middleware
    next();
  };
};
