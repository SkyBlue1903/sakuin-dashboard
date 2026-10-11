import type { Metadata } from "next";
import CardLayout from "@/app/card/layout/CardLayout";
import { PromoProvider } from "@/context/PromoContext";
import AdminGuidesLayout from "./AdminGuidesLayout";

export const metadata: Metadata = {
  title: "Panduan | Sakuin Dashboard",
  description: "Kelola panduan langkah, petunjuk interaktif, dan dokumentasi dashboard di Sakuin",
};

export default function AdminGuidesPage() {
  return (
    <CardLayout>
      <PromoProvider>
        <AdminGuidesLayout />
      </PromoProvider>
    </CardLayout>
  );
}
