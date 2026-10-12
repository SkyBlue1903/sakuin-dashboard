import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { cardApi, Card, INITIAL_CARDS } from "@/services/cardService";
import { TRANSACTION_QUERY_KEYS } from "@/controllers/useTransactions";

/**
 * Query Key Factory untuk Card (hierarkis & type-safe)
 */
export const CARD_QUERY_KEYS = {
  all: ["cards"] as const,
  lists: () => [...CARD_QUERY_KEYS.all, "list"] as const,
  detail: (id: number | string) => [...CARD_QUERY_KEYS.all, "detail", String(id)] as const,
};

/**
 * Hook untuk fetch daftar kartu menggunakan TanStack Query
 * Dioptimalkan dengan:
 * - staleTime & gcTime mengikuti default global di QueryProvider
 * - initialData dari INITIAL_CARDS untuk instant render (Zero Layout Shift)
 * - background sync otomatis saat stale
 */
export function useCards<T = Card[]>(options?: {
  select?: (cards: Card[]) => T;
}) {
  return useQuery({
    queryKey: CARD_QUERY_KEYS.lists(),
    queryFn: () => cardApi.getCards(),
    initialData: INITIAL_CARDS,
    initialDataUpdatedAt: () => 0,
    select: options?.select,
  });
}

/**
 * Hook untuk membuat kartu baru
 * Menggunakan direct cache update agar UI seketika merender kartu baru tanpa waiting time
 */
export function useCreateCard() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (payload: { name: string; initialDeposit: number }) =>
      cardApi.createCard(payload),
    onSuccess: (newCard) => {
      // Optimistic update cache secara langsung
      queryClient.setQueryData<Card[]>(CARD_QUERY_KEYS.lists(), (old) => {
        return old ? [...old, newCard] : [newCard];
      });
    },
  });
}

/**
 * Hook untuk mengubah nama kartu dengan direct cache update
 */
export function useUpdateCardName() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, name }: { id: number | string; name: string }) =>
      cardApi.updateCardName(id, name),
    onSuccess: (updatedCard) => {
      queryClient.setQueryData<Card[]>(CARD_QUERY_KEYS.lists(), (old) => {
        if (!old) return [updatedCard];
        return old.map((c) => (String(c.id) === String(updatedCard.id) ? updatedCard : c));
      });
    },
  });
}

/**
 * Hook untuk mengganti desain ilustrasi kartu dengan direct cache update
 */
export function useUpdateCardIllustration() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, image }: { id: number | string; image: string }) =>
      cardApi.updateCardIllustration(id, image),
    onSuccess: (updatedCard) => {
      queryClient.setQueryData<Card[]>(CARD_QUERY_KEYS.lists(), (old) => {
        if (!old) return [updatedCard];
        return old.map((c) => (String(c.id) === String(updatedCard.id) ? updatedCard : c));
      });
    },
  });
}

/**
 * Hook untuk top up saldo kartu dengan direct cache update
 */
export function useTopUpCard() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, amount }: { id: number | string; amount: number }) =>
      cardApi.topUpCard(id, amount),
    onSuccess: (updatedCard) => {
      queryClient.setQueryData<Card[]>(CARD_QUERY_KEYS.lists(), (old) => {
        if (!old) return [updatedCard];
        return old.map((c) => (String(c.id) === String(updatedCard.id) ? updatedCard : c));
      });
      // Top up menambah riwayat transaksi baru -> segarkan cache transaksi
      queryClient.invalidateQueries({ queryKey: TRANSACTION_QUERY_KEYS.all });
    },
  });
}

/**
 * Hook untuk membekukan / mengaktifkan kartu dengan direct cache update
 */
export function useToggleFreezeCard() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: number | string) => cardApi.toggleFreezeCard(id),
    onSuccess: (updatedCard) => {
      queryClient.setQueryData<Card[]>(CARD_QUERY_KEYS.lists(), (old) => {
        if (!old) return [updatedCard];
        return old.map((c) => (String(c.id) === String(updatedCard.id) ? updatedCard : c));
      });
    },
  });
}

/**
 * Hook untuk memperbarui PIN kartu
 */
export function useChangeCardPin() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, pin }: { id: number | string; pin: string }) =>
      cardApi.changeCardPin(id, pin),
    onSuccess: (updatedCard) => {
      queryClient.setQueryData<Card[]>(CARD_QUERY_KEYS.lists(), (old) => {
        if (!old) return [updatedCard];
        return old.map((c) => (String(c.id) === String(updatedCard.id) ? updatedCard : c));
      });
    },
  });
}

/**
 * Hook untuk menghapus kartu dengan direct cache update
 */
export function useDeleteCard() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: number | string) => cardApi.deleteCard(id),
    onSuccess: (_, deletedId) => {
      queryClient.setQueryData<Card[]>(CARD_QUERY_KEYS.lists(), (old) => {
        if (!old) return [];
        return old.filter((c) => String(c.id) !== String(deletedId));
      });
    },
  });
}
