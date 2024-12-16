import { z } from 'zod';

export const RequiredStringSchema = z.string().min(1);
export const RequiredEmailSchema = RequiredStringSchema.email();
export const OptionalStringSchema = z.string().optional();
