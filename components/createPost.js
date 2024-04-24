// import React, { useState, useRef } from 'react';
// import {
//   View,
//   Text,
//   TextInput,
//   Button,
//   Modal,
//   Image,
//   TouchableOpacity,
//   Alert,
// } from 'react-native';
// import * as ImagePicker from 'expo-image-picker';
// import { useRecoilState, useRecoilValue } from 'recoil';
// import userAtom from '../atoms/usersAtom';
// import useShowToast from '../hooks/useShowToast';
// import postsAtom from '../atoms/postsAtom';

// const MAX_CHAR = 500;

// const CreatePost = () => {
//   const [isModalOpen, setIsModalOpen] = useState(false);
//   const [postText, setPostText] = useState('');
//   const [imgUrl, setImgUrl] = useState('');
//   const imageRef = useRef(null);
//   const [remainingChar, setRemainingChar] = useState(MAX_CHAR);
//   const user = useRecoilValue(userAtom);
//   const showToast = useShowToast();
//   const [loading, setLoading] = useState(false);
//   const [posts, setPosts] = useRecoilState(postsAtom);

//   const handleTextChange = (text) => {
//     if (text.length > MAX_CHAR) {
//       const truncatedText = text.slice(0, MAX_CHAR);
//       setPostText(truncatedText);
//       setRemainingChar(0);
//     } else {
//       setPostText(text);
//       setRemainingChar(MAX_CHAR - text.length);
//     }
//   };

//   const handleImageChange = async () => {
//     let permissionResult =
//       await ImagePicker.requestMediaLibraryPermissionsAsync();
//     if (permissionResult.granted === false) {
//       Alert.alert('Permission Required', 'Please grant access to camera roll.');
//       return;
//     }

//     let pickerResult = await ImagePicker.launchImageLibraryAsync();
//     if (!pickerResult.cancelled) {
//       setImgUrl(pickerResult.uri);
//     }
//   };

//   const handleCreatePost = async () => {
//     setLoading(true);
//     try {
//       // Your create post logic here

//       // Example logic:
//       const newPost = {
//         id: Math.random().toString(),
//         text: postText,
//         image: imgUrl,
//         user: user.username,
//       };

//       setPosts((prevPosts) => [newPost, ...prevPosts]);

//       setIsModalOpen(false);
//     } catch (error) {
//       showToast('Error', error.message);
//     } finally {
//       setLoading(false);
//     }
//   };

//   return (
//     <>
//       <TouchableOpacity
//         style={{
//           position: 'absolute',
//           bottom: 10,
//           right: 5,
//           backgroundColor: 'gray',
//           borderRadius: 25,
//           padding: 10,
//         }}
//         onPress={() => setIsModalOpen(true)}>
//         <Text style={{ color: 'white', fontSize: 20 }}>+</Text>
//       </TouchableOpacity>

//       <Modal visible={isModalOpen} animationType="slide">
//         <View style={{ flex: 1, padding: 20 }}>
//           <Text style={{ fontSize: 20 }}>Create Post</Text>
//           <TextInput
//             multiline
//             placeholder="Post content goes here.."
//             value={postText}
//             onChangeText={handleTextChange}
//           />
//           <Text style={{ textAlign: 'right', color: 'gray', fontSize: 16 }}>
//             {remainingChar}/{MAX_CHAR}
//           </Text>
//           <TouchableOpacity
//             style={{ flexDirection: 'row', alignItems: 'center', marginTop: 10 }}
//             onPress={handleImageChange}>
//             <Image
//               source={require('../../assets/logo.jpeg')}
//               style={{ marginLeft: 5, width: 20, height: 20 }}
//             />
//             <Text style={{ marginLeft: 5, fontSize: 16 }}>Add Image</Text>
//           </TouchableOpacity>
//           {imgUrl ? (
//             <View style={{ marginTop: 10 }}>
//               <Image source={{ uri: imgUrl }} style={{ width: 200, height: 200 }} />
//             </View>
//           ) : null}
//           <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginTop: 20 }}>
//             <Button title="Cancel" onPress={() => setIsModalOpen(false)} />
//             <Button title="Post" onPress={handleCreatePost} disabled={loading} />
//           </View>
//         </View>
//       </Modal>
//     </>
//   );
// };

// export default CreatePost;
