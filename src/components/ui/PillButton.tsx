import { Colors } from '@/theme/colors';
import { Typography } from '@/theme/typography';
import React from 'react';
import { StyleSheet, Text, TextStyle, TouchableOpacity, ViewStyle } from 'react-native';

interface PillButtonProps {
    label: string;
    active?: boolean;
    onPress: () => void;
    style?: ViewStyle | (ViewStyle | undefined)[];
    textStyle?: TextStyle | (TextStyle | undefined)[];
}

export function PillButton({ label, active = false, onPress, style, textStyle }: PillButtonProps) {
    return (
        <TouchableOpacity
            activeOpacity={0.8}
            onPress={onPress}
            style={[
                styles.base,
                active ? styles.active : styles.inactive,
                style,
            ]}
            accessibilityRole="button"
            accessibilityState={{ selected: active }}
            accessibilityLabel={label}
        >
            <Text style={[
                styles.textBase,
                active ? styles.textActive : styles.textInactive,
                textStyle,
            ]}>
                {label}
            </Text>
        </TouchableOpacity>
    );
}

const styles = StyleSheet.create({
    base: {
        paddingHorizontal: 16,
        paddingVertical: 8,
        borderRadius: 20,
        justifyContent: 'center',
        alignItems: 'center',
    },
    active: {
        backgroundColor: Colors.primary,
    },
    inactive: {
        backgroundColor: Colors.surfaceOverlay,
    },
    textBase: {
        ...Typography.bodyMed,
    },
    textActive: {
        color: Colors.textPrimary,
    },
    textInactive: {
        color: Colors.textMuted,
    },
});
