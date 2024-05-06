import React, {
  useEffect,
  useContext,
  useState,
  useCallback,
  useLayoutEffect,
} from "react";
import {
  StyleSheet,
  Text,
  View,
  ScrollView,
  Image,
  RefreshControl,
  TouchableOpacity,
  SafeAreaView,
  Modal,
  TextInput,
  Alert,
  Dimensions,
  PanResponder,
} from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import jwt_decode from "jwt-decode";
import axios from "axios";
import {
  AntDesign,
  FontAwesome,
  Ionicons,
  Feather,
  Octicons,
} from "@expo/vector-icons";
import logo from "../assets/logo.png";
import { UserType } from "../UserContext";
import MessageContainer from "../components/messageContainer"; // Import MessageContainer component
import AnimatedMessage from "../components/AnimatedMessage"; // Import AnimatedMessage component
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { useNavigation } from "@react-navigation/native";

const HomeScreen = ({ route }) => {
  const navigation = useNavigation();
  const { userId, setUserId } = useContext(UserType);
  const [posts, setPosts] = useState([]);
  const [refreshing, setRefreshing] = useState(false);
  const [userIdSet, setUserIdSet] = useState(false);
  const [showChat, setShowChat] = useState(false); // State to manage chat screen visibility
  const [selectedPost, setSelectedPost] = useState(null); // State to store the selected post
  const [modalVisible, setModalVisible] = useState(false); // State to manage the modal visibility
  const [showCommentInput, setShowCommentInput] = useState(false); // State to manage comment input visibility
  const [commentText, setCommentText] = useState(""); // State to store the comment text
  const [savedPosts, setSavedPosts] = useState([]); // State to store saved posts
  const [showAnimatedMessage, setShowAnimatedMessage] = useState(false);
  const [animatedMessage, setAnimatedMessage] = useState("");
  const [userProfile, setUserProfile] = useState(null);
  const [modalPosition, setModalPosition] = useState({ y: 0 });

  const panResponder = PanResponder.create({
    onStartShouldSetPanResponder: () => true,
    onPanResponderMove: (evt, gestureState) => {
      // Update modal position based on gesture movement
      const newY = modalPosition.y + gestureState.dy;
      if (newY > modalPosition.y) {
        setModalPosition({ x: modalPosition.x, y: newY });

        // Check if modal reaches the bottom of the screen
        const windowHeight = Dimensions.get("window").height;
        const modalHeight = 600; // Assuming the modal height
        const bottomThreshold = windowHeight - modalHeight;
        if (newY >= bottomThreshold) {
          // Close the modal
          closeOptionsModal();
          setShowCommentInput(false);
        }
      }
    },
  });

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
    // fetchUserData();
    //refresh after every 3 second
    const intervalId = setInterval(fetchUserData,3000);
    return () => clearInterval(intervalId);
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
      const userId = decodedToken.sub;
      console.log("UserData", decodedToken);
      console.log("userId", userId);

      const headers = {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      };

      const GetUser = await axios.get(
        `https://levelart.up.railway.app/users/${userId}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      setUserProfile(GetUser.data);
      console.log("Home user", GetUser.data);

      const responseFollowings = await axios.get(
        `https://levelart.up.railway.app/followers/${userId}/following`,
        { headers }
      );
      const followings = responseFollowings.data;

      const postsPromises = followings.map(async (followingId) => {
        const response = await axios.get(
          `https://levelart.up.railway.app/user/${followingId}`,
          { headers }
        );
        return response.data;
      });

      const responseUserPosts = await axios.get(
        `https://levelart.up.railway.app/posts/user/${userId}`,
        { headers }
      );
      const userPosts = responseUserPosts.data;

      const postsResponses = await Promise.all(postsPromises);

      const allPosts = postsResponses.reduce(
        (accumulator, currentPosts) => accumulator.concat(currentPosts),
        []
      );

      const combinedPosts = [...allPosts, ...userPosts].map((post) => ({
        ...post,
        liked: post.likes.includes(userId),
      }));
      setPosts(combinedPosts);
    } catch (error) {
      console.log("Error fetching posts", error);
    }
  };

  const handleLike = async (postId) => {
    try {
      const token = await AsyncStorage.getItem("authToken");
      const response = await axios.post(
        `https://levelart.up.railway.app/posts/${postId}/like`,
        null,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      setPosts((prevPosts) =>
        prevPosts.map((post) =>
          post._id === postId
            ? {
                ...post,
                liked: !post.liked,
                likes: post.liked
                  ? post.likes.filter((id) => id !== userId)
                  : [...post.likes, userId],
              }
            : post
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
    setModalVisible(false);
    setSelectedPost(null);
    setModalPosition({ y: 0 });
  };

  const toggleCommentInput = () => {
    setShowCommentInput(!showCommentInput);
    setModalPosition({ y: 0 });
  };

  const handleComment = () => {
    try {
      const newComment = {
        image: require("../assets/avatar.png"),
        comment: commentText,
        timing: "just now",
        userName: "YourUsername",
      };
      setComments((prevComments) => [...prevComments, newComment]);

      setCommentText("");
    } catch (error) {
      console.error("Error posting the comment", error);
    }
  };

  const handleSavePost = async (postId) => {
    try {
      const isSaved = savedPosts.includes(postId);
      // Set the animated message state before updating savedPosts
      setAnimatedMessage(
        isSaved
          ? "The post has been unsaved successfully!"
          : "The post has been saved successfully!"
      );
      const updatedSavedPosts = isSaved
        ? savedPosts.filter((savedPostId) => savedPostId !== postId)
        : [...savedPosts, postId];
      setSavedPosts(updatedSavedPosts);
      await AsyncStorage.setItem(
        "savedPosts",
        JSON.stringify(updatedSavedPosts)
      );
    } catch (error) {
      console.error("Error saving post:", error);
    }
  };

  const handleAnimationEnd = () => {
    setShowAnimatedMessage(false);
  };

  useLayoutEffect(() => {
    navigation.setOptions({
      headerTitle: "",
      headerLeft: () => (
        <Image
          style={{
            width: 60,
            height: 45,
            resizeMode: "contain",
            // marginLeft: 10,
            marginTop: 19,
            overflow: "hidden",
          }}
          source={logo}
        />
      ),
      headerRight: () => (
        <TouchableOpacity
          style={{
            marginRight: 10,
          }}
          // onPress={() => navigation.navigate("All Friend list")}
        >
          <Ionicons name="chatbubble-outline" size={24} color="black" />
        </TouchableOpacity>
      ),
    });
  }, []);

  const renderPost = (post, index) => {
    return (
      <View key={post._id} style={styles.post}>
        <View style={styles.postHeader}>
          <View style={styles.postUserNameImg}>
            {userProfile?.profilePic ? (
              <Image
                source={{ uri: userProfile?.profilePic }}
                style={styles.profilePicture}
              />
            ) : (
              <Image
                source={require("../assets/avatar.png")}
                style={styles.profilePicture}
              />
            )}
            <Text style={styles.username}>{userProfile?.username}</Text>
          </View>
          <TouchableOpacity onPress={() => openOptionsModal(post)}>
            <Ionicons name="ellipsis-vertical" size={24} color="black" />
          </TouchableOpacity>
        </View>
        <View style={styles.postContent}>
          {post.text && <Text style={styles.captions}>{post.text}</Text>}
          {post.img && (
            <Image source={{ uri: post.img }} style={styles.postImage} />
          )}
          <View style={styles.actionButtons}>
            <View style={styles.actionLeftButtons}>
              <TouchableOpacity
                onPress={() => handleLike(post._id)}
                style={styles.actionButtons}
              >
                <AntDesign
                  name={post.liked ? "heart" : "hearto"}
                  size={24}
                  color={post.liked ? "red" : "black"}
                />
              </TouchableOpacity>
              <TouchableOpacity
                onPress={toggleCommentInput}
                style={styles.actionButtons}
              >
                <FontAwesome name="comment-o" size={24} color="black" />
              </TouchableOpacity>

              <TouchableOpacity onPress={() => {}} style={styles.actionButtons}>
                <Ionicons name="paper-plane-outline" size={24} color="black" />
              </TouchableOpacity>
            </View>
            <View>
              <TouchableOpacity
                onPress={() => {
                  handleSavePost(post._id);
                  // Add code to show the animated message
                  setShowAnimatedMessage(true);
                }}
                style={styles.saveButton}
              >
                <Ionicons
                  name={
                    savedPosts.includes(post._id)
                      ? "bookmark"
                      : "bookmark-outline"
                  }
                  size={24}
                  color={savedPosts.includes(post._id) ? "#000" : "#8e8e8e"}
                />
              </TouchableOpacity>
            </View>
          </View>
          <View style={styles.socialInfo}>
            <Text style={styles.likes}>{post.likes?.length || 0} likes</Text>
            <Text style={styles.comments}>
              View all {post.comments?.length || 0} comments
            </Text>
          </View>
        </View>
      </View>
    );
  };
  const [comments, setComments] = useState([
    {
      image: require("../assets/avatar.png"),
      comment: "I Still find it",
      timing: "1h",
      userName: "Samy",
    },
    {
      image: require("../assets/avatar.png"),
      comment: "I Still find it",
      timing: "49m",
      userName: "Raj",
    },
    {
      image: require("../assets/avatar.png"),
      comment: "I Still find it",
      timing: "1h50m",
      userName: "Samy",
    },
    {
      image: require("../assets/avatar.png"),
      comment: "I Still find it",
      timing: "2h",
      userName: "Ravi",
    },
    {
      image: require("../assets/avatar.png"),
      comment: "I Still find it",
      timing: "1d",
      userName: "Samoya",
    },
  ]);
  return (
    <SafeAreaView style={styles.container}>
      <ScrollView
        style={styles.scrollView}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
      >
        <View style={styles.postContainer}>
          {posts.map((post) => renderPost(post))}
        </View>
        {/* three dots modal */}
        <Modal
          animationType="slide"
          transparent={true}
          visible={modalVisible}
          onRequestClose={closeOptionsModal}
        >
          <View
            style={[
              styles.modalContainer,
              { top: modalPosition.y, left: modalPosition.x },
            ]}
            {...panResponder.panHandlers}
          >
            <TouchableOpacity
              style={styles.ThreeDotModaloverlay}
              activeOpacity={1} // Ensure the touch doesn't pass through
              onPress={closeOptionsModal} // Close the modal when overlay is pressed
            />
            <View style={styles.modalContent}>
              <View style={styles.threeDotModalUpper}>
                <TouchableOpacity style={styles.threeDotUpperIconContainer}>
                  <View style={styles.threeDotUpperIcon}>
                    <Feather name="bookmark" size={24} color="black" />
                  </View>
                  <Text style={styles.threeDotMiddleItemText}>Save</Text>
                </TouchableOpacity>
                <TouchableOpacity style={styles.threeDotUpperIconContainer}>
                  <View>
                    <Image
                      style={styles.threeDotUpperIcon}
                      source={require("../assets/avatar.png")}
                    />
                  </View>
                  <Text style={styles.threeDotMiddleItemText}>
                    View profile
                  </Text>
                </TouchableOpacity>
              </View>
              <View style={styles.threeDotMiddleContainer}>
                <TouchableOpacity style={styles.threeDotmiddleItems}>
                  <Ionicons
                    name="person-remove-outline"
                    size={24}
                    color="black"
                  />
                  <Text style={styles.threeDotMiddleItemText}>Unfollow</Text>
                </TouchableOpacity>
                <TouchableOpacity style={styles.threeDotmiddleItems}>
                  <Ionicons
                    name="person-circle-outline"
                    size={24}
                    color="black"
                  />
                  <Text style={styles.threeDotMiddleItemText}>
                    About this account
                  </Text>
                </TouchableOpacity>
                <TouchableOpacity style={styles.threeDotmiddleItems}>
                  <Octicons name="report" size={24} color="black" />
                  <Text style={styles.threeDotMiddleItemText}>Report</Text>
                </TouchableOpacity>
              </View>
            </View>
          </View>
        </Modal>
        {/* comments modal */}
        <Modal
          animationType="slide"
          transparent={true}
          visible={showCommentInput}
          onRequestClose={() => setShowCommentInput(false)}
        >
          <View
            style={[
              styles.modalContainer,
              { top: modalPosition.y, left: modalPosition.x },
            ]}
            {...panResponder.panHandlers}
          >
            <TouchableOpacity
              style={styles.ThreeDotModaloverlay}
              activeOpacity={1} // Ensure the touch doesn't pass through
              onPress={toggleCommentInput} // Close the modal when overlay is pressed
            />
            <View style={styles.modalContent}>
              <ScrollView>
                {comments.map((comment, index) => (
                  <View key={index} style={styles.allCommentsContainer}>
                    {/* Profile Image */}
                    <Image
                      source={comment.image}
                      style={styles.commentProfileImage}
                    />
                    {/* Comment Text */}
                    <View style={styles.rightSideContainer}>
                      <View
                        style={{
                          flexDirection: "row",
                          justifyContent: "space-between",
                        }}
                      >
                        <Text style={styles.userNameComment}>
                          {comment.userName}
                        </Text>
                        <Text>{comment.timing}</Text>
                      </View>
                      <View style={styles.commentLike}>
                        <Text style={styles.commentText}>
                          {comment.comment}
                        </Text>
                        <TouchableOpacity
                          style={{ paddingVertical: 5, paddingLeft: 5 }}
                        >
                          <AntDesign name={"hearto"} size={18} color={"gray"} />
                        </TouchableOpacity>
                      </View>
                    </View>
                  </View>
                ))}
              </ScrollView>
            </View>
          </View>
          <View style={styles.commentInputContainer}>
            <Image
              source={require("../assets/avatar.png")}
              style={styles.commentProfileImage}
            />
            <TextInput
              style={styles.commentInput}
              placeholder="Add a comment..."
              value={commentText}
              onChangeText={setCommentText}
            />
            <TouchableOpacity onPress={handleComment}>
              <MaterialCommunityIcons
                name="send-circle"
                size={34}
                color="black"
              />
            </TouchableOpacity>
          </View>
        </Modal>
        {showChat && <MessageContainer />}
      </ScrollView>
      {showAnimatedMessage && (
        <AnimatedMessage
          message={animatedMessage}
          onAnimationEnd={handleAnimationEnd}
          isVisible={showAnimatedMessage}
        />
      )}
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "white",
  },
  scrollView: {
    flex: 1,
    marginTop: 5,
  },
  navBar: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 10,
    marginTop: 30,
    borderBottomWidth: 1,
    borderColor: "#ddd",
  },
  logo: {
    width: 80,
    height: 60,
    resizeMode: "contain",
    marginRight: "auto",
  },
  chatIconContainer: {
    marginLeft: "auto",
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
  postUserNameImg: {
    flexDirection: "row",
    gap: 10,
    alignItems: "center",
  },
  profilePicture: {
    width: 45,
    height: 45,
    borderRadius: 50,
  },
  username: {
    fontWeight: "bold",
  },
  userNameComment: {
    fontWeight: "bold",
  },
  postContent: {
    minHeight: 100,
    paddingVertical: 10,
  },
  captions: {
    paddingHorizontal: 10,
    marginBottom: 5,
    fontWeight: "500",
  },
  postImage: {
    width: "100%",
    height: 300,
  },
  actionButtons: {
    display: "flex",
    alignItems: "center",
    flexDirection: "row",
    justifyContent: "space-between",
    paddingHorizontal: 8,
    paddingVertical: 10,
  },
  actionLeftButtons: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
  },
  socialInfo: {
    paddingHorizontal: 15,
  },
  likes: {
    fontWeight: "bold",
    marginBottom: 5,
  },
  comments: {
    fontWeight: "bold",
    color: "#000",
    opacity: 0.5,
  },
  modalContainer: {
    flex: 1,
    justifyContent: "flex-end",
  },
  modalContent: {
    backgroundColor: "white",
    minHeight: 600,
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    padding: 20,
  },
  allCommentsContainer: {
    flexDirection: "row",
    gap: 10,
    marginVertical: 10,
    paddingHorizontal: 10,
  },
  commentLike: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  commentText: {
    flex: 1,
  },
  rightSideContainer: {
    flex: 1,
  },
  commentInputContainer: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 10,
    paddingVertical: 5,
    gap: 5,
    borderTopWidth: 1,
    borderColor: "#000",
    backgroundColor: "#fff",
  },
  commentProfileImage: {
    width: 45,
    height: 45,
    borderRadius: 50,
  },
  commentInput: {
    height: 40,
    flex: 1,
    // borderWidth: 1,
    // borderColor: "#000",
    borderRadius: 5,
    paddingHorizontal: 10,
    paddingVertical: 10,
    marginHorizontal: 5,
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
  threeDotModalUpper: {
    justifyContent: "center",
    alignItems: "center",
    flexDirection: "row",
    gap: 50,
    paddingVertical: 30,
  },
  threeDotUpperIconContainer: {
    justifyContent: "center",
    alignItems: "center",
    gap: 10,
  },
  threeDotUpperIcon: {
    width: 60,
    height: 60,
    borderRadius: 50,
    borderWidth: 1,
    justifyContent: "center",
    alignItems: "center",
    overflow: "hidden",
  },
  threeDotMiddleContainer: {
    gap: 30,
  },
  threeDotMiddleItemText: {
    fontWeight: "700",
  },
  threeDotmiddleItems: {
    flexDirection: "row",
    gap: 10,
    alignItems: "center",
  },
  ThreeDotModaloverlay: {
    position: "absolute",
    top: 0,
    bottom: 0,
    left: 0,
    right: 0,
  },
});

export default HomeScreen;
