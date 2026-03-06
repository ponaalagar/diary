import { Card } from '@/components/ui/Card';
import { Colors } from '@/theme/colors';
import { Typography } from '@/theme/typography';
import React from 'react';
import { Dimensions, StyleSheet, Text, View } from 'react-native';
import { BarChart } from 'react-native-gifted-charts';

const { width } = Dimensions.get('window');

interface FitnessBarChartProps {
    data: { value: number; label: string }[];
}

export function FitnessBarChart({ data }: FitnessBarChartProps) {
    return (
        <Card style={styles.card}>
            <View style={styles.header}>
                <Text style={styles.title}>Fitness Duration</Text>
            </View>

            <View style={styles.chartContainer}>
                <BarChart
                    data={data}
                    width={width - 48 - 32 - 16}
                    height={160}
                    frontColor={Colors.productivity} // spec said fitness chart uses productivity color
                    //borderRadius={6}
                    hideRules
                    hideYAxisText
                    yAxisThickness={0}
                    xAxisThickness={0}
                    xAxisLabelTextStyle={styles.label}
                    initialSpacing={10}
                    barWidth={24}
                    spacing={(width - 48 - 32 - 16 - (24 * 7)) / 7} // calculate dynamic spacing for 7 bars
                    isAnimated
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
        marginBottom: 24,
    },
    title: {
        ...Typography.heading3,
        color: Colors.textPrimary,
    },
    chartContainer: {
        marginLeft: -20,
    },
    label: {
        ...Typography.micro,
        color: Colors.textMuted,
    },
});
