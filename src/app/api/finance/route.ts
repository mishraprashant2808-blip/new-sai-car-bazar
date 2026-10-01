import { NextResponse } from "next/server";
import { supabaseAdmin } from "@/lib/supabase/admin";
import { supabase } from "@/lib/supabase/client";
import { DataStore } from "@/lib/data/store";
import { financeLeadSchema } from "@/lib/validation/finance";

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const validation = financeLeadSchema.safeParse(body);

    if (!validation.success) {
      return NextResponse.json(
        { success: false, error: validation.error.errors[0]?.message || "Invalid input" },
        { status: 400 }
      );
    }

    const leadData = validation.data;
    const client = supabaseAdmin || supabase;

    if (client) {
      const { data, error } = await client
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

    const cleanLeadData = {
      ...leadData,
      estimated_emi: leadData.estimated_emi || 0,
    };

    if (error) {
      console.error("Supabase finance lead error:", error);
      DataStore.createFinanceLead(cleanLeadData);
    } else {
      DataStore.createFinanceLead(cleanLeadData);
      return NextResponse.json({ success: true, data });
    }
  } else {
    DataStore.createFinanceLead({
      ...leadData,
      estimated_emi: leadData.estimated_emi || 0,
    });
  }

    return NextResponse.json({ success: true, message: "Finance application submitted" });
  } catch (err: any) {
    console.error("Finance API error:", err);
    return NextResponse.json(
      { success: false, error: err.message || "Failed to submit finance application" },
      { status: 500 }
    );
  }
}
