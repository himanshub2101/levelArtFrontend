import React from 'react';
import { Image, TouchableOpacity } from 'react-native';
import { createMaterialTopTabNavigator } from '@react-navigation/material-top-tabs';
import ForYouScreen from './ForYouScreen';
import FollowingScreen from './FollowingsScreen';
import logo from '../assets/logo.png'; // Import your logo image

const Tab = createMaterialTopTabNavigator();

const HomeScreen = ({ navigation }) => {
  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        tabBarLabelStyle: { fontWeight: 'bold' },
        tabBarIndicatorStyle: { backgroundColor: '#007AFF' },
        tabBarStyle: { backgroundColor: '#fff' },
        headerStyle: { backgroundColor: '#fff' }, // Customize header style
        headerTitle: () => (
          <Image source={logo} style={{ width: 120, height: 40 }} resizeMode="contain" />
        ),
        headerRight: () => (
          <TouchableOpacity onPress={() => navigation.navigate('Chat')}>
            <Ionicons name="chatbubble-outline" size={24} color="black" />
          </TouchableOpacity>
        ),
      })}
    >
      <Tab.Screen name="For You" component={ForYouScreen} />
      <Tab.Screen name="Following" component={FollowingScreen} />
    </Tab.Navigator>
  );
};

export default HomeScreen;
