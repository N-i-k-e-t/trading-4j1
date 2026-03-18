
import React from 'react';
import { View, Text, SafeAreaView } from 'react-native';
import PrimaryButton from '../components/PrimaryButton';
import { useNavigation } from '@react-navigation/native';
import { Activity } from 'lucide-react-native';

const ActiveTradeScreen = () => {
    const navigation = useNavigation();

    const handleExitTrade = () => {
        navigation.navigate('TradeExit' as never);
    };

    return (
        <SafeAreaView className="flex-1 bg-[#FAFAFA] items-center justify-center p-6">
            <View className="mb-8 items-center">
                <View className="w-20 h-20 bg-blue-50 rounded-full items-center justify-center mb-6 border-2 border-blue-100 animate-pulse">
                    <Activity size={40} color="#4AC76A" />
                </View>
                <Text className="text-3xl font-bold text-[#2C3E4C] mb-2">Trade Active</Text>
                <Text className="text-gray-500 text-center text-lg px-8">
                    Follow your plan. Do not stare at the P&L.
                </Text>
            </View>

            <View className="w-full bg-white p-6 rounded-2xl shadow-sm border border-gray-100 mb-8">
                <View className="flex-row justify-between mb-4 border-b border-gray-100 pb-4">
                    <Text className="text-gray-500">Status</Text>
                    <Text className="font-bold text-green-500">Open Position</Text>
                </View>
                <View className="flex-row justify-between">
                    <Text className="text-gray-500">Rule Status</Text>
                    <Text className="font-bold text-[#2C3E4C]">Locked</Text>
                </View>
            </View>

            <PrimaryButton
                title="EXIT TRADE"
                onPress={handleExitTrade}
            />
        </SafeAreaView>
    );
};

export default ActiveTradeScreen;
