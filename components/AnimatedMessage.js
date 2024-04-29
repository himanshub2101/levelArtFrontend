import React, { useEffect } from 'react';
import { Animated, StyleSheet, Text } from 'react-native';

const AnimatedMessage = ({ message, onAnimationEnd }) => {
  const translateY = new Animated.Value(-100);

  useEffect(() => {
    Animated.timing(translateY, {
      toValue: 0,
      duration: 500,
      useNativeDriver: true,
    }).start(() => {
      // Automatically hide the message after a delay
      setTimeout(() => {
        Animated.timing(translateY, {
          toValue: -100,
          duration: 500,
          useNativeDriver: true,
        }).start(() => {
          onAnimationEnd();
        });
      }, 2000); // Change the delay time as needed
    });
  }, []);

  return (
    <Animated.View style={[styles.container, { transform: [{ translateY }] }]}>
      <Text style={styles.message}>{message}</Text>
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    backgroundColor: '#333',
    padding: 10,
    alignItems: 'center',
  },
  message: {
    color: '#fff',
    fontSize: 16,
  },
});

export default AnimatedMessage;
