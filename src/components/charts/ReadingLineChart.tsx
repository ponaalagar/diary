import { Card } from '@/components/ui/Card';
import { Colors } from '@/theme/colors';
import { Typography } from '@/theme/typography';
import React from 'react';
import { Dimensions, StyleSheet, Text, View } from 'react-native';
import { LineChart } from 'react-native-gifted-charts';

const { width } = Dimensions.get('window');

interface ReadingLineChartProps {
    data: { value: number; label: string }[];
    percentChange: number;
}

export function ReadingLineChart({ data, percentChange }: ReadingLineChartProps) {
    const isPositive = percentChange >= 0;

    return (
        <Card style={styles.card}>
            <View style={styles.header}>
                <Text style={styles.title}>Reading Trend</Text>
                <View style={[styles.badge, { backgroundColor: isPositive ? 'rgba(34,197,94,0.2)' : 'rgba(239,68,68,0.2)' }]}>
                    <Text style={[styles.badgeText, { color: isPositive ? '#4ade80' : '#f87171' }]}>
                        {isPositive ? '+' : ''}{percentChange}%
                    </Text>
                </View>
            </View>

            <View style={styles.chartContainer}>
                <LineChart
                    data={data}
                    width={width - 48 - 32 - 16} // screen width - layout padding - card padding - some extra
                    height={160}
                    thickness={3}
                    color={Colors.reading}
                    hideDataPoints
                    hideRules
                    hideYAxisText
                    yAxisThickness={0}
                    xAxisThickness={0}
                    xAxisLabelTextStyle={styles.label}
                    curved
                    isAnimated
                    animationDuration={1000}
                    startFillColor={Colors.reading}
                    startOpacity={0.4}
                    endFillColor={Colors.reading}
                    endOpacity={0.0}
                    initialSpacing={10}
                />
            </View>
        </Card>
    );
}

const styles = StyleSheet.create({
    card: {
        marginBottom: 16,
    },
    header: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 24,
    },
    title: {
        ...Typography.heading3,
        color: Colors.textPrimary,
    },
    badge: {
        paddingHorizontal: 8,
        paddingVertical: 4,
        borderRadius: 12,
    },
    badgeText: {
        ...Typography.micro,
    },
    chartContainer: {
        marginLeft: -20, // adjust gifted chart padding to align left
    },
    label: {
        ...Typography.micro,
        color: Colors.textMuted,
    },
});
