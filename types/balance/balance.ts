export interface Balance {
  id?: string;
  user_id: string;
  balance: number;
  currency: string;
  name: string;
  date?: Date;
}

export interface BalanceData {
  currency: string;
  balance: number;
  expenses: number;
  income: number;
}
