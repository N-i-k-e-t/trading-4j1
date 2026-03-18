
import React, { useState } from 'react';
import { View, Text, SafeAreaView, ScrollView } from 'react-native';
import EmotionSlider from '../components/EmotionSlider';
import EmotionSelector from '../components/EmotionSelector';
import PrimaryButton from '../components/PrimaryButton';
import { Emotion } from '../constants/enums';
// Store logic to be connected
const useStoreLogic = () => {
    // Placeholder until store is fully integrated
    return { setDailyState: (data: any) => console.log('Saving state:', data) };
};

const DailyStateCheckScreen = ({ navigation }: any) => {
    const { setDailyState } = useStoreLogic();
    const [sleepScore, setSleepScore] = useState(7);
    const [energyScore, setEnergyScore] = useState(7);
    const [emotion, setEmotion] = useState<Emotion>(Emotion.NEUTRAL);

    const handleSubmit = () => {
        setDailyState({
            sleepQuality: sleepScore,
            energyLevel: energyScore,
            baselineEmotion: emotion,
            completed: true
        });
        // For now, just log navigation attempt
        console.log("Navigating to DailyRules");
        if (navigation && navigation.navigate) {
            navigation.navigate('DailyRules');
        }
    };

    return (
        <SafeAreaView className="flex-1 bg-[#FAFAFA]">
            <ScrollView contentContainerStyle={{ flexGrow: 1, paddingBottom: 40 }}>
                <View className="mt-10 mb-6 px-6">
                    <Text className="text-3xl font-bold text-[#2C3E4C] text-center mb-2">Daily State Check</Text>
                    <Text className="text-gray-500 text-center text-lg">Anchor your psychology before specific rules.</Text>
                </View>

                <EmotionSlider
                    label="Sleep Quality"
                    value={sleepScore}
                    onValueChange={setSleepScore}
                    min={1}
                    max={10}
                />

                <EmotionSlider
                    label="Energy Level"
                    value={energyScore}
                    onValueChange={setEnergyScore}
                    min={1}
                    max={10}
                />

                <EmotionSelector
                    label="Baseline Emotion"
                    options={[
                        Emotion.CALM,
                        Emotion.NEUTRAL,
                        Emotion.TIRED,
                        Emotion.STRESSED,
                        Emotion.ANXIOUS,
                        Emotion.FEARFUL,
                        Emotion.OVERCONFIDENT
                    ]}
                    selected={emotion}
                    onSelect={(opt) => setEmotion(opt as Emotion)}
                />

                <View className="flex-1" />

                <View className="px-6 mb-4">
                    <Text className="text-center text-gray-400 italic mb-4">
                        "The market does not care how you feel. But your P&L does."
                    </Text>
                    <PrimaryButton
                        title="Continue to Rules"
                        onPress={handleSubmit}
                    />
                </View>
            </ScrollView>
        </SafeAreaView>
    );
};

export default DailyStateCheckScreen;
