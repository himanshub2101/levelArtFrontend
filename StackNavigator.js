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


const   StackNavigator = () => {
  const Stack = createNativeStackNavigator();
  const Tab = createBottomTabNavigator();
  
  function BottomTabs({route }) {
    const [authToken, setAuthToken] = useState(null);

    useEffect(() => {
      const getAuthToken = async () => {
        try {
          const token = await AsyncStorage.getItem("authToken", token) ;
          console.log("token:", token)
          setAuthToken(token);
        } catch (error) {
          console.log("Error retrieving authToken from AsyncStorage:", error);
        }
      };
  
      getAuthToken();
    }, []);
    return (
      <Tab.Navigator>
        <Tab.Screen
          name="Home"
          component={HomeScreen}
          options={{
            tabBarLabel: "Home",
            tabBarLabelStyle: { color: "black" },
            headerShown: false,
            tabBarIcon: ({ focused }) =>
              focused ? (
                <Entypo name="home" size={24} color="black" />
              ) : (
                <AntDesign name="home" size={24} color="black" />
              ),
          }}
        />
<Tab.Screen
  name="Search"
  component={SearchScreen}
  options={{
    tabBarLabel: "Search",
    tabBarLabelStyle: { color: "black" },
    headerShown: false,
    tabBarIcon: ({ focused }) => (
      focused ? (
        <Ionicons name="search" size={24} color="black" />
      ) : (
        <Ionicons name="search-outline" size={24} color="black" />
      )
    ),
  }}
/>
        <Tab.Screen
          name="Thread"
          component={ThreadsScreen}
          options={{
            tabBarLabel: "Create",
            tabBarLabelStyle: { color: "black" },
            headerShown: false,
            tabBarIcon: ({ focused }) =>
              focused ? (
                <Ionicons name="create" size={24} color="black" />
              ) : (
                <Ionicons name="create-outline" size={24} color="black" />
              ),
          }}
        />

        <Tab.Screen
          name="Activity"
          component={ActivityScreen}
          options={{
            tabBarLabel: "Activity",
            tabBarLabelStyle: { color: "black" },
            headerShown: false,
            tabBarIcon: ({ focused }) =>
              focused ? (
                <AntDesign name="heart" size={24} color="black" />
              ) : (
                <AntDesign name="hearto" size={24} color="black" />
              ),
          }}
        />

        <Tab.Screen
          name="Profile"
          component={ProfileScreen}
          options={{
            tabBarLabel: "Profile",
            tabBarLabelStyle: { color: "black" },
            headerShown: false,
            tabBarIcon: ({ focused }) =>
              focused ? (
                <Ionicons name="person" size={24} color="black" />
              ) : (
                <Ionicons name="person-outline" size={24} color="black" />
              ),
          }}
        />
      </Tab.Navigator>
    );
  }
  return (
    <NavigationContainer>
      <Stack.Navigator>
   
        <Stack.Screen
          name="Login"
          component={LoginScreen}
          options={{ headerShown: false }}
        />
        <Stack.Screen
          name="Register"
          component={RegisterScreen}
          options={{ headerShown: false }}
        /> 
          <Stack.Screen
        name="Artist"
        component={ArtistForm}
        options={{ headerShown: false }}
      />
         <Stack.Screen
          name="Visitors"
          component={VisitorsForm}
          options={{ headerShown: false }}
        />
         <Stack.Screen
          name="Production"
          component={ProductionForm}
          options={{ headerShown: false }}
        />
        
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
  );
};

export default StackNavigator;

const styles = StyleSheet.create({});