import Header from "@/components/Header";
import InputField from "@/components/InputField";
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
import { typography } from "../../components/theme";

export default function ContactUsScreen() {
    const router = useRouter();
    const [name, setName] = useState("");
    const [email, setEmail] = useState("");
    const [subject, setSubject] = useState("");
    const [message, setMessage] = useState("");

    const handleSubmit = () => {
        // Handle submission logic
        console.log("Submitted:", { name, email, subject, message });
        router.back();
    };

    return (
        <View style={styles.container}>
            <Stack.Screen options={{ headerShown: false }} />
            {/* Custom Header */}
            <Header />
            <View style={localStyles.headerWrap}>
                <View style={localStyles.header}>
                    <View style={localStyles.headerLeft}>
                        <Ionicons name="chatbox-ellipses-outline" size={22} color="#235CF8" style={{ marginRight: 8 }} />
                        <Text style={localStyles.headerTitle}>Contact Us</Text>
                    </View>
                </View>
            </View>

            <KeyboardAvoidingView
                behavior={Platform.OS === "ios" ? "padding" : "height"}
                style={{ flex: 1 }}
            >
                <ScrollView contentContainerStyle={styles.scrollContent}>
                    {/* Intro Text */}
                    <Text style={styles.introText}>
                        We'd love to hear from you. Please fill out the form below.
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
                        <Ionicons name="send" size={18} color="#fff" />
                    </TouchableOpacity>

                    {/* Contact Info */}
                    <View style={styles.contactInfo}>
                        <View style={styles.infoItem}>
                            <Ionicons name="call-outline" size={20} color="#235CF8" />
                            <Text style={styles.infoText}>+1 (555) 123-4567</Text>
                        </View>
                        <View style={styles.infoItem}>
                            <Ionicons name="mail-outline" size={20} color="#235CF8" />
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
        backgroundColor: "#F9FAFB",
    },
    scrollContent: {
        padding: 20,
        paddingBottom: 40,
    },
    introText: {
        ...typography.body,
        fontSize: 15,
        color: "#6B7280",
        marginBottom: 24,
        lineHeight: 22,
    },
    submitButton: {
        backgroundColor: "#235CF8",
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "center",
        paddingVertical: 14,
        borderRadius: 12,
        marginTop: 24,
        gap: 8,
        shadowColor: "#235CF8",
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.3,
        shadowRadius: 8,
        elevation: 4,
    },
    submitButtonText: {
        color: "#fff",
        fontSize: 16,
        fontWeight: "700",
    },
    contactInfo: {
        marginTop: 40,
        paddingTop: 24,
        borderTopWidth: 1,
        borderTopColor: "#E5E7EB",
        gap: 16,
    },
    infoItem: {
        flexDirection: "row",
        alignItems: "center",
        gap: 12,
    },
    infoText: {
        ...typography.body,
        fontSize: 15,
        fontWeight: "500",
    },
});

const localStyles = StyleSheet.create({
    headerWrap: { backgroundColor: '#F9FAFB' },
    header: { paddingHorizontal: 16, paddingVertical: 12, flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', borderBottomWidth: 1, borderColor: '#E5E7EB' },
    headerLeft: { flexDirection: 'row', alignItems: 'center' },
    headerTitle: { color: '#235CF8', fontSize: 18, fontWeight: '600' },
});
