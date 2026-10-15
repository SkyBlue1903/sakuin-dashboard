import { NextRequest, NextResponse } from "next/server";
import { getSupabaseServerClient } from "@/shared/lib/supabase/server";
import { mapDbToTransaction, mapTransactionToDb } from "@/features/user/card/data/transactionMappers";
import { INITIAL_TRANSACTIONS, Transaction } from "@/features/user/card/data/cardService";

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const cardLast4 = searchParams.get("cardLast4");

    const supabase = getSupabaseServerClient();

    // Fallback jika Supabase belum terhubung
    if (!supabase) {
      const fallback = cardLast4
        ? INITIAL_TRANSACTIONS.filter((t) => t.cardLast4 === cardLast4)
        : INITIAL_TRANSACTIONS;
      return NextResponse.json({
        success: true,
        source: "local-fallback",
        data: fallback,
        message: "Supabase belum terhubung di .env.local.",
      });
    }

    let query = supabase.from("transactions").select("*").order("created_at", { ascending: false });

    if (cardLast4) {
      query = query.eq("card_last4", cardLast4);
    }

    const { data, error } = await query;

    if (error) {
      console.warn("[API GET /transactions] Supabase note:", error.message);
      // PGRST205 / 42P01: tabel belum dibuat di database Supabase
      if (error.code === "PGRST205" || error.code === "42P01") {
        const fallback = cardLast4
          ? INITIAL_TRANSACTIONS.filter((t) => t.cardLast4 === cardLast4)
          : INITIAL_TRANSACTIONS;
        return NextResponse.json({
          success: true,
          source: "schema-not-ready-fallback",
          message:
            "Tabel transactions belum dibuat di Supabase. Jalankan skrip supabase/transactions.sql atau supabase/schema.sql di SQL Editor Supabase.",
          data: fallback,
        });
      }
      return NextResponse.json({ success: false, error: error.message }, { status: 500 });
    }

    // Jika tabel ada tapi belum ada baris transaksi sama sekali, gunakan initial transactions sebagai fallback awal
    if (!data || data.length === 0) {
      return NextResponse.json({
        success: true,
        source: "empty-db-fallback",
        data: cardLast4
          ? INITIAL_TRANSACTIONS.filter((t) => t.cardLast4 === cardLast4)
          : INITIAL_TRANSACTIONS,
      });
    }

    const transactions = data.map(mapDbToTransaction);

    return NextResponse.json({
      success: true,
      source: "supabase",
      data: transactions,
    });
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : "Internal Server Error";
    console.error("[API GET /transactions] Exception:", message);
    return NextResponse.json({ success: false, error: message }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = (await request.json()) as Transaction;
    if (!body || !body.id || !body.merchant) {
      return NextResponse.json(
        { success: false, error: "Payload transaksi tidak valid." },
        { status: 400 }
      );
    }

    const supabase = getSupabaseServerClient();

    if (!supabase) {
      return NextResponse.json({
        success: true,
        source: "local-simulation",
        data: body,
        message: "Transaksi disimpan lokal (Supabase belum terhubung).",
      });
    }

    const dbPayload = mapTransactionToDb(body);

    const { data, error } = await supabase
      .from("transactions")
      .insert(dbPayload)
      .select()
      .single();

    if (error) {
      console.warn("[API POST /transactions] Supabase insert note:", error.message);
      return NextResponse.json({
        success: true,
        source: "fallback-on-error",
        data: body,
        message: error.message,
      });
    }

    return NextResponse.json({
      success: true,
      source: "supabase",
      data: mapDbToTransaction(data),
    });
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : "Internal Server Error";
    console.error("[API POST /transactions] Exception:", message);
    return NextResponse.json({ success: false, error: message }, { status: 500 });
  }
}
