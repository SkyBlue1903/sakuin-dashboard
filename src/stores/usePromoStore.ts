import { create } from "zustand";
import { PromoItem, PromoStatus, ContentType } from "@/models/promo";

export { type PromoItem, type PromoStatus, type ContentType };

export const getPromoStatus = (promo: PromoItem): PromoStatus => {
  // Panduan selalu aktif (evergreen)
  if (promo.type === "guide") return "active";

  // Informasi selalu aktif kecuali takedown ditentukan
  if (promo.type === "info" && !promo.takedownAt) {
    const now = new Date().getTime();
    const pub = promo.publishedAt ? new Date(promo.publishedAt).getTime() : 0;
    if (now < pub) return "scheduled";
    return "active";
  }

  const now = new Date().getTime();
  const pub = promo.publishedAt ? new Date(promo.publishedAt).getTime() : 0;
  const down = promo.takedownAt ? new Date(promo.takedownAt).getTime() : Infinity;

  if (now < pub) return "scheduled";
  if (now > down) return "expired";
  return "active";
};

export const getPromoStatusBadge = (
  promoOrStatus: PromoItem | PromoStatus
): { label: string; colorClass: string; dotClass: string } => {
  if (typeof promoOrStatus === "object") {
    if (promoOrStatus.type === "info") {
      return {
        label: "Informasi",
        colorClass:
          "bg-blue-50 text-blue-700 border-blue-200/60 dark:bg-blue-950/40 dark:text-blue-400 dark:border-blue-800/40",
        dotClass: "bg-blue-500",
      };
    }
    if (promoOrStatus.type === "guide") {
      return {
        label: "Panduan",
        colorClass:
          "bg-emerald-50 text-emerald-700 border-emerald-200/60 dark:bg-emerald-950/40 dark:text-emerald-400 dark:border-emerald-800/40",
        dotClass: "bg-emerald-500",
      };
    }
  }

  const status = typeof promoOrStatus === "string" ? promoOrStatus : getPromoStatus(promoOrStatus);

  switch (status) {
    case "active":
      return {
        label: "Aktif",
        colorClass:
          "bg-emerald-50 text-emerald-700 border-emerald-200/60 dark:bg-emerald-950/40 dark:text-emerald-400 dark:border-emerald-800/40",
        dotClass: "bg-emerald-500 animate-pulse",
      };
    case "scheduled":
      return {
        label: "Dijadwalkan",
        colorClass:
          "bg-purple-50 text-purple-700 border-purple-200/60 dark:bg-purple-950/40 dark:text-purple-400 dark:border-purple-800/40",
        dotClass: "bg-purple-500",
      };
    case "expired":
      return {
        label: "Berakhir",
        colorClass:
          "bg-gray-100 text-gray-600 border-gray-200 dark:bg-gray-800 dark:text-gray-400 dark:border-gray-700",
        dotClass: "bg-gray-400",
      };
  }
};

