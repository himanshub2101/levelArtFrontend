import React, { useState, useEffect } from "react";
import { StyleSheet, Text, View, Image, SafeAreaView, TextInput, Button, ActivityIndicator, TouchableOpacity } from "react-native";
import * as ImagePicker from 'expo-image-picker'; // Import Expo's ImagePicker module
import axios from "axios";
import AsyncStorage from "@react-native-async-storage/async-storage";
import jwt_decode from "jwt-decode";

const ThreadsScreen = () => {
  const [postedBy, setPostedBy] = useState("");
  const [content, setContent] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [img, setImage] = useState(null); // State to store selected image URI

  useEffect(() => {
    const fetchUserId = async () => {
      try {
        const tokenInThreadScreen = await AsyncStorage.getItem("authToken");
        const decodedToken = jwt_decode(tokenInThreadScreen);
        const userId = decodedToken?.sub; // Extract userId from decoded token
        console.log("userIdFromThreadScreen:", userId);
        if (userId) {
          setPostedBy(userId);
        } else {
          console.log("User ID not found in AsyncStorage");
        }
      } catch (error) {
        console.error("Error fetching userId from AsyncStorage:", error);
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchUserId();
  }, []);
  
  const handlePostSubmit = async () => {
    if (!content && !img) {
      console.log("Text field or image is required");
      return;
    }
  
    try {
      const authToken = await AsyncStorage.getItem("authToken");
      const postData = new FormData();
      postData.append("postedBy", postedBy); // Check if postedBy is set correctly
      postData.append("text", content);      // Check if content is set correctly
      if (img) {
        const uriParts = img.split(".");
        const fileType = uriParts[uriParts.length - 1];
        postData.append("image", {
          uri: img,
          name: `photo.${fileType}`,
          type: `image/${fileType}`,
        });
      }
  
      const response = await axios.post(
        "https://levelartbackend-production.up.railway.app/posts/create-post",
        postData,
        {
          headers: {
            Authorization: `Bearer ${authToken}`,
            "Content-Type": "multipart/form-data",
          },
        }
      );
  
      setContent("");
      setImage(null);
      console.log("Post created successfully:", response.data);
    } catch (error) {
      console.log("Error creating post:", error);
    }
  };
  
  

  const handleImagePicker = async () => {
    try {
      const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
      if (status !== 'granted') {
        console.log('Permission to access photo library denied');
        return;
      }
  
      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: true,
        aspect: [4, 3],
        quality: 1,
      });
      console.log("result:", result);
      if (!result.canceled && result.assets?.length > 0) {
        const selectedImageUri = result.assets[0].uri;
        console.log('Selected image URI:', selectedImageUri);
        setImage(selectedImageUri);
      } else {
        console.log('Image selection cancelled or no image selected');
      }
      
    } catch (error) {
      console.log('Error selecting image:', error);
    }
  };
  
  
  
  
  
  if (isLoading) {
    return (
      <SafeAreaView style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
        <ActivityIndicator size="large" color="black" />
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={{ padding: 10 }}>
      <View
        style={{
          flexDirection: "row",
          alignItems: "center",
          gap: 10,
          padding: 10,
        }}
      >
        <Image
          style={{
            width: 40,
            height: 40,
            borderRadius: 20,
            resizeMode: "contain",
          }}
          source={{
            uri: "https://cdn-icons-png.flaticon.com/128/149/149071.png",
          }}
        />
      </View>

      <View style={{ flexDirection: "row", marginLeft: 10 }}>
        <TextInput
          value={content}
          onChangeText={(text) => setContent(text)}
          placeholderTextColor={"black"}
          placeholder="Type your message..."
          multiline
        />
      </View>

      <TouchableOpacity onPress={handleImagePicker}>
        <View style={{ marginTop: 10, alignItems: 'center' }}>
          <Text>Add Image</Text>
        </View>
      </TouchableOpacity>

      {img && (
        <Image
          source={{ uri: img }}
          style={{ width: 200, height: 200, marginTop: 10 }}
        />
      )}

      <View style={{ marginTop: 20 }} />

      <Button onPress={handlePostSubmit} title="Share Post" />
    </SafeAreaView>
  );
};

export default ThreadsScreen;

const styles = StyleSheet.create({});
