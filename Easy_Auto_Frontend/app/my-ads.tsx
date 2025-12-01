import { Ionicons } from '@expo/vector-icons';
import { Stack, useRouter } from 'expo-router';
import React, { useState } from 'react';
import {
  Dimensions,
  FlatList,
  Image,
  SafeAreaView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';

const HEADER_HEIGHT = 140;


const SCREEN_WIDTH = Dimensions.get('window').width;

type AdStatus = 'active' | 'draft' | 'expired';

type Ad = {
  id: string;
  title: string;
  location: string;
  price: string;
  image: any;
  status: AdStatus;
};

const ADS_DATA: Ad[] = [
  {
    id: '1',
    title: 'BMW 3 Series 2021',
    location: 'Malabe, Sri Lanka',
    price: '$45,000',
    image: require('../assets/images/car.jpg'),
    status: 'active',
  },
  {
    id: '2',
    title: 'BMW 3 Series 2021',
    location: 'Malabe, Sri Lanka',
    price: '$45,000',
    image: require('../assets/images/car.jpg'),
    status: 'draft',
  },
  {
    id: '3',
    title: 'Nissan GTR R35',
    location: 'Galle, Sri Lanka',
    price: '$56,000',
    image: require('../assets/images/car.jpg'),
    status: 'expired',
  },
  {
    id: '4',
    title: 'Toyota Supra 2020',
    location: 'Colombo, Sri Lanka',
    price: '$50,000',
    image: require('../assets/images/car.jpg'),
    status: 'active',
  },
  {
    id: '5',
    title: 'Honda Civic Type R',
    location: 'Kandy, Sri Lanka',
    price: '$38,000',
    image: require('../assets/images/car.jpg'),
    status: 'active',
  },
];

const FILTERS = [
  { key: 'all', label: 'Total Ads' },
  { key: 'active', label: 'Active Ads' },
  { key: 'expired', label: 'Expired Ads' },
  { key: 'draft', label: 'Draft Ads' },
];

export default function MyAdsScreen() {
  const router = useRouter();
  const [selectedFilter, setSelectedFilter] = useState<
    'all' | 'active' | 'expired' | 'draft'
  >('all');

  const filteredAds =
    selectedFilter === 'all'
      ? ADS_DATA
      : ADS_DATA.filter((ad) => ad.status === selectedFilter);

  const getCount = (status: string) => {
    if (status === 'all') return ADS_DATA.length;
    return ADS_DATA.filter((ad) => ad.status === status).length;
  };

  const renderStatusTag = (status: AdStatus) => {
    let bgColor = '#E5F3FF';
    let color = '#235CF8';
    let text = 'Active';

    if (status === 'draft') {
      bgColor = '#FFF6E5';
      color = '#F9A602';
      text = 'Draft';
    }

    if (status === 'expired') {
      bgColor = '#FFE5E5';
      color = '#FF3B30';
      text = 'Expired';
    }

    return (
      <View style={[styles.statusTag, { backgroundColor: bgColor }]}>
        <Text style={{ color, fontSize: 11, fontWeight: '700' }}>{text}</Text>
      </View>
    );
  };

  const renderAd = ({ item }: { item: Ad }) => {
    return (
      <View style={styles.adCard}>
        {/* Image */}
        <Image source={item.image} style={styles.adImage} />

        {/* Info */}
        <View style={styles.adInfo}>
          <View style={styles.adTopRow}>
            <Text style={styles.adTitle}>{item.title}</Text>
            {renderStatusTag(item.status)}
          </View>

          <Text style={styles.adLocation}>{item.location}</Text>
          <Text style={styles.adPrice}>{item.price}</Text>

          {/* Action Row */}
          <View style={styles.actionRow}>
            <ActionButton
              icon="eye-outline"
              label="View"
              onPress={() => router.push(`/view-car?id=${item.id}`)}
            />
            <ActionButton
              icon="create-outline"
              label="Edit"
              onPress={() => router.push(`/edit-car?id=${item.id}`)}
            />
            <ActionButton
              icon="flash-outline"
              label="Boost"
              onPress={() => router.replace(`/packages?id=${item.id}`)}
              
            />
            <ActionButton
              icon="trash-outline"
              label="Delete"
              onPress={() => router.push(`/delete-car?id=${item.id}`)}
            />
          </View>
        </View>
      </View>
    );
  };

  return (
    <>
      <Stack.Screen options={{ headerShown: false }} />
      <SafeAreaView style={styles.safe}>
        {/* Header */}
        <View style={styles.header}>
          <TouchableOpacity onPress={() => router.back()}>
            <Ionicons name="arrow-back" size={24} color="#fff" />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>MY ADS</Text>
          <View style={{ width: 24 }} />
        </View>

        {/* Filter Cards */}
        <View style={styles.filterRow}>
          {FILTERS.map((filter) => {
            const active = selectedFilter === filter.key;
            return (
              <TouchableOpacity
                key={filter.key}
                style={[
                  styles.filterCard,
                  active && styles.filterCardActive,
                ]}
                onPress={() =>
                  setSelectedFilter(
                    filter.key as 'all' | 'active' | 'expired' | 'draft'
                  )
                }
              >
                <Text
                  style={[
                    styles.filterCount,
                    active && styles.filterCountActive,
                  ]}
                >
                  {getCount(filter.key)}
                </Text>
                <Text
                  style={[
                    styles.filterLabel,
                    active && styles.filterLabelActive,
                  ]}
                >
                  {filter.label}
                </Text>
              </TouchableOpacity>
            );
          })}
        </View>

        {/* List */}
        <Text style={styles.sectionTitle}>
          {filteredAds.length}{' '}
          {FILTERS.find((f) => f.key === selectedFilter)?.label}
        </Text>

        <FlatList
          data={filteredAds}
          renderItem={renderAd}
          keyExtractor={(item) => item.id}
          contentContainerStyle={{ paddingBottom: 120 }}
          showsVerticalScrollIndicator={false}
        />

        {/* Create Button */}
        <TouchableOpacity
          style={styles.createButton}
          onPress={() => router.push('/post-add')}
        >
          <Ionicons name="add" size={20} color="#fff" />
          <Text style={styles.createButtonText}>Create New</Text>
        </TouchableOpacity>
      </SafeAreaView>
    </>
  );
}

/* Reusable Action Button */
function ActionButton({
  icon,
  label,
  onPress,
}: {
  icon: any;
  label: string;
  onPress: () => void;
}) {
  return (
    <TouchableOpacity style={styles.actionBtn} onPress={onPress}>
      <Ionicons name={icon} size={16} color="#555" />
      <Text style={styles.actionText}>{label}</Text>
    </TouchableOpacity>
  );
}

/* Styles */
const styles = StyleSheet.create({
  safe: {
    flex: 1,
    backgroundColor: '#F5F5F5',
  },

  header: {
  height: HEADER_HEIGHT,
  backgroundColor: '#235CF8',
  flexDirection: 'row',
  alignItems: 'flex-end',   // pushes content down
  justifyContent: 'space-between',
  paddingHorizontal: 16,
  paddingBottom: 20,        // space from bottom
  
},

  headerTitle: {
    color: '#fff',
    fontSize: 17,
    fontWeight: '800',
    letterSpacing: 0.6,
  },

  filterRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    marginTop: 16,
  },

  filterCard: {
    width: (SCREEN_WIDTH - 32 - 30) / 4,
    backgroundColor: '#fff',
    borderRadius: 10,
    paddingVertical: 10,
    alignItems: 'center',
    elevation: 2,
  },

  filterCardActive: {
    backgroundColor: '#235CF8',
  },

  filterCount: {
    fontSize: 18,
    fontWeight: '800',
    color: '#333',
  },

  filterCountActive: {
    color: '#fff',
  },

  filterLabel: {
    fontSize: 11,
    marginTop: 2,
    color: '#777',
  },

  filterLabelActive: {
    color: '#fff',
  },

  sectionTitle: {
    paddingHorizontal: 16,
    marginTop: 14,
    marginBottom: 8,
    fontWeight: '700',
    fontSize: 14,
  },

  adCard: {
    backgroundColor: '#fff',
    marginHorizontal: 16,
    marginBottom: 14,
    borderRadius: 12,
    flexDirection: 'row',
    overflow: 'hidden',
    elevation: 2,
  },

  adImage: {
    width: 110,
    height: 110,
  },

  adInfo: {
    flex: 1,
    padding: 10,
  },

  adTopRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },

  adTitle: {
    fontWeight: '700',
    fontSize: 13,
    flex: 1,
    paddingRight: 5,
  },

  adLocation: {
    fontSize: 12,
    color: '#666',
    marginTop: 2,
  },

  adPrice: {
    fontSize: 15,
    fontWeight: '800',
    color: '#235CF8',
    marginTop: 4,
  },

  statusTag: {
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 50,
  },

  actionRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 10,
  },

  actionBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 4,
  },

  actionText: {
    fontSize: 11,
    marginLeft: 4,
    color: '#555',
  },

  createButton: {
    position: 'absolute',
    bottom: 20,
    alignSelf: 'center',
    backgroundColor: '#235CF8',
    paddingHorizontal: 26,
    paddingVertical: 14,
    borderRadius: 30,
    flexDirection: 'row',
    alignItems: 'center',
    elevation: 5,
  },

  createButtonText: {
    color: '#fff',
    fontWeight: '700',
    marginLeft: 6,
  },
});
