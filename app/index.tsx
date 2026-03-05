import { HeaderIconButton } from "@/components/HeaderIconButton";
import "@/global.css";
import { generateStory } from "@/utils/apiClient";
import { saveStory } from "@/utils/history";
import { GlassView } from "expo-glass-effect";
import { LinearGradient } from "expo-linear-gradient";
import { router, Stack } from "expo-router";
import { useCallback, useRef, useState } from "react";
import {
  Alert,
  ImageBackground,
  Keyboard,
  KeyboardAvoidingView, Platform, Pressable,
  ScrollView,
  Text,
  TextInput,
  View
} from "react-native";
import Animated, { FadeInDown, FadeInUp } from "react-native-reanimated";


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
      const story = await generateStory(trimmed);
      await saveStory(trimmed, story);

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
        source={require("@/assets/chateau.jpeg")}
        resizeMode="cover"
        className="flex-1"
      >

        <LinearGradient
          colors={["rgba(11,15,26,0.9)", "rgba(11,15,26,0.7)"]}
          style={{ flex: 1 }}
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
              <Animated.View
                entering={FadeInDown.duration(800).delay(200)}
                className="mb-10 items-center"
              >
                <Text className="text-5xl font-bold text-white text-center tracking-tight shadow-neon-cyan">
                  Story<Text className="text-neon-cyan">teller</Text>
                </Text>
                <Text className="mt-4 text-center text-white/70 text-lg font-medium">
                  Awake a universe with a single line.
                </Text>
              </Animated.View>

              {/* Glass Card */}
              <Animated.View entering={FadeInUp.duration(600).delay(400)}>
                <View
                  className="rounded-3xl overflow-hidden"
                  style={{
                    backgroundColor: "rgba(10, 15, 35, 0.45)",
                    borderWidth: 1,
                    borderColor: "rgba(255, 255, 255, 0.15)",
                    borderTopColor: "rgba(255, 255, 255, 0.3)",
                    borderLeftColor: "rgba(255, 255, 255, 0.2)",
                    shadowColor: "#000",
                    shadowOffset: { width: 0, height: 10 },
                    shadowOpacity: 0.5,
                    shadowRadius: 20,
                  }}
                >
                  <GlassView className="py-6 px-6">
                    <TextInput
                      ref={inputRef}
                      value={seed}
                      onChangeText={setSeed}
                      editable={!isGenerating}
                      placeholder="I found a staircase hidden beneath the sea..."
                      placeholderTextColor="rgba(200, 220, 255, 0.5)"
                      multiline
                      numberOfLines={4}
                      textAlignVertical="top"
                      returnKeyType="send"
                      submitBehavior="blurAndSubmit"
                      onSubmitEditing={handleGenerate}
                      className="text-xl text-white font-medium leading-relaxed min-h-[120px]"
                    />
                  </GlassView>
                </View>
              </Animated.View>

              {/* Generate Button - Liquid Neon */}
              <Pressable
                onPress={handleGenerate}
                disabled={isGenerating}
                className={`mt-12 rounded-[28px] py-5 items-center justify-center overflow-hidden ${isGenerating
                  ? "bg-white/5 border border-white/10"
                  : "bg-indigo-600/50 border-[1.5px] border-neon-cyan"
                  }`}
                style={({ pressed }) => ({
                  transform: [{ scale: pressed && !isGenerating ? 0.97 : 1 }],
                  shadowColor: isGenerating ? "transparent" : "#00F3FF",
                  shadowOffset: { width: 0, height: 0 },
                  shadowOpacity: isGenerating ? 0 : 0.8,
                  shadowRadius: 25,
                  elevation: isGenerating ? 0 : 15,
                  backgroundColor: isGenerating ? "rgba(255,255,255,0.05)" : pressed ? "rgba(0, 243, 255, 0.2)" : "rgba(11, 20, 50, 0.6)",
                })}
              >
                {/* Optional inner glow layer for button */}
                {!isGenerating && (
                  <LinearGradient
                    colors={["rgba(0,243,255,0.4)", "transparent"]}
                    start={{ x: 0, y: 0 }}
                    end={{ x: 0, y: 1 }}
                    style={{ position: "absolute", top: 0, left: 0, right: 0, height: "100%" }}
                  />
                )}
                <Text
                  className={`font-black text-xl tracking-[0.15em] uppercase ${isGenerating ? "text-white/50" : "text-white"
                    }`}
                  style={{
                    textShadowColor: isGenerating ? "transparent" : "rgba(0,243,255,0.8)",
                    textShadowOffset: { width: 0, height: 0 },
                    textShadowRadius: 10,
                  }}
                >
                  {isGenerating ? "Synthesizing…" : "Initiate Story"}
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
