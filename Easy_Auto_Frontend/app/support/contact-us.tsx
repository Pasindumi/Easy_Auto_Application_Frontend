import Header from "@/components/Header";
import Loading from "@/components/ui/Loading";
import COLORS from "@/constants/Colors";
import { Ionicons } from "@expo/vector-icons";
import { Stack, useRouter } from "expo-router";
import React, { useState } from "react";
import {
    ScrollView,
    StyleSheet,
    Text,
    TouchableOpacity,
    View,
    TextInput,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import * as Haptics from 'expo-haptics';

export default function ContactSupportScreen() {
    const router = useRouter();
    const [name, setName] = useState("");
    const [email, setEmail] = useState("");
    const [subject, setSubject] = useState("");
    const [message, setMessage] = useState("");
    const [isSubmitting, setIsSubmitting] = useState(false);

    const handleSubmit = async () => {
        if (!name || !email || !message) {
            Haptics.notificationAsync(Haptics.NotificationFeedbackType.Error);
            return;
        }

        Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
        setIsSubmitting(true);
        
        // Simulating API call
        setTimeout(() => {
            setIsSubmitting(false);
            Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
            router.back();
        }, 2000);
    };

    const InputField = ({ label, value, onChangeText, placeholder, multiline = false, keyboardType = "default" }: any) => (
        <View style={styles.inputGroup}>
            <Text style={styles.inputLabel}>{label}</Text>
            <View style={[styles.inputWrapper, multiline && styles.multilineWrapper]}>
                <TextInput
                    style={[styles.input, multiline && styles.multilineInput]}
                    value={value}
                    onChangeText={onChangeText}
                    placeholder={placeholder}
                    placeholderTextColor="#94A3B8"
                    multiline={multiline}
                    keyboardType={keyboardType as any}
                    textAlignVertical={multiline ? "top" : "center"}
                />
            </View>
        </View>
    );

    return (
        <View style={styles.outerContainer}>
            <Stack.Screen options={{ headerShown: false }} />
            <Header title="Contact Support" showBack={true} />

            <View style={styles.safe}>
                <ScrollView 
                    showsVerticalScrollIndicator={false}
                    contentContainerStyle={styles.scrollContent}
                >
                    <View style={styles.heroSection}>
                        <View style={styles.iconCircle}>
                            <Ionicons name="chatbubbles-outline" size={32} color={COLORS.primary} />
                        </View>
                        <Text style={styles.heroTitle}>How can we help?</Text>
                        <Text style={styles.heroDescription}>
                            Have a question or need assistance with your account? 
                            Send us a message and our team will get back to you within 24 hours.
                        </Text>
                    </View>

                    <View style={styles.formContainer}>
                        <InputField 
                            label="Full Name" 
                            value={name} 
                            onChangeText={setName} 
                            placeholder="e.g. John Doe" 
                        />
                        <InputField 
                            label="Email Address" 
                            value={email} 
                            onChangeText={setEmail} 
                            placeholder="john@example.com" 
                            keyboardType="email-address"
                        />
                        <InputField 
                            label="Subject" 
                            value={subject} 
                            onChangeText={setSubject} 
                            placeholder="What is this about?" 
                        />
                        <InputField 
                            label="Message" 
                            value={message} 
                            onChangeText={setMessage} 
                            placeholder="Tell us more about your inquiry..." 
                            multiline={true}
                        />

                        <TouchableOpacity 
                            style={[styles.submitBtn, isSubmitting && styles.submitBtnDisabled]}
                            onPress={handleSubmit}
                            disabled={isSubmitting}
                            activeOpacity={0.8}
                        >
                            {isSubmitting ? (
                                <Loading size="small" message="" />
                            ) : (
                                <>
                                    <Text style={styles.submitBtnText}>Send Message</Text>
                                    <Ionicons name="paper-plane" size={18} color="#fff" />
                                </>
                            )}
                        </TouchableOpacity>
                    </View>

                    <View style={styles.infoSection}>
                        <Text style={styles.infoTitle}>Other ways to connect</Text>
                        
                        <TouchableOpacity style={styles.infoCard}>
                            <View style={[styles.infoIconBg, { backgroundColor: '#EFF6FF' }]}>
                                <Ionicons name="mail" size={20} color="#3B82F6" />
                            </View>
                            <View style={styles.infoContent}>
                                <Text style={styles.infoLabel}>Email Support</Text>
                                <Text style={styles.infoValue}>support@easyauto.com</Text>
                            </View>
                        </TouchableOpacity>

                        <TouchableOpacity style={styles.infoCard}>
                            <View style={[styles.infoIconBg, { backgroundColor: '#ECFDF5' }]}>
                                <Ionicons name="call" size={20} color="#10B981" />
                            </View>
                            <View style={styles.infoContent}>
                                <Text style={styles.infoLabel}>Call Center</Text>
                                <Text style={styles.infoValue}>+94 11 234 5678</Text>
                            </View>
                        </TouchableOpacity>
                    </View>
                </ScrollView>
            </View>
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
        backgroundColor: '#F8FAFC',
    },
    scrollContent: {
        paddingBottom: 40,
    },
    heroSection: {
        backgroundColor: '#fff',
        paddingHorizontal: 24,
        paddingTop: 32,
        paddingBottom: 40,
        borderBottomLeftRadius: 36,
        borderBottomRightRadius: 36,
        alignItems: 'center',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.05,
        shadowRadius: 15,
        elevation: 3,
        marginBottom: 24,
    },
    iconCircle: {
        width: 64,
        height: 64,
        borderRadius: 32,
        backgroundColor: '#EFF6FF',
        alignItems: 'center',
        justifyContent: 'center',
        marginBottom: 16,
    },
    heroTitle: {
        fontSize: 24,
        fontWeight: '900',
        color: '#1E293B',
        marginBottom: 12,
    },
    heroDescription: {
        fontSize: 14,
        color: '#64748B',
        textAlign: 'center',
        lineHeight: 22,
        paddingHorizontal: 20,
    },
    formContainer: {
        paddingHorizontal: 24,
        gap: 20,
        marginBottom: 32,
    },
    inputGroup: {
        gap: 8,
    },
    inputLabel: {
        fontSize: 14,
        fontWeight: '700',
        color: '#334155',
        marginLeft: 4,
    },
    inputWrapper: {
        backgroundColor: '#fff',
        borderRadius: 16,
        borderWidth: 1.5,
        borderColor: '#E2E8F0',
        paddingHorizontal: 16,
        height: 56,
        justifyContent: 'center',
    },
    multilineWrapper: {
        height: 120,
        paddingVertical: 12,
    },
    input: {
        fontSize: 15,
        color: '#1E293B',
        fontWeight: '600',
    },
    multilineInput: {
        height: '100%',
    },
    submitBtn: {
        backgroundColor: COLORS.primary,
        height: 56,
        borderRadius: 16,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        gap: 12,
        marginTop: 12,
        shadowColor: COLORS.primary,
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.2,
        shadowRadius: 10,
        elevation: 4,
    },
    submitBtnDisabled: {
        opacity: 0.7,
    },
    submitBtnText: {
        color: '#fff',
        fontSize: 16,
        fontWeight: '800',
    },
    infoSection: {
        paddingHorizontal: 24,
    },
    infoTitle: {
        fontSize: 18,
        fontWeight: '800',
        color: '#1E293B',
        marginBottom: 16,
    },
    infoCard: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#fff',
        padding: 16,
        borderRadius: 20,
        marginBottom: 12,
        borderWidth: 1,
        borderColor: '#F1F5F9',
    },
    infoIconBg: {
        width: 44,
        height: 44,
        borderRadius: 14,
        alignItems: 'center',
        justifyContent: 'center',
        marginRight: 16,
    },
    infoContent: {
        flex: 1,
    },
    infoLabel: {
        fontSize: 12,
        fontWeight: '700',
        color: '#94A3B8',
        marginBottom: 2,
    },
    infoValue: {
        fontSize: 14,
        fontWeight: '800',
        color: '#1E293B',
    },
});
