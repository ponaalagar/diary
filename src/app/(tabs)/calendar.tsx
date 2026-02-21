import React, { useState } from 'react';
import { Dimensions, ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import Animated, { useAnimatedStyle, withSpring } from 'react-native-reanimated';
import { SafeAreaView, useSafeAreaInsets } from 'react-native-safe-area-context';

import { Card } from '@/components/ui/Card';
import { useHabitStore } from '@/store/habitStore';
import { useJournalStore } from '@/store/journalStore';
import { Colors } from '@/theme/colors';
import { Typography } from '@/theme/typography';
import { calculateStreak, formatDatePretty, formatMonthYear, getTodayDateString } from '@/utils/dateHelpers';
import { eachDayOfInterval, endOfMonth, format, startOfMonth } from 'date-fns';

const { width } = Dimensions.get('window');
const CELL_SIZE = (width - 48 - 48) / 7; // padding horizontal 24 * 2, gap 8 * 6 = 48 -> (w - 48 - 48) / 7

export default function CalendarScreen() {
    const insets = useSafeAreaInsets();
    const today = new Date();
    const [selectedDate, setSelectedDate] = useState<string>(getTodayDateString());

    const { entries } = useJournalStore();
    const { habits } = useHabitStore();

    const monthStart = startOfMonth(today);
    const monthEnd = endOfMonth(today);
    const daysInMonth = eachDayOfInterval({ start: monthStart, end: monthEnd });

    // Stats
    const productiveDays = Object.values(habits).filter(h => h.productivity).length;
    const totalEntries = Object.keys(entries).length;
    const currentStreak = calculateStreak(Object.keys(entries));

    const previewActive = selectedDate !== null;

    const animatedPreviewStyle = useAnimatedStyle(() => {
        return {
            transform: [
                { translateY: withSpring(previewActive ? 0 : 400, { damping: 20, stiffness: 90 }) }
            ],
            opacity: withSpring(previewActive ? 1 : 0),
        };
    });

    const selectedHabit = habits[selectedDate] || { reading: 0, workout: 0, productivity: false };
    const selectedEntry = entries[selectedDate];

    return (
        <SafeAreaView style={styles.container}>
            <ScrollView contentContainerStyle={styles.scrollContent}>

                {/* Stats Row */}
                <View style={styles.statsRow}>
                    <Card style={styles.statCard}>
                        <Text style={styles.statValue}>{currentStreak}</Text>
                        <Text style={styles.statLabel}>Streak</Text>
                    </Card>
                    <Card style={styles.statCard}>
                        <Text style={styles.statValue}>{productiveDays}</Text>
                        <Text style={styles.statLabel}>Productive</Text>
                    </Card>
                    <Card style={styles.statCard}>
                        <Text style={styles.statValue}>{totalEntries}</Text>
                        <Text style={styles.statLabel}>Entries</Text>
                    </Card>
                </View>

                {/* Calendar Grid */}
                <Card style={styles.calendarCard}>
                    <Text style={styles.monthHeader}>{formatMonthYear(today)}</Text>
                    <View style={styles.daysOfWeek}>
                        {['S', 'M', 'T', 'W', 'T', 'F', 'S'].map((d, i) => (
                            <Text key={i} style={styles.dayOfWeekText}>{d}</Text>
                        ))}
                    </View>
                    <View style={styles.grid}>
                        {/* Blank cells for offset could be added here based on monthStart.getDay() */}
                        {Array.from({ length: monthStart.getDay() }).map((_, i) => (
                            <View key={`empty-${i}`} style={styles.cellEmpty} />
                        ))}
                        {daysInMonth.map((date) => {
                            const dateStr = format(date, 'yyyy-MM-dd');
                            const habit = habits[dateStr];
                            const entry = entries[dateStr];

                            let bgColor = Colors.border;
                            if (habit?.productivity) bgColor = Colors.productivity;
                            else if (entry) bgColor = Colors.primary;

                            const isSelected = selectedDate === dateStr;

                            return (
                                <TouchableOpacity
                                    key={dateStr}
                                    onPress={() => setSelectedDate(dateStr)}
                                    style={[
                                        styles.cell,
                                        { backgroundColor: bgColor },
                                        isSelected && styles.cellSelected
                                    ]}
                                >
                                    <Text style={styles.cellText}>{format(date, 'd')}</Text>
                                </TouchableOpacity>
                            );
                        })}
                    </View>
                </Card>

            </ScrollView>

            {/* Day Preview Card */}
            <Animated.View style={[styles.previewContainer, { paddingBottom: insets.bottom + 80 }, animatedPreviewStyle]}>
                <View style={styles.previewHeader}>
                    <Text style={styles.previewDate}>{formatDatePretty(selectedDate)}</Text>
                </View>
                <View style={styles.tagsRow}>
                    {selectedHabit.reading > 0 && (
                        <View style={[styles.tag, { backgroundColor: Colors.reading }]}><Text style={styles.tagText}>Reading</Text></View>
                    )}
                    {selectedHabit.workout > 0 && (
                        <View style={[styles.tag, { backgroundColor: Colors.workout }]}><Text style={styles.tagText}>Workout</Text></View>
                    )}
                    {selectedHabit.productivity && (
                        <View style={[styles.tag, { backgroundColor: Colors.productivity }]}><Text style={styles.tagText}>Productive</Text></View>
                    )}
                </View>
                {selectedEntry ? (
                    <Text style={styles.entrySnippet}>{selectedEntry.content}</Text>
                ) : (
                    <Text style={styles.entrySnippetEmpy}>No journal entry for this day.</Text>
                )}
            </Animated.View>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: Colors.bgDark,
    },
    scrollContent: {
        padding: 24,
        paddingBottom: 250,
    },
    statsRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        gap: 12,
        marginBottom: 24,
    },
    statCard: {
        flex: 1,
        alignItems: 'center',
        padding: 12,
    },
    statValue: {
        ...Typography.heading2,
        color: Colors.textPrimary,
    },
    statLabel: {
        ...Typography.micro,
        color: Colors.textMuted,
        marginTop: 4,
        textAlign: 'center',
    },
    calendarCard: {
        padding: 24,
    },
    monthHeader: {
        ...Typography.heading3,
        color: Colors.textPrimary,
        marginBottom: 16,
        textAlign: 'center',
    },
    daysOfWeek: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginBottom: 12,
    },
    dayOfWeekText: {
        ...Typography.micro,
        color: Colors.textMuted,
        width: CELL_SIZE,
        textAlign: 'center',
    },
    grid: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        gap: 8,
    },
    cellEmpty: {
        width: CELL_SIZE,
        height: CELL_SIZE,
    },
    cell: {
        width: CELL_SIZE,
        height: CELL_SIZE,
        borderRadius: CELL_SIZE / 2,
        justifyContent: 'center',
        alignItems: 'center',
    },
    cellSelected: {
        borderWidth: 2,
        borderColor: Colors.textPrimary,
    },
    cellText: {
        ...Typography.bodyMed,
        color: Colors.textPrimary,
        fontSize: 13,
    },
    previewContainer: {
        position: 'absolute',
        bottom: 0,
        left: 0,
        right: 0,
        backgroundColor: Colors.bgCard,
        borderTopLeftRadius: 24,
        borderTopRightRadius: 24,
        padding: 24,
        borderTopWidth: 1,
        borderTopColor: Colors.border,
        shadowColor: Colors.primary,
        shadowOffset: { width: 0, height: -4 },
        shadowOpacity: 0.25,
        shadowRadius: 16,
        elevation: 8,
    },
    previewHeader: {
        marginBottom: 12,
    },
    previewDate: {
        ...Typography.heading3,
        color: Colors.textPrimary,
    },
    tagsRow: {
        flexDirection: 'row',
        gap: 8,
        marginBottom: 16,
        flexWrap: 'wrap',
    },
    tag: {
        paddingHorizontal: 12,
        paddingVertical: 4,
        borderRadius: 12,
    },
    tagText: {
        ...Typography.micro,
        color: Colors.bgDark,
    },
    entrySnippet: {
        ...Typography.body,
        color: Colors.textPrimary,
    },
    entrySnippetEmpy: {
        ...Typography.body,
        color: Colors.textMuted,
        fontStyle: 'italic',
    }
});
