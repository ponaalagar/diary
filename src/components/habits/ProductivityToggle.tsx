import { Card } from '@/components/ui/Card';
import { IconBadge } from '@/components/ui/IconBadge';
import { Colors } from '@/theme/colors';
import { Typography } from '@/theme/typography';
import React from 'react';
import { StyleSheet, Switch, Text, View } from 'react-native';

interface ProductivityToggleProps {
    value: boolean;
    onToggle: () => void;
}

export function ProductivityToggle({ value, onToggle }: ProductivityToggleProps) {
    return (
        <Card style={styles.card}>
            <View style={styles.left}>
                <IconBadge name="task-alt" color={Colors.productivity} />
                <Text style={styles.label}>Productivity</Text>
            </View>
            <Switch
                value={value}
                onValueChange={onToggle}
                trackColor={{ false: Colors.surfaceOverlay, true: `${Colors.productivity}80` }}
                thumbColor={value ? Colors.productivity : Colors.textMuted}
            />
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
});
