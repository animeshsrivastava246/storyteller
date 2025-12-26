import { saveStory } from "@/utils/history";
import { router } from "expo-router";
import { useState } from "react";
import { Alert, ImageBackground, Pressable, Text, TextInput, View } from "react-native";
import "../global.css";

export default function HomeScreen() {
  const [seed, setSeed] = useState("");
  const [thinking, setThinking] = useState(false);
  const onGenerate = async () => {
    if (!seed.trim()) {
      Alert.alert("Please enter a seed sentence.");
      return;
    }
    try {
      setThinking(true);
      const res = await fetch("/api/story", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ seed }),
      });

      const data = await res.json();
      if (res.status !== 200) throw new Error(data.error || "Failed to generate your story. :(");

      router.push({
        pathname: "/story",
        params: { story: JSON.stringify(data.story) },
      });
      await saveStory(seed, data.story);
    } catch (e) {
      Alert.alert("Oops :( Something went wrong. Please try again!", (e as Error).message);

    }
    finally {
      setThinking(false);
    }
  }
  return (
    <ImageBackground source={require("../assets/images/bg.webp")} resizeMode="cover" className="flex-1 align-center justify-center">
      <View className="flex-1 p-6 justify-center gap-y-20">
        <View className="gap-y-2">
          {/* Hero Section */}
          <Text className="text-5xl font-semibold text-center">
            Let&rsquo;s Make Your Story Alive!
          </Text>
        </View>

        <View className="gap-y-5">
          {/* Input Section */}
          <View className="bg-white rounded-full border2 border-neutral-300 p-5">
            <TextInput
              className="text-lg leading-6"
              placeholder="Enter a seed sentence..."
              value={seed}
              onChangeText={setSeed}
              editable={!thinking}
              scrollEnabled={true}
            />
          </View>
          <Pressable
            disabled={thinking}
            onPress={onGenerate}
            className="bg-sky-700 justify-center items-center p-4 rounded-full"
          >
            <Text className="text-white text-xl font-bold">
              {thinking ? "Thinking..." : "Generate My Story"}
            </Text>
          </Pressable>
        </View>
      </View>
    </ImageBackground>
  );
}
