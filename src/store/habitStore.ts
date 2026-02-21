import AsyncStorage from '@react-native-async-storage/async-storage';
import { create } from 'zustand';

export interface DailyHabits {
    reading: number; // pages
    workout: number; // minutes
    productivity: boolean; // toggled
}

interface HabitState {
    habits: Record<string, DailyHabits>;
    setReading: (date: string, pages: number) => void;
    setWorkout: (date: string, minutes: number) => void;
    toggleProductivity: (date: string) => void;
    loadHabits: () => Promise<void>;
}

const HABITS_KEY = '@habits';

const defaultHabits: DailyHabits = { reading: 0, workout: 0, productivity: false };

export const useHabitStore = create<HabitState>((set, get) => ({
    habits: {},
    setReading: async (date, pages) => {
        const habits = { ...get().habits };
        habits[date] = { ...(habits[date] || defaultHabits), reading: Math.max(0, pages) };
        set({ habits });
        await AsyncStorage.setItem(HABITS_KEY, JSON.stringify(habits));
    },
    setWorkout: async (date, minutes) => {
        const habits = { ...get().habits };
        habits[date] = { ...(habits[date] || defaultHabits), workout: Math.max(0, minutes) };
        set({ habits });
        await AsyncStorage.setItem(HABITS_KEY, JSON.stringify(habits));
    },
    toggleProductivity: async (date) => {
        const habits = { ...get().habits };
        const current = habits[date] || defaultHabits;
        habits[date] = { ...current, productivity: !current.productivity };
        set({ habits });
        await AsyncStorage.setItem(HABITS_KEY, JSON.stringify(habits));
    },
    loadHabits: async () => {
        try {
            const data = await AsyncStorage.getItem(HABITS_KEY);
            if (data) {
                set({ habits: JSON.parse(data) });
            }
        } catch (e) {
            console.error('Failed to load habits', e);
        }
    },
}));
