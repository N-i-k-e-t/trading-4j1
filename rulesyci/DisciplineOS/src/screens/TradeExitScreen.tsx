
import React, { useState } from 'react';
import { View, Text, SafeAreaView, ScrollView } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import PrimaryButton from '../components/PrimaryButton';
import EmotionSelector from '../components/EmotionSelector';
import ShortTextInput from '../components/ShortTextInput';
import { Emotion, ExitType, TradeType } from '../constants/enums';
import { useStore } from '../store/useStore';

const TradeExitScreen = () => {
    const navigation = useNavigation();
    const { dailyRules } = useStore();

    const [exitType, setExitType] = useState(ExitType.PLANNED);
    const [exitEmotion, setExitEmotion] = useState(Emotion.NEUTRAL);
    const [tradeType, setTradeType] = useState(TradeType.SYSTEM);
    const [exitReason, setExitReason] = useState('');

    const handleSaveExit = () => {
        console.log('Trade Exited', { exitType, exitEmotion, tradeType, exitReason });
        // In a real app, update the trade record in DB here

        // Navigate back to overview / or start again
        // For MVP flow, maybe go back to PreMarket (ready for next trade) or ActiveSession
        // Let's create a loop back to TradeGate or Overview, but for now, "DailyState" or "Home"
        // Since we don't have a Home Dashboard yet, we'll go back to 'DailyRules' or 'PreMarketPlan'
        // Actually, we should probably have a "SessionOverview" screen. 
        // For now:
        navigation.navigate('PreMarketPlan' as never);
    };

    return (
        <SafeAreaView className="flex-1 bg-[#FAFAFA]">
            <ScrollView contentContainerStyle={{ paddingBottom: 40 }}>
                <View className="mt-8 mb-6 px-6">
                    <Text className="text-3xl font-bold text-[#2C3E4C] mb-2">Trade Reflection</Text>
                    <Text className="text-gray-500 text-lg">Capture the truth before memory fades.</Text>
                </View>

                <EmotionSelector
                    label="Exit Type"
                    options={[ExitType.PLANNED, ExitType.STOP, ExitType.MANUAL]}
                    selected={exitType}
                    onSelect={(val: string) => setExitType(val as ExitType)}
                />

                <EmotionSelector
                    label="Emotion at Exit"
                    options={[Emotion.RELIEF, Emotion.FRUSTRATION, Emotion.JOY, Emotion.ANGER, Emotion.NEUTRAL]}
                    selected={exitEmotion}
                    onSelect={(val: string) => setExitEmotion(val as Emotion)}
                />

                <EmotionSelector
                    label="Trade Classification"
                    options={[TradeType.SYSTEM, TradeType.EMOTIONAL]}
                    selected={tradeType}
                    onSelect={(val: string) => setTradeType(val as TradeType)}
                />

                <ShortTextInput
                    label="Exit Reason (One Line)"
                    value={exitReason}
                    onChangeText={setExitReason}
                    placeholder="Hit target at 105..."
                />

                <View className="flex-1" />

                <PrimaryButton
                    title="Save & Close Trade"
                    onPress={handleSaveExit}
                    disabled={!exitReason}
                />
            </ScrollView>
        </SafeAreaView>
    );
};

export default TradeExitScreen;
