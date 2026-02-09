import Header from "@/components/Header";
import COLORS from "@/constants/Colors";
import { dummyData } from "@/constants/dummydata/reviewadd";
import { Feather, Ionicons } from '@expo/vector-icons';
import { router, Stack } from 'expo-router';
import React, { useState } from "react";
import { Image, ScrollView, StyleSheet, Text, TouchableOpacity, View } from "react-native";

export default function ReviewAd() {
  const [negotiable, setNegotiable] = useState(true);
  const [imageWidth, setImageWidth] = useState(0);
  const [activeSlide, setActiveSlide] = useState(0);
  const images = [dummyData.coverImage, ...dummyData.gallery];

  return (
    <View style={styles.container}>
      <Stack.Screen options={{ headerShown: false }} />
      <Header showBack={true} />

      {/* Unified Sub-Header */}
      <View style={styles.subHeaderWrap}>
        <View style={styles.subHeader}>
          <Ionicons name="eye-outline" size={22} color={COLORS.primary} style={{ marginRight: 8 }} />
          <Text style={styles.subHeaderTitle}>Review Ad</Text>
        </View>
      </View>

      <ScrollView contentContainerStyle={styles.contentContainer}>
        <View style={styles.card}>
          {/* Cover Image */}
          <View style={styles.coverContainer} onLayout={({ nativeEvent }) => setImageWidth(nativeEvent.layout.width)}>
            <ScrollView
              horizontal
              pagingEnabled
              showsHorizontalScrollIndicator={false}
              scrollEventThrottle={16}
              onScroll={({ nativeEvent }) => {
                if (imageWidth > 0) {
                  const idx = Math.round(nativeEvent.contentOffset.x / imageWidth);
                  if (idx !== activeSlide) setActiveSlide(idx);
                }
              }}
            >
              {images.map((src, idx) => (
                <Image
                  key={idx}
                  source={typeof src === 'string' ? { uri: src } : src}
                  style={[styles.coverImage, { width: imageWidth || '100%' }]}
                  resizeMode="cover"
                />
              ))}
            </ScrollView>
            <View style={styles.topActions}>
              <TouchableOpacity style={styles.iconButton}>
                <Feather name="heart" size={18} color={COLORS.white} />
              </TouchableOpacity>
              <TouchableOpacity style={styles.iconButton}>
                <Feather name="share" size={18} color={COLORS.white} />
              </TouchableOpacity>
            </View>
            <View style={styles.dots}>
              {images.map((_, i) => (
                <View key={i} style={[styles.dot, activeSlide === i && styles.dotActive]} />)
              )}
            </View>
          </View>

          {/* Title */}
          <View style={styles.titleRow}>
            <View>
              <Text style={styles.carTitle}>{dummyData.title}</Text>
              <Text style={styles.carSubtitle}>{dummyData.subtitle}</Text>
            </View>
            <TouchableOpacity>
              <Text style={styles.editButtonText}>Edit</Text>
            </TouchableOpacity>
          </View>

          {/* Thumbnails */}
          <ScrollView horizontal nestedScrollEnabled showsHorizontalScrollIndicator={false} contentContainerStyle={styles.thumbRow}>
            {images.slice(1).map((src: string | number, idx: number) => (
              <Image
                key={idx}
                source={typeof src === 'string' ? { uri: src } : src}
                style={styles.thumb}
              />
            ))}
          </ScrollView>

          {/* Price Card */}
          <View style={styles.priceCard}>
            <View style={{ flex: 1 }}>
              <Text style={styles.priceLarge}>{dummyData.price}</Text>
              <View style={{ flexDirection: 'row', alignItems: 'center', marginTop: 4 }}>
                <TouchableOpacity
                  style={styles.negotiableToggle}
                  onPress={() => setNegotiable(v => !v)}
                  accessibilityRole="checkbox"
                  accessibilityState={{ checked: negotiable }}
                >
                  <Feather name={negotiable ? 'check-square' : 'square'} size={16} color={COLORS.primary} />
                  <Text style={styles.negotiableText}>Negotiable</Text>
                </TouchableOpacity>
              </View>
            </View>
            <TouchableOpacity style={styles.editCell}>
              <Text style={styles.editButtonText}>Edit</Text>
            </TouchableOpacity>
          </View>

          {/* Identity & Status */}
          <View style={styles.sectionBox}>
            <Text style={styles.sectionHeader}>Identity & Status</Text>
            <View style={styles.infoRow}>
              <View style={styles.leftRow}><Feather name="tag" size={16} color={COLORS.primary} /><Text style={styles.fieldLabel}>Brand:</Text></View>
              <Text style={styles.infoValue}>{dummyData.brand}</Text>
              <TouchableOpacity style={styles.editCell}><Text style={styles.editButtonText}>Edit</Text></TouchableOpacity>
            </View>
            <View style={styles.infoRow}>
              <View style={styles.leftRow}><Feather name="truck" size={16} color={COLORS.primary} /><Text style={styles.fieldLabel}>Model:</Text></View>
              <Text style={styles.infoValue}>{dummyData.model}</Text>
              <TouchableOpacity style={styles.editCell}><Text style={styles.editButtonText}>Edit</Text></TouchableOpacity>
            </View>
            <View style={styles.infoRow}>
              <View style={styles.leftRow}><Feather name="calendar" size={16} color={COLORS.primary} /><Text style={styles.fieldLabel}>Year:</Text></View>
              <Text style={styles.infoValue}>2025</Text>
              <TouchableOpacity style={styles.editCell}><Text style={styles.editButtonText}>Edit</Text></TouchableOpacity>
            </View>
            <View style={styles.infoRow}>
              <View style={styles.leftRow}><Feather name="check-circle" size={16} color={COLORS.primary} /><Text style={styles.fieldLabel}>Condition:</Text></View>
              <Text style={styles.infoValue}>Brand New</Text>
              <TouchableOpacity style={styles.editCell}><Text style={styles.editButtonText}>Edit</Text></TouchableOpacity>
            </View>
          </View>

          {/* Performance */}
          <View style={styles.sectionBox}>
            <Text style={styles.sectionHeader}>Performance</Text>
            <View style={styles.infoRow}>
              <View style={styles.leftRow}><Feather name="cpu" size={16} color={COLORS.primary} /><Text style={styles.fieldLabel}>Engine:</Text></View>
              <Text style={styles.infoValue}>{dummyData.engine}</Text>
              <TouchableOpacity style={styles.editCell}><Text style={styles.editButtonText}>Edit</Text></TouchableOpacity>
            </View>
            <View style={styles.infoRow}>
              <View style={styles.leftRow}><Feather name="droplet" size={16} color={COLORS.primary} /><Text style={styles.fieldLabel}>Fuel Type:</Text></View>
              <Text style={styles.infoValue}>{dummyData.fuelType}</Text>
              <TouchableOpacity style={styles.editCell}><Text style={styles.editButtonText}>Edit</Text></TouchableOpacity>
            </View>
            <View style={styles.infoRow}>
              <View style={styles.leftRow}><Feather name="navigation" size={16} color={COLORS.primary} /><Text style={styles.fieldLabel}>Mileage:</Text></View>
              <Text style={styles.infoValue}>{dummyData.mileage}</Text>
              <TouchableOpacity style={styles.editCell}><Text style={styles.editButtonText}>Edit</Text></TouchableOpacity>
            </View>
            <View style={styles.infoRow}>
              <View style={styles.leftRow}><Feather name="repeat" size={16} color={COLORS.primary} /><Text style={styles.fieldLabel}>Transmission:</Text></View>
              <Text style={styles.infoValue}>{dummyData.transmission}</Text>
              <TouchableOpacity style={styles.editCell}><Text style={styles.editButtonText}>Edit</Text></TouchableOpacity>
            </View>
          </View>

          {/* Description */}
          <View style={styles.section}>
            <View style={styles.infoRow}>
              <Text style={styles.sectionHeader}>Description</Text>
              <TouchableOpacity>
                <Text style={styles.editButtonText}>Edit</Text>
              </TouchableOpacity>
            </View>
            <Text style={styles.description}>
              {dummyData.description}
            </Text>
          </View>

          {/* Seller Info */}
          <View style={styles.section}>
            <View style={styles.infoRow}>
              <Text style={styles.sectionHeader}>Seller Information</Text>
              <TouchableOpacity>
                <Text style={styles.editButtonText}>Edit</Text>
              </TouchableOpacity>
            </View>
            <View style={styles.sellerRow}>
              <Image source={{ uri: "https://via.placeholder.com/40" }} style={styles.sellerImage} />
              <View>
                <Text style={styles.sellerName}>{dummyData.seller.name}</Text>
                <Text style={styles.sellerInfo}>Location: {dummyData.seller.location}</Text>
                <Text style={styles.sellerInfo}>Email: {dummyData.seller.email}</Text>
              </View>
            </View>
          </View>

          {/* Bottom Action Bar */}
          <View style={styles.bottomActions}>
            <TouchableOpacity style={styles.editAdBtn} onPress={() => router.back()}>
              <Feather name="edit" size={18} color={COLORS.primary} style={{ marginRight: 8 }} />
              <Text style={styles.editAdText}>Edit Ad</Text>
            </TouchableOpacity>

            <TouchableOpacity style={styles.paymentButton} onPress={() => router.push('/payments/payment')}>
              <Ionicons name="card-outline" size={20} color={COLORS.white} style={{ marginRight: 8 }} />
              <Text style={styles.paymentButtonText}>Proceed & Payment</Text>
            </TouchableOpacity>
          </View>
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: COLORS.background },
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
  contentContainer: { alignItems: 'center', paddingBottom: 40 },
  card: { backgroundColor: COLORS.white, borderRadius: 16, marginTop: 16, width: 340, padding: 16, borderWidth: 1, borderColor: COLORS.divider },
  coverContainer: { position: 'relative' },
  coverImage: { borderRadius: 12, width: '100%', height: 200 },
  topActions: { position: 'absolute', top: 8, right: 8, flexDirection: 'row', gap: 8 },
  iconButton: { backgroundColor: 'rgba(0,0,0,0.5)', borderRadius: 6, padding: 8 },
  dots: { position: 'absolute', bottom: 8, alignSelf: 'center', flexDirection: 'row', gap: 6 },
  dot: { width: 6, height: 6, borderRadius: 3, backgroundColor: 'rgba(255,255,255,0.5)' },
  dotActive: { backgroundColor: COLORS.white, width: 8, height: 8, borderRadius: 4 },
  titleRow: { marginTop: 8, flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  carTitle: { fontWeight: 'bold', fontSize: 18, color: COLORS.text.primary },
  carSubtitle: { color: COLORS.text.muted, fontSize: 12 },
  thumbRow: { flexDirection: 'row', alignItems: 'center', gap: 12, paddingRight: 8, marginTop: 12 },
  thumb: { width: 90, height: 68, borderRadius: 10, overflow: 'hidden' },
  priceCard: { marginTop: 16, flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', backgroundColor: COLORS.primaryLight, borderRadius: 8, padding: 12 },
  priceLarge: { color: COLORS.primary, fontWeight: 'bold', fontSize: 20 },
  negotiableToggle: { flexDirection: 'row', alignItems: 'center', gap: 6, marginLeft: 8, paddingVertical: 4, paddingHorizontal: 8, borderRadius: 8, backgroundColor: COLORS.white, borderWidth: 1, borderColor: COLORS.divider },
  negotiableText: { color: COLORS.primary, fontSize: 12, fontWeight: '600' },
  section: { marginTop: 12, backgroundColor: COLORS.primaryLight, borderRadius: 8, padding: 12, alignSelf: 'center', width: '100%' },
  sectionBox: { marginTop: 12, backgroundColor: '#F1F5FE', borderRadius: 12, padding: 12, borderWidth: 1, borderColor: COLORS.divider, alignSelf: 'center', width: '100%' },
  sectionHeader: { fontWeight: 'bold', color: COLORS.text.primary, marginBottom: 6 },
  infoRow: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginBottom: 4, minHeight: 30 },
  leftRow: { flexDirection: 'row', alignItems: 'center', gap: 8, flexShrink: 0, width: 150 },
  fieldLabel: { color: COLORS.text.secondary, fontWeight: '600' },
  infoValue: { flex: 1, fontWeight: '500', color: COLORS.text.primary, paddingRight: 8 },
  editCell: { width: 60, alignItems: 'flex-end', justifyContent: 'center' },
  editButtonText: { color: COLORS.primary, fontSize: 12, fontWeight: 'bold', textAlign: 'right' },
  description: { color: COLORS.text.secondary, fontSize: 14, marginTop: 4 },
  sellerRow: { flexDirection: 'row', alignItems: 'center', gap: 8 },
  sellerImage: { borderRadius: 20, width: 40, height: 40 },
  sellerName: { fontWeight: '500', color: COLORS.text.primary },
  sellerInfo: { color: COLORS.text.muted, fontSize: 12 },

  // Updated Bottom Actions Styles
  bottomActions: {
    marginTop: 20,
    flexDirection: 'row',
    gap: 12,
  },
  editAdBtn: {
    flex: 1,
    borderWidth: 1,
    borderColor: COLORS.primary,
    borderRadius: 8,
    paddingVertical: 12,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: COLORS.white,
  },
  editAdText: {
    color: COLORS.primary,
    fontWeight: 'bold',
    fontSize: 16,
  },
  paymentButton: {
    flex: 1.5,
    backgroundColor: COLORS.status.success,
    borderRadius: 8,
    paddingVertical: 12,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  paymentButtonText: {
    color: COLORS.white,
    fontWeight: 'bold',
    fontSize: 16
  },
});

