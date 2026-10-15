import type { Transaction } from "@/features/user/card/domain/card";
import type { Database, TablesInsert } from "@/shared/lib/supabase/database.types";

type DbTransactionRow = Database["public"]["Tables"]["transactions"]["Row"];

/**
 * Mapping data dari row tabel Supabase ke model Transaction frontend
 */
export function mapDbToTransaction(row: DbTransactionRow): Transaction {
  return {
    id: row.id,
    merchant: row.merchant,
    categoryId: row.category_slug || (row.category_id ? String(row.category_id) : undefined),
    category: row.category,
    date: row.date,
    amount: row.amount,
    currency: row.currency,
    status: row.status,
    reason: row.reason || undefined,
    cardLast4: row.card_last4,
  };
}

/**
 * Mapping model Transaction frontend ke payload insert Supabase
 */
export function mapTransactionToDb(tx: Transaction): TablesInsert<"transactions"> {
  const numCatId = tx.categoryId ? Number(tx.categoryId) : NaN;
  return {
    id: tx.id,
    merchant: tx.merchant,
    category_id: !isNaN(numCatId) ? numCatId : null,
    category_slug: tx.categoryId || null,
    category: tx.category,
    date: tx.date,
    amount: tx.amount,
    currency: tx.currency || "Rp",
    status: tx.status,
    reason: tx.reason || null,
    card_last4: tx.cardLast4,
  };
}
