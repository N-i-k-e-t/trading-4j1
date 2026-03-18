
import { create } from 'zustand';
import { createJSONStorage, persist } from 'zustand/middleware';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Emotion } from '../constants/enums';

interface AppState {
    hasHydrated: boolean;
    setHasHydrated: (state: boolean) => void;
    user: {
        id: string | null;
        email: string | null;
    } | null;
    dailyState: {
        sleepQuality: number;
        energyLevel: number;
        baselineEmotion: Emotion;
        completed: boolean;
    };
    dailyRules: {
        intention: string;
        maxTrades: number;
        fixedQuantity: number;
        maxDailyLoss: number;
        isLocked: boolean;
        lockedAt: string | null;
    };
    setDailyState: (state: Partial<AppState['dailyState']>) => void;
    setDailyRules: (rules: Partial<AppState['dailyRules']>) => void;
    resetDailyState: () => void;
    resetDailyRules: () => void;
}

export const useStore = create<AppState>()(
    persist(
        (set) => ({
            hasHydrated: false,
            setHasHydrated: (state) => set({ hasHydrated: state }),
            user: null,
            dailyState: {
                sleepQuality: 7,
                energyLevel: 7,
                baselineEmotion: Emotion.NEUTRAL,
                completed: false,
            },
            dailyRules: {
                intention: 'process_consistency',
                maxTrades: 3,
                fixedQuantity: 10,
                maxDailyLoss: 1000,
                isLocked: false,
                lockedAt: null,
            },
            setDailyState: (newState) =>
                set((state) => ({
                    dailyState: { ...state.dailyState, ...newState }
                })),
            setDailyRules: (newRules) =>
                set((state) => ({
                    dailyRules: { ...state.dailyRules, ...newRules }
                })),
            resetDailyState: () =>
                set({
                    dailyState: {
                        sleepQuality: 7,
                        energyLevel: 7,
                        baselineEmotion: Emotion.NEUTRAL,
                        completed: false
                    }
                }),
            resetDailyRules: () =>
                set({
                    dailyRules: {
                        intention: 'process_consistency',
                        maxTrades: 3,
                        fixedQuantity: 10,
                        maxDailyLoss: 1000,
                        isLocked: false,
                        lockedAt: null,
                    }
                }),
        }),
        {
            name: 'discipline-os-storage',
            storage: createJSONStorage(() => AsyncStorage),
            onRehydrateStorage: () => (state) => {
                state?.setHasHydrated(true);
            },
        }
    )
);
