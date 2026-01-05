import { useEffect, useRef } from "react";
import { Animated, Easing, ImageBackground, StyleSheet } from "react-native";

export default function AboutScreen() {
  // Create a reference for the scale animation
  const scaleAnim = useRef(new Animated.Value(8)).current;

  // Start the animation when the component mounts
  useEffect(() => {
    Animated.timing(scaleAnim, {
      toValue: 1.2, // Target scale value
      duration: 1400, // Duration of the animation
      easing: Easing.elastic(0.75), // Easing function for smooth animation
      useNativeDriver: true, // Use the native driver for better performance
    }).start();
  }, [scaleAnim]);

  return (
    <Animated.View
      style={[styles.container, { transform: [{ scale: scaleAnim }] }]}
    >
      <ImageBackground
        // source={require("../assets/storyteller-hero-landing.jpeg")}
        source={require("../assets/chateau.jpeg")}
        style={styles.background}
        resizeMode="cover"
        blurRadius={4}
      />
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center", // Center content for animation
  },
  background: {
    flex: 1,
    width: "100%", // Ensure the background takes full width
    height: "100%", // Ensure the background takes full height
  },
});
