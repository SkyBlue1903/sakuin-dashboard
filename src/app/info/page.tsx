import type { Metadata } from "next";
import CardLayout from "@/app/card/layout/CardLayout";
import { PromoProvider } from "@/context/PromoContext";
import Info from "./Info";

export const metadata: Metadata = {
  title: "Informasi | Sakuin",
  description: "Pusat pengumuman penting dan pembaruan layanan Sakuin",
};

export default function InfoPage() {
  return (
    <CardLayout>
      <PromoProvider>
        <Info />
      </PromoProvider>
    </CardLayout>
  );
}
