import type { Metadata } from "next";
import CardLayout from "@/features/user/card/presentation/views/CardLayout";
import Promo from "@/features/user/promo/presentation/views/PromoPage";

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
