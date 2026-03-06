import * as SecureStore from 'expo-secure-store';
import { create } from 'zustand';

interface AuthState {
    isUnlocked: boolean;
    isInitialized: boolean;
    pin: string | null;
    failedPinAttempts: number;
    lockUntil: number | null;
    setUnlocked: (unlocked: boolean) => void;
    setPin: (pin: string) => Promise<void>;
    incrementFailedAttempt: () => void;
    resetAttempts: () => void;
    loadInitialState: () => Promise<void>;
}

export const useAuthStore = create<AuthState>((set, get) => ({
    isUnlocked: false,
    isInitialized: false,
    pin: null,
    failedPinAttempts: 0,
    lockUntil: null,
    setUnlocked: (unlocked) => set({ isUnlocked: unlocked }),
    setPin: async (pin) => {
        await SecureStore.setItemAsync('app_pin', pin);
        set({ pin });
    },
    incrementFailedAttempt: () => {
        const { failedPinAttempts } = get();
        const attempts = failedPinAttempts + 1;
        if (attempts >= 5) {
            set({ failedPinAttempts: attempts, lockUntil: Date.now() + 30000 });
        } else {
            set({ failedPinAttempts: attempts });
        }
    },
    resetAttempts: () => set({ failedPinAttempts: 0, lockUntil: null }),
    loadInitialState: async () => {
        try {
            const pin = await SecureStore.getItemAsync('app_pin');
            set({ pin });
        } catch (e) {
            console.warn('Failed to load auth state:', e);
        } finally {
            set({ isInitialized: true });
        }
    },
}));
