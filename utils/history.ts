import AsyncStorage from '@react-native-async-storage/async-storage';

export type StoryEntry = {
    id: string;
    seed: string;
    createdAt: string; // ISO
    story: Array<{ text: string; prompt: string }>;
};

const HISTORY_KEY = '@storyteller:history';

export const saveStory = async (seed: string, story: StoryEntry['story']) => {
    const newEntry: StoryEntry = {
        id: Date.now().toString(),
        seed,
        createdAt: new Date().toISOString(),
        story,
    };

    const existing = await getHistory();
    const updated = [newEntry, ...existing.slice(0, 19)]; // keep max 20

    await AsyncStorage.setItem(HISTORY_KEY, JSON.stringify(updated));
    return newEntry;
};

export const getHistory = async (): Promise<StoryEntry[]> => {
    const json = await AsyncStorage.getItem(HISTORY_KEY);
    if (!json) return [];
    try {
        return JSON.parse(json) as StoryEntry[];
    } catch {
        return [];
    }
};

export const clearHistory = () => AsyncStorage.removeItem(HISTORY_KEY);