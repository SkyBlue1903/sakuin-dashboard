import type { Metadata } from "next";
import CardLayout from "@/views/layout/CardLayout";
import AdminPromoLayout from "@/views/pages/admin/promo/AdminPromoLayout";

export const metadata: Metadata = {
  title: "Promo | Sakuin Dashboard",
  description: "Kelola banner promosi, penawaran diskon, jadwal terbit, dan takedown di Sakuin",
};

export default function AdminPromoPage() {
  return (
    <CardLayout>
<AdminPromoLayout />
</CardLayout>
  );
}
