import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, FlatList, StyleSheet, TouchableOpacity, Animated, Image } from 'react-native';
import { Feather } from '@expo/vector-icons';
import axios from 'axios';
import { useNavigation } from '@react-navigation/native'; // Import useNavigation hook

const SearchScreen = () => {
  const navigation = useNavigation(); // Use useNavigation hook to get access to navigation prop

  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState([]);
  const [loading, setLoading] = useState(false);
  const [fadeAnim] = useState(new Animated.Value(0));

  useEffect(() => {
    Animated.timing(
      fadeAnim,
      {
        toValue: 1,
        duration: 1000,
        useNativeDriver: true,
      }
    ).start();
  }, [searchResults]);

  const handleSearch = async () => {
    try {
      setLoading(true);
      const response = await axios.get(`https://levelart.up.railway.app/search/user?username=${searchQuery}`);
      setSearchResults(response.data.data);
    } catch (error) {
      console.error('Error searching:', error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.inputContainer}>
        <TextInput
          style={styles.input}
          placeholder="Search"
          value={searchQuery}
          onChangeText={setSearchQuery}
          onSubmitEditing={handleSearch}
        />
        <TouchableOpacity onPress={handleSearch} style={styles.searchIconContainer}>
          <Feather name="search" size={20} color="black" />
        </TouchableOpacity>
      </View>
      {loading ? (
        <Text style={styles.loadingText}>Loading...</Text>
      ) : (
        <FlatList
          data={searchResults}
          renderItem={({ item }) => (
            <Animated.View style={{ ...styles.resultItem, opacity: fadeAnim }}>
              <TouchableOpacity
                onPress={() => navigation.navigate('Profile', { user: item.username })} // Navigate to Profile screen with user data
                style={styles.profileContainer}
              >
                <Image
                  source={{ uri: item.profilePic }}
                  style={styles.profilePic}
                  onError={() => console.log('Error loading profile picture', item)}
                />
                <View style={styles.userInfo}>
                  <Text style={styles.username}>{item.username}</Text>
                  <Text style={styles.bio}>{item.bio}</Text>
                </View>
              </TouchableOpacity>
            </Animated.View>
          )}
          keyExtractor={(item) => item._id.toString()}
        />
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: 20,
    paddingTop: 65,
    backgroundColor: 'white',
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 2,
    borderColor: 'gray',
    borderRadius: 25,
    paddingHorizontal: 15,
    marginBottom: 10,
  },
  input: {
    flex: 1,
    fontSize: 16,
    paddingVertical: 10,
    // backgroundColor: '#fafafa',
  },
  searchIconContainer: {
    marginLeft: 10,
  },
  loadingText: {
    textAlign: 'center',
    marginTop: 20,
    fontSize: 16,
    color: 'black',
  },
  resultItem: {
    marginBottom: 10,
    paddingVertical: 15,
    paddingHorizontal: 20,
    borderWidth: 1,
    borderColor: 'lightgray',
    borderRadius: 25,
    //borderRadius: 50,
    backgroundColor: 'white',
    elevation: 3,
  },
  profileContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  profilePic: {
    width: 50,
    height: 50,
    borderRadius: 25,
    marginRight: 10,
  },
  userInfo: {
    flex: 1,
  },
  username: {
    fontWeight: 'bold',
    fontSize: 18,
  },
  bio: {
    fontSize: 14,
    color: 'gray',
  },
});

export default SearchScreen;
