import React, { useEffect, useState, useContext } from "react";
import { StyleSheet, View, ScrollView, Text, TextInput, Button, Image, TouchableOpacity } from "react-native";
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

        const profileResponse = await axios.get(`https://levelart.up.railway.app/followers/${userId}/followers`, {
          headers: {
            Authorization: `Bearer ${authToken}`,
          },
        }).catch((error) => {
          console.error("Error fetching profile:", error);
        });

        if (profileResponse) {
          const { user, followers, followings, bio } = profileResponse.data;
          setUser(user);
          setFollowers(followers?.length || 0);
          setFollowings(followings?.length || 0);
          setBio(bio || "");

          const postsResponse = await axios.get(`https://levelart.up.railway.app/posts/user/${userId}`, {
            headers: {
              Authorization: `Bearer ${authToken}`,
            },
          }).catch((error) => {
            console.error("Error fetching posts:", error);
          });

          if (postsResponse) {
            setPosts(postsResponse.data);
          }

          const repliesResponse = await axios.get(`https://levelart.up.railway.app/posts/user/${userId}/replies`, {
            headers: {
              Authorization: `Bearer ${authToken}`,
            },
          }).catch((error) => {
            console.error("Error fetching replies:", error);
          });

          if (repliesResponse) {
            setReplies(repliesResponse.data);
          }
        }
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
      <ScrollView>
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
              <View style={styles.statsContainer}>
                <Text style={styles.statsText}>{posts.length} posts</Text>
                <Text style={styles.statsText}>{followers} followers</Text>
                <Text style={styles.statsText}>{followings} following</Text>
              </View>
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
              <TouchableOpacity style={styles.updateBioButton} onPress={updateBio}>
                <Text style={styles.updateBioButtonText}>Update Bio</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>

        {/* Render the Tab.Navigator outside the ScrollView */}
        <Tab.Navigator>
          <Tab.Screen name="Posts" component={() => <ImagesScreen posts={imagePosts} />} />
          <Tab.Screen name="Tweets" component={() => <TweetsScreen posts={tweetPosts} />} />
        </Tab.Navigator>

        <View style={styles.buttonsContainer}>
          <TouchableOpacity style={styles.button} onPress={logout}>
            <Text style={styles.buttonText}>Logout</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 10,
    backgroundColor: 'white',
  },
  profileHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 20,
    paddingHorizontal: 15,
    backgroundColor: 'white',
  },
  username: {
    fontSize: 20,
    fontWeight: "bold",
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
    alignItems: 'flex-start',
    padding: 10,
  },
  bioLabel: {
    fontWeight: "bold",
    marginBottom: 5,
  },
  updateBioButton: {
    backgroundColor: "black",
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 5,
  },
  updateBioButtonText: {
    color: "white",
    fontWeight: "bold",
  },
  buttonsContainer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    marginTop: 20,
  },
  button: {
    backgroundColor: "red",
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 5,
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
    marginLeft: 20,
  },
  statsContainer: {
    flexDirection: "row",
    marginTop: 5,
  },
  statsText: {
    marginRight: 10,
  },
});

export default ProfileScreen;
