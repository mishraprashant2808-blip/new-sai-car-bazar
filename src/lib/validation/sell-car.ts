import { z } from "zod";

export const sellCarSchema = z.object({
  make: z.string().min(2, "Make is required"),
  model: z.string().min(1, "Model is required"),
  year: z.number().int().min(1990).max(new Date().getFullYear() + 1),
  mileage: z.number().int().min(0, "Mileage is required"),
  fuel_type: z.string().optional(),
  transmission: z.string().optional(),
  registration: z.string().optional(),
  expected_price: z.number().min(1000, "Please enter an expected price").optional(),
  name: z.string().min(2, "Name is required"),
  phone: z.string().regex(/^[0-9]{10,12}$/, "Please enter a valid 10-digit mobile number"),
  email: z.string().email("Invalid email").optional().or(z.literal("")),
  city: z.string().default("Barabanki"),
  description: z.string().optional(),
});

export type SellCarFormData = z.infer<typeof sellCarSchema>;
