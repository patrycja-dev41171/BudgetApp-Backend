export interface PermanentTransaction {
  id?: string;
  user_id: string;
  date: Date;
  next_date: Date;
  type: "initial" | "income" | "expense" | "change";
  amount: number;
  name: string;
  category: string;
}

export interface PermanentTransactionList {
  id: string;
  user_id: string;
  date: string;
  next_date: string;
  type: "initial" | "income" | "expense" | "change";
  amount: number;
  name: string;
  category: string;
}
