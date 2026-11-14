import { NextResponse } from "next/server";
import { supabaseAdmin } from "@/lib/supabase/admin";
import { supabase } from "@/lib/supabase/client";
import { DataStore } from "@/lib/data/store";
import { financeLeadSchema } from "@/lib/validation/finance";
import { checkRateLimit } from "@/lib/rateLimit";

function withTimeout<T>(promise: PromiseLike<T>, ms = 1500): Promise<T> {
  return Promise.race([
    Promise.resolve(promise),
    new Promise<T>((_, reject) => setTimeout(() => reject(new Error("Supabase timeout")), ms)),
  ]);
}

export async function POST(req: Request) {
  try {
    // Rate limit: 10 finance applications per 10 minutes per IP
    const rateLimit = checkRateLimit(req, {
      maxRequests: 10,
      windowSeconds: 600,
      keyPrefix: "finance",
    });

    if (!rateLimit.allowed) {
      return NextResponse.json(
        {
          success: false,
          error: `Too many applications submitted. Please wait ${Math.ceil(
            (rateLimit.retryAfterSeconds || 60) / 60
          )} minutes before submitting again.`,
        },
        { status: 429, headers: { "Retry-After": String(rateLimit.retryAfterSeconds || 600) } }
      );
    }

    const body = await req.json();
    const validation = financeLeadSchema.safeParse(body);

    if (!validation.success) {
      return NextResponse.json(
        { success: false, error: validation.error.errors[0]?.message || "Invalid input" },
        { status: 400 }
      );
    }

    const leadData = validation.data;
    const cleanLeadData = {
      ...leadData,
      estimated_emi: leadData.estimated_emi || 0,
    };

    // Instant Lead WhatsApp Notification link
    const dealerWhatsApp = "918172946630";
    const waText = [
      `💰 *New Car Loan Application — New Sai Car Bazar*`,
      `👤 *Applicant:* ${leadData.name}`,
      `📞 *Phone:* ${leadData.phone}`,
      `💵 *Loan Amount:* ₹${leadData.loan_amount.toLocaleString("en-IN")}`,
      `📅 *Tenure:* ${leadData.tenure} Months`,
      `🏷️ *Down Payment:* ₹${leadData.down_payment.toLocaleString("en-IN")}`,
      leadData.employment_type ? `💼 *Employment:* ${leadData.employment_type}` : null,
      leadData.monthly_income ? `📊 *Income:* ₹${leadData.monthly_income.toLocaleString("en-IN")}/mo` : null,
    ].filter(Boolean).join("\n");
    const whatsappUrl = `https://wa.me/${dealerWhatsApp}?text=${encodeURIComponent(waText)}`;

    const client = supabaseAdmin || supabase;

    if (client) {
      try {
        const insertPromise = client
          .from("finance_leads")
          .insert([
            {
              name: leadData.name,
              phone: leadData.phone,
              email: leadData.email || null,
              vehicle_id: leadData.vehicle_id || null,
              vehicle_price: leadData.vehicle_price,
              loan_amount: leadData.loan_amount,
              down_payment: leadData.down_payment,
              interest_rate: leadData.interest_rate,
              tenure: leadData.tenure,
              estimated_emi: leadData.estimated_emi,
              employment_type: leadData.employment_type || null,
              monthly_income: leadData.monthly_income || null,
              message: leadData.message || null,
              status: "NEW",
            },
          ])
          .select()
          .single();

        const { data, error } = await withTimeout(insertPromise, 1500);

        if (!error && data) {
          DataStore.createFinanceLead(cleanLeadData);
          return NextResponse.json({
            success: true,
            data,
            whatsappUrl,
            message: "Finance inquiry submitted successfully. Instant WhatsApp dispatch ready.",
          });
        }
      } catch {
        // Fallback to DataStore when Supabase cloud is unreachable
      }
    }

    DataStore.createFinanceLead(cleanLeadData);
    return NextResponse.json({
      success: true,
      whatsappUrl,
      message: "Finance inquiry submitted successfully. Instant WhatsApp dispatch ready.",
    });
  } catch (err: any) {
    console.error("Finance API error:", err);
    return NextResponse.json(
      { success: false, error: err.message || "Failed to submit finance application" },
      { status: 500 }
    );
  }
}
