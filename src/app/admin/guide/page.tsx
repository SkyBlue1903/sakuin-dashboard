import type { Metadata } from "next";
import CardLayout from "@/features/user/card/presentation/views/CardLayout";
import AdminPanduanLayout from "@/features/admin/guide/presentation/views/AdminPanduanLayout";

export const metadata: Metadata = {
  title: "Panduan | Sakuin Dashboard",
  description: "Kelola panduan langkah, petunjuk penggunaan, dan dokumentasi dashboard di Sakuin",
};

export default function AdminGuidesPage() {
  return (
    <CardLayout>
      <AdminPanduanLayout />
    </CardLayout>
  );
}
