import type { Metadata } from "next";
import CardLayout from "@/features/user/card/presentation/views/CardLayout";
import CardDetailContent from "@/features/user/card/presentation/views/LeftSidebarContent";

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
