export interface HistoryEntity {
  id?: string;
  user_id: string;
  date?: Date | null;
  type: "initial" | "income" | "expense" | "change";
  amount: number;
  name: string;
  category?: string;
}

export interface HistoryCreated {
  id: string;
  user_id: string;
  date: Date | null;
  type: "initial" | "income" | "expense" | "change";
  amount: number;
  name: string;
  category: string;
}

export interface HistoryListEntity {
  id: string;
  user_id: string;
  date: string;
  type: "initial" | "income" | "expense" | "change";
  amount: number;
  name: string;
  category: string;
}
