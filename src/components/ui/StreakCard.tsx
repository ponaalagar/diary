import { Colors } from '@/theme/colors';
import { Typography } from '@/theme/typography';
import { MaterialIcons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import React from 'react';
import { StyleSheet, Text, View, ViewStyle } from 'react-native';

interface StreakCardProps {
    streak: number;
    style?: ViewStyle | (ViewStyle | undefined)[];
}

export function StreakCard({ streak, style }: StreakCardProps) {
    return (
        <View style={[styles.shadowContainer, style]}>
            <LinearGradient
                colors={[Colors.primary, '#6366f1']}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 1 }}
                style={styles.container}
            >
                <View style={styles.content}>
                    <MaterialIcons name="local-fire-department" size={32} color={Colors.textPrimary} />
                    <View style={styles.textContainer}>
                        <Text style={styles.title}>{streak} Days</Text>
                        <Text style={styles.subtitle}>Current Streak</Text>
                    </View>
                </View>
            </LinearGradient>
        </View>
    );
}

const styles = StyleSheet.create({
    shadowContainer: {
        shadowColor: Colors.primary,
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.25,
        shadowRadius: 16,
        elevation: 8,
        borderRadius: 20,
    },
    container: {
        borderRadius: 20,
        padding: 20,
    },
    content: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    textContainer: {
        marginLeft: 16,
    },
    title: {
        ...Typography.heading1,
        color: Colors.textPrimary,
    },
    subtitle: {
        ...Typography.bodyMed,
        color: 'rgba(255, 255, 255, 0.8)',
    },
});
