import React, { useState, useEffect, useContext } from "react";
import {
  StyleSheet,
  Text,
  View,
  Image,
  SafeAreaView,
  TextInput,
  Button,
  ActivityIndicator,
  KeyboardAvoidingView,
  TouchableOpacity,
} from "react-native";
import * as ImagePicker from "expo-image-picker";
import axios from "axios";
import AsyncStorage from "@react-native-async-storage/async-storage";
import jwt_decode from "jwt-decode";
import { Feather, MaterialIcons } from "@expo/vector-icons";
import { useNavigation } from "@react-navigation/native";
import { UserType } from "../UserContext";

const ThreadsScreen = () => {
  const navigation = useNavigation();
  const [content, setContent] = useState("");
  const [image, setImage] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isImageSelected, setIsImageSelected] = useState(false);
  const { userId, setUserId } = useContext(UserType);
  const [userProfile, setUserProfile] = useState(null);

  useEffect(() => {
    const fetchUpdateUser = async (userId) => {
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
        console.log("post userProfile", userProfile);
      } catch (error) {
        console.error("Error fetching replies:", error);
      }
    };
    if (userId) {
      fetchUpdateUser(userId);
    } else {
      console.log("userId is undefined");
    }
  }, [userId]);


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

      setImage(pickerResult.assets[0].uri);
      setIsImageSelected(true);
    } else {
      console.log("Image picking cancelled or no image selected");
    }
  };
  const handleImageCancel = () => {
    setImage(null);
    setIsImageSelected(false);

  };

  const handlePostSubmit = async () => {
    setIsLoading(true);

    try {
      const authToken = await AsyncStorage.getItem("authToken");
      const decodedToken = jwt_decode(authToken);
      const userId = decodedToken.sub; // Extract user ID from the token

      const formData = new FormData();
      formData.append("text", content);
      formData.append("postedBy", userId); // Include the user ID as the "postedBy" field

      if (image) {
        const localUri = image;
        const filename = localUri.split("/").pop();
        const match = /\.(\w+)$/.exec(filename);
        const type = match ? `image/${match[1]}` : "image";
        formData.append("img", { uri: localUri, name: filename, type }); // Change 'image' to 'img'
      }

      const response = await axios.post(
        "https://levelart.up.railway.app/posts/create-post",
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
            Authorization: `Bearer ${authToken}`,
          },
        }
      );

      AsyncStorage.setItem("postId", response.data._id);

      console.log("Post created successfully:", response.data._id);
      // Reset form fields
      setContent("");
      setImage(null);
    } catch (error) {
      console.error("Error creating post:", error);
    } finally {
      setIsLoading(false);
    }
    navigation.navigate("Home");
  
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.navBar}>
        <TouchableOpacity
          style={styles.postButton}
          onPress={handlePostSubmit}
          disabled={isLoading}
        >
          <Text style={styles.postButtonText}>Post</Text>
        </TouchableOpacity>
      </View>
      <View style={styles.middleContainer}>
        <View style={styles.middleContainerTop}>
          <Image
            source={{ uri: userProfile?.profilePic }}
            style={styles.ProfileImage}
          />
          <TextInput
            value={content}
            onChangeText={setContent}
            placeholder="What's on your mind?"
            multiline
            style={styles.input}
          />
        </View>

        {isImageSelected && !isLoading &&(
          <View
            style={{
              paddingHorizontal: 10,
              paddingVertical: 10,
              flex: 1,
              position: "relative",
            }}
          >
            <Image source={{ uri: image }} style={{ height: 300 }} />
            <TouchableOpacity
              onPress={handleImageCancel}
              style={{ position: "absolute", bottom: -3, right: -3 }}
            >
              <MaterialIcons name="cancel" size={24} color="black" />
            </TouchableOpacity>
          </View>
        )}
      </View>
      {/* <View style={{ flex: 1}}>
 
        <Button
          title="Post"
          onPress={handlePostSubmit}
          disabled={isLoading}
          style={styles.postButton}
        />
      <View style={styles.inputContainer}>
        <TextInput
          value={content}
          onChangeText={setContent}
          placeholder="What's on your mind?"
          multiline
          style={styles.input}
        />
        <TouchableOpacity onPress={handleImagePicker}>
          <Ionicons name="image" size={24} color="black" />
        </TouchableOpacity>
      </View>
      {image && <Image source={{ uri: image }} style={styles.image} />}
      <View style={styles.button}>
</View>

      {isLoading && <ActivityIndicator />}
    </View> */}

      <View style={styles.BottomContainerIcon}>
        <TouchableOpacity onPress={handleImagePicker}>
          <Feather name="image" size={24} color="black" />
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
};

export default ThreadsScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  navBar: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 10,
    marginTop: 40,
    // borderBottomWidth: 1,
    // borderColor: "#ddd",
  },
  logo: {
    width: 80,
    height: 60,
    resizeMode: "contain",
    marginRight: "auto",
  },
  postButton: {
    marginLeft: "auto",
    borderRadius: 40,
    backgroundColor: "#000",
    paddingHorizontal: 10,
    paddingVertical: 5,
  },
  postButtonText: {
    color: "#fff",
  },
  middleContainer: {
    paddingHorizontal: 10,
    paddingVertical: 10,
  },
  middleContainerTop: {
    paddingHorizontal: 10,
    paddingVertical: 10,
    flexDirection: "row",
    gap: 10,
  },

  ProfileImage: {
    width: 45,
    height: 45,
    backgroundColor: "red",
    borderRadius: 50,
  },
  input: {
    flex: 1,
  },
  BottomContainerIcon: {
    alignItems: "center",
    paddingHorizontal: 10,
    position: "absolute",
    bottom: 10,
  },
  // inputContainer: {
  //   //flexDirection: 'row',
  //   justifyContent: 'left',
  //   alignItems: 'left',
  //   marginBottom: 50,
  //   paddingTop: 80,
  //   borderBottomWidth: 1,
  //   borderColor: '#ccc',

  // },

  // },
  // image: {
  //   width: 200,
  //   height: 200,
  //   marginBottom: 20,
  // },
  // button: {
  //   borderRadius: 10, // Adjust the border radius as needed
  //   overflow: 'hidden', // Ensure the border radius is applied correctly
  //   width:"40%",
  //   justifyContent:"center",
  //   alignSelf: "center",
  // },
});
