import { z } from "zod";

export const financeLeadSchema = z.object({
  vehicle_id: z.string().uuid().optional(),
  name: z.string().min(2, "Name must be at least 2 characters"),
  phone: z.string().regex(/^[0-9]{10,12}$/, "Please enter a valid 10-digit mobile number"),
  email: z.string().email("Invalid email address").optional().or(z.literal("")),
  vehicle_price: z.number().min(1, "Vehicle price must be positive"),
  loan_amount: z.number().min(1, "Loan amount must be positive"),
  down_payment: z.number().min(0, "Down payment cannot be negative"),
  interest_rate: z.number().min(0.1, "Interest rate is required"),
  tenure: z.number().int().min(6).max(84, "Tenure must be between 6 and 84 months"),
  estimated_emi: z.number().optional(),
  employment_type: z.string().optional(),
  monthly_income: z.number().optional(),
  message: z.string().optional(),
});

export type FinanceLeadFormData = z.infer<typeof financeLeadSchema>;
