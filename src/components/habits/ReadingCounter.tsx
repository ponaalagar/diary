import { Card } from '@/components/ui/Card';
import { IconBadge } from '@/components/ui/IconBadge';
import { Colors } from '@/theme/colors';
import { Typography } from '@/theme/typography';
import { MaterialIcons } from '@expo/vector-icons';
import React from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';

interface ReadingCounterProps {
    value: number;
    onChange: (value: number) => void;
}

export function ReadingCounter({ value, onChange }: ReadingCounterProps) {
    return (
        <Card style={styles.card}>
            <View style={styles.left}>
                <IconBadge name="menu-book" color={Colors.reading} />
                <Text style={styles.label}>Reading</Text>
            </View>
            <View style={styles.right}>
                <TouchableOpacity style={styles.btn} onPress={() => onChange(value - 1)}>
                    <MaterialIcons name="remove" size={20} color={Colors.textPrimary} />
                </TouchableOpacity>
                <Text style={styles.value}>{value} pg</Text>
                <TouchableOpacity style={styles.btn} onPress={() => onChange(value + 1)}>
                    <MaterialIcons name="add" size={20} color={Colors.textPrimary} />
                </TouchableOpacity>
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
        gap: 16,
    },
    btn: {
        padding: 4,
        backgroundColor: Colors.surfaceOverlay,
        borderRadius: 8,
    },
    value: {
        ...Typography.bodyMed,
        color: Colors.textPrimary,
        minWidth: 40,
        textAlign: 'center',
    },
});
