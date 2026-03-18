
import React from 'react';
import { TouchableOpacity, Text } from 'react-native';
import { useColorScheme } from 'nativewind';

interface PrimaryButtonProps {
    onPress: () => void;
    title: string;
    disabled?: boolean;
}

const PrimaryButton: React.FC<PrimaryButtonProps> = ({ onPress, title, disabled }) => {
    return (
        <TouchableOpacity
            onPress={onPress}
            disabled={disabled}
            className={`bg-[#4AC76A] rounded-full py-4 items-center justify-center m-4 ${disabled ? 'opacity-50' : ''}`}
            activeOpacity={0.8}
        >
            <Text className="text-white font-semibold text-lg">{title}</Text>
        </TouchableOpacity>
    );
};

export default PrimaryButton;
