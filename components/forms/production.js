// ProductionForm.js
import React from 'react';
import { View, TextInput, StyleSheet } from 'react-native';

const ProductionForm = () => {
  return (
    <View>
      {/* Production-specific fields */}
      <TextInput
        placeholder="Production-specific field 1"
        style={styles.input}
      />
      <TextInput
        placeholder="Production-specific field 2"
        style={styles.input}
      />
      {/* Add more production-specific fields as needed */}
    </View>
  );
};

const styles = StyleSheet.create({
  input: {
    borderWidth: 1,
    borderColor: 'gray',
    padding: 10,
    marginBottom: 10,
  },
});

export default ProductionForm;
