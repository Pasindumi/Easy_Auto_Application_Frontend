import React from 'react';
import { View, StyleSheet, Alert, Text } from 'react-native';
import { Stack, useLocalSearchParams, useRouter } from 'expo-router';
import PayHereWebView from '@/components/payments/PayHereWebView';

export default function PayHereGateway() {
    const { html } = useLocalSearchParams();
    const router = useRouter();

    const handleSuccess = (url: string) => {
        Alert.alert("Success", "Payment completed successfully!", [
            { text: "OK", onPress: () => router.push('/(tabs)') }
        ]);
    };

    const handleCancel = (url: string) => {
        Alert.alert("Cancelled", "Payment was cancelled.");
        router.back();
    };

    // Ensure HTML string is valid
    // useLocalSearchParams can return string | string[]. We take the first if array.
    const htmlContent = Array.isArray(html) ? html[0] : html;

    if (!htmlContent) {
        return (
            <View style={styles.container}>
                <Stack.Screen options={{ title: "Payment Error" }} />
                <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
                    <Text>Error: Invalid Payment Data</Text>
                </View>
            </View>
        );
    }

    return (
        <View style={styles.container}>
            <Stack.Screen options={{
                title: "PayHere Checkout",
                headerBackTitle: "Back",
            }} />

            <PayHereWebView
                htmlContent={htmlContent}
                onSuccess={handleSuccess}
                onCancel={handleCancel}
            />
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#fff',
    },
});
