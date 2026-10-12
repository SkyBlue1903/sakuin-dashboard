import { NextRequest, NextResponse } from "next/server";
import { getSupabaseServerClient } from "@/lib/supabase/server";
import {
  mapDbToCategory,
  mapCategoryToDb,
  mapMerchantToDb,
  mapSubMerchantToDb,
  DbCategoryWithRelations,
} from "@/services/categoryMappers";
import type { CategoryItem } from "@/models/category";

export async function GET() {
  try {
    const supabase = getSupabaseServerClient();

    // Fallback jika Supabase belum dikonfigurasi di .env.local
    if (!supabase) {
      return NextResponse.json({
        success: true,
        source: "local-fallback",
        data: [],
        message: "Supabase belum terhubung di .env.local.",
      });
    }

    // Query categories dengan join bertingkat ke merchants dan sub_merchants (Zero JSON)
    const { data, error } = await supabase
      .from("categories")
      .select("*, merchants(*, sub_merchants(*))")
      .order("created_at", { ascending: true });

    if (error) {
      console.warn("[API GET /categories] Supabase note:", error.message);
      if (error.code === "PGRST205") {
        return NextResponse.json({
          success: true,
          source: "schema-not-ready-fallback",
          message: "Tabel belum dibuat di Supabase. Jalankan skrip supabase/schema.sql di SQL Editor Supabase.",
          data: [],
        });
      }
      return NextResponse.json({ success: false, error: error.message }, { status: 500 });
    }

    const categories = (data as DbCategoryWithRelations[] || []).map(mapDbToCategory);

    return NextResponse.json({
      success: true,
      source: "supabase",
      data: categories,
    });
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : "Internal Server Error";
    console.error("[API GET /categories] Exception:", message);
    return NextResponse.json({ success: false, error: message }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = (await request.json()) as CategoryItem;
    const supabase = getSupabaseServerClient();

    if (!supabase) {
      return NextResponse.json(
        {
          success: true,
          source: "local-mock",
          data: body,
          message: "Kategori disimpan secara lokal (Supabase belum terhubung).",
        },
        { status: 201 }
      );
    }

    const dbPayload = mapCategoryToDb(body);

    const { data: catData, error: catError } = await supabase
      .from("categories")
      .insert(dbPayload)
      .select()
      .single();

    if (catError) {
      console.error("[API POST /categories] Error insert category:", catError.message);
      return NextResponse.json({ success: false, error: catError.message }, { status: 400 });
    }

    const insertedCatId = catData.id;

    // Jika ada merchants, masukkan ke tabel merchants & sub_merchants
    if (body.merchants && body.merchants.length > 0) {
      for (const m of body.merchants) {
        const { data: insertedMerchant } = await supabase
          .from("merchants")
          .insert(mapMerchantToDb(m, String(insertedCatId)))
          .select()
          .single();

        const mId = insertedMerchant ? insertedMerchant.id : Number(m.id);
        if (m.subMerchants && m.subMerchants.length > 0 && !isNaN(mId)) {
          const subPayloads = m.subMerchants.map((s) => mapSubMerchantToDb(String(mId), s));
          await supabase.from("sub_merchants").insert(subPayloads);
        }
      }
    }

    // Ambil data lengkap dengan join 3 tingkat
    const { data: fullCategory } = await supabase
      .from("categories")
      .select("*, merchants(*, sub_merchants(*))")
      .eq("id", insertedCatId)
      .single();

    return NextResponse.json(
      {
        success: true,
        source: "supabase",
        data: fullCategory
          ? mapDbToCategory(fullCategory as DbCategoryWithRelations)
          : mapDbToCategory(catData as DbCategoryWithRelations),
      },
      { status: 201 }
    );
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : "Internal Server Error";
    return NextResponse.json({ success: false, error: message }, { status: 500 });
  }
}
