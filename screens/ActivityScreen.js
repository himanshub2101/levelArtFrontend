import React, { useState, useEffect, useContext } from "react";
import { ScrollView, View, Text, TouchableOpacity, StyleSheet } from "react-native";
import axios from "axios";
import AsyncStorage from "@react-native-async-storage/async-storage";
import jwt_decode from "jwt-decode";
import User from "../components/User";
import { UserType } from "../UserContext";

const ActivityScreen = () => {
  const [selectedButton, setSelectedButton] = useState("people");
  const [users, setUsers] = useState([]);
  const { userId } = useContext(UserType);
  const [notifications, setNotifications] = useState([]);

  // Fetch notifications from the backend
  useEffect(() => {
    const fetchNotifications = async () => {
      try {
        const token = await AsyncStorage.getItem("authToken");
        const decodedToken = jwt_decode(token);
        const userId = decodedToken.sub;
    
        const headers = {
          Authorization: `Bearer ${token}`, // Include the token in the Authorization header
          "Content-Type": "application/json",
        };
    
        const response = await axios.get(`https://levelart.up.railway.app/notifications/${userId}`, { headers });
        setNotifications(response.data);
      } catch (error) {
        console.log("Error fetching notifications:", error);
      }
    };
    
    fetchNotifications();
  }, []);

  // Function to handle button click
  const handleButtonClick = (buttonName) => {
    setSelectedButton(buttonName);
  };

  // Function to handle post like
  const handlePostLike = async (postId) => {
    try {
      const token = await AsyncStorage.getItem("authToken");
      const headers = {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      };
      await axios.post(
        `https://levelart.up.railway.app/notifications/like`,
        { likedPostOwnerId: userId, likerId: userId, postId }, // Assuming postId is passed to this function
        { headers }
      );
      // After successfully liking the post, fetch notifications again to get updated notifications
      fetchNotifications();
    } catch (error) {
      console.log("Error liking post:", error);
    }
  };

  return (
    <ScrollView style={{ marginTop: 50 }}>
      <View style={{ padding: 10 }}>
        <Text style={{ fontSize: 18, fontWeight: "bold" }}>Activity</Text>

        {/* Buttons for different activities */}
        <View style={{ flexDirection: "row", alignItems: "center", gap: 10, marginTop: 12 }}>
          <TouchableOpacity
            onPress={() => handleButtonClick("people")}
            style={[
              styles.button,
              selectedButton === "people" ? { backgroundColor: "black" } : null,
            ]}
          >
            <Text style={[styles.buttonText, selectedButton === "people" ? { color: "white" } : null]}>People</Text>
          </TouchableOpacity>

          <TouchableOpacity
            onPress={() => handleButtonClick("all")}
            style={[
              styles.button,
              selectedButton === "all" ? { backgroundColor: "black" } : null,
            ]}
          >
            <Text style={[styles.buttonText, selectedButton === "all" ? { color: "white" } : null]}>All</Text>
          </TouchableOpacity>

          <TouchableOpacity
            onPress={() => handleButtonClick("requests")}
            style={[
              styles.button,
              selectedButton === "requests" ? { backgroundColor: "black" } : null,
            ]}
          >
            <Text style={[styles.buttonText, selectedButton === "requests" ? { color: "white" } : null]}>Requests</Text>
          </TouchableOpacity>
        </View>

        {/* Display notifications */}
        <View>
          {Array.isArray(notifications) && notifications.map((notification, index) => (
            <Text key={index}>{notification.message}</Text>
          ))}
        </View>

        {/* Display users based on selected activity */}
        <View>
          {selectedButton === "people" && (
            <View style={{marginTop:20}}>
              {users.map((item, index) => (
                <User key={index} item={item} />
              ))}
            </View>
          )}
        </View>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  button: {
    flex: 1,
    paddingVertical: 10,
    paddingHorizontal: 20,
    backgroundColor: "white",
    borderColor: "#D0D0D0",
    borderRadius: 6,
    borderWidth: 0.7,
  },
  buttonText: {
    textAlign: "center",
    fontWeight: "bold",
  },
});

export default ActivityScreen;
