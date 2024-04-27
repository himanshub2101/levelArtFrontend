// import React, { useEffect, useState, useContext } from "react";
// import { StyleSheet, Text, View, Image, Pressable, FlatList, ScrollView, Dimensions } from "react-native";
// import axios from "axios";
// import AsyncStorage from "@react-native-async-storage/async-storage";
// import { useNavigation } from "@react-navigation/native";
// import { UserType } from '../UserContext';
// import Icon from 'react-native-vector-icons/Ionicons';
// import { createMaterialTopTabNavigator } from '@react-navigation/material-top-tabs';

// // const Tab = createMaterialTopTabNavigator();

// // const TweetsScreen = ({ posts }) => {
// //   const renderPostItem = ({ item }) => (
// //     <View style={styles.postWrapper}>
// //       <Text style={styles.postText}>{item.text}</Text>
// //     </View>
// //   );

// //   return (
// //     <View style={styles.container}>
// //       <FlatList
// //         data={posts}
// //         renderItem={renderPostItem}
// //         keyExtractor={(item) => item._id}
// //         contentContainerStyle={styles.postsList}
// //         numColumns={3} // Adjust the number of columns
// //       />
// //     </View>
// //   );
// // };

// // // const ImagesScreen = ({ posts }) => {
// // //   const renderPostItem = ({ item }) => (
// // //     <View style={styles.postWrapper}>
// // //       <Image
// // //         style={styles.postImage}
// // //         source={{
// // //           uri: item.img || "https://via.placeholder.com/150",
// // //         }}
// // //       />
// // //     </View>
// // //   );

// // //   return (
// // //     <View style={styles.container}>
// // //       <FlatList
// // //         data={posts}
// // //         renderItem={renderPostItem}
// // //         keyExtractor={(item) => item._id}
// // //         contentContainerStyle={styles.postsList}
// // //         numColumns={3} // Adjust the number of columns
// // //       />
// // //     </View>
// // //   );
// // // };

// // const ProfileScreen = () => {
// //   const [user, setUser] = useState("");
// //   const [followers, setFollowers] = useState(0);
// //   const [followings, setFollowings] = useState(0);
// //   const [posts, setPosts] = useState([]);
// //   const [replies, setReplies] = useState([]);
// //   const navigation = useNavigation();
// //   const { userId, setUserId } = useContext(UserType);

// //   useEffect(() => {
// //     const fetchProfile = async (userId) => {
// //       try {
// //         // Get the authentication token from AsyncStorage
// //         const authToken = await AsyncStorage.getItem("authToken");
// //         console.log("Auth Token From Profile:", authToken);

// //         // Make a GET request to fetch profile information
// //         const profileResponse = await axios.get(
// //           `https://levelart.up.railway.app/followers/${userId}/followers`,
// //           {
// //             headers: {
// //               Authorization: `Bearer ${authToken}`,
// //             },
// //           }
// //         );

// //         const { user, followers, followings } = profileResponse.data;
// //         setUser(user);
// //         setFollowers(followers?.length || 0);
// //         setFollowings(followings?.length || 0);

// //         // Fetch user posts
// //         const postsResponse = await axios.get(
// //           `https://levelart.up.railway.app/posts/user/${userId}`,
// //           {
// //             headers: {
// //               Authorization: `Bearer ${authToken}`,
// //             },
// //           }
// //         );
// //         setPosts(postsResponse.data);

// //         // Fetch user replies
// //         const repliesResponse = await axios.get(
// //           `https://levelart.up.railway.app/posts/user/${userId}/replies`,
// //           {
// //             headers: {
// //               Authorization: `Bearer ${authToken}`,
// //             },
// //           }
// //         );
// //         setReplies(repliesResponse.data);
// //       } catch (error) {
// //         console.error("Error fetching profile:", error);
// //       }
// //     };

// //     if (userId) {
// //       fetchProfile(userId);
// //     } else {
// //       console.log("userId is undefined");
// //     }
// //   }, [userId]);

// //   const logout = async () => {
// //     try {
// //       await AsyncStorage.removeItem("authToken");
// //       console.log("Cleared auth token");
// //       navigation.replace("Login");
// //     } catch (error) {
// //       console.error("Error clearing auth token:", error);
// //     }
// //   };

// //   const handleSettingsPress = () => {
// //     navigation.navigate('Settings');
// //   };

