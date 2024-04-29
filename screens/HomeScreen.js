import React, { useEffect, useContext, useState, useCallback } from "react";
import { StyleSheet, Text, View, ScrollView, Image, RefreshControl, TouchableOpacity, Modal, TextInput } from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import jwt_decode from "jwt-decode";
import axios from "axios";
import { AntDesign, FontAwesome, Ionicons } from "@expo/vector-icons";
import logo from '../assets/logo.png';
import { UserType } from "../UserContext";
import MessageContainer from "../components/messageContainer"; // Import MessageContainer component
// Import the necessary icon
import { Feather } from "@expo/vector-icons";

const HomeScreen = ({ route }) => {
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

      const responseFollowings = await axios.get(`http://192.168.1.14:3000/followers/${userId}/following`, { headers });
      const followings = responseFollowings.data;
      const postsPromises = followings.map(async (followingId) => {
        const response = await axios.get(`http://192.168.1.14:3000/user/${followingId}`, { headers });
        return response.data;
      });

      const responseUserPosts = await axios.get(`http://192.168.1.14:3000/posts/user/${userId}`, { headers });
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
      const response = await axios.post(`http://192.168.1.14:3000/posts/${postId}/like`, null, {
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
    try {
      const isSaved = savedPosts.includes(postId);
      const updatedSavedPosts = isSaved
        ? savedPosts.filter((savedPostId) => savedPostId !== postId)
        : [...savedPosts, postId];
      setSavedPosts(updatedSavedPosts);
      await AsyncStorage.setItem("savedPosts", JSON.stringify(updatedSavedPosts));
    } catch (error) {
      console.error("Error saving post:", error);
    }
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
            <TouchableOpacity onPress={() => handleLike(post._id)} style={styles.actionButton}>
              <AntDesign name={post.liked ? "heart" : "hearto"} size={30} color={post.liked ? "red" : "black"} />
            </TouchableOpacity>
            <TouchableOpacity onPress={toggleCommentInput} style={styles.actionButton}>
              <FontAwesome name="comment-o" size={30} color="black" />
            </TouchableOpacity>
            <TouchableOpacity onPress={() => handleSavePost(post._id)} style={styles.saveButton}>
            <Feather name={savedPosts.includes(post._id) ? "bookmark" : "bookmark-outline"} size={30} color={savedPosts.includes(post._id) ? "#000" : "#8e8e8e"} />
          </TouchableOpacity>

            <TouchableOpacity onPress={() => {}} style={styles.actionButton}>
              <Ionicons name="paper-plane-outline" size={30} color="black" />
            </TouchableOpacity>
          </View>
          <View style={styles.socialInfo}>
            <Text style={styles.likes}>{post.likes?.length || 0} likes</Text>
            <Text style={styles.comments}>{post.comments?.length || 0} comments</Text>
          </View>
          {showCommentInput && (
            <View style={styles.commentInputContainer}>
              <TextInput
                style={styles.commentInput}
                placeholder="Add a comment..."
                value={commentText}
                onChangeText={setCommentText}
              />
              <TouchableOpacity onPress={() => handleComment(post._id)} style={styles.postCommentButton}>
                <Text style={styles.postCommentButtonText}>Post</Text>
              </TouchableOpacity>
            </View>
          )}
        </View>
      </View>
    );
  };

  return (
    <ScrollView
      style={styles.container}
      refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />}
    >
      <Image style={styles.logo} source={logo} />
      <TouchableOpacity style={styles.chatIconContainer} onPress={() => setShowChat(!showChat)}>
        <Ionicons name="chatbubble-outline" size={24} color="black" />
      </TouchableOpacity>
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
  logo: {
    width: 80,
    height: 60,
    top: 10,
    right: 0,
    resizeMode: "contain",
  },
  chatIconContainer: {
    position: "absolute",
    top: 20,
    right: 10,
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
  profilePicture: {
    width: 40,
    height: 10,
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
  commentInputContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: 10,
    paddingHorizontal: 10,
  },
  commentInput: {
    flex: 1,
    height: 40,
    borderWidth: 1,
    borderColor: "#ddd",
    borderRadius: 5,
    paddingHorizontal: 10,
  },
  postCommentButton: {
    marginLeft: 10,
    paddingVertical: 8,
    paddingHorizontal: 12,
    backgroundColor: "#007AFF",
    borderRadius: 5,
  },
  postCommentButtonText: {
    color: "#fff",
  },
});

export default HomeScreen;
