import type { Metadata } from "next";
import CardLayout from "@/views/layout/CardLayout";
import AdminMerchantCategory from "@/views/pages/admin/merchant/AdminMerchantCategoryLayout";

export const metadata: Metadata = {
  title: "Kategori Merchant | Sakuin Dashboard",
  description: "Kelola pemetaan kategori dan daftar merchant untuk transaksi kartu Sakuin",
};

export default function AdminMerchantPage() {
  return (
    <CardLayout>
      <AdminMerchantCategory />
    </CardLayout>
  );
}
