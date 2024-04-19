import React, { useEffect, useContext, useState, useCallback } from "react";
import { StyleSheet, Text, View, ScrollView, Image, RefreshControl, TouchableOpacity } from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import jwt_decode from "jwt-decode";
import axios from "axios";
import { AntDesign, FontAwesome, Ionicons } from "@expo/vector-icons";
import logo from '../assets/logo.png';
import { UserType } from "../UserContext";

const HomeScreen = ({ route }) => {
  const { userId, setUserId } = useContext(UserType);
  const [posts, setPosts] = useState([]);
  const [refreshing, setRefreshing] = useState(false);
  const [userIdSet, setUserIdSet] = useState(false);

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const token = await AsyncStorage.getItem("authToken");
        if (!token) {
          console.log("Token not found");
          return;
        }
        const decodedToken = jwt_decode(token);
        if (!decodedToken || !decodedToken.sub) {
          console.log("Decoded token or user ID not found");
          return;
        }
        const userId = decodedToken.sub;
        setUserId(userId);
        setUserIdSet(true);
      } catch (error) {
        console.error("Error fetching user data:", error);
      }
    };
    
    fetchUserData();
  }, [route]);
  
  useEffect(() => {
    if (userIdSet) {
      fetchPosts();
    }
  }, [userIdSet]);

  const onRefresh = useCallback(() => {
    setRefreshing(true);
    fetchPosts();
    setRefreshing(false);
  }, []);

  const fetchPosts = async () => {
    try {
      const token = await AsyncStorage.getItem("authToken");
      const headers = {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      };

      const responseFollowings = await axios.get(`https://levelartbackend-production.up.railway.app/followers/${userId}/following`, { headers });
      const followings = responseFollowings.data;

      console.log("responseFollowings:",responseFollowings)

      const postsPromises = followings.map(async (followingId) => {
        const response = await axios.get(`https://levelartbackend-production.up.railway.app/posts/user/${followingId}`, { headers });
        console.log("response:",response)

        return response.data;
      });

      const responseUserPosts = await axios.get(`https://levelartbackend-production.up.railway.app/posts/user/${userId}`, { headers });
      const userPosts = responseUserPosts.data;
      const postsResponses = await Promise.all(postsPromises);

      const allPosts = postsResponses.reduce((accumulator, currentPosts) => accumulator.concat(currentPosts), []);

      const combinedPosts = [...allPosts, ...userPosts];
      console.log("Combined Posts:", combinedPosts); // Log combinedPosts

      setPosts(combinedPosts);
    } catch (error) {
      console.log("Error fetching posts", error);
    }
  };
  
  const handleLike = async (postId) => {
    try {
      // Code for handling like
    } catch (error) {
      console.log("Error liking the post", error);
    }
  };

  const renderPost = (post) => {
    console.log("post:", post)
    return (
      <View key={`${post.postedBy}-${post.postId}`} style={styles.post}>
        <View style={styles.postHeader}>
          {/* Render profile picture if available */}
          {post.user && post.user.profilePicture && (
            <Image source={{ uri: post.user.profilePicture }} style={styles.profilePicture} />
          )}
          <Text style={styles.username}>{post.postedBy}</Text>
        </View>
        <View style={styles.postContent}>
          {/* Render text content if available */}
          {post.text && <Text>{post.text}</Text>}
          {/* Render image if available */}
          {post.img && (
            <Image source={{ uri: post.img }} style={styles.postImage} />
          )}
          <View style={styles.actionButtons}>
            <TouchableOpacity onPress={() => handleLike(post._id)}>
              <AntDesign name="hearto" size={24} color="black" />
            </TouchableOpacity>
            <TouchableOpacity onPress={() => {}}>
              <FontAwesome name="comment-o" size={24} color="black" />
            </TouchableOpacity>
            <TouchableOpacity onPress={() => {}}>
              <Ionicons name="paper-plane-outline" size={24} color="black" />
            </TouchableOpacity>
          </View>
          <Text style={styles.likes}>{post.likes?.length || 0} likes</Text>
        </View>
      </View>
    );
  };

  return (
    <ScrollView
      style={styles.container}
      refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />}
    >
      <View style={styles.header}>
        <Image style={styles.logo} source={logo} />
          {/* Chat icon */}
          <TouchableOpacity style={styles.chatIconContainer} onPress={() => {/* Handle chat icon press */}}>
          <Ionicons name="chatbubble-outline" size={24} color="black" />
        </TouchableOpacity>
      </View>

      <View style={styles.postContainer}>
        {posts.map((post) => renderPost(post))}
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "white",
  },
  header: {
    alignItems: "center",
    marginTop: 20,
    marginBottom: 10,
    borderBottomWidth: 1, // Add border to the bottom of the header
    borderBottomColor: "#ddd", // Border color
  },
  chatIconContainer: {
    position: "absolute",
    top: 0,
    right: 10,
  },
  logo: {
    width: 120,
    height: 40,
    resizeMode: "contain",
  },
  postContainer: {
    paddingHorizontal: 10,
  },
  post: {
    backgroundColor: "#fff",
    borderRadius: 10,
    marginBottom: 20,
    borderWidth: 1,
    borderColor: "#ddd",
  },
  postHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 10,
    paddingVertical: 8,
    maxHeightheight:300,
    minHeight:100
  },
  profilePicture: {
    width: 40,
    height: 40,
    borderRadius: 20,
    marginRight: 10,
  },
  username: {
    fontWeight: "bold",
  },
  postContent: {
    minHeight: 100, // Adjust the minHeight as needed
    paddingVertical: 10, // Add padding to increase content area vertically
  },
    postImage: {
    width: "100%",
    height: 300,
  },
  actionButtons: {
    flexDirection: "row",
    paddingHorizontal: 10,
    paddingVertical: 8,
    borderTopWidth: 1,
    borderColor: "#ddd",
    justifyContent: "space-between",
  },
  likes: {
    fontWeight: "bold",
    paddingHorizontal: 10,
    marginBottom: 5,
  },
});

export default HomeScreen;
