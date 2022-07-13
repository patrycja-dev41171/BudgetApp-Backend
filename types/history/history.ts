export interface History {
  id: string;
  user_id: string;
  date: Date;
  type: "initial" | "income" | "expense" | "change";
  amount: number;
  name: string;
  category?: string;
  description?: string;
  is_disposable: boolean;
}
