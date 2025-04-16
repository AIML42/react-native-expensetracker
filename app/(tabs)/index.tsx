// app/(tabs)/index.tsx
import React, { useState, useEffect } from 'react';
import { StyleSheet, View, Text, SafeAreaView, Alert, Platform } from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import Constants from 'expo-constants';

// Import modular components and functions
import { Expense, ParsedOcrResult } from '../../src/types'; // Adjust path if needed
import { processImageWithApi } from '../../src/services/visionApi'; // Adjust path
import { parseOcrText } from '../../src/services/ocrParser'; // Adjust path
import { calculateTotal } from '../../src/utils/helper'; // Adjust path
import ExpenseList from '../../src/components/ExpenseList'; // Adjust path
import OcrDisplay from '../../src/components/OcrDisplay'; // Adjust path
import ActionButtons from '../../src/components/ActionButtons'; // Adjust path

// --- API Key Check (runs once on module load) ---
const GOOGLE_CLOUD_VISION_API_KEY = "YOUR_KEY";
const isApiKeyMissing = !GOOGLE_CLOUD_VISION_API_KEY;
if (isApiKeyMissing && Platform.OS !== 'web') { // Avoid warning in web preview maybe
    console.error("API KEY NOT LOADED! Check .env file and app.config.js setup.");
    // Consider showing a persistent warning if key is missing
}
// --- End API Key Check ---

export default function ExpenseTrackerScreen() {
  // --- State ---
  const [expenses, setExpenses] = useState<Expense[]>([
    // { id: '1', description: 'Coffee', amount: 4.50, date: '2025-04-15' }, // Example with date
    // { id: '2', description: 'Lunch', amount: 15.00, date: '2025-04-14' },
    // { id: '3', description: 'Groceries', amount: 75.23, date: '2025-03-20' },
  ]); // Start empty or load from storage later
  const [selectedImageUri, setSelectedImageUri] = useState<string | null>(null);
  const [ocrProcessing, setOcrProcessing] = useState<boolean>(false);
  const [parsedOcrResult, setParsedOcrResult] = useState<ParsedOcrResult | null>(null);
  const [apiErrorOccurred, setApiErrorOccurred] = useState<boolean>(false); // Track if last API/Parse failed

  // Calculate total whenever expenses change
  const totalExpenses = calculateTotal(expenses);

  // --- Handlers ---
  const handleAddExpenseFromOcr = (description: string, amount: number, date: string) => {
    const newExpense: Expense = {
      id: Date.now().toString(),
      description,
      amount,
      date,
    };
    setExpenses(prevExpenses => [newExpense, ...prevExpenses]); // Add to top of list
    // Reset OCR state
    setSelectedImageUri(null);
    setParsedOcrResult(null);
    setApiErrorOccurred(false);
  };

  const handleDeleteExpense = (idToDelete: string) => {
    setExpenses(prevExpenses => prevExpenses.filter(expense => expense.id !== idToDelete));
  };

  const confirmDeleteExpense = (id: string, description: string) => {
    Alert.alert("Delete Expense", `Are you sure you want to delete "${description}"?`, [
        { text: "Cancel", style: "cancel" },
        { text: "Delete", onPress: () => handleDeleteExpense(id), style: "destructive" }
    ], { cancelable: true });
  };

  const handleScanReceipt = async () => {
    if (isApiKeyMissing) {
      Alert.alert("Configuration Error", "Google Cloud Vision API Key is not set.");
      return;
    }
    // Reset state before picking
    setSelectedImageUri(null);
    setParsedOcrResult(null);
    setApiErrorOccurred(false);

    const permissionResult = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (!permissionResult.granted) {
        Alert.alert("Permission Required", "Permission needed to access photos."); return;
    }
    let result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images, allowsEditing: false, quality: 0.8, base64: true,
    });

    if (!result.canceled && result.assets && result.assets[0].base64) {
      setSelectedImageUri(result.assets[0].uri);
      setOcrProcessing(true); // Set processing true *before* async call
      try {
        const visionResponse = await processImageWithApi(result.assets[0].base64);
        const fullText = visionResponse?.fullTextAnnotation?.text || visionResponse?.textAnnotations?.[0]?.description || '';
        if (fullText) {
           const parsedData = parseOcrText(fullText);
           setParsedOcrResult(parsedData);
           setApiErrorOccurred(parsedData.amount === null); // Mark error if amount parsing failed
        } else {
           console.log("No text found by API.");
           setParsedOcrResult({ amount: null, description: "Scan Complete - No text detected", date: new Date().toISOString().split('T')[0] });
           setApiErrorOccurred(true);
        }
      } catch (error: any) {
         Alert.alert('Scan Failed', error.message || 'Could not process image.');
         setApiErrorOccurred(true);
         setParsedOcrResult(null); // Ensure no stale data shown on API error
      } finally {
        setOcrProcessing(false);
      }
    } else if (!result.canceled) {
         Alert.alert("Error", "Could not get Base64 data for the image.");
    }
  };

  // --- Render ---
  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.container}>
        <View style={styles.header}>
           <Text style={styles.title}>Expense Tracker</Text>
           <Text style={styles.totalText}>Total: €{totalExpenses.toFixed(2)}</Text>
        </View>

        {/* Conditionally render OCR display */}
        <OcrDisplay
          imageUri={selectedImageUri}
          isProcessing={ocrProcessing}
          parsedResult={parsedOcrResult}
          onAddExpense={handleAddExpenseFromOcr}
          apiResponseError={apiErrorOccurred}
        />

        {/* Expense List */}
        <View style={[styles.listContainer, selectedImageUri ? styles.listContainerReduced : {}]}>
           <ExpenseList expenses={expenses} onDeleteExpense={confirmDeleteExpense} />
        </View>

        {/* Action Buttons */}
        <ActionButtons
          onScanPress={handleScanReceipt}
          isScanning={ocrProcessing}
          isApiKeyMissing={isApiKeyMissing}
        />
      </View>
    </SafeAreaView>
  );
}

// --- Styles for the main screen ---
const styles = StyleSheet.create({
    safeArea: { flex: 1, backgroundColor: '#f8f8f8' }, // Consistent light background
    container: { flex: 1, paddingBottom: 60 }, // Remove padding, let components handle it
    header: {
       paddingHorizontal: 20,
       paddingTop: Platform.OS === 'android' ? 25 : 20, // Adjust top padding
       paddingBottom: 15,
       backgroundColor: '#fff', // White header background
       borderBottomWidth: 1,
       borderBottomColor: '#eee',
    },
    title: { fontSize: 24, fontWeight: 'bold', textAlign: 'center', marginBottom: 5, color: '#333' },
    totalText: { fontSize: 16, fontWeight:'600', textAlign: 'center', color: '#555' },
    listContainer: { flex: 1, backgroundColor: '#fff', }, // List takes remaining space
    listContainerReduced: { flexShrink: 1, flexGrow: 0, maxHeight: '50%' }, // Adjust how list shrinks
});