import React from 'react';
import {
    Modal,
    StyleSheet,
    Text,
    TouchableOpacity,
    View,
    Animated,
    Dimensions,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import COLORS from '../../constants/Colors';

const { width } = Dimensions.get('window');

interface ConfirmationModalProps {
    visible: boolean;
    title: string;
    message: string;
    confirmText?: string;
    cancelText?: string;
    onConfirm: () => void;
    onCancel: () => void;
    type?: 'danger' | 'primary' | 'info';
}

const ConfirmationModal: React.FC<ConfirmationModalProps> = ({
    visible,
    title,
    message,
    confirmText = 'Confirm',
    cancelText = 'Cancel',
    onConfirm,
    onCancel,
    type = 'primary'
}) => {
    const scaleAnim = React.useRef(new Animated.Value(0.9)).current;
    const opacityAnim = React.useRef(new Animated.Value(0)).current;

    React.useEffect(() => {
        if (visible) {
            Animated.parallel([
                Animated.spring(scaleAnim, {
                    toValue: 1,
                    useNativeDriver: true,
                    damping: 18,
                    stiffness: 120,
                }),
                Animated.timing(opacityAnim, {
                    toValue: 1,
                    duration: 200,
                    useNativeDriver: true,
                }),
            ]).start();
        } else {
            scaleAnim.setValue(0.9);
            opacityAnim.setValue(0);
        }
    }, [visible]);

    if (!visible) return null;

    const getTypeConfig = () => {
        switch (type) {
            case 'danger':
                return {
                    color: '#EF4444',
                    icon: 'alert-circle-outline' as const,
                    bg: '#FEF2F2'
                };
            case 'info':
                return {
                    color: '#3B82F6',
                    icon: 'information-circle-outline' as const,
                    bg: '#EFF6FF'
                };
            default:
                return {
                    color: COLORS.primary,
                    icon: 'help-circle-outline' as const,
                    bg: '#EEF2FF'
                };
        }
    };

    const config = getTypeConfig();

    return (
        <Modal
            visible={visible}
            transparent
            animationType="none"
            onRequestClose={onCancel}
        >
            <View style={styles.overlay}>
                <Animated.View style={[styles.backdrop, { opacity: opacityAnim }]}>
                    <TouchableOpacity 
                        style={styles.backdropClickable} 
                        activeOpacity={1} 
                        onPress={onCancel} 
                    />
                </Animated.View>

                <Animated.View 
                    style={[
                        styles.container, 
                        { 
                            opacity: opacityAnim,
                            transform: [{ scale: scaleAnim }]
                        }
                    ]}
                >
                    <View style={styles.content}>
                        <View style={[styles.iconFrame, { backgroundColor: config.bg }]}>
                            <Ionicons name={config.icon} size={32} color={config.color} />
                        </View>

                        <Text style={styles.title}>{title}</Text>
                        <Text style={styles.message}>{message}</Text>

                        <View style={styles.footer}>
                            <TouchableOpacity 
                                style={styles.cancelButton} 
                                onPress={onCancel}
                                activeOpacity={0.7}
                            >
                                <Text style={styles.cancelText}>{cancelText}</Text>
                            </TouchableOpacity>

                            <TouchableOpacity 
                                style={[styles.confirmButton, { backgroundColor: config.color }]} 
                                onPress={onConfirm}
                                activeOpacity={0.8}
                            >
                                <Text style={styles.confirmText}>{confirmText}</Text>
                            </TouchableOpacity>
                        </View>
                    </View>
                </Animated.View>
            </View>
        </Modal>
    );
};

const styles = StyleSheet.create({
    overlay: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    backdrop: {
        ...StyleSheet.absoluteFillObject,
        backgroundColor: 'rgba(15, 23, 42, 0.7)',
    },
    backdropClickable: {
        flex: 1,
    },
    container: {
        width: width * 0.88,
        backgroundColor: '#fff',
        borderRadius: 32,
        overflow: 'hidden',
        elevation: 25,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 12 },
        shadowOpacity: 0.25,
        shadowRadius: 24,
    },
    content: {
        padding: 28,
        alignItems: 'center',
    },
    iconFrame: {
        width: 72,
        height: 72,
        borderRadius: 36,
        justifyContent: 'center',
        alignItems: 'center',
        marginBottom: 24,
        borderWidth: 1,
        borderColor: 'rgba(0,0,0,0.02)',
    },
    title: {
        fontSize: 22,
        fontWeight: '900',
        color: '#0F172A',
        textAlign: 'center',
        marginBottom: 12,
        letterSpacing: -0.6,
    },
    message: {
        fontSize: 14,
        color: '#64748B',
        textAlign: 'center',
        lineHeight: 20,
        marginBottom: 32,
        paddingHorizontal: 12,
        fontWeight: '500',
    },
    footer: {
        flexDirection: 'row',
        gap: 12,
        width: '100%',
    },
    cancelButton: {
        flex: 1,
        height: 54,
        justifyContent: 'center',
        alignItems: 'center',
        borderRadius: 18,
        backgroundColor: '#F8FAFC',
        borderWidth: 1,
        borderColor: '#F1F5F9',
    },
    cancelText: {
        fontSize: 15,
        fontWeight: '700',
        color: '#64748B',
    },
    confirmButton: {
        flex: 1,
        height: 54,
        justifyContent: 'center',
        alignItems: 'center',
        borderRadius: 18,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.15,
        shadowRadius: 10,
        elevation: 5,
    },
    confirmText: {
        fontSize: 15,
        fontWeight: '800',
        color: '#fff',
        letterSpacing: 0.3,
    },
});

export default ConfirmationModal;
