import { NextRequest, NextResponse } from "next/server";
import { getSupabaseServerClient } from "@/shared/lib/supabase/server";
import {
  mapDbMerchantToMerchant,
  mapMerchantToDb,
  mapSubMerchantToDb,
  DbMerchantWithSubs,
} from "@/features/admin/merchant/data/categoryMappers";
import type { MerchantItem } from "@/features/admin/merchant/domain/category";

export async function POST(request: NextRequest) {
  try {
    const body = (await request.json()) as {
      categoryId: string;
      merchant: MerchantItem;
    };

    const { categoryId, merchant } = body;
    if (!categoryId || !merchant || !merchant.name) {
      return NextResponse.json(
        { success: false, error: "categoryId dan merchant.name wajib diisi." },
        { status: 400 }
      );
    }

    const supabase = getSupabaseServerClient();
    if (!supabase) {
      return NextResponse.json(
        {
          success: true,
          source: "local-mock",
          data: merchant,
          message: "Merchant disimpan secara lokal (Supabase belum terhubung).",
        },
        { status: 201 }
      );
    }

    const payload = mapMerchantToDb(merchant, categoryId);

    // Pastikan ID numerik selalu berurutan (auto-increment) dan tidak bentrok dengan PostgreSQL sequence
    if (!payload.id) {
      const { data: maxRow } = await supabase
        .from("merchants")
        .select("id")
        .order("id", { ascending: false })
        .limit(1);
      const nextId = (maxRow?.[0]?.id ?? 0) + 1;
      payload.id = nextId;
    }

    let { data, error } = await supabase
      .from("merchants")
      .insert(payload)
      .select()
      .single();

    // Fallback: Jika terjadi error duplicate key (23505), ambil ulang max(id) + 1 dan coba lagi
    if (error && error.code === "23505") {
      const { data: maxRow } = await supabase
        .from("merchants")
        .select("id")
        .order("id", { ascending: false })
        .limit(1);
      payload.id = (maxRow?.[0]?.id ?? 0) + 1;

      const retryRes = await supabase
        .from("merchants")
        .insert(payload)
        .select()
        .single();
      data = retryRes.data;
      error = retryRes.error;
    }

    if (error || !data) {
      console.error("[API POST /merchants] Supabase error:", error?.message);
      return NextResponse.json(
        { success: false, error: error?.message || "Gagal menyimpan merchant" },
        { status: 400 }
      );
    }

    const insertedId = data.id;

    // Masukkan sub-merchants jika ada
    if (merchant.subMerchants && merchant.subMerchants.length > 0) {
      const subPayloads = merchant.subMerchants.map((s) =>
        mapSubMerchantToDb(String(insertedId), s)
      );
      await supabase.from("sub_merchants").insert(subPayloads);
    }

    // Ambil merchant dengan join ke sub_merchants
    const { data: fullMerchant } = await supabase
      .from("merchants")
      .select("*, sub_merchants(*)")
      .eq("id", insertedId)
      .single();

    return NextResponse.json(
      {
        success: true,
        source: "supabase",
        data: fullMerchant
          ? mapDbMerchantToMerchant(fullMerchant as DbMerchantWithSubs)
          : mapDbMerchantToMerchant(data as DbMerchantWithSubs),
      },
      { status: 201 }
    );
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : "Internal Server Error";
    return NextResponse.json({ success: false, error: message }, { status: 500 });
  }
}
