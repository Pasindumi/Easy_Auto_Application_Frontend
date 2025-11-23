// app/buy-car.tsx
import { Ionicons } from '@expo/vector-icons';
import { Stack, useRouter } from 'expo-router';
import React, { useState } from 'react';
import {
         Dimensions,
         FlatList,
         Image,
         ImageBackground,
         SafeAreaView,
         ScrollView,
         StyleSheet,
         Text,
         TextInput,
         TouchableOpacity,
         View,
} from 'react-native';
import BottomNav from '../components/BottomNav';

const SCREEN_WIDTH = Dimensions.get('window').width;
const HEADER_HEIGHT = 140;
const BOTTOM_NAV_HEIGHT = 72;

const CATEGORIES = [
  { key: 'car', label: 'Car', img: null },
  { key: 'van', label: 'Van', img: null },
  { key: 'cab', label: 'Cab', img: null },
  { key: 'suv', label: 'SUV', img: null },
  { key: 'lorry', label: 'Lorry', img: null },
  { key: 'bus', label: 'Bus', img: null },
];

// SUV Cars list
const SUV_CARS = [
  { id: '1', title: 'Toyota RAV4 2020', km: '45,000 Km', location: 'Balangoda, Sri Lanka', price: 'Rs. 5.6Mn' },
  { id: '2', title: 'Nissan Patrol 2018', km: '56,000 Km', location: 'Kurunegala, Sri Lanka', price: 'Rs. 6.4Mn' },
  { id: '3', title: 'Honda CRV 2019', km: '38,000 Km', location: 'Galle, Sri Lanka', price: 'Rs. 5.0Mn' },
  { id: '4', title: 'Ford Everest 2021', km: '22,000 Km', location: 'Colombo, Sri Lanka', price: 'Rs. 7.2Mn' },
  { id: '5', title: 'Nissan Patrol 2018', km: '56,000 Km', location: 'Kurunegala, Sri Lanka', price: 'Rs. 6.4Mn' },
  { id: '6', title: 'Honda CRV 2019', km: '38,000 Km', location: 'Galle, Sri Lanka', price: 'Rs. 5.0Mn' },
  { id: '7', title: 'Ford Everest 2021', km: '22,000 Km', location: 'Colombo, Sri Lanka', price: 'Rs. 7.2Mn' },

];

// Card width calculation for 2 columns with gap
const CARD_GAP = 16; // horizontal gap between 2 cards
const CARD_WIDTH = (SCREEN_WIDTH - 32 - CARD_GAP) / 2; // 32 = paddingHorizontal * 2

