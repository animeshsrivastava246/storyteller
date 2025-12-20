import Entypo from "@expo/vector-icons/Entypo";
import { useLocalSearchParams, useRouter } from "expo-router";
import { useEffect, useMemo, useState } from "react";
import { ActivityIndicator, Button, Image, ImageBackground, Pressable, ScrollView, Text, View } from "react-native";
import { SafeAreaProvider } from "react-native-safe-area-context";

type StoryLine = {
  text: string;
  prompt: string;
};

export default function Story() {
  const router = useRouter();
  const headers = { "Content-Type": "application/json" };
  const { story } = useLocalSearchParams();

  const [index, setIndex] = useState(0);
  const [imgUrls, setImgUrls] = useState<string[]>([]);
  const [thinking, setThinking] = useState(true);

  const onPrevious = () => setIndex((ind) => Math.max(ind - 1, 0));
  const onNext = () => setIndex((ind) => Math.min(ind + 1, imgUrls.length - 1));

  const lines: StoryLine[] = useMemo(() => {
    try {
      const parsed = Array.isArray(story) ? JSON.parse(story[0]) : story;
      return JSON.parse(parsed ?? "[]");
    } catch (error) {
      return [];
    }
  }, [story]);

  const currentLine = lines[index];
  useEffect(() => {
    if (!lines.length) return;
    async function loadImages() {
      try {
        const results = await Promise.all(
          lines.map(async (line) => {
            const response = await fetch("/api/image", {
              method: "POST",
              headers: headers,
              body: JSON.stringify({ prompt: line.prompt }),
            });
            if (!response.ok) {
              throw new Error("Failed to fetch image. :(");
            }
            const data = await response.json();
            return data.imgUrl as string;
          })
        );
        setImgUrls(results);
      } catch (err) {
        console.error("Error loading images:", err);
      }
      finally { setThinking(false); }
    }

    loadImages();
  }, [story]);

  return (
    <ImageBackground
      source={require("../assets/images/bg.webp")}
      resizeMode="cover"
      imageStyle={{ opacity: 0.5 }}
      className="flex-1"
    >
      <SafeAreaProvider className="flex-1">
        {/* Back Button */}
        <Pressable
          onPress={() => router.back()}
          className="ml-6 mt-2 bg-white size-12 rounded-full items-center justify-center shadow"
        >
          <Entypo name="chevron-left" size={27} />
        </Pressable>

        {/* Hero Section */}
        <View className="flex-1 p-6">
          <ScrollView contentContainerClassName="gap-5">
            {
              thinking ? (
                <View className="items-center justify-center py-8 gap-2" >
                  <ActivityIndicator size="large" />
                  <Text className="text-base text-gray-500">Bringing your story to life...</Text>
                </View>
              ) : (
                imgUrls[index] ? (
                  <Image source={{ uri: imgUrls[index] }} resizeMode="cover" className="w-full h-[450px] rounded-2xl shadow bg-gray-200" />) : null
              )
            }
            <Text className="text-lg">{" "}{currentLine?.text ?? "Unable to generate your imagination. :("}{" "}</Text>
          </ScrollView>

          {/* Navigation Buttons */}
          <View className="flex-row justify-between items-center mt-6">
            <Button title="Previous" onPress={onPrevious} disabled={index == 0 || lines.length == 0} />
            <Text className="text-base text-gray-700">{lines.length ? `${index + 1}/${lines.length}` : "0/0"}</Text>
            <Button title="Next" onPress={onNext} disabled={index == lines.length - 1 || lines.length == 0} />
          </View>
        </View>
      </SafeAreaProvider>
    </ImageBackground>

  );
}
