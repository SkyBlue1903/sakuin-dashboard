import type { Metadata } from "next";
import CardLayout from "@/app/card/layout/CardLayout";
import CardDetailContent from "@/app/card/layout/LeftSidebarContent";

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
