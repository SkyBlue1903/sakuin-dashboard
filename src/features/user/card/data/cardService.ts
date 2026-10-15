import { Card, Transaction } from "@/models/card";

export type { Card, Transaction };


export const INITIAL_CARDS: Card[] = [
  {
    id: 1,
    name: "SakuCard 1",
    number: "4532 8821 9012 1995",
    last4: "1995",
    holder: "ERLANGGA A. ARIFIN",
    exp: "08/29",
    cvv: "832",
    balance: 2450000,
    isFrozen: false,
    image: "/images/card/gradient/card.gradient.1.png",
    pin: "111111",
  },
  {
    id: 2,
    name: "SakuCard 2",
    number: "4532 8821 9012 2024",
    last4: "2024",
    holder: "ERLANGGA A. ARIFIN",
    exp: "11/27",
    cvv: "419",
    balance: 850000,
    isFrozen: false,
    image: "/images/card/geometric/card.geometric.1.png",
    pin: "123456",
  },
  {
    id: 3,
    name: "SakuCard 3",
    number: "4532 8821 9012 3388",
    last4: "3388",
    holder: "ERLANGGA A. ARIFIN",
    exp: "04/30",
    cvv: "105",
    balance: 150000,
    isFrozen: true,
    image: "/images/card/gradient/card.gradient.4.png",
    pin: "654321",
  },
];

