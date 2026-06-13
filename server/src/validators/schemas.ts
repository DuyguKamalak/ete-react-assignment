import { z } from 'zod';

export const credentialsSchema = z.object({
  username: z.string().trim().min(3, 'Username must be at least 3 characters'),
  password: z.string().min(6, 'Password must be at least 6 characters'),
});

export const companySchema = z.object({
  name: z.string().trim().min(1, 'Company name is required'),
  legalNumber: z.string().trim().min(1, 'Legal number is required'),
  incorporationCountry: z.string().trim().min(1, 'Incorporation country is required'),
  website: z
    .string()
    .trim()
    .url('Website must be a valid URL')
    .or(z.literal(''))
    .nullable()
    .optional(),
});

export const productSchema = z.object({
  name: z.string().trim().min(1, 'Product name is required'),
  category: z.string().trim().min(1, 'Category is required'),
  amount: z.coerce.number({ invalid_type_error: 'Amount must be a number' }).nonnegative('Amount must be zero or positive'),
  amountUnit: z.string().trim().min(1, 'Amount unit is required'),
  companyId: z.coerce.number({ invalid_type_error: 'Company is required' }).int().positive('Company is required'),
});

export type CompanyInput = z.infer<typeof companySchema>;
export type ProductInput = z.infer<typeof productSchema>;
