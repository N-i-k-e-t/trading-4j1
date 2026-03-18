
import React from 'react';
import { View, Text, TextInput } from 'react-native';

interface ShortTextInputProps {
    label: string;
    value: string;
    onChangeText: (text: string) => void;
    placeholder?: string;
    multiline?: boolean;
}

const ShortTextInput = ({ label, value, onChangeText, placeholder, multiline = false }: ShortTextInputProps) => {
    return (
        <View className="mb-4 px-4">
            <Text className="text-gray-700 font-medium mb-1.5 ml-1">{label}</Text>
            <TextInput
                value={value}
                onChangeText={onChangeText}
                placeholder={placeholder}
                multiline={multiline}
                numberOfLines={multiline ? 3 : 1}
                className={`w-full bg-white border border-gray-200 rounded-xl px-4 py-3 text-base text-[#2C3E4C] ${multiline ? 'h-24 py-3' : 'h-12'
                    }`}
                placeholderTextColor="#9CA3AF"
            />
        </View>
    );
};

export default ShortTextInput;
