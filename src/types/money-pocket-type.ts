import type { Transaction } from "./transaction-type";

export type MoneyPocket = {
  id: string;
  balance: number;
  currency: string;
  name: string;
  type: string;
  iconUrl?: string;
  transactions: Transaction[];
};
