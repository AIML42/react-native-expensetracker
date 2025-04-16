// src/components/ExpenseList.tsx
import React from 'react';
import { SectionList, View, Text, StyleSheet } from 'react-native';
import { Expense } from '../types'; // Adjust import path
import ExpenseListItem from './ExpenseListItem';
import { groupExpensesByMonth, calculateTotal, formatMonthYear } from '../utils/helper'; // Adjust import path

interface Props {
  expenses: Expense[];
  onDeleteExpense: (id: string, description: string) => void;
}

const ExpenseList: React.FC<Props> = ({ expenses, onDeleteExpense }) => {
  // Group expenses and prepare data for SectionList
  const grouped = groupExpensesByMonth(expenses);
  const sections = Object.keys(grouped)
    .sort((a, b) => b.localeCompare(a)) // Sort months descending (newest first)
    .map(month => ({
      title: month, // YYYY-MM key
      data: grouped[month],
      total: calculateTotal(grouped[month]), // Calculate monthly total
    }));

  if (expenses.length === 0) {
    return (
      <View style={styles.placeholderContainer}>
        <Text style={styles.placeholderText}>No expenses yet. Add one!</Text>
      </View>
    );
  }

  return (
    <SectionList
      sections={sections}
      keyExtractor={(item) => item.id}
      renderItem={({ item }) => (
        <ExpenseListItem item={item} onDelete={onDeleteExpense} />
      )}
      renderSectionHeader={({ section: { title, total } }) => (
        <View style={styles.sectionHeader}>
          <Text style={styles.sectionHeaderText}>{formatMonthYear(title)}</Text>
          <Text style={styles.sectionTotalText}>Total: €{total.toFixed(2)}</Text>
        </View>
      )}
      stickySectionHeadersEnabled={false} // Optional: Keep headers from sticking
      style={styles.list}
    />
  );
};

const styles = StyleSheet.create({
  list: { flex: 1 },
  placeholderContainer: { flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: '#fff', borderRadius:8 },
  placeholderText: { fontSize: 16, color: '#888' },
  sectionHeader: {
    backgroundColor: '#f0f0f0', // Light grey background for header
    paddingHorizontal: 15,
    paddingVertical: 8,
    borderBottomWidth: 1,
    borderBottomColor: '#ddd',
    borderTopWidth: 1, // Add top border for separation
    borderTopColor: '#ddd',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  sectionHeaderText: { fontSize: 14, fontWeight: 'bold', color: '#555' },
  sectionTotalText: { fontSize: 13, color: '#555', fontWeight: '500'},
});

export default ExpenseList;