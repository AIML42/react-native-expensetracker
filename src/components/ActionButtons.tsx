// src/components/ActionButtons.tsx
import React from 'react';
import { View, Button, StyleSheet } from 'react-native';

interface Props {
  onScanPress: () => void;
  isScanning: boolean;
  isApiKeyMissing: boolean;
}

const ActionButtons: React.FC<Props> = ({ onScanPress, isScanning, isApiKeyMissing }) => {
  return (
    <View style={styles.actionsContainer}>
      <Button
        title="Scan Receipt (API)"
        onPress={onScanPress}
        disabled={isScanning || isApiKeyMissing}
      />
      {/* Placeholder for future Add Manual button */}
      {/* <Button title="Add Manually" onPress={() => {}} /> */}
    </View>
  );
};

const styles = StyleSheet.create({
  actionsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    paddingVertical: 15, // Increased padding
    borderTopWidth: 1,
    borderTopColor: '#ddd',
    backgroundColor: '#f8f8f8', // Slightly different bg for button area
  },
});

export default ActionButtons;