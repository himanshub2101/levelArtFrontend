import React, { useEffect, useContext, useState, useCallback } from "react";
import { StyleSheet, Text, View, ScrollView, Image, RefreshControl, TouchableOpacity, Modal, Alert } from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import jwt_decode from "jwt-decode";
import axios from "axios";
import { AntDesign, FontAwesome, Ionicons } from "@expo/vector-icons";
import logo from '../assets/logo.png';
import { UserType } from "../UserContext";
import MessageContainer from "../components/messageContainer"; // Import MessageContainer component

const HomeScreen = ({ route }) => {
  const { userId, setUserId } = useContext(UserType);
  const [posts, setPosts] = useState([]);
  const [refreshing, setRefreshing] = useState(false);
  const [userIdSet, setUserIdSet] = useState(false);
  const [showChat, setShowChat] = useState(false); // State to manage chat screen visibility
  const [selectedPost, setSelectedPost] = useState(null); // State to store the selected post
  const [modalVisible, setModalVisible] = useState(false); // State to manage the modal visibility

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
        fetchPosts(); // Fetch posts whenever userId changes
      } catch (error) {
        console.error("Error fetching user data:", error);
      }
    };
  
    fetchUserData();
  }, [userId]); // Trigger useEffect whenever userId changes
  
  
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
      const decodedToken = jwt_decode(token)
      console.log("decodedToken:", decodedToken
    )
      const headers = {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      };

      const responseFollowings = await axios.get(`https://levelart.up.railway.app/followers/${userId}/following`, { headers });
      const followings = responseFollowings.data;
console.log("responseFollowings:",responseFollowings)
      const postsPromises = followings.map(async (followingId) => {
        const response = await axios.get(`https://levelart.up.railway.app/user/${followingId}`, { headers });
        return response.data;
      });

      const responseUserPosts = await axios.get(`https://levelart.up.railway.app/posts/user/${userId}`, { headers });
      const userPosts = responseUserPosts.data;
      const postsResponses = await Promise.all(postsPromises);

      const allPosts = postsResponses.reduce((accumulator, currentPosts) => accumulator.concat(currentPosts), []);

      const combinedPosts = [...allPosts, ...userPosts].map(post => ({ ...post, liked: post.likes.includes(userId) }));
      setPosts(combinedPosts);
    } catch (error) {
      console.log("Error fetching posts", error);
    }
  };
  
  const handleLike = async (postId) => {
    try {
      const token = await AsyncStorage.getItem("authToken")

      console.log("token:",token)
      // Send a POST request to your backend API endpoint for liking the post
      const response = await axios.post(`https://levelart.up.railway.app/posts/${postId}/like`, null, {
        headers: {
          Authorization: `Bearer ${token}`, // Replace YOUR_AUTH_TOKEN with the actual authentication token
        },
      });
      // Update the liked state for the post
      setPosts(prevPosts =>
        prevPosts.map(post =>
          post._id === postId ? { ...post, liked: !post.liked, likes: post.liked ? post.likes.filter(id => id !== userId) : [...post.likes, userId] } : post
        )
      );
      console.log("response:",response)

      console.log("Post liked/unliked successfully:", response.data.message);
      // You can perform additional actions after successfully liking/unliking the post
    } catch (error) {
      console.error("Error liking the post", error);
    }
  };

  const openOptionsModal = (post) => {
    setSelectedPost(post);
    setModalVisible(true);
  };

  const closeOptionsModal = () => {
    setSelectedPost(null);
    setModalVisible(false);
  };

  const renderPost = (post) => {
    return (
      <View key={`${post.postedBy}-${post.postId}`} style={styles.post}>
        <View style={styles.postHeader}>
          {post.user && post.user.profilePicture && (
            <Image source={{ uri: post.user.profilePicture }} style={styles.profilePicture} />
          )}
          <Text style={styles.username}>{post.postedBy}</Text>
          <TouchableOpacity onPress={() => openOptionsModal(post)}>
            <Ionicons name="ellipsis-vertical" size={24} color="black" />
          </TouchableOpacity>
        </View>
        <View style={styles.postContent}>
          {post.text && <Text>{post.text}</Text>}
          {post.img && (
            <Image source={{ uri: post.img }} style={styles.postImage} />
          )}
          <View style={styles.actionButtons}>
            <TouchableOpacity onPress={() => handleLike(post._id)}>
              <AntDesign name={post.liked ? "heart" : "hearto"} size={24} color={post.liked ? "red" : "black"} />
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
        <TouchableOpacity style={styles.chatIconContainer} onPress={() => setShowChat(!showChat)}>
          <Ionicons name="chatbubble-outline" size={24} color="black" />
        </TouchableOpacity>
      </View>
      
      <View style={styles.postContainer}>
        {posts.map((post) => renderPost(post))}
      </View>

      {/* Options Modal */}
      <Modal
        animationType="slide"
        transparent={true}
        visible={modalVisible}
        onRequestClose={closeOptionsModal}
      >
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <TouchableOpacity onPress={closeOptionsModal}>
              <Text style={styles.closeModalText}>Close</Text>
            </TouchableOpacity>
            {/* Add your options here */}
            {/* For example: */}
            <TouchableOpacity onPress={() => {}}>
              <Text>Option 1</Text>
            </TouchableOpacity>
            <TouchableOpacity onPress={() => {}}>
              <Text>Option 2</Text>
            </TouchableOpacity>
            <TouchableOpacity onPress={() => {}}>
              <Text>Option 3</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>

      {/* Render chat container if showChat is true */}
      {showChat && <MessageContainer />}
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
    borderBottomWidth: 1,
    borderBottomColor: "#ddd",
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
    minHeight: 100,
    paddingVertical: 10,
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
  modalContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0, 0, 0, 0.5)",
  },
  modalContent: {
    backgroundColor: "white",
    padding: 20,
    borderRadius: 10,
    elevation: 5,
  },
  closeModalText: {
    alignSelf: "flex-end",
    marginBottom: 10,
  },
});

export default HomeScreen;
