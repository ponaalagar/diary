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

    const { isUnlocked, isInitialized, loadInitialState } = useAuthStore();
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

    // Hide splash screen only when BOTH fonts and store data are ready
    useEffect(() => {
        if ((fontsLoaded || fontError) && isInitialized) {
            SplashScreen.hideAsync();
        }
    }, [fontsLoaded, fontError, isInitialized]);

    // Navigation guard — only run after everything is ready
    useEffect(() => {
        if (!fontsLoaded || !isInitialized) return;

        const inAuthGroup = segments[0] === 'auth';

        if (!isUnlocked && !inAuthGroup) {
            // Redirect to the login page.
            router.replace('/auth');
        } else if (isUnlocked && inAuthGroup) {
            // Redirect away from the login page.
            router.replace('/(tabs)/diary');
        }
    }, [isUnlocked, segments, fontsLoaded, isInitialized]);

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

