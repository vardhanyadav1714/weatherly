import { Stack } from 'expo-router';

export default function TabLayout() {
    return (
        <Stack
            screenOptions={{
                headerShown: false,
                contentStyle: { backgroundColor: 'transparent' },
                animation: 'fade',
            }}
        >
            <Stack.Screen name="index" />
        </Stack>
    );
}
