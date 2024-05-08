import React, { useContext, useEffect, useState } from "react";
import {
  Image,
  KeyboardAvoidingView,
  SafeAreaView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
  ActivityIndicator,
} from "react-native";
import * as ImagePicker from "expo-image-picker";
import { Picker } from "@react-native-picker/picker";
import { useNavigation } from "@react-navigation/native";
import axios from "axios";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { UserType } from "../UserContext";

const EditProfileScreen = () => {
  const navigation = useNavigation();
  const { userId, setUserId } = useContext(UserType);
  const [userProfile, setUserProfile] = useState(null);
  const [profilePicUploaded, setProfilePicUploaded] = useState(false);

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
        console.log("Current user", GetUser.data);
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

  const EditProfile = async () => {
    try {
      console.log("edit profile user id", userId);
      const authToken = await AsyncStorage.getItem("authToken");

      const updateFields = {};
      for (const key in userProfileData) {
        if (userProfileData[key] !== userProfile?.data?.[key] && userProfileData[key] !== '') {
          updateFields[key] = userProfileData[key];
        }
      }

      await axios.put(
        `https://levelart.up.railway.app/users/${userId}`,
        updateFields,
        {
          headers: {
            Authorization: `Bearer ${authToken}`,
          },
        }
      );
      console.log("Profile updated successfully", updateFields);
    } catch (error) {
      console.error("Error updating profile:", error.massage);
    }
    navigation.navigate("Profile");
    console.log(
      "userProfileData",
      userProfileData.profilePic,
      userProfileData.fullname,
      userProfileData.username,
      userProfileData.pronouns,
      userProfileData.bio,
      userProfileData.gender
    );
  };

  const [userProfileData, setUserProfileData] = useState({
    profilePic: "",
    fullname: "",
    username: "",
    pronouns: "",
    bio: "",
    gender: "",
  });

  const handleImagePicker = async () => {
    const permissionResult = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (permissionResult.granted === false) {
      alert("Permission to access camera roll is required!");
      return;
    }
  
    const pickerResult = await ImagePicker.launchImageLibraryAsync({
      allowsEditing: true, // Enable editing
      aspect: [1, 1], // Aspect ratio (square)
      quality: 1, // Image quality (from 0 to 1)
    });
  
    if (!pickerResult.canceled && pickerResult.assets.length > 0) {
      console.log("Selected image URI:", pickerResult.assets[0].uri); // Log the URI of the selected image
  
      setUserProfileData({
        ...userProfileData,
        profilePic: pickerResult.assets[0].uri,
      });
      setProfilePicUploaded(false);
    } else {
      console.log("Image picking cancelled or no image selected");
    }
  };
  

  return (
    <>
      <SafeAreaView style={styles.editProfileContainer}>
        <KeyboardAvoidingView style={{ flex: 1 }}>
          <View style={styles.editProfileTop}>
            <TouchableOpacity onPress={handleImagePicker}>
              {profilePicUploaded ? 
                <ActivityIndicator size="large" color="#0000ff" />
               : userProfile?.profilePic ? (
                <Image
                  style={styles.profileImage}
                  source={{
                    uri: userProfile?.profilePic,
                  }}
                />
              ) : userProfileData && userProfileData.profilePic ? (
                <Image
                  style={styles.profileImage}
                  source={{
                    uri: userProfileData.profilePic,
                  }}
                />
              ) : (
                <Image
                  style={styles.profileImage}
                  source={{
                    uri: "https://cdn-icons-png.flaticon.com/128/149/149071.png",
                  }}
                />
              )}
            </TouchableOpacity>
            <TouchableOpacity
              onPress={handleImagePicker}
              style={{ paddingVertical: 10 }}
            >
              <Text style={{ fontWeight: "500" }}>Edit picture</Text>
            </TouchableOpacity>
          </View>
          <View style={styles.editProfileTextInputContainer}>
            <Text>Name</Text>
            <TextInput
              value={userProfileData.fullname}
              onChangeText={(text) =>
                setUserProfileData({ ...userProfileData, fullname: text })
              }
              placeholderTextColor={"gray"}
              placeholder={userProfile?.fullname || ""}
              style={styles.editProfileTextInput}
            />
          </View>
          <View style={styles.editProfileTextInputContainer}>
            <Text>Username</Text>
            <TextInput
              value={userProfileData.username}
              onChangeText={(text) =>
                setUserProfileData({
                  ...userProfileData,
                  username: text,
                })
              }
              placeholderTextColor={"gray"}
              placeholder={userProfile?.username || ""}
              style={styles.editProfileTextInput}
            />
          </View>
          <View style={styles.editProfileTextInputContainer}>
            <Text>Pronouns</Text>
            <TextInput
              value={userProfileData.pronouns}
              onChangeText={(text) =>
                setUserProfileData({ ...userProfileData, pronouns: text })
              }
              placeholderTextColor={"gray"}
              placeholder={userProfile?.pronouns || ""}
              style={styles.editProfileTextInput}
            />
          </View>
          <View style={styles.editProfileTextInputContainer}>
            <Text>Bio</Text>
            <TextInput
              value={userProfileData.bio}
              onChangeText={(text) =>
                setUserProfileData({ ...userProfileData, bio: text })
              }
              placeholderTextColor={"gray"}
              placeholder={userProfile?.bio || ""}
              style={styles.editProfileTextInput}
            />
          </View>
          <View style={styles.editProfileTextInputContainer}>
            <Text>Gender</Text>
            <View style={styles.editProfiledropdown}>
              <Picker
                selectedValue={userProfileData.gender || userProfile?.gender || ""}
                onValueChange={(itemValue, itemIndex) =>
                  setUserProfileData({ ...userProfileData, gender: itemValue })
                }
              >
                <Picker.Item label="Select Gender" value="" />
                <Picker.Item label="Male" value="male" />
                <Picker.Item label="Female" value="female" />
                <Picker.Item label="Other" value="other" />
              </Picker>
            </View>
          </View>
          <View
            style={{
              justifyContent: "center",
              alignItems: "center",
              paddingVertical: 20,
            }}
          >
            <TouchableOpacity
              onPress={EditProfile}
              style={{
                backgroundColor: "#000",
                paddingHorizontal: 20,
                paddingVertical: 10,
                borderRadius: 30,
                color: "#fff",
              }}
            >
              <Text style={{ color: "#fff" }}>Submit</Text>
            </TouchableOpacity>
          </View>
        </KeyboardAvoidingView>
      </SafeAreaView>
    </>
  );
};

const styles = StyleSheet.create({
  editProfileContainer: {
    flex: 1,
  },
  profileImage: {
    width: 80,
    height: 80,
    borderRadius: 50,
    resizeMode: "cover",
  },
  editProfileTop: {
    justifyContent: "center",
    alignItems: "center",
    marginVertical: 10,
  },
  editProfileTextInput: {
    color: "gray",
    marginVertical: 10,
    fontSize: 16,
    borderBottomWidth: 1,
    borderBottomColor: "gray",
  },
  editProfileTextInputContainer: {
    paddingHorizontal: 10,
  },
  editProfiledropdown: {
    borderBottomWidth: 1,
    borderBottomColor: "gray",
  },
});

export default EditProfileScreen;
