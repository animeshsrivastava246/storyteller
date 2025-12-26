// story.tsx (enhanced)
import Entypo from "@expo/vector-icons/Entypo";
import { LinearGradient } from "expo-linear-gradient";
import { useLocalSearchParams, useRouter } from "expo-router";
import { useCallback, useEffect, useMemo, useState } from "react";
import {
  ActivityIndicator,
  Dimensions,
  Image,
  ImageBackground,
  Pressable,
  ScrollView,
  Text,
  View,
} from "react-native";
import Animated, { FadeIn, FadeOut } from "react-native-reanimated";

type StoryLine = {
  text: string;
  prompt: string;
};

const { width } = Dimensions.get("window");

export default function Story() {
  const router = useRouter();
  const { story: storyParam } = useLocalSearchParams<{ story?: string }>();

  const [index, setIndex] = useState(0);
  const [imgUrls, setImgUrls] = useState<(string | null)[]>([]);
  const [isLoadingImages, setIsLoadingImages] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const lines: StoryLine[] = useMemo(() => {
    if (!storyParam) return [];
    try {
      return JSON.parse(storyParam);
    } catch (e) {
      console.error("Invalid story JSON", storyParam);
      return [];
    }
  }, [storyParam]);

  const currentLine = lines[index];
  const currentImgUrl = imgUrls[index];

  const loadImages = useCallback(async () => {
    if (!lines.length) return;
    setIsLoadingImages(true);
    setError(null);

    try {
      const urls = await Promise.allSettled(
        lines.map(async (line, i) => {
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
          return imgUrl;
        })
      );

      const newUrls = urls.map((result) => (result.status === "fulfilled" ? result.value : null));
      setImgUrls(newUrls);
    } catch (err: any) {
      console.error("Image loading failed:", err);
      setError(err.message || "Failed to load images");
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

  // ✅ Disable nav until image for current index is loaded
  const canNavigate = !isLoadingImages && currentImgUrl !== null;

  return (
    <ImageBackground
      source={require("../../assets/images/bg.webp")}
      resizeMode="cover"
      imageStyle={{ opacity: 0.3 }}
      className="flex-1"
    >
      <View className="flex-1 pt-12 pb-8 px-4">
        {/* Back */}
        <Pressable
          onPress={() => router.back()}
          className="absolute top-12 left-4 z-10 bg-white/70 backdrop-blur-lg size-12 rounded-full items-center justify-center shadow-md border border-white/20"
        >
          <Entypo name="chevron-left" size={27} color="#1e40af" />
        </Pressable>

        {/* Content */}
        <ScrollView
          contentContainerClassName="items-center gap-8 pb-20"
          className="mt-16"
          keyboardShouldPersistTaps="handled"
        >
          {/* Loading / Error */}
          {isLoadingImages ? (
            <View className="items-center justify-center py-12 gap-4">
              <ActivityIndicator size="large" color="#3b82f6" />
              <Text className="text-lg font-medium text-slate-600 text-center px-8">
                Painting your story’s scenes...
              </Text>
              <Text className="text-sm text-slate-500 text-center px-6">
                This may take 10–20 seconds. Please wait 🎨
              </Text>
            </View>
          ) : error ? (
            <View className="items-center justify-center py-12 gap-3 px-6">
              <Text className="text-red-500 text-center">❌ {error}</Text>
              <Pressable
                onPress={loadImages}
                className="bg-rose-600 px-6 py-3 rounded-full mt-2"
              >
                <Text className="text-white font-semibold">Retry</Text>
              </Pressable>
            </View>
          ) : (
            <>
              {/* Image */}
              {currentImgUrl ? (
                <Animated.View entering={FadeIn.duration(400)} exiting={FadeOut.duration(300)}>
                  <Image
                    source={{ uri: currentImgUrl }}
                    resizeMode="cover"
                    style={{
                      width: width - 48,
                      height: (width - 48) * 0.75, // 4:3
                      borderRadius: 24,
                      borderWidth: 1,
                      borderColor: "rgba(255,255,255,0.2)",
                      shadowColor: "#000",
                      shadowOffset: { width: 0, height: 8 },
                      shadowOpacity: 0.15,
                      shadowRadius: 20,
                    }}
                  />
                </Animated.View>
              ) : (
                <View
                  style={{
                    width: width - 48,
                    height: (width - 48) * 0.75,
                    borderRadius: 24,
                    backgroundColor: "rgba(241,245,249,0.8)",
                    borderWidth: 1,
                    borderColor: "rgba(0,0,0,0.05)",
                    justifyContent: "center",
                    alignItems: "center",
                  }}
                >
                  <Text className="text-gray-500 text-center px-8">
                    Image failed to load. Retrying...
                  </Text>
                </View>
              )}

              {/* Text */}
              <Animated.View entering={FadeIn.delay(300).duration(500)}>
                <LinearGradient
                  colors={["transparent", "rgba(0,0,0,0.3)", "rgba(0,0,0,0.6)"]}
                  style={{
                    position: "absolute",
                    bottom: 0,
                    left: 0,
                    right: 0,
                    height: 120,
                    borderRadius: 24,
                  }}
                  start={{ x: 0.5, y: 0 }}
                  end={{ x: 0.5, y: 1 }}
                />
                <View className="absolute bottom-6 px-6 w-full">
                  <Text className="text-white text-xl font-semibold text-center leading-relaxed">
                    {currentLine?.text || "✨ Your imagination, visualized."}
                  </Text>
                </View>
              </Animated.View>
            </>
          )}
        </ScrollView>

        {/* Navigation Controls (Liquid Glass Style) */}
        <View className="absolute bottom-6 left-4 right-4">
          <View className="flex-row justify-between items-center">
            <Pressable
              disabled={isAtStart || !canNavigate}
              onPress={onPrevious}
              className={`flex-1 py-4 rounded-2xl justify-center items-center mx-1 ${isAtStart || !canNavigate
                ? "bg-gray-200/50"
                : "bg-white/60 backdrop-blur-xl border border-white/20 shadow-lg"
                }`}
            >
              <Text
                className={`font-bold ${isAtStart || !canNavigate ? "text-gray-400" : "text-slate-700"
                  }`}
              >
                ◀ Previous
              </Text>
            </Pressable>

            <View className="bg-black/10 backdrop-blur-lg px-4 py-2 rounded-full border border-white/10">
              <Text className="text-white font-medium">
                {lines.length ? `${index + 1}/${lines.length}` : "–"}
              </Text>
            </View>

            <Pressable
              disabled={isAtEnd || !canNavigate}
              onPress={onNext}
              className={`flex-1 py-4 rounded-2xl justify-center items-center mx-1 ${isAtEnd || !canNavigate
                ? "bg-gray-200/50"
                : "bg-white/60 backdrop-blur-xl border border-white/20 shadow-lg"
                }`}
            >
              <Text
                className={`font-bold ${isAtEnd || !canNavigate ? "text-gray-400" : "text-slate-700"
                  }`}
              >
                Next ▶
              </Text>
            </Pressable>
          </View>
        </View>
      </View>
    </ImageBackground>
  );
}