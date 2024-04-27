import React from 'react';
import { View, Button, StyleSheet } from 'react-native';

const HomeScreen1 = ({ navigation }) => {
  return (
    <View style={styles.container}>
      <View style={styles.buttonContainer}>
        <Button
          title="Artist"
          onPress={() => navigation.navigate('Artist')}
          color="black" // Set button color to black
          style={styles.button} // Apply custom button styles
        />
      </View>
      <View style={styles.space} /> {/* Add space */}
      <View style={styles.buttonContainer}>
        <Button
          title="Visitors"
          onPress={() => navigation.navigate('Visitors')}
          color="black" // Set button color to black
          style={styles.button} // Apply custom button styles
        />
      </View>
      <View style={styles.space} /> {/* Add space */}
      <View style={styles.buttonContainer}>
        <Button
          title="Production"
          onPress={() => navigation.navigate('Production')}
          color="black" // Set button color to black
          style={styles.button} // Apply custom button styles
        />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  buttonContainer: {
    width: '30%', // Set the width of the button container to 80% of the screen width
    borderRadius: 10, // Add border radius to create rounded corners
    overflow: 'hidden', // Hide overflow to ensure border radius is applied correctly
    marginBottom: 10, // Add margin bottom to the button container for spacing
  },
  button: {
    flex: 1, // Set button to flex 1 to fill the container
  },
  space: {
    height: 10, // Set the height of the space between buttons
  },
});

export default HomeScreen1;
