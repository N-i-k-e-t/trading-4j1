
import React, { useEffect } from 'react';
import { View, Text, Animated, SafeAreaView } from 'react-native';
import { AlertTriangle } from 'lucide-react-native';

interface SoftAlertProps {
    message: string;
    isVisible: boolean;
    onDismiss: () => void;
    type?: 'warning' | 'info' | 'error';
}

const SoftAlert = ({ message, isVisible, onDismiss, type = 'warning' }: SoftAlertProps) => {
    const translateY = new Animated.Value(-100);

    useEffect(() => {
        if (isVisible) {
            Animated.spring(translateY, {
                toValue: 0,
                useNativeDriver: true,
                friction: 5,
                tension: 40,
            }).start();

            const timer = setTimeout(() => {
                onDismiss();
            }, 4000);

            return () => clearTimeout(timer);
        } else {
            Animated.timing(translateY, {
                toValue: -100,
                duration: 300,
                useNativeDriver: true,
            }).start();
        }
    }, [isVisible]);

    return (
        <Animated.View
            style={{
                transform: [{ translateY }],
                position: 'absolute',
                top: 0,
                left: 0,
                right: 0,
                zIndex: 50,
            }}
        >
            <SafeAreaView
                className={`w-full flex-row items-center px-6 py-4 border-b ${type === 'warning' ? 'bg-[#FFF3E0] border-[#FCD34D]' :
                    type === 'error' ? 'bg-[#FEE2E2] border-[#FCA5A5]' :
                        'bg-[#E0F2F1] border-[#81C784]'
                    }`}
            >
                <AlertTriangle size={20} color={type === 'warning' ? '#D4A574' : type === 'error' ? '#EF4444' : '#10B981'} className="mr-3" />
                <Text className="text-[#555B65] font-medium flex-1">{message}</Text>
            </SafeAreaView>
        </Animated.View>
    );
};

export default SoftAlert;
