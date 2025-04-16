// src/components/OcrDisplay.tsx
import React from 'react';
import { View, Text, Image, ActivityIndicator, Button, StyleSheet, Platform } from 'react-native';
import { ParsedOcrResult } from '../types'; // Adjust import path

interface Props {
  imageUri: string | null;
  isProcessing: boolean;
  parsedResult: ParsedOcrResult | null;
  onAddExpense: (description: string, amount: number, date: string) => void;
  apiResponseError: boolean; // Flag if API call failed or parsing failed
}

const OcrDisplay: React.FC<Props> = ({ imageUri, isProcessing, parsedResult, onAddExpense, apiResponseError }) => {
  if (!imageUri) {
    return null; // Don't render anything if no image is selected
  }

  const canAdd = parsedResult?.amount !== null; // Check if amount was successfully parsed

  return (
    <View style={styles.ocrSection}>
      <Text style={styles.ocrTitle}>Scanned Receipt:</Text>
      <Image source={{ uri: imageUri }} style={styles.selectedImage} resizeMode="contain" />
      {isProcessing && <ActivityIndicator size="large" color="#0000ff" style={styles.activityIndicator} />}

      {!isProcessing && parsedResult && (
        <View style={styles.extractedInfoBox}>
          <Text style={styles.extractedInfoTitle}>Extracted Info:</Text>
          <Text style={styles.infoText}>Store: {parsedResult.description}</Text>
          <Text style={styles.infoText}>Date: {parsedResult.date}</Text>
          {parsedResult.amount !== null ? (
            <Text style={styles.extractedAmountText}>Amount: €{parsedResult.amount.toFixed(2)}</Text>
          ) : (
            <Text style={styles.errorText}>Could not extract amount.</Text>
          )}
          {/* Only enable button if amount is valid */}
          <Button
            title={`Add This Expense`}
            onPress={() => onAddExpense(parsedResult.description, parsedResult.amount!, parsedResult.date!)}
            disabled={!canAdd} // Disable if amount is null
          />
        </View>
      )}
      {/* Show general error if API/parsing failed and not processing */}
      {!isProcessing && apiResponseError && !parsedResult?.amount && (
         <Text style={styles.errorText}>Could not process receipt accurately.</Text>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
    ocrSection: { marginBottom: 15, padding: 10, backgroundColor: '#e9e9e9', borderRadius: 8 },
    ocrTitle: { fontSize: 16, fontWeight: 'bold', marginBottom: 10, textAlign: 'center' },
    selectedImage: { width: '100%', height: 150, marginBottom: 10, backgroundColor: '#ccc' },
    activityIndicator: { marginVertical: 20 },
    extractedInfoBox: { marginVertical: 10, padding: 15, backgroundColor: '#d9f9d9', borderRadius: 4, alignItems: 'center' },
    extractedInfoTitle: { fontSize: 14, fontWeight: 'bold', marginBottom: 8 },
    infoText: { fontSize: 14, color: '#333', marginBottom: 4 },
    extractedAmountText: { fontSize: 18, fontWeight: 'bold', color: '#006400', marginVertical: 8 },
    errorText: { color: 'red', marginTop: 10, textAlign:'center', fontWeight: '500' },
});

export default OcrDisplay;