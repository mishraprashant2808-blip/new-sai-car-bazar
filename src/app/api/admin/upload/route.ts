import { NextRequest, NextResponse } from "next/server";
import { supabaseAdmin } from "@/lib/supabase/admin";

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData();
    
    // Support single 'file' or multiple 'files'
    const files: File[] = [];
    const singleFile = formData.get("file") as File | null;
    if (singleFile) {
      files.push(singleFile);
    }
    
    const multipleFiles = formData.getAll("files") as File[];
    if (multipleFiles && multipleFiles.length > 0) {
      for (const f of multipleFiles) {
        if (!files.includes(f)) files.push(f);
      }
    }

    if (files.length === 0) {
      return NextResponse.json(
        { success: false, error: "No image files were provided for upload." },
        { status: 400 }
      );
    }

    const client = supabaseAdmin;
    if (!client) {
      return NextResponse.json(
        { success: false, error: "Supabase Storage service is not configured." },
        { status: 503 }
      );
    }

    const uploadedUrls: { url: string; path: string; name: string }[] = [];

    for (const file of files) {
      // Validate MIME type
      if (!file.type.startsWith("image/")) {
        return NextResponse.json(
          { success: false, error: `Invalid file type "${file.type}". Only images are accepted.` },
          { status: 400 }
        );
      }

      // Read file buffer
      const arrayBuffer = await file.arrayBuffer();
      const buffer = Buffer.from(arrayBuffer);

      // Sanitize filename & extension
      const origName = file.name.replace(/[^a-zA-Z0-9.-]/g, "_");
      const ext = origName.split(".").pop()?.toLowerCase() || "webp";
      const timestamp = Date.now();
      const rand = Math.floor(1000 + Math.random() * 9000);
      const storagePath = `inventory/${timestamp}_${rand}.${ext}`;

      const { data, error } = await client.storage
        .from("vehicles")
        .upload(storagePath, buffer, {
          contentType: file.type || "image/webp",
          upsert: true,
        });

      if (error) {
        console.error("Supabase Storage upload error:", error);
        return NextResponse.json(
          { success: false, error: error.message || "Failed to upload image to Supabase Storage" },
          { status: 500 }
        );
      }

      const { data: pubData } = client.storage
        .from("vehicles")
        .getPublicUrl(data.path);

      uploadedUrls.push({
        url: pubData.publicUrl,
        path: data.path,
        name: file.name,
      });
    }

    return NextResponse.json({
      success: true,
      data: uploadedUrls,
      // Convenience for single-file uploaders
      url: uploadedUrls[0]?.url,
    });
  } catch (err: any) {
    console.error("API /api/admin/upload error:", err);
    return NextResponse.json(
      { success: false, error: err.message || "Internal server error during upload" },
      { status: 500 }
    );
  }
}