export const INITIAL_TRANSACTIONS: Transaction[] = [
  {
    id: "tx-001",
    merchant: "coursiv.org",
    categoryId: "pendidikan",
    category: "Pendidikan & Kursus",
    date: "4 September, 19:44",
    amount: "-689.000",
    currency: "Rp",
    status: "Declined",
    reason: "Batas limit transaksi internasional terlampaui",
    cardLast4: "1995",
  },
  {
    id: "tx-002",
    merchant: "coursiv.org",
    categoryId: "pendidikan",
    category: "Pendidikan & Kursus",
    date: "4 September, 19:44",
    amount: "-689.000",
    currency: "Rp",
    status: "Declined",
    reason: "Upaya pembayaran ganda terdeteksi oleh sistem keamanan",
    cardLast4: "1995",
  },
  {
    id: "tx-003",
    merchant: "ChatGPT Plus Subscription",
    categoryId: "ai",
    category: "AI & Produktivitas",
    date: "3 September, 14:10",
    amount: "-315.000",
    currency: "Rp",
    status: "Success",
    cardLast4: "1995",
  },
  {
    id: "tx-004",
    merchant: "Spotify Premium",
    categoryId: "hiburan",
    category: "Hiburan & Musik",
    date: "1 September, 10:15",
    amount: "-54.990",
    currency: "Rp",
    status: "Success",
    cardLast4: "1995",
  },
  {
    id: "tx-005",
    merchant: "GitHub Copilot",
    categoryId: "tech",
    category: "Alat Pengembang & IT",
    date: "28 Agustus, 08:30",
    amount: "-155.000",
    currency: "Rp",
    status: "Success",
    cardLast4: "1995",
  },
  {
    id: "tx-006",
    merchant: "Netflix",
    categoryId: "hiburan",
    category: "Hiburan & Musik",
    date: "26 Agustus, 21:05",
    amount: "-186.000",
    currency: "Rp",
    status: "Success",
    cardLast4: "1995",
  },
  {
    id: "tx-007",
    merchant: "Tokopedia",
    categoryId: "belanja",
    category: "Belanja & Retail",
    date: "24 Agustus, 16:30",
    amount: "-425.000",
    currency: "Rp",
    status: "Success",
    cardLast4: "1995",
  },
  {
    id: "tx-008",
    merchant: "AWS Cloud",
    categoryId: "tech",
    category: "Alat Pengembang & IT",
    date: "20 Agustus, 03:12",
    amount: "-840.000",
    currency: "Rp",
    status: "Success",
    cardLast4: "1995",
  },
  {
    id: "tx-009",
    merchant: "Figma Professional",
    categoryId: "ai",
    category: "AI & Produktivitas",
    date: "18 Agustus, 11:45",
    amount: "-235.000",
    currency: "Rp",
    status: "Success",
    cardLast4: "1995",
  },
  {
    id: "tx-010",
    merchant: "Steam Games",
    categoryId: "hiburan",
    category: "Hiburan & Musik",
    date: "15 Agustus, 19:30",
    amount: "-500.000",
    currency: "Rp",
    status: "Declined",
    reason: "Saldo tidak mencukupi untuk otorisasi game publisher",
    cardLast4: "1995",
  },
  {
    id: "tx-011",
    merchant: "Midjourney",
    categoryId: "ai",
    category: "AI & Produktivitas",
    date: "12 Agustus, 16:20",
    amount: "-465.000",
    currency: "Rp",
    status: "Success",
    cardLast4: "1995",
  },
  {
    id: "tx-012",
    merchant: "Starbucks Coffee",
    categoryId: "makanan",
    category: "Makanan & Minuman",
    date: "10 Agustus, 09:15",
    amount: "-135.000",
    currency: "Rp",
    status: "Success",
    cardLast4: "1995",
  },
  {
    id: "tx-013",
    merchant: "Pertamina",
    categoryId: "transportasi",
    category: "Transportasi & Bensin",
    date: "8 Agustus, 14:00",
    amount: "-350.000",
    currency: "Rp",
    status: "Success",
    cardLast4: "1995",
  },
  {
    id: "tx-014",
    merchant: "Shopee Indonesia",
    categoryId: "belanja",
    category: "Belanja & Retail",
    date: "5 Agustus, 11:10",
    amount: "-220.000",
    currency: "Rp",
    status: "Success",
    cardLast4: "1995",
  },
  {
    id: "tx-015",
    merchant: "Grab Indonesia",
    categoryId: "transportasi",
    category: "Transportasi & Bensin",
    date: "3 Agustus, 08:45",
    amount: "-65.000",
    currency: "Rp",
    status: "Success",
    cardLast4: "1995",
  },
  {
    id: "tx-016",
    merchant: "McDonald's",
    categoryId: "makanan",
    category: "Makanan & Minuman",
    date: "1 Agustus, 12:30",
    amount: "-115.000",
    currency: "Rp",
    status: "Success",
    cardLast4: "1995",
  },
  {
    id: "tx-017",
    merchant: "Vercel Pro Team",
    categoryId: "tech",
    category: "Alat Pengembang & IT",
    date: "28 Juli, 18:20",
    amount: "-310.000",
    currency: "Rp",
    status: "Success",
    cardLast4: "1995",
  },
  {
    id: "tx-018",
    merchant: "Alfamart",
    categoryId: "belanja",
    category: "Belanja & Retail",
    date: "25 Juli, 20:10",
    amount: "-78.500",
    currency: "Rp",
    status: "Success",
    cardLast4: "1995",
  },
  {
    id: "tx-019",
    merchant: "Cinema XXI",
    categoryId: "hiburan",
    category: "Hiburan & Musik",
    date: "23 Juli, 17:40",
    amount: "-120.000",
    currency: "Rp",
    status: "Success",
    cardLast4: "1995",
  },
  {
    id: "tx-020",
    merchant: "PLN Pascabayar",
    categoryId: "tagihan",
    category: "Tagihan & Utilitas",
    date: "20 Juli, 09:12",
    amount: "-450.000",
    currency: "Rp",
    status: "Success",
    cardLast4: "1995",
  },
  {
    id: "tx-021",
    merchant: "Kopi Kenangan",
    categoryId: "makanan",
    category: "Makanan & Minuman",
    date: "18 Juli, 15:30",
    amount: "-48.000",
    currency: "Rp",
    status: "Success",
    cardLast4: "1995",
  },
  {
    id: "tx-022",
    merchant: "Halodoc",
    categoryId: "kesehatan",
    category: "Kesehatan & Farmasi",
    date: "15 Juli, 11:25",
    amount: "-85.000",
    currency: "Rp",
    status: "Success",
    cardLast4: "1995",
  },
  {
    id: "tx-023",
    merchant: "Dicoding Academy",
    categoryId: "pendidikan",
    category: "Pendidikan & Kursus",
    date: "12 Juli, 14:00",
    amount: "-1.500.000",
    currency: "Rp",
    status: "Success",
    cardLast4: "1995",
  },
  {
    id: "tx-024",
    merchant: "Steam Games",
    categoryId: "hiburan",
    category: "Hiburan & Musik",
    date: "10 Juli, 22:15",
    amount: "-750.000",
    currency: "Rp",
    status: "Declined",
    reason: "Limit transaksi game publisher harian tercapai",
    cardLast4: "1995",
  },
  {
    id: "tx-025",
    merchant: "Indomaret",
    categoryId: "belanja",
    category: "Belanja & Retail",
    date: "8 Juli, 19:05",
    amount: "-54.200",
    currency: "Rp",
    status: "Success",
    cardLast4: "1995",
  },
  {
    id: "tx-026",
    merchant: "Telkomsel Halo",
    categoryId: "tagihan",
    category: "Tagihan & Utilitas",
    date: "5 Juli, 08:30",
    amount: "-175.000",
    currency: "Rp",
    status: "Success",
    cardLast4: "1995",
  },
  {
    id: "tx-027",
    merchant: "Gramedia",
    categoryId: "pendidikan",
    category: "Pendidikan & Kursus",
    date: "3 Juli, 16:45",
    amount: "-230.000",
    currency: "Rp",
    status: "Success",
    cardLast4: "1995",
  },
  {
    id: "tx-028",
    merchant: "Mixue",
    categoryId: "makanan",
    category: "Makanan & Minuman",
    date: "1 Juli, 13:20",
    amount: "-22.000",
    currency: "Rp",
    status: "Success",
    cardLast4: "1995",
  },
  {
    id: "tx-029",
    merchant: "Bluebird",
    categoryId: "transportasi",
    category: "Transportasi & Bensin",
    date: "28 Juni, 21:10",
    amount: "-95.000",
    currency: "Rp",
    status: "Success",
    cardLast4: "1995",
  },
  {
    id: "tx-030",
    merchant: "DigitalOcean",
    categoryId: "tech",
    category: "Alat Pengembang & IT",
    date: "25 Juni, 04:00",
    amount: "-360.000",
    currency: "Rp",
    status: "Success",
    cardLast4: "1995",
  },
  {
    id: "tx-031",
    merchant: "Uniqlo",
    categoryId: "belanja",
    category: "Belanja & Retail",
    date: "22 Juni, 18:50",
    amount: "-599.000",
    currency: "Rp",
    status: "Success",
    cardLast4: "1995",
  },
  {
    id: "tx-032",
    merchant: "Udemy",
    categoryId: "pendidikan",
    category: "Pendidikan & Kursus",
    date: "20 Juni, 10:15",
    amount: "-189.000",
    currency: "Rp",
    status: "Success",
    cardLast4: "1995",
  },
  {
    id: "tx-033",
    merchant: "HokBen",
    categoryId: "makanan",
    category: "Makanan & Minuman",
    date: "18 Juni, 12:40",
    amount: "-88.500",
    currency: "Rp",
    status: "Success",
    cardLast4: "1995",
  },
  {
    id: "tx-034",
    merchant: "Cloudflare",
    categoryId: "tech",
    category: "Alat Pengembang & IT",
    date: "15 Juni, 02:30",
    amount: "-320.000",
    currency: "Rp",
    status: "Success",
    cardLast4: "1995",
  },
  {
    id: "tx-035",
    merchant: "Zara",
    categoryId: "belanja",
    category: "Belanja & Retail",
    date: "12 Juni, 16:10",
    amount: "-890.000",
    currency: "Rp",
    status: "Declined",
    reason: "Otorisasi ditolak: Saldo rekening utama tidak mencukupi",
    cardLast4: "1995",
  },
  {
    id: "tx-036",
    merchant: "Apotek Kimia Farma",
    categoryId: "kesehatan",
    category: "Kesehatan & Farmasi",
    date: "10 Juni, 14:22",
    amount: "-145.000",
    currency: "Rp",
    status: "Success",
    cardLast4: "1995",
  },
  {
    id: "tx-037",
    merchant: "Garuda Indonesia",
    categoryId: "transportasi",
    category: "Transportasi & Bensin",
    date: "5 Juni, 09:00",
    amount: "-2.450.000",
    currency: "Rp",
    status: "Success",
    cardLast4: "1995",
  },
  {
    id: "tx-038",
    merchant: "ChatGPT Plus Subscription",
    categoryId: "ai",
    category: "AI & Produktivitas",
    date: "3 Juni, 14:10",
    amount: "-315.000",
    currency: "Rp",
    status: "Success",
    cardLast4: "1995",
  },
  {
    id: "tx-039",
    merchant: "Spotify Premium",
    categoryId: "hiburan",
    category: "Hiburan & Musik",
    date: "1 Juni, 10:15",
    amount: "-54.990",
    currency: "Rp",
    status: "Success",
    cardLast4: "1995",
  },
  {
    id: "tx-040",
    merchant: "KFC Indonesia",
    categoryId: "makanan",
    category: "Makanan & Minuman",
    date: "28 Mei, 19:30",
    amount: "-132.000",
    currency: "Rp",
    status: "Success",
    cardLast4: "1995",
  },
  {
    id: "tx-041",
    merchant: "Superindo",
    categoryId: "belanja",
    category: "Belanja & Retail",
    date: "25 Mei, 11:45",
    amount: "-342.500",
    currency: "Rp",
    status: "Success",
    cardLast4: "1995",
  },
  {
    id: "tx-042",
    merchant: "BPJS Kesehatan",
    categoryId: "tagihan",
    category: "Tagihan & Utilitas",
    date: "20 Mei, 08:15",
    amount: "-150.000",
    currency: "Rp",
    status: "Success",
    cardLast4: "1995",
  },
];


