-- ==============================================================================
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
  ('tx-001', 'coursiv.org', 7, 'pendidikan', 'Pendidikan & Kursus', '4 September, 19:44', '-689.000', 'Rp', 'Declined', 'Batas limit transaksi internasional terlampaui', '1995'),
  ('tx-002', 'coursiv.org', 7, 'pendidikan', 'Pendidikan & Kursus', '4 September, 19:44', '-689.000', 'Rp', 'Declined', 'Upaya pembayaran ganda terdeteksi oleh sistem keamanan', '1995'),
  ('tx-003', 'ChatGPT Plus Subscription', 5, 'ai', 'AI & Produktivitas', '3 September, 14:10', '-315.000', 'Rp', 'Success', NULL, '1995'),
  ('tx-004', 'Spotify Premium', 6, 'hiburan', 'Hiburan & Musik', '1 September, 10:15', '-54.990', 'Rp', 'Success', NULL, '1995'),
  ('tx-005', 'GitHub Copilot', 4, 'tech', 'Alat Pengembang & IT', '28 Agustus, 08:30', '-155.000', 'Rp', 'Success', NULL, '1995'),
  ('tx-006', 'Netflix', 6, 'hiburan', 'Hiburan & Musik', '26 Agustus, 21:05', '-186.000', 'Rp', 'Success', NULL, '1995'),
  ('tx-007', 'Tokopedia', 1, 'belanja', 'Belanja & Retail', '24 Agustus, 16:30', '-425.000', 'Rp', 'Success', NULL, '1995'),
  ('tx-008', 'AWS Cloud', 4, 'tech', 'Alat Pengembang & IT', '20 Agustus, 03:12', '-840.000', 'Rp', 'Success', NULL, '1995'),
  ('tx-009', 'Figma Professional', 5, 'ai', 'AI & Produktivitas', '18 Agustus, 11:45', '-235.000', 'Rp', 'Success', NULL, '1995'),
  ('tx-010', 'Steam Games', 6, 'hiburan', 'Hiburan & Musik', '15 Agustus, 19:30', '-500.000', 'Rp', 'Declined', 'Saldo tidak mencukupi untuk otorisasi game publisher', '1995'),
  ('tx-011', 'Midjourney', 5, 'ai', 'AI & Produktivitas', '12 Agustus, 16:20', '-465.000', 'Rp', 'Success', NULL, '1995'),
  ('tx-012', 'Starbucks Coffee', 2, 'makanan', 'Makanan & Minuman', '10 Agustus, 09:15', '-135.000', 'Rp', 'Success', NULL, '1995'),
  ('tx-013', 'Pertamina', 3, 'transportasi', 'Transportasi & Bensin', '8 Agustus, 14:00', '-350.000', 'Rp', 'Success', NULL, '1995'),
  ('tx-014', 'Shopee Indonesia', 1, 'belanja', 'Belanja & Retail', '5 Agustus, 11:10', '-220.000', 'Rp', 'Success', NULL, '1995'),
  ('tx-015', 'Grab Indonesia', 3, 'transportasi', 'Transportasi & Bensin', '3 Agustus, 08:45', '-65.000', 'Rp', 'Success', NULL, '1995'),
  ('tx-016', 'McDonald''s', 2, 'makanan', 'Makanan & Minuman', '1 Agustus, 12:30', '-115.000', 'Rp', 'Success', NULL, '1995'),
  ('tx-017', 'Vercel Pro Team', 4, 'tech', 'Alat Pengembang & IT', '28 Juli, 18:20', '-310.000', 'Rp', 'Success', NULL, '1995'),
  ('tx-018', 'Alfamart', 1, 'belanja', 'Belanja & Retail', '25 Juli, 20:10', '-78.500', 'Rp', 'Success', NULL, '1995'),
  ('tx-019', 'Cinema XXI', 6, 'hiburan', 'Hiburan & Musik', '23 Juli, 17:40', '-120.000', 'Rp', 'Success', NULL, '1995'),
  ('tx-020', 'PLN Pascabayar', 8, 'tagihan', 'Tagihan & Utilitas', '20 Juli, 09:12', '-450.000', 'Rp', 'Success', NULL, '1995'),
  ('tx-021', 'Kopi Kenangan', 2, 'makanan', 'Makanan & Minuman', '18 Juli, 15:30', '-48.000', 'Rp', 'Success', NULL, '1995'),
  ('tx-022', 'Halodoc', 9, 'kesehatan', 'Kesehatan & Farmasi', '15 Juli, 11:25', '-85.000', 'Rp', 'Success', NULL, '1995'),
  ('tx-023', 'Dicoding Academy', 7, 'pendidikan', 'Pendidikan & Kursus', '12 Juli, 14:00', '-1.500.000', 'Rp', 'Success', NULL, '1995'),
  ('tx-024', 'Steam Games', 6, 'hiburan', 'Hiburan & Musik', '10 Juli, 22:15', '-750.000', 'Rp', 'Declined', 'Limit transaksi game publisher harian tercapai', '1995'),
  ('tx-025', 'Indomaret', 1, 'belanja', 'Belanja & Retail', '8 Juli, 19:05', '-54.200', 'Rp', 'Success', NULL, '1995'),
  ('tx-026', 'Telkomsel Halo', 8, 'tagihan', 'Tagihan & Utilitas', '5 Juli, 08:30', '-175.000', 'Rp', 'Success', NULL, '1995'),
  ('tx-027', 'Gramedia', 7, 'pendidikan', 'Pendidikan & Kursus', '3 Juli, 16:45', '-230.000', 'Rp', 'Success', NULL, '1995'),
  ('tx-028', 'Mixue', 2, 'makanan', 'Makanan & Minuman', '1 Juli, 13:20', '-22.000', 'Rp', 'Success', NULL, '1995'),
  ('tx-029', 'Bluebird', 3, 'transportasi', 'Transportasi & Bensin', '28 Juni, 21:10', '-95.000', 'Rp', 'Success', NULL, '1995'),
  ('tx-030', 'DigitalOcean', 4, 'tech', 'Alat Pengembang & IT', '25 Juni, 04:00', '-360.000', 'Rp', 'Success', NULL, '1995'),
  ('tx-031', 'Uniqlo', 1, 'belanja', 'Belanja & Retail', '22 Juni, 18:50', '-599.000', 'Rp', 'Success', NULL, '1995'),
  ('tx-032', 'Udemy', 7, 'pendidikan', 'Pendidikan & Kursus', '20 Juni, 10:15', '-189.000', 'Rp', 'Success', NULL, '1995'),
  ('tx-033', 'HokBen', 2, 'makanan', 'Makanan & Minuman', '18 Juni, 12:40', '-88.500', 'Rp', 'Success', NULL, '1995'),
  ('tx-034', 'Cloudflare', 4, 'tech', 'Alat Pengembang & IT', '15 Juni, 02:30', '-320.000', 'Rp', 'Success', NULL, '1995'),
  ('tx-035', 'Zara', 1, 'belanja', 'Belanja & Retail', '12 Juni, 16:10', '-890.000', 'Rp', 'Declined', 'Otorisasi ditolak: Saldo rekening utama tidak mencukupi', '1995'),
  ('tx-036', 'Apotek Kimia Farma', 9, 'kesehatan', 'Kesehatan & Farmasi', '10 Juni, 14:22', '-145.000', 'Rp', 'Success', NULL, '1995'),
  ('tx-037', 'Garuda Indonesia', 3, 'transportasi', 'Transportasi & Bensin', '5 Juni, 09:00', '-2.450.000', 'Rp', 'Success', NULL, '1995'),
  ('tx-038', 'ChatGPT Plus Subscription', 5, 'ai', 'AI & Produktivitas', '3 Juni, 14:10', '-315.000', 'Rp', 'Success', NULL, '1995'),
  ('tx-039', 'Spotify Premium', 6, 'hiburan', 'Hiburan & Musik', '1 Juni, 10:15', '-54.990', 'Rp', 'Success', NULL, '1995'),
  ('tx-040', 'KFC Indonesia', 2, 'makanan', 'Makanan & Minuman', '28 Mei, 19:30', '-132.000', 'Rp', 'Success', NULL, '1995'),
  ('tx-041', 'Superindo', 1, 'belanja', 'Belanja & Retail', '25 Mei, 11:45', '-342.500', 'Rp', 'Success', NULL, '1995'),
  ('tx-042', 'BPJS Kesehatan', 8, 'tagihan', 'Tagihan & Utilitas', '20 Mei, 08:15', '-150.000', 'Rp', 'Success', NULL, '1995')
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
