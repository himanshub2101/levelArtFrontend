import React, { useEffect, useState, useContext } from "react";
import { StyleSheet, View, Text, TextInput, Button, Image, TouchableOpacity } from "react-native";
import { useNavigation } from "@react-navigation/native";
import { UserType } from '../UserContext';
import Icon from 'react-native-vector-icons/Ionicons';
import { createMaterialTopTabNavigator } from '@react-navigation/material-top-tabs';
import axios from "axios";
import AsyncStorage from "@react-native-async-storage/async-storage";
import ImagesScreen from './ImagesScreen'; // Import the ImagesScreen component
import TweetsScreen from './TweetsScreen'; // Import the TweetsScreen component

const Tab = createMaterialTopTabNavigator();

const ProfileScreen = () => {
  const navigation = useNavigation();
  const { userId, setUserId } = useContext(UserType);
  const [user, setUser] = useState("");
  const [followers, setFollowers] = useState(0);
  const [followings, setFollowings] = useState(0);
  const [posts, setPosts] = useState([]);
  const [replies, setReplies] = useState([]);
  const [bio, setBio] = useState("");

  useEffect(() => {
    const fetchProfile = async (userId) => {
      try {
        const authToken = await AsyncStorage.getItem("authToken");

        const profileResponse = await axios.get(
          `https://levelart.up.railway.app/followers/${userId}/followers`,
          {
            headers: {
              Authorization: `Bearer ${authToken}`,
            },
          }
        );

        const { user, followers, followings, bio } = profileResponse.data;
        setUser(user);
        setFollowers(followers?.length || 0);
        setFollowings(followings?.length || 0);
        setBio(bio || "");

        const postsResponse = await axios.get(
          `https://levelart.up.railway.app/posts/user/${userId}`,
          {
            headers: {
              Authorization: `Bearer ${authToken}`,
            },
          }
        );
        setPosts(postsResponse.data);

        const repliesResponse = await axios.get(
          `https://levelart.up.railway.app/posts/user/${userId}/replies`,
          {
            headers: {
              Authorization: `Bearer ${authToken}`,
            },
          }
        );
        setReplies(repliesResponse.data);
      } catch (error) {
        console.error("Error fetching profile:", error);
      }
    };

    if (userId) {
      fetchProfile(userId);
    } else {
      console.log("userId is undefined");
    }
  }, [userId]);

  const logout = async () => {
    try {
      await AsyncStorage.removeItem("authToken");
      console.log("Cleared auth token");
      navigation.replace("Login");
    } catch (error) {
      console.error("Error clearing auth token:", error);
    }
  };

  const handleSettingsPress = () => {
    navigation.navigate('Settings');
  };

  const updateBio = async () => {
    try {
      const authToken = await AsyncStorage.getItem("authToken");
      await axios.put(
        `https://levelart.up.railway.app/user/${userId}`,
        { bio },
        {
          headers: {
            Authorization: `Bearer ${authToken}`,
          },
        }
      );
      console.log("Bio updated successfully");
    } catch (error) {
      console.error("Error updating bio:", error);
    }
  };

  // Filter posts based on whether they contain images
  const imagePosts = posts.filter(post => post.img); // Filter posts with images
  const tweetPosts = posts.filter(post => !post.img); // Filter posts without images

  return (
    <View style={styles.container}>
      <View style={styles.profileHeader}>
        <View style={styles.userInfo}>
          <Image
            style={styles.profileImage}
            source={{
              uri: "https://cdn-icons-png.flaticon.com/128/149/149071.png",
            }}
          />
          <View style={styles.userStats}>
            <Text style={styles.username}>{user}</Text>
            <Text style={styles.userStatsText}>{posts.length} posts</Text>
            <Text style={styles.userStatsText}>{followers} followers</Text>
            <Text style={styles.userStatsText}>{followings} following</Text>
          </View>
        </View>
        <TouchableOpacity style={styles.settingsIcon} onPress={handleSettingsPress}>
          <Icon name="settings-outline" size={30} color="#333" />
        </TouchableOpacity>
      </View>

      <View style={styles.profileInfo}>
        <View style={styles.bioContainer}>
          <View style={styles.bioTextContainer}>
            <Text style={styles.bioLabel}>Bio:</Text>
            <TextInput
              style={styles.bioInput}
              placeholder="Edit bio"
              onChangeText={setBio}
              value={bio}
            />
            <Button title="Update Bio" onPress={updateBio} />
          </View>
        </View>
      </View>

      <Tab.Navigator>
        <Tab.Screen name="Images" component={() => <ImagesScreen posts={imagePosts} />} />
        <Tab.Screen name="Tweets" component={() => <TweetsScreen posts={tweetPosts} />} />
      </Tab.Navigator>

      <View style={styles.buttonsContainer}>
        <TouchableOpacity style={styles.button} onPress={logout}>
          <Text style={styles.buttonText}>Logout</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 10,
  },
  profileHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 10,
    paddingHorizontal: 15,
  },
  username: {
    fontSize: 20,
    fontWeight: "bold",
  },
  userId: {
    fontSize: 16,
    color: "gray",
  },
  settingsIcon: {
    marginLeft: 'auto',
  },
  profileInfo: {
    flexDirection: "column",
    marginBottom: 20,
  },
  bioContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 10,
  },
  profileImage: {
    width: 100,
    height: 100,
    borderRadius: 50,
    resizeMode: "cover",
  },
  bioTextContainer: {
    flex: 1,
    marginLeft: 10,
  },
  bioLabel: {
    fontWeight: "bold",
    marginBottom: 5,
  },
  bioInput: {
    marginBottom: 10,
    padding: 8,
    borderWidth: 1,
    borderColor: "gray",
    borderRadius: 5,
  },
  buttonsContainer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    marginTop: 10,
  },
  button: {
    padding: 10,
    borderWidth: 1,
    borderRadius: 5,
    backgroundColor: "black",
  },
  buttonText: {
    color: "white",
    fontWeight: "bold",
  },
  userInfo: {
    flexDirection: "row",
    alignItems: "center",
  },
  userStats: {
    marginLeft: 10,
  },
  userStatsText: {
    color: "gray",
    fontSize: 15,
  },
});

export default ProfileScreen;
