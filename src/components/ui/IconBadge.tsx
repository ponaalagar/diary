import { MaterialIcons } from '@expo/vector-icons';
import React from 'react';
import { StyleSheet, View, ViewStyle } from 'react-native';

interface IconBadgeProps {
    name: keyof typeof MaterialIcons.glyphMap;
    color: string;
    size?: number;
    style?: ViewStyle | (ViewStyle | undefined)[];
}

export function IconBadge({ name, color, size = 20, style }: IconBadgeProps) {
    return (
        <View style={[styles.iconContainer, { backgroundColor: `${color}18` }, style]}>
            <MaterialIcons name={name} size={size} color={color} />
        </View>
    );
}

const styles = StyleSheet.create({
    iconContainer: {
        width: 36,
        height: 36,
        borderRadius: 18,
        alignItems: 'center',
        justifyContent: 'center',
    },
});
