import type { Metadata } from "next";
import CardLayout from "@/views/layout/CardLayout";
import Panduan from "@/views/pages/panduan/Panduan";

export const metadata: Metadata = {
  title: "Panduan | Sakuin",
  description: "Petunjuk praktis dan panduan langkah demi langkah fitur kartu virtual langsung di dashboard Sakuin",
};

export default function PanduanPage() {
  return (
    <CardLayout>
<Panduan />
</CardLayout>
  );
}
