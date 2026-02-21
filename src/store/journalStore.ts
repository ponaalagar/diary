import * as SecureStore from 'expo-secure-store';
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

// Helper to encrypt/decrypt (using SecureStore for now)
const JOURNAL_KEY = 'journal_entries';

export const useJournalStore = create<JournalState>((set, get) => ({
    entries: {},
    saveEntry: async (date, content) => {
        const entries = { ...get().entries };
        const id = entries[date]?.id || Math.random().toString(36).substring(7);
        entries[date] = { id, date, content, timestamp: Date.now() };

        // Save to SecureStore
        await SecureStore.setItemAsync(JOURNAL_KEY, JSON.stringify(entries));
        set({ entries });
    },
    getEntry: (date) => get().entries[date],
    loadEntries: async () => {
        try {
            const data = await SecureStore.getItemAsync(JOURNAL_KEY);
            if (data) {
                set({ entries: JSON.parse(data) });
            }
        } catch (e) {
            console.error('Failed to load journals', e);
        }
    },
}));
