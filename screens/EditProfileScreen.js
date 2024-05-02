import React, { useState } from "react";
import {
  Image,
  KeyboardAvoidingView,
  SafeAreaView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import * as ImagePicker from "expo-image-picker";
import { Picker } from "@react-native-picker/picker";
import { useNavigation } from "@react-navigation/native";

const EditProfileScreen = () => {
  const navigation = useNavigation();
  //   const [image, setImage] = useState(null);
  const [userProfileData, setUserProfileData] = useState({
    image: "",
    name: "",
    editprofileusername: "",
    pronouns: "",
    bio: "",
    gender: "",
  });

  const handleSubmitProfileData = () => {
    navigation.navigate("Profile", { userProfileData });
    console.log(
      userProfileData.image,
      userProfileData.name,
      userProfileData.editprofileusername,
      userProfileData.pronouns,
      userProfileData.bio,
      userProfileData.gender
    );
  };

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
        image: pickerResult.assets[0].uri,
      });
    } else {
      console.log("Image picking cancelled or no image selected");
    }
  };

  return (
    <>
      <SafeAreaView style={styles.editProfileContainer}>
        <KeyboardAvoidingView
          behavior={Platform.OS === "ios" ? "padding" : "height"}
          style={{ flex: 1 }}
        >
          <View style={styles.editProfileTop}>
            <TouchableOpacity onPress={handleImagePicker}>
              {userProfileData.image ? (
                <Image
                  style={styles.profileImage}
                  source={{
                    uri: userProfileData.image,
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
              value={userProfileData.name}
              onChangeText={(text) =>
                setUserProfileData({ ...userProfileData, name: text })
              }
              placeholderTextColor={"gray"}
              style={styles.editProfileTextInput}
            />
          </View>
          <View style={styles.editProfileTextInputContainer}>
            <Text>Username</Text>
            <TextInput
              value={userProfileData.editprofileusername}
              onChangeText={(text) =>
                setUserProfileData({
                  ...userProfileData,
                  editprofileusername: text,
                })
              }
              placeholderTextColor={"gray"}
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
              onPress={handleSubmitProfileData}
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
