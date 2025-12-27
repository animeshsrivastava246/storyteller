// app/index.tsx
import { GlassView, GlassContainer, isLiquidGlassAvailable } from 'expo-glass-effect';
import { router } from "expo-router";
import { useCallback, useRef, useState } from "react";
import {
  Alert,
  Keyboard,
  KeyboardAvoidingView,
  Platform,
  Pressable,
  ScrollView,
  Text,
  TextInput,
  View,
} from "react-native";
import "../global.css";
import { saveStory } from "../utils/history";

export default function HomeScreen() {
  const [seed, setSeed] = useState("");
  const [isGenerating, setIsGenerating] = useState(false);
  const inputRef = useRef<TextInput>(null);

  const handleGenerate = useCallback(async () => {
    const trimmed = seed.trim();

    if (!trimmed) {
      Alert.alert("Missing seed", "Write one vivid line to begin.");
      inputRef.current?.focus();
      return;
    }

    setIsGenerating(true);
    Keyboard.dismiss();

    try {
      const res = await fetch("/api/story", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ seed: trimmed }),
      });

      const data = await res.json();

      if (!res.ok || !Array.isArray(data.story) || data.story.length === 0) {
        throw new Error(data?.error ?? "Story generation failed.");
      }

      await saveStory(trimmed, data.story);

      router.push({
        pathname: "/story",
        params: { id: Date.now().toString() },
      });
    } catch (err) {
      Alert.alert("Something broke", (err as Error).message);
      console.error(err);
    } finally {
      setIsGenerating(false);
    }
  }, [seed]);

  return (
    <View className="flex-1 bg-[#0b0f1a]">
      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : undefined}
        className="flex-1"
      >
        <ScrollView
          contentContainerClassName="flex-1 justify-center px-6"
          keyboardShouldPersistTaps="handled"
        >
          {/* Title */}
          <View className="mb-10">
            <Text className="text-4xl font-semibold text-white text-center">
              Create a Story
            </Text>
            <Text className="mt-2 text-center text-white/60">
              One sentence is enough to wake a universe.
            </Text>
          </View>

          {/* Glass Card */}
          <GlassContainer
            className="rounded-3xl overflow-hidden"
            // intensity={55}
            // tint="dark"
          >
            <GlassView className="py-1 px-10 border border-white/20">
              <TextInput
                ref={inputRef}
                value={seed}
                onChangeText={setSeed}
                editable={!isGenerating}
                placeholder="I found a staircase hidden beneath the sea..."
                placeholderTextColor="#9ca3af"
                multiline
                textAlignVertical="center"
                returnKeyType="send"
                submitBehavior="blurAndSubmit"
                onSubmitEditing={handleGenerate}
                className="text-lg text-white leading-relaxed"
              />
            </GlassView>
          </GlassContainer>

          {/* Action */}
          <Pressable
            onPress={handleGenerate}
            disabled={isGenerating}
            className={`mt-8 rounded-2xl py-4 items-center ${isGenerating
              ? "bg-white/20"
              : "bg-indigo-600 active:bg-indigo-500"
              }`}
          >
            <Text className="text-white font-semibold text-lg">
              {isGenerating ? "Generating…" : "Generate Story"}
            </Text>
          </Pressable>

          {/* Footer hint */}
          <Text className="mt-6 text-center text-white/40 text-sm">
            Tip: Specific images beat abstract ideas.
          </Text>
        </ScrollView>
      </KeyboardAvoidingView>
    </View>
  );
}
