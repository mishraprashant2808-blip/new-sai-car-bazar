import { NextRequest, NextResponse } from "next/server";
import { DataStore } from "@/lib/data/store";
import { supabaseAdmin } from "@/lib/supabase/admin";
import { supabase } from "@/lib/supabase/client";
import { checkRateLimit } from "@/lib/rateLimit";

function sanitizeRegNumber(str: string): string {
  return str.replace(/[^a-zA-Z0-9]/g, "").toUpperCase();
}

function withTimeout<T>(promise: PromiseLike<T>, ms = 1500): Promise<T> {
  return Promise.race([
    Promise.resolve(promise),
    new Promise<T>((_, reject) => setTimeout(() => reject(new Error("Supabase timeout")), ms)),
  ]);
}

export async function GET(req: NextRequest) {
  try {
    // Rate limit: 20 searches per 10 minutes per IP
    const rateLimit = checkRateLimit(req, {
      maxRequests: 20,
      windowSeconds: 600,
      keyPrefix: "track-rc",
    });

    if (!rateLimit.allowed) {
      return NextResponse.json(
        {
          success: false,
          error: "Too many search requests. Please try again in a few minutes.",
        },
        { status: 429, headers: { "Retry-After": String(rateLimit.retryAfterSeconds || 600) } }
      );
    }

    const { searchParams } = new URL(req.url);
    const query = searchParams.get("q") || "";

    if (!query.trim() || query.trim().length < 4) {
      return NextResponse.json(
        { success: false, error: "Please enter a valid Registration Number or Deed Number (minimum 4 characters)." },
        { status: 400 }
      );
    }

    const cleanQ = query.trim().toUpperCase();
    const sanitizedCleanQ = sanitizeRegNumber(cleanQ);

    let match: any = null;

    // 1. Try Supabase query
    const client = supabaseAdmin || supabase;
    if (client) {
      try {
        const queryPromise = client
          .from("agreements")
          .select("id, deed_number, deed_date, make_model, reg_number, reg_rto, rc_transfer_status, form29_received, form30_received, rto_receipt_no, rc_transfer_date, created_at")
          .or(`deed_number.ilike.%${cleanQ}%,reg_number.ilike.%${cleanQ}%`)
          .limit(1)
          .maybeSingle();

        const { data } = await withTimeout(queryPromise, 1500);
        if (data) {
          match = data;
        }
      } catch {
        // Fallback to DataStore
      }
    }

    // 2. Fallback to DataStore if not found in Supabase
    if (!match) {
      const allDeeds = DataStore.getAgreements();
      match = allDeeds.find((d) => {
        const dDeed = d.deed_number.toUpperCase();
        const dReg = sanitizeRegNumber(d.reg_number);
        return dDeed.includes(cleanQ) || dReg === sanitizedCleanQ || d.reg_number.toUpperCase().includes(cleanQ);
      });
    }

    if (!match) {
      return NextResponse.json({
        success: true,
        found: false,
        message: "No RC transfer record found matching this Registration or Deed Number. Please verify your details or contact New Sai Car Bazar showroom.",
      });
    }

    // Determine timeline steps
    const status = match.rc_transfer_status || "PENDING";
    const isAtRto = status === "AT_RTO" || status === "COMPLETED";
    const isCompleted = status === "COMPLETED";

    const steps = [
      {
        step: 1,
        title: "विलेख निष्पादन एवं दस्तावेज प्राप्ति (Deed Executed)",
        description: "वाहन विक्रय विलेख निष्पादित हुआ तथा क्रेता/विक्रेता के आवश्यक दस्तावेज प्राप्त हुए।",
        completed: true,
        date: match.deed_date || match.created_at?.slice(0, 10),
      },
      {
        step: 2,
        title: "Form 29 एवं Form 30 सत्यापन (Document Verification)",
        description: "आर.टी.ओ. हस्तांतरण प्रपत्र 29 एवं 30 का विधिवत सत्यापन पूर्ण।",
        completed: Boolean(match.form29_received && match.form30_received) || isAtRto,
        date: match.deed_date || match.created_at?.slice(0, 10),
      },
      {
        step: 3,
        title: "संबंधित RTO में पत्रावली जमा (Submitted to RTO)",
        description: match.rto_receipt_no
          ? `पावती सं. ${match.rto_receipt_no} के साथ संबंधित संभागीय परिवहन कार्यालय (RTO) में दस्तावेज प्रस्तुत।`
          : "आर.टी.ओ. कार्यालय में दस्तावेज प्रक्रियाधीन हैं।",
        completed: isAtRto,
        receipt: match.rto_receipt_no || null,
      },
      {
        step: 4,
        title: "स्वामित्व हस्तांतरण पूर्ण / नवीन RC (Transfer Complete)",
        description: isCompleted
          ? "परिवहन विभाग के रिकॉर्ड में स्वामित्व हस्तांतरण पूर्ण हो गया है तथा नवीन RC उपलब्ध है।"
          : "आर.टी.ओ. द्वारा अंतिम अनुमोदन एवं स्मार्ट कार्ड मुद्रण प्रक्रियाधीन।",
        completed: isCompleted,
        date: match.rc_transfer_date || null,
      },
    ];

    // STRICT PRIVACY PROTECTION: Only return public non-sensitive data
    return NextResponse.json({
      success: true,
      found: true,
      data: {
        deed_number: match.deed_number,
        deed_date: match.deed_date,
        make_model: match.make_model,
        reg_number: match.reg_number,
        reg_rto: match.reg_rto || "Barabanki RTO",
        rc_transfer_status: status,
        rto_receipt_no: match.rto_receipt_no || null,
        rc_transfer_date: match.rc_transfer_date || null,
        steps,
      },
    });
  } catch (err: any) {
    return NextResponse.json(
      { success: false, error: err.message || "Failed to search RC status." },
      { status: 500 }
    );
  }
}
