import React, { useEffect, useState, useContext } from "react";
import { StyleSheet, Text, View, Image, Pressable, FlatList, ScrollView } from "react-native";
import axios from "axios";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useNavigation } from "@react-navigation/native";
import { createContext } from 'react';
import { UserType } from '../UserContext';
import Icon from 'react-native-vector-icons/Ionicons';
import Sidebar from "./SideBar";
const ProfileScreen = () => {
  const [user, setUser] = useState("");
  const [followers, setFollowers] = useState(0);
  const [followings, setFollowings] = useState(0);
  const [posts, setPosts] = useState([]);
  const [replies, setReplies] = useState([]);
  const navigation = useNavigation();
  const { userId, setUserId } = useContext(UserType);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  useEffect(() => {
    const fetchProfile = async (userId) => {
      try {
        // Get the authentication token from AsyncStorage
        const authToken = await AsyncStorage.getItem("authToken");
        console.log("Auth Token From Profile:", authToken);

        // Make a GET request to fetch profile information
        const profileResponse = await axios.get(
          `https://levelart.up.railway.app/followers/${userId}/followers`,
          {
            headers: {
              Authorization: `Bearer ${authToken}`,
            },
          }
        );

        const { user, followers, followings } = profileResponse.data;
        setUser(user);
        setFollowers(followers?.length || 0);
        setFollowings(followings?.length || 0);

        // Fetch user posts
        const postsResponse = await axios.get(
          `https://levelart.up.railway.app/posts/user/${userId}`,
          {
            headers: {
              Authorization: `Bearer ${authToken}`,
            },
          }
        );
        setPosts(postsResponse.data);

        // Fetch user replies
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

  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  const closeSidebar = () => {
    setIsSidebarOpen(false);
  };

  const renderPostItem = ({ item }) => (
    <View style={styles.postContainer}>
      <Image
        style={styles.postImage}
        source={{
          uri: item.img || "https://via.placeholder.com/150",
        }}
      />
      <View style={styles.postContent}>
        <Text style={styles.postText}>{item.text}</Text>
      </View>
    </View>
  );

  const renderReplyItem = ({ item }) => (
    <View style={styles.replyContainer}>
      <Text>{item.text}</Text>
    </View>
  );

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <View style={styles.profileInfo}>
      <View style={styles.profileHeader}>
        <Text style={styles.username}>{user}</Text>
        <Pressable style={styles.settingsIcon} onPress={handleSettingsPress}>
        <Icon name="settings-outline" size={30} color="#333" />
      </Pressable>
      </View>
           {/* Sidebar */}

        <View style={styles.bioContainer}>
          <Image
            style={styles.profileImage}
            source={{
              uri: "https://cdn-icons-png.flaticon.com/128/149/149071.png",
            }}
          />
          <View style={styles.bioTextContainer}>
            <Text style={styles.bioText}>BTech.</Text>
            <Text style={styles.bioText}>Movie Buff | Musical Nerd</Text>
            <Text style={styles.bioText}>Love Yourself</Text>
          </View>
        </View>

        <Text style={styles.followText}>{followers} followers</Text>
        <Text style={styles.followText}>{followings} followings</Text>
      </View>

      <FlatList
        data={posts}
        renderItem={renderPostItem}
        keyExtractor={(item) => item._id}
        style={styles.postsList}
      />

      {/* Post Replies Section */}
      <View style={styles.repliesSection}>
        <Text style={styles.sectionTitle}>Post Replies</Text>
        <FlatList
          data={replies}
          renderItem={renderReplyItem}
          keyExtractor={(item) => item._id}
          style={styles.repliesList}
        />
      </View>

      <View style={styles.buttonsContainer}>
        <Pressable style={styles.button} onPress={logout}>
          <Text style={styles.buttonText}>Logout</Text>
        </Pressable>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    padding: 15,
  },
  profileInfo: {
    marginBottom: 20,
  },
  profileHeader: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 10,
  },
  username: {
    fontSize: 20,
    fontWeight: "bold",
  },
  bioContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 10,
  },
  profileImage: {
    width: 60,
    height: 60,
    borderRadius: 30,
    resizeMode: "contain",
  },
  bioTextContainer: {
    marginLeft: 10,
  },
  bioText: {
    fontSize: 15,
    fontWeight: "400",
  },
  followText: {
    color: "gray",
    fontSize: 15,
  },
  postsList: {
    marginBottom: 20,
  },
  postContainer: {
    flexDirection: "row",
    marginBottom: 10,
  },
  postImage: {
    width: 50,
    height: 50,
    borderRadius: 25,
    marginRight: 10,
  },
  postContent: {
    flex: 1,
  },
  postText: {
    fontSize: 16,
  },
  repliesSection: {
    marginBottom: 20,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 10,
  },
  repliesList: {
    marginBottom: 20,
  },
  replyContainer: {
    padding: 10,
    backgroundColor: "#F5F5F5",
    marginBottom: 10,
  },
  buttonsContainer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
  },
  button: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 10,
    borderColor: "#D0D0D0",
    borderWidth: 1,
    borderRadius: 5,
  },
  buttonText: {
    fontSize: 15,
  },
  settingsIcon: {
    marginLeft: 'auto',
  },
});

export default ProfileScreen;
