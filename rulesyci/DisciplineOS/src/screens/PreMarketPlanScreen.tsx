
import React, { useState } from 'react';
import { View, Text, SafeAreaView, ScrollView, KeyboardAvoidingView, Platform } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import PrimaryButton from '../components/PrimaryButton';
import ShortTextInput from '../components/ShortTextInput';
import EmotionSelector from '../components/EmotionSelector';
import { useStore } from '../store/useStore';

enum MarketContext {
    BULLISH = 'bullish',
    BEARISH = 'bearish',
    SIDEWAYS = 'sideways',
}

const PreMarketPlanScreen = () => {
    const navigation = useNavigation();
    const [context, setContext] = useState(MarketContext.SIDEWAYS);
    const [bias, setBias] = useState('');
    const [planX, setPlanX] = useState('');
    const [planY, setPlanY] = useState('');
    const [planZ, setPlanZ] = useState('');

    // Future: Load from store if exists
    // For MVP: Local state is fine for the session

    const handleSavePlan = () => {
        // In a real app, save to DB here
        console.log('Plan Saved:', { context, bias, planX, planY, planZ });

        // Navigate to Trade Gate (Screen 4 placeholder or overview)
        // Currently, we don't have Screen 4 yet, so we'll just log success
        // or navigate to a temporary "Ready to Trade" screen
        // For now, let's navigate to "DailyState" as a loop or potentially a new "ActiveSession" screen
        // navigation.navigate('ActiveSession');
        alert('Plan Saved! You are ready for the market.');
    };

    return (
        <SafeAreaView className="flex-1 bg-[#FAFAFA]">
            <KeyboardAvoidingView
                behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
                className="flex-1"
            >
                <ScrollView contentContainerStyle={{ paddingBottom: 40 }}>
                    <View className="mt-6 mb-4 px-6">
                        <Text className="text-2xl font-bold text-[#2C3E4C]">Pre-Market Plan</Text>
                        <Text className="text-gray-500">Externalize your thinking. Remove the ego.</Text>
                    </View>

                    <EmotionSelector
                        label="Market Context"
                        options={[MarketContext.BULLISH, MarketContext.BEARISH, MarketContext.SIDEWAYS]}
                        selected={context}
                        onSelect={(val: string) => setContext(val as MarketContext)}
                    />

                    <View className="px-2">
                        <ShortTextInput
                            label="Bias Statement"
                            value={bias}
                            onChangeText={setBias}
                            placeholder="I expect a pullback to support because..."
                            multiline
                        />

                        <View className="mt-4 px-4">
                            <Text className="text-lg font-medium text-gray-700 mb-2">The X/Y/Z Plan</Text>
                            <Text className="text-sm text-gray-400 mb-4">If X happens, I will do Y. If Z happens, invalid.</Text>
                        </View>

                        <ShortTextInput
                            label="If (X) happens..."
                            value={planX}
                            onChangeText={setPlanX}
                            placeholder="Price breaks 100 with volume..."
                        />

                        <ShortTextInput
                            label="I will do (Y)..."
                            value={planY}
                            onChangeText={setPlanY}
                            placeholder="Enter long with stop at 98..."
                        />

                        <ShortTextInput
                            label="Invalidation (Z)..."
                            value={planZ}
                            onChangeText={setPlanZ}
                            placeholder="Price closes below 98 on 5m..."
                        />
                    </View>

                    <PrimaryButton
                        title="Save Plan & Start Session"
                        onPress={handleSavePlan}
                        disabled={!bias || !planX || !planY}
                    />
                </ScrollView>
            </KeyboardAvoidingView>
        </SafeAreaView>
    );
};

export default PreMarketPlanScreen;
