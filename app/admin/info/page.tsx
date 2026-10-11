import type { Metadata } from "next";
import CardLayout from "@/app/card/layout/CardLayout";
import { PromoProvider } from "@/context/PromoContext";
import AdminInfoLayout from "./AdminInfoLayout";

export const metadata: Metadata = {
  title: "Informasi | Sakuin Dashboard",
  description: "Kelola papan informasi, pengumuman, dan pembaruan layanan di Sakuin",
};

export default function AdminInfoPage() {
  return (
    <CardLayout>
      <PromoProvider>
        <AdminInfoLayout />
      </PromoProvider>
    </CardLayout>
  );
}
