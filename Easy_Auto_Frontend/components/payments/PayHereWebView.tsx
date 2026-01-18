import React, { useState } from 'react';
import { View, ActivityIndicator, StyleSheet } from 'react-native';
import { WebView } from 'react-native-webview';

interface PayHereWebViewProps {
    htmlContent: string;
    onSuccess: (url: string) => void;
    onCancel: (url: string) => void;
    onError?: (error: any) => void;
}

const PayHereWebView: React.FC<PayHereWebViewProps> = ({
    htmlContent,
    onSuccess,
    onCancel,
    onError
}) => {
    const [loading, setLoading] = useState(true);

    const onNavigationStateChange = (navState: any) => {
        const { url } = navState;

        // Detect our dummy URLs or actual PayHere redirects
        if (url.includes('payhere.example/success') || url.includes('success')) {
            onSuccess(url);
        } else if (url.includes('payhere.example/cancel') || url.includes('cancel')) {
            onCancel(url);
        }
    };

    return (
        <View style={styles.container}>
            <WebView
                source={{ html: htmlContent, baseUrl: 'https://payhere.lk' }}
                onLoadEnd={() => setLoading(false)}
                onNavigationStateChange={onNavigationStateChange}
                javaScriptEnabled={true}
                domStorageEnabled={true}
                originWhitelist={['*']}
                startInLoadingState={true}
                renderLoading={() => (
                    <View style={styles.loadingOverlay}>
                        <ActivityIndicator size="large" color="#235CF8" />
                    </View>
                )}
            />
            {loading && (
                <View style={styles.loadingOverlay}>
                    <ActivityIndicator size="large" color="#235CF8" />
                </View>
            )}
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    loadingOverlay: {
        ...StyleSheet.absoluteFillObject,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#fff',
        zIndex: 10,
    },
});

export default PayHereWebView;
