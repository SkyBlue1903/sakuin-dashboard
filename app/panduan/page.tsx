import type { Metadata } from "next";
import CardLayout from "@/app/card/layout/CardLayout";
import { PromoProvider } from "@/context/PromoContext";
import Panduan from "./Panduan";

export const metadata: Metadata = {
  title: "Panduan | Sakuin",
  description: "Petunjuk praktis dan panduan langkah demi langkah fitur kartu virtual langsung di dashboard Sakuin",
};

export default function PanduanPage() {
  return (
    <CardLayout>
      <PromoProvider>
        <Panduan />
      </PromoProvider>
    </CardLayout>
  );
}
