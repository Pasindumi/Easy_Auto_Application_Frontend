import React, { useState } from 'react';
import { View, Text, TouchableOpacity, Modal, StyleSheet, FlatList } from 'react-native';
import { useTranslation } from 'react-i18next';
import { MaterialIcons } from '@expo/vector-icons';
import COLORS from '@/constants/Colors';


const LANGUAGES = [
    { code: 'en', label: 'English', nativeName: 'English' },
    { code: 'si', label: 'Sinhala', nativeName: 'සිංහල' },
    { code: 'ta', label: 'Tamil', nativeName: 'தமிழ்' },
];

interface LanguageSwitcherProps {
    iconColor?: string;
    style?: any;
}

const LanguageSwitcher: React.FC<LanguageSwitcherProps> = ({ iconColor = COLORS.white, style }) => {
    const { i18n } = useTranslation();
    const [modalVisible, setModalVisible] = useState(false);

    const currentLanguage = LANGUAGES.find(l => l.code === i18n.language) || LANGUAGES[0];

    const changeLanguage = (langCode: string) => {
        i18n.changeLanguage(langCode);
        setModalVisible(false);
    };

    return (
        <View style={[styles.container, style]}>
            <TouchableOpacity
                style={styles.button}
                onPress={() => setModalVisible(true)}
                activeOpacity={0.7}
            >
                <MaterialIcons name="language" size={24} color={iconColor} />
                {/* <Text style={[styles.langCode, { color: iconColor }]}>{currentLanguage.code.toUpperCase()}</Text> */}
            </TouchableOpacity>

            <Modal
                animationType="fade"
                transparent={true}
                visible={modalVisible}
                onRequestClose={() => setModalVisible(false)}
            >
                <TouchableOpacity
                    style={styles.modalOverlay}
                    activeOpacity={1}
                    onPress={() => setModalVisible(false)}
                >
                    <View style={styles.modalContent}>
                        <View style={styles.header}>
                            <Text style={styles.title}>Select Language</Text>
                            <TouchableOpacity onPress={() => setModalVisible(false)}>
                                <MaterialIcons name="close" size={24} color={COLORS.text.primary} />
                            </TouchableOpacity>
                        </View>

                        <FlatList
                            data={LANGUAGES}
                            keyExtractor={(item) => item.code}
                            renderItem={({ item }) => (
                                <TouchableOpacity
                                    style={[
                                        styles.languageOption,
                                        i18n.language === item.code && styles.selectedOption
                                    ]}
                                    onPress={() => changeLanguage(item.code)}
                                >
                                    <View style={styles.languageInfo}>
                                        <Text style={[
                                            styles.languageName,
                                            i18n.language === item.code && styles.selectedText
                                        ]}>
                                            {item.label}
                                        </Text>
                                        <Text style={[
                                            styles.nativeName,
                                            i18n.language === item.code && styles.selectedSubText
                                        ]}>
                                            {item.nativeName}
                                        </Text>
                                    </View>
                                    {i18n.language === item.code && (
                                        <MaterialIcons name="check-circle" size={24} color={COLORS.primary} />
                                    )}
                                </TouchableOpacity>
                            )}
                            ItemSeparatorComponent={() => <View style={styles.separator} />}
                        />
                    </View>
                </TouchableOpacity>
            </Modal>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        // marginBottom: 80,
        zIndex: 100,
    },
    button: {
        flexDirection: 'row',
        alignItems: 'center',
        padding: 8,
        borderRadius: 8,
        // backgroundColor: 'rgba(255,255,255,0.2)',
    },
    langCode: {
        marginLeft: 4,
        fontSize: 12,
        fontWeight: 'bold',
    },
    modalOverlay: {
        flex: 1,
        backgroundColor: 'rgba(0, 0, 0, 0.5)',
        justifyContent: 'center',
        alignItems: 'center',
        padding: 20,
    },
    modalContent: {
        backgroundColor: COLORS.white,
        borderRadius: 20,
        width: '100%',
        maxWidth: 340,
        paddingVertical: 20,
        shadowColor: "#000",
        shadowOffset: {
            width: 0,
            height: 2,
        },
        shadowOpacity: 0.25,
        shadowRadius: 3.84,
        elevation: 5,
    },
    header: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingHorizontal: 20,
        marginBottom: 15,
    },
    title: {
        fontSize: 18,
        fontWeight: 'bold',
        color: COLORS.text.primary,
    },
    languageOption: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingVertical: 15,
        paddingHorizontal: 20,
    },
    selectedOption: {
        backgroundColor: COLORS.background,
    },
    languageInfo: {
        flexDirection: 'column',
    },
    languageName: {
        fontSize: 16,
        color: COLORS.text.primary,
        fontWeight: '500',
    },
    nativeName: {
        fontSize: 14,
        color: COLORS.text.muted,
        marginTop: 2,
    },
    selectedText: {
        color: COLORS.primary,
        fontWeight: 'bold',
    },
    selectedSubText: {
        color: COLORS.primary,
        opacity: 0.8,
    },
    separator: {
        height: 1,
        backgroundColor: COLORS.divider,
        marginHorizontal: 20,
    },
});

export default LanguageSwitcher;
