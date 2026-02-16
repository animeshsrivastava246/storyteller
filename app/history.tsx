import { StoryCard } from "@/components/StoryCard";
import type { StoryEntry } from "@/types/story";
import { getHistory } from "@/utils/history";
import { Ionicons } from "@expo/vector-icons";
import { useFocusEffect } from "@react-navigation/native";
import { LinearGradient } from "expo-linear-gradient";
import { useCallback, useState } from "react";
import { FlatList, ImageBackground, Text, View } from "react-native";
import Animated, { FadeIn } from "react-native-reanimated";

function EmptyState() {
  return (
    <View className="flex-1 justify-center items-center py-24">
      <View className="size-24 rounded-full glass items-center justify-center mb-6">
        <Ionicons name="documents-outline" size={48} color="rgba(255,255,255,0.2)" />
      </View>
      <Text className="text-2xl font-bold text-white/80 uppercase tracking-widest">Temporal Void</Text>
      <Text className="text-base text-neon-cyan/50 mt-3 font-medium uppercase tracking-widest">No stories synthesized yet</Text>
    </View>
  );
}

function ListHeader() {
  return (
    <View className="mb-10 pt-4">
      <Text className="text-5xl font-black text-white tracking-tighter">
        STORY<Text className="text-neon-cyan">VAULT</Text>
      </Text>
      <Text className="text-base text-white/50 mt-2 font-bold uppercase tracking-[0.2em]">
        Your synthesized archive
      </Text>
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
        colors={["rgba(11,15,26,0.95)", "rgba(11,15,26,0.85)"]}
        className="flex-1"
      >
        <Animated.View entering={FadeIn.duration(600)} className="flex-1">
          <FlatList
            data={stories}
            keyExtractor={(item) => item.id}
            renderItem={({ item }) => <StoryCard story={item} />}
            ListHeaderComponent={ListHeader}
            ListEmptyComponent={EmptyState}
            contentContainerStyle={{ padding: 20, flexGrow: 1 }}
            showsVerticalScrollIndicator={false}
          />
        </Animated.View>
      </LinearGradient>
    </ImageBackground>
  );
}
