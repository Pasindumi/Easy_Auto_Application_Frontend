import Header from "@/components/Header";
import InputField from "@/components/InputField";
import COLORS from "@/constants/Colors";
import { Ionicons } from "@expo/vector-icons";
import { Stack, useRouter } from "expo-router";
import React, { useState } from "react";
import {
    KeyboardAvoidingView,
    Platform,
    ScrollView,
    StyleSheet,
    Text,
    TouchableOpacity,
    View,
} from "react-native";

export default function ContactUsScreen() {
    const router = useRouter();
    const [name, setName] = useState("");
    const [email, setEmail] = useState("");
    const [subject, setSubject] = useState("");
    const [message, setMessage] = useState("");

    const handleSubmit = () => {
        console.log("Submitted:", { name, email, subject, message });
        router.back();
    };

    return (
        <View style={styles.container}>
            <Stack.Screen options={{ headerShown: false }} />
            <Header showBack={true} />

            {/* Unified Sub-Header */}
            <View style={styles.subHeaderWrap}>
                <View style={styles.subHeader}>
                    <Ionicons name="chatbox-ellipses-outline" size={22} color={COLORS.primary} style={{ marginRight: 8 }} />
                    <Text style={styles.subHeaderTitle}>Contact Us</Text>
                </View>
            </View>

            <KeyboardAvoidingView
                behavior={Platform.OS === "ios" ? "padding" : "height"}
                style={{ flex: 1 }}
            >
                <ScrollView contentContainerStyle={styles.scrollContent}>
                    {/* Intro Text */}
                    <Text style={styles.introText}>
                        We&apos;d love to hear from you. Please fill out the form below.
                    </Text>

                    {/* Form Fields */}
                    <InputField
                        label="Full Name"
                        placeholder="Enter your full name"
                        icon="person-outline"
                        value={name}
                        onChange={setName}
                    />

                    <InputField
                        label="Email Address"
                        placeholder="Enter your email"
                        icon="mail-outline"
                        value={email}
                        onChange={setEmail}
                        keyboardType="email-address"
                    />

                    <InputField
                        label="Subject"
                        placeholder="What is this regarding?"
                        icon="information-circle-outline"
                        value={subject}
                        onChange={setSubject}
                    />

                    <InputField
                        label="Message"
                        placeholder="Type your message here..."
                        icon="chatbubble-outline"
                        value={message}
                        onChange={setMessage}
                    />

                    {/* Submit Button */}
                    <TouchableOpacity
                        style={styles.submitButton}
                        onPress={handleSubmit}
                        activeOpacity={0.8}
                    >
                        <Text style={styles.submitButtonText}>Send Message</Text>
                        <Ionicons name="send" size={18} color={COLORS.white} />
                    </TouchableOpacity>

                    {/* Contact Info */}
                    <View style={styles.contactInfo}>
                        <View style={styles.infoItem}>
                            <Ionicons name="call-outline" size={20} color={COLORS.primary} />
                            <Text style={styles.infoText}>+1 (555) 123-4567</Text>
                        </View>
                        <View style={styles.infoItem}>
                            <Ionicons name="mail-outline" size={20} color={COLORS.primary} />
                            <Text style={styles.infoText}>support@easyauto.com</Text>
                        </View>
                    </View>
                </ScrollView>
            </KeyboardAvoidingView>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: COLORS.background,
    },
    subHeaderWrap: {
        backgroundColor: COLORS.background
    },
    subHeader: {
        paddingHorizontal: 16,
        paddingVertical: 12,
        flexDirection: 'row',
        alignItems: 'center'
    },
    subHeaderTitle: {
        color: COLORS.primary,
        fontSize: 18,
        fontWeight: '600'
    },
    scrollContent: {
        padding: 20,
        paddingBottom: 40,
    },
    introText: {
        fontSize: 15,
        color: COLORS.text.secondary,
        marginBottom: 24,
        lineHeight: 22,
    },
    submitButton: {
        backgroundColor: COLORS.primary,
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "center",
        paddingVertical: 14,
        borderRadius: 12,
        marginTop: 24,
        gap: 8,
    },
    submitButtonText: {
        color: COLORS.white,
        fontSize: 16,
        fontWeight: "700",
    },
    contactInfo: {
        marginTop: 40,
        paddingTop: 24,
        borderTopWidth: 1,
        borderTopColor: COLORS.border,
        gap: 16,
    },
    infoItem: {
        flexDirection: "row",
        alignItems: "center",
        gap: 12,
    },
    infoText: {
        fontSize: 15,
        fontWeight: "500",
        color: COLORS.text.primary,
    },
});
