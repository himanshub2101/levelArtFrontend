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
import axios from 'axios';
import AsyncStorage from "@react-native-async-storage/async-storage";
import { UserType } from "../UserContext";

const EditProfileScreen = () => {
  const navigation = useNavigation();
  const { userId, setUserId } = useContext(UserType);
  const [userProfile, setUserProfille] = useState(null);
  const [profilePicUploaded, setProfilePicUploaded] = useState(false);
  
  useEffect(()=>{
 const fetchUpdateUser = async(userId)=>{
  try{

    const authToken = await AsyncStorage.getItem("authToken");
    const GetUser = await axios.get(
      `https://levelart.up.railway.app/users/${userId}`,
      {
        headers: {
          Authorization: `Bearer ${authToken}`,
        },
      }
      
    )
    setUserProfille(GetUser.data);
    console.log( 'all user',GetUser.data)
  }
  catch(error) {
    console.error("Error fetching replies:", error);
  };
}
if (userId) {
  fetchUpdateUser(userId);
} else {
  console.log("userId is undefined");
}
},[userId])

 const EditProfile = async () => {
    try {
      console.log("edit profile user id", userId);
      const authToken = await AsyncStorage.getItem("authToken");

      await axios.put(
        `https://levelart.up.railway.app/users/${userId}`,
        userProfileData ,
        {
          headers: {
            Authorization: `Bearer ${authToken}`,
          },
        }
      );
      console.log("Bio updated successfully",userProfileData);
    } catch (error) {
      console.error("Error updating bio:", error.massge);
    }
    navigation.navigate("Profile", { userProfileData });
    console.log(
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
    const permissionResult =
      await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (permissionResult.granted === false) {
      alert("Permission to access camera roll is required!");
      return;
    }

    const pickerResult = await ImagePicker.launchImageLibraryAsync();
    if (!pickerResult.canceled && pickerResult.assets.length > 0) {
      console.log("Selected image URI:", pickerResult.assets[0].uri); // Log the URI of the selected image

      setUserProfileData({
        ...userProfileData,
        profilePic: pickerResult.assets[0].uri,
      });
      setProfilePicUploaded(true);
    } else {
      console.log("Image picking cancelled or no image selected");
    }
  };

  return (
    <>
      <SafeAreaView style={styles.editProfileContainer}>
        <KeyboardAvoidingView
          style={{ flex: 1 }}
        >
        
          <View style={styles.editProfileTop}>
            <TouchableOpacity onPress={handleImagePicker}>
            {profilePicUploaded ?(
          <ActivityIndicator size="large" color="#0000ff" />
        ):(

               userProfile?.data && userProfile?.data.profilePic ? (
                <Image
                  style={styles.profileImage}
                  source={{
                    uri: userProfile?.data.profilePic,
                  }}
                />
              ) :
                userProfileData && userProfileData.profilePic ? (
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
              )
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
              placeholder={userProfile?.data?.fullname ? userProfile.data.fullname : ""}
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
              placeholder={userProfile?.data?.username ? userProfile.data.username : ""}
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
              placeholder={userProfile?.data?.pronouns ? userProfile.data.pronouns : ""}
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
              placeholder={userProfile?.data?.bio ? userProfile.data.bio : ""}
              style={styles.editProfileTextInput}
            />
          </View>
          <View style={styles.editProfileTextInputContainer}>
            <Text>Gender</Text>
            <View style={styles.editProfiledropdown}>
              <Picker
                selectedValue={userProfileData.gender}
                onValueChange={(itemValue, itemIndex) =>
                  setUserProfileData({ ...userProfileData, gender: itemValue })
                }
              >
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
