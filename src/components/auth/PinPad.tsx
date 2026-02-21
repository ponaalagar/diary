import { Colors } from '@/theme/colors';
import { Typography } from '@/theme/typography';
import { MaterialIcons } from '@expo/vector-icons';
import React from 'react';
import { Dimensions, StyleSheet, Text, TouchableOpacity, View } from 'react-native';

interface PinPadProps {
    onPressNumber: (num: string) => void;
    onPressDelete: () => void;
}

const { width } = Dimensions.get('window');
const BUTTON_SIZE = (width - 120) / 3;

export function PinPad({ onPressNumber, onPressDelete }: PinPadProps) {
    const renderButton = (num: string) => (
        <TouchableOpacity
            key={num}
            style={styles.button}
            onPress={() => onPressNumber(num)}
            activeOpacity={0.7}
        >
            <Text style={styles.buttonText}>{num}</Text>
        </TouchableOpacity>
    );

    return (
        <View style={styles.container}>
            <View style={styles.row}>
                {['1', '2', '3'].map(renderButton)}
            </View>
            <View style={styles.row}>
                {['4', '5', '6'].map(renderButton)}
            </View>
            <View style={styles.row}>
                {['7', '8', '9'].map(renderButton)}
            </View>
            <View style={styles.row}>
                <View style={styles.emptyButton} />
                {renderButton('0')}
                <TouchableOpacity
                    style={styles.button}
                    onPress={onPressDelete}
                    activeOpacity={0.7}
                >
                    <MaterialIcons name="backspace" size={24} color={Colors.textPrimary} />
                </TouchableOpacity>
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        width: '100%',
        maxWidth: 320,
        alignSelf: 'center',
        gap: 16,
    },
    row: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        width: '100%',
    },
    button: {
        width: BUTTON_SIZE,
        height: BUTTON_SIZE,
        borderRadius: BUTTON_SIZE / 2,
        backgroundColor: Colors.surfaceOverlay,
        justifyContent: 'center',
        alignItems: 'center',
    },
    emptyButton: {
        width: BUTTON_SIZE,
        height: BUTTON_SIZE,
    },
    buttonText: {
        ...Typography.heading2,
        color: Colors.textPrimary,
    },
});