// //   return (
// //     <View style={styles.container}>
// //       <View style={styles.profileInfo}>
// //         <View style={styles.profileHeader}>
// //           <Text style={styles.username}>{user}</Text>
// //           <Pressable style={styles.settingsIcon} onPress={handleSettingsPress}>
// //             <Icon name="settings-outline" size={30} color="#333" />
// //           </Pressable>
// //         </View>
// //         <View style={styles.bioContainer}>
// //           {/* <Image
// //             style={styles.profileImage}
// //             source={{
// //               uri: "https://cdn-icons-png.flaticon.com/128/149/149071.png",
// //             }}
// //           /> */}
// //           <View style={styles.bioTextContainer}>
// //             <Text style={styles.bioText}>BTech.</Text>
// //             <Text style={styles.bioText}>Movie Buff | Musical Nerd</Text>
// //             <Text style={styles.bioText}>Love Yourself</Text>
// //           </View>
// //         </View>
// //         <Text style={styles.followText}>{followers} followers</Text>
// //         <Text style={styles.followText}>{followings} followings</Text>
// //       </View>

// //       <Tab.Navigator>
// //         <Tab.Screen name="Images">
// //           {() => <ImagesScreen posts={posts} />}
// //         </Tab.Screen>
// //         <Tab.Screen name="Tweets">
// //           {() => <TweetsScreen posts={posts} />}
// //         </Tab.Screen>
// //       </Tab.Navigator>

// //       <View style={styles.buttonsContainer}>
// //         <Pressable style={styles.button} onPress={logout}>
// //           <Text style={styles.buttonText}>Logout</Text>
// //         </Pressable>
// //       </View>
// //     </View>
// //   );
// // };

// // const styles = StyleSheet.create({
// //   container: {
// //     flex: 1,
// //   },
// //   profileInfo: {
// //     marginBottom: 20,
// //     padding: 15,
// //   },
// //   profileHeader: {
// //     flexDirection: "row",
// //     alignItems: "center",
// //     marginBottom: 10,
// //   },
// //   username: {
// //     fontSize: 20,
// //     fontWeight: "bold",
// //   },
// //   bioContainer: {
// //     flexDirection: "row",
// //     alignItems: "center",
// //     marginBottom: 10,
// //   },
// // //   profileImage: {
// // //     width: 100,
// // //     height: 100,
// // //     borderRadius: 50,
// // //     resizeMode: "cover",
// // //   },
// //   bioTextContainer: {
// //     marginLeft: 10,
// //   },
// //   bioText: {
// //     fontSize: 15,
// //     fontWeight: "400",
// //   },
// //   followText: {
// //     color: "gray",
// //     fontSize: 15,
// //   },
// //   postsList: {
// //     flexGrow: 1,
// //     padding: 15,
// //   },
// // //   postWrapper: {
// // //     flex:1,
// // //     flexDirection: 'grid',
// // //     justifyContent: 'space-between',
// // //     marginBottom: 50,
// // //     alignItems: "left", // Center the items in the grid
// // //   },
// // //   postText: {
// // //     fontSize: 16,
// // //     textAlign: "center", // Center the text
// // //   },
// // //   postImage: {
// // //     width: Dimensions.get("window").width / 4, // Adjust according to your layout
// // //     height: Dimensions.get("window").width / 4, // Adjust according to your layout
// // //     resizeMode: "cover",
// // //   },
// //   buttonsContainer: {
// //     flexDirection: "row",
// //     alignItems: "center",
// //     justifyContent: "center",
// //     marginTop: 10,
// //     paddingBottom: 10,
// //     padding: 50,
// //   },
// //   button: {
// //     flex: 1,
// //     justifyContent: "center",
// //     alignItems: "center",
// //     padding: 10,
// //     borderWidth: 1,
// //     borderRadius: 1,
// //     backgroundColor:"black",
// //   },
// //   buttonText: {
// //     textAlign: "center",
// //     fontWeight: "bold",
// //     color:"white",
// //   },
// //   settingsIcon: {
// //     marginLeft: 'auto',
// //   },
// // });

// // export default ProfileScreen;


// const TweetsScreen = ({ posts }) => {
//     const renderPostItem = ({ item }) => (
//       <View style={styles.postWrapper}>
//         <Text style={styles.postText}>{item.text}</Text>
//       </View>
//     );
  
//     return (
//       <View style={styles.container}>
//         <FlatList
//           data={posts}
//           renderItem={renderPostItem}
//           keyExtractor={(item) => item._id}
//           contentContainerStyle={styles.postsList}
//           numColumns={3} // Adjust the number of columns
//         />
//       </View>
//     );
//   };

//   export default TweetsScreen