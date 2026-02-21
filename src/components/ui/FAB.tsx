import { Colors } from '@/theme/colors';
import { MaterialIcons } from '@expo/vector-icons';
import React from 'react';
import { StyleSheet, TouchableOpacity, ViewStyle } from 'react-native';

interface FABProps {
    onPress: () => void;
    icon?: keyof typeof MaterialIcons.glyphMap;
    style?: ViewStyle | (ViewStyle | undefined)[];
}

export function FAB({ onPress, icon = 'add', style }: FABProps) {
    return (
        <TouchableOpacity
            activeOpacity={0.9}
            onPress={onPress}
            style={[styles.container, style]}
            accessibilityRole="button"
            accessibilityLabel="Floating Action Button"
        >
            <MaterialIcons name={icon} size={28} color={Colors.textPrimary} />
        </TouchableOpacity>
    );
}

const styles = StyleSheet.create({
    container: {
        position: 'absolute',
        bottom: 80,
        right: 24,
        width: 56,
        height: 56,
        borderRadius: 28,
        backgroundColor: Colors.primary,
        justifyContent: 'center',
        alignItems: 'center',
        shadowColor: Colors.primary,
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.25,
        shadowRadius: 16,
        elevation: 8,
    },
});
