// app/add-card.tsx
import { Ionicons } from '@expo/vector-icons';
import { Stack, useRouter } from 'expo-router';
import React, { useState } from 'react';
import {
         SafeAreaView,
         ScrollView,
         StyleSheet,
         Text,
         TextInput,
         TouchableOpacity,
         View,
} from 'react-native';

export default function AddNewCard() {
  const router = useRouter();

  const [cardNumber, setCardNumber] = useState('');
  const [expiry, setExpiry] = useState('');
  const [cvv, setCvv] = useState('');
  const [name, setName] = useState('');
  const [saveCard, setSaveCard] = useState(true);
  const [agree, setAgree] = useState(true);

  return (
    <>
      <Stack.Screen options={{ headerShown: false }} />

      <SafeAreaView style={styles.safe}>
        <ScrollView contentContainerStyle={styles.container}>
          {/* ---------- HEADER ---------- */}
          <View style={styles.header}>
            <TouchableOpacity onPress={() => router.back()}>
              <Ionicons name="arrow-back" size={22} color="#fff" />
            </TouchableOpacity>

            <Text style={styles.headerTitle}>ADD NEW CARD</Text>

            <View style={{ width: 22 }} />
          </View>

          {/* ---------- SCAN CARD ---------- */}
          <TouchableOpacity style={styles.scanBox}>
            <Ionicons name="scan-outline" size={24} color="#235CF8" />
            <Text style={styles.scanText}>Scan your card</Text>
          </TouchableOpacity>

          {/* ---------- OR ---------- */}
          <View style={styles.orRow}>
            <View style={styles.orLine} />
            <Text style={styles.orText}>OR</Text>
            <View style={styles.orLine} />
          </View>

          {/* ---------- FORM ---------- */}
          <View style={styles.formBox}>
            <Text style={styles.formTitle}>Enter your Card info</Text>

            {/* Card Number */}
            <Text style={styles.label}>Card Number</Text>
            <View style={styles.inputWrapper}>
              <Ionicons name="card-outline" size={18} color="#FF9800" />
              <TextInput
                placeholder="Card Number"
                style={styles.input}
                keyboardType="number-pad"
                value={cardNumber}
                onChangeText={setCardNumber}
              />
            </View>

            {/* Expiry and CVV */}
            <View style={styles.row}>
              <View style={{ flex: 1, marginRight: 8 }}>
                <Text style={styles.label}>Expires</Text>
                <TextInput
                  placeholder="mm/yyyy"
                  style={styles.smallInput}
                  keyboardType="number-pad"
                  value={expiry}
                  onChangeText={setExpiry}
                />
              </View>

              <View style={{ flex: 1, marginLeft: 8 }}>
                <Text style={styles.label}>CVV</Text>
                <TextInput
                  placeholder="3 pin Digit"
                  style={styles.smallInput}
                  keyboardType="number-pad"
                  secureTextEntry
                  value={cvv}
                  onChangeText={setCvv}
                />
              </View>
            </View>

            {/* Name */}
            <Text style={styles.label}>Name on the card</Text>
            <TextInput
              placeholder="Enter name"
              style={styles.fullInput}
              value={name}
              onChangeText={setName}
            />

            {/* Save Card */}
            <TouchableOpacity
              style={styles.checkRow}
              onPress={() => setSaveCard(!saveCard)}
            >
              <View
                style={[
                  styles.checkBox,
                  saveCard && styles.checkBoxActive,
                ]}
              >
                {saveCard && (
                  <Ionicons name="checkmark" size={14} color="#fff" />
                )}
              </View>

              <Text style={styles.checkText}>
                Save credit card information
              </Text>
            </TouchableOpacity>

            {/* Terms */}
            <TouchableOpacity
              style={styles.checkRow}
              onPress={() => setAgree(!agree)}
            >
              <View
                style={[
                  styles.checkBox,
                  agree && styles.checkBoxActive,
                ]}
              >
                {agree && (
                  <Ionicons name="checkmark" size={14} color="#fff" />
                )}
              </View>

              <Text style={styles.checkText}>
                I have read carefully and agree to the{' '}
                <Text style={styles.linkText}>terms and conditions</Text>
              </Text>
            </TouchableOpacity>

            {/* Save Button */}
            <TouchableOpacity style={styles.saveBtn}>
              <Text style={styles.saveBtnText}>Save</Text>
            </TouchableOpacity>
          </View>
        </ScrollView>
      </SafeAreaView>
    </>
  );
}

const styles = StyleSheet.create({
  safe: {
    flex: 1,
    backgroundColor: '#F2F3F5',
  },

  container: {
    paddingBottom: 40,
  },

  /* HEADER */
  header: {
    backgroundColor: '#235CF8',
    paddingHorizontal: 16,
    paddingTop: 50,
    paddingBottom: 24,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },

  headerTitle: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '700',
  },

  /* SCAN */
  scanBox: {
    margin: 20,
    borderWidth: 1,
    borderStyle: 'dashed',
    borderColor: '#235CF8',
    borderRadius: 12,
    padding: 18,
    justifyContent: 'center',
    alignItems: 'center',
    flexDirection: 'row',
  },

  scanText: {
    marginLeft: 8,
    color: '#235CF8',
    fontWeight: '600',
  },

  /* OR */
  orRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginHorizontal: 20,
    marginBottom: 10,
  },

  orLine: {
    flex: 1,
    height: 1,
    backgroundColor: '#D1D5DB',
  },

  orText: {
    marginHorizontal: 8,
    fontSize: 12,
    color: '#6B7280',
  },

  /* FORM */
  formBox: {
    backgroundColor: '#fff',
    marginHorizontal: 16,
    borderRadius: 18,
    padding: 16,
  },

  formTitle: {
    fontSize: 14,
    fontWeight: '700',
    marginBottom: 14,
  },

  label: {
    fontSize: 12,
    color: '#111',
    marginBottom: 6,
    marginTop: 8,
  },

  inputWrapper: {
    borderWidth: 1,
    borderColor: '#E5E7EB',
    borderRadius: 12,
    paddingHorizontal: 12,
    flexDirection: 'row',
    alignItems: 'center',
    height: 46,
  },

  input: {
    flex: 1,
    marginLeft: 8,
  },

  row: {
    flexDirection: 'row',
    marginTop: 6,
  },

  smallInput: {
    borderWidth: 1,
    borderColor: '#E5E7EB',
    borderRadius: 10,
    paddingHorizontal: 14,
    height: 46,
  },

  fullInput: {
    borderWidth: 1,
    borderColor: '#E5E7EB',
    borderRadius: 12,
    paddingHorizontal: 14,
    height: 46,
    marginTop: 6,
  },

  /* CHECKBOX */
  checkRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 12,
  },

  checkBox: {
    width: 18,
    height: 18,
    borderWidth: 1,
    borderColor: '#235CF8',
    borderRadius: 4,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 10,
  },

  checkBoxActive: {
    backgroundColor: '#235CF8',
  },

  checkText: {
    fontSize: 12,
    color: '#111',
    flex: 1,
  },

  linkText: {
    color: '#235CF8',
    textDecorationLine: 'underline',
  },

  /* BUTTON */
  saveBtn: {
    backgroundColor: '#235CF8',
    paddingVertical: 16,
    borderRadius: 24,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 24,
  },

  saveBtnText: {
    color: '#fff',
    fontWeight: '700',
  },
});
