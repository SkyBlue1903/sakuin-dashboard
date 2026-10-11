import type { Metadata } from "next";
import CardLayout from "@/app/card/layout/CardLayout";
import { PromoProvider } from "@/context/PromoContext";
import AdminPanduanLayout from "./AdminPanduanLayout";

export const metadata: Metadata = {
  title: "Panduan | Sakuin Dashboard",
  description: "Kelola panduan langkah, petunjuk interaktif, dan dokumentasi dashboard di Sakuin",
};

export default function AdminPanduanPage() {
  return (
    <CardLayout>
      <PromoProvider>
        <AdminPanduanLayout />
      </PromoProvider>
    </CardLayout>
  );
}
