const fs = require("fs");

const content = fs.readFileSync("src/services/cardService.ts", "utf8");
const start = content.indexOf("export const INITIAL_TRANSACTIONS: Transaction[] = [");
const end = content.indexOf("const CARDS_STORAGE_KEY");
const rawArray = content.substring(start, end)
  .replace("export const INITIAL_TRANSACTIONS: Transaction[] =", "")
  .trim();

// Evaluasi aman menggunakan Function
const txs = new Function("return " + rawArray)();

const categoryMap = {
  belanja: 1,
  makanan: 2,
  transportasi: 3,
  tech: 4,
  ai: 5,
  hiburan: 6,
  pendidikan: 7,
  tagihan: 8,
  kesehatan: 9,
};

const rows = txs.map((t) => {
  const catId = t.categoryId ? (categoryMap[t.categoryId] ?? "NULL") : "NULL";
  const catSlug = t.categoryId ? `'${t.categoryId}'` : "NULL";
  const reason = t.reason ? `'${t.reason.replace(/'/g, "''")}'` : "NULL";
  const merchant = t.merchant.replace(/'/g, "''");
  const category = t.category.replace(/'/g, "''");
  return `  ('${t.id}', '${merchant}', ${catId}, ${catSlug}, '${category}', '${t.date}', '${t.amount}', '${t.currency}', '${t.status}', ${reason}, '${t.cardLast4}')`;
});

const sql = `-- ==============================================================================
-- SAKUIN DASHBOARD - TRANSACTIONS TABLE & INITIAL SEED DATA
-- ==============================================================================

-- 1. Buat Tabel transactions
CREATE TABLE IF NOT EXISTS public.transactions (
  id TEXT PRIMARY KEY,
  merchant TEXT NOT NULL,
  category_id BIGINT REFERENCES public.categories(id) ON DELETE SET NULL,
  category_slug TEXT,
  category TEXT NOT NULL,
  date TEXT NOT NULL,
  amount TEXT NOT NULL,
  currency TEXT NOT NULL DEFAULT 'Rp',
  status TEXT NOT NULL DEFAULT 'Success' CHECK (status IN ('Declined', 'Success', 'Pending')),
  reason TEXT,
  card_last4 TEXT NOT NULL DEFAULT '1995',
  created_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now())
);

-- 2. Index untuk performa query
CREATE INDEX IF NOT EXISTS idx_transactions_category_id ON public.transactions(category_id);
CREATE INDEX IF NOT EXISTS idx_transactions_card_last4 ON public.transactions(card_last4);
CREATE INDEX IF NOT EXISTS idx_transactions_created_at ON public.transactions(created_at DESC);

-- 3. Row Level Security (RLS)
ALTER TABLE public.transactions ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Public select transactions" ON public.transactions;
CREATE POLICY "Public select transactions" ON public.transactions FOR SELECT USING (true);

DROP POLICY IF EXISTS "Public insert transactions" ON public.transactions;
CREATE POLICY "Public insert transactions" ON public.transactions FOR INSERT WITH CHECK (true);

DROP POLICY IF EXISTS "Public update transactions" ON public.transactions;
CREATE POLICY "Public update transactions" ON public.transactions FOR UPDATE USING (true);

DROP POLICY IF EXISTS "Public delete transactions" ON public.transactions;
CREATE POLICY "Public delete transactions" ON public.transactions FOR DELETE USING (true);

-- 4. Seed Data: 42 Riwayat Transaksi Kartu SakuCard
INSERT INTO public.transactions (id, merchant, category_id, category_slug, category, date, amount, currency, status, reason, card_last4)
VALUES
${rows.join(",\n")}
ON CONFLICT (id) DO UPDATE SET
  merchant = EXCLUDED.merchant,
  category_id = EXCLUDED.category_id,
  category_slug = EXCLUDED.category_slug,
  category = EXCLUDED.category,
  date = EXCLUDED.date,
  amount = EXCLUDED.amount,
  currency = EXCLUDED.currency,
  status = EXCLUDED.status,
  reason = EXCLUDED.reason,
  card_last4 = EXCLUDED.card_last4;
`;

fs.writeFileSync("supabase/transactions.sql", sql);
console.log("Successfully generated supabase/transactions.sql with", rows.length, "rows.");
