import { Pressable, StyleSheet, Text, View } from 'react-native';
import colors from '../constants/colors';
import { Transaction } from '../types/transaction';
import { formatCurrency } from '../utils/currency';
import { formatDate } from '../utils/date';

type Props = {
  transaction: Transaction;
  onPress?: () => void;
};

export default function TransactionItem({ transaction, onPress }: Props) {
  const amountColor = transaction.type === 'income' ? colors.income : colors.expense;
  const amountPrefix = transaction.type === 'income' ? '+' : '-';
  const badgeLabel = transaction.type === 'income' ? 'Pemasukan' : 'Pengeluaran';

  return (
    <Pressable style={styles.card} onPress={onPress}>
      <View style={styles.leftSection}>
        <Text style={styles.title}>{transaction.title}</Text>
        <Text style={styles.meta}>{formatDate(transaction.date)}</Text>
        {transaction.note ? <Text style={styles.note}>{transaction.note}</Text> : null}
      </View>

      <View style={styles.rightSection}>
        <Text style={[styles.amount, { color: amountColor }]}>
          {amountPrefix}
          {formatCurrency(transaction.amount)}
        </Text>
        <View style={[styles.badge, { backgroundColor: amountColor }]}>
          <Text style={styles.badgeText}>{badgeLabel}</Text>
        </View>
      </View>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  card: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: 12,
    backgroundColor: colors.surface,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: colors.border,
    padding: 16,
    marginBottom: 12,
  },
  leftSection: {
    flex: 1,
  },
  rightSection: {
    alignItems: 'flex-end',
    justifyContent: 'space-between',
    gap: 8,
  },
  title: {
    fontSize: 16,
    fontWeight: '600',
    color: colors.text,
    marginBottom: 4,
  },
  meta: {
    color: colors.mutedText,
    fontSize: 13,
  },
  note: {
    color: colors.mutedText,
    fontSize: 13,
    marginTop: 4,
  },
  amount: {
    fontSize: 15,
    fontWeight: '700',
    textAlign: 'right',
  },
  badge: {
    borderRadius: 999,
    paddingHorizontal: 10,
    paddingVertical: 4,
  },
  badgeText: {
    color: colors.white,
    fontSize: 12,
    fontWeight: '600',
  },
});