export const SAMPLE_PROMOS: PromoItem[] = [
  {
    id: "promo-001",
    type: "promo",
    title: "Promo Super Cashback 50% Transaksi Kartu Sakuin",
    bannerUrl: "/images/sample-images/ads.sample.png",
    bannerLink: "https://sakuin.id/promo/super-cashback-oktober",
    shortDescription:
      "Nikmati reward cashback hingga Rp100.000 untuk setiap transaksi pertama Anda menggunakan S-Card Virtual di berbagai merchant favorit.",
    contentHtml: `
<h3>Dapatkan Cashback Spesial Hingga Rp100.000!</h3>
<p>Gunakan <strong>S-Card Virtual</strong> Anda untuk bertransaksi hemat di berbagai merchant pilihan kategori <em>Makanan & Minuman</em>, <em>Belanja & Retail</em>, dan <em>AI & Produktivitas</em>.</p>
<h4>Syarat & Ketentuan Promosi:</h4>
<ul>
  <li>Promo berlaku khusus bagi pengguna aktif kartu virtual Sakuin.</li>
  <li>Minimal akumulasi transaksi <strong>Rp200.000</strong> selama periode promo berlangsung.</li>
  <li>Maksimal nilai cashback adalah <strong>Rp100.000</strong> per kartu per bulan.</li>
  <li>Cashback akan otomatis masuk ke saldo rekening utama Sakuin Anda maksimal 1x24 jam setelah transaksi dinyatakan sukses.</li>
  <li>Promo tidak dapat digabungkan dengan voucher diskon internal merchant lainnya.</li>
</ul>
<blockquote>Tip Hemat: Aktifkan notifikasi aplikasi Sakuin untuk melacak riwayat saldo cashback Anda secara instan!</blockquote>
<p>Informasi lebih lanjut dapat menghubungi Layanan Pelanggan Sakuin melalui menu Bantuan di aplikasi.</p>
    `.trim(),
    publishedAt: "2026-10-10T00:00",
    takedownAt: "2026-11-20T23:59",
    createdAt: "2026-10-10T00:00:00.000Z",
    updatedAt: "2026-10-10T00:00:00.000Z",
  },
  {
    id: "info-001",
    type: "info",
    title: "Pemberitahuan: Peningkatan Keamanan Transaksi 3D Secure v2 S-Card",
    bannerUrl: "/images/sample-images/ads.sample.png",
    bannerLink: "https://sakuin.id/security-update",
    shortDescription:
      "Sakuin telah mengaktifkan perlindungan otentikasi ganda (2FA) dan OTP dinamis secara otomatis untuk seluruh transaksi online internasional kartu virtual Anda.",
    contentHtml: `
<h3>Keamanan Transaksi Anda Adalah Prioritas Utama Sakuin</h3>
<p>Mulai bulan ini, Sakuin menerapkan sistem deteksi ancaman otomatis dan verifikasi <strong>3D Secure (3DS v2.2)</strong> pada setiap otorisasi transaksi kartu S-Card.</p>
<h4>Apa yang Baru untuk Anda?</h4>
<ul>
  <li>Verifikasi transaksi instan lewat notifikasi push di aplikasi Sakuin tanpa perlu menunggu SMS.</li>
  <li>Limit transaksi harian dan bulanan yang dapat diatur secara mandiri dan fleksibel oleh pengguna.</li>
  <li>Fitur bekukan kartu sementara (<em>Freeze Card</em>) dalam 1 detik langsung dari halaman dashboard.</li>
</ul>
<blockquote>Penting: Pastikan nomor ponsel dan email yang terdaftar di akun Sakuin Anda selalu aktif untuk kelancaran verifikasi transaksi.</blockquote>
<p>Jika Anda menemukan transaksi mencurigakan, segera hubungi Pusat Bantuan 24/7 kami.</p>
    `.trim(),
    publishedAt: "2026-10-09T08:00",
    createdAt: "2026-10-09T08:00:00.000Z",
    updatedAt: "2026-10-09T08:00:00.000Z",
  },
  {
    id: "info-002",
    type: "info",
    title: "Pemberitahuan: Jadwal Pemeliharaan Server & Peningkatan Gateway",
    bannerUrl: "https://images.unsplash.com/photo-1558494949-ef010cbdcc31?auto=format&fit=crop&w=1200&q=80",
    bannerLink: "https://sakuin.id/system-maintenance",
    shortDescription:
      "Pemeliharaan rutin terjadwal pada sistem switching pembayaran kartu virtual untuk meningkatkan kecepatan otorisasi transaksi merchant.",
    contentHtml: `
<h3>Pemberitahuan Pemeliharaan Sistem</h3>
<p>Untuk meningkatkan kestabilan dan kecepatan pemrosesan transaksi S-Card Virtual, tim engineering Sakuin akan melakukan pemeliharaan infrastruktur server terjadwal.</p>
<h4>Jadwal Pemeliharaan:</h4>
<p><strong>Minggu, 12 Oktober 2026, Pukul 01:00 - 04:00 WIB</strong></p>
<p>Selama periode tersebut, pembuatan kartu virtual baru dan fitur perubahan PIN mungkin mengalami penundaan sementara waktu. Transaksi kartu online yang sudah ada tetap berjalan normal.</p>
    `.trim(),
    publishedAt: "2026-10-10T12:00",
    createdAt: "2026-10-10T12:00:00.000Z",
    updatedAt: "2026-10-10T12:00:00.000Z",
  },
  {
    id: "guide-001",
    type: "guide",
    title: "Panduan Fitur: Cara Menghubungkan S-Card Virtual ke E-Commerce",
    bannerUrl: "https://images.unsplash.com/photo-1556742049-0a67c5574f73?auto=format&fit=crop&w=1200&q=80",
    shortDescription:
      "Pelajari langkah mudah memasukkan nomor 16-digit S-Card Virtual, tanggal kedaluwarsa, dan kode CVV untuk pembayaran instan di Tokopedia, Shopee, dan Google Play.",
    contentHtml: `
<h3>Belanja Online Lebih Aman dengan S-Card Virtual</h3>
<p>Kartu virtual Sakuin dapat digunakan di seluruh merchant online yang menerima metode pembayaran berlogo Mastercard atau Visa.</p>
<h4>Langkah-Langkah Penggunaan:</h4>
<ol>
  <li>Buka menu <strong>SakuCard</strong> di dashboard Sakuin Anda.</li>
  <li>Ketuk ikon mata untuk melihat 16 digit nomor kartu, masa berlaku, dan 3 digit CVV rahasia.</li>
  <li>Pilih metode pembayaran <em>Kartu Debit / Kredit</em> pada checkout e-commerce pilihan Anda.</li>
  <li>Masukkan data kartu dan selesaikan otentikasi konfirmasi transaksi.</li>
</ol>
<p>Transaksi Anda otomatis tercatat di riwayat pengeluaran dengan kategori merchant yang rapi.</p>
    `.trim(),
    createdAt: "2026-10-05T10:00:00.000Z",
    updatedAt: "2026-10-05T10:00:00.000Z",
  },
  {
    id: "guide-002",
    type: "guide",
    title: "Panduan Langkah: Cara Top Up Saldo & Atur Limit Belanja SakuCard",
    bannerUrl: "/images/sample-images/ads.sample.png",
    shortDescription:
      "Ketahui cara mudah mengisi saldo awal SakuCard serta membatasi pengeluaran harian kartu virtual agar keuangan Anda tetap terkendali.",
    contentHtml: `
<h3>Kelola Batas Pengeluaran Kartu Sakuin Secara Mandiri</h3>
<p>Anda dapat mengontrol keuangan dengan mengatur batas maksimal transaksi harian pada setiap kartu virtual Anda.</p>
<h4>Cara Mengatur Limit:</h4>
<ol>
  <li>Pilih kartu yang ingin Anda atur pada halaman <strong>SakuCard</strong>.</li>
  <li>Ketuk tombol <strong>Atur Limit</strong> pada kartu atau menu aksi.</li>
  <li>Masukkan nominal limit harian yang Anda inginkan (misal: Rp500.000).</li>
  <li>Simpan pengaturan. Transaksi yang melebihi batas ini akan otomatis ditolak demi keamanan dana Anda.</li>
</ol>
<blockquote>Anda dapat mengubah atau menaikkan limit kartu kapan pun secara instan tanpa biaya tambahan.</blockquote>
    `.trim(),
    createdAt: "2026-10-06T10:00:00.000Z",
    updatedAt: "2026-10-06T10:00:00.000Z",
  },
  {
    id: "promo-002",
    type: "promo",
    title: "Bonus Langganan AI Tools: ChatGPT & Midjourney Diskon 30%",
    bannerUrl: "https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&w=1200&q=80",
    bannerLink: "https://sakuin.id/promo/ai-productivity-discount",
    shortDescription:
      "Akselerasi produktivitas kerja dengan diskon spesial untuk pembayaran langganan SaaS AI pilihan seperti ChatGPT Plus, Midjourney, dan Claude Pro.",
    contentHtml: `
<h3>Tingkatkan Produktivitas Anda dengan Biaya Lebih Ringan!</h3>
<p>Khusus bulan ini, nikmati diskon potongan biaya langganan sebesar <strong>30%</strong> (maksimal Rp75.000) untuk pembayaran platform kecerdasan buatan.</p>
<h4>Platform yang Berlaku:</h4>
<ul>
  <li>OpenAI ChatGPT Plus Subscription</li>
  <li>Midjourney Monthly / Annual Plan</li>
  <li>Claude Pro by Anthropic</li>
  <li>Figma Professional & Canva Pro</li>
</ul>
<p>Diskon akan dipotong secara otomatis pada invoice tagihan kartu Sakuin Anda saat pembayaran diproses oleh merchant internasional.</p>
    `.trim(),
    publishedAt: "2026-10-01T08:00",
    takedownAt: "2026-10-31T23:59",
    createdAt: "2026-10-01T08:00:00.000Z",
    updatedAt: "2026-10-01T08:00:00.000Z",
  },
  {
    id: "promo-003",
    type: "promo",
    title: "Flash Sale Akhir Tahun: Belanja Bebas Biaya Layanan Sakuin",
    bannerUrl: "https://images.unsplash.com/photo-1607082348824-0a96f2a4b9da?auto=format&fit=crop&w=1200&q=80",
    bannerLink: "https://sakuin.id/promo/yearend-flashsale",
    shortDescription:
      "Sambut perayaan akhir tahun dengan 0% biaya admin dan cashback ekstra belanja e-commerce di Tokopedia, Shopee, dan Blibli.",
    contentHtml: `
<h3>Pesta Belanja Akhir Tahun Lebih Menguntungkan!</h3>
<p>Nantikan promo akbar bebas biaya admin untuk seluruh transaksi e-commerce dan belanja retail.</p>
<h4>Keuntungan Utama:</h4>
<ul>
  <li>Bebas biaya transaksi internasional dan domestik 100%.</li>
  <li>Voucher cashback tambahan untuk 500 transaksi tercepat setiap harinya.</li>
</ul>
<p>Siapkan kartu virtual Anda dan nantikan tanggal mainnya!</p>
    `.trim(),
    publishedAt: "2026-11-25T00:00",
    takedownAt: "2026-12-31T23:59",
    hideBeforePublished: true,
    createdAt: "2026-10-11T09:00:00.000Z",
    updatedAt: "2026-10-11T09:00:00.000Z",
  },
];

