import { router, useFocusEffect } from 'expo-router';
import React, { useCallback, useMemo, useState } from 'react';
import { ActivityIndicator, FlatList, StyleSheet, Text, View } from 'react-native';
import EmptyState from '../components/EmptyState';
import FilterTabs from '../components/FilterTabs';
import TransactionItem from '../components/TransactionItem';
import colors from '../constants/colors';
import { useTransactions } from '../hooks/useTransactions';
import { TransactionFilter } from '../types/transaction';
import { filterTransactions } from '../utils/transaction';

export default function HistoryScreen() {
  const { transactions, loading, refresh } = useTransactions();
  const [filter, setFilter] = useState<TransactionFilter>('all');

  useFocusEffect(
    useCallback(() => {
      refresh();
    }, [refresh]),
  );

  const filteredTransactions = useMemo(
    () => filterTransactions(transactions, filter),
    [transactions, filter],
  );

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Semua Transaksi</Text>
      <FilterTabs value={filter} onChange={setFilter} />

      {loading ? (
        <View style={styles.loadingContainer}>
          <ActivityIndicator color={colors.primary} />
          <Text style={styles.loadingText}>Memuat transaksi...</Text>
        </View>
      ) : filteredTransactions.length === 0 ? (
        <EmptyState
          title="Riwayat masih kosong"
          description="Transaksi yang kamu simpan akan muncul di sini"
        />
      ) : (
        <FlatList
          data={filteredTransactions}
          keyExtractor={(item) => item.id}
          renderItem={({ item }) => (
            <TransactionItem
              transaction={item}
              onPress={() => router.push(`/transaction-form?id=${item.id}`)}
            />
          )}
          contentContainerStyle={styles.listContent}
          showsVerticalScrollIndicator={false}
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    backgroundColor: colors.background,
  },
  title: {
    fontSize: 22,
    fontWeight: '700',
    color: colors.text,
    marginBottom: 12,
  },
  loadingContainer: {
    marginTop: 24,
    alignItems: 'center',
    gap: 10,
  },
  loadingText: {
    color: colors.mutedText,
  },
  listContent: {
    paddingBottom: 24,
  },
});
