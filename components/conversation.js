// import React from "react";
// import { View, Text, Image, StyleSheet } from "react-native";
// import { Avatar } from "react-native-elements";
// import { useRecoilState, useRecoilValue } from "recoil";
// import { selectedConversationAtom } from "../atoms/messagesAtom";
// import { BsCheck2All } from "react-icons/bs";
// import userAtom from "../atoms/usersAtom";

// const Conversation = ({ conversation, isOnline }) => {
//   const user = conversation.participants[0];
//   const currentUser = useRecoilValue(userAtom)[0];
//   const lastMessage = conversation.lastMessage;
//   const [selectedConversation, setSelectedConversation] = useRecoilState(selectedConversationAtom);

//   return (
//     <View style={[styles.conversationContainer, selectedConversation?._id === conversation._id && styles.selectedConversation]}>
//       <Avatar
//         rounded
//         size="medium"
//         source={{ uri: user.profilePic }}
//         overlayContainerStyle={isOnline ? { backgroundColor: 'green' } : undefined}
//       />
//       <View style={styles.detailsContainer}>
//         <Text style={styles.username}>
//           {user.username} <Image source={require('../../assets/verfied.png')} style={styles.verifiedIcon} />
//         </Text>
//         <Text style={styles.lastMessage}>
//           {currentUser._id === lastMessage.sender && (
//             <Text style={lastMessage.seen ? styles.seenIcon : undefined}>
//               <BsCheck2All size={16} />
//             </Text>
//           )}
//           {lastMessage.text.length > 18
//             ? lastMessage.text.substring(0, 18) + "..."
//             : lastMessage.text || "Image"} {/* Use string instead of BsFillImageFill */}
//         </Text>
//       </View>
//     </View>
//   );
// };

// const styles = StyleSheet.create({
//   conversationContainer: {
//     flexDirection: "row",
//     alignItems: "center",
//     padding: 10,
//     borderRadius: 10,
//   },
//   selectedConversation: {
//     backgroundColor: "gray", // Set your selected conversation background color
//     color: "white",
//   },
//   detailsContainer: {
//     marginLeft: 10,
//     flex: 1,
//   },
//   username: {
//     fontWeight: "700",
//     flexDirection: "row",
//     alignItems: "center",
//   },
//   verifiedIcon: {
//     width: 16,
//     height: 16,
//     marginLeft: 5,
//   },
//   lastMessage: {
//     fontSize: 14,
//     flexDirection: "row",
//     alignItems: "center",
//   },
//   seenIcon: {
//     color: "blue", // Set your seen icon color
//   },
// });

// export default Conversation;
