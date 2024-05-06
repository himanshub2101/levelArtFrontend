import React, { useState } from "react";
import {
  StyleSheet,
  Text,
  View,
  SafeAreaView,
  Pressable,
  TextInput,
  KeyboardAvoidingView,
  Image,
  Alert,
  ScrollView,
  TouchableOpacity,
} from "react-native";
import { MaterialIcons } from "@expo/vector-icons";
import { AntDesign } from "@expo/vector-icons";
import { Ionicons } from "@expo/vector-icons";
import { useNavigation } from "@react-navigation/native";
import { Picker } from "@react-native-picker/picker";
import facebooklogo from "../assets/facebookLogo.png";
import GoogleLogo from "../assets/googleLogo.png";
import logo from "../assets/logo.png";
import axios from "axios";
import AsyncStorage from "@react-native-async-storage/async-storage";
import ArtistForm from "../components/forms/artist";
import VisitorsForm from "../components/forms/visitors";
import ProductionForm from "../components/forms/production";
// import * as AuthSession from "expo-auth-session";
// import * as Facebook from "expo-facebook";

const RegisterScreen = () => {
  const [username, setUserName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmpassword, setConfirmPassword] = useState("");
  const [phonenumber, setPhoneNumber] = useState("");
  const [userType, setUserType] = useState("artist");
  const [nameError, setNameError] = useState({ isError: false, message: "" });
  const [emailError, setEmailError] = useState({ isError: false, message: "" });
  const [passwordError, setPasswordError] = useState({
    isError: false,
    message: "",
  });
  const [confirmPasswordError, setConfirmPasswordError] = useState({
    isError: false,
    message: "",
  });
  const [phoneNumberError, setPhoneNumberError] = useState({
    isError: false,
    message: "",
  });

  const handleGoogleLogin = async () => {
    // try {
    //   const { type, accessToken, user } = await AuthSession.startAsync({
    //     authUrl:
    //       "https://accounts.google.com/o/oauth2/v2/auth" +
    //       "?client_id=YOUR_GOOGLE_CLIENT_ID" +
    //       "&redirect_uri=YOUR_REDIRECT_URI" +
    //       "&response_type=token" +
    //       "&scope=email profile",
    //   });
    //   if (type === "success") {
    //     // Handle successful Google login
    //     console.log("Google login successful", { accessToken, user });
    //   }
    // } catch (error) {
    //   console.error("Google login error", error);
    // }
  };

  const handleFacebookLogin = async () => {
    // try {
    //   await Facebook.initializeAsync({
    //     appId: "YOUR_FACEBOOK_APP_ID",
    //   });
    //   const { type, token } = await Facebook.logInWithReadPermissionsAsync({
    //     permissions: ["public_profile", "email"],
    //   });
    //   if (type === "success") {
    //     // Handle successful Facebook login
    //     console.log("Facebook login successful", token);
    //   }
    // } catch (error) {
    //   console.error("Facebook login error", error);
    // }
  };

  const navigation = useNavigation();

  const renderForm = () => {
    switch (userType) {
      case "artist":
        return <ArtistForm />;
      case "visitors":
        return <VisitorsForm />;
      case "production":
        return <ProductionForm />;
      default:
        return null;
    }
  };
  const handleNameChange = (text) => {
    setUserName(text);
    if (nameError.isError) {
      setNameError({ isError: false, message: "" });
    }
  };

  const handleEmailChange = (text) => {
    const normalizedEmail = text.trim().toLowerCase();

    setEmail(normalizedEmail);
    if (emailError.isError) {
      setEmailError({ isError: false, message: "" });
    }
  };

  const handlePasswordChange = (text) => {
    setPassword(text);
    if (passwordError.isError) {
      setPasswordError({ isError: false, message: "" });
    }
  };

  const handleConfirmPasswordChange = (text) => {
    setConfirmPassword(text);
    if (confirmPasswordError.isError) {
      setConfirmPasswordError({ isError: false, message: "" });
    }
  };

  const handlePhoneNumberChange = (text) => {
    setPhoneNumber(text);
    if (phoneNumberError.isError) {
      setPhoneNumberError({ isError: false, message: "" });
    }
  };

  const handleRegister = () => {
    let hasError = false;
    const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!username) {
      setNameError({ isError: true, message: "Please enter your name" });
      hasError = true;
    }
    if (!email || !emailPattern.test(email)) {
      setEmailError({ isError: true, message: "Please enter your email" });
      hasError = true;
    }
    if (!password) {
      setPasswordError({
        isError: true,
        message: "Please enter your password",
      });
      hasError = true;
    }
    if (!confirmpassword) {
      setConfirmPasswordError({
        isError: true,
        message: "Please confirm your password",
      });
      hasError = true;
    }
    if (password !== confirmpassword) {
      setPasswordError({ isError: true, message: "Passwords do not match" });
      setConfirmPasswordError({
        isError: true,
        message: "Passwords do not match",
      });
      hasError = true;
    }
    if (!phonenumber) {
      setPhoneNumberError({
        isError: true,
        message: "Please enter your phone number",
      });
      hasError = true;
    }

    if (hasError) return;

    const user = {
      username: username,
      email: email,
      password: password,
      confirmpassword: confirmpassword,
      phonenumber: phonenumber,
      userType: userType, // Include userType in the user object
    };

    axios
      .post("https://levelart.up.railway.app/users/register", user)
      .then((response) => {
        console.log(response);
        Alert.alert(
          "Registration successful",
          "You have been registered successfully"
        );

        console.log("userID from Register Screen", response.data._id);

        AsyncStorage.clear();

        AsyncStorage.setItem("userId", response.data._id);
        switch (userType) {
          case "artist":
            navigation.navigate("Artist");
            break;
          case "visitors":
            navigation.navigate("Visitors");
            break;
          case "production":
            navigation.navigate("Production");
            break;
          default:
            // Navigate to a default screen if user type is not recognized
            navigation.navigate("DefaultScreen");
            break;
        }
        navigation.navigate("Login");
        setUserName("");
        setEmail("");
        setPassword("");
        setConfirmPassword("");
        setPhoneNumber("");
      })
      .catch((error) => {
        console.log("error.response:", error.response);
        console.log("error.response.data:", error.response.data);

        if (error.response.data.message === "Email is already registred") {
          // If email is already registered, display an error message
          setEmailError({
            isError: true,
            message:
              "This email is already registered. Please use a different email address.",
          });
        } else if (
          error.response &&
          error.response.data &&
          error.response.data.error === "Username already registered"
        ) {
          // If username is already registered, display an error message
          setNameError({
            isError: true,
            message:
              "This username is already registered. Please use a different username.",
          });
        } else if (
          error.response.data.message === "Phone number is already registred"
        ) {
          // If phone number is already registered, display an error message
          setPhoneNumberError({
            isError: true,
            message:
              "This phone number is already registered. Please use a different phone number.",
          });
        } else {
          // Handle other errors
          Alert.alert(
            "Registration failed",
            "An error occurred during registration"
          );
        }
        console.log("error", error);
      });
  };

  return (
    <SafeAreaView
      style={{ flex: 1, backgroundColor: "white", alignItems: "center" }}
    >
      <ScrollView
        contentContainerStyle={styles.scrollViewContent}
        showsVerticalScrollIndicator={false}
      >
        <View style={{ marginTop: 50 }}>
          <Image
            style={{ width: 150, height: 100, resizeMode: "contain" }}
            source={logo}
          />
        </View>

        <KeyboardAvoidingView>
          <View style={{ alignItems: "center", justifyContent: "center" }}>
            <Text style={{ fontSize: 17, fontWeight: "bold", marginTop: 25 }}>
              Register to Your Account
            </Text>
          </View>

          <View style={{ marginTop: 40, gap: 10 }}>
            <View>
              <View style={styles.inputContainer}>
                <Ionicons
                  style={{ marginLeft: 8 }}
                  name="person"
                  size={24}
                  color="gray"
                />
                <TextInput
                  value={username}
                  onChangeText={handleNameChange}
                  placeholderTextColor={"gray"}
                  style={styles.input}
                  placeholder="Enter your user name"
                />
              </View>
              {nameError.isError && (
                <Text style={styles.errorMessage}>{nameError.message}</Text>
              )}
            </View>
            <View>
              <View style={styles.inputContainer}>
                <MaterialIcons
                  style={{ marginLeft: 8 }}
                  name="email"
                  size={24}
                  color="gray"
                />
                <TextInput
                  value={email}
                  onChangeText={handleEmailChange}
                  placeholderTextColor={"gray"}
                  style={styles.input}
                  placeholder="enter your Email"
                  autoCapitalize="none"
                  autoCorrect={false}
                />
              </View>
              {emailError.isError && (
                <Text style={styles.errorMessage}>{emailError.message}</Text>
              )}
            </View>
            <View>
              <View style={styles.inputContainer}>
                <AntDesign
                  style={{ marginLeft: 8 }}
                  name="lock"
                  size={24}
                  color="gray"
                />
                <TextInput
                  secureTextEntry={true}
                  value={password}
                  onChangeText={handlePasswordChange}
                  placeholderTextColor={"gray"}
                  style={styles.input}
                  placeholder="enter your Password"
                />
              </View>
              {passwordError.isError && (
                <Text style={styles.errorMessage}>{passwordError.message}</Text>
              )}
            </View>
            <View>
              <View style={styles.inputContainer}>
                <AntDesign
                  style={{ marginLeft: 8 }}
                  name="lock"
                  size={24}
                  color="gray"
                />
                <TextInput
                  secureTextEntry={true}
                  value={confirmpassword}
                  onChangeText={handleConfirmPasswordChange}
                  placeholderTextColor={"gray"}
                  style={styles.input}
                  placeholder="Confirm Password"
                />
              </View>
              {confirmPasswordError.isError && (
                <Text style={styles.errorMessage}>
                  {confirmPasswordError.message}
                </Text>
              )}
            </View>
            <View>
              <View style={styles.inputContainer}>
                <MaterialIcons
                  style={{ marginLeft: 8 }}
                  name="phone"
                  size={24}
                  color="gray"
                />
                <TextInput
                  value={phonenumber}
                  onChangeText={handlePhoneNumberChange}
                  placeholderTextColor="gray"
                  keyboardType="numeric"
                  style={styles.input}
                  placeholder="Enter your Phone Number"
                />
              </View>
              {phoneNumberError.isError && (
                <Text style={styles.errorMessage}>
                  {phoneNumberError.message}
                </Text>
              )}
            </View>
            {/* User Type Dropdown */}
            <View style={styles.dropdownContainer}>
              <MaterialIcons
                style={styles.inputIcon}
                name="person"
                size={24}
                color="gray"
              />
              <Picker
                selectedValue={userType}
                style={styles.dropdown}
                onValueChange={(itemValue, itemIndex) => setUserType(itemValue)}
              >
                <Picker.Item label="Artist" value="artist" />
                <Picker.Item label="Visitors" value="visitors" />
                <Picker.Item label="Production" value="production" />
              </Picker>
            </View>
          </View>

          <View style={{ marginTop: 10 }} />

          {/* Use Pressable to handle login action */}
          <Pressable
            onPress={handleRegister}
            style={({ pressed }) => [
              {
                width: 200,
                backgroundColor: pressed ? "gray" : "black",
                padding: 15,
                marginTop: 5,
                marginLeft: "auto",
                marginRight: "auto",
                borderRadius: 6,
              },
            ]}
          >
            <Text
              style={{
                textAlign: "center",
                fontWeight: "bold",
                fontSize: 16,
                color: "white",
              }}
            >
              Register
            </Text>
          </Pressable>

          <Pressable
            onPress={() => navigation.navigate("Login")}
            style={{ marginTop: 10 }}
          >
            <Text style={{ textAlign: "center", fontSize: 16 }}>
              Already have an account? Sign In
            </Text>
          </Pressable>
          <View
            style={{
              flexDirection: "row",
              flex: 1,
              gap: 40,
              justifyContent: "center",
              marginTop: 20,
            }}
          >
            <TouchableOpacity
              onPress={handleGoogleLogin}
              style={{
                backgroundColor: "#fff",
                borderColor: "#e0e0e0",
                borderRadius: 50,
                borderWidth: 1,
                width: 43,
                height: 43,
                justifyContent: "center",
                alignItems: "center",
              }}
            >
              <Image
                source={GoogleLogo}
                style={{
                  width: 40,
                  height: 40,
                  overflow: "hidden",
                  borderRadius: 50,
                }}
              />
            </TouchableOpacity>
            <TouchableOpacity onPress={handleFacebookLogin}>
              <Image
                source={facebooklogo}
                style={{
                  width: 40,
                  height: 40,
                  overflow: "hidden",
                  borderRadius: 50,
                }}
              />
            </TouchableOpacity>
          </View>
        </KeyboardAvoidingView>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    // alignItems: "center",
    // justifyContent: "center",
    // paddingHorizontal: 20,
  },
  scrollViewContent: {
    flexGrow: 1,
    alignItems: "center",
    paddingVertical: 20,
  },
  logoContainer: {
    marginTop: 50,
  },
  logo: {
    width: 150,
    height: 100,
    resizeMode: "contain",
  },
  title: {
    fontSize: 17,
    fontWeight: "bold",
    marginTop: 25,
    marginBottom: 20,
  },
  inputContainer: {
    flexDirection: "row",
    alignItems: "center",
    gap: 5,
    borderColor: "#D0D0D0",
    borderWidth: 1,
    paddingVertical: 5,
    borderRadius: 5,
  },

  input: {
    color: "gray",
    marginVertical: 10,
    width: 300,
    fontSize: 16,
  },
  button: {
    backgroundColor: "black",
    padding: 15,
    marginTop: 20,
    borderRadius: 6,
    width: "100%",
    alignItems: "center",
  },
  buttonText: {
    color: "white",
    fontWeight: "bold",
    fontSize: 16,
  },
  signInText: {
    marginTop: 10,
  },
  errorMessage: {
    color: "red",
    // marginTop: 5,
    width: "100%",
  },
  // Add the following styles to the existing styles object in your RegisterScreen component:

  dropdownContainer: {
    flexDirection: "row",
    alignItems: "center",
    borderWidth: 1,
    borderColor: "#D0D0D0",
    borderRadius: 5,
    paddingHorizontal: 10,
    marginVertical: 10,
    width: "100%",
    height: 50, // Adjust the height of the dropdown container
    overflow: "hidden", // Hide overflowing content
  },
  dropdownIcon: {
    position: "absolute",
    right: 10,
  },
  dropdown: {
    flex: 1,
    color: "gray",
    fontSize: 16,
    paddingHorizontal: 10,
    borderWidth: 0,
  },
});

export default RegisterScreen;
