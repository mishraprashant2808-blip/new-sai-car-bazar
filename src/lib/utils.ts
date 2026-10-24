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

/**
 * Returns an authentic, showroom-quality photo matching the car make, model, or body type.
 * Never falls back to foreign supercars or random Porsches/BMWs.
 */
export function getAppropriateCarPhoto(make?: string, model?: string, bodyType?: string): string {
  const m = `${make || ""} ${model || ""}`.toLowerCase();
  
  if (m.includes("fortuner")) return "/cars/fortuner.jpg";
  if (m.includes("creta")) return "/cars/creta.jpg";
  if (m.includes("scorpio")) return "/cars/scorpio.jpg";
  if (m.includes("harrier")) return "/cars/harrier.jpg";
  if (m.includes("city")) return "/cars/city.jpg";
  if (m.includes("bmw") || m.includes("3 series") || m.includes("320d")) return "/cars/bmw.jpg";

  // By brand defaults
  if (m.includes("toyota") || m.includes("innova") || m.includes("glanza") || m.includes("hyryder")) return "/cars/fortuner.jpg";
  if (m.includes("hyundai") || m.includes("venue") || m.includes("i20") || m.includes("verna")) return "/cars/creta.jpg";
  if (m.includes("mahindra") || m.includes("thar") || m.includes("xuv") || m.includes("bolero")) return "/cars/scorpio.jpg";
  if (m.includes("tata") || m.includes("safari") || m.includes("nexon") || m.includes("punch")) return "/cars/harrier.jpg";
  if (m.includes("honda") || m.includes("amaze") || m.includes("elevate")) return "/cars/city.jpg";
  if (m.includes("maruti") || m.includes("suzuki") || m.includes("swift") || m.includes("baleno") || m.includes("brezza") || m.includes("wagonr") || m.includes("ertiga")) return "/cars/creta.jpg";

  // By body type
  const bt = (bodyType || "").toUpperCase();
  if (bt === "SUV" || bt === "MUV") return "/cars/scorpio.jpg";
  if (bt === "SEDAN") return "/cars/city.jpg";
  if (bt === "HATCHBACK") return "/cars/creta.jpg";

  return "/cars/fortuner.jpg";
}

