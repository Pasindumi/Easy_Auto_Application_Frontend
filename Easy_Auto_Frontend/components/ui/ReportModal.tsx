import React, { useState } from 'react';
import {
    Modal,
    StyleSheet,
    Text,
    TextInput,
    TouchableOpacity,
    View,
    ScrollView,
    KeyboardAvoidingView,
    Platform,
    Alert
} from 'react-native';
import Loading from './Loading';
import { Ionicons } from '@expo/vector-icons';
import COLORS from '../../constants/Colors';

interface Props {
    visible: boolean;
    onClose: () => void;
    onSubmit: (reason: string) => Promise<void>;
}

const REPORT_REASONS = [
    "Fake ad / Scammer",
    "Sold already",
    "Incorrect information",
    "Prohibited item",
    "Spam / Duplicate",
    "Offensive content",
    "Other"
];

const ReportModal: React.FC<Props> = ({ visible, onClose, onSubmit }) => {
    const [selectedReason, setSelectedReason] = useState<string | null>(null);
    const [customReason, setCustomReason] = useState('');
    const [loading, setLoading] = useState(false);

    const handleLevelSelect = (reason: string) => {
        setSelectedReason(reason);
    };

    const handleReport = async () => {
        const finalReason = selectedReason === "Other" ? customReason : selectedReason;

        if (!finalReason || (selectedReason === "Other" && !customReason.trim())) {
            Alert.alert("Required", "Please select or type a reason for reporting.");
            return;
        }

        setLoading(true);
        try {
            await onSubmit(finalReason);
            setSelectedReason(null);
            setCustomReason('');
            onClose();
        } catch (error) {
            // Error handling is managed by the parent component
        } finally {
            setLoading(false);
        }
    };

    return (
        <Modal
            visible={visible}
            transparent
            animationType="slide"
            onRequestClose={onClose}
        >
            <KeyboardAvoidingView
                behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
                style={styles.overlay}
            >
                <View style={styles.container}>
                    <View style={styles.header}>
                        <View style={styles.headerTitleContainer}>
                            <Ionicons name="flag" size={20} color="#EF4444" />
                            <Text style={styles.headerTitle}>Report this Ad</Text>
                        </View>
                        <TouchableOpacity onPress={onClose} style={styles.closeBtn}>
                            <Ionicons name="close" size={24} color="#6B7280" />
                        </TouchableOpacity>
                    </View>

                    <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scrollContent}>
                        <Text style={styles.subTitle}>Why are you reporting this ad?</Text>
                        <Text style={styles.description}>Your report will be reviewed by our team. Accurate reporting helps us keep Easy Auto safe.</Text>

                        <View style={styles.reasonsContainer}>
                            {REPORT_REASONS.map((reason) => (
                                <TouchableOpacity
                                    key={reason}
                                    style={[
                                        styles.reasonItem,
                                        selectedReason === reason && styles.selectedReasonItem
                                    ]}
                                    onPress={() => handleLevelSelect(reason)}
                                >
                                    <Text style={[
                                        styles.reasonText,
                                        selectedReason === reason && styles.selectedReasonText
                                    ]}>
                                        {reason}
                                    </Text>
                                    {selectedReason === reason && (
                                        <Ionicons name="checkmark-circle" size={20} color={COLORS.primary} />
                                    )}
                                </TouchableOpacity>
                            ))}
                        </View>

                        {selectedReason === "Other" && (
                            <View style={styles.customReasonContainer}>
                                <Text style={styles.label}>Provide more details</Text>
                                <TextInput
                                    style={styles.textInput}
                                    placeholder="Type your reason here..."
                                    multiline
                                    numberOfLines={4}
                                    value={customReason}
                                    onChangeText={setCustomReason}
                                    textAlignVertical="top"
                                />
                            </View>
                        )}
                    </ScrollView>

                    <View style={styles.footer}>
                        <TouchableOpacity style={styles.cancelBtn} onPress={onClose}>
                            <Text style={styles.cancelBtnText}>Cancel</Text>
                        </TouchableOpacity>
                        <TouchableOpacity
                            style={[styles.submitBtn, loading && styles.disabledBtn]}
                            onPress={handleReport}
                            disabled={loading}
                        >
                            {loading ? (
                                <Loading size="small" />
                            ) : (
                                <Text style={styles.submitBtnText}>Submit Report</Text>
                            )}
                        </TouchableOpacity>
                    </View>
                </View>
            </KeyboardAvoidingView>
        </Modal>
    );
};

const styles = StyleSheet.create({
    overlay: {
        flex: 1,
        backgroundColor: 'rgba(0,0,0,0.5)',
        justifyContent: 'flex-end',
    },
    container: {
        backgroundColor: 'white',
        borderTopLeftRadius: 24,
        borderTopRightRadius: 24,
        maxHeight: '85%',
        width: '100%',
    },
    header: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingHorizontal: 20,
        paddingVertical: 16,
        borderBottomWidth: 1,
        borderBottomColor: '#F3F4F6',
    },
    headerTitleContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 8,
    },
    headerTitle: {
        fontSize: 18,
        fontWeight: 'bold',
        color: '#111827',
    },
    closeBtn: {
        padding: 4,
    },
    scrollContent: {
        padding: 20,
    },
    subTitle: {
        fontSize: 16,
        fontWeight: '600',
        color: '#374151',
        marginBottom: 8,
    },
    description: {
        fontSize: 14,
        color: '#6B7280',
        lineHeight: 20,
        marginBottom: 20,
    },
    reasonsContainer: {
        gap: 10,
    },
    reasonItem: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        padding: 16,
        borderRadius: 12,
        backgroundColor: '#F9FAFB',
        borderWidth: 1,
        borderColor: '#E5E7EB',
    },
    selectedReasonItem: {
        backgroundColor: '#F0F7FF',
        borderColor: COLORS.primary,
    },
    reasonText: {
        fontSize: 15,
        color: '#4B5563',
        fontWeight: '500',
    },
    selectedReasonText: {
        color: COLORS.primary,
        fontWeight: '600',
    },
    customReasonContainer: {
        marginTop: 20,
    },
    label: {
        fontSize: 14,
        fontWeight: '600',
        color: '#374151',
        marginBottom: 8,
    },
    textInput: {
        borderWidth: 1,
        borderColor: '#D1D5DB',
        borderRadius: 12,
        padding: 12,
        fontSize: 15,
        backgroundColor: 'white',
        minHeight: 100,
    },
    footer: {
        flexDirection: 'row',
        padding: 20,
        gap: 12,
        borderTopWidth: 1,
        borderTopColor: '#F3F4F6',
    },
    cancelBtn: {
        flex: 1,
        height: 52,
        alignItems: 'center',
        justifyContent: 'center',
        borderRadius: 12,
        backgroundColor: '#F3F4F6',
    },
    cancelBtnText: {
        fontSize: 16,
        fontWeight: '600',
        color: '#4B5563',
    },
    submitBtn: {
        flex: 2,
        height: 52,
        alignItems: 'center',
        justifyContent: 'center',
        borderRadius: 12,
        backgroundColor: '#EF4444',
    },
    submitBtnText: {
        fontSize: 16,
        fontWeight: '600',
        color: 'white',
    },
    disabledBtn: {
        opacity: 0.7,
    }
});

export default ReportModal;
