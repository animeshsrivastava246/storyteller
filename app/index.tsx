import { GlassContainer, GlassView } from "expo-glass-effect";
import { LinearGradient } from "expo-linear-gradient";
import { router, Stack } from "expo-router";
import { useCallback, useRef, useState } from "react";
import {
  Alert,
  ImageBackground,
  Keyboard,
  KeyboardAvoidingView,
  Platform,
  Pressable,
  ScrollView,
  Text,
  TextInput,
  View,
} from "react-native";
import { HeaderIconButton } from "@/components/HeaderIconButton";
import { saveStory } from "@/utils/history";
import "@/global.css";


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
    <>
      <Stack.Screen
        options={{
          headerRight: () => (
            <HeaderIconButton
              icon="time-outline"
              onPress={() => router.push("/history")}
            />
          ),
          headerTransparent: true,
          headerTitle: "",
        }}
      />
      <ImageBackground
        source={require("@/assets/images/bg.webp")}
        resizeMode="cover"
        className="flex-1"
      >
        <LinearGradient
          colors={["rgba(11,15,26,0.85)", "rgba(11,15,26,0.95)"]}
          className="flex-1"
        >
          <KeyboardAvoidingView
            behavior={Platform.OS === "ios" ? "padding" : undefined}
            className="flex-1"
          >
            <ScrollView
              contentContainerClassName="flex-1 justify-center px-6"
              keyboardShouldPersistTaps="handled"
            >
              {/* Title */}
              <View className="mb-10 items-center">
                <Text className="text-4xl font-bold text-white text-center">
                  Create a Story
                </Text>
                <Text className="mt-3 text-center text-white/60 text-base">
                  One sentence is enough to wake a universe.
                </Text>
              </View>

              {/* Glass Card */}
              <GlassContainer className="rounded-3xl overflow-hidden">
                <GlassView className="py-4 px-6 border border-white/20">
                  <TextInput
                    ref={inputRef}
                    value={seed}
                    onChangeText={setSeed}
                    editable={!isGenerating}
                    placeholder="I found a staircase hidden beneath the sea..."
                    placeholderTextColor="rgba(255,255,255,0.4)"
                    multiline
                    numberOfLines={3}
                    textAlignVertical="top"
                    returnKeyType="send"
                    submitBehavior="blurAndSubmit"
                    onSubmitEditing={handleGenerate}
                    className="text-lg text-white leading-relaxed min-h-[80px]"
                  />
                </GlassView>
              </GlassContainer>

              {/* Generate Button - Liquid Glass */}
              <Pressable
                onPress={handleGenerate}
                disabled={isGenerating}
                className={`mt-8 rounded-2xl py-4 items-center border ${
                  isGenerating
                    ? "bg-white/10 border-white/10"
                    : "bg-indigo-600/80 border-indigo-400/30 active:bg-indigo-500"
                }`}
                style={{
                  shadowColor: "#6366f1",
                  shadowOffset: { width: 0, height: 4 },
                  shadowOpacity: isGenerating ? 0 : 0.3,
                  shadowRadius: 12,
                }}
              >
                <Text className="text-white font-semibold text-lg">
                  {isGenerating ? "Generating…" : "Generate Story"}
                </Text>
              </Pressable>

              {/* Footer hint */}
              <Text className="mt-8 text-center text-white/40 text-sm">
                Tip: Specific images beat abstract ideas.
              </Text>
            </ScrollView>
          </KeyboardAvoidingView>
        </LinearGradient>
      </ImageBackground>
    </>
  );
}
