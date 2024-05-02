// ImagesScreen.js
import React from "react";
import {
  View,
  Text,
  FlatList,
  Image,
  StyleSheet,
  Dimensions,
} from "react-native";

const ImagesScreen = ({ posts }) => {
  const renderPostItem = ({ item }) => (
    <View style={styles.postWrapper}>
      <Image
        style={styles.postImage}
        source={{
          uri: item.img || "https://via.placeholder.com/150",
        }}
      />
    </View>
  );

  return (
    <View style={styles.container}>
      <FlatList
        data={posts}
        renderItem={renderPostItem}
        keyExtractor={(item) => item._id}
        contentContainerStyle={styles.postsList}
        numColumns={3} // Adjust the number of columns
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  postsList: {
    flexGrow: 1,
    // padding: 15,
  },
  postWrapper: {
    // flex: 1,
    // justifyContent: "center",
    // alignItems: "center",
    margin: 2,
  },
  postImage: {
    width: Dimensions.get("window").width / 3 - 4,
    height: Dimensions.get("window").width / 3 - 4,
    resizeMode: "cover",
  },
});

export default ImagesScreen;