const CARDS_STORAGE_KEY = "sakuin_cards_data";
const TX_STORAGE_KEY = "sakuin_transactions_data";

// Helper get initial cards from localStorage or memory
function getStoredCards(): Card[] {
  if (typeof window === "undefined") return INITIAL_CARDS;
  try {
    const raw = localStorage.getItem(CARDS_STORAGE_KEY);
    if (!raw) {
      localStorage.setItem(CARDS_STORAGE_KEY, JSON.stringify(INITIAL_CARDS));
      return INITIAL_CARDS;
    }
    return JSON.parse(raw);
  } catch {
    return INITIAL_CARDS;
  }
}

function saveStoredCards(cards: Card[]): void {
  if (typeof window === "undefined") return;
  try {
    localStorage.setItem(CARDS_STORAGE_KEY, JSON.stringify(cards));
  } catch (e) {
    console.error("Gagal menyimpan data kartu:", e);
  }
}

function getStoredTransactions(): Transaction[] {
  if (typeof window === "undefined") return INITIAL_TRANSACTIONS;
  try {
    const raw = localStorage.getItem(TX_STORAGE_KEY);
    if (!raw) {
      localStorage.setItem(TX_STORAGE_KEY, JSON.stringify(INITIAL_TRANSACTIONS));
      return INITIAL_TRANSACTIONS;
    }
    const parsed = JSON.parse(raw);
    if (Array.isArray(parsed) && parsed.length < INITIAL_TRANSACTIONS.length) {
      localStorage.setItem(TX_STORAGE_KEY, JSON.stringify(INITIAL_TRANSACTIONS));
      return INITIAL_TRANSACTIONS;
    }
    return parsed;
  } catch {
    return INITIAL_TRANSACTIONS;
  }
}

