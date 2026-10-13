import { NextRequest, NextResponse } from "next/server";
import { DataStore } from "@/lib/data/store";
import { supabaseAdmin } from "@/lib/supabase/admin";
import { supabase } from "@/lib/supabase/client";

export async function GET(
  _request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;

    // First try live Supabase
    const client = supabaseAdmin || supabase;
    if (client) {
      try {
        const { data, error } = await client
          .from("vehicles")
          .select(`
            *,
            make:makes(*),
            model:models(*),
            images:vehicle_images(*)
          `)
          .or(`id.eq.${id},slug.eq.${id}`)
          .maybeSingle();

        if (!error && data) {
          return NextResponse.json({ success: true, data });
        }
      } catch (err) {
        console.warn("Supabase query error in GET /api/admin/vehicles/[id]:", err);
      }
    }

    // Fallback to DataStore
    const vehicle = DataStore.getVehicleById(id) || DataStore.getVehicleBySlug(id);
    if (!vehicle) {
      return NextResponse.json(
        { success: false, error: "Vehicle not found" },
        { status: 404 }
      );
    }

    return NextResponse.json({ success: true, data: vehicle });
  } catch (err: any) {
    return NextResponse.json(
      { success: false, error: err.message || "Failed to fetch vehicle" },
      { status: 500 }
    );
  }
}

export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const body = await request.json();

    // 1. Update in DataStore cache
    const updatedInStore = DataStore.updateVehicle(id, body);

    // 2. If Supabase is available, sync update to database
    const client = supabaseAdmin;
    if (client) {
      try {
        const dbUpdates: Record<string, any> = {
          updated_at: new Date().toISOString(),
        };

        if (body.variant !== undefined) dbUpdates.variant = body.variant;
        if (body.year !== undefined) dbUpdates.year = Number(body.year);
        if (body.price !== undefined) dbUpdates.price = Number(body.price);
        if (body.mileage !== undefined) dbUpdates.mileage = Number(body.mileage);
        if (body.fuel_type !== undefined) dbUpdates.fuel_type = body.fuel_type;
        if (body.transmission !== undefined) dbUpdates.transmission = body.transmission;
        if (body.body_type !== undefined) dbUpdates.body_type = body.body_type;
        if (body.color !== undefined) dbUpdates.color = body.color;
        if (body.registration_number !== undefined) dbUpdates.registration_number = body.registration_number;
        if (body.ownership !== undefined) dbUpdates.ownership = body.ownership;
        if (body.insurance_validity !== undefined) dbUpdates.insurance_validity = body.insurance_validity;
        if (body.description !== undefined) dbUpdates.description = body.description;
        if (body.features !== undefined) dbUpdates.features = body.features;
        if (body.status !== undefined) dbUpdates.status = body.status;
        if (body.is_featured !== undefined) dbUpdates.is_featured = Boolean(body.is_featured);
        if (body.is_new_arrival !== undefined) dbUpdates.is_new_arrival = Boolean(body.is_new_arrival);
        if (body.is_hot_deal !== undefined) dbUpdates.is_hot_deal = Boolean(body.is_hot_deal);
        if (body.make_id !== undefined) dbUpdates.make_id = body.make_id;

        const { error: dbError } = await client
          .from("vehicles")
          .update(dbUpdates)
          .or(`id.eq.${id},slug.eq.${id}`);

        if (dbError) {
          console.warn("Supabase update error (cached in store):", dbError.message);
        }

        // If images or imageUrl provided, sync primary image
        if (body.imageUrl) {
          const { data: existingImg } = await client
            .from("vehicle_images")
            .select("id")
            .eq("vehicle_id", id)
            .eq("is_primary", true)
            .maybeSingle();

          if (existingImg) {
            await client
              .from("vehicle_images")
              .update({ image_url: body.imageUrl, updated_at: new Date().toISOString() })
              .eq("id", existingImg.id);
          } else {
            await client.from("vehicle_images").insert({
              vehicle_id: id,
              image_url: body.imageUrl,
              storage_path: "cars/photo.webp",
              alt_text: body.variant || "Vehicle Photo",
              is_primary: true,
              sort_order: 0,
            });
          }
        }
      } catch (dbErr) {
        console.warn("Database sync error in PUT /api/admin/vehicles/[id]:", dbErr);
      }
    }

    return NextResponse.json({
      success: true,
      data: updatedInStore || body,
    });
  } catch (err: any) {
    return NextResponse.json(
      { success: false, error: err.message || "Failed to update vehicle" },
      { status: 500 }
    );
  }
}

export async function DELETE(
  _request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;

    // 1. Delete in DataStore
    DataStore.deleteVehicle(id);

    // 2. Delete in Supabase if available
    const client = supabaseAdmin;
    if (client) {
      try {
        await client.from("vehicle_images").delete().eq("vehicle_id", id);
        await client.from("vehicles").delete().or(`id.eq.${id},slug.eq.${id}`);
      } catch (dbErr) {
        console.warn("Database delete error:", dbErr);
      }
    }

    return NextResponse.json({ success: true, message: "Vehicle deleted successfully" });
  } catch (err: any) {
    return NextResponse.json(
      { success: false, error: err.message || "Failed to delete vehicle" },
      { status: 500 }
    );
  }
}
