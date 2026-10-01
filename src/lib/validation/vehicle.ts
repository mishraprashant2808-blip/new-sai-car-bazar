import { z } from "zod";

export const vehicleSchema = z.object({
  stock_number: z.string().min(3, "Stock number is required"),
  slug: z.string().min(3, "Slug is required"),
  make_id: z.string().uuid("Invalid make ID"),
  model_id: z.string().uuid("Invalid model ID"),
  variant: z.string().optional(),
  year: z.number().int().min(1990).max(new Date().getFullYear() + 1),
  price: z.number().min(0, "Price must be non-negative"),
  mileage: z.number().int().min(0, "Mileage must be non-negative"),
  fuel_type: z.enum(['PETROL', 'DIESEL', 'CNG', 'ELECTRIC', 'HYBRID']),
  transmission: z.enum(['MANUAL', 'AUTOMATIC']),
  body_type: z.enum(['SUV', 'SEDAN', 'HATCHBACK', 'MUV', 'COUPE', 'CONVERTIBLE', 'LUXURY']),
  color: z.string().optional(),
  registration_year: z.number().int().min(1990).optional(),
  registration_number: z.string().optional(),
  rto_state: z.string().default("UP"),
  ownership: z.string().default("1st Owner"),
  insurance_validity: z.string().optional(),
  vin: z.string().optional(),
  description: z.string().min(10, "Description must be at least 10 characters"),
  features: z.array(z.string()).default([]),
  status: z.enum(['DRAFT', 'AVAILABLE', 'RESERVED', 'SOLD', 'ARCHIVED']).default('AVAILABLE'),
  is_featured: z.boolean().default(false),
  is_new_arrival: z.boolean().default(false),
  is_hot_deal: z.boolean().default(false),
});

export type VehicleFormData = z.infer<typeof vehicleSchema>;
