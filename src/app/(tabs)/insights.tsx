import { BlurView } from 'expo-blur';
import React from 'react';
import { ScrollView, StyleSheet, Text, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { FitnessBarChart } from '@/components/charts/FitnessBarChart';
import { ReadingLineChart } from '@/components/charts/ReadingLineChart';
import { Card } from '@/components/ui/Card';
import { useHabitStore } from '@/store/habitStore';
import { useJournalStore } from '@/store/journalStore';
import { Colors } from '@/theme/colors';
import { Typography } from '@/theme/typography';
import { calculateStreak } from '@/utils/dateHelpers';
import { format, subDays } from 'date-fns';

export default function InsightsScreen() {
    const insets = useSafeAreaInsets();
    const { habits } = useHabitStore();
    const { entries } = useJournalStore();

    // Generate last 7 days keys
    const last7Days = Array.from({ length: 7 }).map((_, i) => format(subDays(new Date(), 6 - i), 'yyyy-MM-dd'));
    const shortLabels = last7Days.map(d => format(new Date(d), 'EEE')); // Mon, Tue, etc.

    // Aggregate reading data
    const readingData = last7Days.map((d, i) => ({
        value: habits[d]?.reading || 0,
        label: shortLabels[i][0] // M, T, W...
    }));
    const totalReading = readingData.reduce((acc, curr) => acc + curr.value, 0);
    const percentChangeReading = +12.5; // Stub

    // Aggregate fitness data
    const fitnessData = last7Days.map((d, i) => ({
        value: habits[d]?.workout || 0,
        label: shortLabels[i][0]
    }));
    const totalFitness = fitnessData.reduce((acc, curr) => acc + curr.value, 0);
    const avgWorkout = Math.round(totalFitness / 7);

    const currentStreak = calculateStreak(Object.keys(entries));

    return (
        <View style={styles.container}>
            <BlurView intensity={60} tint="dark" style={[styles.header, { paddingTop: insets.top + 16 }]}>
                <Text style={styles.headerTitle}>Insights</Text>
            </BlurView>

            <ScrollView contentContainerStyle={[styles.content, { paddingTop: insets.top + 80 }]}>

                {/* High-Level Metrics Row */}
                <View style={styles.metricsRow}>
                    <Card style={styles.metricCard}>
                        <Text style={styles.metricValue}>{totalReading}</Text>
                        <Text style={styles.metricLabel}>Total Pages</Text>
                    </Card>
                    <Card style={styles.metricCard}>
                        <Text style={styles.metricValue}>{avgWorkout}m</Text>
                        <Text style={styles.metricLabel}>Avg Workout</Text>
                    </Card>
                    <Card style={styles.metricCard}>
                        <Text style={styles.metricValue}>{currentStreak}</Text>
                        <Text style={styles.metricLabel}>Streak</Text>
                    </Card>
                </View>

                {/* Charts */}
                <ReadingLineChart data={readingData} percentChange={percentChangeReading} />
                <FitnessBarChart data={fitnessData} />

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
        paddingHorizontal: 24,
        paddingBottom: 16,
        borderBottomWidth: 1,
        borderBottomColor: Colors.border,
    },
    headerTitle: {
        ...Typography.heading2,
        color: Colors.textPrimary,
    },
    content: {
        padding: 24,
        paddingBottom: 100,
    },
    metricsRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        gap: 8,
        marginBottom: 24,
    },
    metricCard: {
        flex: 1,
        alignItems: 'center',
        padding: 12,
    },
    metricValue: {
        ...Typography.heading3,
        color: Colors.textPrimary,
    },
    metricLabel: {
        ...Typography.micro,
        color: Colors.textMuted,
        marginTop: 4,
        textAlign: 'center',
    },
});