const STORAGE_KEY = "sakuin_admin_promos_v3";

function loadInitialPromos(): PromoItem[] {
  if (typeof window === "undefined") return SAMPLE_PROMOS;
  try {
    const stored =
      localStorage.getItem(STORAGE_KEY) ||
      localStorage.getItem("sakuin_admin_promos_v2") ||
      localStorage.getItem("sakuin_admin_promos_v1");
    if (stored) {
      const parsed = JSON.parse(stored);
      if (Array.isArray(parsed) && parsed.length > 0) {
        const mapped = parsed.map((item: Partial<PromoItem>) => ({
          ...item,
          type: item.type || "promo",
        })) as PromoItem[];

        const hasInfo = mapped.some((m: PromoItem) => m.type === "info");
        const hasGuide = mapped.some((m: PromoItem) => m.type === "guide");
        let nextList = [...mapped];
        if (!hasInfo) {
          nextList = [...nextList, ...SAMPLE_PROMOS.filter((s) => s.type === "info")];
        }
        if (!hasGuide) {
          nextList = [...nextList, ...SAMPLE_PROMOS.filter((s) => s.type === "guide")];
        }
        return nextList;
      }
    }
  } catch (err) {
    console.error("Gagal membaca promo dari localStorage:", err);
  }
  return SAMPLE_PROMOS;
}

