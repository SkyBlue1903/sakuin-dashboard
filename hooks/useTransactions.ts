import { useQuery } from "@tanstack/react-query";
import { cardApi, Transaction, INITIAL_TRANSACTIONS } from "@/lib/api/cardApi";

export const TRANSACTION_QUERY_KEYS = {
  all: ["transactions"] as const,
};

/**
 * Hook untuk fetch daftar riwayat transaksi menggunakan TanStack Query
 */
export function useTransactions() {
  return useQuery({
    queryKey: TRANSACTION_QUERY_KEYS.all,
    queryFn: () => cardApi.getTransactions(),
    placeholderData: INITIAL_TRANSACTIONS,
  });
}
