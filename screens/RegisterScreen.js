import React, { useState } from "react";
import {StyleSheet,Text,View,SafeAreaView,Pressable,TextInput,KeyboardAvoidingView,Image,Alert,ScrollView,Platform,} from "react-native";
import { MaterialIcons } from "@expo/vector-icons";
import { AntDesign } from "@expo/vector-icons";
import { Ionicons } from "@expo/vector-icons";
import { useNavigation } from "@react-navigation/native";
import logo from "../assets/logo.png";
import axios from "axios";
import AsyncStorage from "@react-native-async-storage/async-storage";

const RegisterScreen = () => {
  const [username, setUserName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmpassword, setConfirmPassword] = useState("");
  const [phonenumber, setPhoneNumber] = useState("");
  const [nameError, setNameError] = useState({ isError: false, message: "" });
  const [emailError, setEmailError] = useState({ isError: false, message: "" });
  const [passwordError, setPasswordError] = useState({ isError: false, message: "" });
  const [confirmPasswordError, setConfirmPasswordError] = useState({ isError: false, message: "" });
  const [phoneNumberError, setPhoneNumberError] = useState({ isError: false, message: "" });

  const navigation = useNavigation();

  const handleNameChange = (text) => {
    setUserName(text);
    if (nameError.isError) {
      setNameError({ isError: false, message: "" });
    }
  };

  const handleEmailChange = (text) => {
    setEmail(text);
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
    if (!username) {
      setNameError({ isError: true, message: "Please enter your name" });
      hasError = true;
    }
    if (!email) {
      setEmailError({ isError: true, message: "Please enter your email" });
      hasError = true;
    }
    if (!password) {
      setPasswordError({ isError: true, message: "Please enter your password" });
      hasError = true;
    }
    if (!confirmpassword) {
      setConfirmPasswordError({ isError: true, message: "Please confirm your password" });
      hasError = true;
    }
    if (password !== confirmpassword) {
      setPasswordError({ isError: true, message: "Passwords do not match" });
      setConfirmPasswordError({ isError: true, message: "Passwords do not match" });
      hasError = true;
    }
    if (!phonenumber) {
      setPhoneNumberError({ isError: true, message: "Please enter your phone number" });
      hasError = true;
    }
  
    if (hasError) return;
  
    const user = {
      username: username,
      email: email,
      password: password,
      confirmpassword: confirmpassword,
      phonenumber: phonenumber
    };
  
  
    axios.post("http://localhost:3000/users/register", user)
    .then((response) => {
        console.log(response);
        Alert.alert(
          "Registration successful",
          "You have been registered successfully"
        );
  
        console.log("userID from Register Screen",response.data._id)
        
         AsyncStorage.clear();

        AsyncStorage.setItem("userId", response.data._id);
  
        navigation.navigate("Login")
        setUserName("");
        setEmail("");
        setPassword("");
        setConfirmPassword("");
        setPhoneNumber("");
      })
      .catch((error) => {
        console.log("error.response:", error.response)
        console.log("error.response.data:", error.response.data)
  
        if ( error.response.data.message  === "Email is already registred") {
          // If email is already registered, display an error message
          setEmailError({ isError: true, message: "This email is already registered. Please use a different email address." });
        } 
        else if (error.response && error.response.data && error.response.data.error === "Username already registered") {
          // If username is already registered, display an error message
          setNameError({ isError: true, message: "This username is already registered. Please use a different username." });
        } 
        else if (error.response.data.message === "Phone number is already registred") {
          // If phone number is already registered, display an error message
          setPhoneNumberError({ isError: true, message: "This phone number is already registered. Please use a different phone number." });
        } 
        else {
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
    <SafeAreaView style={{ flex: 1, backgroundColor: "white" }}>
      <KeyboardAvoidingView
        style={{ flex: 1 }}
        behavior={Platform.OS === "ios" ? "padding" : "height"}
      >
        <ScrollView contentContainerStyle={{ flexGrow: 1 }}>
          <View style={styles.container}>
            <View style={styles.logoContainer}>
              <Image
                style={styles.logo}
                source={logo}
              />
            </View>

            <Text style={styles.title}>Register to Your Account</Text>

            <View style={styles.inputContainer}>
              <Ionicons
                style={styles.inputIcon}
                name="person"
                size={24}
                color="gray"
              />
              <TextInput
                value={username}
                onChangeText={handleNameChange}
                placeholderTextColor="gray"
                style={styles.input}
                placeholder="Enter your Name"
              />
            </View>
            {nameError.isError && <Text style={styles.errorMessage}>{nameError.message}</Text>}

            <View style={styles.inputContainer}>
              <MaterialIcons
                style={styles.inputIcon}
                name="email"
                size={24}
                color="gray"
              />
              <TextInput
                value={email}
                onChangeText={handleEmailChange}
                placeholderTextColor="gray"
                style={styles.input}
                placeholder="Enter your Email"
              />
            </View>
            {emailError.isError && <Text style={styles.errorMessage}>{emailError.message}</Text>}

            <View style={styles.inputContainer}>
              <AntDesign
                style={styles.inputIcon}
                name="lock"
                size={24}
                color="gray"
              />
              <TextInput
                secureTextEntry={true}
                value={password}
                onChangeText={handlePasswordChange}
                placeholderTextColor="gray"
                style={styles.input}
                placeholder="Enter your Password"
              />
            </View>
            {passwordError.isError && <Text style={styles.errorMessage}>{passwordError.message}</Text>}

            <View style={styles.inputContainer}>
              <AntDesign
                style={styles.inputIcon}
                name="lock"
                size={24}
                color="gray"
              />
              <TextInput
                secureTextEntry={true}
                value={confirmpassword}
                onChangeText={handleConfirmPasswordChange}
                placeholderTextColor="gray"
                style={styles.input}
                placeholder="Confirm Password"
              />
            </View>
            {confirmPasswordError.isError && <Text style={styles.errorMessage}>{confirmPasswordError.message}</Text>}

            <View style={styles.inputContainer}>
              <MaterialIcons
                style={styles.inputIcon}
                name="phone"
                size={24}
                color="gray"
              />
              <TextInput
                value={phonenumber}
                onChangeText={handlePhoneNumberChange}
                placeholderTextColor="gray"
                style={styles.input}
                placeholder="Enter your Phone Number"
              />
            </View>
            {phoneNumberError.isError && <Text style={styles.errorMessage}>{phoneNumberError.message}(</Text>}

            <Pressable
              onPress={handleRegister}
              style={styles.button}
            >
              <Text style={styles.buttonText}>Register</Text>
            </Pressable>

            <Pressable
              onPress={() => navigation.goBack()}
              style={styles.signInText}
            >
              <Text>Already have an account? Sign In</Text>
            </Pressable>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: 20,
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
    borderWidth: 1,
    borderColor: "#D0D0D0",
    borderRadius: 5,
    paddingVertical: 5,
    paddingHorizontal: 10,
    marginVertical: 10,
    width: "100%",
  },
  inputIcon: {
    marginRight: 8,
  },
  input: {
    flex: 1,
    color: "gray",
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
    marginTop: 5,
    width: "100%",
  },
});

export default RegisterScreen;
