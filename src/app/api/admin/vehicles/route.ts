import { NextRequest, NextResponse } from "next/server";
import { supabaseAdmin } from "@/lib/supabase/admin";
import { supabase } from "@/lib/supabase/client";
import { DataStore } from "@/lib/data/store";
import { getAppropriateCarPhoto } from "@/lib/utils";

function getClient() {
  return supabaseAdmin || supabase;
}

function withTimeout<T>(promise: PromiseLike<T>, ms = 1500): Promise<T> {
  return Promise.race([
    Promise.resolve(promise),
    new Promise<T>((_, reject) => setTimeout(() => reject(new Error("Supabase timeout")), ms)),
  ]);
}

// GET /api/admin/vehicles - list all vehicles
export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const status = searchParams.get("status") || undefined;
  const search = searchParams.get("search") || undefined;

  const client = getClient();
  if (client) {
    try {
      let query = client
        .from("vehicles")
        .select(`
          *,
          make:makes(*),
          model:models(*),
          images:vehicle_images(*)
        `)
        .order("created_at", { ascending: false });

      if (status) query = query.eq("status", status);

      const res = await withTimeout(query);
      if (!res.error && res.data && res.data.length > 0) {
        return NextResponse.json({ success: true, data: res.data });
      }
    } catch {
      // Fallback to DataStore
    }
  }

  // Fallback to DataStore
  const data = DataStore.getAllVehiclesAdmin();
  return NextResponse.json({ success: true, data });
}

// POST /api/admin/vehicles - add a new vehicle
export async function POST(req: NextRequest) {
  try {
    const body = await req.json();

    const makeName = body.make?.name || body.make_name || "";
    const modelName = body.model?.name || body.model_name || body.variant || "Car";
    const bodyType = body.body_type || "SUV";

    // Ensure matching photo is assigned if none given or if it is placeholder
    let imageUrl = body.image_url;
    if (!imageUrl || imageUrl.includes("photo-1549399542-7e3f8b79c341")) {
      imageUrl = getAppropriateCarPhoto(makeName, modelName, bodyType);
    }

    if (!body.images || body.images.length === 0 || !body.images[0]?.image_url) {
      body.images = [
        {
          id: `img-${Date.now()}`,
          vehicle_id: body.id || "new",
          storage_path: imageUrl,
          image_url: imageUrl,
          alt_text: `${makeName} ${modelName}`,
          sort_order: 0,
          is_primary: true,
        },
      ];
    }

    // Try saving to Supabase if configured
    const client = getClient();
    if (client) {
      try {
        const vehiclePayload = {
          stock_number: body.stock_number || `NSCB-${body.year || 2023}-${Math.floor(100 + Math.random() * 900)}`,
          slug: body.slug || `${(makeName || "car").toLowerCase()}-${modelName.toLowerCase().replace(/\s+/g, "-")}-${Date.now().toString().slice(-4)}`,
          make_id: body.make_id,
          model_id: body.model_id,
          variant: body.variant || "",
          year: Number(body.year) || 2023,
          price: Number(body.price) || 0,
          mileage: Number(body.mileage) || 0,
          fuel_type: body.fuel_type || "PETROL",
          transmission: body.transmission || "MANUAL",
          body_type: bodyType,
          color: body.color || "White",
          registration_number: body.registration_number || "",
          registration_year: Number(body.registration_year || body.year) || 2023,
          rto_state: body.rto_state || "UP",
          ownership: body.ownership || "1st Owner",
          insurance_validity: body.insurance_validity || "",
          description: body.description || "",
          features: body.features || [],
          status: body.status || "AVAILABLE",
          is_featured: Boolean(body.is_featured),
          is_new_arrival: Boolean(body.is_new_arrival),
          is_hot_deal: Boolean(body.is_hot_deal),
        };

        const { data: inserted, error: insertErr } = await withTimeout(
          client.from("vehicles").insert(vehiclePayload).select().single()
        );

        if (!insertErr && inserted) {
          // Insert primary image into vehicle_images table
          await withTimeout(
            client.from("vehicle_images").insert({
              vehicle_id: inserted.id,
              storage_path: imageUrl,
              image_url: imageUrl,
              alt_text: `${makeName} ${modelName}`,
              sort_order: 0,
              is_primary: true,
            })
          ).catch(() => {});

          const fullVehicle = { ...inserted, make: body.make, model: body.model, images: body.images };
          DataStore.addVehicle(fullVehicle);
          return NextResponse.json({ success: true, data: fullVehicle }, { status: 201 });
        }
      } catch {
        // Fallback to DataStore below
      }
    }

    // Fallback: save to DataStore singleton
    const newVehicle = DataStore.addVehicle(body);
    return NextResponse.json({ success: true, data: newVehicle }, { status: 201 });
  } catch (err: any) {
    return NextResponse.json({ success: false, error: err.message }, { status: 500 });
  }
}
