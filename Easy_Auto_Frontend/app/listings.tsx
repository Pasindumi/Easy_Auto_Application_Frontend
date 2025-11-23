import { Ionicons } from '@expo/vector-icons';
import { Stack, useRouter } from 'expo-router';
import React, { useState } from 'react';
import {
         FlatList,
         Image,
         SafeAreaView,
         ScrollView,
         StyleSheet,
         Text,
         TouchableOpacity,
         View,
} from 'react-native';

const LISTINGS = [
  {
    id: '1',
    title: 'Mercedex Benz',
    price: '$27,900',
    km: '42,000km',
    views: 950,
    likes: 35,
    messages: 35,
    status: 'Active',
    image: require('../assets/images/car.jpg'),
  },
  {
    id: '2',
    title: 'Mercedex Benz',
    price: '$27,900',
    km: '42,000km',
    views: 950,
    likes: 35,
    messages: 35,
    status: 'Paused',
    image: require('../assets/images/car.jpg'),
  },
  {
    id: '1',
    title: 'Mercedex Benz',
    price: '$27,900',
    km: '42,000km',
    views: 950,
    likes: 35,
    messages: 35,
    status: 'Active',
    image: require('../assets/images/car.jpg'),
  },
  {
    id: '2',
    title: 'Mercedex Benz',
    price: '$27,900',
    km: '42,000km',
    views: 950,
    likes: 35,
    messages: 35,
    status: 'Paused',
    image: require('../assets/images/car.jpg'),
  },
];

