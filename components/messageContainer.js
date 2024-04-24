// import React, { useEffect, useRef, useState } from 'react';
// import { View, Text, Image, ScrollView } from 'react-native';
// import { Avatar, Divider, useColorModeValue } from 'react-native-elements'; // Import Avatar and Divider from react-native-elements
// import Message from './message';
// import MessageInput from './messageInput';
// import { useRecoilValue, useSetRecoilState } from 'recoil';
// // import { selectedConversationAtom } from '../atoms/messagesAtom';
// // import userAtom from '../atoms/usersAtom';
// // import { useSocket } from '../context/socket';

// const MessageContainer = () => {
//   const selectedConversation = useRecoilValue(selectedConversationAtom);
//   const [loadingMessages, setLoadingMessages] = useState(true);
//   const [messages, setMessages] = useState([]); // Adjust the type of messages as needed
//   const currentUser = useRecoilValue(userAtom)[0];
//   const { socket } = useSocket();
//   const setConversations = useSetRecoilState(conversationsAtom);
//   const messageEndRef = useRef(null); // Adjust the ref type as needed

//   useEffect(() => {
//     socket.on('newMessage', (message) => {
//       if (selectedConversation._id === message.conversationId) {
//         setMessages((prev) => [...prev, message]);
//       }

//       if (!document.hasFocus()) {
//         const sound = new Audio(messageSound);
//         sound.play();
//       }

//       setConversations((prev) => {
//         const updatedConversations = prev.map((conversation) => {
//           if (conversation._id === message.conversationId) {
//             return {
//               ...conversation,
//               lastMessage: {
//                 text: message.text,
//                 sender: message.sender,
//               },
//             };
//           }
//           return conversation;
//         });
//         return updatedConversations;
//       });
//     });

//     return () => socket.off('newMessage');
//   }, [socket, selectedConversation, setConversations]);

//   useEffect(() => {
//     const lastMessageIsFromOtherUser = messages.length && messages[messages.length - 1].sender !== currentUser._id;
//     if (lastMessageIsFromOtherUser) {
//       socket.emit('markMessagesAsSeen', {
//         conversationId: selectedConversation._id,
//         userId: selectedConversation.userId,
//       });
//     }

//     socket.on('messagesSeen', ({ conversationId }) => {
//       if (selectedConversation._id === conversationId) {
//         setMessages((prev) => {
//           const updatedMessages = prev.map((message) => {
//             if (!message.seen) {
//               return {
//                 ...message,
//                 seen: true,
//               };
//             }
//             return message;
//           });
//           return updatedMessages;
//         });
//       }
//     });
//   }, [socket, currentUser._id, messages, selectedConversation]);

//   useEffect(() => {
//     const getMessages = async () => {
//       setLoadingMessages(true);
//       setMessages([]);
//       try {
//         if (selectedConversation.mock) return;
//         const res = await fetch(`/api/messages/${selectedConversation.userId}`);
//         const data = await res.json();
//         if (data.error) {
//           showToast('Error', data.error);
//           return;
//         }
//         setMessages(data);
//       } catch (error) {
//         showToast('Error', error.message);
//       } finally {
//         setLoadingMessages(false);
//       }
//     };

//     getMessages();
//   }, [selectedConversation.userId, selectedConversation.mock]);

//   const bgColor = useColorModeValue('gray.200', 'gray.dark');

//   return (
//     <View style={{ flex: 1, backgroundColor: bgColor, borderRadius: 8, padding: 8 }}>
//       {/* Message header */}
//       <View style={{ flexDirection: 'row', alignItems: 'center', paddingVertical: 8 }}>
//         <Avatar source={{ uri: selectedConversation.userProfilePic }} size="small" />
//         <Text>
//           {selectedConversation.username} <Image source={require('../assets/logo.png')} style={{ width: 4, height: 4 }} />
//         </Text>
//       </View>

//       <Divider />

//       <ScrollView contentContainerStyle={{ flexGrow: 1 }}>
//         {loadingMessages ? (
//           <View>
//             {[...Array(5)].map((_, i) => (
//               <View key={i} style={{ flexDirection: i % 2 === 0 ? 'row' : 'row-reverse', alignItems: 'center', padding: 4 }}>
//                 {i % 2 === 0 && <SkeletonCircle size={7} />}
//                 <View style={{ flexDirection: 'column', justifyContent: 'space-between' }}>
//                   <Skeleton height={8} width={250} />
//                   <Skeleton height={8} width={250} />
//                   <Skeleton height={8} width={250} />
//                 </View>
//                 {i % 2 !== 0 && <SkeletonCircle size={7} />}
//               </View>
//             ))}
//           </View>
//         ) : (
//           messages.map((message) => (
//             <View key={message._id} ref={messages.length - 1 === messages.indexOf(message) ? messageEndRef : null}>
//               <Message message={message} ownMessage={currentUser._id === message.sender} />
//             </View>
//           ))
//         )}
//       </ScrollView>

//       <MessageInput setMessages={setMessages} />
//     </View>
//   );
// };

// export default MessageContainer;
