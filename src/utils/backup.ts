import AsyncStorage from '@react-native-async-storage/async-storage';
import * as DocumentPicker from 'expo-document-picker';
import * as FileSystem from 'expo-file-system/legacy';
import * as SecureStore from 'expo-secure-store';
import * as Sharing from 'expo-sharing';
import { Alert } from 'react-native';

import { useHabitStore } from '@/store/habitStore';
import { useJournalStore } from '@/store/journalStore';

const HABITS_KEY = '@habits';
const JOURNAL_KEY = 'journal_entries';

export const exportData = async () => {
    try {
        const habitsData = await AsyncStorage.getItem(HABITS_KEY);
        const journalData = await SecureStore.getItemAsync(JOURNAL_KEY);

        const exportObj = {
            habits: habitsData ? JSON.parse(habitsData) : {},
            journals: journalData ? JSON.parse(journalData) : {}
        };

        const jsonString = JSON.stringify(exportObj, null, 2);

        const fileUri = `${FileSystem.documentDirectory}diary-backup-${new Date().toISOString().split('T')[0]}.json`;

        await FileSystem.writeAsStringAsync(fileUri, jsonString, {
            encoding: FileSystem.EncodingType.UTF8
        });

        if (await Sharing.isAvailableAsync()) {
            await Sharing.shareAsync(fileUri, {
                mimeType: 'application/json',
                dialogTitle: 'Export Diary Backup'
            });
        } else {
            Alert.alert('Error', 'Sharing is not available on this device');
        }
    } catch (error) {
        console.error('Export failed:', error);
        Alert.alert('Error', 'Failed to export data.');
    }
};

export const importData = async () => {
    try {
        const result = await DocumentPicker.getDocumentAsync({
            type: ['application/json', 'text/plain', '*/*'],
            copyToCacheDirectory: true
        });

        if (result.canceled) {
            return;
        }

        const fileUri = result.assets[0].uri;
        const fileContent = await FileSystem.readAsStringAsync(fileUri, {
            encoding: FileSystem.EncodingType.UTF8
        });

        const data = JSON.parse(fileContent);

        if (data.habits) {
            await AsyncStorage.setItem(HABITS_KEY, JSON.stringify(data.habits));
        }

        if (data.journals) {
            await SecureStore.setItemAsync(JOURNAL_KEY, JSON.stringify(data.journals));
        }

        // Reload stores so UI updates
        const habitsStore = useHabitStore.getState();
        const journalsStore = useJournalStore.getState();
        await habitsStore.loadHabits();
        await journalsStore.loadEntries();

        Alert.alert('Success', 'Data restored successfully!');
    } catch (error) {
        console.error('Import failed:', error);
        Alert.alert('Error', 'Failed to import data. Make sure the file is a valid backup.');
    }
};
