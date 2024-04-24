// import React, { useState } from "react";
// import { View, Text, TextInput, Modal, TouchableOpacity } from "react-native";
// import { useRecoilState, useRecoilValue } from "recoil";
// import userAtom from "../atoms/usersAtom";
// import useShowToast from "../hooks/useShowToast";
// import postsAtom from "../atoms/postsAtom";

// const Actions = ({ post }) => {
//   const user = useRecoilValue(userAtom)[0];
//   const [liked, setLiked] = useState(post.likes.includes(user?._id));
//   const [posts, setPosts] = useRecoilState(postsAtom);
//   const [isLiking, setIsLiking] = useState(false);
//   const [isReplying, setIsReplying] = useState(false);
//   const [reply, setReply] = useState("");

//   const showToast = useShowToast();
//   const [isModalOpen, setIsModalOpen] = useState(false);

//   const handleLikeAndUnlike = async () => {
//     if (!user) return showToast("Error", "warning");
//     if (isLiking) return;
//     setIsLiking(true);
//     try {
//       // Your like/unlike logic here
//     } catch (error) {
//       showToast("Error", error.message);
//     } finally {
//       setIsLiking(false);
//     }
//   };

//   const handleReply = async () => {
//     if (!user) return showToast("Error", "warning");
//     if (isReplying) return;
//     setIsReplying(true);
//     try {
//       // Your reply logic here
//     } catch (error) {
//       showToast("Error", error.message);
//     } finally {
//       setIsReplying(false);
//     }
//   };

//   return (
//     <View style={{ flexDirection: 'column' }}>
//       <View style={{ flexDirection: 'row', marginTop: 10 }}>
//         <TouchableOpacity onPress={handleLikeAndUnlike}>
//           {/* Your like icon */}
//         </TouchableOpacity>

//         <TouchableOpacity onPress={() => setIsModalOpen(true)}>
//           {/* Your comment icon */}
//         </TouchableOpacity>

//         {/* Repost and Share icons */}

//       </View>

//       <View style={{ flexDirection: 'row', alignItems: 'center', marginTop: 5 }}>
//         <Text style={{ color: 'gray' }}>{post.replies.length} replies</Text>
//         <View style={{ width: 0.5, height: 0.5, borderRadius: 0.25, backgroundColor: 'gray', marginHorizontal: 5 }} />
//         <Text style={{ color: 'gray' }}>{post.likes.length} likes</Text>
//       </View>

//       <Modal visible={isModalOpen} onRequestClose={() => setIsModalOpen(false)}>
//         <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
//           <TextInput
//             placeholder="Reply goes here.."
//             value={reply}
//             onChangeText={setReply}
//             style={{ borderWidth: 1, borderColor: 'gray', borderRadius: 5, padding: 10, width: '80%', marginBottom: 20 }}
//           />
//           {/* Your reply button */}
//         </View>
//       </Modal>
//     </View>
//   );
// };

// export default Actions;
