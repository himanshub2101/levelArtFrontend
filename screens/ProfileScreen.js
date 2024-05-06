import React, { useEffect, useState, useContext } from "react";
import {
  StyleSheet,
  View,
  Text,
  Image,
  TouchableOpacity,
  SafeAreaView,
} from "react-native";
import { useNavigation } from "@react-navigation/native";
import { UserType } from "../UserContext";
import Icon from "react-native-vector-icons/Ionicons";
import { createMaterialTopTabNavigator } from "@react-navigation/material-top-tabs";
import axios from "axios";
import AsyncStorage from "@react-native-async-storage/async-storage";
import ImagesScreen from "./ImagesScreen";
import TweetsScreen from "./TweetsScreen";
import {
  MaterialCommunityIcons,
  AntDesign,
  MaterialIcons,
} from "@expo/vector-icons";
import * as ImagePicker from "expo-image-picker";

const Tab = createMaterialTopTabNavigator();

const ImagesTabScreen = ({ posts }) => <ImagesScreen posts={posts} />;
const TweetsTabScreen = ({ posts }) => <TweetsScreen posts={posts} />;
const TagTabScreen = ({ posts }) => <TweetsScreen posts={posts} />;

const ProfileScreen = () => {
  const navigation = useNavigation();
  const { userId, setUserId } = useContext(UserType);
  const [userProfile, setUserProfile] = useState(null);
  const [followers, setFollowers] = useState(0);
  const [followings, setFollowings] = useState(0);
  const [posts, setPosts] = useState([]);
  const [bio, setBio] = useState("");
  const [image, setImage] = useState("");
  const [isImageSelected, setIsImageSelected] = useState(false);

  const handleImagePicker = async () => {
    const permissionResult =
      await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (permissionResult.granted === false) {
      alert("Permission to access camera roll is required!");
      return;
    }

    const pickerResult = await ImagePicker.launchImageLibraryAsync();
    if (!pickerResult.canceled && pickerResult.assets.length > 0) {
      console.log("Selected image URI:", pickerResult.assets[0].uri);
      setImage(pickerResult.assets[0].uri);
      setIsImageSelected(true);
    } else {
      console.log("Image picking cancelled or no image selected");
    }
  };

  useEffect(() => {
    const fetchProfile = async (userId) => {
      try {
        const authToken = await AsyncStorage.getItem("authToken");
        const GetUser = await axios.get(
          `https://levelart.up.railway.app/users/${userId}`,
          {
            headers: {
              Authorization: `Bearer ${authToken}`,
            },
          }
        );
        setUserProfile(GetUser.data);

        const profileResponse = await axios.get(
          `https://levelart.up.railway.app/followers/${userId}/followers`,
          {
            headers: {
              Authorization: `Bearer ${authToken}`,
            },
          }
        );

        if (profileResponse) {
          const { user, followers, followings, bio } = profileResponse.data;
          // Corrected setUser function
          setUserProfile(user);
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

          if (postsResponse) {
            setPosts(postsResponse.data);
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

  useEffect(() => {
    const loadUserProfile = async () => {
      try {
        const authToken = await AsyncStorage.getItem("authToken");
        const GetUserResponse = await axios.get(
          `https://levelart.up.railway.app/users/${userId}`,
          {
            headers: {
              Authorization: `Bearer ${authToken}`,
            },
          }
        );
        const userObject = GetUserResponse.data;
        setUserProfile(userObject);
  
        // Extract username from the userObject
        const usernameOfCurrentUser = userObject?.username;
        console.log("Username of current user:", usernameOfCurrentUser);
  
        // Set header options
        navigation.setOptions({
          headerTitle: "",
          headerLeft: () => (
            <Text style={{ marginLeft: 10, fontWeight: "500", fontSize: 18 }}>
              {usernameOfCurrentUser || "Loading..."}
            </Text>
          ),
          headerRight: () => (
            <TouchableOpacity
              style={styles.settingsIcon}
              onPress={() => navigation.navigate("Settings")}
            >
              <Icon name="settings-outline" size={30} color="#333" />
            </TouchableOpacity>
          ),
        });
      } catch (error) {
        console.error("Error fetching profile:", error);
      }
    };
  
    if (userId) {
      loadUserProfile();
    } else {
      console.log("userId is undefined");
    }
  }, [userProfile, navigation]);
  

  return (
    <>
      <SafeAreaView style={styles.container}>
        <View style={styles.profileTop}>
          <View style={styles.userInfo}>
            <TouchableOpacity
              onPress={handleImagePicker}
              style={{ position: "relative" }}
            >
              {userProfile?.profilePic ? (
                <Image
                  style={styles.profileImage}
                  source={{ uri: userProfile?.profilePic }}
                />
              ) : (
                <Image
                  style={styles.profileImage}
                  source={{
                    uri: "https://cdn-icons-png.flaticon.com/128/149/149071.png",
                  }}
                />
              )}

              <TouchableOpacity
                onPress={handleImagePicker}
                style={{ position: "absolute", bottom: -3, right: -3 }}
              >
                <AntDesign name="pluscircle" size={24} color="blue" />
              </TouchableOpacity>
            </TouchableOpacity>
            <View style={styles.userStats}>
              <View style={styles.userStatsItem}>
                <Text style={styles.statsCount}>{posts.length}</Text>
                <Text style={styles.statsText}> posts</Text>
              </View>
              <View style={styles.userStatsItem}>
                <Text style={styles.statsCount}>{followers}</Text>
                <Text style={styles.statsText}> followers</Text>
              </View>
              <View style={styles.userStatsItem}>
                <Text style={styles.statsCount}>{followings} </Text>
                <Text style={styles.statsText}>following</Text>
              </View>
            </View>
          </View>
        </View>

        <View style={styles.profileInfo}>
          <View style={styles.bioContainer}>
            <View style={styles.bioTextContainer}>
              <View style={{ flexDirection: "row", gap: 20 }}>
                {userProfile && userProfile?.fullname ? (
                  <Text style={styles.bioLabel}>{userProfile?.fullname}</Text>
                ) : (
                  <Text style={styles.bioLabel}>Full Name</Text>
                )}
                {userProfile && userProfile?.pronouns ? (
                  <Text>{userProfile?.pronouns}</Text>
                ) : null}
              </View>
              {userProfile && userProfile?.bio ? (
                <View>
                  <Text>{userProfile?.bio}</Text>
                </View>
              ) : null}

              <TouchableOpacity
                style={styles.updateBioButton}
                onPress={() => navigation.navigate("EditProfile")}
              >
                <Text style={styles.updateBioButtonText}>Edit Profile</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>

        <Tab.Navigator>
          <Tab.Screen
            name="Posts"
            options={{
              tabBarIcon: ({ color, size }) => (
                <MaterialCommunityIcons name="grid" size={24} color="black" />
              ),
            }}
          >
            {() => <ImagesTabScreen posts={posts.filter((post) => post.img)} />}
          </Tab.Screen>
          <Tab.Screen
            name="Tweets"
            options={{
              tabBarIcon: ({ color, size }) => (
                <MaterialCommunityIcons
                  name="message-text"
                  size={24}
                  color="black"
                />
              ),
            }}
          >
            {() => <TweetsTabScreen posts={posts.filter((post) => !post.img)} />}
          </Tab.Screen>
          <Tab.Screen
            name="Tag"
            options={{
              tabBarIcon: ({ color, size }) => (
                <MaterialIcons name="tag" size={24} color="black" />
              ),
            }}
          >
            {() => <TagTabScreen posts={posts.filter((post) => !post.img)} />}
          </Tab.Screen>
        </Tab.Navigator>
      </SafeAreaView>
    </>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "white",
  },
  profileTop: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 10,
    paddingVertical: 10,
  },
  settingsIcon: {
    marginRight: 10,
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
    width: 80,
    height: 80,
    borderRadius: 50,
    resizeMode: "cover",
  },
  bioTextContainer: {
    flex: 1,
    alignItems: "flex-start",
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
    marginTop: 8,
  },
  updateBioButtonText: {
    color: "white",
    fontWeight: "bold",
  },
  userInfo: {
    flexDirection: "row",
    flex: 1,
  },
  userStats: {
    marginLeft: 20,
    flexDirection: "row",
    flex: 1,
    justifyContent: "space-evenly",
    alignItems: "center",
  },
  userStatsItem: {
    alignItems: "center",
  },

  statsText: {
    fontSize: 14,
    fontWeight: "500",
  },
  statsCount: {
    fontWeight: "bold",
    fontSize: 22,
  },
});

export default ProfileScreen;