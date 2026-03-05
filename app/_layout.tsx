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
      {/* Index */}
      <Stack.Screen
        name="index"
        options={{
          headerShown: true,
          headerTransparent: true,
          headerTitle: "",
          // Notice we don't set headerRight here so we can inject navigation buttons in the component, BUT
          // standard styling is handled from _layout.tsx.
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
          headerShown: true,
          headerTransparent: true,
          headerTitle: "",
          contentStyle: { backgroundColor: "transparent" },
        }}
      />
    </Stack>
  );
}
