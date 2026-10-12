"use client";

import React, { useState } from "react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";

export default function QueryProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const [queryClient] = useState(
    () =>
      new QueryClient({
        defaultOptions: {
          queries: {
            staleTime: 1000 * 60 * 5, // 5 menit: data dianggap fresh, cegah refetch berulang
            gcTime: 1000 * 60 * 60, // 60 menit: simpan cache di memori sebelum garbage collected
            refetchOnWindowFocus: false, // Jangan spam refetch saat user pindah tab
            refetchOnReconnect: "always", // Refetch otomatis saat internet tersambung kembali
            retry: 1, // Batasi retry agar responsif saat offline/error
            structuralSharing: true, // Optimasi performa re-render (hanya re-render jika referensi data benar-benar berubah)
            networkMode: "offlineFirst", // Prioritaskan data cache instan terlebih dahulu
          },
          mutations: {
            networkMode: "offlineFirst",
            retry: 1,
          },
        },
      })
  );


  return (
    <QueryClientProvider client={queryClient}>
      {children}
    </QueryClientProvider>
  );
}
