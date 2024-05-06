import React, { useEffect, useState, useContext } from "react";
import {
  StyleSheet,
  View,
  ScrollView,
  Text,
  TextInput,
  Button,
  Image,
  TouchableOpacity,
  Modal,
  SafeAreaView,
} from "react-native";
import { useNavigation } from "@react-navigation/native";
import { UserType } from "../UserContext";
import Icon from "react-native-vector-icons/Ionicons";
import { createMaterialTopTabNavigator } from "@react-navigation/material-top-tabs";
import axios from "axios";
import AsyncStorage from "@react-native-async-storage/async-storage";
import ImagesScreen from "./ImagesScreen"; // Import the ImagesScreen component
import TweetsScreen from "./TweetsScreen"; // Import the TweetsScreen component
import {
  MaterialCommunityIcons,
  AntDesign,
  MaterialIcons,
} from "@expo/vector-icons";
import * as ImagePicker from "expo-image-picker";
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
  const [userProfile, setUserProfile] = useState(null);
  const PostsComponent = () => <ImagesScreen posts={imagePosts} />;
  const TweetsComponent = () => <TweetsScreen posts={tweetPosts} />;
  const TagComponent = () => <TweetsScreen posts={tweetPosts} />;


  const handleImagePicker = async () => {
    const permissionResult =
      await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (permissionResult.granted === false) {
      alert("Permission to access camera roll is required!");
      return;
    }

    const pickerResult = await ImagePicker.launchImageLibraryAsync();
    if (!pickerResult.canceled && pickerResult.assets.length > 0) {
      console.log("Selected image URI:", pickerResult.assets[0].uri); // Log the URI of the selected image

      setUserProfile(prevProfile => ({
        ...prevProfile,
        profilePic: pickerResult.assets[0].uri
      }));
      try {
        const authToken = await AsyncStorage.getItem("authToken");
        
        // Define the request body with the updated profilePic
        const requestBody = {
          profilePic: pickerResult.assets[0].uri
        };
  
        // Make a PUT request to update the profilePic
        const updateUserProfileResponse = await axios.put(
          `https://levelart.up.railway.app/users/${userId}`,
          requestBody,
          {
            headers: {
              Authorization: `Bearer ${authToken}`,
            },
          }
        );
  
        console.log("Update profile response:", updateUserProfileResponse.data);
      } catch (error) {
        console.error("Error updating profile:", error);
      }
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
        console.log("profile fetch", userProfile);
        //Fetch followers
        const followerResponse = await axios
          .get(
            `https://levelart.up.railway.app/followers/${userId}/followers`,
            {
              headers: {
                Authorization: `Bearer ${authToken}`,
              },
            }

          )
          .catch((error) => {
            console.error("Error fetching profile:", error);
          });

          console.log("followers",followerResponse.data)
          if (followerResponse) {
            // const { user, followers, followings, bio } = followerResponse.data;
            // setUser(user);
            // setFollowers(followers?.length || 0);
            // setFollowings(followings?.length || 0);
            // setBio(bio || "");

          const postsResponse = await axios
            .get(`https://levelart.up.railway.app/posts/user/${userId}`, {
              headers: {
                Authorization: `Bearer ${authToken}`,
              },
            })
            .catch((error) => {
              console.error("Error fetching posts:", error);
            });

          if (postsResponse) {
            setPosts(postsResponse.data);
            console.log("post user", postsResponse.data);
          }

          // const repliesResponse = await axios
          //   .get(
          //     `https://levelart.up.railway.app/posts/user/${userId}/replies`,
          //     {
          //       headers: {
          //         Authorization: `Bearer ${authToken}`,
          //       },
          //     }
          //   )
          //   .catch((error) => {
          //     console.error("Error fetching replies:", error);
          //   });

          // if (repliesResponse) {
          //   setReplies(repliesResponse.data);
          // }
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

  // Filter posts based on whether they contain images
  const imagePosts = posts.filter((post) => post.img); // Filter posts with images
  const tweetPosts = posts.filter((post) => !post.img); // Filter posts without images

  useEffect(() => {
    navigation.setOptions({
      headerTitle: "",
      headerLeft: () => (
        <Text style={{ marginLeft: 10, fontWeight: 500, fontSize: 18 }}>
          {userProfile?.username || "Loading..."}
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
  }, [userProfile]);
  

  return (
    <>
      <SafeAreaView style={styles.container}>
        {/* <ScrollView> */}
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
              {/* <Text style={styles.username}>{user}</Text> */}

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

        {/* Render the Tab.Navigator outside the ScrollView */}

<Tab.Navigator>
<Tab.Screen
  name="Posts"
  component={PostsComponent}
  options={{
    tabBarIcon: ({ color, size }) => (
      <MaterialCommunityIcons name="grid" size={24} color="black" />
    ),
  }}
/>
<Tab.Screen
  name="Tweets"
  component={TweetsComponent}
  options={{
    tabBarIcon: ({ color, size }) => (
      <MaterialCommunityIcons
        name="message-text"
        size={24}
        color="black"
      />
    ),
  }}
/>
<Tab.Screen
  name="Tag"
  component={TagComponent}
  options={{
    tabBarIcon: ({ color, size }) => (
      <MaterialIcons name="tag" size={24} color="black" />
    ),
  }}
/>
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
  profileHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 16,
    paddingTop: 35,
    paddingBottom: 4,
    // borderBottomWidth:1,
    // borderBottomColor:"#e0e0e0",
    zIndex: 10,
    backgroundColor: "#fff",
  },
  profileTop: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 10,
    paddingVertical: 10,
  },
  username: {
    fontSize: 20,
    fontWeight: "bold",
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
