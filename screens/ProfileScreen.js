import React, { useEffect, useState, useContext } from "react";
import { StyleSheet, Text, View, Image, Pressable, FlatList, Dimensions, Button, TextInput } from "react-native";
import axios from "axios";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useNavigation } from "@react-navigation/native";
import { UserType } from '../UserContext';
import Icon from 'react-native-vector-icons/Ionicons';
import { createMaterialTopTabNavigator } from '@react-navigation/material-top-tabs';

const Tab = createMaterialTopTabNavigator();

const TweetsScreen = ({ posts }) => {
  const renderPostItem = ({ item }) => (
    <View style={styles.postWrapper}>
      <Text style={styles.postText}>{item.text}</Text>
    </View>
  );

  return (
    <View style={styles.container}>
      <FlatList
        data={posts}
        renderItem={renderPostItem}
        keyExtractor={(item) => item._id}
        contentContainerStyle={styles.postsList}
        numColumns={3} // Adjust the number of columns
      />
    </View>
  );
};

const ImagesScreen = ({ posts }) => {
  const renderPostItem = ({ item }) => (
    <View style={styles.postWrapper}>
      <Image
        style={styles.postImage}
        source={{
          uri: item.img || "https://via.placeholder.com/150",
        }}
      />
    </View>
  );

  return (
    <View style={styles.container}>
      <FlatList
        data={posts}
        renderItem={renderPostItem}
        keyExtractor={(item) => item._id}
        contentContainerStyle={styles.postsList}
        numColumns={3} // Adjust the number of columns
      />
    </View>
  );
};

const ProfileScreen = () => {
  const [user, setUser] = useState("");
  const [followers, setFollowers] = useState(0);
  const [followings, setFollowings] = useState(0);
  const [posts, setPosts] = useState([]);
  const [replies, setReplies] = useState([]);
  const [bio, setBio] = useState("");
  const navigation = useNavigation();
  const { userId, setUserId } = useContext(UserType);

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
        setPosts(posts?.length || 0);
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

  return (
    <View style={styles.container}>
      <View style={styles.profileHeader}>
        <View style={styles.headerLeft}>
          <Image
            style={styles.profileImage}
            source={{
              uri: "https://cdn-icons-png.flaticon.com/128/149/149071.png",
            }}
          />
          <View style={styles.headerInfo}>
            <Text style={styles.username}>{user}</Text>
            <Text style={styles.userId}>{userId}</Text>
          </View>
        </View>
        <Pressable style={styles.settingsIcon} onPress={handleSettingsPress}>
          <Icon name="settings-outline" size={30} color="#333" />
        </Pressable>
      </View>
      <View style={styles.profileCounts}>
        <Text style={styles.postsText}>{posts} posts</Text>
        <Text style={styles.followText}>{followers} followers</Text>
        <Text style={styles.followText}>{followings} following</Text>
      </View>
      <View style={styles.bioTextContainer}>
        <Text style={styles.bioText}>{bio}</Text>
        <TextInput
          style={styles.bioInput}
          placeholder="Edit bio"
          onChangeText={setBio}
          value={bio}
        />
        <Button title="Update Bio" onPress={updateBio} color="#black" />
      </View>
      <Tab.Navigator>
        <Tab.Screen name="Images">
          {() => <ImagesScreen posts={posts} />}
        </Tab.Screen>
        <Tab.Screen name="Tweets">
          {() => <TweetsScreen posts={posts} />}
        </Tab.Screen>
      </Tab.Navigator>
      <View style={styles.logoutContainer}>
        <Button title="Logout" onPress={logout} color="black" />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  profileHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderBottomWidth: 1,
    borderBottomColor: "#ccc",
  },
  headerLeft: {
    flexDirection: "row",
    alignItems: "center",
  },
  headerInfo: {
    marginLeft: 10,
  },
  username: {
    fontSize: 18,
    fontWeight: "bold",
  },
  userId: {
    fontSize: 14,
    color: "gray",
  },
  profileImage: {
    width: 80,
    height: 80,
    borderRadius: 40,
  },
  settingsIcon: {
    padding: 5,
  },
  profileCounts: {
    flexDirection: "row",
    justifyContent: "space-around",
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: "#ccc",
  },
  postsText: {
    fontWeight: "bold",
  },
  followText: {
    color: "gray",
  },
  bioTextContainer: {
    padding: 20,
    borderBottomWidth: 1,
    borderBottomColor: "#ccc",
  },
  bioText: {
    marginBottom: 10,
  },
  bioInput: {
    marginBottom: 10,
    borderWidth: 1,
    borderColor: "#ccc",
    padding: 5,
  },
  logoutContainer: {
    padding: 20,
  },
  postsList: {
    flexGrow: 1,
    paddingVertical: 10,
  },
  postWrapper: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    margin: 2,
  },
  postText: {
    fontSize: 16,
  },
  postImage: {
    width: Dimensions.get("window").width / 3 - 4,
    height: Dimensions.get("window").width / 3 - 4,
    resizeMode: "cover",
  },
});

export default ProfileScreen;
