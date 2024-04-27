<<<<<<< HEAD
import React from 'react';
import { View, Button, StyleSheet } from 'react-native';
=======
import { StyleSheet, Text, View } from "react-native";
import React, { useEffect, useState } from "react";
import { NavigationContainer } from "@react-navigation/native";
import LoginScreen from "./screens/LoginScreen";
import RegisterScreen from "./screens/RegisterScreen";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import HomeScreen from "./screens/HomeScreen";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { Entypo } from "@expo/vector-icons";
import { AntDesign } from "@expo/vector-icons";
import ThreadsScreen from "./screens/ThreadsScreen";
import { Ionicons } from "@expo/vector-icons";
import ActivityScreen from "./screens/ActivityScreen";
import ProfileScreen from "./screens/ProfileScreen";
import AsyncStorage from "@react-native-async-storage/async-storage"; // Import AsyncStorage
import SettingsScreen from "./screens/SettingsScreen";
import AccountsCenterScreen from "./screens/AccountCenter";
import SearchScreen from "./screens/SearchScreen";
import ArtistForm from "./components/forms/artist"
import ProductionForm from "./components/forms/production"
import VisitorsForm from "./components/forms/visitors"
import ImagesScreen from "./screens/ImagesScreen";
import TweetsScreen from "./screens/TweetsScreen";
>>>>>>> 94bfc2da6ed82b8ba3b550f6e237fad1927194fb

const HomeScreen1 = ({ navigation }) => {
  return (
    <View style={styles.container}>
      <View style={styles.buttonContainer}>
        <Button
          title="Artist"
          onPress={() => navigation.navigate('Artist')}
          color="black" // Set button color to black
          style={styles.button} // Apply custom button styles
        />
      </View>
      <View style={styles.space} /> {/* Add space */}
      <View style={styles.buttonContainer}>
        <Button
          title="Visitors"
          onPress={() => navigation.navigate('Visitors')}
          color="black" // Set button color to black
          style={styles.button} // Apply custom button styles
        />
      </View>
      <View style={styles.space} /> {/* Add space */}
      <View style={styles.buttonContainer}>
        <Button
          title="Production"
          onPress={() => navigation.navigate('Production')}
          color="black" // Set button color to black
          style={styles.button} // Apply custom button styles
        />
<<<<<<< HEAD
      </View>
    </View>
=======
        
        <Stack.Screen
          name="Main"
          component={BottomTabs}
          options={{ headerShown: false }}
        />

<Stack.Screen
          name="Settings"
          component={SettingsScreen}
          options={{ headerShown: false }}
        />

<Stack.Screen
          name="AccountsCenter"
          component={AccountsCenterScreen}
          options={{ headerShown: false }}
        />

{/* <Stack.Screen
          name="ImageScreen"
          component={ImagesScreen}
          options={{ headerShown: false }}
        />
<Stack.Screen
          name="TweetsScreen"
          component={TweetsScreen}
          options={{ headerShown: false }}
        /> */}
      </Stack.Navigator>
    </NavigationContainer>
>>>>>>> 94bfc2da6ed82b8ba3b550f6e237fad1927194fb
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  buttonContainer: {
    width: '30%', // Set the width of the button container to 80% of the screen width
    borderRadius: 10, // Add border radius to create rounded corners
    overflow: 'hidden', // Hide overflow to ensure border radius is applied correctly
    marginBottom: 10, // Add margin bottom to the button container for spacing
  },
  button: {
    flex: 1, // Set button to flex 1 to fill the container
  },
  space: {
    height: 10, // Set the height of the space between buttons
  },
});

export default HomeScreen1;
