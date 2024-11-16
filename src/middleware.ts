import { Request, Response, NextFunction } from "express";
import { Validator } from "./validators"; // Import your validators

// Validator Schema for fields
type RouteSchema = {
  [field: string]: Validator | Validator[];
};

// Schema with optional _target property (for body, query, or params)
interface SchemaWithTarget {
  schema: RouteSchema; // The schema for route fields
  _target?: "body" | "query" | "params"; // Optional target for where to validate (body, query, or params)
}

// Main validation function
export const validateRequest = (options: {
  [routePattern: string]: SchemaWithTarget;
}) => {
  return (req: Request, res: Response, next: NextFunction) => {
    const route = req.route?.path || req.path; // Use req.path if req.route is not defined

    // Loop through options and check for matching routes
    for (const routePattern in options) {
      const regex = new RegExp(`^${routePattern.replace(/:\w+/g, "\\w+")}$`);
      if (regex.test(route)) {
        const { schema, _target } = options[routePattern];
        let targetData: any = req.body; // Default target is body

        // Set target data based on _target
        if (_target === "params") targetData = req.params;
        else if (_target === "query") targetData = req.query;

        const errors: { [key: string]: string } = {};

        // Validate fields using the schema
        for (const field in schema) {
          if (field === "_target") continue; // Skip the _target property
          if (Object.prototype.hasOwnProperty.call(schema, field)) {
            const validators = Array.isArray(schema[field])
              ? (schema[field] as Validator[])
              : [schema[field] as Validator];

            for (const validator of validators) {
              const error = validator(targetData[field], field);
              if (error) {
                errors[field] = error;
                break; // Stop further checks if an error is found for this field
              }
            }
          }
        }

        // If there are validation errors, return a 400 response
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
