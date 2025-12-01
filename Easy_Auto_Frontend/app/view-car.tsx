// app/view-car.tsx
import { Ionicons } from '@expo/vector-icons';
import { Stack, useLocalSearchParams, useRouter } from 'expo-router';
import React, { useMemo } from 'react';
import {
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

// Local sample data — replace with your real data source / API
const SAMPLE_ADS: Ad[] = [
  {
    id: '1',
    title: 'BMW 3 Series 2021',
    location: 'Malabe, Sri Lanka',
    price: '$45,000',
    image: require('../assets/images/car.jpg'),
    status: 'active',
    description:
      'Well-maintained BMW 3 Series 2021. Single owner, full service history, 40,000 km.',
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

export default function ViewCar() {
  const router = useRouter();
  const { id } = useLocalSearchParams(); // expects /view-car?id=1

  // Find ad from local sample list (replace with real fetch)
  const ad = useMemo(() => {
    return SAMPLE_ADS.find((a) => a.id === String(id)) ?? SAMPLE_ADS[0];
  }, [id]);

  const onDelete = () => {
    Alert.alert(
      'Delete Ad',
      'Are you sure you want to delete this ad? This action cannot be undone.',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Delete',
          style: 'destructive',
          onPress: () => {
            // TODO: call API to delete, then navigate back or show toast
            Alert.alert('Deleted', 'Ad has been deleted.');
            router.replace('/my-ads'); // or router.back()
          },
        },
      ],
    );
  };

  const onContactSeller = () => {
    // TODO: open chat / dialer / email
    Alert.alert('Contact Seller', 'Open chat or dialer here.');
  };

  const onShare = () => {
    // TODO: integrate Share API
    Alert.alert('Share', 'Share functionality here.');
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

            <Text style={styles.headerTitle}>VIEW CAR</Text>

            <View style={{ width: 22 }} />
          </View>

          {/* IMAGE */}
          <Image source={ad.image} style={styles.carImage} />

          {/* INFO CARD */}
          <View style={styles.infoCard}>
            <View style={styles.topRow}>
              <Text style={styles.title}>{ad.title}</Text>
              <View style={[styles.statusTag, getStatusStyle(ad.status)]}>
                <Text style={[styles.statusText, getStatusTextStyle(ad.status)]}>
                  {capitalize(ad.status)}
                </Text>
              </View>
            </View>

            <Text style={styles.location}>{ad.location}</Text>
            <Text style={styles.price}>{ad.price}</Text>

            <Text style={styles.sectionLabel}>Description</Text>
            <Text style={styles.description}>
              {ad.description ?? 'No description provided.'}
            </Text>

            {/* ACTIONS ROW */}
            <View style={styles.actionsRow}>
              <TouchableOpacity
                style={styles.actionBtn}
                onPress={() => router.push(`/edit-car?id=${ad.id}`)}
              >
                <Ionicons name="create-outline" size={18} color="#235CF8" />
                <Text style={styles.actionText}>Edit</Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={styles.actionBtn}
                onPress={() => router.replace(`/packages?id=${ad.id}`)}
              >
                <Ionicons name="flash-outline" size={18} color="#235CF8" />
                <Text style={styles.actionText}>Boost</Text>
              </TouchableOpacity>

              <TouchableOpacity style={styles.actionBtn} onPress={onDelete}>
                <Ionicons name="trash-outline" size={18} color="#FF3B30" />
                <Text style={[styles.actionText, { color: '#FF3B30' }]}>Delete</Text>
              </TouchableOpacity>
            </View>

            {/* CONTACT / SHARE */}
            <View style={styles.contactRow}>
              <TouchableOpacity style={styles.contactBtn} onPress={onContactSeller}>
                <Ionicons name="call-outline" size={18} color="#fff" />
                <Text style={styles.contactText}>Contact Seller</Text>
              </TouchableOpacity>

              <TouchableOpacity style={styles.shareBtn} onPress={onShare}>
                <Ionicons name="share-social-outline" size={18} color="#235CF8" />
                <Text style={styles.shareText}>Share</Text>
              </TouchableOpacity>
            </View>
          </View>
        </ScrollView>
      </SafeAreaView>
    </>
  );
}

/* Helpers */
function capitalize(s: string) {
  return s.charAt(0).toUpperCase() + s.slice(1);
}

function getStatusStyle(status: AdStatus) {
  if (status === 'active') return { backgroundColor: '#E5F3FF' };
  if (status === 'draft') return { backgroundColor: '#FFF6E5' };
  return { backgroundColor: '#FFE5E5' }; // expired
}

function getStatusTextStyle(status: AdStatus) {
  if (status === 'active') return { color: '#235CF8' };
  if (status === 'draft') return { color: '#F9A602' };
  return { color: '#FF3B30' };
}

/* Styles */
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
    height: 200,
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

  topRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },

  title: {
    fontSize: 16,
    fontWeight: '800',
    flex: 1,
    paddingRight: 8,
  },

  statusTag: {
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 20,
  },

  statusText: {
    fontSize: 12,
    fontWeight: '700',
  },

  location: {
    color: '#666',
    marginTop: 6,
    fontSize: 13,
  },

  price: {
    color: '#235CF8',
    fontSize: 18,
    fontWeight: '800',
    marginTop: 8,
  },

  sectionLabel: {
    marginTop: 12,
    fontSize: 13,
    fontWeight: '700',
  },

  description: {
    marginTop: 8,
    color: '#444',
    lineHeight: 20,
  },

  actionsRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 16,
  },

  actionBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 10,
    backgroundColor: '#F7F9FF',
  },

  actionText: {
    marginLeft: 6,
    color: '#235CF8',
    fontWeight: '700',
    fontSize: 13,
  },

  contactRow: {
    flexDirection: 'row',
    marginTop: 16,
    justifyContent: 'space-between',
  },

  contactBtn: {
    flex: 1,
    backgroundColor: '#235CF8',
    paddingVertical: 14,
    borderRadius: 28,
    alignItems: 'center',
    justifyContent: 'center',
    flexDirection: 'row',
    marginRight: 10,
  },

  contactText: {
    marginLeft: 8,
    color: '#fff',
    fontWeight: '700',
  },

  shareBtn: {
    paddingVertical: 14,
    paddingHorizontal: 16,
    borderRadius: 28,
    borderWidth: 1,
    borderColor: '#E6E9F5',
    alignItems: 'center',
    justifyContent: 'center',
    flexDirection: 'row',
  },

  shareText: {
    marginLeft: 8,
    color: '#235CF8',
    fontWeight: '700',
  },
});
