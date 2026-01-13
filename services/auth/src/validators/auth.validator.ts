import Ajv from 'ajv';
import addFormats from 'ajv-formats';
import { Request, Response, NextFunction } from 'express';

const ajv = new Ajv({ allErrors: true });
addFormats(ajv);

const signupSchema = {
  type: 'object',
  properties: {
    email: { type: 'string', format: 'email' },
    password: { type: 'string', minLength: 8 },
    role: { type: 'string', enum: ['customer', 'seller', 'admin'] }
  },
  required: ['email', 'password'],
  additionalProperties: false
};

export const validateSignup = (req: Request, res: Response, next: NextFunction) => {
  const valid = ajv.validate(signupSchema, req.body);
  if (!valid) return res.status(400).json({ errors: ajv.errors });
  next();
};