export default function BuyCarScreen() {
  const router = useRouter();
  const [searchTop, setSearchTop] = useState('');
  const [searchBottom, setSearchBottom] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string | null>('suv');
  const [activeNav, setActiveNav] = useState<'home' | 'search' | 'compare' | 'chat' | 'profile'>('home');

  const handleNavPress = (key: string) => {
    setActiveNav(key as any);
    switch (key) {
      case 'home': router.push('/'); break;
      case 'search': router.push('/search'); break;
      case 'compare': router.push('/compare'); break;
      case 'chat': router.push('/chat'); break;
      case 'profile': router.push('/profile'); break;
    }
  };

  const renderCategory = ({ item }: { item: typeof CATEGORIES[0] }) => {
    const isActive = selectedCategory === item.key;
    return (
      <TouchableOpacity
        style={[styles.categoryCard, isActive && styles.categoryCardActive]}
        onPress={() => setSelectedCategory(item.key)}
        activeOpacity={0.8}
      >
        <View style={styles.categoryIcon}>
          <Ionicons name="car-sport" size={28} color={isActive ? '#235CF8' : '#9AA0A6'} />
        </View>
        <Text style={[styles.categoryLabel, isActive && styles.categoryLabelActive]}>
          {item.label}
        </Text>
      </TouchableOpacity>
    );
  };

  const renderSUVCard = ({ item }: { item: typeof SUV_CARS[0] }) => (
    <View style={[styles.carCard, { width: CARD_WIDTH, marginBottom: 20 }]}>
      <Image source={require('../assets/images/car.jpg')} style={styles.carCardImage} resizeMode="cover" />
      <View style={styles.carCardBody}>
        <Text style={styles.carTitle}>{item.title}</Text>
        <Text style={styles.carMeta}>{item.km}</Text>
        <Text style={styles.carMeta}>{item.location}</Text>
        <Text style={styles.price}>{item.price}</Text>
      </View>
    </View>
  );

  return (
    <>
      <Stack.Screen options={{ headerShown: false }} />
      <SafeAreaView style={styles.safe}>
        {/* Top Header */}
        <ImageBackground
          source={{ uri: 'file:///mnt/data/Screenshot 2025-11-21 203634.png' }}
          style={styles.headerBackground}
          imageStyle={styles.headerImageStyle}
        >
          <View style={styles.headerRow}>
            <TouchableOpacity onPress={() => router.push('/menu')}>
              <Ionicons name="menu" size={24} color="#fff" />
            </TouchableOpacity>
            <Text style={styles.headerTitle}>BUY CAR</Text>
            <View style={styles.headerRight}>
              <TouchableOpacity style={styles.headerIconBtn}>
                <Ionicons name="notifications-outline" size={20} color="#fff" />
              </TouchableOpacity>
              <TouchableOpacity style={styles.headerIconBtn}>
                <Ionicons name="location-outline" size={20} color="#fff" />
              </TouchableOpacity>
            </View>
          </View>
        </ImageBackground>

        <ScrollView contentContainerStyle={{ paddingBottom: BOTTOM_NAV_HEIGHT + 24 }} style={styles.content}>
          {/* Top Search */}
          <View style={styles.searchRow}>
            <View style={styles.searchBox}>
              <Ionicons name="search-outline" size={18} color="#9AA0A6" style={{ marginLeft: 10 }} />
              <TextInput
                placeholder="Search cars..."
                value={searchTop}
                onChangeText={setSearchTop}
                style={styles.searchInput}
                placeholderTextColor="#BFC6D9"
              />
              <TouchableOpacity style={styles.filterBtn}>
                <Ionicons name="options-outline" size={20} color="#235CF8" />
              </TouchableOpacity>
            </View>
          </View>

          {/* Category Grid */}
          <FlatList
            data={CATEGORIES}
            renderItem={renderCategory}
            keyExtractor={(i) => i.key}
            numColumns={3}
            columnWrapperStyle={{ justifyContent: 'space-between', marginBottom: 18 }}
            scrollEnabled={false}
            contentContainerStyle={{ paddingHorizontal: 16, marginTop: 10 }}
          />

          {/* Bottom Search Bar with Topic */}
          <View style={{ marginTop: 24, paddingHorizontal: 16 }}>
            <Text style={styles.topicText}>All SUV Cars</Text>
            <View style={[styles.searchBox, { marginTop: 8 }]}>
              <Ionicons name="search-outline" size={18} color="#9AA0A6" style={{ marginLeft: 10 }} />
              <TextInput
                placeholder="Filter by brand, city..."
                value={searchBottom}
                onChangeText={setSearchBottom}
                style={styles.searchInput}
                placeholderTextColor="#BFC6D9"
              />
              <TouchableOpacity style={styles.filterBtn}>
                <Ionicons name="options-outline" size={20} color="#235CF8" />
              </TouchableOpacity>
            </View>
          </View>

          {/* 2-column SUV Car Grid with proper gap */}
          <FlatList
            data={SUV_CARS}
            renderItem={renderSUVCard}
            keyExtractor={(i) => i.id}
            numColumns={2}
            columnWrapperStyle={{ justifyContent: 'space-between', paddingHorizontal: 16 }}
            style={{ marginTop: 20 }}
          />

          <View style={{ height: 36 }} />
        </ScrollView>

        <BottomNav activeKey={activeNav} onPress={handleNavPress} />
      </SafeAreaView>
    </>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: '#F5F5F5' },
  headerBackground: { height: HEADER_HEIGHT, width: '100%', justifyContent: 'flex-end', paddingHorizontal: 16, paddingBottom: 16, backgroundColor: '#235CF8' },
  headerImageStyle: { borderBottomLeftRadius: 18, borderBottomRightRadius: 18 },
  headerRow: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' },
  headerTitle: { color: '#fff', fontWeight: '800', fontSize: 16, letterSpacing: 0.6 },
  headerRight: { flexDirection: 'row', alignItems: 'center' },
  headerIconBtn: { marginLeft: 12 },

  content: { flex: 1, paddingTop: 12 },
  searchRow: { paddingHorizontal: 16, marginBottom: 12 },
  searchBox: { flexDirection: 'row', alignItems: 'center', backgroundColor: '#fff', height: 44, borderRadius: 10, overflow: 'hidden', shadowColor: '#000', shadowOpacity: 0.03, shadowRadius: 6, elevation: 2 },
  searchInput: { flex: 1, paddingHorizontal: 12, color: '#111', fontSize: 14 },
  filterBtn: { width: 44, height: 44, alignItems: 'center', justifyContent: 'center' },

  categoryCard: { width: (SCREEN_WIDTH - 16 * 2 - 16) / 3, backgroundColor: '#fff', borderRadius: 12, paddingVertical: 14, paddingHorizontal: 10, alignItems: 'center', justifyContent: 'center', borderWidth: 1, borderColor: 'rgba(35,92,248,0.03)', shadowColor: '#000', shadowOpacity: 0.02, shadowRadius: 6, elevation: 2 },
  categoryCardActive: { borderColor: '#DDE7FF', shadowColor: '#235CF8', shadowOpacity: 0.04, elevation: 6 },
  categoryIcon: { width: 60, height: 42, borderRadius: 8, alignItems: 'center', justifyContent: 'center', marginBottom: 10 },
  categoryLabel: { fontWeight: '700', color: '#444', fontSize: 12 },
  categoryLabelActive: { color: '#235CF8' },

  topicText: { fontSize: 16, fontWeight: '700', color: '#111' },

  carCard: { backgroundColor: '#fff', borderRadius: 12, overflow: 'hidden', shadowColor: '#000', shadowOpacity: 0.03, shadowRadius: 8, elevation: 3 },
  carCardImage: { width: '100%', height: 120 },
  carCardBody: { padding: 10 },
  carTitle: { fontWeight: '700', fontSize: 14, marginBottom: 4 },
  carMeta: { color: '#666', fontSize: 12 },
  price: { fontWeight: '700', color: '#111', marginTop: 4 },
});
