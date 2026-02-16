import type { StoryEntry } from "@/types/story";
import { Ionicons } from "@expo/vector-icons";
import { router } from "expo-router";
import { Pressable, Text, View } from "react-native";

type Props = {
  story: StoryEntry;
};

export function StoryCard({ story }: Props) {
  const handlePress = () => {
    router.push({
      pathname: "/story",
      params: { story: JSON.stringify(story.story) },
    });
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString(undefined, {
      month: "short",
      day: "numeric",
      year: "numeric",
    });
  };

  return (
    <Pressable
      onPress={handlePress}
      className="mb-6 rounded-3xl overflow-hidden active:opacity-90 glass"
    >
      <View className="p-5">
        {/* Header */}
        <View className="flex-row items-center justify-between mb-4">
          <View className="flex-row items-center gap-3">
            <View
              className="size-10 rounded-full items-center justify-center"
              style={{ backgroundColor: "rgba(0,243,255,0.15)", borderWidth: 1, borderColor: "rgba(0,243,255,0.3)" }}
            >
              <Ionicons name="sparkles" size={18} color="#00F3FF" />
            </View>
            <Text className="text-sm font-medium text-white/50 tracking-wider">
              {formatDate(story.createdAt).toUpperCase()}
            </Text>
          </View>
          <Ionicons name="chevron-forward" size={20} color="#00F3FF" />
        </View>

        {/* Seed */}
        <Text className="font-bold text-white text-xl mb-2 tracking-tight" numberOfLines={2}>
          {story.seed}
        </Text>

        {/* Preview */}
        <Text className="text-base text-white/60 leading-relaxed font-medium" numberOfLines={2}>
          {story.story[0]?.text}
        </Text>

        {/* Footer */}
        <View className="flex-row items-center mt-4 pt-4 border-t border-white/5">
          <Ionicons name="stats-chart-outline" size={14} color="#BF00FF" />
          <Text className="text-xs font-bold text-white/40 ml-2 uppercase tracking-widest">
            {story.story.length} fragments synthesized
          </Text>
        </View>
      </View>
    </Pressable>
  );
}
