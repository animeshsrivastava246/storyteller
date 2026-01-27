import { HeaderIconButton } from "@/components/HeaderIconButton";
import type { StoryLine } from "@/types/story";
import { getLatestStory } from "@/utils/history";
import { cacheImage, getCachedImage } from "@/utils/imageCache";
import { Ionicons } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";
import { Stack, useLocalSearchParams, useRouter } from "expo-router";
import { useCallback, useEffect, useState } from "react";
import {
  ActivityIndicator,
  Dimensions,
  Image,
  ImageBackground,
  Pressable,
  Text,
  View,
} from "react-native";
import Animated, { FadeIn, FadeOut } from "react-native-reanimated";

const { width } = Dimensions.get("window");
const IMAGE_WIDTH = width - 48;
const IMAGE_HEIGHT = IMAGE_WIDTH * 0.75;

export default function Story() {
  const router = useRouter();
  const { story: storyParam, id } = useLocalSearchParams<{ story?: string; id?: string }>();

  const [index, setIndex] = useState(0);
  const [lines, setLines] = useState<StoryLine[]>([]);
  const [imgUrls, setImgUrls] = useState<(string | null)[]>([]);
  const [isLoadingImages, setIsLoadingImages] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Load story from param or fetch latest from DB
  useEffect(() => {
    const loadStory = async () => {
      if (storyParam) {
        try {
          setLines(JSON.parse(storyParam));
        } catch {
          console.error("Invalid story JSON", storyParam);
        }
      } else if (id) {
        const latest = await getLatestStory();
        if (latest) setLines(latest.story);
      }
    };
    loadStory();
  }, [storyParam, id]);

  const currentLine = lines[index];
  const currentImgUrl = imgUrls[index];

  const loadImages = useCallback(async () => {
    if (!lines.length) return;
    setIsLoadingImages(true);
    setError(null);

    try {
      const urls = await Promise.allSettled(
        lines.map(async (line) => {
          // Check cache first
          const cached = await getCachedImage(line.prompt);
          if (cached) return cached;

          // Fetch from API
          const res = await fetch("/api/image", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ prompt: line.prompt }),
          });

          if (!res.ok) {
            const err = await res.json().catch(() => ({ error: "Image gen failed" }));
            throw new Error(err.error || `HTTP ${res.status}`);
          }

          const { imgUrl } = await res.json();
          
          // Cache the image
          await cacheImage(line.prompt, imgUrl);
          
          return imgUrl;
        })
      );

      const newUrls = urls.map((result) => (result.status === "fulfilled" ? result.value : null));
      setImgUrls(newUrls);
    } catch (err: unknown) {
      console.error("Image loading failed:", err);
      setError(err instanceof Error ? err.message : "Failed to load images");
    } finally {
      setIsLoadingImages(false);
    }
  }, [lines]);

  useEffect(() => {
    if (lines.length > 0 && imgUrls.length === 0) {
      loadImages();
    }
  }, [lines, imgUrls.length, loadImages]);

  // Navigation
  const onPrevious = () => setIndex((i) => Math.max(i - 1, 0));
  const onNext = () => setIndex((i) => Math.min(i + 1, lines.length - 1));
  const isAtStart = index === 0;
  const isAtEnd = index === lines.length - 1 || lines.length === 0;

  // Disable nav until image for current index is loaded
  const canNavigate = !isLoadingImages && currentImgUrl !== null;

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
          colors={["rgba(0,0,0,0.3)", "rgba(0,0,0,0.5)"]}
          style={{ flex: 1 }}
        >
          {/* Back Button - Liquid Glass */}
          <Pressable
            onPress={() => router.back()}
            className="absolute top-14 left-4 z-10 size-11 rounded-full items-center justify-center"
            style={{
              backgroundColor: "rgba(255,255,255,0.15)",
              borderWidth: 1,
              borderColor: "rgba(255,255,255,0.2)",
            }}
          >
            <Ionicons name="chevron-back" size={24} color="white" />
          </Pressable>

          {/* Main Content */}
          <View className="flex-1 justify-center items-center px-6 pt-20 pb-32">
            {isLoadingImages ? (
              <View
                className="rounded-3xl items-center justify-center p-8"
                style={{
                  backgroundColor: "rgba(255,255,255,0.1)",
                  borderWidth: 1,
                  borderColor: "rgba(255,255,255,0.2)",
                  width: IMAGE_WIDTH,
                }}
              >
                <ActivityIndicator size="large" color="white" />
                <Text className="text-lg font-medium text-white text-center mt-4">
                  Painting your story&apos;s scenes...
                </Text>
                <Text className="text-sm text-white/60 text-center mt-2">
                  This may take a moment 🎨
                </Text>
              </View>
            ) : error ? (
              <View
                className="rounded-3xl items-center justify-center p-8"
                style={{
                  backgroundColor: "rgba(255,255,255,0.1)",
                  borderWidth: 1,
                  borderColor: "rgba(255,255,255,0.2)",
                  width: IMAGE_WIDTH,
                }}
              >
                <Text className="text-red-400 text-center mb-4">❌ {error}</Text>
                <Pressable
                  onPress={loadImages}
                  className="bg-white/20 px-6 py-3 rounded-full border border-white/30"
                >
                  <Text className="text-white font-semibold">Retry</Text>
                </Pressable>
              </View>
            ) : (
              <Animated.View
                entering={FadeIn.duration(400)}
                exiting={FadeOut.duration(300)}
                className="items-center"
              >
                {/* Image Card */}
                <View
                  style={{
                    borderRadius: 24,
                    overflow: "hidden",
                    borderWidth: 1,
                    borderColor: "rgba(255,255,255,0.2)",
                    shadowColor: "#000",
                    shadowOffset: { width: 0, height: 12 },
                    shadowOpacity: 0.25,
                    shadowRadius: 24,
                  }}
                >
                  {currentImgUrl ? (
                    <Image
                      source={{ uri: currentImgUrl }}
                      resizeMode="cover"
                      style={{ width: IMAGE_WIDTH, height: IMAGE_HEIGHT }}
                    />
                  ) : (
                    <View
                      style={{
                        width: IMAGE_WIDTH,
                        height: IMAGE_HEIGHT,
                        backgroundColor: "rgba(255,255,255,0.1)",
                        justifyContent: "center",
                        alignItems: "center",
                      }}
                    >
                      <Text className="text-white/60 text-center px-8">
                        Image loading...
                      </Text>
                    </View>
                  )}
                </View>

                {/* Story Text - Glass Card */}
                <View
                  className="mt-6 rounded-2xl px-6 py-4"
                  style={{
                    backgroundColor: "rgba(255,255,255,0.1)",
                    borderWidth: 1,
                    borderColor: "rgba(255,255,255,0.2)",
                    width: IMAGE_WIDTH,
                  }}
                >
                  <Text className="text-white text-lg font-medium text-center leading-relaxed">
                    {currentLine?.text || "✨ Your imagination, visualized."}
                  </Text>
                </View>
              </Animated.View>
            )}
          </View>

          {/* Navigation Controls - Liquid Glass */}
          <View className="absolute bottom-8 left-4 right-4">
            <View
              className="flex-row items-center justify-between rounded-2xl p-2"
              style={{
                backgroundColor: "rgba(255,255,255,0.1)",
                borderWidth: 1,
                borderColor: "rgba(255,255,255,0.2)",
              }}
            >
              <Pressable
                disabled={isAtStart || !canNavigate}
                onPress={onPrevious}
                className="flex-1 py-3 rounded-xl items-center justify-center flex-row gap-2"
                style={{
                  backgroundColor: isAtStart || !canNavigate ? "transparent" : "rgba(255,255,255,0.15)",
                }}
              >
                <Ionicons
                  name="chevron-back"
                  size={18}
                  color={isAtStart || !canNavigate ? "rgba(255,255,255,0.3)" : "white"}
                />
                <Text
                  className={`font-semibold ${isAtStart || !canNavigate ? "text-white/30" : "text-white"}`}
                >
                  Previous
                </Text>
              </Pressable>

              <View className="px-4 py-2">
                <Text className="text-white font-bold text-base">
                  {lines.length ? `${index + 1} / ${lines.length}` : "–"}
                </Text>
              </View>

              <Pressable
                disabled={isAtEnd || !canNavigate}
                onPress={onNext}
                className="flex-1 py-3 rounded-xl items-center justify-center flex-row gap-2"
                style={{
                  backgroundColor: isAtEnd || !canNavigate ? "transparent" : "rgba(255,255,255,0.15)",
                }}
              >
                <Text
                  className={`font-semibold ${isAtEnd || !canNavigate ? "text-white/30" : "text-white"}`}
                >
                  Next
                </Text>
                <Ionicons
                  name="chevron-forward"
                  size={18}
                  color={isAtEnd || !canNavigate ? "rgba(255,255,255,0.3)" : "white"}
                />
              </Pressable>
            </View>
          </View>
        </LinearGradient>
      </ImageBackground>
    </>
  );
}
