import Header from "@/components/Header";
import COLORS from "@/constants/Colors";
import { Ionicons } from '@expo/vector-icons';
import { Stack, useLocalSearchParams, useRouter } from 'expo-router';
import React, { useMemo, useState } from 'react';
import {
  ActivityIndicator,
  Alert,
  Image,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';

type AdStatus = 'active' | 'draft' | 'expired';

type Ad = {
  id: string;
  title: string;
  location: string;
  price: string;
  image: any;
  status: AdStatus;
  description?: string;
};

const SAMPLE_ADS: Ad[] = [
  {
    id: '1',
    title: 'BMW 3 Series 2021',
    location: 'Malabe, Sri Lanka',
    price: '$45,000',
    image: require('@/assets/images/car.jpg'),
    status: 'active',
    description: 'Well-maintained BMW 3 Series 2021. Single owner, full service history.',
  },
  {
    id: '2',
    title: 'Nissan GTR R35',
    location: 'Galle, Sri Lanka',
    price: '$56,000',
    image: require('@/assets/images/car.jpg'),
    status: 'expired',
    description: 'High-performance R35. Imported, recently serviced.',
  },
];

export default function DeleteCar() {
  const router = useRouter();
  const { id } = useLocalSearchParams();
  const [loading, setLoading] = useState(false);

  const ad = useMemo(() => {
    return SAMPLE_ADS.find((a) => a.id === String(id)) ?? SAMPLE_ADS[0];
  }, [id]);

  const confirmDelete = () => {
    Alert.alert(
      'Confirm Delete',
      'Are you sure you want to permanently delete this ad?',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Delete',
          style: 'destructive',
          onPress: () => handleDelete(),
        },
      ],
    );
  };

  const handleDelete = async () => {
    setLoading(true);
    try {
      await new Promise((res) => setTimeout(res, 1200));
      Alert.alert('Deleted', 'The ad has been deleted.');
      router.replace('./ads/my-ads');
    } catch (error) {
      console.error('Delete error', error);
      Alert.alert('Error', 'Could not delete the ad. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={styles.safe}>
      <Stack.Screen options={{ headerShown: false }} />
      <Header showBack={true} />

      {/* Unified Sub-Header */}
      <View style={styles.subHeaderWrap}>
        <View style={styles.subHeader}>
          <Ionicons name="trash-outline" size={22} color={COLORS.primary} style={{ marginRight: 8 }} />
          <Text style={styles.subHeaderTitle}>Delete Car</Text>
        </View>
      </View>

      <ScrollView contentContainerStyle={styles.container}>
        {/* IMAGE */}
        <Image source={ad.image} style={styles.carImage} />

        {/* INFO CARD */}
        <View style={styles.infoCard}>
          <Text style={styles.warnTitle}>This action cannot be undone</Text>

          <Text style={styles.label}>Title</Text>
          <Text style={styles.value}>{ad.title}</Text>

          <Text style={styles.label}>Location</Text>
          <Text style={styles.value}>{ad.location}</Text>

          <Text style={styles.label}>Price</Text>
          <Text style={styles.value}>{ad.price}</Text>

          <Text style={styles.label}>Description</Text>
          <Text style={styles.value}>{ad.description ?? 'No description'}</Text>

          {/* Buttons */}
          <View style={styles.buttonsRow}>
            <TouchableOpacity
              style={[styles.btn, styles.cancelBtn]}
              onPress={() => router.back()}
              disabled={loading}
            >
              <Ionicons name="close-outline" size={18} color={COLORS.primary} />
              <Text style={[styles.btnText, { color: COLORS.primary }]}>Cancel</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={[styles.btn, styles.deleteBtn]}
              onPress={confirmDelete}
              disabled={loading}
            >
              {loading ? (
                <ActivityIndicator size="small" color={COLORS.white} />
              ) : (
                <>
                  <Ionicons name="trash-outline" size={18} color={COLORS.white} />
                  <Text style={[styles.btnText, { color: COLORS.white }]}>Delete</Text>
                </>
              )}
            </TouchableOpacity>
          </View>
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  safe: {
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
  container: {
    paddingBottom: 40,
  },
  carImage: {
    width: '92%',
    height: 180,
    alignSelf: 'center',
    borderRadius: 12,
    marginTop: 16,
  },
  infoCard: {
    backgroundColor: COLORS.white,
    margin: 16,
    padding: 16,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: COLORS.divider,
  },
  warnTitle: {
    color: COLORS.status.danger,
    fontWeight: '800',
    fontSize: 14,
    marginBottom: 12,
  },
  label: {
    fontSize: 12,
    fontWeight: '700',
    marginTop: 8,
    color: COLORS.text.primary,
  },
  value: {
    fontSize: 14,
    color: COLORS.text.secondary,
    marginTop: 4,
  },
  buttonsRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 20,
  },
  btn: {
    flex: 1,
    paddingVertical: 12,
    borderRadius: 28,
    alignItems: 'center',
    justifyContent: 'center',
    flexDirection: 'row',
  },
  cancelBtn: {
    backgroundColor: COLORS.primaryLight,
    marginRight: 10,
  },
  deleteBtn: {
    backgroundColor: COLORS.status.danger,
    marginLeft: 10,
  },
  btnText: {
    marginLeft: 8,
    fontWeight: '700',
  },
});
