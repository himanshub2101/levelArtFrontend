import React from "react";
import { StyleSheet, Text, View, Pressable } from "react-native";
import { useNavigation } from "@react-navigation/native";

const AccountsCenterScreen = () => {
  const navigation = useNavigation();

  // Function to navigate to specific sections
  const navigateToSection = (sectionName) => {
    // Navigate to the specified section
    navigation.navigate(sectionName);
  };

  return (
    <View style={styles.container}>
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Profile Information</Text>
        {/* Add functionality related to profile information here */}
        {/* For example: Display user's name, email, profile picture, etc. */}
      </View>
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Change Password</Text>
        {/* Add functionality related to changing password here */}
      </View>
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Privacy Settings</Text>
        {/* Add functionality related to privacy settings here */}
      </View>
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Email Preferences</Text>
        {/* Add functionality related to email preferences here */}
      </View>
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Linked Accounts</Text>
        {/* Add functionality related to linked accounts here */}
      </View>
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Account Deactivation/Deletion</Text>
        {/* Add functionality related to account deactivation/deletion here */}
      </View>
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Security Settings</Text>
        {/* Add functionality related to security settings here */}
      </View>
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Subscription Management</Text>
        {/* Add functionality related to subscription management here */}
      </View>
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Activity Log</Text>
        {/* Add functionality related to activity log here */}
      </View>
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Help & Support</Text>
        {/* Add functionality related to help & support here */}
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
  section: {
    marginBottom: 20,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 10,
  },
});

export default AccountsCenterScreen;
