import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatPriceINR(amount: number): string {
  if (isNaN(amount) || amount === null || amount === undefined) return "₹0";
  
  if (amount >= 10000000) {
    const cr = amount / 10000000;
    return `₹${cr.toFixed(2).replace(/\.00$/, '')} Crore`;
  }
  if (amount >= 100000) {
    const lakh = amount / 100000;
    return `₹${lakh.toFixed(2).replace(/\.00$/, '')} Lakh`;
  }
  return new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    maximumFractionDigits: 0,
  }).format(amount);
}

export function formatNumberIndian(amount: number): string {
  if (isNaN(amount) || amount === null || amount === undefined) return "0";
  return new Intl.NumberFormat('en-IN').format(amount);
}

export function formatKM(km: number): string {
  return `${formatNumberIndian(km)} km`;
}

/**
 * Calculates monthly EMI based on standard compound interest formula:
 * EMI = P × r × (1+r)^n / ((1+r)^n - 1)
 * Handles zero interest rate gracefully.
 */
export function calculateEMI(
  principal: number,
  annualInterestRate: number,
  tenureMonths: number
): {
  monthlyEMI: number;
  totalInterest: number;
  totalPayable: number;
} {
  if (principal <= 0 || tenureMonths <= 0) {
    return { monthlyEMI: 0, totalInterest: 0, totalPayable: 0 };
  }

  if (annualInterestRate <= 0) {
    const emi = Math.round(principal / tenureMonths);
    return {
      monthlyEMI: emi,
      totalInterest: 0,
      totalPayable: principal,
    };
  }

  const monthlyRate = annualInterestRate / 12 / 100;
  const factor = Math.pow(1 + monthlyRate, tenureMonths);
  const emi = Math.round((principal * monthlyRate * factor) / (factor - 1));
  const totalPayable = emi * tenureMonths;
  const totalInterest = Math.max(0, totalPayable - principal);

  return {
    monthlyEMI: emi,
    totalInterest,
    totalPayable,
  };
}

export function createWhatsAppUrl(phone: string, text: string): string {
  const cleanPhone = phone.replace(/[^0-9]/g, "");
  return `https://wa.me/${cleanPhone}?text=${encodeURIComponent(text)}`;
}

export function createPhoneCallUrl(phone: string): string {
  const cleanPhone = phone.replace(/\s+/g, "");
  return `tel:${cleanPhone}`;
}
