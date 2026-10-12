import type { Metadata } from "next";
import CardLayout from "@/views/layout/CardLayout";
import AdminInfoLayout from "@/views/pages/admin/info/AdminInfoLayout";

export const metadata: Metadata = {
  title: "Informasi | Sakuin Dashboard",
  description: "Kelola papan informasi, pengumuman, dan pembaruan layanan di Sakuin",
};

export default function AdminInfoPage() {
  return (
    <CardLayout>
<AdminInfoLayout />
</CardLayout>
  );
}
