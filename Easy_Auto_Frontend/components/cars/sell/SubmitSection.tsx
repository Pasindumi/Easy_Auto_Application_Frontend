import React from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';

interface Props {
    onReview: () => void;
    onSubmit: () => void;
}

const SubmitSection: React.FC<Props> = ({ onReview, onSubmit }) => {
    return (
        <View style={styles.container}>
            <View style={styles.submitSection}>
                <TouchableOpacity style={styles.reviewButton} onPress={onReview}>
                    <Text style={styles.reviewButtonText}>Review</Text>
                </TouchableOpacity>
                <TouchableOpacity style={styles.postAdButton} onPress={onSubmit}>
                    <Text style={styles.postAdButtonText}>Post Ad</Text>
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
        gap: 12,
    },
    reviewButton: {
        backgroundColor: 'white',
        borderColor: '#D1D5DB',
        borderWidth: 1,
        borderRadius: 12,
        paddingVertical: 16,
        paddingHorizontal: 32,
        minWidth: 120,
        alignItems: 'center',
        justifyContent: 'center',
    },
    reviewButtonText: {
        color: '#1F2937',
        fontSize: 16,
        fontWeight: 'bold',
    },
    postAdButton: {
        backgroundColor: '#8EE87C',
        borderRadius: 12,
        paddingVertical: 16,
        paddingHorizontal: 32,
        minWidth: 120,
        alignItems: 'center',
        justifyContent: 'center',
    },
    postAdButtonText: {
        color: 'black',
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
