import { MaterialIcons } from '@expo/vector-icons';
import * as LocalAuthentication from 'expo-local-authentication';
import { useRouter } from 'expo-router';
import React, { useEffect, useState } from 'react';
import { Alert, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import Animated, { useAnimatedStyle, useSharedValue, withRepeat, withTiming } from 'react-native-reanimated';
import { SafeAreaView } from 'react-native-safe-area-context';

import { PinPad } from '@/components/auth/PinPad';
import { useAuthStore } from '@/store/authStore';
import { Colors } from '@/theme/colors';
import { Typography } from '@/theme/typography';

const PIN_LENGTH = 6;

export default function AuthScreen() {
    const router = useRouter();
    const { pin: savedPin, setPin, isUnlocked, setUnlocked, incrementFailedAttempt, failedPinAttempts, lockUntil } = useAuthStore();

    const [currentPin, setCurrentPin] = useState('');
    const pulseOpacity = useSharedValue(0.4);

    useEffect(() => {
        pulseOpacity.value = withRepeat(withTiming(1, { duration: 1000 }), -1, true);
    }, []);

    const animatedPulse = useAnimatedStyle(() => ({
        opacity: pulseOpacity.value,
    }));

    const handleBiometricAuth = async () => {
        try {
            const hasHardware = await LocalAuthentication.hasHardwareAsync();
            const isEnrolled = await LocalAuthentication.isEnrolledAsync();

            if (!hasHardware || !isEnrolled) {
                Alert.alert('Unavailable', 'Biometrics are not set up on this device.');
                return;
            }

            const result = await LocalAuthentication.authenticateAsync({
                promptMessage: 'Unlock Secure Vault',
                fallbackLabel: 'Use PIN',
            });

            if (result.success) {
                setUnlocked(true);
                router.replace('/(tabs)/diary');
            }
        } catch (e) {
            console.error(e);
        }
    };

    const handlePinComplete = async (enteredPin: string) => {
        if (lockUntil && Date.now() < lockUntil) {
            Alert.alert('Locked', 'Too many failed attempts. Try again later.');
            setCurrentPin('');
            return;
        }

        if (!savedPin) {
            // First time setup
            await setPin(enteredPin);
            setUnlocked(true);
            router.replace('/(tabs)/diary');
        } else {
            if (enteredPin === savedPin) {
                setUnlocked(true);
                router.replace('/(tabs)/diary');
            } else {
                incrementFailedAttempt();
                Alert.alert('Incorrect PIN', 'Please try again.');
                setCurrentPin('');
            }
        }
    };

    const handlePressNumber = (num: string) => {
        if (currentPin.length < PIN_LENGTH) {
            const newPin = currentPin + num;
            setCurrentPin(newPin);
            if (newPin.length === PIN_LENGTH) {
                setTimeout(() => handlePinComplete(newPin), 100);
            }
        }
    };

    const handlePressDelete = () => {
        if (currentPin.length > 0) {
            setCurrentPin(currentPin.slice(0, -1));
        }
    };

    return (
        <SafeAreaView style={styles.container}>
            {/* Ambient Glow */}
            <View style={styles.ambientGlow} />

            <View style={styles.content}>
                <View style={styles.header}>
                    <View style={styles.statusBadge}>
                        <Animated.View style={[styles.pulseDot, animatedPulse]} />
                        <Text style={styles.statusText}>
                            {savedPin ? 'VAULT LOCKED' : 'SETUP NEW PIN'}
                        </Text>
                        <MaterialIcons name="lock" size={12} color={Colors.textMuted} style={{ marginLeft: 6 }} />
                    </View>
                </View>

                <View style={styles.pinDotsContainer}>
                    {Array.from({ length: PIN_LENGTH }).map((_, i) => (
                        <View key={i} style={[styles.pinDot, currentPin.length > i && styles.pinDotFilled]} />
                    ))}
                </View>

                <PinPad onPressNumber={handlePressNumber} onPressDelete={handlePressDelete} />

                <View style={styles.footer}>
                    {savedPin && (
                        <TouchableOpacity style={styles.biometricButton} onPress={handleBiometricAuth}>
                            <Text style={styles.biometricText}>Unlock with Face ID</Text>
                        </TouchableOpacity>
                    )}

                    <TouchableOpacity style={styles.forgotBtn}>
                        <Text style={styles.forgotText}>Forgot Password?</Text>
                    </TouchableOpacity>
                </View>
            </View>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: Colors.bgDark,
    },
    ambientGlow: {
        position: 'absolute',
        top: -100,
        left: '50%',
        marginLeft: -150,
        width: 300,
        height: 300,
        borderRadius: 150,
        backgroundColor: Colors.primaryMuted,
        opacity: 0.5,
    },
    content: {
        flex: 1,
        justifyContent: 'space-between',
        paddingVertical: 40,
        paddingHorizontal: 24,
    },
    header: {
        alignItems: 'center',
        marginTop: 20,
    },
    statusBadge: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: Colors.surfaceOverlay,
        paddingHorizontal: 12,
        paddingVertical: 6,
        borderRadius: 20,
        borderWidth: 1,
        borderColor: Colors.border,
    },
    pulseDot: {
        width: 6,
        height: 6,
        borderRadius: 3,
        backgroundColor: '#ef4444', // Red-500
        marginRight: 8,
    },
    statusText: {
        ...Typography.micro,
        color: Colors.textMuted,
    },
    pinDotsContainer: {
        flexDirection: 'row',
        justifyContent: 'center',
        gap: 16,
        marginVertical: 40,
    },
    pinDot: {
        width: 12,
        height: 12,
        borderRadius: 6,
        borderWidth: 1,
        borderColor: Colors.textMuted,
    },
    pinDotFilled: {
        backgroundColor: Colors.textPrimary,
        borderColor: Colors.textPrimary,
    },
    footer: {
        alignItems: 'center',
        gap: 20,
        marginTop: 20,
    },
    biometricButton: {
        width: '100%',
        backgroundColor: Colors.primary,
        paddingVertical: 16,
        borderRadius: 50,
        alignItems: 'center',
    },
    biometricText: {
        ...Typography.bodyMed,
        color: Colors.textPrimary,
    },
    forgotBtn: {
        padding: 8,
    },
    forgotText: {
        ...Typography.bodyMed,
        color: Colors.textMuted,
    },
});
