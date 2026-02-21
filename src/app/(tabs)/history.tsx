import { MaterialIcons } from '@expo/vector-icons';
import { BlurView } from 'expo-blur';
import React, { useState } from 'react';
import { ScrollView, StyleSheet, Text, TextInput, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { Card } from '@/components/ui/Card';
import { IconBadge } from '@/components/ui/IconBadge';
import { PillButton } from '@/components/ui/PillButton';
import { useHabitStore } from '@/store/habitStore';
import { useJournalStore } from '@/store/journalStore';
import { Colors } from '@/theme/colors';
import { Typography } from '@/theme/typography';
import { formatDatePretty } from '@/utils/dateHelpers';

type FilterType = 'All' | 'Reading' | 'Workout' | 'Productivity';

export default function HistoryScreen() {
    const insets = useSafeAreaInsets();
    const [searchQuery, setSearchQuery] = useState('');
    const [filter, setFilter] = useState<FilterType>('All');

    const { entries } = useJournalStore();
    const { habits } = useHabitStore();

    // Combine entries and habits into a timeline format
    // In a real app this would be more complex and memoized
    const allDates = Array.from(new Set([...Object.keys(entries), ...Object.keys(habits)])).sort().reverse();

    const renderActivityCard = (type: string, metadata: string, timestamp: string, color: string, icon: keyof typeof MaterialIcons.glyphMap) => (
        <Card style={styles.activityCard}>
            <View style={styles.activityLeft}>
                <IconBadge name={icon} color={color} size={18} />
                <View style={styles.activityInfo}>
                    <Text style={styles.activityTitle}>{type}</Text>
                    <Text style={styles.activityMetadata}>{metadata}</Text>
                </View>
            </View>
            <Text style={styles.activityTime}>{timestamp}</Text>
        </Card>
    );

    return (
        <View style={styles.container}>
            <BlurView intensity={60} tint="dark" style={[styles.header, { paddingTop: insets.top + 16 }]}>
                <View style={styles.searchBar}>
                    <MaterialIcons name="search" size={20} color={Colors.textMuted} />
                    <TextInput
                        style={styles.searchInput}
                        placeholder="Search activities..."
                        placeholderTextColor={Colors.textMuted}
                        value={searchQuery}
                        onChangeText={setSearchQuery}
                    />
                </View>
                <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.filterScroll}>
                    {(['All', 'Reading', 'Workout', 'Productivity'] as FilterType[]).map((f) => (
                        <PillButton
                            key={f}
                            label={f}
                            active={filter === f}
                            onPress={() => setFilter(f)}
                            style={styles.filterPill}
                        />
                    ))}
                </ScrollView>
            </BlurView>

            <ScrollView contentContainerStyle={[styles.content, { paddingTop: insets.top + 120 }]}>
                {allDates.map((date) => {
                    const dailyHabits = habits[date];
                    const hasReading = dailyHabits?.reading > 0 && (filter === 'All' || filter === 'Reading');
                    const hasWorkout = dailyHabits?.workout > 0 && (filter === 'All' || filter === 'Workout');
                    const hasProductivity = dailyHabits?.productivity && (filter === 'All' || filter === 'Productivity');

                    if (!hasReading && !hasWorkout && !hasProductivity && filter !== 'All') return null;

                    return (
                        <View key={date} style={styles.daySection}>
                            <Text style={styles.sectionHeader}>{formatDatePretty(date).toUpperCase()}</Text>

                            {hasReading && renderActivityCard(
                                'Reading', `${dailyHabits.reading} pages`, '10:00 AM', Colors.reading, 'menu-book'
                            )}
                            {hasWorkout && renderActivityCard(
                                'Workout', `${dailyHabits.workout} minutes`, '07:30 AM', Colors.workout, 'fitness-center'
                            )}
                            {hasProductivity && renderActivityCard(
                                'Productivity', 'Completed', '05:00 PM', Colors.productivity, 'task-alt'
                            )}
                            {entries[date] && filter === 'All' && renderActivityCard(
                                'Journal Entry', `${entries[date].content.substring(0, 30)}...`, '09:00 PM', Colors.primary, 'edit-note'
                            )}
                        </View>
                    );
                })}
            </ScrollView>
        </View>
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
        borderBottomWidth: 1,
        borderBottomColor: Colors.border,
        paddingBottom: 16,
    },
    searchBar: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: Colors.bgCard,
        marginHorizontal: 24,
        borderRadius: 12,
        paddingHorizontal: 12,
        height: 48,
        marginBottom: 16,
    },
    searchInput: {
        ...Typography.body,
        color: Colors.textPrimary,
        marginLeft: 8,
        flex: 1,
    },
    filterScroll: {
        paddingHorizontal: 24,
        gap: 8,
    },
    filterPill: {
        marginRight: 8,
    },
    content: {
        padding: 24,
        paddingBottom: 100,
    },
    daySection: {
        marginBottom: 24,
    },
    sectionHeader: {
        ...Typography.micro,
        color: Colors.textMuted,
        marginBottom: 12,
    },
    activityCard: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        padding: 12,
        marginBottom: 8,
    },
    activityLeft: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 12,
    },
    activityInfo: {
        gap: 2,
    },
    activityTitle: {
        ...Typography.bodyMed,
        color: Colors.textPrimary,
    },
    activityMetadata: {
        ...Typography.body,
        color: Colors.textMuted,
        fontSize: 13,
    },
    activityTime: {
        ...Typography.body,
        color: Colors.textMuted,
        fontSize: 12,
    },
});
