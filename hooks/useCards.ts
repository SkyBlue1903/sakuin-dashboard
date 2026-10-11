import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { cardApi, Card, INITIAL_CARDS } from "@/lib/api/cardApi";

export const CARD_QUERY_KEYS = {
  all: ["cards"] as const,
  detail: (id: number | string) => ["cards", id] as const,
};

/**
 * Hook untuk fetch daftar kartu menggunakan TanStack Query
 */
export function useCards() {
  return useQuery({
    queryKey: CARD_QUERY_KEYS.all,
    queryFn: () => cardApi.getCards(),
    placeholderData: INITIAL_CARDS,
  });
}

/**
 * Hook untuk membuat kartu baru
 */
export function useCreateCard() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (payload: { name: string; initialDeposit: number }) =>
      cardApi.createCard(payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: CARD_QUERY_KEYS.all });
    },
  });
}

/**
 * Hook untuk mengubah nama kartu
 */
export function useUpdateCardName() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, name }: { id: number | string; name: string }) =>
      cardApi.updateCardName(id, name),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: CARD_QUERY_KEYS.all });
    },
  });
}

/**
 * Hook untuk mengganti desain ilustrasi kartu
 */
export function useUpdateCardIllustration() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, image }: { id: number | string; image: string }) =>
      cardApi.updateCardIllustration(id, image),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: CARD_QUERY_KEYS.all });
    },
  });
}

/**
 * Hook untuk top up saldo kartu
 */
export function useTopUpCard() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, amount }: { id: number | string; amount: number }) =>
      cardApi.topUpCard(id, amount),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: CARD_QUERY_KEYS.all });
    },
  });
}

/**
 * Hook untuk membekukan / mengaktifkan kartu
 */
export function useToggleFreezeCard() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: number | string) => cardApi.toggleFreezeCard(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: CARD_QUERY_KEYS.all });
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
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: CARD_QUERY_KEYS.all });
    },
  });
}

/**
 * Hook untuk menghapus kartu
 */
export function useDeleteCard() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: number | string) => cardApi.deleteCard(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: CARD_QUERY_KEYS.all });
    },
  });
}
