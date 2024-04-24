// import React from "react";
// import { View, Text, Image, StyleSheet } from "react-native";

// const Comment = ({ reply, lastReply }) => {
//   return (
//     <>
//       <View style={styles.commentContainer}>
//         <Image source={{ uri: reply.userProfilePic }} style={styles.avatar} />
//         <View style={styles.commentContent}>
//           <Text style={styles.username}>{reply.username}</Text>
//           <Text>{reply.text}</Text>
//         </View>
//       </View>
//       {!lastReply && <View style={styles.divider} />}
//     </>
//   );
// };

// const styles = StyleSheet.create({
//   commentContainer: {
//     flexDirection: "row",
//     alignItems: "center",
//     paddingVertical: 10,
//   },
//   avatar: {
//     width: 40,
//     height: 40,
//     borderRadius: 20,
//     marginRight: 10,
//   },
//   commentContent: {
//     flex: 1,
//     flexDirection: "column",
//   },
//   username: {
//     fontSize: 14,
//     fontWeight: "bold",
//   },
//   divider: {
//     borderBottomWidth: 1,
//     borderBottomColor: "lightgray",
//     marginVertical: 5,
//   },
// });

// export default Comment;
