export type TransactionType = 'income' | 'expense';

export type Transaction = {
  id: string;
  title: string;
  amount: number;
  type: TransactionType;
  date: string;
  note?: string;
  createdAt: string;
  updatedAt: string;
};

export type TransactionFilter = 'all' | 'income' | 'expense';

export type TransactionInput = {
  title: string;
  amount: number;
  type: TransactionType;
  date: string;
  note?: string;
};
