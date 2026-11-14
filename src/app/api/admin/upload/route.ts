import { NextRequest, NextResponse } from "next/server";
import { supabaseAdmin } from "@/lib/supabase/admin";
import fs from "fs/promises";
import path from "path";

// Timeout wrapper for Supabase cloud calls
function withTimeout<T>(promise: PromiseLike<T>, ms = 2000): Promise<T> {
  return Promise.race([
    Promise.resolve(promise),
    new Promise<T>((_, reject) => setTimeout(() => reject(new Error("Supabase storage timeout")), ms)),
  ]);
}

async function saveToLocalDisk(buffer: Buffer, filename: string): Promise<string> {
  const uploadDir = path.join(process.cwd(), "public", "uploads", "inventory");
  await fs.mkdir(uploadDir, { recursive: true });
  const filePath = path.join(uploadDir, filename);
  await fs.writeFile(filePath, buffer);
  return `/uploads/inventory/${filename}`;
}

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

    const uploadedUrls: { url: string; path: string; name: string; storage: string }[] = [];

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
      const safeFilename = `${timestamp}_${rand}.${ext}`;
      const storagePath = `inventory/${safeFilename}`;

      let fileUploaded = false;

      // ─── TIER 1: Attempt Supabase Storage (if configured & reachable) ────────
      if (supabaseAdmin) {
        try {
          const uploadPromise = supabaseAdmin.storage
            .from("vehicles")
            .upload(storagePath, buffer, {
              contentType: file.type || "image/webp",
              upsert: true,
            });

          const { data, error } = await withTimeout(uploadPromise, 2000);

          if (!error && data?.path) {
            const { data: pubData } = supabaseAdmin.storage
              .from("vehicles")
              .getPublicUrl(data.path);

            if (pubData?.publicUrl) {
              uploadedUrls.push({
                url: pubData.publicUrl,
                path: data.path,
                name: file.name,
                storage: "supabase",
              });
              fileUploaded = true;
            }
          }
        } catch {
          // Supabase timed out, DNS unresolved, or paused project — fall through to Tier 2
        }
      }

      // ─── TIER 2: Local Filesystem Storage Fallback ───────────────────────────
      if (!fileUploaded) {
        try {
          const localUrl = await saveToLocalDisk(buffer, safeFilename);
          uploadedUrls.push({
            url: localUrl,
            path: safeFilename,
            name: file.name,
            storage: "local-disk",
          });
          fileUploaded = true;
        } catch {
          // In serverless readonly environments, fall through to Tier 3
        }
      }

      // ─── TIER 3: Base64 / Data URI Fallback (Zero-failure guarantee) ─────────
      if (!fileUploaded) {
        const base64 = buffer.toString("base64");
        const dataUri = `data:${file.type || "image/jpeg"};base64,${base64}`;
        uploadedUrls.push({
          url: dataUri,
          path: safeFilename,
          name: file.name,
          storage: "data-uri",
        });
        fileUploaded = true;
      }
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
