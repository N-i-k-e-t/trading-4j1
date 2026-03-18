import React, { useState } from 'react';
import { View, Text, SafeAreaView, ScrollView, Alert, TouchableOpacity } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import PrimaryButton from '../components/PrimaryButton';
import EmotionSelector from '../components/EmotionSelector';
import EmotionSlider from '../components/EmotionSlider';
import TickChecklist from '../components/TickChecklist';
import { Emotion } from '../constants/enums';
import { useStore } from '../store/useStore';

const TradeGateScreen = () => {
    const navigation = useNavigation();
    const { dailyRules } = useStore();

    const [setupQuality, setSetupQuality] = useState(5);
    const [entryEmotion, setEntryEmotion] = useState(Emotion.NEUTRAL);
    const [checklist, setChecklist] = useState([
        { id: 'valid_setup', label: 'Setup matches my written plan', checked: false },
        { id: 'quality_check', label: 'Setup quality is > 7/10', checked: false },
        { id: 'quantity_check', label: `Quantity is exactly ${dailyRules.fixedQuantity}`, checked: false },
        { id: 'stop_defined', label: 'Stop-loss is defined in broker', checked: false },
    ]);

    const toggleCheck = (id: string) => {
        setChecklist(prev =>
            prev.map(item => item.id === id ? { ...item, checked: !item.checked } : item)
        );
    };

    const handleEnterTrade = () => {
        // Check if fully compliant
        const allChecked = checklist.every(i => i.checked);

        if (!allChecked) {
            Alert.alert(
                "Checklist Incomplete",
                "You are entering a trade with unchecked rules. This will be logged as a deviation.",
                [
                    { text: "Cancel", style: "cancel" },
                    { text: "Log Deviation & Enter", onPress: () => processEntry(false) }
                ]
            );
        } else {
            processEntry(true);
        }
    };

    const processEntry = (isCompliant: boolean) => {
        // Log entry to Store/DB (Placeholder)
        console.log('Trade Entered', {
            setupQuality,
            entryEmotion,
            isCompliant,
            quantity: dailyRules.fixedQuantity
        });

        // Navigate to Active Trade
        navigation.navigate('ActiveTrade' as never);
    };

    const handleSkipTrade = () => {
        Alert.alert("Discipline Win", "Skipping a sub-par trade is a victory. +1 Discipline Point.");
        navigation.goBack();
    };

    return (
        <SafeAreaView className="flex-1 bg-[#FAFAFA]">
            <ScrollView contentContainerStyle={{ paddingBottom: 40 }}>
                <View className="mt-6 mb-4 px-6">
                    <Text className="text-2xl font-bold text-[#2C3E4C]">Trade Gate</Text>
                    <Text className="text-gray-500">Stop. Think. Is this A+?</Text>
                </View>

                <TickChecklist items={checklist} onToggle={toggleCheck} />

                <EmotionSlider
                    label="Setup Quality"
                    value={setupQuality}
                    onValueChange={setSetupQuality}
                    min={1}
                    max={10}
                />

                <EmotionSelector
                    label="Emotion at Entry"
                    options={[
                        Emotion.CALM,
                        Emotion.FOMO,
                        Emotion.CONFIDENCE,
                        Emotion.DOUBT,
                        Emotion.GREED
                    ]}
                    selected={entryEmotion}
                    onSelect={(val: string) => setEntryEmotion(val as Emotion)}
                />

                <View className="mt-4">
                    <PrimaryButton
                        title="EXECUTE TRADE"
                        onPress={handleEnterTrade}
                    />

                    <TouchableOpacity
                        onPress={handleSkipTrade}
                        className="items-center py-4"
                    >
                        <Text className="text-gray-500 font-medium text-lg">Skip Trade (Discipline Win)</Text>
                    </TouchableOpacity>
                </View>
            </ScrollView>
        </SafeAreaView>
    );
};

export default TradeGateScreen;
