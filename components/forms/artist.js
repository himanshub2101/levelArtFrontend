import React from 'react';
import { View, TextInput, StyleSheet } from 'react-native';

const ArtistForm = () => {
  return (
    <View style={styles.container}>
      {/* Artist-specific fields */}
      <TextInput
        placeholder="First Name"
        style={styles.input}
      />
      <TextInput
        placeholder="Last Name"
        style={styles.input}
      />
      <TextInput
        placeholder="Email"
        style={styles.input}
      />
      <TextInput
        placeholder="Phone"
        style={styles.input}
      />
      <TextInput
        placeholder="City & State, Country"
        style={styles.input}
      />
      <TextInput
        placeholder="Pincode"
        style={styles.input}
      />
      <TextInput
        placeholder="Full Address"
        style={styles.input}
      />
      <TextInput
        placeholder="ID Proof"
        style={styles.input}
      />
      <TextInput
        placeholder="ID Proof Name and Number"
        style={styles.input}
      />
      <TextInput
        placeholder="Proof Upload"
        style={styles.input}
      />
      <TextInput
        placeholder="Age"
        style={styles.input}
      />
      <TextInput
        placeholder="DOB"
        style={styles.input}
      />
      <TextInput
        placeholder="Gender"
        style={styles.input}
      />
      <TextInput
        placeholder="Height"
        style={styles.input}
      />
      <TextInput
        placeholder="Weight"
        style={styles.input}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginBottom: 20,
  },
  input: {
    borderWidth: 1,
    borderColor: 'gray',
    borderRadius: 5,
    padding: 10,
    marginBottom: 10,
  },
});

export default ArtistForm;
