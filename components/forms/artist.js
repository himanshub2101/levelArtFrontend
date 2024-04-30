import React, { useState } from 'react';
import { View, TextInput, StyleSheet, Button, ScrollView, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons'; // Import Ionicons component
import { SafeAreaView } from 'react-native-safe-area-context'; // Import SafeAreaView

const ArtistForm = () => {
  const [page, setPage] = useState(1);

  const nextPage = () => {
    setPage(page + 1);
  };

  const previousPage = () => {
    setPage(page - 1);
  };

  const renderInputs = () => {
    switch (page) {
      case 1:
        return (
          <SafeAreaView>
            <View style={styles.backButtonContainer}>
              <TouchableOpacity onPress={previousPage} style={styles.backIcon}>
                <Ionicons name="arrow-back" size={30} color="white" />
              </TouchableOpacity>
            </View>
            <View>
              {/* Inputs for page 1 */}
              <TextInput placeholder="First Name" style={styles.input} />
              <TextInput placeholder="Last Name" style={styles.input} />
              <TextInput placeholder="Email" style={styles.input} />
              <TextInput placeholder="Phone" style={styles.input} />
              <TextInput placeholder="City & State, Country" style={styles.input} />
              <TextInput placeholder="Pincode" style={styles.input} />
            </View>
          </SafeAreaView>
        );
        
      case 2:
        return (
          <SafeAreaView>
            <View style={styles.backButtonContainer}>
              <TouchableOpacity onPress={previousPage} style={styles.backIcon}>
                <Ionicons name="arrow-back" size={30} color="black" />
              </TouchableOpacity>
            </View>
            <View>
              {/* Inputs for page 2 */}
              <TextInput placeholder="Full Address" style={styles.input} />
              <TextInput placeholder="ID Proof" style={styles.input} />
              <TextInput placeholder="ID Proof Name and Number" style={styles.input} />
              <TextInput placeholder="Proof Upload" style={styles.input} />
              <TextInput placeholder="Age" style={styles.input} />
              <TextInput placeholder="DOB" style={styles.input} />
            </View>
          </SafeAreaView>
        );
        
      case 3:
        return (
          <SafeAreaView>
            <View style={styles.backButtonContainer}>
              <TouchableOpacity onPress={previousPage} style={styles.backIcon}>
                <Ionicons name="arrow-back" size={30} color="black" />
              </TouchableOpacity>
            </View>
            <View>
              <TextInput placeholder="Gender" style={styles.input} />
              <TextInput placeholder="Height" style={styles.input} />
              <TextInput placeholder="Weight" style={styles.input} />
              <TextInput placeholder="Eye Color" style={styles.input} />
              <TextInput placeholder="Hair Color" style={styles.input} />
              <TextInput placeholder="Waist Size" style={styles.input} />
            </View>
          </SafeAreaView>
        );
        
      case 4:
        return (
          <SafeAreaView>
            <View style={styles.backButtonContainer}>
              <TouchableOpacity onPress={previousPage} style={styles.backIcon}>
                <Ionicons name="arrow-back" size={30} color="black" />
              </TouchableOpacity>
            </View>
            <View>
              <TextInput placeholder="Chest Size" style={styles.input} />
              <TextInput placeholder="Hair Length" style={styles.input} />
              <TextInput placeholder="Shoulder Length" style={styles.input} />
              <TextInput placeholder="Dress Size" style={styles.input} />
              <TextInput placeholder="Skin Color" style={styles.input} />
              <TextInput placeholder="Shoes Size" style={styles.input} />
            </View>
          </SafeAreaView>
        );
      
      case 5:
        return (
          <SafeAreaView>
            <View style={styles.backButtonContainer}>
              <TouchableOpacity onPress={previousPage} style={styles.backIcon}>
                <Ionicons name="arrow-back" size={30} color="black" />
              </TouchableOpacity>
            </View>
            <View>
              {/* Other inputs */}
              <TextInput placeholder="Upload Your Photo" style={styles.input} />
              <TextInput placeholder="Professional Status" style={styles.input} />
              <TextInput placeholder="How Does Your Hear About Us" style={styles.input} />
              <TextInput placeholder="All Your Experience" style={styles.input} />
              <TextInput placeholder="Message" style={styles.input} />
              {/* Send button */}
              <Button title="Send" onPress={() => console.log("Sending data...")} color="black" />
            </View>
          </SafeAreaView>
        );
        
      default:
        return null;
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView>
        {renderInputs()}
        {page < 5 && <Button title="Next Page" onPress={nextPage} color="black" />}
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor:"white",
    padding: 50,
    position: 'relative', // Add position relative to the container
    borderRadius: 10,
    height:"100%",
  },
  input: {
    borderWidth: 1,
    borderColor: 'gray',
    borderRadius: 10,
    padding: 20,
    marginBottom: 30,
    fontSize: 15,
  },
  backButtonContainer: {
    top: -10,
    left: -12,
  },
  backIcon: {
    padding: 10,
  },
});

export default ArtistForm;
