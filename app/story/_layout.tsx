import { Stack } from 'expo-router';

export default function Layout() {
    return <Stack screenOptions={{
        headerStyle: {
            backgroundColor: '#ffffff00',
        },
        headerTintColor: '#000000',
        headerTitleStyle: {
            fontWeight: 'bold',
        },
    }} />;
}
