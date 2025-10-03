import { z } from 'zod';
import { ValidationError } from '../types';

export const phoneSchema = z.string()
  .min(11, 'Phone number must be at least 11 digits')
  .max(15, 'Phone number must be at most 15 digits')
  .regex(/^\d+$/, 'Phone number must contain only digits')
  .refine((phone) => {
    // Check if all digits are identical
    const firstDigit = phone[0];
    return !phone.split('').every(digit => digit === firstDigit);
  }, 'Phone number cannot have all identical digits');

export const nameSchema = z.string()
  .min(1, 'Name is required')
  .max(100, 'Name must be less than 100 characters')
  .trim();

export const spinFormSchema = z.object({
  name: nameSchema,
  phone: phoneSchema,
});

export const wheelSliceSchema = z.object({
  label: z.string().min(1, 'Prize name is required').max(50, 'Prize name must be less than 50 characters'),
  weight: z.number().min(0.1, 'Weight must be at least 0.1').max(100, 'Weight must be at most 100'),
});

export const adminConfigSchema = z.object({
  slices: z.array(wheelSliceSchema)
    .min(8, 'Must have at least 8 slices')
    .max(16, 'Must have at most 16 slices'),
});

export function validateForm(data: unknown): { success: boolean; errors: ValidationError[] } {
  try {
    spinFormSchema.parse(data);
    return { success: true, errors: [] };
  } catch (error) {
    if (error instanceof z.ZodError) {
      const errors: ValidationError[] = error.errors.map(err => ({
        field: err.path.join('.'),
        message: err.message,
      }));
      return { success: false, errors };
    }
    return { success: false, errors: [{ field: 'general', message: 'Validation failed' }] };
  }
}

export function validateAdminConfig(data: unknown): { success: boolean; errors: ValidationError[] } {
  try {
    adminConfigSchema.parse(data);
    return { success: true, errors: [] };
  } catch (error) {
    if (error instanceof z.ZodError) {
      const errors: ValidationError[] = error.errors.map(err => ({
        field: err.path.join('.'),
        message: err.message,
      }));
      return { success: false, errors };
    }
    return { success: false, errors: [{ field: 'general', message: 'Validation failed' }] };
  }
}

