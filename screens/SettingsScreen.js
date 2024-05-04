import React from "react";
import {
  StyleSheet,
  Text,
  View,
  Pressable,
  TextInput,
  TouchableOpacity,
  ScrollView,
} from "react-native";
import Icon from "react-native-vector-icons/Ionicons";
import {
  Feather,
  MaterialCommunityIcons,
  Entypo,
  MaterialIcons,
  Fontisto,
  Octicons,
  AntDesign,
  FontAwesome6,
} from "@expo/vector-icons";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useNavigation } from "@react-navigation/native";

const SettingsScreen = () => {
  const navigation = useNavigation();
  const logout = async () => {
    try {
      // const authToken = await AsyncStorage.getItem("authToken");
      // await AsyncStorage.removeItem("authToken");
      await AsyncStorage.clear();
      console.log("Cleared auth token");
      navigation.navigate("Login");
    } catch (error) {
      console.error("Error clearing auth token:", error);
    }
  };

  return (
    <View style={styles.container}>
      <ScrollView>
        <View
          style={{
            flexDirection: "row",
            gap: 10,
            alignItems: "center",
            backgroundColor: "#e0e0e0",
            borderWidth: 1,
            borderColor: "#e0e0e0",
            paddingHorizontal: 10,
            paddingVertical: 10,
            borderRadius: 20,
          }}
        >
          <Feather name="search" size={20} color="black" />
          <TextInput placeholder="Search" />
        </View>
        <View style={{ marginTop: 20 }}>
          <Text>Your account</Text>
          <TouchableOpacity
            style={{
              flexDirection: "row",
              gap: 10,
              alignItems: "center",
              marginTop: 20,
            }}
          >
            <MaterialCommunityIcons
              name="account-circle-outline"
              size={24}
              color="black"
            />
            <View>
              <Text style={{ fontSize: 20, fontWeight: "bold" }}>
                Accounts Center
              </Text>
              <Text style={{ color: "gray", fontSize: 16 }}>
                Password, security, personal details
              </Text>
            </View>
          </TouchableOpacity>
        </View>
        <View style={styles.itemContainer}>
          <Text>How you use LevelArt</Text>
          <View style={styles.useContainermain}>
            <TouchableOpacity style={styles.useContainerTouchable}>
              <View style={styles.useContainer}>
                <MaterialCommunityIcons
                  name="bookmark-outline"
                  size={24}
                  color="black"
                />
                <Text style={styles.useContainerText}>Save</Text>
              </View>
              <MaterialIcons
                name="keyboard-arrow-right"
                size={24}
                color="black"
              />
            </TouchableOpacity>
            <TouchableOpacity style={styles.useContainerTouchable}>
              <View style={styles.useContainer}>
                <Entypo name="back-in-time" size={24} color="black" />
                <Text style={styles.useContainerText}>Archive</Text>
              </View>
              <MaterialIcons
                name="keyboard-arrow-right"
                size={24}
                color="black"
              />
            </TouchableOpacity>
            <TouchableOpacity style={styles.useContainerTouchable}>
              <View style={styles.useContainer}>
                <MaterialIcons name="timeline" size={24} color="black" />
                <Text style={styles.useContainerText}>Your Activity</Text>
              </View>
              <MaterialIcons
                name="keyboard-arrow-right"
                size={24}
                color="black"
              />
            </TouchableOpacity>
            <TouchableOpacity style={styles.useContainerTouchable}>
              <View style={{ ...styles.useContainer, gap: 25 }}>
                <Fontisto name="bell" size={24} color="black" />
                <Text style={styles.useContainerText}>Notification</Text>
              </View>
              <MaterialIcons
                name="keyboard-arrow-right"
                size={24}
                color="black"
              />
            </TouchableOpacity>
            <TouchableOpacity style={styles.useContainerTouchable}>
              <View style={styles.useContainer}>
                <MaterialIcons name="access-time" size={24} color="black" />
                <Text style={styles.useContainerText}>Time spent</Text>
              </View>
              <MaterialIcons
                name="keyboard-arrow-right"
                size={24}
                color="black"
              />
            </TouchableOpacity>
          </View>
        </View>
        <View style={styles.itemContainer}>
          <Text>Who can see your content</Text>
          <View style={styles.useContainermain}>
            <TouchableOpacity style={styles.useContainerTouchable}>
              <View style={{ ...styles.useContainer, gap: 25 }}>
                <Octicons name="lock" size={24} color="black" />
                <Text style={styles.useContainerText}>Account privacy</Text>
              </View>
              <MaterialIcons
                name="keyboard-arrow-right"
                size={24}
                color="black"
              />
            </TouchableOpacity>
            <TouchableOpacity style={styles.useContainerTouchable}>
              <View style={styles.useContainer}>
                <MaterialCommunityIcons
                  name="star-circle-outline"
                  size={24}
                  color="black"
                />
                <Text style={styles.useContainerText}>Close friends</Text>
              </View>
              <MaterialIcons
                name="keyboard-arrow-right"
                size={24}
                color="black"
              />
            </TouchableOpacity>
            <TouchableOpacity style={styles.useContainerTouchable}>
              <View style={styles.useContainer}>
                <Entypo name="block" size={24} color="black" />
                <Text style={styles.useContainerText}>Block</Text>
              </View>
              <MaterialIcons
                name="keyboard-arrow-right"
                size={24}
                color="black"
              />
            </TouchableOpacity>
            <TouchableOpacity style={styles.useContainerTouchable}>
              <View style={styles.useContainer}>
                <Feather name="shield-off" size={24} color="black" />
                <Text style={styles.useContainerText}>Hide story and live</Text>
              </View>
              <MaterialIcons
                name="keyboard-arrow-right"
                size={24}
                color="black"
              />
            </TouchableOpacity>
          </View>
        </View>
        <View style={styles.itemContainer}>
          <Text>How others can interact with you</Text>
          <View style={styles.useContainermain}>
            <TouchableOpacity style={styles.useContainerTouchable}>
              <View style={styles.useContainer}>
                <AntDesign name="message1" size={24} color="black" />
                <Text style={styles.useContainerText}>Messages</Text>
              </View>
              <MaterialIcons
                name="keyboard-arrow-right"
                size={24}
                color="black"
              />
            </TouchableOpacity>
            <TouchableOpacity style={styles.useContainerTouchable}>
              <View style={styles.useContainer}>
                <Fontisto name="hashtag" size={24} color="black" />
                <Text style={styles.useContainerText}>Tag</Text>
              </View>
              <MaterialIcons
                name="keyboard-arrow-right"
                size={24}
                color="black"
              />
            </TouchableOpacity>
            <TouchableOpacity style={styles.useContainerTouchable}>
              <View style={styles.useContainer}>
                <MaterialCommunityIcons
                  name="comment-multiple-outline"
                  size={24}
                  color="black"
                />
                <Text style={styles.useContainerText}>Comments</Text>
              </View>
              <MaterialIcons
                name="keyboard-arrow-right"
                size={24}
                color="black"
              />
            </TouchableOpacity>
            <TouchableOpacity style={styles.useContainerTouchable}>
              <View style={styles.useContainer}>
                <AntDesign name="sharealt" size={24} color="black" />
                <Text style={styles.useContainerText}>Sharing</Text>
              </View>
              <MaterialIcons
                name="keyboard-arrow-right"
                size={24}
                color="black"
              />
            </TouchableOpacity>
            <TouchableOpacity style={styles.useContainerTouchable}>
              <View style={styles.useContainer}>
                <MaterialIcons name="person-add-alt" size={24} color="black" />
                <Text style={styles.useContainerText}>Follow</Text>
              </View>
              <MaterialIcons
                name="keyboard-arrow-right"
                size={24}
                color="black"
              />
            </TouchableOpacity>
          </View>
        </View>
        <View style={styles.itemContainer}>
          <Text>More info and support</Text>
          <View style={styles.useContainermain}>
            <TouchableOpacity style={styles.useContainerTouchable}>
              <View style={styles.useContainer}>
                <MaterialIcons name="help-outline" size={24} color="black" />
                <Text style={styles.useContainerText}>Help</Text>
              </View>
              <MaterialIcons
                name="keyboard-arrow-right"
                size={24}
                color="black"
              />
            </TouchableOpacity>
            <TouchableOpacity style={styles.useContainerTouchable}>
              <View style={styles.useContainer}>
                <MaterialCommunityIcons
                  name="account-outline"
                  size={24}
                  color="black"
                />
                <Text style={styles.useContainerText}>Account Status</Text>
              </View>
              <MaterialIcons
                name="keyboard-arrow-right"
                size={24}
                color="black"
              />
            </TouchableOpacity>
            <TouchableOpacity style={styles.useContainerTouchable}>
              <View style={styles.useContainer}>
                <AntDesign name="infocirlceo" size={24} color="black" />
                <Text style={styles.useContainerText}>About</Text>
              </View>
              <MaterialIcons
                name="keyboard-arrow-right"
                size={24}
                color="black"
              />
            </TouchableOpacity>
          </View>
        </View>
        <View style={styles.itemContainer}>
          <Text>Login</Text>
          <TouchableOpacity style={{ marginTop: 20 }} onPress={logout}>
            <Text style={styles.useContainerText}>Log out</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: 10,
    paddingVertical: 10,
    backgroundColor: "#fff",
  },
  itemContainer: {
    marginTop: 30,
    borderTopWidth: 2,
    borderTopColor: "#e0e0e0",
    paddingTop: 10,
  },
  useContainermain: {
    gap: 15,
    marginTop: 20,
  },
  useContainerTouchable: {
    flexDirection: "row",
    justifyContent: "space-between",
  },
  useContainer: {
    flexDirection: "row",
    gap: 20,
    alignItems: "center",
    paddingHorizontal: 1,
  },
  useContainerText: {
    fontSize: 18,
  },
});

export default SettingsScreen;
