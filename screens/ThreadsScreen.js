import React, { useState, useEffect } from "react";
import { StyleSheet, Text, View, Image, SafeAreaView, TextInput, Button, ActivityIndicator, TouchableOpacity } from "react-native";
import { Ionicons } from '@expo/vector-icons'; // Import Ionicons for the image icon
import * as ImagePicker from 'expo-image-picker'; // Import Expo's ImagePicker module
import axios from "axios";
import AsyncStorage from "@react-native-async-storage/async-storage";
import jwt_decode from "jwt-decode";

const ThreadsScreen = () => {
  const [content, setContent] = useState('');
  const [image, setImage] = useState(null);
  const [isLoading, setIsLoading] = useState(false);

  const handleImagePicker = async () => {
    const permissionResult = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (permissionResult.granted === false) {
      alert('Permission to access camera roll is required!');
      return;
    }
  
    const pickerResult = await ImagePicker.launchImageLibraryAsync();
    if (!pickerResult.canceled && pickerResult.assets.length > 0) {
      console.log("Selected image URI:", pickerResult.assets[0].uri); // Log the URI of the selected image
  
      setImage(pickerResult.assets[0].uri);
    } else {
      console.log("Image picking cancelled or no image selected");
    }
  };
  

  const handlePostSubmit = async () => {
    setIsLoading(true);
  
    try {
      const authToken = await AsyncStorage.getItem('authToken');
      const decodedToken = jwt_decode(authToken);
      const userId = decodedToken.sub; // Extract user ID from the token
  
      const formData = new FormData();
      formData.append('text', content);
      formData.append('postedBy', userId); // Include the user ID as the "postedBy" field
  
      if (image) {
        const localUri = image;
        const filename = localUri.split('/').pop();
        const match = /\.(\w+)$/.exec(filename);
        const type = match ? `image/${match[1]}` : 'image';
        formData.append('img', { uri: localUri, name: filename, type }); // Change 'image' to 'img'
      }
  
      const response = await axios.post('https://levelart.up.railway.app/posts/create-post', formData, {
      headers: {
          'Content-Type': 'multipart/form-data',
          'Authorization': `Bearer ${authToken}`,
        },
      });
      
      AsyncStorage.setItem("postId", response.data._id);

      console.log('Post created successfully:', response.data._id);
      // Reset form fields
      setContent('');
      setImage(null);

    } catch (error) {
      console.error('Error creating post:', error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <View style={styles.container}>
    <View style={{ flex: 1, padding: 50 }}>
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
  <Button
    title="Share Post"
    onPress={handlePostSubmit}
    disabled={isLoading}
    color={"black"}
  />
</View>

      {isLoading && <ActivityIndicator />}
    </View>
    </View>
  );
};

export default ThreadsScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: 20,
    paddingTop: 65,
    backgroundColor: 'white',
  },
  inputContainer: {
    //flexDirection: 'row',
    justifyContent: 'left',
    alignItems: 'left',
    marginBottom: 50,
    paddingTop: 80,
    borderBottomWidth: 1,
    borderColor: '#ccc',

  },
  input: {
    flex: 1,
    borderWidth: 1,
    borderColor: 'lightgray',
    borderRadius: 25,
    padding:50,
    
  },
  image: {
    width: 200,
    height: 200,
    marginBottom: 20,
  },
  button: {
    borderRadius: 10, // Adjust the border radius as needed
    overflow: 'hidden', // Ensure the border radius is applied correctly
    width:"40%",
    justifyContent:"center",
    alignSelf: "center",
  },
});
