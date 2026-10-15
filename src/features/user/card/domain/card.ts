export interface Card {
  id: number | string;
  name: string;
  number: string;
  last4: string;
  holder: string;
  exp: string;
  cvv: string;
  balance: number;
  isFrozen: boolean;
  image: string;
  pin: string;
}

export interface Transaction {
  id: string;
  merchant: string;
  categoryId?: string;
  category: string;
  date: string;
  amount: string;
  currency: string;
  status: "Declined" | "Success" | "Pending";
  reason?: string;
  cardLast4: string;
}
