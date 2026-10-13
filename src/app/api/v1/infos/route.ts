import { NextRequest, NextResponse } from "next/server";
import { getSupabaseServerClient } from "@/lib/supabase/server";
import {
  mapDbInfoToInfo,
  mapInfoToDb,
  DbInfoRow,
  InfoItem,
} from "@/models/info";

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

    let query = supabase.from("infos").select("*");

    if (!includeHidden) {
      query = query.eq("is_hidden", false);
    }

    const { data, error } = await query
      .order("id", { ascending: false });

    if (error) {
      // Jika tabel belum dibuat di Supabase
      if (error.code === "PGRST205") {
        return NextResponse.json({
          success: true,
          source: "schema-not-ready",
          message: "Tabel 'infos' belum dibuat di Supabase. Jalankan skrip supabase/infos_schema.sql di SQL Editor.",
          data: [],
        });
      }
      console.warn("[API GET /infos] Supabase error:", error.message);
      return NextResponse.json({ success: false, error: error.message }, { status: 500 });
    }

    const infos: InfoItem[] = (data as DbInfoRow[] || []).map(mapDbInfoToInfo);

    return NextResponse.json({
      success: true,
      source: "supabase",
      data: infos,
    });
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : "Internal Server Error";
    console.error("[API GET /infos] Exception:", message);
    return NextResponse.json({ success: false, error: message }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { title, bannerUrl, shortDescription, contentHtml, publishedAt } = body;

    if (!title || !title.trim()) {
      return NextResponse.json(
        { success: false, error: "Judul informasi wajib diisi." },
        { status: 400 }
      );
    }
    if (!bannerUrl || !bannerUrl.trim()) {
      return NextResponse.json(
        { success: false, error: "Banner URL informasi wajib diisi." },
        { status: 400 }
      );
    }
    if (!shortDescription || !shortDescription.trim()) {
      return NextResponse.json(
        { success: false, error: "Deskripsi singkat informasi wajib diisi." },
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
          message: "Informasi disimpan secara lokal (Supabase belum terhubung).",
        },
        { status: 201 }
      );
    }

    // Ambil max ID saat ini untuk memastikan auto-increment berurutan
    const { data: maxRow } = await supabase
      .from("infos")
      .select("id")
      .order("id", { ascending: false })
      .limit(1);

    const nextId = (maxRow?.[0]?.id ?? 0) + 1;
    const payload = mapInfoToDb(body, nextId);

    let { data, error } = await supabase
      .from("infos")
      .insert(payload)
      .select()
      .single();

    // Fallback conflict duplicate key (23505)
    if (error && error.code === "23505") {
      const { data: retryMax } = await supabase
        .from("infos")
        .select("id")
        .order("id", { ascending: false })
        .limit(1);
      payload.id = (retryMax?.[0]?.id ?? 0) + 1;

      const retryRes = await supabase
        .from("infos")
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
        .from("infos")
        .insert(payloadWithoutHighlight)
        .select()
        .single();
      data = retryRes.data;
      error = retryRes.error;
    }

    if (error || !data) {
      console.error("[API POST /infos] Error insert:", error?.message);
      return NextResponse.json(
        { success: false, error: error?.message || "Gagal menyimpan informasi ke database." },
        { status: 400 }
      );
    }

    const infoItem = mapDbInfoToInfo(data as DbInfoRow);
    if (body.isHighlight !== undefined) {
      infoItem.isHighlight = Boolean(body.isHighlight);
    }

    return NextResponse.json(
      {
        success: true,
        source: "supabase",
        data: infoItem,
      },
      { status: 201 }
    );
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : "Internal Server Error";
    return NextResponse.json({ success: false, error: message }, { status: 500 });
  }
}
