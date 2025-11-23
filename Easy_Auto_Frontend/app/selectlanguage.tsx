import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import * as React from 'react';
import {
  SafeAreaView,
  ScrollView,
  StatusBar,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';

export default function SelectLanguageScreen() {
  const router = useRouter();

  const languages = [
    { id: 1, name: 'English', code: 'en' },
    { id: 2, name: 'Sinhala', code: 'si' },
    { id: 3, name: 'Tamil', code: 'ta' },
  ];

  const handleLanguageSelect = (languageCode: string) => {
    // Here you can store the selected language in AsyncStorage or context
    console.log('Selected language:', languageCode);
    // Navigate to the next screen or main app
    // If English is selected, go directly to Login; otherwise open the main tabs
    if (languageCode === 'en') {
      router.push('/login');
    } else {
      router.push('/(tabs)');
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor="#235CF8" />
      
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity 
          style={styles.backButton}
          onPress={() => router.back()}
        >
          <Ionicons name="arrow-back" size={24} color="white" />
        </TouchableOpacity>
      </View>

      {/* Content */}
      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        <View style={styles.contentContainer}>
          {/* Language Selection Title */}
          <View style={styles.titleSection}>
            <Text style={styles.titleText}>SELECT YOUR LANGUAGE FOR A BETTER EXPERIENCE.</Text>
          </View>

          {/* Language Buttons */}
          <View style={styles.languageSection}>
            {languages.map((language) => (
              <TouchableOpacity
                key={language.id}
                style={styles.languageButton}
                onPress={() => handleLanguageSelect(language.code)}
              >
                <Text style={styles.languageButtonText}>{language.name}</Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F5F5F5',
  },
  header: {
    backgroundColor: '#235CF8',
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 32,
    elevation: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  backButton: {
    padding: 8,
    flex: 1,
  },
  logoContainer: {
    alignItems: 'center',
    flex: 2,
  },
  carIcon: {
    width: 40,
    height: 20,
    marginBottom: 4,
    justifyContent: 'center',
    alignItems: 'center',
  },
  carBody: {
    width: 35,
    height: 15,
    backgroundColor: 'white',
    borderRadius: 8,
    position: 'relative',
    justifyContent: 'center',
    alignItems: 'center',
  },
  carWindscreen: {
    width: 25,
    height: 8,
    backgroundColor: '#235CF8',
    borderRadius: 4,
    position: 'absolute',
    top: 2,
  },
  carLine: {
    width: 30,
    height: 1,
    backgroundColor: '#235CF8',
    position: 'absolute',
    bottom: 4,
  },
  logoText: {
    fontSize: 12,
    fontWeight: 'bold',
    color: 'white',
    letterSpacing: 0.5,
  },
  welcomeFinalText: {
    fontSize: 12,
    color: 'white',
    fontWeight: '500',
    flex: 1,
    textAlign: 'right',
    paddingRight: 8,
  },
  content: {
    flex: 1,
  },
  contentContainer: {
    padding: 24,
  },
  titleSection: {
    marginBottom: 32,
    alignItems: 'center',
  },
  titleText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
    textAlign: 'center',
    letterSpacing: 0.5,
  },
  languageSection: {
    marginBottom: 40,
  },
  languageButton: {
    backgroundColor: 'white',
    borderRadius: 8,
    paddingVertical: 16,
    paddingHorizontal: 24,
    marginBottom: 16,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    borderWidth: 1,
    borderColor: '#235CF8',
  },
  languageButtonText: {
    fontSize: 16,
    fontWeight: '500',
    color: '#235CF8',
    textAlign: 'center',
  },
  
});
