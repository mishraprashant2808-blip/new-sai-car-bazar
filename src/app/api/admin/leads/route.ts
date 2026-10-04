import { NextResponse } from "next/server";
import { supabaseAdmin } from "@/lib/supabase/admin";
import { DataStore } from "@/lib/data/store";

export const dynamic = "force-dynamic";

export async function GET() {
  try {
    if (supabaseAdmin) {
      const [leadsRes, financeRes, sellRes] = await Promise.all([
        supabaseAdmin.from("leads").select("*, vehicle:vehicles(slug, variant)").order("created_at", { ascending: false }),
        supabaseAdmin.from("finance_leads").select("*, vehicle:vehicles(slug, variant)").order("created_at", { ascending: false }),
        supabaseAdmin.from("sell_car_requests").select("*").order("created_at", { ascending: false }),
      ]);

      const leads = leadsRes.data || DataStore.getLeads();
      const financeLeads = financeRes.data || DataStore.getFinanceLeads();
      const sellRequests = sellRes.data || DataStore.getSellCarRequests();

      return NextResponse.json({
        success: true,
        data: {
          leads,
          financeLeads,
          sellRequests,
        },
      });
    }

    return NextResponse.json({
      success: true,
      data: {
        leads: DataStore.getLeads(),
        financeLeads: DataStore.getFinanceLeads(),
        sellRequests: DataStore.getSellCarRequests(),
      },
    });
  } catch (error: any) {
    console.error("Admin leads fetch error:", error);
    return NextResponse.json(
      {
        success: true,
        data: {
          leads: DataStore.getLeads(),
          financeLeads: DataStore.getFinanceLeads(),
          sellRequests: DataStore.getSellCarRequests(),
        },
      },
      { status: 200 }
    );
  }
}

export async function PATCH(req: Request) {
  try {
    const { type, id, status } = await req.json();

    if (!id || !status) {
      return NextResponse.json({ success: false, error: "Missing id or status" }, { status: 400 });
    }

    if (supabaseAdmin) {
      let table = "leads";
      if (type === "finance") table = "finance_leads";
      if (type === "sellCar") table = "sell_car_requests";

      const { error } = await supabaseAdmin
        .from(table)
        .update({ status, updated_at: new Date().toISOString() })
        .eq("id", id);

      if (error) {
        console.error(`Failed to update ${table} in Supabase:`, error);
      }
    }

    // Also update DataStore
    if (type === "enquiries") DataStore.updateLeadStatus(id, status);
    else if (type === "finance") DataStore.updateFinanceLeadStatus(id, status);
    else if (type === "sellCar") DataStore.updateSellCarStatus(id, status);

    return NextResponse.json({ success: true });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
