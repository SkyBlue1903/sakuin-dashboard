import { NextRequest, NextResponse } from "next/server";
import { getSupabaseServerClient } from "@/lib/supabase/server";
import {
  mapDbToCategory,
  mapMerchantToDb,
  mapSubMerchantToDb,
  DbCategoryWithRelations,
} from "@/services/categoryMappers";
import type { CategoryItem } from "@/models/category";
import { TablesUpdate } from "@/lib/supabase/database.types";
import { compressImageUrl } from "@/utils/imageOptimizer";

export async function GET(
  _request: NextRequest,
  context: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await context.params;
    const numId = Number(id);
    const supabase = getSupabaseServerClient();

    if (!supabase) {
      return NextResponse.json(
        {
          success: false,
          error: "Supabase belum terkonfigurasi.",
        },
        { status: 404 }
      );
    }

    const { data, error } = await supabase
      .from("categories")
      .select("*, merchants(*, sub_merchants(*))")
      .eq("id", isNaN(numId) ? (id as unknown as number) : numId)
      .single();

    if (error || !data) {
      return NextResponse.json(
        { success: false, error: error?.message || "Kategori tidak ditemukan" },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      source: "supabase",
      data: mapDbToCategory(data as DbCategoryWithRelations),
    });
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : "Internal Server Error";
    return NextResponse.json({ success: false, error: message }, { status: 500 });
  }
}

export async function PUT(
  request: NextRequest,
  context: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await context.params;
    const numId = Number(id);
    const validId = isNaN(numId) ? (id as unknown as number) : numId;
    const body = (await request.json()) as Partial<CategoryItem>;
    const supabase = getSupabaseServerClient();

    if (!supabase) {
      return NextResponse.json({
        success: true,
        source: "local-mock",
        data: body,
      });
    }

    const updatePayload: TablesUpdate<"categories"> = {
      updated_at: new Date().toISOString(),
    };

    if (body.name !== undefined) updatePayload.name = body.name;
    if (body.apiCategoryName !== undefined) updatePayload.api_category_name = body.apiCategoryName;
    if (body.description !== undefined) updatePayload.description = body.description;
    if (body.iconType !== undefined) updatePayload.icon_type = body.iconType;
    if (body.iconName !== undefined) updatePayload.icon_name = body.iconName;
    if (body.iconSrc !== undefined)
      updatePayload.icon_src = body.iconSrc ? compressImageUrl(body.iconSrc) : null;
    if (body.color !== undefined) updatePayload.color = body.color;

    // Update kolom tabel categories
    await supabase.from("categories").update(updatePayload).eq("id", validId);

    // Jika ada daftar merchants yang dikirim (sinkronisasi merchant)
    if (body.merchants !== undefined) {
      const incoming = body.merchants;
      const incomingIds = incoming.map((m) => Number(m.id)).filter((n) => !isNaN(n));

      // Hapus merchants yang sudah tidak ada di kategori ini
      if (incomingIds.length > 0) {
        await supabase
          .from("merchants")
          .delete()
          .eq("category_id", validId)
          .not("id", "in", `(${incomingIds.join(",")})`);
      } else {
        await supabase.from("merchants").delete().eq("category_id", validId);
      }

      // Upsert merchants yang ada & perbarui sub_merchants mereka
      for (const m of incoming) {
        await supabase.from("merchants").upsert(mapMerchantToDb(m, id));
        if (m.subMerchants !== undefined) {
          const mNumId = Number(m.id);
          if (!isNaN(mNumId)) {
            await supabase.from("sub_merchants").delete().eq("merchant_id", mNumId);
            if (m.subMerchants.length > 0) {
              const subPayloads = m.subMerchants.map((s) => mapSubMerchantToDb(m.id, s));
              await supabase.from("sub_merchants").insert(subPayloads);
            }
          }
        }
      }
    }

    // Ambil hasil akhir beserta merchants dan sub_merchants yang ter-join
    const { data: updatedCategory, error: fetchError } = await supabase
      .from("categories")
      .select("*, merchants(*, sub_merchants(*))")
      .eq("id", validId)
      .single();

    if (fetchError || !updatedCategory) {
      return NextResponse.json(
        { success: false, error: fetchError?.message || "Gagal mengambil kategori terupdate" },
        { status: 400 }
      );
    }

    return NextResponse.json({
      success: true,
      source: "supabase",
      data: mapDbToCategory(updatedCategory as DbCategoryWithRelations),
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
        message: `Kategori ${id} disimulasikan terhapus (Supabase belum terhubung).`,
      });
    }

    // Karena relasi ON DELETE CASCADE:
    // categories -> merchants (cascade) -> sub_merchants (cascade)
    const { error } = await supabase.from("categories").delete().eq("id", validId);

    if (error) {
      return NextResponse.json({ success: false, error: error.message }, { status: 400 });
    }

    return NextResponse.json({
      success: true,
      source: "supabase",
      message: `Kategori ${id} dan seluruh merchant & sub-merchant terkait berhasil dihapus.`,
    });
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : "Internal Server Error";
    return NextResponse.json({ success: false, error: message }, { status: 500 });
  }
}
