// TweetsScreen.js
import React from "react";
import { View, Text, FlatList, StyleSheet } from "react-native";

const TweetsScreen = ({ posts }) => {
  const renderPostItem = ({ item }) => (
    <View style={styles.postWrapper}>
      <Text style={styles.postText}>{item.text}</Text>
    </View>
  );

  return (
    <View style={styles.container}>
      <FlatList
        data={posts}
        renderItem={renderPostItem}
        keyExtractor={(item) => item._id}
        contentContainerStyle={styles.postsList}
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
    padding: 15,
  },
  postWrapper: {
    marginBottom: 10,
  },
  postText: {
    fontSize: 16,
  },
});

export default TweetsScreen;
