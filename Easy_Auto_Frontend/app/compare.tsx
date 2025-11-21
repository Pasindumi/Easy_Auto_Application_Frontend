import { Stack } from 'expo-router';
import React from 'react';
import { FlatList, Image, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';


import Footer from '../components/Footer';
import Header, { HEADER_HEIGHT } from '../components/Header';

// ---------------------------
// Sample comparison data
// ---------------------------
// Each object contains two cars to compare: left and right
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
  // no router needed here yet

  // ---------------------------
  // Render each car comparison card
  // ---------------------------
  const renderComparison = ({ item }: { item: typeof SAMPLE_COMPARISONS[0] }) => (
    <View style={[{ paddingHorizontal: 16, marginTop: 16 }, styles.compareCard]}>

      {/* Left car */}
      <View style={styles.side}>
        <Image source={item.left.img} style={styles.carImage} />
        <Text style={styles.carName}>{item.left.name}</Text>
        {item.left.year && <Text style={styles.carYear}>{item.left.year}</Text>}
      </View>

      {/* VS circle in middle */}
      <View style={styles.vsColumn}>
        <View style={styles.vsCircle}>
          <Text style={styles.vsText}>vs</Text>
        </View>
      </View>

      {/* Right car */}
      <View style={styles.side}>
        <Image source={item.right.img} style={styles.carImage} />
        <Text style={styles.carName}>{item.right.name}</Text>
        {item.right.year && <Text style={styles.carYear}>{item.right.year}</Text>}
      </View>
    </View>
  );

  // ---------------------------
  // Header section: Select Cars + Action Buttons
  // ---------------------------
  const renderHeaderSection = () => (
    <View style={{ paddingHorizontal: 16 ,marginTop: 24}}>
      {/* Title */}
      <Text style={styles.sectionTitle}>SELECT CARS</Text>

      {/* Row with left and right select cards */}
      <View style={styles.selectRow}>
        {/* Left Select Card */}
        <View style={styles.selectCard}>
          <View style={styles.iconBox}>
            <Text style={styles.iconCar}>＋</Text>
          </View>
          <Text style={styles.selectText}>SELECT CAR</Text>
        </View>

        {/* Divider with small vs circle */}
        <View style={styles.selectDivider}>
          <View style={styles.vsSmallCircle}>
            <Text style={styles.vsSmallText}>vs</Text>
          </View>
          <View style={styles.dividerLine} />
        </View>

        {/* Right Select Card */}
        <View style={styles.selectCard}>
          <View style={styles.iconBox}>
            <Text style={styles.iconCar}>＋</Text>
          </View>
          <Text style={styles.selectText}>SELECT CAR</Text>
        </View>
      </View>

      {/* Action buttons: Add & Compare */}
      <View style={styles.actionsRow}>
        <View style={styles.addButton}>
          <Text style={styles.addButtonText}>＋ Add</Text>
        </View>
        <View style={styles.compareButton}>
          <Text style={styles.compareButtonText}>Compare</Text>
        </View>
      </View>

      {/* Popular comparisons title */}
      <Text style={[styles.sectionTitle, { marginTop: 37 }]}>POPULAR CAR COMPARISONS</Text>
    </View>
  );

  // ---------------------------
  // Main render
  // ---------------------------
  return (
    <>
      <Stack.Screen options={{ headerShown: false }} />
      <SafeAreaView style={styles.safe}>
        {/* Header component */}
        <Header title="COMPARE CARS" />

        {/* FlatList to render car comparisons */}
        <FlatList
          data={SAMPLE_COMPARISONS} // Source data
          keyExtractor={(item) => item.id} // Unique key
          renderItem={renderComparison} // How to render each item
          ItemSeparatorComponent={() => <View style={{ height: 12 }} />} // Space between items
          ListHeaderComponent={renderHeaderSection} // Header above list
          ListFooterComponent={<Footer />} // Footer included in scroll
          contentContainerStyle={{ paddingBottom: 0, paddingTop: HEADER_HEIGHT }} // Offset content so header doesn't overlap
        />
      </SafeAreaView>
    </>
  );
}