function saveStoredTransactions(transactions: Transaction[]): void {
  if (typeof window === "undefined") return;
  try {
    localStorage.setItem(TX_STORAGE_KEY, JSON.stringify(transactions));
  } catch (e) {
    console.error("Gagal menyimpan data transaksi:", e);
  }
}

const MONTHS_ID = [
  "Januari", "Februari", "Maret", "April", "Mei", "Juni",
  "Juli", "Agustus", "September", "Oktober", "November", "Desember",
];

function formatTxDate(d: Date): string {
  const hh = String(d.getHours()).padStart(2, "0");
  const mm = String(d.getMinutes()).padStart(2, "0");
  return `${d.getDate()} ${MONTHS_ID[d.getMonth()]}, ${hh}:${mm}`;
}



// Simulasi Network Delay realistis (200ms) untuk menguji state TanStack Query
const delay = (ms: number = 200) => new Promise((resolve) => setTimeout(resolve, ms));

export const cardApi = {
  /**
   * Fetch seluruh daftar kartu SakuCard
   */
  async getCards(): Promise<Card[]> {
    await delay(150);
    return getStoredCards();
  },

  /**
   * Tambah kartu baru dengan saldo awal
   */
  async createCard(payload: { name: string; initialDeposit: number }): Promise<Card> {
    await delay(250);
    const current = getStoredCards();
    const nextNum = current.length + 1;
    const randLast4 = String(Math.floor(1000 + Math.random() * 9000));
    const newCard: Card = {
      id: nextNum,
      name: payload.name.trim() || `SakuCard ${nextNum}`,
      number: `4532 8821 9012 ${randLast4}`,
      last4: randLast4,
      holder: "ERLANGGA A. ARIFIN",
      exp: "09/31",
      cvv: String(Math.floor(100 + Math.random() * 900)),
      balance: payload.initialDeposit,
      isFrozen: false,
      pin: "111111",
      image: `/images/card/gradient/card.gradient.${((nextNum - 1) % 6) + 1}.png`,
    };
    const updated = [...current, newCard];
    saveStoredCards(updated);
    return newCard;
  },

  /**
   * Update nama kartu
   */
  async updateCardName(id: number | string, newName: string): Promise<Card> {
    await delay(150);
    const current = getStoredCards();
    const target = current.find((c) => String(c.id) === String(id));
    if (!target) throw new Error("Kartu tidak ditemukan");
    target.name = newName;
    saveStoredCards(current);
    return target;
  },

  /**
   * Update desain ilustrasi kartu
   */
  async updateCardIllustration(id: number | string, newImage: string): Promise<Card> {
    await delay(150);
    const current = getStoredCards();
    const target = current.find((c) => String(c.id) === String(id));
    if (!target) throw new Error("Kartu tidak ditemukan");
    target.image = newImage;
    saveStoredCards(current);
    return target;
  },

  /**
   * Top up saldo kartu
   */
  async topUpCard(id: number | string, amount: number): Promise<Card> {
    await delay(250);
    const current = getStoredCards();
    const target = current.find((c) => String(c.id) === String(id));
    if (!target) throw new Error("Kartu tidak ditemukan");
    target.balance = (target.balance || 0) + amount;
    saveStoredCards(current);

    // Catat riwayat transaksi top up (terbaru di paling atas)
    const tx: Transaction = {
      id: `tx-topup-${Date.now()}`,
      merchant: "Top Up Saldo",
      category: "Top Up",
      date: formatTxDate(new Date()),
      amount: `+${amount.toLocaleString("id-ID")}`,
      currency: "Rp",
      status: "Success",
      cardLast4: target.last4,
    };
    saveStoredTransactions([tx, ...getStoredTransactions()]);

    // Simpan ke Supabase via API route
    if (typeof window !== "undefined") {
      fetch("/api/v1/transactions", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(tx),
      }).catch((e) => {
        console.warn("[cardApi.topUpCard] Gagal sinkronisasi transaksi ke Supabase:", e);
      });
    }

    return target;
  },

  /**
   * Bekukan atau aktifkan kembali kartu
   */
  async toggleFreezeCard(id: number | string): Promise<Card> {
    await delay(150);
    const current = getStoredCards();
    const target = current.find((c) => String(c.id) === String(id));
    if (!target) throw new Error("Kartu tidak ditemukan");
    target.isFrozen = !target.isFrozen;
    saveStoredCards(current);
    return target;
  },

  /**
   * Ganti PIN kartu
   */
  async changeCardPin(id: number | string, newPin: string): Promise<Card> {
    await delay(200);
    const current = getStoredCards();
    const target = current.find((c) => String(c.id) === String(id));
    if (!target) throw new Error("Kartu tidak ditemukan");
    target.pin = newPin;
    saveStoredCards(current);
    return target;
  },

  /**
   * Hapus kartu
   */
  async deleteCard(id: number | string): Promise<void> {
    await delay(200);
    const current = getStoredCards();
    if (current.length <= 1) {
      // Reset ke default jika kartu terakhir
      saveStoredCards(INITIAL_CARDS.slice(0, 1));
      return;
    }
    const filtered = current.filter((c) => String(c.id) !== String(id));
    saveStoredCards(filtered);
  },

  /**
   * Reset seluruh kartu ke data default bawaan
   */
  async resetCards(): Promise<Card[]> {
    await delay(150);
    saveStoredCards(INITIAL_CARDS);
    return INITIAL_CARDS;
  },

  /**
   * Fetch riwayat transaksi (Murni dari Supabase via REST API dengan graceful fallback)
   */
  async getTransactions(cardLast4?: string): Promise<Transaction[]> {
    if (typeof window !== "undefined") {
      try {
        const query = cardLast4 ? `?cardLast4=${encodeURIComponent(cardLast4)}` : "";
        const res = await fetch(`/api/v1/transactions${query}`);
        if (res.ok) {
          const json = await res.json();
          if (json.data && Array.isArray(json.data) && json.data.length > 0) {
            return json.data;
          }
        }
      } catch (err) {
        console.warn("[cardApi.getTransactions] Gagal fetch dari Supabase, menggunakan data lokal:", err);
      }
    }
    const local = getStoredTransactions();
    return cardLast4 ? local.filter((t) => t.cardLast4 === cardLast4) : local;
  },
};
