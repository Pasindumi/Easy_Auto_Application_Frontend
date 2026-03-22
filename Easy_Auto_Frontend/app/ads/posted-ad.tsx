import Header from "@/components/Header";
import COLORS from "@/constants/Colors";
import { dummyData } from "@/constants/dummydata/reviewadd";
import { Feather, Ionicons } from '@expo/vector-icons';
import { Stack } from 'expo-router';
import React, { useState } from 'react';
import { Alert, Image, Linking, ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';

export default function PostedAd() {
  const images: (string | number)[] = [dummyData.coverImage, ...dummyData.gallery];
  const [views, setViews] = useState<number>(dummyData.views || 0);
  const [activeIndex, setActiveIndex] = useState(0);
  const [coverWidth, setCoverWidth] = useState(0);

  const similarCars = [
    { title: 'Yaris Cross', price: 'Rs 12,500,000', image: images[1] },
    { title: 'Yaris Cross', price: 'Rs 18,500,000', image: images[2] },
  ];

  React.useEffect(() => { setViews(v => v + 1); }, []);

  const handleReport = () => {
    Alert.alert('Report this ad', 'Thanks for your feedback. Our team will review this ad.', [{ text: 'OK' }]);
  };
  const defaultPhone = '+94701234567';
  const contactSeller = () => {
    Linking.openURL(`tel:${defaultPhone}`).catch(() => Linking.openURL(`mailto:${dummyData.seller?.email || 'seller@example.com'}`));
  };
  const callSeller = () => Linking.openURL(`tel:${defaultPhone}`);
  const messageSeller = () => Linking.openURL(`sms:${defaultPhone}`);

  return (
    <View style={styles.container}>
      <Stack.Screen options={{ headerShown: false }} />
      <Header showBack={true} title="Ad Details" />

      <ScrollView contentContainerStyle={styles.contentContainer}>
        <View style={styles.card}>
          {/* Cover */}
          <View style={styles.cover} onLayout={(e) => setCoverWidth(e.nativeEvent.layout.width)}>
            {coverWidth > 0 ? (
              <ScrollView
                horizontal
                pagingEnabled
                showsHorizontalScrollIndicator={false}
                onMomentumScrollEnd={(ev) => {
                  const idx = Math.round(ev.nativeEvent.contentOffset.x / coverWidth);
                  setActiveIndex(idx);
                }}
              >
                {images.map((img, i) => (
                  <Image
                    key={i}
                    source={typeof img === 'string' ? { uri: img as string } : img}
                    style={[styles.coverImage, { width: coverWidth }]}
                    resizeMode="cover"
                  />
                ))}
              </ScrollView>
            ) : (
              <Image source={typeof images[0] === 'string' ? { uri: images[0] as string } : images[0]} style={styles.coverImage} />
            )}
            <View style={styles.topActions}>
              <TouchableOpacity style={styles.iconButton}><Feather name="heart" size={18} color={COLORS.white} /></TouchableOpacity>
              <TouchableOpacity style={styles.iconButton}><Feather name="share" size={18} color={COLORS.white} /></TouchableOpacity>
            </View>
            <View style={[styles.timeBadge, styles.postedPosition]}>
              <Feather name="clock" size={10} color={COLORS.text.muted} />
              <Text style={styles.timeText}>Posted on 28 Nov 02:17 PM</Text>
            </View>
            <View style={styles.dots}>
              {images.map((_, i) => (
                <View key={i} style={[styles.dot, i === activeIndex && styles.dotActive]} />
              ))}
            </View>
          </View>

          {/* Title */}
          <View style={styles.titleRow}>
            <View style={styles.titleCol}>
              <Text style={styles.title}>{dummyData.title}</Text>
              <Text style={styles.subtitle}>{dummyData.subtitle}</Text>
            </View>
          </View>

          {/* Thumbs */}
          <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.thumbRow}>
            {images.slice(1).map((src, idx) => (
              <Image
                key={idx}
                source={typeof src === 'string' ? { uri: src as string } : src}
                style={styles.thumb}
                resizeMode="cover"
              />
            ))}
          </ScrollView>

          {/* Price Card with badges */}
          <View style={styles.priceCard}>
            <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' }}>
              <Text style={styles.price}>{dummyData.price}</Text>
              <View style={{ flexDirection: 'row', alignItems: 'center', gap: 12 }}>
                <View style={styles.viewsBadgeRow}>
                  <Feather name="eye" size={12} color={COLORS.text.muted} />
                  <Text style={styles.viewsBadgeText}>{views.toLocaleString()} views</Text>
                </View>
              </View>
            </View>
            <View style={{ marginTop: 6, flexDirection: 'row' }}>
              <View style={styles.negotiableBadgeRow}>
                <Text style={styles.negotiableBadgeText}>Negotiable</Text>
              </View>
            </View>
          </View>

          {/* Identity & Status (stacked) */}
          <View style={styles.sectionBox}>
            <View style={styles.sectionHeaderRow}>
              <Text style={styles.sectionHeader}>Identity & Status</Text>
            </View>
            <View style={styles.infoRow}>
              <View style={styles.leftRow}>
                <View style={styles.iconChip}><Feather name="tag" size={14} color={COLORS.primary} /></View>
                <Text style={styles.fieldLabel}>Brand:</Text>
              </View>
              <Text style={styles.infoValue}>{dummyData.brand}</Text>
            </View>
            <View style={styles.infoRow}>
              <View style={styles.leftRow}>
                <View style={styles.iconChip}><Feather name="truck" size={14} color={COLORS.primary} /></View>
                <Text style={styles.fieldLabel}>Model:</Text>
              </View>
              <Text style={styles.infoValue}>{dummyData.model}</Text>
            </View>
            <View style={styles.infoRow}>
              <View style={styles.leftRow}>
                <View style={styles.iconChip}><Feather name="calendar" size={14} color={COLORS.primary} /></View>
                <Text style={styles.fieldLabel}>Year:</Text>
              </View>
              <Text style={styles.infoValue}>2025</Text>
            </View>
            <View style={styles.infoRow}>
              <View style={styles.leftRow}>
                <View style={styles.iconChip}><Feather name="check-circle" size={14} color={COLORS.primary} /></View>
                <Text style={styles.fieldLabel}>Condition:</Text>
              </View>
              <Text style={styles.infoValue}>Brand New</Text>
            </View>
          </View>

          {/* Performance (stacked) */}
          <View style={styles.sectionBox}>
            <View style={styles.sectionHeaderRow}>
              <Text style={styles.sectionHeader}>Performance</Text>
            </View>
            <View style={styles.infoRow}>
              <View style={styles.leftRow}>
                <View style={styles.iconChip}><Feather name="cpu" size={14} color={COLORS.primary} /></View>
                <Text style={styles.fieldLabel}>Engine:</Text>
              </View>
              <Text style={styles.infoValue}>{dummyData.engine}</Text>
            </View>
            <View style={styles.infoRow}>
              <View style={styles.leftRow}>
                <View style={styles.iconChip}><Feather name="droplet" size={14} color={COLORS.primary} /></View>
                <Text style={styles.fieldLabel}>Fuel Type:</Text>
              </View>
              <Text style={styles.infoValue}>{dummyData.fuelType}</Text>
            </View>
            <View style={styles.infoRow}>
              <View style={styles.leftRow}>
                <View style={styles.iconChip}><Feather name="navigation" size={14} color={COLORS.primary} /></View>
                <Text style={styles.fieldLabel}>Mileage:</Text>
              </View>
              <Text style={styles.infoValue}>{dummyData.mileage}</Text>
            </View>
            <View style={styles.infoRow}>
              <View style={styles.leftRow}>
                <View style={styles.iconChip}><Feather name="repeat" size={14} color={COLORS.primary} /></View>
                <Text style={styles.fieldLabel}>Transmission:</Text>
              </View>
              <Text style={styles.infoValue}>{dummyData.transmission}</Text>
            </View>
          </View>

          {/* Description with icon row */}
          <View style={styles.section}>
            <Text style={styles.sectionHeader}>Description</Text>
            <Text style={styles.description}>{dummyData.description}</Text>
          </View>

          {/* Seller Information card */}
          <View style={styles.section}>
            <Text style={styles.sectionHeader}>Seller Information</Text>
            <View style={styles.sellerRow}>
              <Image source={{ uri: 'https://via.placeholder.com/40' }} style={styles.sellerImage} />
              <View>
                <Text style={styles.sellerName}>{dummyData.seller.name}</Text>
                <Text style={styles.sellerInfo}>Location: {dummyData.seller.location}</Text>
                <Text style={styles.sellerInfo}>Email: {dummyData.seller.email}</Text>
              </View>
            </View>
          </View>

          {/* Report this ad - outside seller section */}
          <TouchableOpacity style={styles.reportBtn} onPress={handleReport}>
            <Feather name="alert-triangle" size={16} color={COLORS.status.danger} />
            <Text style={styles.reportText}>Report this ad</Text>
          </TouchableOpacity>
        </View>

        {/* Similar Cars - outside main card but inside scroll */}
        <View style={{ width: 340, alignSelf: 'center', marginTop: 12 }}>
          <View style={styles.section}>
            <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
              <Text style={styles.sectionHeader}>Cars Similar to Toyota Yaris Cross</Text>
              <TouchableOpacity><Text style={{ color: COLORS.primary, fontWeight: '600' }}>View All</Text></TouchableOpacity>
            </View>
            {/* Horizontal carousel */}
            <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.simList}>
              {similarCars.map((c, i) => (
                <View key={i} style={styles.simCard}>
                  <View style={{ position: 'relative' }}>
                    <Image source={typeof c.image === 'string' ? { uri: c.image as string } : c.image} style={styles.simImage} />
                    <TouchableOpacity style={styles.simHeart}>
                      <Feather name="heart" size={14} color={COLORS.white} />
                    </TouchableOpacity>
                  </View>
                  <Text style={styles.simTitle} numberOfLines={2}>{c.title}</Text>
                  <Text style={styles.simPrice}>{c.price}</Text>
                </View>
              ))}
            </ScrollView>
          </View>
        </View>
      </ScrollView>

      {/* Contact Seller Footer */}
      <View style={styles.footer}>
        <TouchableOpacity style={styles.contactBtn} onPress={contactSeller}>
          <Text style={styles.contactText}>Contact Seller</Text>
        </TouchableOpacity>
        <View style={{ flexDirection: 'row', gap: 12 }}>
          <TouchableOpacity style={styles.circleBtn} onPress={callSeller}><Feather name="phone" color={COLORS.primary} size={18} /></TouchableOpacity>
          <TouchableOpacity style={styles.circleBtn} onPress={messageSeller}><Feather name="message-circle" color={COLORS.primary} size={18} /></TouchableOpacity>
        </View>
      </View>
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
  contentContainer: { alignItems: 'center', paddingBottom: 88 },
  card: { backgroundColor: COLORS.white, borderRadius: 16, marginTop: 12, width: 340, padding: 12, borderWidth: 1, borderColor: COLORS.divider },
  cover: { position: 'relative', borderRadius: 12, overflow: 'hidden' },
  coverImage: { borderRadius: 12, width: '100%', height: 200 },
  topActions: { position: 'absolute', top: 12, right: 12, flexDirection: 'row', gap: 10 },
  iconButton: { backgroundColor: 'rgba(0,0,0,0.5)', borderRadius: 16, padding: 8 },
  titleRow: { marginTop: 10, flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-start' },
  title: { fontWeight: '800', fontSize: 16, color: COLORS.text.primary },
  subtitle: { color: COLORS.text.muted, fontSize: 11, marginTop: 2 },
  timeBadge: { flexDirection: 'row', alignItems: 'center', gap: 4, backgroundColor: '#F3F4F6', borderWidth: 1, borderColor: '#E5E7EB', paddingVertical: 2, paddingHorizontal: 6, borderRadius: 9999 },
  timeText: { color: COLORS.text.muted, fontSize: 10, fontWeight: '500' },
  postedPosition: { position: 'absolute', right: 8, bottom: 8 },
  dots: { position: 'absolute', bottom: 8, left: 0, right: 0, flexDirection: 'row', justifyContent: 'center', alignItems: 'center', gap: 6 },
  dot: { width: 6, height: 6, borderRadius: 3, backgroundColor: '#D1D5DB' },
  dotActive: { width: 16, backgroundColor: '#6B7280' },
  titleCol: { flex: 1 },
  thumbRow: { flexDirection: 'row', justifyContent: 'flex-start', alignItems: 'center', gap: 12, marginTop: 12 },
  thumb: { width: 96, height: 64, borderRadius: 10, backgroundColor: COLORS.white, borderWidth: 1, borderColor: COLORS.divider },
  priceCard: { marginTop: 12, backgroundColor: COLORS.primaryLight, borderRadius: 14, paddingVertical: 16, paddingHorizontal: 16, borderWidth: 1, borderColor: '#D8E4FF', minHeight: 88 },
  price: { color: COLORS.primary, fontWeight: '800', fontSize: 18 },
  viewsBadgeRow: { flexDirection: 'row', alignItems: 'center', gap: 6, backgroundColor: COLORS.white, paddingVertical: 4, paddingHorizontal: 8, borderRadius: 16, borderWidth: 1, borderColor: COLORS.divider },
  viewsBadgeText: { color: COLORS.text.muted, fontSize: 11, fontWeight: '500' },
  negotiableBadgeRow: { flexDirection: 'row', alignItems: 'center', gap: 4, backgroundColor: '#EEF2FF', paddingVertical: 3, paddingHorizontal: 8, borderRadius: 14, borderWidth: 1, borderColor: '#BFDBFE' },
  negotiableBadgeText: { color: COLORS.primary, fontSize: 11, fontWeight: '600' },
  section: { marginTop: 12, backgroundColor: COLORS.primaryLight, borderRadius: 12, padding: 12 },
  sectionBox: { marginTop: 12, backgroundColor: '#F1F5FE', borderRadius: 14, padding: 12, borderWidth: 1, borderColor: '#D8E4FF' },
  sectionHeader: { fontWeight: '700', color: COLORS.text.primary, fontSize: 14 },
  sectionHeaderRow: { flexDirection: 'row', alignItems: 'center', gap: 8, marginBottom: 8 },
  infoRow: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingVertical: 10, borderBottomWidth: 1, borderColor: COLORS.divider, minHeight: 40 },
  leftRow: { flexDirection: 'row', alignItems: 'center', gap: 10, flexShrink: 0, width: 160 },
  iconChip: { width: 22, height: 22, borderRadius: 11, backgroundColor: COLORS.primaryLight, alignItems: 'center', justifyContent: 'center' },
  fieldLabel: { color: COLORS.text.secondary, fontWeight: '600' },
  infoValue: { flex: 1, fontWeight: '600', paddingLeft: 8, textAlign: 'right', color: COLORS.text.primary },
  description: { color: COLORS.text.secondary, fontSize: 13 },
  sellerRow: { flexDirection: 'row', alignItems: 'center', gap: 8 },
  sellerImage: { borderRadius: 20, width: 40, height: 40 },
  sellerName: { fontWeight: '600', color: COLORS.text.primary },
  sellerInfo: { color: COLORS.text.muted, fontSize: 12 },
  reportBtn: { marginTop: 12, flexDirection: 'row', alignItems: 'center', gap: 8, backgroundColor: '#FEE2E2', borderRadius: 8, paddingVertical: 10, justifyContent: 'center' },
  reportText: { color: COLORS.status.danger, fontWeight: '600' },
  simList: { flexDirection: 'row', gap: 12, paddingTop: 8, paddingRight: 4 },
  simCard: { width: 164, borderRadius: 12, backgroundColor: COLORS.white, padding: 8, borderWidth: 1, borderColor: COLORS.divider, elevation: 1 },
  simImage: { width: '100%', height: 110, borderRadius: 10 },
  simHeart: { position: 'absolute', top: 8, right: 8, backgroundColor: 'rgba(0,0,0,0.45)', borderRadius: 12, padding: 6 },
  simTitle: { fontWeight: '700', fontSize: 13, marginTop: 8, color: COLORS.text.primary },
  simPrice: { color: COLORS.text.muted, fontSize: 12, marginTop: 2, fontWeight: '600' },
  footer: { position: 'absolute', left: 0, right: 0, bottom: 0, backgroundColor: COLORS.white, padding: 12, flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', borderTopWidth: 1, borderColor: COLORS.divider },
  contactBtn: { backgroundColor: COLORS.primary, borderRadius: 10, paddingHorizontal: 20, paddingVertical: 12 },
  contactText: { color: COLORS.white, fontWeight: 'bold' },
  circleBtn: { width: 40, height: 40, borderRadius: 20, backgroundColor: COLORS.primaryLight, alignItems: 'center', justifyContent: 'center', borderWidth: 1, borderColor: '#BFDBFE' },
});
