import Ajv from 'ajv';
import addFormats from 'ajv-formats';
import { Request, Response, NextFunction } from 'express';

const ajv = new Ajv({ allErrors: true });
addFormats(ajv);

const productSchema = {
  type: 'object',
  properties: {
    name: { type: 'string', minLength: 1 },
    description: { type: 'string' },
    price: { type: 'number', minimum: 0 },
    categories: { type: 'array', items: { type: 'string' } }
  },
  required: ['name', 'price'],
  additionalProperties: false
};

export const validateProduct = (req: Request, res: Response, next: NextFunction) => {
  const valid = ajv.validate(productSchema, req.body);
  if (!valid) return res.status(400).json({ errors: ajv.errors });
  next();
};