export default function MyListingsScreen() {
  const router = useRouter();
  const [selected, setSelected] = useState<string[]>([]);

  const toggleSelect = (id: string) => {
    setSelected(prev =>
      prev.includes(id) ? prev.filter(x => x !== id) : [...prev, id]
    );
  };

  const renderListing = ({ item }: any) => (
    <View style={styles.listingCard}>
      {/* Checkbox */}
      <TouchableOpacity onPress={() => toggleSelect(item.id)}>
        <View style={[
          styles.checkbox,
          selected.includes(item.id) && styles.checkboxActive
        ]}>
          {selected.includes(item.id) && <Ionicons name="checkmark" size={16} color="#fff" />}
        </View>
      </TouchableOpacity>

      {/* Car Image */}
      <Image source={item.image} style={styles.carImage} />

      {/* Details */}
      <View style={{ flex: 1 }}>
        <View style={styles.rowSpace}>
          <Text style={styles.title}>{item.title}</Text>

          {/* Status Badge */}
          <View style={[
            styles.statusBadge,
            item.status === 'Active' ? styles.activeBadge : styles.pauseBadge
          ]}>
            <Text style={styles.statusText}>{item.status}</Text>
          </View>
        </View>

        <Text style={styles.price}>{item.price}</Text>
        <Text style={styles.km}>{item.km}</Text>

        {/* Stats */}
        <View style={styles.statsRow}>
          <View style={styles.stat}>
            <Ionicons name="eye-outline" size={16} color="#666" />
            <Text style={styles.statText}>{item.views}</Text>
          </View>
          <View style={styles.stat}>
            <Ionicons name="heart-outline" size={16} color="#666" />
            <Text style={styles.statText}>{item.likes}</Text>
          </View>
          <View style={styles.stat}>
            <Ionicons name="chatbubble-outline" size={16} color="#666" />
            <Text style={styles.statText}>{item.messages}</Text>
          </View>
        </View>

        {/* Actions */}
        <View style={styles.actionRow}>
          <TouchableOpacity style={styles.actionBtn}>
            <Ionicons name="create-outline" size={18} color="#235CF8" />
            <Text style={styles.actionText}>Edit</Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.actionBtn}>
            <Ionicons name="rocket-outline" size={18} color="#235CF8" />
            <Text style={styles.actionText}>Boost</Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.actionBtn}>
            <Ionicons name="share-social-outline" size={18} color="#235CF8" />
            <Text style={styles.actionText}>Share</Text>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );

  return (
    <>
      <Stack.Screen options={{ headerShown: false }} />

      <SafeAreaView style={styles.container}>
        {/* Header */}
        <View style={styles.header}>
          <TouchableOpacity onPress={() => router.back()}>
            <Ionicons name="arrow-back" size={24} color="#fff" />
          </TouchableOpacity>

          <Text style={styles.headerTitle}>MY LISTINGS</Text>

          <View style={{ width: 24 }} />
        </View>

        <ScrollView contentContainerStyle={{ paddingBottom: 40 }}>
          {/* Status Cards */}
          <View style={styles.statusRow}>
            <View style={[styles.statusCard, styles.activeCard]}>
              <Text style={styles.statusLabel}>Active</Text>
              <Text style={styles.statusNumber}>04</Text>
            </View>

            <View style={styles.statusCard}>
              <Text style={styles.statusLabel}>Draft</Text>
              <Text style={styles.statusNumber}>02</Text>
            </View>

            <View style={styles.statusCard}>
              <Text style={styles.statusLabel}>Pause</Text>
              <Text style={styles.statusNumber}>05</Text>
            </View>
          </View>

          {/* Total Listings */}
          <Text style={styles.totalText}>11 Listings</Text>

          {/* Boost Visibility */}
          <View style={styles.boostCard}>
            <Ionicons name="rocket-outline" size={28} color="#235CF8" />
            <View style={{ flex: 1, marginLeft: 10 }}>
              <Text style={styles.boostTitle}>Boost Visibility</Text>
              <Text style={styles.boostDesc}>
                Promote top listing to reach more buyers
              </Text>

              {/* Progress bar */}
              <View style={styles.progressBar}>
                <View style={styles.progressFill} />
              </View>
            </View>
            <Text style={styles.boostPercent}>68%</Text>
          </View>

          {/* Select All */}
          <View style={styles.selectAllRow}>
            <View style={styles.checkbox} />
            <Text style={{ marginLeft: 8 }}>Select All</Text>
          </View>

          {/* Listings */}
          <FlatList
            data={LISTINGS}
            renderItem={renderListing}
            keyExtractor={item => item.id}
            scrollEnabled={false}
            contentContainerStyle={{ paddingBottom: 40 }}
          />
        </ScrollView>
      </SafeAreaView>
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F5F6FA',
  },

  header: {
    backgroundColor: '#235CF8',
    padding: 18,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },

  headerTitle: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 16,
  },

  statusRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    padding: 16,
  },

  statusCard: {
    backgroundColor: '#fff',
    width: '30%',
    borderRadius: 12,
    paddingVertical: 14,
    alignItems: 'center',
  },

  activeCard: {
    borderWidth: 1,
    borderColor: '#235CF8',
  },

  statusLabel: {
    fontSize: 13,
    color: '#666',
  },

  statusNumber: {
    fontSize: 20,
    fontWeight: 'bold',
    marginTop: 6,
  },

  totalText: {
    marginLeft: 16,
    marginBottom: 8,
    color: '#666',
  },

  boostCard: {
    backgroundColor: '#fff',
    margin: 16,
    borderRadius: 12,
    padding: 14,
    flexDirection: 'row',
    alignItems: 'center',
  },

  boostTitle: {
    fontWeight: '700',
  },

  boostDesc: {
    fontSize: 12,
    color: '#666',
  },

  progressBar: {
    height: 6,
    backgroundColor: '#eee',
    borderRadius: 6,
    marginTop: 6,
    overflow: 'hidden',
  },

  progressFill: {
    width: '68%',
    height: 6,
    backgroundColor: '#235CF8',
  },

  boostPercent: {
    fontWeight: 'bold',
  },

  selectAllRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    marginBottom: 10,
  },

  checkbox: {
    width: 20,
    height: 20,
    borderRadius: 5,
    borderWidth: 1,
    borderColor: '#ccc',
    alignItems: 'center',
    justifyContent: 'center',
  },

  checkboxActive: {
    backgroundColor: '#235CF8',
    borderColor: '#235CF8',
  },

  listingCard: {
    backgroundColor: '#fff',
    marginHorizontal: 16,
    marginBottom: 14,
    borderRadius: 12,
    padding: 12,
    flexDirection: 'row',
  },

  carImage: {
    width: 90,
    height: 70,
    borderRadius: 10,
    marginHorizontal: 10,
  },

  rowSpace: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },

  title: {
    fontWeight: '700',
  },

  price: {
    color: '#235CF8',
    fontWeight: '700',
  },

  km: {
    fontSize: 12,
    color: '#666',
  },

  statsRow: {
    flexDirection: 'row',
    marginTop: 6,
  },

  stat: {
    flexDirection: 'row',
    alignItems: 'center',
    marginRight: 14,
  },

  statText: {
    marginLeft: 4,
    fontSize: 12,
    color: '#555',
  },

  actionRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 8,
  },

  actionBtn: {
    flexDirection: 'row',
    alignItems: 'center',
  },

  actionText: {
    marginLeft: 4,
    color: '#235CF8',
    fontSize: 13,
    fontWeight: '600',
  },

  statusBadge: {
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 20,
  },

  activeBadge: {
    backgroundColor: '#E6F0FF',
  },

  pauseBadge: {
    backgroundColor: '#FFE7E7',
  },

  statusText: {
    fontSize: 11,
    fontWeight: '600',
  },
});
