import { NextRequest, NextResponse } from "next/server";
import { getSupabaseServerClient } from "@/shared/lib/supabase/server";
import {
  mapDbPromoToPromo,
  mapPromoToDb,
  DbPromoRow,
  PromoItem,
} from "@/features/user/promo/domain/promo";

export const dynamic = "force-dynamic";
export const revalidate = 0;

export async function GET(request: NextRequest) {
  try {
    const supabase = getSupabaseServerClient();
    const { searchParams } = new URL(request.url);
    const includeHidden = searchParams.get("all") === "true";

    if (!supabase) {
      return NextResponse.json({
        success: true,
        source: "local-fallback",
        data: [],
        message: "Supabase belum terhubung di .env.local.",
      });
    }

    let query = supabase.from("promos").select("*");

    if (!includeHidden) {
      query = query.eq("is_hidden", false);
    }

    const { data, error } = await query.order("id", { ascending: false });

    if (error) {
      // Jika tabel belum dibuat di Supabase
      if (error.code === "PGRST205") {
        return NextResponse.json({
          success: true,
          source: "schema-not-ready",
          message:
            "Tabel 'promos' belum dibuat di Supabase. Jalankan skrip supabase/promos_schema.sql di SQL Editor.",
          data: [],
        });
      }
      console.warn("[API GET /promos] Supabase error:", error.message);
      return NextResponse.json({ success: false, error: error.message }, { status: 500 });
    }

    const promos: PromoItem[] = ((data as DbPromoRow[]) || []).map(mapDbPromoToPromo);

    return NextResponse.json({
      success: true,
      source: "supabase",
      data: promos,
    });
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : "Internal Server Error";
    console.error("[API GET /promos] Exception:", message);
    return NextResponse.json({ success: false, error: message }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { title, bannerUrl, shortDescription, contentHtml } = body;

    if (!title || !title.trim()) {
      return NextResponse.json(
        { success: false, error: "Judul promosi wajib diisi." },
        { status: 400 }
      );
    }
    if (!bannerUrl || !bannerUrl.trim()) {
      return NextResponse.json(
        { success: false, error: "Banner URL promosi wajib diisi." },
        { status: 400 }
      );
    }
    if (!shortDescription || !shortDescription.trim()) {
      return NextResponse.json(
        { success: false, error: "Deskripsi singkat promosi wajib diisi." },
        { status: 400 }
      );
    }

    const supabase = getSupabaseServerClient();
    if (!supabase) {
      return NextResponse.json(
        {
          success: true,
          source: "local-mock",
          data: body,
          message: "Promosi disimpan secara lokal (Supabase belum terhubung).",
        },
        { status: 201 }
      );
    }

    // Ambil max ID saat ini untuk memastikan auto-increment berurutan
    const { data: maxRow } = await supabase
      .from("promos")
      .select("id")
      .order("id", { ascending: false })
      .limit(1);

    const nextId = (maxRow?.[0]?.id ?? 0) + 1;
    const payload = mapPromoToDb(body, nextId);

    let { data, error } = await supabase
      .from("promos")
      .insert(payload)
      .select()
      .single();

    // Fallback conflict duplicate key (23505)
    if (error && error.code === "23505") {
      const { data: retryMax } = await supabase
        .from("promos")
        .select("id")
        .order("id", { ascending: false })
        .limit(1);
      payload.id = (retryMax?.[0]?.id ?? 0) + 1;

      const retryRes = await supabase
        .from("promos")
        .insert(payload)
        .select()
        .single();
      data = retryRes.data;
      error = retryRes.error;
    }

    // Fallback: Jika kolom is_highlight belum dibuat di Supabase (PGRST204)
    if (error && (error.code === "PGRST204" || error.message.includes("is_highlight"))) {
      const payloadWithoutHighlight = { ...payload };
      delete (payloadWithoutHighlight as Record<string, unknown>).is_highlight;
      const retryRes = await supabase
        .from("promos")
        .insert(payloadWithoutHighlight)
        .select()
        .single();
      data = retryRes.data;
      error = retryRes.error;
    }

    if (error || !data) {
      console.error("[API POST /promos] Error insert:", error?.message);
      return NextResponse.json(
        { success: false, error: error?.message || "Gagal menyimpan promosi ke database." },
        { status: 400 }
      );
    }

    const promoItem = mapDbPromoToPromo(data as DbPromoRow);
    if (body.isHighlight !== undefined) {
      promoItem.isHighlight = Boolean(body.isHighlight);
    }

    return NextResponse.json(
      {
        success: true,
        source: "supabase",
        data: promoItem,
      },
      { status: 201 }
    );
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : "Internal Server Error";
    return NextResponse.json({ success: false, error: message }, { status: 500 });
  }
}
