
import React, { useEffect } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import DailyStateCheckScreen from '../screens/DailyStateCheckScreen';
import DailyRulesScreen from '../screens/DailyRulesScreen';
import PreMarketPlanScreen from '../screens/PreMarketPlanScreen';
import TradeGateScreen from '../screens/TradeGateScreen';
import ActiveTradeScreen from '../screens/ActiveTradeScreen';
import TradeExitScreen from '../screens/TradeExitScreen';
import { initDatabase } from '../services/database';

const Stack = createNativeStackNavigator();

export default function RootNavigator() {
    useEffect(() => {
        initDatabase().catch(err => console.error("DB Init Error:", err));
    }, []);

    return (
        <NavigationContainer>
            <Stack.Navigator screenOptions={{ headerShown: false, animation: 'none' }}>
                <Stack.Screen name="DailyState" component={DailyStateCheckScreen} />
                <Stack.Screen name="DailyRules" component={DailyRulesScreen} />
                <Stack.Screen name="PreMarketPlan" component={PreMarketPlanScreen} />
                <Stack.Screen name="TradeGate" component={TradeGateScreen} />
                <Stack.Screen name="ActiveTrade" component={ActiveTradeScreen} />
                <Stack.Screen name="TradeExit" component={TradeExitScreen} />
            </Stack.Navigator>
        </NavigationContainer>
    );
}
