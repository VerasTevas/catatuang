import { Stack } from 'expo-router';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { TransactionsProvider } from '../hooks/useTransactions';
import colors from '../constants/colors';

export default function RootLayout() {
  return (
    <SafeAreaProvider>
      <TransactionsProvider>
        <Stack
          screenOptions={{
            headerStyle: { backgroundColor: colors.surface },
            headerTintColor: colors.text,
            contentStyle: { backgroundColor: colors.background },
          }}
        >
          <Stack.Screen name="index" options={{ title: 'CatatUang' }} />
          <Stack.Screen name="history" options={{ title: 'Riwayat' }} />
          <Stack.Screen name="transaction-form" options={{ title: 'Transaksi' }} />
        </Stack>
      </TransactionsProvider>
    </SafeAreaProvider>
  );
}
