import { NextRequest, NextResponse } from "next/server";
import { DataStore } from "@/lib/data/store";

export async function POST(req: NextRequest) {
  try {
    const { csvContent } = await req.json();
    if (!csvContent || typeof csvContent !== "string") {
      return NextResponse.json({ success: false, error: "Missing csvContent" }, { status: 400 });
    }

    const result = DataStore.importVehiclesCSV(csvContent);
    return NextResponse.json({ success: true, ...result });
  } catch (err: any) {
    return NextResponse.json({ success: false, error: err.message }, { status: 500 });
  }
}
