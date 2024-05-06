// Import necessary modules and components
import {
  StyleSheet,
  Text,
  View,
  SafeAreaView,
  Image,
  KeyboardAvoidingView,
  TextInput,
  Pressable,
  Alert,
  TouchableOpacity,
} from "react-native";
import React, { useState, useEffect } from "react";
import { MaterialIcons } from "@expo/vector-icons";
import { AntDesign } from "@expo/vector-icons";
import { useNavigation } from "@react-navigation/native";
import axios from "axios";
import AsyncStorage from "@react-native-async-storage/async-storage";
import logo from "../assets/logo.png";
import facebooklogo from "../assets/facebookLogo.png";
import GoogleLogo from "../assets/googleLogo.png";
// Define the LoginScreen component
const LoginScreen = () => {
  // Define state variables
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [emailError, setEmailError] = useState({ isError: false, message: "" });
  const [passwordError, setPasswordError] = useState({
    isError: false,
    message: "",
  });
  const navigation = useNavigation();

  // Effect hook to check login status on component mount
  useEffect(() => {
    const checkLoginStatus = async () => {
      try {
        const token = await AsyncStorage.getItem("authToken");
        console.log("token:", token);
        if (token) {
          setTimeout(() => {
            navigation.replace("Main");
          }, 400);
        }
      } catch (error) {
        console.log("error", error);
      }
    };

    checkLoginStatus();
  }, []);

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

  const handleLogin = async () => {
    // if (!email || !password) {
    //   Alert.alert("Email and password are required");
    //   return;
    // }
    const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    let hasError = false;
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
    if (hasError) return;

    try {
      const user = {
        email: email,
        password: password,
      };

      // Use axios.post which returns a promise
      const response = await axios.post(
        "https://levelart.up.railway.app/auth/login",
        user
      );

      // Check if the response status is 200 (OK)
      if (response.status === 200) {
        const token = response.data.access_token;
        await AsyncStorage.setItem("authToken", token); // Save token to AsyncStorage

        console.log(response.data);
        navigation.navigate("Main", { authToken: token });
      } else {
        // Unexpected response status
        console.log("Unexpected response status:", response.status);
        Alert.alert(
          "Error",
          "An unexpected error occurred. Please try again later."
        );
      }
    } catch (error) {
      if (error.response) {
        // Server responded with an error status
        if (error.response.status === 401) {
          // Unauthorized: Incorrect credentials
          Alert.alert(
            "Login failed",
            "Incorrect email or password. Please try again."
          );
        } else {
          // Other server errors
          console.log("Server error:", error.response.data);
          Alert.alert(
            "Login error",
            error.response.data.message || "An error occurred on the server."
          );
        }
      } else if (error.request) {
        // No response received
        console.log("Network error:", error.request);
        Alert.alert("Network error", "Please check your network connection.");
      } else {
        // Other errors
        console.log("Error:", error.message);
        Alert.alert("Error", "An error occurred. Please try again later.");
      }
    }
  };

  // Function to handle login
  // Function to handle login
  // const handleLogin = async () => {
  //   try {
  //     const user = {
  //       email: email,
  //       password: password,
  //     };

  //     const response = await axios.post("http://localhost:3000/auth/login", user);
  //     console.log(response);

  //     const token = response.data.token;
  //     await AsyncStorage.setItem("authToken", token);
  //     navigation.navigate('Main', { authToken: token });
  //   } catch (error) {
  //     if (error.response) {
  //       console.log("Server error:", error.response.data);
  //       Alert.alert("Login error", error.response.data.message);
  //     } else if (error.request) {
  //       console.log("Network error:", error.request);
  //       Alert.alert("Network error", "Please check your network connection");
  //     } else {
  //       console.log("Error:", error.message);
  //       Alert.alert("Error", "An error occurred. Please try again later");
  //     }
  //   }
  // };

  // Render the LoginScreen component
  return (
    <SafeAreaView
      style={{ flex: 1, backgroundColor: "white", alignItems: "center" }}
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
            Login to Your Account
          </Text>
        </View>

        <View style={{ marginTop: 40 }}>
          <View
            style={{
              flexDirection: "row",
              alignItems: "center",
              gap: 5,
              borderColor: "#D0D0D0",
              borderWidth: 1,
              paddingVertical: 5,
              borderRadius: 5,
            }}
          >
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
              style={{
                color: "gray",
                marginVertical: 10,
                width: 300,
                fontSize: email ? 16 : 16,
              }}
              placeholder="enter your Email"
              autoCapitalize="none"
              autoCorrect={false}
            />
          </View>
          {emailError.isError && (
            <Text style={styles.errorMessage}>{emailError.message}</Text>
          )}

          <View style={{ marginTop: 30 }}>
            <View
              style={{
                flexDirection: "row",
                alignItems: "center",
                gap: 5,
                borderColor: "#D0D0D0",
                borderWidth: 1,
                paddingVertical: 5,
                borderRadius: 5,
              }}
            >
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
                style={{
                  color: "gray",
                  marginVertical: 10,
                  width: 300,
                  fontSize: password ? 16 : 16,
                }}
                placeholder="enter your Password"
                autoCapitalize="none"
                autoCorrect={false}
              />
            </View>
            {passwordError.isError && (
              <Text style={styles.errorMessage}>{passwordError.message}</Text>
            )}
          </View>

          <View
            style={{
              flexDirection: "row",
              alignItems: "center",
              justifyContent: "space-between",
              marginTop: 12,
            }}
          >
            <Text>Keep me logged in</Text>
            <Text style={{ fontWeight: "500", color: "#007FFF" }}>
              Forgot Password
            </Text>
          </View>
        </View>

        <View style={{ marginTop: 45 }} />

        {/* Use Pressable to handle login action */}
        <Pressable
          onPress={handleLogin}
          style={({ pressed }) => [
            {
              width: 200,
              backgroundColor: pressed ? "gray" : "black",
              padding: 15,
              marginTop: 40,
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
            Login
          </Text>
        </Pressable>

        <Pressable
          onPress={() => navigation.navigate("Register")}
          style={{ marginTop: 10 }}
        >
          <Text style={{ textAlign: "center", fontSize: 16 }}>
            Don't have an account? Sign up
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
          <TouchableOpacity>
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
    </SafeAreaView>
  );
};

// Export the LoginScreen component
export default LoginScreen;

// Define styles for the LoginScreen component
const styles = StyleSheet.create({
  errorMessage: {
    color: "red",
    // marginTop: 5,
    width: "100%",
  },
});
