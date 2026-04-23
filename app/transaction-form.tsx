import { useLocalSearchParams, useNavigation, router } from 'expo-router';
import React, { useEffect, useLayoutEffect, useMemo, useState } from 'react';
import {
  Alert,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  View,
} from 'react-native';
import colors from '../constants/colors';
import { useTransactions } from '../hooks/useTransactions';
import { TransactionInput, TransactionType } from '../types/transaction';
import { toInputDate } from '../utils/date';

type FormState = {
  title: string;
  amount: string;
  type: TransactionType;
  date: string;
  note: string;
};

function validateForm(state: FormState) {
  if (!state.title.trim()) return 'Judul wajib diisi';
  const amount = Number(state.amount);
  if (!Number.isFinite(amount) || amount <= 0) return 'Nominal harus lebih dari 0';
  if (!state.date.trim()) return 'Tanggal wajib diisi';
  return null;
}

export default function TransactionFormScreen() {
  const navigation = useNavigation();
  const { id } = useLocalSearchParams<{ id?: string }>();
  const { addTransaction, updateTransaction, deleteTransaction, findTransactionById } = useTransactions();

  const editingTransaction = useMemo(
    () => (typeof id === 'string' ? findTransactionById(id) : undefined),
    [findTransactionById, id],
  );

  const [form, setForm] = useState<FormState>({
    title: '',
    amount: '',
    type: 'expense',
    date: toInputDate(),
    note: '',
  });
  const [error, setError] = useState('');
  const isEditMode = Boolean(editingTransaction);

  useEffect(() => {
    if (editingTransaction) {
      setForm({
        title: editingTransaction.title,
        amount: String(editingTransaction.amount),
        type: editingTransaction.type,
        date: editingTransaction.date,
        note: editingTransaction.note ?? '',
      });
    }
  }, [editingTransaction]);

  useLayoutEffect(() => {
    navigation.setOptions({
      title: isEditMode ? 'Edit Transaksi' : 'Tambah Transaksi',
    });
  }, [isEditMode, navigation]);

  const setField = (key: keyof FormState, value: string) => {
    setForm((current) => ({ ...current, [key]: value }));
  };

  const handleSubmit = async () => {
    const validationError = validateForm(form);
    if (validationError) {
      setError(validationError);
      return;
    }

    setError('');

    const payload: TransactionInput = {
      title: form.title.trim(),
      amount: Number(form.amount),
      type: form.type,
      date: form.date,
      note: form.note.trim() || undefined,
    };

    if (editingTransaction) {
      await updateTransaction(editingTransaction.id, payload);
    } else {
      await addTransaction(payload);
    }

    router.back();
  };

  const handleDelete = () => {
    if (!editingTransaction) return;

    Alert.alert('Hapus transaksi?', 'Data yang dihapus tidak bisa dikembalikan.', [
      { text: 'Batal', style: 'cancel' },
      {
        text: 'Hapus',
        style: 'destructive',
        onPress: async () => {
          await deleteTransaction(editingTransaction.id);
          router.back();
        },
      },
    ]);
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.label}>Judul</Text>
      <TextInput
        placeholder="Contoh: Gaji / Makan siang"
        value={form.title}
        onChangeText={(value) => setField('title', value)}
        style={styles.input}
      />

      <Text style={styles.label}>Nominal</Text>
      <TextInput
        placeholder="Contoh: 50000"
        value={form.amount}
        onChangeText={(value) => setField('amount', value.replace(/[^0-9]/g, ''))}
        keyboardType="numeric"
        style={styles.input}
      />

      <Text style={styles.label}>Tipe</Text>
      <View style={styles.segmentRow}>
        <Pressable
          style={[styles.segmentButton, form.type === 'income' && styles.segmentButtonActive]}
          onPress={() => setForm((current) => ({ ...current, type: 'income' }))}
        >
          <Text style={[styles.segmentText, form.type === 'income' && styles.segmentTextActive]}>
            Pemasukan
          </Text>
        </Pressable>
        <Pressable
          style={[styles.segmentButton, form.type === 'expense' && styles.segmentButtonActive]}
          onPress={() => setForm((current) => ({ ...current, type: 'expense' }))}
        >
          <Text style={[styles.segmentText, form.type === 'expense' && styles.segmentTextActive]}>
            Pengeluaran
          </Text>
        </Pressable>
      </View>

      <Text style={styles.label}>Tanggal</Text>
      <TextInput
        placeholder="YYYY-MM-DD"
        value={form.date}
        onChangeText={(value) => setField('date', value)}
        style={styles.input}
      />

      <Text style={styles.label}>Catatan (opsional)</Text>
      <TextInput
        placeholder="Tambahkan catatan singkat"
        value={form.note}
        onChangeText={(value) => setField('note', value)}
        style={[styles.input, styles.multilineInput]}
        multiline
        numberOfLines={4}
        textAlignVertical="top"
      />

      {error ? <Text style={styles.errorText}>{error}</Text> : null}

      <Pressable style={styles.primaryButton} onPress={handleSubmit}>
        <Text style={styles.primaryButtonText}>{isEditMode ? 'Simpan Perubahan' : 'Simpan'}</Text>
      </Pressable>

      {isEditMode ? (
        <Pressable style={styles.deleteButton} onPress={handleDelete}>
          <Text style={styles.deleteButtonText}>Hapus Transaksi</Text>
        </Pressable>
      ) : null}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 16,
    paddingBottom: 32,
    backgroundColor: colors.background,
  },
  label: {
    fontSize: 14,
    fontWeight: '600',
    color: colors.text,
    marginBottom: 8,
    marginTop: 12,
  },
  input: {
    backgroundColor: colors.surface,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: 14,
    paddingHorizontal: 14,
    paddingVertical: 13,
    fontSize: 15,
    color: colors.text,
  },
  multilineInput: {
    minHeight: 100,
  },
  segmentRow: {
    flexDirection: 'row',
    gap: 10,
  },
  segmentButton: {
    flex: 1,
    backgroundColor: colors.surface,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: 14,
    paddingVertical: 12,
    alignItems: 'center',
  },
  segmentButtonActive: {
    backgroundColor: colors.primary,
    borderColor: colors.primary,
  },
  segmentText: {
    color: colors.text,
    fontWeight: '600',
  },
  segmentTextActive: {
    color: colors.white,
  },
  errorText: {
    color: colors.expense,
    marginTop: 12,
    fontWeight: '600',
  },
  primaryButton: {
    marginTop: 20,
    backgroundColor: colors.primary,
    borderRadius: 14,
    paddingVertical: 15,
    alignItems: 'center',
  },
  primaryButtonText: {
    color: colors.white,
    fontSize: 16,
    fontWeight: '700',
  },
  deleteButton: {
    marginTop: 12,
    backgroundColor: '#FEE2E2',
    borderRadius: 14,
    paddingVertical: 15,
    alignItems: 'center',
  },
  deleteButtonText: {
    color: colors.expense,
    fontSize: 15,
    fontWeight: '700',
  },
});
