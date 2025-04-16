// src/components/ExpenseListItem.tsx
import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { Expense } from '../types'; // Adjust import path
import { formatDate } from '../utils/helper'; // Adjust import path

interface Props {
  item: Expense;
  onDelete: (id: string, description: string) => void; // Pass confirmation handler
}

const ExpenseListItem: React.FC<Props> = ({ item, onDelete }) => {
  return (
    <View style={styles.expenseItem}>
      <View style={styles.expenseDetails}>
        <Text style={styles.expenseDescription}>{item.store || item.description}</Text>
        <Text style={styles.expenseDate}>{formatDate(item.date)}</Text>
      </View>
      <View style={styles.amountContainer}>
         <Text style={styles.expenseAmount}>€{item.amount.toFixed(2)}</Text>
      </View>
      <TouchableOpacity
        onPress={() => onDelete(item.id, item.store || item.description)}
        style={styles.deleteButton}
      >
        <Text style={styles.deleteButtonText}>X</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
    expenseItem: { flexDirection: 'row', alignItems: 'center', paddingVertical: 12, paddingLeft: 15, borderBottomWidth: 1, borderBottomColor: '#eee', backgroundColor:'#fff' },
    expenseDetails: { flex: 1, marginRight: 8 },
    expenseDescription: { fontSize: 15, color: '#333', fontWeight:'500', marginBottom: 2 },
    expenseDate: { fontSize: 12, color: '#888' },
    amountContainer: { paddingHorizontal: 10, },
    expenseAmount: { fontSize: 15, fontWeight: 'bold', color: '#007AFF' }, // Blue color for amount
    deleteButton: { paddingHorizontal: 15, paddingVertical: 10, marginLeft: 5 }, // Reduced margin slightly
    deleteButtonText: { color: 'red', fontSize: 16, fontWeight: 'bold' },
});

export default ExpenseListItem;