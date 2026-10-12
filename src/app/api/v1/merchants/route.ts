import { NextRequest, NextResponse } from "next/server";
import { getSupabaseServerClient } from "@/lib/supabase/server";
import {
  mapDbMerchantToMerchant,
  mapMerchantToDb,
  mapSubMerchantToDb,
  DbMerchantWithSubs,
} from "@/services/categoryMappers";
import type { MerchantItem } from "@/models/category";

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

    const { data, error } = await supabase
      .from("merchants")
      .insert(payload)
      .select()
      .single();

    if (error) {
      console.error("[API POST /merchants] Supabase error:", error.message);
      return NextResponse.json({ success: false, error: error.message }, { status: 400 });
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
