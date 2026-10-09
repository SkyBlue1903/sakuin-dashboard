import type { Metadata } from "next";
import DashboardLayout from "@/layout/DashboardLayout";
import CardPageContent from "@/components/card/CardPageContent";

export const metadata: Metadata = {
  title: "Kartu S-Card | Sakuin Dashboard",
  description: "Kelola kartu virtual Visa S-Card dan riwayat transaksi",
};

export default function KartuPage() {
  return (
    <DashboardLayout>
      <CardPageContent />
    </DashboardLayout>
  );
}
