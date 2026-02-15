import { StoryCard } from "@/components/StoryCard";
import type { StoryEntry } from "@/types/story";
import { getHistory } from "@/utils/history";
import { useFocusEffect } from "@react-navigation/native";
import { LinearGradient } from "expo-linear-gradient";
import { useCallback, useState } from "react";
import { FlatList, ImageBackground, Text, View } from "react-native";

function EmptyState() {
  return (
    <View className="flex-1 justify-center items-center py-20">
      <Text className="text-5xl mb-4">📖</Text>
      <Text className="text-xl font-semibold text-white/80">No stories yet</Text>
      <Text className="text-base text-white/50 mt-2">Create your first story!</Text>
    </View>
  );
}

function ListHeader() {
  return (
    <View className="mb-6 pt-2">
      <Text className="text-3xl font-bold text-white">Story Vault</Text>
      <Text className="text-base text-white/60 mt-1">Your creative journey</Text>
    </View>
  );
}

export default function History() {
  const [stories, setStories] = useState<StoryEntry[]>([]);

  useFocusEffect(
    useCallback(() => {
      let isActive = true;

      const loadHistory = async () => {
        try {
          const data = await getHistory();
          if (isActive) setStories(data);
        } catch (e) {
          console.error("Failed to load history", e);
        }
      };

      loadHistory();
      return () => {
        isActive = false;
      };
    }, [])
  );

  return (
    <ImageBackground
      source={require("@/assets/chateau.jpeg")}
      resizeMode="cover"
      className="flex-1"
    >
      <LinearGradient
        colors={["rgba(11,15,26,0.9)", "rgba(11,15,26,0.95)"]}
        className="flex-1"
      >
        <FlatList
          data={stories}
          keyExtractor={(item) => item.id}
          renderItem={({ item }) => <StoryCard story={item} />}
          ListHeaderComponent={ListHeader}
          ListEmptyComponent={EmptyState}
          contentContainerStyle={{ padding: 20, flexGrow: 1 }}
          showsVerticalScrollIndicator={false}
        />
      </LinearGradient>
    </ImageBackground>
  );
}
