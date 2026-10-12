import { NextRequest, NextResponse } from "next/server";
import { getSupabaseServerClient } from "@/lib/supabase/server";
import {
  mapDbGuideToGuide,
  mapGuideToDb,
  DbGuideRow,
  GuideItem,
} from "@/models/guide";

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

    let query = supabase.from("guides").select("*");

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
          message: "Tabel 'guides' belum dibuat di Supabase. Jalankan skrip supabase/guides_schema.sql di SQL Editor.",
          data: [],
        });
      }
      console.warn("[API GET /guides] Supabase error:", error.message);
      return NextResponse.json({ success: false, error: error.message }, { status: 500 });
    }

    const guides: GuideItem[] = (data as DbGuideRow[] || []).map(mapDbGuideToGuide);

    return NextResponse.json({
      success: true,
      source: "supabase",
      data: guides,
    });
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : "Internal Server Error";
    console.error("[API GET /guides] Exception:", message);
    return NextResponse.json({ success: false, error: message }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { title, bannerUrl, shortDescription, contentHtml, isHidden } = body;

    if (!title || !title.trim()) {
      return NextResponse.json(
        { success: false, error: "Judul panduan wajib diisi." },
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
          message: "Panduan disimpan secara lokal (Supabase belum terhubung).",
        },
        { status: 201 }
      );
    }

    // Ambil max ID saat ini untuk memastikan auto-increment konsisten & sequence aman
    const { data: maxRow } = await supabase
      .from("guides")
      .select("id")
      .order("id", { ascending: false })
      .limit(1);

    const nextId = (maxRow?.[0]?.id ?? 0) + 1;
    const payload = mapGuideToDb(body, nextId);

    let { data, error } = await supabase
      .from("guides")
      .insert(payload)
      .select()
      .single();

    // Fallback: Jika terjadi conflict duplicate key (23505), ambil ulang max(id) + 1 dan coba lagi
    if (error && error.code === "23505") {
      const { data: retryMax } = await supabase
        .from("guides")
        .select("id")
        .order("id", { ascending: false })
        .limit(1);
      payload.id = (retryMax?.[0]?.id ?? 0) + 1;

      const retryRes = await supabase
        .from("guides")
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
        .from("guides")
        .insert(payloadWithoutHighlight)
        .select()
        .single();
      data = retryRes.data;
      error = retryRes.error;
    }

    if (error || !data) {
      console.error("[API POST /guides] Error insert:", error?.message);
      return NextResponse.json(
        { success: false, error: error?.message || "Gagal menyimpan panduan ke database." },
        { status: 400 }
      );
    }

    const guideItem = mapDbGuideToGuide(data as DbGuideRow);
    if (body.isHighlight !== undefined) {
      guideItem.isHighlight = Boolean(body.isHighlight);
    }

    return NextResponse.json(
      {
        success: true,
        source: "supabase",
        data: guideItem,
      },
      { status: 201 }
    );
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : "Internal Server Error";
    return NextResponse.json({ success: false, error: message }, { status: 500 });
  }
}
