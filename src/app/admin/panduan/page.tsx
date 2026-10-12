import type { Metadata } from "next";
import CardLayout from "@/views/layout/CardLayout";
import AdminPanduanLayout from "@/views/pages/admin/panduan/AdminPanduanLayout";

export const metadata: Metadata = {
  title: "Panduan | Sakuin Dashboard",
  description: "Kelola panduan langkah, petunjuk penggunaan, dan dokumentasi dashboard di Sakuin",
};

export default function AdminPanduanPage() {
  return (
    <CardLayout>
      <AdminPanduanLayout />
    </CardLayout>
  );
}
