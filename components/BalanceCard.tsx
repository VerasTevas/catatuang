import { StyleSheet, Text, View } from 'react-native';
import colors from '../constants/colors';
import { formatCurrency } from '../utils/currency';

export default function BalanceCard({ balance }: { balance: number }) {
  return (
    <View style={styles.card}>
      <Text style={styles.label}>Saldo Saat Ini</Text>
      <Text style={styles.amount}>{formatCurrency(balance)}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: colors.balance,
    borderRadius: 20,
    padding: 20,
    marginBottom: 16,
  },
  label: {
    color: '#CCFBF1',
    fontSize: 14,
    marginBottom: 8,
  },
  amount: {
    color: colors.white,
    fontSize: 30,
    fontWeight: '700',
  },
});
