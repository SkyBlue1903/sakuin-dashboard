import { useQuery } from "@tanstack/react-query";
import { cardApi, Transaction, INITIAL_TRANSACTIONS } from "@/features/user/card/data/cardService";


/**
 * Query Key Factory terstruktur untuk Transactions
 */
export const TRANSACTION_QUERY_KEYS = {
  all: ["transactions"] as const,
  lists: () => [...TRANSACTION_QUERY_KEYS.all, "list"] as const,
  byCard: (last4?: string) =>
    [...TRANSACTION_QUERY_KEYS.lists(), { cardLast4: last4 }] as const,
};

/**
 * Hook untuk fetch daftar riwayat transaksi menggunakan TanStack Query
 * Dioptimalkan dengan:
 * - staleTime & gcTime mengikuti default global di QueryProvider
 * - initialData dari INITIAL_TRANSACTIONS agar UI langsung terisi tanpa skeleton blocking
 * - optional select transform function untuk memoized filtered data
 */
export function useTransactions<T = Transaction[]>(options?: {
  cardLast4?: string;
  select?: (data: Transaction[]) => T;
}) {
  return useQuery({
    queryKey: options?.cardLast4
      ? TRANSACTION_QUERY_KEYS.byCard(options.cardLast4)
      : TRANSACTION_QUERY_KEYS.lists(),
    queryFn: async () => {
      const data = await cardApi.getTransactions(options?.cardLast4);
      return data;
    },
    initialData: () => {
      if (options?.cardLast4) {
        return INITIAL_TRANSACTIONS.filter((t) => t.cardLast4 === options.cardLast4);
      }
      return INITIAL_TRANSACTIONS;
    },
    initialDataUpdatedAt: () => 0, // Tandai stale saat mount pertama agar background update terjadi secara seamless
    select: options?.select,
  });
}

