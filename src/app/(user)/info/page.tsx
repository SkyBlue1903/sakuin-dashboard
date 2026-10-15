import type { Metadata } from "next";
import CardLayout from "@/features/user/card/presentation/views/CardLayout";
import Info from "@/features/user/info/presentation/views/InfoPage";

export const metadata: Metadata = {
  title: "Informasi | Sakuin",
  description: "Pusat pengumuman penting dan pembaruan layanan Sakuin",
};

export default function InfoPage() {
  return (
    <CardLayout>
<Info />
</CardLayout>
  );
}
