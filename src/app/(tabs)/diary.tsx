import { MaterialIcons } from '@expo/vector-icons';
import { BlurView } from 'expo-blur';
import React, { useEffect, useState } from 'react';
import { KeyboardAvoidingView, Platform, ScrollView, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { useHabitStore } from '@/store/habitStore';
import { useJournalStore } from '@/store/journalStore';
import { Colors } from '@/theme/colors';
import { Typography } from '@/theme/typography';
import { calculateStreak, formatDatePretty, getTodayDateString } from '@/utils/dateHelpers';

import { ProductivityToggle } from '@/components/habits/ProductivityToggle';
import { ReadingCounter } from '@/components/habits/ReadingCounter';
import { WorkoutInput } from '@/components/habits/WorkoutInput';
import { StreakCard } from '@/components/ui/StreakCard';

export default function DiaryScreen() {
    const insets = useSafeAreaInsets();
    const today = getTodayDateString();

    const { entries, saveEntry } = useJournalStore();
    const { habits, setReading, setWorkout, toggleProductivity } = useHabitStore();

    const [content, setContent] = useState('');

    const todayEntry = entries[today];
    const todayHabits = habits[today] || { reading: 0, workout: 0, productivity: false };

    useEffect(() => {
        if (todayEntry) {
            setContent(todayEntry.content);
        }
    }, [todayEntry]);

    const handleSave = () => {
        saveEntry(today, content);
    };

    const streak = calculateStreak(Object.keys(entries));

    return (
        <KeyboardAvoidingView
            style={styles.container}
            behavior={Platform.OS === 'ios' ? 'padding' : undefined}
        >
            <BlurView intensity={60} tint="dark" style={[styles.header, { paddingTop: insets.top + 16 }]}>
                <View style={styles.headerTop}>
                    <Text style={styles.dateText}>{formatDatePretty(today)}</Text>
                    <View style={styles.badge}>
                        <Text style={styles.badgeText}>ENCRYPTED</Text>
                    </View>
                </View>
                <TouchableOpacity style={styles.saveBtn} onPress={handleSave}>
                    <Text style={styles.saveText}>Save</Text>
                </TouchableOpacity>
            </BlurView>

            <ScrollView contentContainerStyle={[styles.scrollContent, { paddingTop: insets.top + 80 }]}>
                <StreakCard streak={streak} style={styles.streakSection} />

                <View style={styles.journalSection}>
                    <TextInput
                        style={styles.journalInput}
                        multiline
                        placeholder="What's on your mind today?"
                        placeholderTextColor={Colors.textMuted}
                        value={content}
                        onChangeText={setContent}
                        textAlignVertical="top"
                    />
                    <View style={styles.toolbar}>
                        <TouchableOpacity><MaterialIcons name="format-bold" size={24} color={Colors.textMuted} /></TouchableOpacity>
                        <TouchableOpacity><MaterialIcons name="format-italic" size={24} color={Colors.textMuted} /></TouchableOpacity>
                        <TouchableOpacity><MaterialIcons name="format-list-bulleted" size={24} color={Colors.textMuted} /></TouchableOpacity>
                        <TouchableOpacity><MaterialIcons name="image" size={24} color={Colors.textMuted} /></TouchableOpacity>
                    </View>
                </View>

                <View style={styles.habitsSection}>
                    <Text style={styles.sectionTitle}>Daily Habits</Text>
                    <ReadingCounter value={todayHabits.reading} onChange={(val) => setReading(today, val)} />
                    <WorkoutInput value={todayHabits.workout} onChange={(val) => setWorkout(today, val)} />
                    <ProductivityToggle value={todayHabits.productivity} onToggle={() => toggleProductivity(today)} />
                </View>
            </ScrollView>
        </KeyboardAvoidingView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: Colors.bgDark,
    },
    header: {
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        zIndex: 10,
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingHorizontal: 24,
        paddingBottom: 16,
        borderBottomWidth: 1,
        borderBottomColor: Colors.border,
    },
    headerTop: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 12,
    },
    dateText: {
        ...Typography.heading3,
        color: Colors.textPrimary,
    },
    badge: {
        backgroundColor: Colors.primaryMuted,
        paddingHorizontal: 8,
        paddingVertical: 4,
        borderRadius: 12,
    },
    badgeText: {
        ...Typography.micro,
        color: Colors.primary,
    },
    saveBtn: {
        backgroundColor: Colors.primary,
        paddingHorizontal: 16,
        paddingVertical: 8,
        borderRadius: 20,
    },
    saveText: {
        ...Typography.bodyMed,
        color: Colors.textPrimary,
    },
    scrollContent: {
        padding: 24,
        paddingBottom: 100,
    },
    streakSection: {
        marginBottom: 24,
    },
    journalSection: {
        marginBottom: 32,
        flex: 1,
    },
    journalInput: {
        ...Typography.body,
        color: Colors.textPrimary,
        minHeight: 150,
    },
    toolbar: {
        flexDirection: 'row',
        gap: 16,
        marginTop: 16,
        paddingTop: 16,
        borderTopWidth: 1,
        borderTopColor: Colors.border,
    },
    habitsSection: {
        marginBottom: 24,
    },
    sectionTitle: {
        ...Typography.heading3,
        color: Colors.textPrimary,
        marginBottom: 16,
    },
});
