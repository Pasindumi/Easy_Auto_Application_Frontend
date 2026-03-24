import React, { useState, useEffect } from 'react';
import {
    ScrollView,
    StyleSheet,
    Text,
    TouchableOpacity,
    View,
    Alert,
    Modal,
    TextInput,
    ActivityIndicator,
    Platform,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Stack, useRouter } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import Header from "@/components/Header";
import { COLORS } from "@/constants/Colors";
import { useAuth } from '@/contexts/AuthContext';
import api from '@/utils/api';
import { useToast } from '@/contexts/ToastContext';

export default function SecurityScreen() {
    const router = useRouter();
    const { user } = useAuth();
    const { showToast } = useToast();

    const [loading, setLoading] = useState(false);
    const [securityAlerts, setSecurityAlerts] = useState<any[]>([]);
    const [twoFaEnabled, setTwoFaEnabled] = useState(user?.two_fa_enabled || false);

    // Modal states
    const [passwordModalVisible, setPasswordModalVisible] = useState(false);
    const [emailModalVisible, setEmailModalVisible] = useState(false);
    const [phoneModalVisible, setPhoneModalVisible] = useState(false);
    const [otpModalVisible, setOtpModalVisible] = useState(false);

    // Form states
    const [currentPassword, setCurrentPassword] = useState('');
    const [newPassword, setNewPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [showPasswords, setShowPasswords] = useState(false);

    const [newEmail, setNewEmail] = useState('');
    const [newPhone, setNewPhone] = useState('');
    const [otp, setOtp] = useState('');
    const [otpType, setOtpType] = useState<'email' | 'phone' | null>(null);

    useEffect(() => {
        fetchSecurityAlerts();
    }, []);


    const fetchSecurityAlerts = async () => {
        try {
            const response: any = await api.get('/api/auth/security-alerts');
            if (response.success) {
                setSecurityAlerts(response.data);
            }
        } catch (error) {
            console.error('Error fetching alerts:', error);
        }
    };

    const validatePassword = (pass: string) => {
        const hasUpper = /[A-Z]/.test(pass);
        const hasLower = /[a-z]/.test(pass);
        const hasNumber = /[0-9]/.test(pass);
        const hasSpecial = /[!@#$%^&*(),.?":{}|<>]/.test(pass);
        const isLongEnough = pass.length >= 8;

        return {
            score: [isLongEnough, hasUpper, hasLower, hasNumber, hasSpecial].filter(Boolean).length,
            isLongEnough, hasUpper, hasLower, hasNumber, hasSpecial
        };
    };

    const handleChangePassword = async () => {
        if (newPassword !== confirmPassword) {
            showToast({ message: "Passwords don't match", type: 'error' });
            return;
        }

        const strength = validatePassword(newPassword);
        if (strength.score < 4) {
            showToast({ message: "Password is too weak", type: 'error' });
            return;
        }

        setLoading(true);
        try {
            const response: any = await api.post('/api/auth/change-password', {
                currentPassword,
                newPassword
            });

            if (response.success) {
                showToast({ message: "Password updated successfully", type: 'success' });
                setPasswordModalVisible(false);
                setCurrentPassword('');
                setNewPassword('');
                setConfirmPassword('');
                fetchSecurityAlerts();
            } else {
                showToast({ message: response.error || "Failed to update password", type: 'error' });
            }
        } catch (error) {
            showToast({ message: "Something went wrong", type: 'error' });
        } finally {
            setLoading(false);
        }
    };

    const handleRequestEmailChange = async () => {
        setLoading(true);
        try {
            const response: any = await api.post('/api/auth/email/request', { newEmail });
            if (response.success) {
                setEmailModalVisible(false);
                setOtpType('email');
                setOtpModalVisible(true);
            } else {
                showToast({ message: response.error || "Failed to send OTP", type: 'error' });
            }
        } catch (error) {
            showToast({ message: "Error sending OTP", type: 'error' });
        } finally {
            setLoading(false);
        }
    };

    const handleVerifyOtp = async () => {
        setLoading(true);
        try {
            const endpoint = otpType === 'email' ? '/api/auth/email/verify' : '/api/auth/phone/verify';
            const response: any = await api.post(endpoint, { otp });

            if (response.success) {
                showToast({ message: `${otpType === 'email' ? 'Email' : 'Phone'} updated successfully`, type: 'success' });
                setOtpModalVisible(false);
                setOtp('');
                fetchSecurityAlerts();
            } else {
                showToast({ message: response.error || "Invalid OTP", type: 'error' });
            }
        } catch (error) {
            showToast({ message: "Verification failed", type: 'error' });
        } finally {
            setLoading(false);
        }
    };

    const formatTimeAgo = (dateString: string) => {
        const date = new Date(dateString);
        const now = new Date();
        const diffInSeconds = Math.floor((now.getTime() - date.getTime()) / 1000);

        if (diffInSeconds < 60) return 'Just now';
        if (diffInSeconds < 3600) return `${Math.floor(diffInSeconds / 60)}m ago`;
        if (diffInSeconds < 86400) return `${Math.floor(diffInSeconds / 3600)}h ago`;
        if (diffInSeconds < 604800) return `${Math.floor(diffInSeconds / 86400)}d ago`;
        return date.toLocaleDateString();
    };

    const getActionIcon = (action: string): any => {
        const a = action.toUpperCase();
        if (a.includes('LOGIN')) return 'log-in-outline';
        if (a.includes('LOGOUT')) return 'log-out-outline';
        if (a.includes('PASSWORD')) return 'key-outline';
        if (a.includes('EMAIL')) return 'mail-outline';
        if (a.includes('PHONE')) return 'call-outline';
        if (a.includes('2FA')) return 'shield-checkmark-outline';
        if (a.includes('SIGNUP')) return 'person-add-outline';
        return 'notifications-outline';
    };

    const getActionColor = (action: string) => {
        const a = action.toUpperCase();
        if (a.includes('LOGIN') || a.includes('SIGNUP')) return '#10b981';
        if (a.includes('LOGOUT')) return '#64748b';
        if (a.includes('PASSWORD') || a.includes('2FA')) return '#3b82f6';
        if (a.includes('EMAIL') || a.includes('PHONE')) return '#f59e0b';
        return '#6366f1';
    };

    const SecurityCard = ({ title, icon, color, children }: any) => (
        <View style={styles.card}>
            <View style={styles.cardHeader}>
                <View style={[styles.iconContainer, { backgroundColor: `${color}10` }]}>
                    <Ionicons name={icon} size={20} color={color} />
                </View>
                <Text style={styles.cardTitle}>{title}</Text>
            </View>
            <View style={styles.cardBody}>
                {children}
            </View>
        </View>
    );

    const SecurityItem = ({ label, value, onPress, buttonLabel = "Update" }: any) => (
        <View style={styles.securityItem}>
            <View style={styles.itemInfo}>
                <Text style={styles.itemLabel}>{label}</Text>
                <Text style={styles.itemValue}>{value}</Text>
            </View>
            {onPress && (
                <TouchableOpacity style={styles.itemButton} onPress={onPress}>
                    <Text style={styles.itemButtonText}>{buttonLabel}</Text>
                </TouchableOpacity>
            )}
        </View>
    );

    return (
        <View style={styles.outerContainer}>
            <Stack.Screen options={{ headerShown: false }} />
            <Header title="Security Center" showBack={true} />

            <View style={styles.safe}>
                <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>

                    {/* Main Security Options */}
                    <SecurityCard title="Account Access" icon="lock-closed-outline" color="#3b82f6">
                        <SecurityItem
                            label="Password"
                            value="••••••••••••"
                            onPress={() => setPasswordModalVisible(true)}
                        />
                        <View style={styles.divider} />
                        <SecurityItem
                            label="Two-Factor Auth"
                            value={twoFaEnabled ? "On (Authenticator)" : "Off"}
                            onPress={() => Alert.alert("Coming Soon", "2FA setup will be available in the next update.")}
                            buttonLabel="Manage"
                        />
                    </SecurityCard>

                    {/* Contact Details */}
                    <SecurityCard title="Contact Verification" icon="mail-outline" color="#f59e0b">
                        <SecurityItem
                            label="Email Address"
                            value={user?.email || "Not set"}
                            onPress={() => setEmailModalVisible(true)}
                        />
                        <View style={styles.divider} />
                        <SecurityItem
                            label="Phone Number"
                            value={user?.phone || "Not set"}
                            onPress={() => Alert.alert("Coming Soon", "Phone update will be available soon.")}
                        />
                    </SecurityCard>


                    {/* Recent Activity Logs */}
                    <SecurityCard title="Recent Activity" icon="list-outline" color="#3b82f6">
                        {securityAlerts.length > 0 ? (
                            securityAlerts.map((log, index) => (
                                <React.Fragment key={log.id}>
                                    <View style={styles.alertItem}>
                                        <View style={[styles.alertIcon, { backgroundColor: getActionColor(log.action) + '20' }]}>
                                            <Ionicons name={getActionIcon(log.action)} size={16} color={getActionColor(log.action)} />
                                        </View>
                                        <View style={styles.alertContent}>
                                            <View style={styles.alertHeader}>
                                                <Text style={styles.alertTitle}>{log.action.replace(/_/g, ' ')}</Text>
                                                <Text style={styles.alertTime}>{formatTimeAgo(log.created_at)}</Text>
                                            </View>
                                            <Text style={styles.alertDetail}>{log.details}</Text>
                                            <Text style={styles.alertIp}>{log.ip_address}</Text>
                                        </View>
                                    </View>
                                    {index < securityAlerts.length - 1 && <View style={styles.divider} />}
                                </React.Fragment>
                            ))
                        ) : (
                            <Text style={styles.emptyText}>No recent activity logs.</Text>
                        )}
                    </SecurityCard>

                    {/* Destructive Actions */}
                    <View style={styles.destructiveContainer}>
                        <TouchableOpacity style={styles.deleteBtn} onPress={() => Alert.alert("Delete Account", "Feature coming soon.")}>
                            <Ionicons name="trash-outline" size={20} color="#ef4444" />
                            <Text style={styles.deleteBtnText}>Delete Account</Text>
                        </TouchableOpacity>
                        <Text style={styles.deleteHint}>Once deleted, your account data cannot be recovered.</Text>
                    </View>

                    <View style={{ height: 40 }} />
                </ScrollView>
            </View>

            {/* Password Modal */}
            <Modal visible={passwordModalVisible} animationType="slide" transparent={true}>
                <View style={styles.modalOverlay}>
                    <View style={styles.modalContent}>
                        <View style={styles.modalHeader}>
                            <Text style={styles.modalTitle}>Change Password</Text>
                            <TouchableOpacity onPress={() => setPasswordModalVisible(false)}>
                                <Ionicons name="close" size={24} color="#64748b" />
                            </TouchableOpacity>
                        </View>

                        <View style={styles.modalBody}>
                            <Text style={styles.inputLabel}>Current Password</Text>
                            <TextInput
                                style={styles.input}
                                secureTextEntry={!showPasswords}
                                value={currentPassword}
                                onChangeText={setCurrentPassword}
                            />

                            <Text style={styles.inputLabel}>New Password</Text>
                            <TextInput
                                style={styles.input}
                                secureTextEntry={!showPasswords}
                                value={newPassword}
                                onChangeText={setNewPassword}
                            />

                            <Text style={styles.inputLabel}>Confirm New Password</Text>
                            <TextInput
                                style={styles.input}
                                secureTextEntry={!showPasswords}
                                value={confirmPassword}
                                onChangeText={setConfirmPassword}
                            />

                            <TouchableOpacity
                                style={styles.showHideToggle}
                                onPress={() => setShowPasswords(!showPasswords)}
                            >
                                <Ionicons name={showPasswords ? "eye-off-outline" : "eye-outline"} size={20} color="#64748b" />
                                <Text style={styles.toggleText}>{showPasswords ? "Hide Passwords" : "Show Passwords"}</Text>
                            </TouchableOpacity>

                            <TouchableOpacity
                                style={styles.saveBtn}
                                onPress={handleChangePassword}
                                disabled={loading}
                            >
                                {loading ? <ActivityIndicator color="#fff" /> : <Text style={styles.saveBtnText}>Update Password</Text>}
                            </TouchableOpacity>
                        </View>
                    </View>
                </View>
            </Modal>

            {/* OTP Modal */}
            <Modal visible={otpModalVisible} animationType="fade" transparent={true}>
                <View style={styles.modalOverlay}>
                    <View style={styles.otpModal}>
                        <Text style={styles.otpTitle}>Verify OTP</Text>
                        <Text style={styles.otpSubtitle}>Enter the 6-digit code sent to your new contact info.</Text>

                        <TextInput
                            style={styles.otpInput}
                            keyboardType="number-pad"
                            maxLength={6}
                            value={otp}
                            onChangeText={setOtp}
                            placeholder="000000"
                        />

                        <TouchableOpacity
                            style={styles.verifyBtn}
                            onPress={handleVerifyOtp}
                            disabled={loading}
                        >
                            {loading ? <ActivityIndicator color="#fff" /> : <Text style={styles.verifyBtnText}>Verify & Update</Text>}
                        </TouchableOpacity>

                        <TouchableOpacity onPress={() => setOtpModalVisible(false)}>
                            <Text style={styles.cancelText}>Cancel</Text>
                        </TouchableOpacity>
                    </View>
                </View>
            </Modal>

            {/* Email Change Modal */}
            <Modal visible={emailModalVisible} animationType="slide" transparent={true}>
                <View style={styles.modalOverlay}>
                    <View style={styles.modalContent}>
                        <View style={styles.modalHeader}>
                            <Text style={styles.modalTitle}>Update Email</Text>
                            <TouchableOpacity onPress={() => setEmailModalVisible(false)}>
                                <Ionicons name="close" size={24} color="#64748b" />
                            </TouchableOpacity>
                        </View>
                        <View style={styles.modalBody}>
                            <Text style={styles.inputLabel}>New Email Address</Text>
                            <TextInput
                                style={styles.input}
                                keyboardType="email-address"
                                value={newEmail}
                                onChangeText={setNewEmail}
                            />
                            <TouchableOpacity style={styles.saveBtn} onPress={handleRequestEmailChange} disabled={loading}>
                                <Text style={styles.saveBtnText}>Send Verification OTP</Text>
                            </TouchableOpacity>
                        </View>
                    </View>
                </View>
            </Modal>

        </View>
    );
}

const styles = StyleSheet.create({
    outerContainer: {
        flex: 1,
        backgroundColor: '#fff',
    },
    safe: {
        flex: 1,
        backgroundColor: '#f8fafc',
    },
    scrollContent: {
        padding: 20,
        paddingTop: 10,
    },
    card: {
        backgroundColor: '#fff',
        borderRadius: 20,
        marginBottom: 20,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.05,
        shadowRadius: 10,
        elevation: 3,
        overflow: 'hidden',
    },
    cardHeader: {
        flexDirection: 'row',
        alignItems: 'center',
        padding: 16,
        backgroundColor: '#fff',
        borderBottomWidth: 1,
        borderBottomColor: '#f1f5f9',
    },
    iconContainer: {
        width: 36,
        height: 36,
        borderRadius: 10,
        alignItems: 'center',
        justifyContent: 'center',
        marginRight: 12,
    },
    cardTitle: {
        fontSize: 16,
        fontWeight: '700',
        color: '#1e293b',
    },
    cardBody: {
        padding: 16,
    },
    securityItem: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingVertical: 8,
    },
    itemInfo: {
        flex: 1,
    },
    itemLabel: {
        fontSize: 13,
        color: '#64748b',
        fontWeight: '600',
        marginBottom: 4,
    },
    itemValue: {
        fontSize: 15,
        color: '#1e293b',
        fontWeight: '700',
    },
    itemButton: {
        backgroundColor: '#f1f5f9',
        paddingVertical: 8,
        paddingHorizontal: 16,
        borderRadius: 10,
    },
    itemButtonText: {
        fontSize: 13,
        fontWeight: '700',
        color: COLORS.primary,
    },
    divider: {
        height: 1,
        backgroundColor: '#f1f5f9',
        marginVertical: 12,
    },
    alertItem: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingVertical: 12,
    },
    alertIcon: {
        width: 38,
        height: 38,
        borderRadius: 12,
        alignItems: 'center',
        justifyContent: 'center',
        marginRight: 12,
    },
    alertContent: {
        flex: 1,
    },
    alertHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 2,
    },
    alertTitle: {
        fontSize: 14,
        fontWeight: '700',
        color: '#1e293b',
        textTransform: 'capitalize',
    },
    alertDetail: {
        fontSize: 13,
        color: '#64748b',
        lineHeight: 18,
    },
    alertTime: {
        fontSize: 11,
        color: '#94a3b8',
        fontWeight: '500',
    },
    alertIp: {
        fontSize: 11,
        color: '#cbd5e1',
        marginTop: 2,
    },
    emptyText: {
        textAlign: 'center',
        color: '#94a3b8',
        fontSize: 13,
        paddingVertical: 10,
    },
    destructiveContainer: {
        padding: 10,
    },
    deleteBtn: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        paddingVertical: 16,
        backgroundColor: '#fff',
        borderRadius: 16,
        borderWidth: 1,
        borderColor: '#fee2e2',
        gap: 10,
    },
    deleteBtnText: {
        fontSize: 16,
        fontWeight: '800',
        color: '#ef4444',
    },
    deleteHint: {
        fontSize: 12,
        color: '#94a3b8',
        textAlign: 'center',
        marginTop: 12,
        fontWeight: '500',
    },
    modalOverlay: {
        flex: 1,
        backgroundColor: 'rgba(15, 23, 42, 0.6)',
        justifyContent: 'flex-end',
    },
    modalContent: {
        backgroundColor: '#fff',
        borderTopLeftRadius: 30,
        borderTopRightRadius: 30,
        paddingBottom: Platform.OS === 'ios' ? 40 : 20,
    },
    modalHeader: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        padding: 24,
        borderBottomWidth: 1,
        borderBottomColor: '#f1f5f9',
    },
    modalTitle: {
        fontSize: 18,
        fontWeight: '800',
        color: '#1e293b',
    },
    modalBody: {
        padding: 24,
    },
    inputLabel: {
        fontSize: 13,
        fontWeight: '700',
        color: '#64748b',
        marginBottom: 8,
    },
    input: {
        backgroundColor: '#f8fafc',
        borderRadius: 12,
        padding: 16,
        fontSize: 15,
        color: '#1e293b',
        borderWidth: 1,
        borderColor: '#e2e8f0',
        marginBottom: 20,
    },
    showHideToggle: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 24,
        gap: 8,
    },
    toggleText: {
        fontSize: 14,
        color: '#64748b',
        fontWeight: '600',
    },
    saveBtn: {
        backgroundColor: COLORS.primary,
        paddingVertical: 18,
        borderRadius: 16,
        alignItems: 'center',
        shadowColor: COLORS.primary,
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.2,
        shadowRadius: 8,
        elevation: 4,
    },
    saveBtnText: {
        fontSize: 16,
        fontWeight: '800',
        color: '#fff',
    },
    otpModal: {
        backgroundColor: '#fff',
        margin: 20,
        borderRadius: 24,
        padding: 24,
        alignItems: 'center',
        marginBottom: 'auto',
        marginTop: 'auto',
    },
    otpTitle: {
        fontSize: 20,
        fontWeight: '800',
        color: '#1e293b',
        marginBottom: 8,
    },
    otpSubtitle: {
        fontSize: 14,
        color: '#64748b',
        textAlign: 'center',
        lineHeight: 20,
        marginBottom: 24,
    },
    otpInput: {
        backgroundColor: '#f8fafc',
        borderRadius: 16,
        paddingVertical: 18,
        paddingHorizontal: 32,
        fontSize: 24,
        fontWeight: '800',
        color: COLORS.primary,
        letterSpacing: 10,
        textAlign: 'center',
        borderWidth: 2,
        borderColor: '#e2e8f0',
        marginBottom: 24,
        width: '100%',
    },
    verifyBtn: {
        backgroundColor: COLORS.primary,
        width: '100%',
        paddingVertical: 16,
        borderRadius: 16,
        alignItems: 'center',
        marginBottom: 16,
    },
    verifyBtnText: {
        fontSize: 16,
        fontWeight: '800',
        color: '#fff',
    },
    cancelText: {
        fontSize: 14,
        fontWeight: '700',
        color: '#94a3b8',
    }
});
