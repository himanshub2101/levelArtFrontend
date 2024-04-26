import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, FlatList, StyleSheet, TouchableOpacity, Animated } from 'react-native';
import { Feather } from '@expo/vector-icons'; // Import Feather icons from Expo
import axios from 'axios';

const SearchScreen = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState([]);
  const [loading, setLoading] = useState(false);
  const [fadeAnim] = useState(new Animated.Value(0)); // Initial value for opacity: 0

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
      // Make HTTP request to backend API using Axios
      const response = await axios.get(`https://levelart.up.railway.app/search/user?username=${searchQuery}`);
      setSearchResults(response.data.data); // Update this line
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
                onPress={() => console.log('Pressed on', item.username)} // Replace with desired action
              >
                <Text style={styles.username}>{item.username}</Text>
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
    backgroundColor: '#fafafa',
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
  username: {
    fontWeight: 'bold',
    fontSize: 20,
  },
});

export default SearchScreen;
