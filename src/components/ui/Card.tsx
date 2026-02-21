import { Colors } from '@/theme/colors';
import React from 'react';
import { StyleSheet, View, ViewStyle } from 'react-native';

interface CardProps {
    children: React.ReactNode;
    style?: ViewStyle | (ViewStyle | undefined)[];
    featured?: boolean;
}

export function Card({ children, style, featured = false }: CardProps) {
    return (
        <View style={[styles.base, featured && styles.featured, style]}>
            {children}
        </View>
    );
}

const styles = StyleSheet.create({
    base: {
        backgroundColor: Colors.bgCard,
        borderRadius: 16,
        borderWidth: 1,
        borderColor: Colors.border,
        padding: 16,
    },
    featured: {
        borderRadius: 20,
        padding: 20,
    },
});
