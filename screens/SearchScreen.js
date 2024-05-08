import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  TextInput,
  FlatList,
  StyleSheet,
  TouchableOpacity,
  Animated,
  KeyboardAvoidingView,
  Platform,
  Image,
  SafeAreaView,
} from "react-native";
import { Feather } from "@expo/vector-icons"; // Import Feather icons from Expo
import axios from "axios";
import { useNavigation } from "@react-navigation/native";
import AsyncStorage from "@react-native-async-storage/async-storage";

const SearchScreen = () => {
  const navigation = useNavigation();
  const [searchQuery, setSearchQuery] = useState("");
  const [searchResults, setSearchResults] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (searchQuery.trim() !== "") {
      handleSearch();
    } else {
      setSearchResults([]);
    }
  }, [searchQuery]);

  const handleSearch = async () => {
    try {
      setLoading(true);
      // Make HTTP request to backend API using Axios
      const response = await axios.get(
        `https://levelart.up.railway.app/search/user?username=${searchQuery}`
      );
      setSearchResults(response.data.data); // Update search results
    } catch (error) {
      console.error("Error searching:", error.message);
    } finally {
      setLoading(false);
    }
  };

  const handleFollowUnfollow = async (user) => {
    try {
      const authToken = await AsyncStorage.getItem("authToken");
    
      const headers = {
        Authorization: `Bearer ${authToken}`,
      };
    
      // Check if the user is already followed
      const isFollowing = user.followers.some(
        (follower) => follower.userId === user._id
      );
    
      // Make HTTP request based on whether the user is already followed or not
      if (isFollowing) {
        // Unfollow the user
        await axios.delete(
          `https://levelart.up.railway.app/followers/${user._id}/unfollow`,
          { headers }
        );
      } else {
        // Follow the user
        await axios.post(
          `https://levelart.up.railway.app/followers/follow/${user._id}`,
          { followedUserId: user._id },
          { headers }
        );
      }
    
      // Update the UI to reflect the follow/unfollow action
      const updatedResults = searchResults.map((result) =>
        result._id === user._id
          ? {
              ...result,
              followers: isFollowing
                ? result.followers.filter((follower) => follower.userId !== user._id) // Remove the user from followers
                : [...result.followers, { userId: user._id }], // Add the user to followers
            }
          : result
      );
      setSearchResults(updatedResults);
    } catch (error) {
      console.error("Error:", error.message);
    }
  };
  
  

  return (
    <SafeAreaView
      style={{ flex: 1, paddingHorizontal: 10, paddingVertical: 10 }}
    >
      <View style={{ paddingTop: 30, paddingBottom: 100 }}>
        <Text style={{ fontSize: 30, color: "#000", fontWeight: "600" }}>
          Search
        </Text>
        <View
          style={{
            flexDirection: "row",
            height: 45,
            padding: 5,
            backgroundColor: "#0000000e",
            borderRadius: 8,
            justifyContent: "center",
            gap: 10,
            alignItems: "center",
            color: "#000",
            marginTop: 10,
          }}
        >
          <Feather name="search" size={20} color="black" />
          <TextInput
            onChangeText={(text) => setSearchQuery(text)}
            placeholder="Search"
            placeholderTextColor={"#000"}
            style={{ flex: 1, height: 45 }}
          />
        </View>
        <FlatList
          data={searchResults}
          showsVerticalScrollIndicator={false}
          renderItem={({ item }) => (
            <TouchableOpacity
              onPress={() =>
                navigation.navigate("Profile", {
                  item: item,
                })
              }
            >
              <View
                style={{
                  flexDirection: "row",
                  marginTop: 13,
                  borderRadius: 10,
                  padding: 3,
                }}
              >
                <Image
                  source={{ uri: item.profilePic }}
                  style={{ width: 40, height: 40, borderRadius: 50 }}
                />
                <View
                  style={{
                    flex: 1,
                    flexDirection: "row",
                    justifyContent: "space-between",
                    borderBottomWidth: 1,
                    borderBottomColor: "#00000020",
                    paddingBottom: 2,
                  }}
                >
                  <View>
                    <View style={{ flexDirection: "row", alignItems: "center" }}>
                      <Text
                        style={{
                          paddingLeft: 3,
                          fontSize: 18,
                          color: "black",
                        }}
                      >
                        {item.fullname.length > 15
                          ? `${item.fullname.slice(0, 15)}...`
                          : item.fullname}
                      </Text>
                    </View>
                    <Text
                      style={{ paddingLeft: 3, fontSize: 18, color: "black" }}
                    >
                      {item.username.length > 10
                        ? `${item.username.slice(0, 10)}...`
                        : item.username}
                    </Text>
                    <Text
                      style={{
                        paddingLeft: 3,
                        marginTop: 1,
                        fontSize: 16,
                        color: "#444",
                      }}
                    >
                      {item.followers.length} followers
                    </Text>
                  </View>
                  <View>
                    <TouchableOpacity
                      style={{
                        borderRadius: 8,
                        width: 100,
                        flexDirection: "row",
                        justifyContent: "center",
                        alignItems: "center",
                        height: 35,
                        borderWidth: 1,
                        borderColor: "#0000004b",
                      }}
                      onPress={() => handleFollowUnfollow(item)}
                    >
                      <Text style={{ color: "black" }}>
                        {item.followers.find((i) => i.userId === item._id)
                          ? "Unfollow"
                          : "Follow"}
                      </Text>
                    </TouchableOpacity>
                  </View>
                </View>
              </View>
            </TouchableOpacity>
          )}
        />
      </View>
    </SafeAreaView>
  );
};

export default SearchScreen;
