import { useAuthStore } from '@/store/authStore';
import { useHabitStore } from '@/store/habitStore';
import { useJournalStore } from '@/store/journalStore';
import { Manrope_400Regular, Manrope_500Medium, Manrope_600SemiBold, Manrope_700Bold, useFonts } from '@expo-google-fonts/manrope';
import { Stack, useRouter, useSegments } from 'expo-router';
import * as SplashScreen from 'expo-splash-screen';
import { useEffect } from 'react';

SplashScreen.preventAutoHideAsync();

export default function RootLayout() {
    const [fontsLoaded, fontError] = useFonts({
        Manrope_400Regular,
        Manrope_500Medium,
        Manrope_600SemiBold,
        Manrope_700Bold,
    });

    const { isUnlocked, loadInitialState } = useAuthStore();
    const { loadEntries } = useJournalStore();
    const { loadHabits } = useHabitStore();
    const segments = useSegments();
    const router = useRouter();

    useEffect(() => {
        async function init() {
            await loadInitialState();
            await loadEntries();
            await loadHabits();
        }
        init();
    }, []);

    useEffect(() => {
        if (fontsLoaded || fontError) {
            SplashScreen.hideAsync();
        }
    }, [fontsLoaded, fontError]);

    useEffect(() => {
        if (!fontsLoaded) return;

        const inAuthGroup = segments[0] === 'auth';

        if (!isUnlocked && !inAuthGroup) {
            // Redirect to the login page.
            router.replace('/auth');
        } else if (isUnlocked && inAuthGroup) {
            // Redirect away from the login page.
            router.replace('/(tabs)/diary');
        }
    }, [isUnlocked, segments, fontsLoaded]);

    if (!fontsLoaded && !fontError) {
        return null;
    }

    return (
        <Stack screenOptions={{ headerShown: false, animation: 'fade' }}>
            <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
            <Stack.Screen name="auth" options={{ headerShown: false, gestureEnabled: false }} />
        </Stack>
    );
}
