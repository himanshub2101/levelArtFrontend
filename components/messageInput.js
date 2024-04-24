// import React, { useState, useRef } from 'react';
// import { View, TextInput, TouchableOpacity, Modal, Image, ActivityIndicator } from 'react-native';
// import { IconButton } from 'react-native-paper'; // Import IconButton from Material-UI
// import useShowToast from '../hooks/useShowToast';
// import { conversationsAtom, selectedConversationAtom } from '../atoms/messagesAtom';
// import { useRecoilValue, useSetRecoilState } from 'recoil';
// import { BsFillImageFill } from 'react-icons/bs'; // Make sure to have the BsFillImageFill icon available in your project

// const MessageInput = ({ setMessages }) => {
//   const [messageText, setMessageText] = useState('');
//   const showToast = useShowToast();
//   const selectedConversation = useRecoilValue(selectedConversationAtom);
//   const setConversations = useSetRecoilState(conversationsAtom);
//   const imageRef = useRef(null);
//   const [imgUrl, setImgUrl] = useState('');
//   const [isSending, setIsSending] = useState(false);

//   const handleSendMessage = async () => {
//     if (!messageText && !imgUrl) return;
//     if (isSending) return;

//     setIsSending(true);

//     try {
//       const res = await fetch('/api/messages', {
//         method: 'POST',
//         headers: {
//           'Content-Type': 'application/json',
//         },
//         body: JSON.stringify({
//           message: messageText,
//           recipientId: selectedConversation.userId,
//           img: imgUrl,
//         }),
//       });
//       const data = await res.json();
//       if (data.error) {
//         showToast('Error', data.error);
//         return;
//       }

//       setMessages((messages) => [...messages, data]);

//       setConversations((prevConvs) => {
//         const updatedConversations = prevConvs.map((conversation) => {
//           if (conversation._id === selectedConversation._id) {
//             return {
//               ...conversation,
//               lastMessage: {
//                 text: messageText,
//                 sender: data.sender,
//               },
//             };
//           }
//           return conversation;
//         });
//         return updatedConversations;
//       });

//       setMessageText('');
//       setImgUrl('');
//     } catch (error) {
//       showToast('Error', error.message);
//     } finally {
//       setIsSending(false);
//     }
//   };

//   const handleImageChange = (event) => {
//     const file = event.target.files[0];
//     if (!file) return;

//     const reader = new FileReader();
//     reader.onloadend = () => {
//       setImgUrl(reader.result);
//     };
//     reader.readAsDataURL(file);
//   };

//   return (
//     <View style={{ flexDirection: 'row', alignItems: 'center', paddingHorizontal: 8 }}>
//       <TextInput
//         style={{ flex: 1, height: 40, borderWidth: 1, borderColor: 'gray', borderRadius: 20, paddingHorizontal: 10 }}
//         placeholder="Type a message"
//         value={messageText}
//         onChangeText={setMessageText}
//       />
//       <TouchableOpacity onPress={handleSendMessage} style={{ marginLeft: 8 }}>
//         <IconButton icon="send" size={24} />
//       </TouchableOpacity>
//       <TouchableOpacity onPress={() => imageRef.current?.click()} style={{ marginLeft: 8 }}>
//         <BsFillImageFill size={24} />
//         <input type="file" ref={imageRef} style={{ display: 'none' }} onChange={handleImageChange} />
//       </TouchableOpacity>
//       <Modal visible={!!imgUrl} animationType="slide" onRequestClose={() => setImgUrl('')}>
//         <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
//           <Image source={{ uri: imgUrl }} style={{ width: '100%', height: '100%' }} resizeMode="contain" />
//           <View style={{ position: 'absolute', bottom: 20, right: 20 }}>
//             {isSending ? (
//               <ActivityIndicator size="small" color="#0000ff" />
//             ) : (
//               <TouchableOpacity onPress={handleSendMessage}>
//                 <IconButton icon="send" size={24} />
//               </TouchableOpacity>
//             )}
//           </View>
//         </View>
//       </Modal>
//     </View>
//   );
// };

// export default MessageInput;
