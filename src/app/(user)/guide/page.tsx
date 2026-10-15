import type { Metadata } from "next";
import CardLayout from "@/features/user/card/presentation/views/CardLayout";
import Panduan from "@/features/user/guide/presentation/views/GuidePage";

export const metadata: Metadata = {
  title: "Panduan | Sakuin",
  description: "Petunjuk praktis dan panduan langkah demi langkah fitur kartu virtual langsung di dashboard Sakuin",
};

export default function GuidesPage() {
  return (
    <CardLayout>
      <Panduan />
    </CardLayout>
  );
}
