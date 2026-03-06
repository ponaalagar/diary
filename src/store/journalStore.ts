import AsyncStorage from '@react-native-async-storage/async-storage';
import { create } from 'zustand';

export interface JournalEntry {
    id: string;
    date: string; // YYYY-MM-DD
    content: string;
    timestamp: number;
}

interface JournalState {
    entries: Record<string, JournalEntry>;
    saveEntry: (date: string, content: string) => Promise<void>;
    getEntry: (date: string) => JournalEntry | undefined;
    loadEntries: () => Promise<void>;
}

const JOURNAL_KEY = 'journal_entries';

export const useJournalStore = create<JournalState>((set, get) => ({
    entries: {},
    saveEntry: async (date, content) => {
        const entries = { ...get().entries };
        const id = entries[date]?.id || Math.random().toString(36).substring(7);
        entries[date] = { id, date, content, timestamp: Date.now() };

        // Save to AsyncStorage (no size limit unlike SecureStore's 2KB on Android)
        await AsyncStorage.setItem(JOURNAL_KEY, JSON.stringify(entries));
        set({ entries });
    },
    getEntry: (date) => get().entries[date],
    loadEntries: async () => {
        try {
            const data = await AsyncStorage.getItem(JOURNAL_KEY);
            if (data) {
                set({ entries: JSON.parse(data) });
            }
        } catch (e) {
            console.error('Failed to load journals', e);
        }
    },
}));
