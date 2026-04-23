import { StyleSheet, Text, View } from 'react-native';
import colors from '../constants/colors';
import { formatCurrency } from '../utils/currency';

type Props = {
  label: string;
  amount: number;
  variant: 'income' | 'expense';
};

export default function SummaryCard({ label, amount, variant }: Props) {
  const accentColor = variant === 'income' ? colors.income : colors.expense;

  return (
    <View style={styles.card}>
      <Text style={styles.label}>{label}</Text>
      <Text style={[styles.amount, { color: accentColor }]}>{formatCurrency(amount)}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    flex: 1,
    backgroundColor: colors.surface,
    borderRadius: 16,
    padding: 16,
    borderWidth: 1,
    borderColor: colors.border,
  },
  label: {
    color: colors.mutedText,
    fontSize: 13,
    marginBottom: 6,
  },
  amount: {
    fontSize: 17,
    fontWeight: '700',
  },
});
