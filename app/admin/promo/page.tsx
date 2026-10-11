import type { Metadata } from "next";
import CardLayout from "@/app/card/layout/CardLayout";
import { PromoProvider } from "@/context/PromoContext";
import AdminPromoLayout from "./AdminPromoLayout";

export const metadata: Metadata = {
  title: "Promo | Sakuin Dashboard",
  description: "Kelola banner promosi, penawaran diskon, jadwal terbit, dan takedown di Sakuin",
};

export default function AdminPromoPage() {
  return (
    <CardLayout>
      <PromoProvider>
        <AdminPromoLayout />
      </PromoProvider>
    </CardLayout>
  );
}
