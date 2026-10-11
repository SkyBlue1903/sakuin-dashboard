export interface Card {
  id: number | string;
  name: string;
  number: string;
  last4: string;
  holder: string;
  exp: string;
  cvv: string;
  balance: number;
  isFrozen: boolean;
  image: string;
  pin: string;
}

export interface Transaction {
  id: string;
  merchant: string;
  categoryId?: string;
  category: string;
  date: string;
  amount: string;
  currency: string;
  status: "Declined" | "Success" | "Pending";
  reason?: string;
  cardLast4: string;
}

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
    return JSON.parse(raw);
  } catch {
    return INITIAL_TRANSACTIONS;
  }
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
   * Fetch riwayat transaksi
   */
  async getTransactions(): Promise<Transaction[]> {
    await delay(150);
    return getStoredTransactions();
  },
};
