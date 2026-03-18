
import React, { useState } from 'react';
import { View, Text, SafeAreaView, ScrollView, TouchableOpacity, Alert } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { Lock } from 'lucide-react-native';
import { useStore } from '../store/useStore';
import PrimaryButton from '../components/PrimaryButton';
import EmotionSelector from '../components/EmotionSelector';
import ShortTextInput from '../components/ShortTextInput';
import TickChecklist from '../components/TickChecklist';
import SoftAlert from '../components/SoftAlert';
import { DailyIntention, FearLevel } from '../constants/enums';

const DailyRulesScreen = () => {
    const navigation = useNavigation();
    const { dailyRules, setDailyRules } = useStore();
    const [localIntention, setLocalIntention] = useState(dailyRules.intention);
    const [maxTrades, setMaxTrades] = useState(dailyRules.maxTrades.toString());
    const [fixedQty, setFixedQty] = useState(dailyRules.fixedQuantity.toString());
    const [maxLoss, setMaxLoss] = useState(dailyRules.maxDailyLoss.toString());
    const [fearLevel, setFearLevel] = useState<FearLevel>(FearLevel.LOW);
    const [calmingAction, setCalmingAction] = useState(false);
    const [confirmLock, setConfirmLock] = useState(false);
    const [alertVisible, setAlertVisible] = useState(false);

    const handleLockRules = () => {
        if (!confirmLock) {
            setAlertVisible(true);
            return;
        }

        setDailyRules({
            intention: localIntention,
            maxTrades: parseInt(maxTrades) || 0,
            fixedQuantity: parseInt(fixedQty) || 0,
            maxDailyLoss: parseFloat(maxLoss) || 0,
            isLocked: true,
            lockedAt: new Date().toISOString()
        });

        // Navigate to next screen
        navigation.navigate('PreMarketPlan' as never);
    };

    if (dailyRules.isLocked) {
        return (
            <SafeAreaView className="flex-1 bg-[#FAFAFA] items-center justify-center p-6">
                <Lock size={64} color="#2C3E4C" />
                <Text className="text-2xl font-bold text-[#2C3E4C] mt-4">Rules Locked</Text>
                <Text className="text-gray-500 text-center mt-2 mb-8">
                    Your trading rules are set for the day. Discipline is binding.
                </Text>
                <View className="bg-white p-6 rounded-xl w-full border border-gray-100">
                    <Text className="text-gray-600 mb-2">Max Trades: {dailyRules.maxTrades}</Text>
                    <Text className="text-gray-600 mb-2">Quantity: {dailyRules.fixedQuantity}</Text>
                    <Text className="text-gray-600">Max Loss: ${dailyRules.maxDailyLoss}</Text>
                </View>
                <PrimaryButton
                    title="Continue to Pre-Market Plan"
                    onPress={() => navigation.navigate('PreMarketPlan' as never)}
                />
            </SafeAreaView>
        );
    }

    return (
        <SafeAreaView className="flex-1 bg-[#FAFAFA]">
            <ScrollView contentContainerStyle={{ paddingBottom: 40 }}>
                <View className="mt-6 mb-4 px-6">
                    <Text className="text-2xl font-bold text-[#2C3E4C]">Define Your Edge</Text>
                    <Text className="text-gray-500">Set boundaries before emotions set in.</Text>
                </View>

                <EmotionSelector
                    label="Today's Intention"
                    options={[
                        DailyIntention.PROCESS_CONSISTENCY,
                        DailyIntention.EMOTIONAL_CONTROL,
                        DailyIntention.SETUP_QUALITY
                    ]}
                    selected={localIntention}
                    onSelect={setLocalIntention}
                />

                <View className="px-4 mb-2">
                    <Text className="text-lg font-medium text-gray-700 mb-2">Hard Rules</Text>
                    <View className="flex-row justify-between space-x-2">
                        <View className="flex-1">
                            <ShortTextInput
                                label="Max Trades"
                                value={maxTrades}
                                onChangeText={setMaxTrades}
                                placeholder="3"
                            />
                        </View>
                        <View className="flex-1">
                            <ShortTextInput
                                label="Fixed Qty"
                                value={fixedQty}
                                onChangeText={setFixedQty}
                                placeholder="10"
                            />
                        </View>
                    </View>
                    <ShortTextInput
                        label="Max Daily Loss ($)"
                        value={maxLoss}
                        onChangeText={setMaxLoss}
                        placeholder="500"
                    />
                </View>

                <EmotionSelector
                    label="Current Fear Level"
                    options={[FearLevel.LOW, FearLevel.MEDIUM, FearLevel.HIGH]}
                    selected={fearLevel}
                    onSelect={(val) => setFearLevel(val as FearLevel)}
                />

                <View className="px-4 my-2">
                    <TickChecklist
                        items={[{ id: 'calm', label: 'I have taken one deep breath', checked: calmingAction }]}
                        onToggle={() => setCalmingAction(!calmingAction)}
                    />
                </View>

                <View className="px-4 mt-4">
                    <TickChecklist
                        items={[{ id: 'lock', label: 'I commit to following these rules', checked: confirmLock }]}
                        onToggle={() => setConfirmLock(!confirmLock)}
                    />
                </View>

                <PrimaryButton
                    title="Lock Rules for Today"
                    onPress={handleLockRules}
                    disabled={!confirmLock}
                />

            </ScrollView>

            {/* Soft Alert for validation */}
            {alertVisible && (
                <View className="absolute top-10 left-0 right-0 px-4">
                    <View className="bg-alertAmber p-4 rounded-lg shadow-md">
                        <Text className="text-white font-medium text-center">Please confirm you commit to these rules.</Text>
                    </View>
                </View>
            )}
        </SafeAreaView>
    );
};

export default DailyRulesScreen;