// ---------------------------
// Styles
// ---------------------------
const styles = StyleSheet.create({
  // Safe area for iOS/Android
  safe: { flex: 1, backgroundColor: '#fff' },

  // Section title style
  sectionTitle: { fontSize: 12, color: '#333', fontWeight: '700', marginBottom: 12 },

  // Row containing left and right select cards
  selectRow: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' },

  // Each select card container
  selectCard: {
  flex: 1,
  backgroundColor: '#fff',
  borderRadius: 10,
  padding: 12,
  alignItems: 'center',
  justifyContent: 'center',

  // Shadow for iOS
  shadowColor: '#235CF8',          // Blue shadow color
  shadowOffset: { width: 0, height: 4 },
  shadowOpacity: 0.3,              // Transparency of shadow
  shadowRadius: 6,                 // Blur radius

  // Shadow for Android
  elevation: 8,                    // Makes shadow bigger on Android
  borderWidth: 0.5,                // Optional subtle border to enhance shadow
  borderColor: 'rgba(35,92,248,0.3)',
},


  // Box for plus icon
  iconBox: {
    width: 80,
    height: 48,
    backgroundColor: '#F4F6FA',
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 8,
  },

  // Plus icon text style
  iconCar: { fontSize: 28, color: '#2F6BFF', fontWeight: '700' },

  // Text below select card
  selectText: { fontSize: 14, fontWeight: '700', color: '#444' },

  // Divider between left and right select cards
  selectDivider: { width: 58, alignItems: 'center', marginHorizontal: 8 },
  vsSmallCircle: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: '#fff',
    borderWidth: 1,
    borderColor: '#E6E8EE',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 6,
  },
  vsSmallText: { color: '#235CF8', fontWeight: '700' },
  dividerLine: { width: 1, flex: 1, backgroundColor: '#E6E8EE' },

  // Row for Add & Compare buttons
  actionsRow: { flexDirection: 'row', marginTop: 16, justifyContent: 'center' },
  addButton: { paddingVertical: 10, paddingHorizontal: 20, backgroundColor: '#2F6BFF', borderRadius: 8, marginRight: 12 },
  addButtonText: { color: '#fff', fontWeight: '700' },
  compareButton: { paddingVertical: 10, paddingHorizontal: 20, borderRadius: 8, borderWidth: 1, borderColor: '#2F6BFF' },
  compareButtonText: { color: '#235CF8', fontWeight: '700' },

  // Each comparison card container
 compareCard: {
  flexDirection: 'row',
  backgroundColor: '#fff',
  borderRadius: 12,
  padding: 14,
  alignItems: 'center',
  justifyContent: 'space-between',

  // Shadow for iOS
  shadowColor: '#235CF8',       // Blue shadow color
  shadowOffset: { width: 0, height: 4 }, 
  shadowOpacity: 0.3,           // Adjust transparency
  shadowRadius: 6,              // Blur

  // Shadow for Android
  elevation: 8,                 // Makes shadow bigger on Android
  // Optionally, add a light border for better effect
  borderWidth: 0.5,
  borderColor: 'rgba(35,92,248,0.3)',
},


  // Left or right side container
  side: { flex: 1, alignItems: 'center' },

  // Car image style
  carImage: { width: 120, height: 70, borderRadius: 8, marginBottom: 8 },

  // Car name & year text
  carName: { fontWeight: '700', color: '#111', textAlign: 'center' },
  carYear: { color: '#235CF8', marginTop: 4 },

  // VS circle column
  vsColumn: { width: 40, alignItems: 'center' },
  vsCircle: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: '#fff',
    borderWidth: 1,
    borderColor: '#E6E8EE',
    alignItems: 'center',
    justifyContent: 'center',
  },
  vsText: { color: '#235CF8', fontWeight: '700' },
});
