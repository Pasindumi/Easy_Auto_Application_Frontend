import React from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';

interface Props {
    onSubmit: () => void;
}

const SubmitSection: React.FC<Props> = ({ onSubmit }) => {
    return (
        <View style={styles.container}>
            <View style={styles.submitSection}>
                <TouchableOpacity style={styles.postAdButton} onPress={onSubmit}>
                    <Text style={styles.postAdButtonText}>Review and Post Ad</Text>
                </TouchableOpacity>
            </View>
            <Text style={styles.disclaimer}>
                By posting this listing, you agree to our Terms of Service and Privacy Policy.
            </Text>
        </View>
    );
};

const styles = StyleSheet.create({
    container: { paddingBottom: 40 },
    submitSection: {
        margin: 16,
        alignItems: 'center',
        flexDirection: 'row',
        justifyContent: 'center',
    },
    postAdButton: {
        backgroundColor: '#235CF8', // Use primary color for main action
        borderRadius: 5,
        paddingVertical: 16,
        paddingHorizontal: 32,
        width: '100%', // Full width
        alignItems: 'center',
        justifyContent: 'center',
    },
    postAdButtonText: {
        color: 'white',
        fontSize: 16,
        fontWeight: 'bold',
    },
    disclaimer: {
        fontSize: 12,
        color: '#6B7280',
        textAlign: 'center',
        marginTop: 16,
        paddingHorizontal: 32,
        lineHeight: 18,
    },
});

export default SubmitSection;
