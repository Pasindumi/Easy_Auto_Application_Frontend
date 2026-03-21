import Header from "@/components/Header";
import InputField from "@/components/InputField";
import COLORS from "@/constants/Colors";
import { useToast } from "@/contexts/ToastContext";
import { Ionicons } from "@expo/vector-icons";
import { Stack, useRouter } from "expo-router";
import { LinearGradient } from "expo-linear-gradient";
import React, { useState } from "react";
import Loading from "@/components/ui/Loading";
import {
    KeyboardAvoidingView,
    Platform,
    ScrollView,
    StyleSheet,
    Text,
    TouchableOpacity,
    View,
    ActivityIndicator,
    SafeAreaView,
    Alert,
} from "react-native";
import api from "@/utils/api";
import * as Haptics from 'expo-haptics';

const COMPLAINT_CATEGORIES = [
    "Service",
    "Professionalism",
    "Technical Issue",
    "Billing",
    "Security",
    "Other"
];

export default function ContactUsScreen() {
    const router = useRouter();
    const { showToast } = useToast();
    const [mode, setMode] = useState<"INQUIRY" | "COMPLAINT">("INQUIRY");
    const [name, setName] = useState("");
    const [email, setEmail] = useState("");
    const [subject, setSubject] = useState("");
    const [category, setCategory] = useState(COMPLAINT_CATEGORIES[0]);
    const [message, setMessage] = useState("");
    const [loading, setLoading] = useState(false);

    const handleSubmit = async () => {
        Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
        if (!message.trim()) {
            showToast({ message: "Please provide a message", type: "error" });
            return;
        }

        setLoading(true);
        try {
            if (mode === "INQUIRY") {
                console.log("Submitted Inquiry:", { name, email, subject, message });
                showToast({ message: "Your message has been sent successfully!", type: "success" });
                router.back();
            } else {
                const response: any = await api.post("/api/complaints", {
                    category,
                    message
                });

                if (response.success) {
                    showToast({ message: "Your complaint has been submitted. We will review it shortly.", type: "success" });
                    router.back();
                } else {
                    throw new Error(response.message || "Failed to submit complaint");
                }
            }
        } catch (error: any) {
            console.error("Submission error:", error);
            showToast({ message: error.message || "Something went wrong. Please try again.", type: "error" });
        } finally {
            setLoading(false);
        }
    };

    return (
        <View style={styles.outerContainer}>
            <Stack.Screen options={{ headerShown: false }} />
            <Header title={mode === "INQUIRY" ? "Contact Support" : "Submit Complaint"} showBack={true} />

            <SafeAreaView style={styles.safe}>
                <KeyboardAvoidingView
                    behavior={Platform.OS === "ios" ? "padding" : undefined}
                    style={{ flex: 1 }}
                >
                    <ScrollView
                        contentContainerStyle={styles.scrollContent}
                        showsVerticalScrollIndicator={false}
                    >
                        {/* Mode Toggle */}
                        <View style={styles.toggleContainer}>
                            <TouchableOpacity
                                style={[styles.toggleButton, mode === "INQUIRY" && styles.toggleButtonActive]}
                                onPress={() => {
                                    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
                                    setMode("INQUIRY");
                                }}
                            >
                                <Ionicons
                                    name="chatbox-ellipses-outline"
                                    size={16}
                                    color={mode === "INQUIRY" ? COLORS.primary : "#6B7280"}
                                />
                                <Text style={[styles.toggleText, mode === "INQUIRY" && styles.toggleTextActive]}>Inquiry</Text>
                            </TouchableOpacity>
                            <TouchableOpacity
                                style={[styles.toggleButton, mode === "COMPLAINT" && styles.toggleButtonActive]}
                                onPress={() => {
                                    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
                                    setMode("COMPLAINT");
                                }}
                            >
                                <Ionicons
                                    name="alert-circle-outline"
                                    size={16}
                                    color={mode === "COMPLAINT" ? COLORS.primary : "#6B7280"}
                                />
                                <Text style={[styles.toggleText, mode === "COMPLAINT" && styles.toggleTextActive]}>Complaint</Text>
                            </TouchableOpacity>
                        </View>

                        {/* Intro Card */}
                        <View style={styles.introCard}>
                            <View style={styles.introHeader}>
                                <Text style={styles.introTitle}>How can we help?</Text>
                                <Text style={styles.introSub}>
                                    Our typical response time is under 12 hours. We're here to assist you with any questions.
                                </Text>
                            </View>
                            <View style={styles.contactChips}>
                                <TouchableOpacity style={styles.chip}>
                                    <View style={[styles.chipIcon, { backgroundColor: '#eff6ff' }]}>
                                        <Ionicons name="call" size={16} color={COLORS.primary} />
                                    </View>
                                    <Text style={styles.chipText}>Call Us</Text>
                                </TouchableOpacity>
                                <TouchableOpacity style={styles.chip}>
                                    <View style={[styles.chipIcon, { backgroundColor: '#ecfdf5' }]}>
                                        <Ionicons name="mail" size={16} color="#10b981" />
                                    </View>
                                    <Text style={styles.chipText}>Email Us</Text>
                                </TouchableOpacity>
                            </View>
                        </View>

                        {/* Form Section */}
                        <View style={styles.formSection}>
                            <Text style={styles.sectionTitle}>
                                {mode === "INQUIRY" ? "Message Details" : "Complaint Feedback"}
                            </Text>

                            {mode === "INQUIRY" ? (
                                <>
                                    <InputField
                                        placeholder="Full Name"
                                        icon="person-outline"
                                        value={name}
                                        onChange={setName}
                                    />
                                    <InputField
                                        placeholder="Email Address"
                                        icon="mail-outline"
                                        value={email}
                                        onChange={setEmail}
                                        keyboardType="email-address"
                                    />
                                    <InputField
                                        placeholder="Subject (Optional)"
                                        icon="information-circle-outline"
                                        value={subject}
                                        onChange={setSubject}
                                    />
                                </>
                            ) : (
                                <View style={styles.categoryContainer}>
                                    <Text style={styles.label}>What is this regarding?</Text>
                                    <View style={styles.categoriesGrid}>
                                        {COMPLAINT_CATEGORIES.map((cat) => (
                                            <TouchableOpacity
                                                key={cat}
                                                style={[
                                                    styles.categoryItem,
                                                    category === cat && styles.categoryItemActive
                                                ]}
                                                onPress={() => {
                                                    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
                                                    setCategory(cat);
                                                }}
                                            >
                                                <Text style={[
                                                    styles.categoryItemText,
                                                    category === cat && styles.categoryItemTextActive
                                                ]}>
                                                    {cat}
                                                </Text>
                                            </TouchableOpacity>
                                        ))}
                                    </View>
                                </View>
                            )}

                            <InputField
                                placeholder={mode === "INQUIRY" ? "Tell us how we can help..." : "Provide as much detail as possible..."}
                                icon="chatbubble-outline"
                                value={message}
                                onChange={setMessage}
                                multiline
                                numberOfLines={4}
                                inputStyle={{ height: 120, textAlignVertical: 'top' }}
                            />

                            <TouchableOpacity
                                style={styles.submitButton}
                                onPress={handleSubmit}
                                activeOpacity={0.8}
                                disabled={loading}
                            >
                                <LinearGradient
                                    colors={[COLORS.primary, '#1D4ED8']}
                                    style={styles.gradientButton}
                                >
                                    {loading ? (
                                        <ActivityIndicator color="#fff" size="small" />
                                    ) : (
                                        <>
                                            <Text style={styles.submitButtonText}>
                                                {mode === "INQUIRY" ? "Submit Inquiry" : "Send Complaint"}
                                            </Text>
                                            <Ionicons name="send" size={16} color="#fff" style={{ marginLeft: 8 }} />
                                        </>
                                    )}
                                </LinearGradient>
                            </TouchableOpacity>
                        </View>

                        <View style={{ height: 40 }} />
                    </ScrollView>
                </KeyboardAvoidingView>
            </SafeAreaView>
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
        paddingTop: 24, // Fix overlap
    },
    toggleContainer: {
        flexDirection: 'row',
        backgroundColor: '#fff',
        borderRadius: 20,
        padding: 6,
        marginBottom: 24,
        borderWidth: 1,
        borderColor: '#f1f5f9',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.02,
        shadowRadius: 10,
        elevation: 2,
    },
    toggleButton: {
        flex: 1,
        paddingVertical: 12,
        alignItems: 'center',
        justifyContent: 'center',
        borderRadius: 16,
        flexDirection: 'row',
        gap: 8,
    },
    toggleButtonActive: {
        backgroundColor: '#eff6ff',
    },
    toggleText: {
        fontSize: 14,
        fontWeight: '700',
        color: '#64748b',
    },
    toggleTextActive: {
        color: COLORS.primary,
    },
    introCard: {
        backgroundColor: '#fff',
        borderRadius: 28,
        padding: 24,
        marginBottom: 24,
        borderWidth: 1,
        borderColor: '#f1f5f9',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.01,
        shadowRadius: 5,
    },
    introHeader: {
        marginBottom: 20,
    },
    introTitle: {
        fontSize: 20,
        fontWeight: '900',
        color: '#1e293b',
        marginBottom: 6,
    },
    introSub: {
        fontSize: 13,
        color: '#64748b',
        lineHeight: 20,
        fontWeight: '500',
    },
    contactChips: {
        flexDirection: 'row',
        gap: 12,
    },
    chip: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#f8fafc',
        paddingHorizontal: 16,
        paddingVertical: 10,
        borderRadius: 12,
        borderWidth: 1,
        borderColor: '#f1f5f9',
        gap: 8,
    },
    chipIcon: {
        width: 28,
        height: 28,
        borderRadius: 8,
        alignItems: 'center',
        justifyContent: 'center',
    },
    chipText: {
        fontSize: 13,
        fontWeight: '700',
        color: '#1e293b',
    },
    formSection: {
        backgroundColor: '#fff',
        borderRadius: 28,
        padding: 24,
        marginBottom: 24,
        borderWidth: 1,
        borderColor: '#f1f5f9',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 10 },
        shadowOpacity: 0.03,
        shadowRadius: 20,
        elevation: 5,
    },
    sectionTitle: {
        fontSize: 16,
        fontWeight: '800',
        color: '#1e293b',
        marginBottom: 20,
    },
    categoryContainer: {
        marginBottom: 20,
    },
    label: {
        fontSize: 13,
        fontWeight: '700',
        color: '#64748b',
        marginBottom: 12,
    },
    categoriesGrid: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        gap: 8,
    },
    categoryItem: {
        paddingHorizontal: 14,
        paddingVertical: 10,
        borderRadius: 10,
        backgroundColor: '#f8fafc',
        borderWidth: 1,
        borderColor: '#f1f5f9',
    },
    categoryItemActive: {
        backgroundColor: '#eff6ff',
        borderColor: COLORS.primary,
    },
    categoryItemText: {
        fontSize: 12,
        color: '#64748b',
        fontWeight: '600',
    },
    categoryItemTextActive: {
        color: COLORS.primary,
        fontWeight: '700',
    },
    submitButton: {
        marginTop: 10,
        borderRadius: 16,
        overflow: 'hidden',
    },
    gradientButton: {
        paddingVertical: 16,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        gap: 4,
    },
    submitButtonText: {
        color: '#fff',
        fontSize: 16,
        fontWeight: '800',
    },
});
