
import React from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import { Check } from 'lucide-react-native';

interface ChecklistItem {
    id: string;
    label: string;
    checked: boolean;
}

interface TickChecklistProps {
    items: ChecklistItem[];
    onToggle: (id: string) => void;
}

const TickChecklist = ({ items, onToggle }: TickChecklistProps) => {
    return (
        <View className="w-full px-4 my-2">
            {items.map((item) => (
                <TouchableOpacity
                    key={item.id}
                    onPress={() => onToggle(item.id)}
                    activeOpacity={0.7}
                    className={`flex-row items-center p-4 mb-3 rounded-xl border ${item.checked
                        ? 'bg-[#E8F8EE] border-[#4AC76A]'
                        : 'bg-white border-gray-200'
                        }`}
                >
                    <View
                        className={`w-6 h-6 rounded-full border-2 mr-4 items-center justify-center ${item.checked ? 'bg-[#4AC76A] border-[#4AC76A]' : 'border-gray-300'
                            }`}
                    >
                        {item.checked && <Check size={14} color="white" strokeWidth={3} />}
                    </View>
                    <Text
                        className={`text-base font-medium flex-1 ${item.checked ? 'text-[#2C3E4C]' : 'text-gray-600'
                            }`}
                    >
                        {item.label}
                    </Text>
                </TouchableOpacity>
            ))}
        </View>
    );
};

export default TickChecklist;
