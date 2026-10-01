import { z } from "zod";

export const leadSchema = z.object({
  vehicle_id: z.string().uuid().optional(),
  name: z.string().min(2, "Name must be at least 2 characters"),
  phone: z.string().regex(/^[0-9]{10,12}$/, "Please enter a valid 10-digit mobile number"),
  email: z.string().email("Invalid email address").optional().or(z.literal("")),
  message: z.string().optional(),
  source: z.string().default("website_enquiry"),
});

export type LeadFormData = z.infer<typeof leadSchema>;
