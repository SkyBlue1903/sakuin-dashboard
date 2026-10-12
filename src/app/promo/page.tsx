import type { Metadata } from "next";
import CardLayout from "@/app/card/layout/CardLayout";
import { PromoProvider } from "@/context/PromoContext";
import Promo from "./Promo";

export const metadata: Metadata = {
  title: "Promo | Sakuin",
  description: "Dapatkan promo terbaru, reward cashback merchant, dan keuntungan ekstra kartu virtual Sakuin",
};

export default function PromoPage() {
  return (
    <CardLayout>
      <PromoProvider>
        <Promo />
      </PromoProvider>
    </CardLayout>
  );
}