function savePromosToStorage(promos: PromoItem[]) {
  if (typeof window === "undefined") return;
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(promos));
  } catch (err) {
    console.error("Gagal menyimpan promo ke localStorage:", err);
  }
}

interface PromoStoreState {
  promos: PromoItem[];
  initPromos: () => void;
  addPromo: (newPromoData: Omit<PromoItem, "id" | "createdAt" | "updatedAt">) => PromoItem;
  updatePromo: (
    id: string,
    updatedData: Partial<Omit<PromoItem, "id" | "createdAt" | "updatedAt">>
  ) => void;
  deletePromo: (id: string) => void;
  duplicatePromo: (id: string) => PromoItem | null;
  resetToDefault: () => void;
}

export const usePromoStore = create<PromoStoreState>((set, get) => ({
  promos: SAMPLE_PROMOS,

  initPromos: () => {
    const loaded = loadInitialPromos();
    set({ promos: loaded });
  },

  addPromo: (newPromoData) => {
    const nowIso = new Date().toISOString();
    const newPromo: PromoItem = {
      ...newPromoData,
      type: newPromoData.type || "promo",
      id: `${newPromoData.type || "promo"}_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`,
      createdAt: nowIso,
      updatedAt: nowIso,
    };
    const updated = [newPromo, ...get().promos];
    savePromosToStorage(updated);
    set({ promos: updated });
    return newPromo;
  },

  updatePromo: (id, updatedData) => {
    const updated = get().promos.map((item) =>
      item.id === id
        ? {
            ...item,
            ...updatedData,
            updatedAt: new Date().toISOString(),
          }
        : item
    );
    savePromosToStorage(updated);
    set({ promos: updated });
  },

  deletePromo: (id) => {
    const updated = get().promos.filter((item) => item.id !== id);
    savePromosToStorage(updated);
    set({ promos: updated });
  },

  duplicatePromo: (id) => {
    const target = get().promos.find((p) => p.id === id);
    if (!target) return null;

    const nowIso = new Date().toISOString();
    const duplicated: PromoItem = {
      ...target,
      id: `${target.type}_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`,
      title: `${target.title} (Salinan)`,
      createdAt: nowIso,
      updatedAt: nowIso,
    };

    const updated = [duplicated, ...get().promos];
    savePromosToStorage(updated);
    set({ promos: updated });
    return duplicated;
  },

  resetToDefault: () => {
    savePromosToStorage(SAMPLE_PROMOS);
    set({ promos: SAMPLE_PROMOS });
  },
}));

// Backward compatibility hook matching previous usePromo interface
export const usePromo = () => {
  const store = usePromoStore();
  return store;
};
