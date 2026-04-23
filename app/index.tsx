import { router, useFocusEffect } from 'expo-router';
import React, { useCallback } from 'react';
import {
  ActivityIndicator,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import BalanceCard from '../components/BalanceCard';
import EmptyState from '../components/EmptyState';
import SummaryCard from '../components/SummaryCard';
import TransactionItem from '../components/TransactionItem';
import colors from '../constants/colors';
import { useTransactions } from '../hooks/useTransactions';

export default function HomeScreen() {
  const {
    loading,
    totalIncome,
    totalExpense,
    balance,
    recentTransactions,
    refresh,
  } = useTransactions();

  useFocusEffect(
    useCallback(() => {
      refresh();
    }, [refresh]),
  );

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <BalanceCard balance={balance} />

      <View style={styles.summaryRow}>
        <SummaryCard label="Pemasukan" amount={totalIncome} variant="income" />
        <SummaryCard label="Pengeluaran" amount={totalExpense} variant="expense" />
      </View>

      <Pressable style={styles.primaryButton} onPress={() => router.push('/transaction-form')}>
        <Text style={styles.primaryButtonText}>Tambah Transaksi</Text>
      </Pressable>

      <View style={styles.sectionHeader}>
        <Text style={styles.sectionTitle}>Transaksi Terbaru</Text>
        <Pressable onPress={() => router.push('/history')}>
          <Text style={styles.linkText}>Lihat Semua</Text>
        </Pressable>
      </View>

      {loading ? (
        <View style={styles.loadingContainer}>
          <ActivityIndicator color={colors.primary} />
          <Text style={styles.loadingText}>Memuat transaksi...</Text>
        </View>
      ) : recentTransactions.length === 0 ? (
        <EmptyState
          title="Belum ada transaksi"
          description="Mulai catat pemasukan atau pengeluaran pertamamu"
          actionLabel="Tambah Transaksi"
          onAction={() => router.push('/transaction-form')}
        />
      ) : (
        recentTransactions.map((transaction) => (
          <TransactionItem
            key={transaction.id}
            transaction={transaction}
            onPress={() => router.push(`/transaction-form?id=${transaction.id}`)}
          />
        ))
      )}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 16,
    paddingBottom: 32,
  },
  summaryRow: {
    flexDirection: 'row',
    gap: 12,
    marginBottom: 16,
  },
  primaryButton: {
    backgroundColor: colors.primary,
    borderRadius: 14,
    paddingVertical: 14,
    alignItems: 'center',
    marginBottom: 20,
  },
  primaryButtonText: {
    color: colors.white,
    fontSize: 16,
    fontWeight: '700',
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: colors.text,
  },
  linkText: {
    color: colors.primaryDark,
    fontWeight: '600',
  },
  loadingContainer: {
    marginTop: 16,
    alignItems: 'center',
    gap: 10,
  },
  loadingText: {
    color: colors.mutedText,
  },
});
