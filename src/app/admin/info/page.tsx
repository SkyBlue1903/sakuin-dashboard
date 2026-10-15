import type { Metadata } from "next";
import CardLayout from "@/features/user/card/presentation/views/CardLayout";
import AdminInfoLayout from "@/features/admin/info/presentation/views/AdminInfoLayout";

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
