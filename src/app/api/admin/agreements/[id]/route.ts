import { NextRequest, NextResponse } from "next/server";
import { supabaseAdmin } from "@/lib/supabase/admin";
import { supabase } from "@/lib/supabase/client";
import { DataStore } from "@/lib/data/store";

function getClient() {
  return supabaseAdmin || supabase;
}

function withTimeout<T>(promise: PromiseLike<T>, ms = 1200): Promise<T> {
  return Promise.race([
    Promise.resolve(promise),
    new Promise<T>((_, reject) => setTimeout(() => reject(new Error("Supabase timeout")), ms)),
  ]);
}

export async function GET(_: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const client = getClient();
  if (client) {
    try {
      const res = await withTimeout(
        client
          .from("agreements")
          .select("*")
          .eq("id", id)
          .single()
      );
      if (!res.error && res.data) {
        return NextResponse.json({ data: res.data });
      }
    } catch {
      // Fallback
    }
  }

  const item = DataStore.getAgreementById(id);
  if (!item) return NextResponse.json({ error: "Deed not found" }, { status: 404 });
  return NextResponse.json({ data: item });
}

export async function PUT(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const body = await req.json();

  const client = getClient();
  if (client) {
    try {
      const res = await withTimeout(
        client
          .from("agreements")
          .update(body)
          .eq("id", id)
          .select()
          .single()
      );
      if (!res.error && res.data) {
        DataStore.updateAgreement(id, body);
        return NextResponse.json({ data: res.data });
      }
    } catch {
      // Fallback
    }
  }

  const updated = DataStore.updateAgreement(id, body);
  if (!updated) return NextResponse.json({ error: "Deed not found" }, { status: 404 });
  return NextResponse.json({ data: updated });
}

export async function DELETE(_: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;

  const client = getClient();
  if (client) {
    try {
      const res = await withTimeout(
        client.from("agreements").delete().eq("id", id)
      );
      if (!res.error) {
        DataStore.deleteAgreement(id);
        return NextResponse.json({ success: true });
      }
    } catch {
      // Fallback
    }
  }

  const success = DataStore.deleteAgreement(id);
  return NextResponse.json({ success });
}
