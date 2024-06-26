import React, { useEffect, useContext, useState, useCallback } from "react";
import { StyleSheet, Text, View, ScrollView, Image, RefreshControl, TouchableOpacity, Modal, Alert, TextInput, Dimensions } from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import jwt_decode from "jwt-decode";
import axios from "axios";
import { AntDesign, FontAwesome, Ionicons } from "@expo/vector-icons";
import logo from '../assets/logo.png';
import { UserType } from "../UserContext";
import MessageContainer from "../components/messageContainer"; // Import MessageContainer component

const FollowingScreen = ({ route }) => {
  const { userId, setUserId } = useContext(UserType);
  const [posts, setPosts] = useState([]);
  const [refreshing, setRefreshing] = useState(false);
  const [userIdSet, setUserIdSet] = useState(false);
  const [showChat, setShowChat] = useState(false); // State to manage chat screen visibility
  const [selectedPost, setSelectedPost] = useState(null); // State to store the selected post
  const [modalVisible, setModalVisible] = useState(false); // State to manage the modal visibility
  const [showCommentInput, setShowCommentInput] = useState(false); // State to manage comment input visibility
  const [commentText, setCommentText] = useState(''); // State to store the comment text
  const [savedPosts, setSavedPosts] = useState([]); // State to store saved posts

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
  }, [route]);

  useEffect(() => {
    if (userIdSet) {
      fetchPosts();
    }
  }, [userIdSet]);

  useEffect(() => {
    // fetchSavedPosts();
  }, []);

  const onRefresh = useCallback(() => {
    setRefreshing(true);
    fetchPosts();
    setRefreshing(false);
  }, []);

  const fetchPosts = async () => {
    try {
      const token = await AsyncStorage.getItem("authToken");
      const decodedToken = jwt_decode(token);
      const headers = {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      };

      const responseFollowings = await axios.get(`https://levelart.up.railway.app/followers/${userId}/following`, { headers });
      const followings = responseFollowings.data;
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
      const token = await AsyncStorage.getItem("authToken");
      const response = await axios.post(`https://levelart.up.railway.app/posts/${postId}/like`, null, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      setPosts(prevPosts =>
        prevPosts.map(post =>
          post._id === postId ? { ...post, liked: !post.liked, likes: post.liked ? post.likes.filter(id => id !== userId) : [...post.likes, userId] } : post
        )
      );
      console.log("Post liked/unliked successfully:", response.data.message);
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

  const toggleCommentInput = () => {
    setShowCommentInput(!showCommentInput);
  };

  const handleComment = async (postId) => {
    try {
      console.log("Comment:", commentText);
      setCommentText('');
      setShowCommentInput(false);
    } catch (error) {
      console.error("Error posting the comment", error);
    }
  };

  const handleSavePost = async (postId) => {
    console.log("postId:", postId);
    try {
      const isSaved = savedPosts.includes(postId);
      const updatedSavedPosts = isSaved
        ? savedPosts.filter((savedPostId) => savedPostId !== postId)
        : [...savedPosts, postId];
      console.log("Updated saved posts:", updatedSavedPosts); // Log updated saved posts
      setSavedPosts(updatedSavedPosts);
  
      // Temporarily remove AsyncStorage logic
      // await AsyncStorage.setItem("savedPosts", JSON.stringify(updatedSavedPosts));
  
      if (!isSaved) {
        console.log("Post Saved"); // Log to verify if this message is being reached
        Alert.alert("Post Saved", "This post has been saved.");
      }
    } catch (error) {
      console.error("Error saving post:", error);
    }
  };
  
  
  
  

  const renderPost = (post) => {
console.log("post._id:",post._id)
    return (
<View key={`${post._id}-${post.postedBy}`} style={styles.post}>
        <View style={styles.postHeader}>
          <Text style={styles.username}>{post.postedBy}</Text>
        </View>
        <View style={styles.postContent}>
          <Text>{post.text}</Text>
          {post.img && (
            <Image source={{ uri: post.img }} style={styles.postImage} />
          )}
          <View style={styles.actionButtons}>
            <TouchableOpacity onPress={() => handleLike(post._id)} style={styles.actionButton}>
              <AntDesign name={post.liked ? "heart" : "hearto"} size={30} color={post.liked ? "red" : "black"} />
            </TouchableOpacity>
            <TouchableOpacity onPress={toggleCommentInput} style={styles.actionButton}>
              <FontAwesome name="comment-o" size={30} color="black" />
            </TouchableOpacity>
            <TouchableOpacity onPress={() => handleShare(post._id)} style={styles.actionButton}>
              <Ionicons name="share-social" size={30} color="black" />
            </TouchableOpacity>
            <TouchableOpacity onPress={() => handleSavePost(post._id)} style={styles.saveButton}>
  <Image source={savedPosts.includes(post._id) ? require('../assets/bookmark.png') : require('../assets/save-instagram.png')} style={styles.bookmarkIcon} />
</TouchableOpacity>

          </View>
        </View>
      </View>
    );
  };

  return (
    <ScrollView
      style={styles.container}
      refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />}
    >
      <View style={styles.postContainer}>
        {posts.map((post) => renderPost(post))}
      </View>
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
            <TouchableOpacity onPress={() => {}}>
              <Text>saved</Text>
            </TouchableOpacity>
            <TouchableOpacity onPress={() => {}}>
              <Text>Share</Text>
            </TouchableOpacity>
            <TouchableOpacity onPress={() => {}}>
              <Text>Unfollow</Text>
            </TouchableOpacity>
            <TouchableOpacity onPress={() => {}}>
              <Text>handleImagePicker</Text>
            </TouchableOpacity>
            <TouchableOpacity onPress={() => {}}>
              <Text>About this account</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
      {showChat && <MessageContainer />}
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "white",
  },
  postContainer: {
    paddingHorizontal: 5,
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
  username: {
    fontWeight: "bold",
  },
  postContent: {
    minHeight: 100,
    paddingVertical: 10,
  },
  postImage: {
    width: "100%",
    height: 550,
  },
  actionButtons: {
    flexDirection: "row",
    paddingHorizontal: 5,
    paddingVertical: 10,
    borderTopWidth: 1,
    borderColor: "#ddd",
  },
  actionButton: {
    marginHorizontal: 5,
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
  bookmarkIcon: {
    width: 30,
    height: 30,
  },
});

export default FollowingScreen;
