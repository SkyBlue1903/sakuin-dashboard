import type { Metadata } from "next";
import CardLayout from "@/views/layout/CardLayout";
import Promo from "@/views/pages/promo/Promo";

export const metadata: Metadata = {
  title: "Promo | Sakuin",
  description: "Dapatkan promo terbaru, reward cashback merchant, dan keuntungan ekstra kartu virtual Sakuin",
};

export default function PromoPage() {
  return (
    <CardLayout>
<Promo />
</CardLayout>
  );
}
