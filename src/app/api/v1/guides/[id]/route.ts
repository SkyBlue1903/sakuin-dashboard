import { NextRequest, NextResponse } from "next/server";
import { getSupabaseServerClient } from "@/lib/supabase/server";
import { mapDbGuideToGuide, DbGuideRow } from "@/models/guide";
import { TablesUpdate } from "@/lib/supabase/database.types";

export const dynamic = "force-dynamic";
export const revalidate = 0;

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

    const updatePayload: TablesUpdate<"guides"> = {
      updated_at: new Date().toISOString(),
    };

    if (body.title !== undefined) updatePayload.title = body.title.trim();
    if (body.bannerUrl !== undefined) updatePayload.banner_url = body.bannerUrl.trim();
    if (body.shortDescription !== undefined) updatePayload.short_description = body.shortDescription.trim();
    if (body.contentHtml !== undefined) updatePayload.content_html = body.contentHtml.trim();
    if (body.isHidden !== undefined) updatePayload.is_hidden = Boolean(body.isHidden);
    if (body.isHighlight !== undefined) updatePayload.is_highlight = Boolean(body.isHighlight);

    let { data, error } = await supabase
      .from("guides")
      .update(updatePayload)
      .eq("id", validId)
      .select()
      .single();

    // Fallback jika is_highlight belum ada di database
    if (error && (error.code === "PGRST204" || error.message.includes("is_highlight"))) {
      const payloadWithoutHighlight = { ...updatePayload };
      delete payloadWithoutHighlight.is_highlight;
      const retryRes = await supabase
        .from("guides")
        .update(payloadWithoutHighlight)
        .eq("id", validId)
        .select()
        .single();
      data = retryRes.data;
      error = retryRes.error;
    }

    if (error || !data) {
      console.error("[API PUT /guides/:id] Error:", error?.message);
      return NextResponse.json(
        { success: false, error: error?.message || "Gagal memperbarui panduan" },
        { status: 400 }
      );
    }

    const guideItem = mapDbGuideToGuide(data as DbGuideRow);
    if (body.isHighlight !== undefined) {
      guideItem.isHighlight = Boolean(body.isHighlight);
    }

    return NextResponse.json({
      success: true,
      source: "supabase",
      data: guideItem,
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
        message: `Panduan ${id} dihapus secara lokal.`,
      });
    }

    const { error } = await supabase.from("guides").delete().eq("id", validId);

    if (error) {
      console.error("[API DELETE /guides/:id] Error:", error.message);
      return NextResponse.json({ success: false, error: error.message }, { status: 400 });
    }

    return NextResponse.json({
      success: true,
      source: "supabase",
      message: `Panduan ${id} berhasil dihapus dari database.`,
    });
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : "Internal Server Error";
    return NextResponse.json({ success: false, error: message }, { status: 500 });
  }
}
