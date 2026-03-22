import Header from "@/components/Header";
import COLORS from "@/constants/Colors";
import { Ionicons } from '@expo/vector-icons';
import { Stack, useLocalSearchParams, useRouter } from 'expo-router';
import React, { useMemo } from 'react';
import {
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
    description:
      'Well-maintained BMW 3 Series 2021. Single owner, full service history, 40,000 km.',
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

export default function ViewCar() {
  const router = useRouter();
  const { id } = useLocalSearchParams();

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
            Alert.alert('Deleted', 'Ad has been deleted.');
            router.replace('./ads/my-ads');
          },
        },
      ],
    );
  };

  const onContactSeller = () => {
    Alert.alert('Contact Seller', 'Open chat or dialer here.');
  };

  const onShare = () => {
    Alert.alert('Share', 'Share functionality here.');
  };

  return (
    <View style={styles.safe}>
      <Stack.Screen options={{ headerShown: false }} />
      <Header showBack={true} />

      {/* Unified Sub-Header */}
      <View style={styles.subHeaderWrap}>
        <View style={styles.subHeader}>
          <Ionicons name="eye-outline" size={22} color={COLORS.primary} style={{ marginRight: 8 }} />
          <Text style={styles.subHeaderTitle}>View Car</Text>
        </View>
      </View>

      <ScrollView contentContainerStyle={styles.container}>
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
              onPress={() => router.push(`/ads/edit-car?id=${ad.id}`)}
            >
              <Ionicons name="create-outline" size={18} color={COLORS.primary} />
              <Text style={styles.actionText}>Edit</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.actionBtn}
              onPress={() => router.replace(`./packages/packages?id=${ad.id}`)}
            >
              <Ionicons name="flash-outline" size={18} color={COLORS.primary} />
              <Text style={styles.actionText}>Boost</Text>
            </TouchableOpacity>

            <TouchableOpacity style={styles.actionBtn} onPress={onDelete}>
              <Ionicons name="trash-outline" size={18} color={COLORS.status.danger} />
              <Text style={[styles.actionText, { color: COLORS.status.danger }]}>Delete</Text>
            </TouchableOpacity>
          </View>

          {/* CONTACT / SHARE */}
          <View style={styles.contactRow}>
            <TouchableOpacity style={styles.contactBtn} onPress={onContactSeller}>
              <Ionicons name="call-outline" size={18} color={COLORS.white} />
              <Text style={styles.contactText}>Contact Seller</Text>
            </TouchableOpacity>

            <TouchableOpacity style={styles.shareBtn} onPress={onShare}>
              <Ionicons name="share-social-outline" size={18} color={COLORS.primary} />
              <Text style={styles.shareText}>Share</Text>
            </TouchableOpacity>
          </View>
        </View>
      </ScrollView>
    </View>
  );
}

function capitalize(s: string) {
  return s.charAt(0).toUpperCase() + s.slice(1);
}

function getStatusStyle(status: AdStatus) {
  if (status === 'active') return { backgroundColor: COLORS.primaryLight };
  if (status === 'draft') return { backgroundColor: '#FFF6E5' };
  return { backgroundColor: '#FFE5E5' };
}

function getStatusTextStyle(status: AdStatus) {
  if (status === 'active') return { color: COLORS.primary };
  if (status === 'draft') return { color: '#F9A602' };
  return { color: COLORS.status.danger };
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
    height: 200,
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
    color: COLORS.text.primary,
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
    color: COLORS.text.muted,
    marginTop: 6,
    fontSize: 13,
  },
  price: {
    color: COLORS.primary,
    fontSize: 18,
    fontWeight: '800',
    marginTop: 8,
  },
  sectionLabel: {
    marginTop: 12,
    fontSize: 13,
    fontWeight: '700',
    color: COLORS.text.primary,
  },
  description: {
    marginTop: 8,
    color: COLORS.text.secondary,
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
    backgroundColor: COLORS.primaryLight,
  },
  actionText: {
    marginLeft: 6,
    color: COLORS.primary,
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
    backgroundColor: COLORS.primary,
    paddingVertical: 14,
    borderRadius: 28,
    alignItems: 'center',
    justifyContent: 'center',
    flexDirection: 'row',
    marginRight: 10,
  },
  contactText: {
    marginLeft: 8,
    color: COLORS.white,
    fontWeight: '700',
  },
  shareBtn: {
    paddingVertical: 14,
    paddingHorizontal: 16,
    borderRadius: 28,
    borderWidth: 1,
    borderColor: COLORS.divider,
    alignItems: 'center',
    justifyContent: 'center',
    flexDirection: 'row',
  },
  shareText: {
    marginLeft: 8,
    color: COLORS.primary,
    fontWeight: '700',
  },
});
