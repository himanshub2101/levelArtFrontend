import React from "react";
import { StyleSheet, Text, View, Pressable } from "react-native";
import Icon from 'react-native-vector-icons/Ionicons';

const Sidebar = ({ isOpen, onClose, options }) => {
  if (!isOpen) {
    return null;
  }

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Settings</Text>
        <Pressable onPress={onClose}>
          <Icon name="close-outline" size={24} color="black" style={styles.closeIcon} />
        </Pressable>
      </View>
      <View style={styles.options}>
        {options.map((option, index) => (
          <Text key={index} style={styles.option}>{option}</Text>
        ))}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: "white",
    width: "70%",
    height: "100%",
    position: "absolute",
    top: 0,
    right: 0,
    padding: 20,
    zIndex: 100,
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 20,
  },
  title: {
    fontSize: 20,
    fontWeight: "bold",
  },
  closeIcon: {
    marginRight: -10,
  },
  options: {
    marginTop: 10,
  },
  option: {
    fontSize: 18,
    marginBottom: 10,
  },
});

export default Sidebar;
