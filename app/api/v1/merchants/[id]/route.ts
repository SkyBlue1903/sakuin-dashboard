import { NextRequest, NextResponse } from "next/server";
import { getSupabaseServerClient } from "@/lib/supabase/server";
import {
  mapDbMerchantToMerchant,
  mapSubMerchantToDb,
  DbMerchantWithSubs,
} from "@/lib/api/categoryMappers";
import { TablesUpdate } from "@/lib/supabase/database.types";

export async function PUT(
  request: NextRequest,
  context: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await context.params;
    const numId = Number(id);
    const validId = isNaN(numId) ? (id as unknown as number) : numId;
    const body = await request.json();
    const supabase = getSupabaseServerClient();

    if (!supabase) {
      return NextResponse.json({
        success: true,
        source: "local-mock",
        data: body,
      });
    }

    const updatePayload: TablesUpdate<"merchants"> = {
      updated_at: new Date().toISOString(),
    };

    if (body.name !== undefined) updatePayload.name = body.name;
    if (body.logoUrl !== undefined) updatePayload.logo_url = body.logoUrl || null;
    if (body.logoDarkUrl !== undefined) updatePayload.logo_dark_url = body.logoDarkUrl || null;
    if (body.categoryId !== undefined) {
      const cId = Number(body.categoryId);
      if (!isNaN(cId)) updatePayload.category_id = cId;
    }

    await supabase.from("merchants").update(updatePayload).eq("id", validId);

    // Jika ada update subMerchants (tabel sub_merchants)
    if (body.subMerchants !== undefined && Array.isArray(body.subMerchants)) {
      // Hapus yang lama untuk merchant ini
      await supabase.from("sub_merchants").delete().eq("merchant_id", validId);

      // Masukkan yang baru
      if (body.subMerchants.length > 0) {
        const subPayloads = (body.subMerchants as string[]).map((s) =>
          mapSubMerchantToDb(id, s)
        );
        await supabase.from("sub_merchants").insert(subPayloads);
      }
    }

    // Ambil hasil akhir beserta relasi sub_merchants
    const { data, error } = await supabase
      .from("merchants")
      .select("*, sub_merchants(*)")
      .eq("id", validId)
      .single();

    if (error || !data) {
      return NextResponse.json(
        { success: false, error: error?.message || "Gagal memperbarui merchant" },
        { status: 400 }
      );
    }

    return NextResponse.json({
      success: true,
      source: "supabase",
      data: mapDbMerchantToMerchant(data as DbMerchantWithSubs),
    });
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : "Internal Server Error";
    return NextResponse.json({ success: false, error: message }, { status: 500 });
  }
}

export async function DELETE(
  _request: NextRequest,
  context: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await context.params;
    const numId = Number(id);
    const validId = isNaN(numId) ? (id as unknown as number) : numId;
    const supabase = getSupabaseServerClient();

    if (!supabase) {
      return NextResponse.json({
        success: true,
        source: "local-mock",
        message: `Merchant ${id} disimulasikan terhapus (Supabase belum terhubung).`,
      });
    }

    // ON DELETE CASCADE akan otomatis menghapus semua baris di sub_merchants untuk merchant ini
    const { error } = await supabase.from("merchants").delete().eq("id", validId);

    if (error) {
      return NextResponse.json({ success: false, error: error.message }, { status: 400 });
    }

    return NextResponse.json({
      success: true,
      source: "supabase",
      message: `Merchant ${id} dan seluruh sub-merchant terkait berhasil dihapus.`,
    });
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : "Internal Server Error";
    return NextResponse.json({ success: false, error: message }, { status: 500 });
  }
}
