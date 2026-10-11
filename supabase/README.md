# 🏷️ Panduan Integrasi Supabase & REST API (Kategori & Merchant)

Dokumentasi ini menjelaskan arsitektur relasional **Supabase** (Tabel `categories` & Tabel `merchants`) beserta endpoint **REST API** yang hemat bandwidth.

---

## 1. Setup Database Relasional di Supabase

Telah disediakan skrip SQL lengkap di [`supabase/schema.sql`](file:///Users/angga/Documents/Development/sakuin-dashboard/supabase/schema.sql).

1. Buka dashboard proyek Anda di [https://supabase.com/dashboard](https://supabase.com/dashboard).
2. Pilih menu **SQL Editor** di sidebar kiri -> klik **New query**.
3. Salin seluruh isi dari [`supabase/schema.sql`](file:///Users/angga/Documents/Development/sakuin-dashboard/supabase/schema.sql) dan tempel (*paste*) ke SQL Editor.
4. Klik tombol **Run**.

**Apa yang terjadi saat skrip dijalankan?**
1. **Tabel `categories`**: Menyimpan master data kategori (`id`, `name`, `api_category_name`, `description`, `icon_type`, `icon_name`, `icon_src`, `color`).
2. **Tabel `merchants`**: Menyimpan daftar merchant dengan **Foreign Key** (`category_id REFERENCES categories(id) ON DELETE CASCADE`), `logo_url`, dan `sub_merchants` (array text).
3. **Index**: `idx_merchants_category_id` otomatis dibuat agar pencarian per kategori berkecepatan tinggi.
4. **Row Level Security (RLS)**: Diaktifkan untuk akses CRUD yang aman.
5. **Data Awal**: Terisi lengkap dengan 9 kategori dan seluruh merchant bawaan.

---

## 2. Endpoint REST API Terintegrasi

### Kategori (`/api/v1/categories`)
| Method | Endpoint | Fungsi | Keterangan |
|---|---|---|---|
| `GET` | `/api/v1/categories` | Ambil seluruh kategori beserta relasi join `merchants` | Mengembalikan array kategori lengkap dengan merchants |
| `POST` | `/api/v1/categories` | Buat kategori baru | Body: `CategoryItem` |
| `GET` | `/api/v1/categories/:id` | Ambil 1 kategori berdasarkan ID | Termasuk data merchants terkait |
| `PUT` | `/api/v1/categories/:id` | Update kategori / sinkronisasi merchant | Body: `Partial<CategoryItem>` |
| `DELETE` | `/api/v1/categories/:id` | Hapus kategori | Otomatis menghapus merchant terkait di database (`CASCADE`) |

### Merchant Granular (`/api/v1/merchants`) — Sangat Hemat Bandwidth
| Method | Endpoint | Fungsi | Payload |
|---|---|---|---|
| `POST` | `/api/v1/merchants` | Tambah 1 merchant baru | `{ categoryId, merchant }` (~100 byte) |
| `PUT` | `/api/v1/merchants/:id` | Update nama/logo/alias/kategori merchant | `{ name, logoUrl, subMerchants, categoryId }` |
| `DELETE` | `/api/v1/merchants/:id` | Hapus 1 merchant | Tanpa payload (0 byte) |

---

## 3. Keunggulan Arsitektur Relasional Ini
- **Hemat Bandwidth**: Setiap mutasi merchant hanya mengirim puluhan byte data merchant yang bersangkutan, bukan seluruh daftar array kategori.
- **Relational Integrity**: Menghapus kategori otomatis menghapus seluruh merchant miliknya secara bersih via PostgreSQL `ON DELETE CASCADE`.
- **Fleksibel**: Memindahkan merchant ke kategori lain hanya perlu mengupdate kolom `category_id` saja.
