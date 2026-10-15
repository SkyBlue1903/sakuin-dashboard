import type { Metadata } from "next";
import CardLayout from "@/features/user/card/presentation/views/CardLayout";
import AdminPromoLayout from "@/features/admin/promo/presentation/views/AdminPromoLayout";

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
