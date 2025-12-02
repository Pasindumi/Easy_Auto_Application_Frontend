// app/delete-car.tsx
import { Ionicons } from '@expo/vector-icons';
import { Stack, useLocalSearchParams, useRouter } from 'expo-router';
import React, { useMemo, useState } from 'react';
import {
         ActivityIndicator,
         Alert,
         Image,
         SafeAreaView,
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

// Replace with your actual data source / fetch logic
const SAMPLE_ADS: Ad[] = [
  {
    id: '1',
    title: 'BMW 3 Series 2021',
    location: 'Malabe, Sri Lanka',
    price: '$45,000',
    image: require('../assets/images/car.jpg'),
    status: 'active',
    description: 'Well-maintained BMW 3 Series 2021. Single owner, full service history.',
  },
  {
    id: '2',
    title: 'Nissan GTR R35',
    location: 'Galle, Sri Lanka',
    price: '$56,000',
    image: require('../assets/images/car.jpg'),
    status: 'expired',
    description: 'High-performance R35. Imported, recently serviced.',
  },
];

export default function DeleteCar() {
  const router = useRouter();
  const { id } = useLocalSearchParams(); // expects /delete-car?id=1
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
      // TODO: Replace the timeout with your API call to delete the ad, e.g.:
      // await api.delete(`/ads/${ad.id}`);
      await new Promise((res) => setTimeout(res, 1200));

      // After successful delete, navigate back to My Ads (or whichever screen)
      Alert.alert('Deleted', 'The ad has been deleted.');
      router.replace('/my-ads'); // adjust route if different
    } catch (error) {
      console.error('Delete error', error);
      Alert.alert('Error', 'Could not delete the ad. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <Stack.Screen options={{ headerShown: false }} />

      <SafeAreaView style={styles.safe}>
        <ScrollView contentContainerStyle={styles.container}>
          {/* HEADER */}
          <View style={styles.header}>
            <TouchableOpacity onPress={() => router.back()}>
              <Ionicons name="arrow-back" size={22} color="#fff" />
            </TouchableOpacity>

            <Text style={styles.headerTitle}>DELETE CAR</Text>

            <View style={{ width: 22 }} />
          </View>

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
                <Ionicons name="close-outline" size={18} color="#235CF8" />
                <Text style={[styles.btnText, { color: '#235CF8' }]}>Cancel</Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={[styles.btn, styles.deleteBtn]}
                onPress={confirmDelete}
                disabled={loading}
              >
                {loading ? (
                  <ActivityIndicator size="small" color="#fff" />
                ) : (
                  <>
                    <Ionicons name="trash-outline" size={18} color="#fff" />
                    <Text style={[styles.btnText, { color: '#fff' }]}>Delete</Text>
                  </>
                )}
              </TouchableOpacity>
            </View>
          </View>
        </ScrollView>
      </SafeAreaView>
    </>
  );
}

const styles = StyleSheet.create({
  safe: {
    flex: 1,
    backgroundColor: '#F2F2F2',
  },

  container: {
    paddingBottom: 40,
  },

  /* HEADER */
  header: {
    backgroundColor: '#235CF8',
    paddingHorizontal: 16,
    paddingTop: 50,
    paddingBottom: 20,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },

  headerTitle: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '700',
  },

  carImage: {
    width: '92%',
    height: 180,
    alignSelf: 'center',
    borderRadius: 12,
    marginTop: 16,
  },

  infoCard: {
    backgroundColor: '#fff',
    margin: 16,
    padding: 16,
    borderRadius: 12,
    elevation: 2,
  },

  warnTitle: {
    color: '#B91C1C',
    fontWeight: '800',
    fontSize: 14,
    marginBottom: 12,
  },

  label: {
    fontSize: 12,
    fontWeight: '700',
    marginTop: 8,
    color: '#333',
  },

  value: {
    fontSize: 14,
    color: '#444',
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
    backgroundColor: '#F1F4FF',
    marginRight: 10,
  },

  deleteBtn: {
    backgroundColor: '#FF3B30',
    marginLeft: 10,
  },

  btnText: {
    marginLeft: 8,
    fontWeight: '700',
  },
});
