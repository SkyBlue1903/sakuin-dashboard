import DashboardLayout from "@/components/layout/DashboardLayout";
import CardPageContent from "@/components/card/CardPageContent";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Kartu S-Card | Sakuin Dashboard",
  description: "Kelola kartu virtual Visa S-Card dan transaksi",
};

export default function Home() {
  return (
    <DashboardLayout>
      <CardPageContent />
    </DashboardLayout>
  );
}
