// app/_layout.tsx
import { Stack } from "expo-router";
import { Platform } from "react-native";

export default function RootLayout() {
  return (
    <Stack
      screenOptions={{
        headerShown: false,
        contentStyle: { backgroundColor: "transparent" },
      }}
    >
      {/* Index needs a header */}
      <Stack.Screen
        name="index"
        options={{
          headerShown: true,
          headerTransparent: true,
          headerTitle: "",
        }}
      />

      {/* Story */}
      <Stack.Screen
        name="story"
        options={{
          headerShown: true,
          headerTransparent: true,
          headerTitle: "",
        }}
      />

      {/* History */}
      <Stack.Screen
        name="history"
        options={{
          presentation: Platform.OS === "ios" ? "formSheet" : "modal",
          sheetGrabberVisible: true,
          sheetAllowedDetents: [0.5, 1],
          headerShown: false,
          contentStyle: { backgroundColor: "transparent" },
        }}
      />

      {/* Test */}
      <Stack.Screen
        name="test"
        options={{
          headerShown: true,
          headerTransparent: true,
          headerTitle: "",
        }}
      />
    </Stack>
  );
}
