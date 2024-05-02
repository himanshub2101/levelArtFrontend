import React from "react";
import { StyleSheet, Text, View, Pressable, TextInput } from "react-native";
import Icon from 'react-native-vector-icons/Ionicons';
import { Feather } from '@expo/vector-icons';

const SettingsScreen = () => {
  // Function to handle theme change
  

  return (
    <View style={styles.container}>
      <View style={{flexDirection:"row"}}>
      <Feather name="search" size={24} color="black" />
        <TextInput
          placeholder="Search"
        />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});

export default SettingsScreen;
