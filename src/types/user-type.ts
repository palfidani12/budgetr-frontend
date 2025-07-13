import type { MoneyPocket } from "./money-pocket-type";

export type User = {
  id: string;
  nickName?: string;
  firstName: string;
  lastName: string;
  email: string;
  country: string;
  moneyPockets: MoneyPocket[];
};
