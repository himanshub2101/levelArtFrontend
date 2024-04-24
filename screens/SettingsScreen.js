import React from "react";
import { StyleSheet, Text, View, Pressable } from "react-native";
import Icon from 'react-native-vector-icons/Ionicons';

const SettingsScreen = ({ navigation }) => {
  // Function to handle theme change
  const handleThemeChange = () => {
    // Add logic to change the theme
    console.log("Theme changed");
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        {/* Theme change option */}
        <Pressable style={styles.themeIcon} onPress={handleThemeChange}>
          <Icon name="color-palette-outline" size={30} color="#333" />
        </Pressable>
        <Text style={styles.title}>Settings</Text>
      </View>
      <View style={styles.options}>
        <Pressable style={styles.option} onPress={() => navigation.navigate("AccountsCenter")}>
          <Text>Accounts Center</Text>
        </Pressable>
        <Pressable style={styles.option} onPress={() => navigation.navigate("Notifications")}>
          <Text>Notifications</Text>
        </Pressable>
        <Pressable style={styles.option} onPress={() => navigation.navigate("SecurityAccountAccess")}>
          <Text>Security & Account Access</Text>
        </Pressable>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "white",
    padding: 20,
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 20,
  },
  themeIcon: {
    marginRight: 10,
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
  },
  options: {
    marginTop: 10,
  },
  option: {
    paddingVertical: 15,
    borderBottomWidth: 1,
    borderBottomColor: "#ccc",
  },
});

export default SettingsScreen;
