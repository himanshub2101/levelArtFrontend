import React, { useState } from 'react';
import { View, Text, TextInput, FlatList } from 'react-native';
import axios from 'axios';

const SearchScreen = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState([]);
  const [loading, setLoading] = useState(false);

  const handleSearch = async () => {
    try {
      setLoading(true);
      // Make HTTP request to backend API using Axios
      const response = await axios.get(`https://levelart.up.railway.app/search/user?username=${searchQuery}`);
      console.log("response:",response)
      setSearchResults(response.data.data); // Update this line
    } catch (error) {
      console.error('Error searching:', error.message);
    } finally {
      setLoading(false);
    }
  };
  console.log('Search Results:', searchResults);

  return (
    <View style={{ flex: 1, paddingHorizontal: 10 }}>
      <TextInput
        style={{ borderWidth: 1, borderColor: 'gray', padding: 10, marginBottom: 10 }}
        placeholder="Search"
        value={searchQuery}
        onChangeText={setSearchQuery}
        onSubmitEditing={handleSearch}
      />
      {loading ? (
        <Text>Loading...</Text>
      ) : (
        <FlatList
        data={searchResults}
        renderItem={({ item }) => (
          // Render each search result item (user profile or post)
          <View style={{ marginBottom: 10 }}>
            <Text>{item.username}</Text> {/* Assuming username exists in the data */}
            {/* Render additional information for each search result */}
          </View>
        )}
        keyExtractor={(item) => item._id.toString()}
      />
      
      
      )}
    </View>
  );
};

export default SearchScreen;
