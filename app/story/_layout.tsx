// app/story/_layout.tsx
import { Stack } from 'expo-router/stack';

export default function StoryStackLayout() {
    return (
        <Stack
            screenOptions={{
                // ✅ Enables native iOS 17+ liquid glass header automatically
                headerBlurEffect: 'systemUltraThinMaterial', // or 'systemMaterial', 'systemChromeMaterial'
                headerTransparent: true,
                headerTintColor: 'white',
                headerTitleStyle: { fontWeight: 'bold' },
            }}
        >
            <Stack.Screen
                name="index"
                options={{
                    title: 'Your Story',
                    headerBackTitle: 'Home',
                }}
            />
        </Stack>
    );
}