import type { Metadata } from "next";
import CardLayout from "@/views/layout/CardLayout";
import Info from "@/views/pages/info/Info";

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
