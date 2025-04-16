// src/utils/helpers.ts
import { Expense } from '../types'; // Adjust import path

// Format date for display (e.g., "16 Apr 2025")
export const formatDate = (dateString: string): string => {
  try {
    const date = new Date(dateString + 'T00:00:00'); // Ensure it's treated as local date
    return date.toLocaleDateString(undefined, { // Use locale default format
      day: 'numeric',
      month: 'short',
      year: 'numeric',
    });
  } catch (e) {
    return dateString; // Fallback
  }
};

// Calculate total expenses
export const calculateTotal = (expenses: Expense[]): number => {
   return expenses.reduce((sum, expense) => sum + expense.amount, 0);
};

// Group expenses by month (YYYY-MM format)
export const groupExpensesByMonth = (expenses: Expense[]): { [month: string]: Expense[] } => {
  return expenses.reduce((acc, expense) => {
    const month = expense.date.substring(0, 7); // Extract YYYY-MM
    if (!acc[month]) {
      acc[month] = [];
    }
    acc[month].push(expense);
    // Optional: Sort expenses within the month by date descending
    acc[month].sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
    return acc;
  }, {} as { [month: string]: Expense[] });
};

 // Format month key (YYYY-MM) for display (e.g., "Apr 2025")
 export const formatMonthYear = (monthKey: string): string => {
    try {
        const [year, month] = monthKey.split('-');
        const date = new Date(parseInt(year), parseInt(month) - 1, 1); // Month is 0-indexed
         return date.toLocaleDateString(undefined, { month: 'short', year: 'numeric' });
    } catch (e) {
        return monthKey; // Fallback
    }
 };