// app/compare.tsx
import { Stack } from 'expo-router';
import React from 'react';
import { FlatList, Image, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import BottomNav from '../components/BottomNav';
import Header, { HEADER_HEIGHT } from '../components/Header';

const SAMPLE_COMPARISONS = [
  {
    id: '1',
    left: { name: 'Nissan Juke', year: '2020', img: require('../assets/images/car.jpg') },
    right: { name: 'Mitsubishi Pajero', year: '2021', img: require('../assets/images/car.jpg') },
  },
  {
    id: '2',
    left: { name: 'Toyota Hilux', year: '2022', img: require('../assets/images/car.jpg') },
    right: { name: 'Ford Ranger', year: '2022', img: require('../assets/images/car.jpg') },
  },
  {
    id: '3',
    left: { name: 'Nissan GTR', year: 'R34', img: require('../assets/images/car.jpg') },
    right: { name: 'Nissan GTR', year: 'R35', img: require('../assets/images/car.jpg') },
  },
];

export default function CompareScreen() {
  const [activeNav, setActiveNav] = React.useState<'home' | 'search' | 'compare' | 'chat' | 'profile'>('compare');

  const handleNavPress = (key: string) => setActiveNav(key as any);

  const renderComparison = ({ item }: { item: typeof SAMPLE_COMPARISONS[0] }) => (
    <View style={[{ paddingHorizontal: 16, marginTop: 16 }, styles.compareCard]}>
      <View style={styles.side}>
        <Image source={item.left.img} style={styles.carImage} />
        <Text style={styles.carName}>{item.left.name}</Text>
        {item.left.year && <Text style={styles.carYear}>{item.left.year}</Text>}
      </View>

      <View style={styles.vsColumn}>
        <View style={styles.vsCircle}>
          <Text style={styles.vsText}>vs</Text>
        </View>
      </View>

      <View style={styles.side}>
        <Image source={item.right.img} style={styles.carImage} />
        <Text style={styles.carName}>{item.right.name}</Text>
        {item.right.year && <Text style={styles.carYear}>{item.right.year}</Text>}
      </View>
    </View>
  );

  const renderHeaderSection = () => (
    <View style={{ paddingHorizontal: 16, marginTop: 24 }}>
      <Text style={styles.sectionTitle}>SELECT CARS</Text>
      <View style={styles.selectRow}>
        <View style={styles.selectCard}>
          <View style={styles.iconBox}>
            <Text style={styles.iconCar}>＋</Text>
          </View>
          <Text style={styles.selectText}>SELECT CAR</Text>
        </View>

        <View style={styles.selectDivider}>
          <View style={styles.vsSmallCircle}>
            <Text style={styles.vsSmallText}>vs</Text>
          </View>
          <View style={styles.dividerLine} />
        </View>

        <View style={styles.selectCard}>
          <View style={styles.iconBox}>
            <Text style={styles.iconCar}>＋</Text>
          </View>
          <Text style={styles.selectText}>SELECT CAR</Text>
        </View>
      </View>

      <View style={styles.actionsRow}>
        <View style={styles.addButton}>
          <Text style={styles.addButtonText}>＋ Add</Text>
        </View>
        <View style={styles.compareButton}>
          <Text style={styles.compareButtonText}>Compare</Text>
        </View>
      </View>

      <Text style={[styles.sectionTitle, { marginTop: 37 }]}>POPULAR CAR COMPARISONS</Text>
    </View>
  );

  return (
    <>
      <Stack.Screen options={{ headerShown: false }} />
      <SafeAreaView style={{ flex: 1, backgroundColor: '#fff' }}>
        <Header title="COMPARE CARS" />

        <FlatList
          data={SAMPLE_COMPARISONS}
          keyExtractor={(item) => item.id}
          renderItem={renderComparison}
          ItemSeparatorComponent={() => <View style={{ height: 12 }} />}
          ListHeaderComponent={renderHeaderSection}
          contentContainerStyle={{ paddingBottom: 20, paddingTop: HEADER_HEIGHT }} // minimal bottom padding
        />

        <BottomNav activeKey={activeNav} onPress={handleNavPress} />
      </SafeAreaView>
    </>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: '#fff' },
  sectionTitle: { fontSize: 12, color: '#333', fontWeight: '700', marginBottom: 12 },
  selectRow: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' },
  selectCard: {
    flex: 1,
    backgroundColor: '#fff',
    borderRadius: 10,
    padding: 12,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#235CF8',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 6,
    elevation: 8,
    borderWidth: 0.5,
    borderColor: 'rgba(35,92,248,0.3)',
  },
  iconBox: { width: 80, height: 48, backgroundColor: '#F4F6FA', borderRadius: 8, alignItems: 'center', justifyContent: 'center', marginBottom: 8 },
  iconCar: { fontSize: 28, color: '#2F6BFF', fontWeight: '700' },
  selectText: { fontSize: 14, fontWeight: '700', color: '#444' },
  selectDivider: { width: 58, alignItems: 'center', marginHorizontal: 8 },
  vsSmallCircle: { width: 36, height: 36, borderRadius: 18, backgroundColor: '#fff', borderWidth: 1, borderColor: '#E6E8EE', alignItems: 'center', justifyContent: 'center', marginBottom: 6 },
  vsSmallText: { color: '#235CF8', fontWeight: '700' },
  dividerLine: { width: 1, flex: 1, backgroundColor: '#E6E8EE' },
  actionsRow: { flexDirection: 'row', marginTop: 16, justifyContent: 'center' },
  addButton: { paddingVertical: 10, paddingHorizontal: 20, backgroundColor: '#2F6BFF', borderRadius: 8, marginRight: 12 },
  addButtonText: { color: '#fff', fontWeight: '700' },
  compareButton: { paddingVertical: 10, paddingHorizontal: 20, borderRadius: 8, borderWidth: 1, borderColor: '#2F6BFF' },
  compareButtonText: { color: '#235CF8', fontWeight: '700' },
  compareCard: {
    flexDirection: 'row',
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 14,
    alignItems: 'center',
    justifyContent: 'space-between',
    shadowColor: '#235CF8',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 6,
    elevation: 8,
    borderWidth: 0.5,
    borderColor: 'rgba(35,92,248,0.3)',
  },
  side: { flex: 1, alignItems: 'center' },
  carImage: { width: 120, height: 70, borderRadius: 8, marginBottom: 8 },
  carName: { fontWeight: '700', color: '#111', textAlign: 'center' },
  carYear: { color: '#235CF8', marginTop: 4 },
  vsColumn: { width: 40, alignItems: 'center' },
  vsCircle: { width: 36, height: 36, borderRadius: 18, backgroundColor: '#fff', borderWidth: 1, borderColor: '#E6E8EE', alignItems: 'center', justifyContent: 'center' },
  vsText: { color: '#235CF8', fontWeight: '700' },
});
