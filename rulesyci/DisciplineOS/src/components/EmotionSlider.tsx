
import React from 'react';
import { View, Text } from 'react-native';
import Slider from '@react-native-community/slider';

interface EmotionSliderProps {
    label: string;
    value: number;
    onValueChange: (value: number) => void;
    min: number;
    max: number;
}

const EmotionSlider: React.FC<EmotionSliderProps> = ({ label, value, onValueChange, min, max }) => {
    return (
        <View className="my-4 px-4">
            <Text className="text-gray-700 text-lg mb-2 text-center font-medium">{label}: {value}</Text>
            <Slider
                style={{ width: '100%', height: 40 }}
                minimumValue={min}
                maximumValue={max}
                step={1}
                value={value}
                onValueChange={onValueChange}
                minimumTrackTintColor="#4AC76A"
                maximumTrackTintColor="#D1D5DB"
                thumbTintColor="#2C3E4C"
            />
            <View className="flex-row justify-between w-full px-2">
                <Text className="text-gray-400 text-xs">{min}</Text>
                <Text className="text-gray-400 text-xs">{max}</Text>
            </View>
        </View>
    );
};

export default EmotionSlider;
