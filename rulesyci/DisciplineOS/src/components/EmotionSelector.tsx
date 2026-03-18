
import React from 'react';
import { View, TouchableOpacity, Text } from 'react-native';

interface EmotionSelectorProps {
    label: string;
    options: string[];
    selected: string;
    onSelect: (option: string) => void;
}

const EmotionSelector: React.FC<EmotionSelectorProps> = ({ label, options, selected, onSelect }) => {
    return (
        <View className="my-4 px-4">
            <Text className="text-gray-700 text-lg mb-3 font-medium text-center">{label}</Text>
            <View className="flex-row flex-wrap justify-center gap-2">
                {options.map((option) => (
                    <TouchableOpacity
                        key={option}
                        onPress={() => onSelect(option)}
                        activeOpacity={0.7}
                        className={`px-4 py-2 rounded-full border mb-2 ${selected === option ? 'bg-focusedSlate border-focusedSlate' : 'bg-white border-gray-300'
                            }`}
                    >
                        <Text className={`capitalize font-medium ${selected === option ? 'text-white' : 'text-gray-700'}`}>
                            {option}
                        </Text>
                    </TouchableOpacity>
                ))}
            </View>
        </View>
    );
};

export default EmotionSelector;
