import Header from "@/components/Header";
import InputField from "@/components/InputField";
import COLORS from "@/constants/Colors";
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
    Alert,
} from "react-native";
import { headerSectionStyles } from '../../styles/headerSectionStyles';
import api from "@/utils/api";
import AppReviewsSection from "@/components/AppReviewsSection";

const COMPLAINT_CATEGORIES = [
    "Service",
    "User / Professionalism",
    "Technical Issue",
    "Payments / Billing",
    "Account / Security",
    "Other"
];

export default function ContactUsScreen() {
    const router = useRouter();
    const [mode, setMode] = useState<"INQUIRY" | "COMPLAINT">("INQUIRY");
    const [name, setName] = useState("");
    const [email, setEmail] = useState("");
    const [subject, setSubject] = useState("");
    const [category, setCategory] = useState(COMPLAINT_CATEGORIES[0]);
    const [message, setMessage] = useState("");
    const [loading, setLoading] = useState(false);

    const handleSubmit = async () => {
        if (!message.trim()) {
            Alert.alert("Error", "Please provide a message");
            return;
        }

        setLoading(true);
        try {
            if (mode === "INQUIRY") {
                // For now, inquiries are logged to console as before or you might have an endpoint
                console.log("Submitted Inquiry:", { name, email, subject, message });
                Alert.alert("Success", "Your message has been sent successfully!");
                router.back();
            } else {
                // Submit Complaint to backend
                const response: any = await api.post("/api/complaints", {
                    category,
                    message
                });

                if (response.success) {
                    Alert.alert("Success", "Your complaint has been submitted. We will review it shortly.");
                    router.back();
                } else {
                    throw new Error(response.message || "Failed to submit complaint");
                }
            }
        } catch (error: any) {
            console.error("Submission error:", error);
            Alert.alert("Error", error.message || "Something went wrong. Please try again.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <View style={styles.container}>
            <Stack.Screen options={{ headerShown: false }} />

            {/* Standard Header */}
            <Header showBack={true} />

            {/* Standard Title Section */}
            <View style={headerSectionStyles.headerWrap}>
                <View style={headerSectionStyles.header}>
                    <View style={headerSectionStyles.headerLeft}>
                        <Ionicons
                            name={mode === "INQUIRY" ? "chatbox-ellipses-outline" : "warning-outline"}
                            size={22}
                            color={COLORS.primary}
                            style={{ marginRight: 8 }}
                        />
                        <Text style={headerSectionStyles.headerTitle}>
                            {mode === "INQUIRY" ? "Contact Us" : "Make a Complaint"}
                        </Text>
                    </View>
                </View>
            </View>

            {/* Mode Toggle */}
            <View style={styles.toggleContainer}>
                <TouchableOpacity
                    style={[styles.toggleButton, mode === "INQUIRY" && styles.toggleButtonActive]}
                    onPress={() => setMode("INQUIRY")}
                >
                    <Text style={[styles.toggleText, mode === "INQUIRY" && styles.toggleTextActive]}>Contact Us</Text>
                </TouchableOpacity>
                <TouchableOpacity
                    style={[styles.toggleButton, mode === "COMPLAINT" && styles.toggleButtonActive]}
                    onPress={() => setMode("COMPLAINT")}
                >
                    <Text style={[styles.toggleText, mode === "COMPLAINT" && styles.toggleTextActive]}>Complaint</Text>
                </TouchableOpacity>
            </View>

            <KeyboardAvoidingView
                behavior={Platform.OS === "ios" ? "padding" : undefined}
                style={{ flex: 1 }}
            >
                <ScrollView
                    contentContainerStyle={styles.scrollContent}
                    showsVerticalScrollIndicator={false}
                >
                    {/* App Reviews Section */}
                    <AppReviewsSection />

                    {/* Intro Banner Area */}
                    <View style={styles.introBanner}>
                        <Text style={styles.introTitle}>How can we help?</Text>
                        <Text style={styles.introText}>
                            We're here to help and answer any question you might have. We look forward to hearing from you.
                        </Text>
                    </View>
                    {/* Contact Cards Row */}
                    <View style={styles.contactRow}>
                        <TouchableOpacity style={styles.contactCard} activeOpacity={0.8}>
                            <View style={[styles.cardIcon, { backgroundColor: '#E3F2FD' }]}>
                                <Ionicons name="call" size={20} color="#235CF8" />
                            </View>
                            <Text style={[styles.cardLabel, { marginBottom: 0, fontSize: 14, color: COLORS.text.primary }]}>Call Us</Text>
                        </TouchableOpacity>

                        <TouchableOpacity style={styles.contactCard} activeOpacity={0.8}>
                            <View style={[styles.cardIcon, { backgroundColor: '#E0F2F1' }]}>
                                <Ionicons name="mail" size={20} color="#009688" />
                            </View>
                            <Text style={[styles.cardLabel, { marginBottom: 0, fontSize: 14, color: COLORS.text.primary }]}>Email Us</Text>
                        </TouchableOpacity>
                    </View>



                    {/* Form Section */}
                    <View style={styles.formSection}>
                        <Text style={styles.sectionTitle}>
                            {mode === "INQUIRY" ? "Send us a Message" : "Complaint Details"}
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
                                    placeholder="Subject"
                                    icon="information-circle-outline"
                                    value={subject}
                                    onChange={setSubject}
                                />
                            </>
                        ) : (
                            <View style={styles.categoryContainer}>
                                <Text style={styles.label}>Select Category</Text>
                                <View style={styles.categoriesGrid}>
                                    {COMPLAINT_CATEGORIES.map((cat) => (
                                        <TouchableOpacity
                                            key={cat}
                                            style={[
                                                styles.categoryItem,
                                                category === cat && styles.categoryItemActive
                                            ]}
                                            onPress={() => setCategory(cat)}
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
                            placeholder={mode === "INQUIRY" ? "Write your message..." : "Describe your complaint..."}
                            icon="chatbox-outline"
                            value={message}
                            onChange={setMessage}
                            multiline
                            numberOfLines={4}
                            inputStyle={{ height: 120 }}
                        />

                        <TouchableOpacity
                            style={[styles.submitButton, loading && { opacity: 0.7 }]}
                            onPress={handleSubmit}
                            activeOpacity={0.8}
                            disabled={loading}
                        >
                            <LinearGradient
                                colors={['#235CF8', '#1A4ADB']}
                                style={styles.gradientButton}
                            >
                                {loading ? (
                                    <Loading size="small" />
                                ) : (
                                    <>
                                        <Text style={styles.submitButtonText}>
                                            {mode === "INQUIRY" ? "Send Message" : "Submit Complaint"}
                                        </Text>
                                        <Ionicons
                                            name={mode === "INQUIRY" ? "send" : "checkmark-circle-outline"}
                                            size={16}
                                            color={COLORS.white}
                                            style={{ marginLeft: 8 }}
                                        />
                                    </>
                                )}
                            </LinearGradient>
                        </TouchableOpacity>
                    </View>

                    {/* Bottom Info */}
                    <View style={{ height: 40 }} />
                </ScrollView>
            </KeyboardAvoidingView>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#F8F9FB',
    },
    scrollContent: {
        padding: 20,
    },
    introBanner: {
        marginBottom: 24,
    },
    introTitle: {
        fontSize: 24,
        fontWeight: '800',
        color: COLORS.text.primary,
        marginBottom: 8,
    },
    introText: {
        fontSize: 14,
        color: COLORS.text.secondary,
        lineHeight: 22,
    },
    toggleContainer: {
        flexDirection: 'row',
        backgroundColor: '#E5E7EB',
        borderRadius: 12,
        padding: 4,
        marginHorizontal: 20,
        marginBottom: 20,
    },
    toggleButton: {
        flex: 1,
        paddingVertical: 10,
        alignItems: 'center',
        borderRadius: 10,
    },
    toggleButtonActive: {
        backgroundColor: '#FFFFFF',
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
        elevation: 2,
    },
    toggleText: {
        fontSize: 14,
        fontWeight: '600',
        color: '#6B7280',
    },
    toggleTextActive: {
        color: COLORS.primary,
    },
    categoryContainer: {
        marginBottom: 20,
    },
    label: {
        fontSize: 14,
        fontWeight: '600',
        color: COLORS.text.secondary,
        marginBottom: 10,
    },
    categoriesGrid: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        gap: 8,
    },
    categoryItem: {
        paddingHorizontal: 12,
        paddingVertical: 8,
        borderRadius: 8,
        backgroundColor: '#F3F4F6',
        borderWidth: 1,
        borderColor: '#E5E7EB',
    },
    categoryItemActive: {
        backgroundColor: COLORS.primary + '10',
        borderColor: COLORS.primary,
    },
    categoryItemText: {
        fontSize: 12,
        color: '#4B5563',
        fontWeight: '500',
    },
    categoryItemTextActive: {
        color: COLORS.primary,
        fontWeight: '700',
    },
    contactRow: {
        flexDirection: 'row',
        gap: 15,
        marginBottom: 25,
    },
    contactCard: {
        flex: 1,
        backgroundColor: '#fff',
        borderRadius: 16,
        padding: 16,
        alignItems: 'center',
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.05,
        shadowRadius: 8,
        elevation: 2,
        borderWidth: 1,
        borderColor: 'rgba(0,0,0,0.03)',
    },
    cardIcon: {
        width: 42,
        height: 42,
        borderRadius: 12,
        alignItems: 'center',
        justifyContent: 'center',
        marginBottom: 10,
    },
    cardLabel: {
        fontSize: 12,
        color: COLORS.text.secondary,
        marginBottom: 4,
        fontWeight: '600',
    },
    cardValue: {
        fontSize: 13,
        color: COLORS.text.primary,
        fontWeight: '700',
    },

    formSection: {
        backgroundColor: '#fff',
        borderRadius: 20,
        padding: 20,
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.05,
        shadowRadius: 10,
        elevation: 3,
    },
    sectionTitle: {
        fontSize: 18,
        fontWeight: '700',
        color: COLORS.text.primary,
        marginBottom: 20,
    },



    submitButton: {
        marginTop: 20,
        borderRadius: 12,
        overflow: 'hidden',
        shadowColor: "#235CF8",
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.2,
        shadowRadius: 8,
        elevation: 4,
    },
    gradientButton: {
        paddingVertical: 16,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
    },
    submitButtonText: {
        color: '#fff',
        fontSize: 16,
        fontWeight: '700',
    },
});
