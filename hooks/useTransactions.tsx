import React, {
  createContext,
  ReactNode,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from 'react';
import { getTransactions, saveTransactions } from '../storage/transactions';
import { Transaction, TransactionInput } from '../types/transaction';
import {
  createId,
  getTransactionSummary,
  sortTransactions,
} from '../utils/transaction';

type TransactionsContextValue = {
  transactions: Transaction[];
  loading: boolean;
  addTransaction: (input: TransactionInput) => Promise<void>;
  updateTransaction: (id: string, input: TransactionInput) => Promise<void>;
  deleteTransaction: (id: string) => Promise<void>;
  totalIncome: number;
  totalExpense: number;
  balance: number;
  recentTransactions: Transaction[];
  refresh: () => Promise<void>;
  findTransactionById: (id: string) => Transaction | undefined;
};

const TransactionsContext = createContext<TransactionsContextValue | undefined>(undefined);

export function TransactionsProvider({ children }: { children: ReactNode }) {
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [loading, setLoading] = useState(true);

  const refresh = useCallback(async () => {
    setLoading(true);
    const data = await getTransactions();
    setTransactions(sortTransactions(data));
    setLoading(false);
  }, []);

  useEffect(() => {
    refresh();
  }, [refresh]);

  const persist = useCallback(async (next: Transaction[]) => {
    const sorted = sortTransactions(next);
    setTransactions(sorted);
    await saveTransactions(sorted);
  }, []);

  const addTransaction = useCallback(
    async (input: TransactionInput) => {
      const now = new Date().toISOString();
      const newItem: Transaction = {
        id: createId(),
        title: input.title,
        amount: input.amount,
        type: input.type,
        date: input.date,
        note: input.note,
        createdAt: now,
        updatedAt: now,
      };

      await persist([newItem, ...transactions]);
    },
    [persist, transactions],
  );

  const updateTransaction = useCallback(
    async (id: string, input: TransactionInput) => {
      const next = transactions.map((item) =>
        item.id === id
          ? {
              ...item,
              ...input,
              updatedAt: new Date().toISOString(),
            }
          : item,
      );

      await persist(next);
    },
    [persist, transactions],
  );

  const deleteTransaction = useCallback(
    async (id: string) => {
      const next = transactions.filter((item) => item.id !== id);
      await persist(next);
    },
    [persist, transactions],
  );

  const { totalIncome, totalExpense, balance } = useMemo(
    () => getTransactionSummary(transactions),
    [transactions],
  );

  const recentTransactions = useMemo(() => transactions.slice(0, 5), [transactions]);

  const findTransactionById = useCallback(
    (id: string) => transactions.find((item) => item.id === id),
    [transactions],
  );

  const value = useMemo(
    () => ({
      transactions,
      loading,
      addTransaction,
      updateTransaction,
      deleteTransaction,
      totalIncome,
      totalExpense,
      balance,
      recentTransactions,
      refresh,
      findTransactionById,
    }),
    [
      transactions,
      loading,
      addTransaction,
      updateTransaction,
      deleteTransaction,
      totalIncome,
      totalExpense,
      balance,
      recentTransactions,
      refresh,
      findTransactionById,
    ],
  );

  return <TransactionsContext.Provider value={value}>{children}</TransactionsContext.Provider>;
}

export function useTransactions() {
  const context = useContext(TransactionsContext);

  if (!context) {
    throw new Error('useTransactions must be used within TransactionsProvider');
  }

  return context;
}
