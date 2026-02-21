import { Card } from '@/components/ui/Card';
import { IconBadge } from '@/components/ui/IconBadge';
import { Colors } from '@/theme/colors';
import { Typography } from '@/theme/typography';
import React from 'react';
import { StyleSheet, Text, TextInput, View } from 'react-native';

interface WorkoutInputProps {
    value: number;
    onChange: (value: number) => void;
}

export function WorkoutInput({ value, onChange }: WorkoutInputProps) {
    const handleTextChange = (text: string) => {
        const num = parseInt(text, 10);
        onChange(isNaN(num) ? 0 : num);
    };

    return (
        <Card style={styles.card}>
            <View style={styles.left}>
                <IconBadge name="fitness-center" color={Colors.workout} />
                <Text style={styles.label}>Workout</Text>
            </View>
            <View style={styles.right}>
                <TextInput
                    style={styles.input}
                    keyboardType="numeric"
                    value={value === 0 ? '' : value.toString()}
                    onChangeText={handleTextChange}
                    placeholder="0"
                    placeholderTextColor={Colors.textMuted}
                />
                <Text style={styles.unit}>min</Text>
            </View>
        </Card>
    );
}

const styles = StyleSheet.create({
    card: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 8,
    },
    left: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 12,
    },
    label: {
        ...Typography.bodyMed,
        color: Colors.textPrimary,
    },
    right: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 8,
        backgroundColor: Colors.surfaceOverlay,
        paddingHorizontal: 12,
        paddingVertical: 6,
        borderRadius: 8,
    },
    input: {
        ...Typography.bodyMed,
        color: Colors.textPrimary,
        minWidth: 30,
        textAlign: 'right',
    },
    unit: {
        ...Typography.body,
        color: Colors.textMuted,
    },
});
