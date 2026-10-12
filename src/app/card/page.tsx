import type { Metadata } from "next";
import CardLayout from "@/views/layout/CardLayout";
import CardDetailContent from "@/views/pages/card/layout/LeftSidebarContent";

export const metadata: Metadata = {
  title: "SakuCard | Sakuin Dashboard",
  description: "Kelola kartu virtual dan daftar riwayat transaksi Anda",
};

export default function CardPage() {
  return (
    <CardLayout>
      <CardDetailContent />
    </CardLayout>
  );
}
