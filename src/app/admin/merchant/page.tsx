import type { Metadata } from "next";
import CardLayout from "@/features/user/card/presentation/views/CardLayout";
import AdminMerchantCategory from "@/features/admin/merchant/presentation/views/AdminMerchantCategoryLayout";

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
