import { useFocusEffect } from '@react-navigation/native';
import { router } from 'expo-router';
import { useCallback, useState } from 'react';
import { FlatList, Pressable, Text, View } from 'react-native';
import { getHistory } from '../utils/history';

export default function History() {
  const [stories, setStories] = useState<Awaited<ReturnType<typeof getHistory>>>([]);

  const load = useCallback(async () => {
    setStories(await getHistory());
  }, []);

  // ✅ Correct: useCallback returns a sync function (no async here)
  useFocusEffect(
    useCallback(() => {
      let isActive = true;

      // Async work inside — but outer function is sync
      const load = async () => {
        try {
          const data = await getHistory();
          if (isActive) {
            setStories(data);
          }
        } catch (e) {
          console.error('Failed to load history', e);
        }
      };

      load();

      // Cleanup (in case component unmounts during load)
      return () => {
        isActive = false;
      };
    }, [])
  );

  return (
    <View className="flex-1 bg-slate-50 p-4">
      <Text className="text-2xl font-bold text-slate-800 mb-5">📜 Story Vault</Text>
      {stories.length === 0 ? (
        <View className="flex-1 justify-center items-center">
          <Text className="text-lg text-slate-500">No stories yet. Create one!</Text>
        </View>
      ) : (
        <FlatList
          data={stories}
          keyExtractor={(item) => item.id}
          renderItem={({ item }) => (
            <Pressable
              className="bg-white/60 backdrop-blur-lg border border-white/30 rounded-2xl p-4 mb-3 shadow-sm"
              onPress={() =>
                router.push({
                  pathname: '/story',
                  params: { story: JSON.stringify(item.story) },
                })
              }
            >
              <Text className="font-semibold text-slate-800">{item.seed}</Text>
              <Text className="text-xs text-slate-500 mt-1">
                {new Date(item.createdAt).toLocaleDateString()}
              </Text>
              <Text className="text-sm text-slate-600 mt-2 line-clamp-2">
                {item.story[0]?.text}
              </Text>
            </Pressable>
          )}
        />
      )}
    </View>
  );
}