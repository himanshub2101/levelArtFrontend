// import React, { useState } from 'react';
// import { View, Text, Image } from 'react-native';
// import { Avatar } from 'react-native-elements'; // Import Avatar from react-native-elements
// import { BsCheck2All } from 'react-icons/bs'; // Assuming you're using a custom icon library in React Native
// import { useRecoilValue } from 'recoil';
// import { selectedConversationAtom } from '../atoms/messagesAtom';
// import userAtom from '../atoms/usersAtom'; // Import userAtom correctly

// const Message = ({ ownMessage, message }) => {
//   const selectedConversation = useRecoilValue(selectedConversationAtom);
//   const users = useRecoilValue(userAtom); // Use the users array returned by userAtom
//   const user = users[0]; // Assuming you only have one user in the array, adjust accordingly if needed
//   const [imgLoaded, setImgLoaded] = useState(false);

//   return (
//     <View style={{ flexDirection: 'column' }}>
//       {ownMessage ? (
//         <View style={{ flexDirection: 'row', justifyContent: 'flex-end' }}>
//           {message.text && (
//             <View
//               style={{
//                 backgroundColor: 'green',
//                 maxWidth: 350,
//                 padding: 8,
//                 borderRadius: 8,
//                 marginBottom: 8,
//               }}>
//               <Text style={{ color: 'white' }}>{message.text}</Text>
//               <View
//                 style={{
//                   alignSelf: 'flex-end',
//                   marginLeft: 8,
//                   color: message.seen ? 'blue' : 'black',
//                   fontWeight: 'bold',
//                 }}>
//                 <BsCheck2All size={16} />
//               </View>
//             </View>
//           )}
//           {message.img && !imgLoaded && (
//             <View style={{ marginTop: 5 }}>
//               <Image
//                 source={{ uri: message.img }}
//                 style={{ width: 200, height: 200, display: 'none' }}
//                 onLoad={() => setImgLoaded(true)}
//               />
//               {/* Replace with custom loading indicator */}
//               {!imgLoaded && <View style={{ width: 200, height: 200, backgroundColor: 'grey' }}></View>}
//             </View>
//           )}
//           {message.img && imgLoaded && (
//             <View style={{ marginTop: 5 }}>
//               <Image source={{ uri: message.img }} style={{ width: 200, height: 200, borderRadius: 4 }} />
//               <View
//                 style={{
//                   alignSelf: 'flex-end',
//                   marginLeft: 8,
//                   color: message.seen ? 'blue' : 'black',
//                   fontWeight: 'bold',
//                 }}>
//                 <BsCheck2All size={16} />
//               </View>
//             </View>
//           )}
//           <Avatar
//             source={{ uri: user.profilePic }}
//             rounded
//             size="medium"
//             containerStyle={{ marginLeft: 8 }}
//           />
//         </View>
//       ) : (
//         <View style={{ flexDirection: 'row' }}>
//           <Avatar
//             source={{ uri: selectedConversation.userProfilePic }}
//             rounded
//             size="medium"
//           />
//           {message.text && (
//             <View style={{ maxWidth: 350, backgroundColor: 'gray', padding: 8, borderRadius: 8, marginLeft: 8 }}>
//               <Text>{message.text}</Text>
//             </View>
//           )}
//           {message.img && !imgLoaded && (
//             <View style={{ marginTop: 5 }}>
//               <Image
//                 source={{ uri: message.img }}
//                 style={{ width: 200, height: 200, display: 'none' }}
//                 onLoad={() => setImgLoaded(true)}
//               />
//               {/* Replace with custom loading indicator */}
//               {!imgLoaded && <View style={{ width: 200, height: 200, backgroundColor: 'grey' }}></View>}
//             </View>
//           )}
//           {message.img && imgLoaded && (
//             <View style={{ marginTop: 5 }}>
//               <Image source={{ uri: message.img }} style={{ width: 200, height: 200, borderRadius: 4 }} />
//             </View>
//           )}
//         </View>
//       )}
//     </View>
//   );
// };

// export default Message;
