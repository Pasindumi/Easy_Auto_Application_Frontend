import Header from "@/components/Header";
import InputField from "@/components/InputField";
import COLORS from "@/constants/Colors";
import { Ionicons } from "@expo/vector-icons";
import { Stack, useRouter } from "expo-router";
import { LinearGradient } from "expo-linear-gradient";
import React, { useState } from "react";
import {
    KeyboardAvoidingView,
    Platform,
    ScrollView,
    StyleSheet,
    Text,
    TextInput,
    TouchableOpacity,
    View,
} from "react-native";
import { headerSectionStyles } from '../../styles/headerSectionStyles';

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

            {/* Standard Header */}
            <Header showBack={true} />

            {/* Standard Title Section */}
            <View style={headerSectionStyles.headerWrap}>
                <View style={headerSectionStyles.header}>
                    <View style={headerSectionStyles.headerLeft}>
                        <Ionicons name="chatbox-ellipses-outline" size={22} color={COLORS.primary} style={{ marginRight: 8 }} />
                        <Text style={headerSectionStyles.headerTitle}>Contact Us</Text>
                    </View>
                </View>
            </View>

            <KeyboardAvoidingView
                behavior={Platform.OS === "ios" ? "padding" : undefined}
                style={{ flex: 1 }}
            >
                <ScrollView
                    contentContainerStyle={styles.scrollContent}
                    showsVerticalScrollIndicator={false}
                >
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
                        <Text style={styles.sectionTitle}>Send us a Message</Text>

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

                        <InputField
                            placeholder="Write your message..."
                            icon="chatbox-outline"
                            value={message}
                            onChange={setMessage}
                            multiline
                            numberOfLines={4}
                            inputStyle={{ height: 120 }} // Optional: Enforce specific height if needed
                        />

                        <TouchableOpacity
                            style={styles.submitButton}
                            onPress={handleSubmit}
                            activeOpacity={0.8}
                        >
                            <LinearGradient
                                colors={['#235CF8', '#1A4ADB']}
                                style={styles.gradientButton}
                            >
                                <Text style={styles.submitButtonText}>Send Message</Text>
                                <Ionicons name="send" size={16} color={COLORS.white} style={{ marginLeft: 8 }} />
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
