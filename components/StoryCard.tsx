import { Ionicons } from "@expo/vector-icons";
import { router } from "expo-router";
import { Pressable, Text, View } from "react-native";
import type { StoryEntry } from "@/types/story";

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
      className="mb-4 rounded-2xl overflow-hidden active:opacity-80"
      style={{
        backgroundColor: "rgba(255,255,255,0.08)",
        borderWidth: 1,
        borderColor: "rgba(255,255,255,0.12)",
      }}
    >
      <View className="p-4">
        {/* Header */}
        <View className="flex-row items-center justify-between mb-2">
          <View className="flex-row items-center gap-2">
            <View
              className="size-8 rounded-full items-center justify-center"
              style={{ backgroundColor: "rgba(99,102,241,0.3)" }}
            >
              <Ionicons name="book" size={16} color="#a5b4fc" />
            </View>
            <Text className="text-xs text-white/50">
              {formatDate(story.createdAt)}
            </Text>
          </View>
          <Ionicons name="chevron-forward" size={18} color="rgba(255,255,255,0.3)" />
        </View>

        {/* Seed */}
        <Text className="font-semibold text-white text-base mb-2" numberOfLines={2}>
          {story.seed}
        </Text>

        {/* Preview */}
        <Text className="text-sm text-white/60 leading-relaxed" numberOfLines={2}>
          {story.story[0]?.text}
        </Text>

        {/* Footer */}
        <View className="flex-row items-center mt-3 pt-3 border-t border-white/10">
          <Ionicons name="layers-outline" size={14} color="rgba(255,255,255,0.4)" />
          <Text className="text-xs text-white/40 ml-1">
            {story.story.length} scenes
          </Text>
        </View>
      </View>
    </Pressable>
  );
}
