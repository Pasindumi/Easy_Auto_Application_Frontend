import COLORS from "@/constants/Colors";
import { Ionicons, MaterialCommunityIcons, FontAwesome5 } from '@expo/vector-icons';
import { Stack, useLocalSearchParams, useRouter } from 'expo-router';
import React, { useEffect, useState } from 'react';
import {
    ActivityIndicator,
    Alert,
    Dimensions,
    Image,
    Linking,
    ScrollView,
    Share,
    StyleSheet,
    Text,
    TouchableOpacity,
    View,
    Modal,
    Platform,
    StatusBar,
    ImageBackground,
    SafeAreaView
} from 'react-native';
import ReportModal from '@/components/ui/ReportModal';
import { api } from '@/utils/api';
import ReviewList from '@/components/reviews/ReviewList';
import ReviewForm from '@/components/reviews/ReviewForm';
import { useAuth } from '@/contexts/AuthContext';
import { LinearGradient } from 'expo-linear-gradient';

const { width } = Dimensions.get('window');
const STATUSBAR_HEIGHT = Platform.OS === 'ios' ? 40 : StatusBar.currentHeight || 0;

export default function AdDetailsScreen() {
    const router = useRouter();
    const { user } = useAuth();
    const { id } = useLocalSearchParams();
    const [ad, setAd] = useState<any>(null);
    const [loading, setLoading] = useState(true);
    const [mainImage, setMainImage] = useState<string | null>(null);
    const [showReportModal, setShowReportModal] = useState(false);
    const [isFavorite, setIsFavorite] = useState(false);
    const [favoriteLoading, setFavoriteLoading] = useState(false);
    const [reviews, setReviews] = useState<any[]>([]);
    const [reviewStats, setReviewStats] = useState({ averageRating: 0, totalReviews: 0 });
    const [showReviewForm, setShowReviewForm] = useState(false);
    const [reviewsLoading, setReviewsLoading] = useState(false);
    const [showContactModal, setShowContactModal] = useState(false);
    const [sendingChat, setSendingChat] = useState(false);

    useEffect(() => {
        if (!id) return;
        fetchAdDetails();
        checkFavoriteStatus();
        fetchReviews();
        fetchReviewStats();
    }, [id]);

    const fetchAdDetails = async () => {
        try {
            const response = await api.get<{ success: boolean; data: any }>(`/api/cars/${id}`);
            if (response.success) {
                setAd(response.data);
                if (response.data.AdImage && response.data.AdImage.length > 0) {
                    setMainImage(response.data.AdImage[0].image_url);
                }
            } else {
                Alert.alert("Error", "Failed to load ad details.");
                router.back();
            }
        } catch (error) {
            console.error(error);
            Alert.alert("Error", "Network error.");
        } finally {
            setLoading(false);
        }
    };

    const checkFavoriteStatus = async () => {
        try {
            const response = await api.get<{ success: boolean; isFavorite: boolean }>(`/api/favorites/check/${id}`);
            if (response.success) {
                setIsFavorite(response.isFavorite);
            }
        } catch (error) {
            console.error("Error checking favorite status:", error);
        }
    };

    const fetchReviews = async () => {
        setReviewsLoading(true);
        try {
            const response = await api.get<{ success: boolean; data: any[] }>(`/api/reviews/${id}`);
            if (response.success) {
                setReviews(response.data);
            }
        } catch (error) {
            console.error("Error fetching reviews:", error);
        } finally {
            setReviewsLoading(false);
        }
    };

    const fetchReviewStats = async () => {
        try {
            const response = await api.get<{ success: boolean; data: { averageRating: number; totalReviews: number } }>(`/api/reviews/stats/${id}`);
            if (response.success) {
                setReviewStats(response.data);
            }
        } catch (error) {
            console.error("Error fetching review stats:", error);
        }
    };

    const handleReviewSuccess = () => {
        setShowReviewForm(false);
        fetchReviews();
        fetchReviewStats();
    };

    const handleChatWithSeller = async () => {
        if (!ad?.users?.id) {
            Alert.alert("Error", "Seller information not available.");
            return;
        }

        if (user?.id === ad.users.id) {
            Alert.alert("Info", "This is your own ad. You cannot chat with yourself.");
            return;
        }

        setSendingChat(true);
        try {
            const response = await api.post<{ success: boolean; data: { id: string } }>(
                '/api/chat/conversations',
                { participantId: ad.users.id }
            );

            if (response.success) {
                router.push({
                    pathname: `/chat/${response.data.id}` as any,
                    params: {
                        adId: id as string,
                        adTitle: ad.title,
                        adImage: ad.AdImage && ad.AdImage.length > 0 ? ad.AdImage[0].image_url : null
                    }
                });
            }
        } catch (error: any) {
            console.error('Start Chat Error:', error);
            if (error.status === 401) {
                Alert.alert("Auth Required", "Please login to chat with the seller.");
            } else {
                Alert.alert("Error", "Failed to start chat. Please try again.");
            }
        } finally {
            setSendingChat(false);
        }
    };

    const handleContactSeller = () => {
        setShowContactModal(true);
    };


    const handleReportSubmit = async (reason: string) => {
        try {
            const response = await api.post<{ success: boolean; message: string }>('/api/reports', {
                ad_id: id,
                reason: reason
            });
            if (response.success) {
                Alert.alert("Success", "Thank you for your report. We will review it shortly.");
            } else {
                Alert.alert("Error", response.message || "Failed to submit report.");
            }
        } catch (error: any) {
            console.error(error);
            if (error.status === 401) {
                Alert.alert("Auth Required", "Please login to report this ad.");
            } else {
                Alert.alert("Error", "Something went wrong. Please try again.");
            }
        }
    };

    const handleToggleFavorite = async () => {
        setFavoriteLoading(true);
        try {
            const response = await api.post<{ success: boolean; isFavorite: boolean; message: string }>('/api/favorites/toggle', {
                ad_id: id
            });
            if (response.success) {
                setIsFavorite(response.isFavorite);
            }
        } catch (error: any) {
            console.error("Toggle favorite error:", error);
            if (error.status === 401) {
                Alert.alert("Login Required", "Please login to save this ad to your wishlist.");
            } else {
                Alert.alert("Error", "Could not update wishlist. Please try again.");
            }
        } finally {
            setFavoriteLoading(false);
        }
    };

    if (loading) {
        return (
            <View style={styles.loadingContainer}>
                <Stack.Screen options={{ headerShown: false }} />
                <ActivityIndicator size="large" color={COLORS.primary} />
            </View>
        );
    }

    if (!ad) return null;

    const images = ad.AdImage || [];
    const details = Array.isArray(ad.CarDetails) ? ad.CarDetails[0] : (ad.CarDetails || {});
    // Format price properly
    const amount = Number(ad.price) || 0;
    const formattedPrice = new Intl.NumberFormat('en-LK', {
        style: 'currency',
        currency: 'LKR',
        maximumFractionDigits: 0
    }).format(amount);

    const shareUrl = `https://easyauto.lk/cars/${id}`; // Placeholder domain
    const shareMessage = `Check out this ${ad?.title} on Easy Auto! ${formattedPrice}\n\n${shareUrl}`;

    const handleWhatsAppShare = () => {
        const url = `whatsapp://send?text=${encodeURIComponent(shareMessage)}`;
        Linking.canOpenURL(url).then(supported => {
            if (supported) {
                Linking.openURL(url);
            } else {
                Linking.openURL(`https://wa.me/?text=${encodeURIComponent(shareMessage)}`);
            }
        });
    };

    const handleFacebookShare = () => {
        const url = `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(shareUrl)}`;
        Linking.openURL(url);
    };

    const handleNativeShare = async () => {
        try {
            await Share.share({
                message: shareMessage,
                url: shareUrl, // iOS only
                title: ad?.title
            });
        } catch (error: any) {
            Alert.alert(error.message);
        }
    };

    return (
        <View style={styles.safe}>
            <Stack.Screen options={{ headerShown: false }} />

            <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>

                {/* HERO IMAGE SECTION */}
                <View style={styles.heroSection}>
                    <ImageBackground
                        source={mainImage ? { uri: mainImage } : require('@/assets/images/car.jpg')}
                        style={styles.heroImage}
                        imageStyle={{ borderBottomLeftRadius: 30, borderBottomRightRadius: 30 }}
                    >
                        {/* Watermark */}
                        {/* Watermark Pattern */}
                        <View style={styles.watermarkContainer}>
                            {Array.from({ length: 12 }).map((_, index) => (
                                <View key={index} style={styles.watermarkTile}>
                                    <Image
                                        source={require('../../assets/images/logo.png')}
                                        style={styles.watermarkImage}
                                        resizeMode="contain"
                                    />
                                </View>
                            ))}
                        </View>

                        <LinearGradient
                            colors={['rgba(0,0,0,0.4)', 'transparent', 'rgba(0,0,0,0.6)']}
                            style={styles.imageOverlay}
                        >
                            {/* Back Button Overlay */}
                            <SafeAreaView style={styles.topActions}>
                                <TouchableOpacity
                                    style={styles.backBtn}
                                    onPress={() => router.back()}
                                >
                                    <Ionicons name="arrow-back" size={24} color="white" />
                                </TouchableOpacity>
                            </SafeAreaView>

                            <View style={styles.heroBottomRow}>
                                <View style={styles.imageCountBadge}>
                                    <Ionicons name="images-outline" size={14} color="white" />
                                    <Text style={styles.imageCountText}>{images.length} Photos</Text>
                                </View>
                            </View>
                        </LinearGradient>
                    </ImageBackground>
                </View>

                {/* THUMBNAILS SCROLL */}
                {images.length > 1 && (
                    <View style={styles.thumbnailWrapper}>
                        <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.thumbnailList}>
                            {images.map((img: any, index: number) => (
                                <TouchableOpacity
                                    key={index}
                                    onPress={() => setMainImage(img.image_url)}
                                    style={[
                                        styles.thumbnailContainer,
                                        mainImage === img.image_url && styles.activeThumbnail
                                    ]}
                                >
                                    <Image source={{ uri: img.image_url }} style={styles.thumbnailImage} />
                                </TouchableOpacity>
                            ))}
                        </ScrollView>
                    </View>
                )}

                {/* MAIN INFO CARD */}
                <View style={styles.mainContent}>
                    <View style={styles.titleRow}>
                        <View style={{ flex: 1 }}>
                            <Text style={styles.adTitle}>{ad.title}</Text>
                            {ad.negotiable && (
                                <View style={styles.negotiableBadge}>
                                    <Text style={styles.negotiableText}>Negotiable</Text>
                                </View>
                            )}
                        </View>

                        <TouchableOpacity
                            style={styles.favoriteBtn}
                            onPress={handleToggleFavorite}
                            disabled={favoriteLoading}
                        >
                            <Ionicons
                                name={isFavorite ? "heart" : "heart-outline"}
                                size={22}
                                color={isFavorite ? "#EF4444" : COLORS.primary}
                            />
                        </TouchableOpacity>
                    </View>

                    <Text style={styles.priceText}>{formattedPrice}</Text>

                    <View style={styles.locationContainer}>
                        <Ionicons name="location-outline" size={16} color={COLORS.text.muted} />
                        <Text style={styles.locationText}>{ad.location}</Text>
                        <Text style={styles.dotSeparator}>•</Text>
                        <Text style={styles.postedTime}>{ad.created_at ? new Date(ad.created_at).toLocaleDateString() : 'Recently'}</Text>
                    </View>

                    <View style={styles.divider} />

                    {/* KEY SPECS GRID - Showing ALL fields even if empty */}
                    {(() => {
                        const specs = [
                            { label: "Year", value: details.year, icon: "calendar-outline", lib: Ionicons },
                            { label: "Mileage", value: (details.mileage) ? `${Number(details.mileage).toLocaleString()} km` : null, icon: "speedometer-outline", lib: Ionicons },
                            { label: "Brand", value: details.brand, icon: "car-sport-outline", lib: Ionicons },
                            { label: "Model", value: details.model, icon: "car-sport", lib: Ionicons },
                            { label: "Condition", value: details.condition, icon: "ribbon-outline", lib: Ionicons },
                            { label: "Fuel Type", value: details.fuel_type, icon: "gas-pump", lib: FontAwesome5 },
                            { label: "Transmission", value: details.transmission, icon: "cog-outline", lib: Ionicons },
                            { label: "Engine", value: details.engine_capacity ? `${details.engine_capacity} CC` : null, icon: "hardware-chip-outline", lib: Ionicons },
                            { label: "Body", value: details.body_type, icon: "car-outline", lib: Ionicons },
                        ];

                        return (
                            <View style={styles.specsContainer}>
                                {specs.map((spec, index) => {
                                    const IconLib = spec.lib;
                                    const displayValue = (spec.value && spec.value !== 'undefined' && spec.value !== 'null') ? spec.value : 'Not Specified';

                                    return (
                                        <View key={index} style={styles.specItem}>
                                            <View style={styles.specIconBox}>
                                                <IconLib name={spec.icon as any} size={20} color={COLORS.primary} />
                                            </View>
                                            <View style={styles.specContent}>
                                                <Text style={styles.specLabel}>{spec.label}</Text>
                                                <Text style={styles.specValue} numberOfLines={1}>{displayValue}</Text>
                                            </View>
                                        </View>
                                    );
                                })}
                            </View>
                        );
                    })()}

                    <View style={styles.divider} />

                    {/* FEATURES - Tag Cloud Style */}
                    {(() => {
                        const activeAttrs = (ad.attributes || []).filter((attr: any) =>
                            attr.value && attr.value !== 'undefined' && attr.value !== 'null' && attr.value !== '' && attr.value !== 'false'
                        );

                        if (activeAttrs.length === 0) return null;

                        return (
                            <View style={styles.sectionContainer}>
                                <Text style={styles.sectionHeader}>Features</Text>
                                <View style={styles.featuresCloud}>
                                    {activeAttrs.map((attr: any, index: number) => (
                                        <View key={index} style={styles.featureChip}>
                                            <Ionicons name="checkmark-circle" size={16} color={COLORS.primary} />
                                            <Text style={styles.featureText}>
                                                {attr.value === 'true' ? attr.attribute?.attribute_name : `${attr.attribute?.attribute_name}: ${attr.value}`}
                                            </Text>
                                        </View>
                                    ))}
                                </View>
                            </View>
                        );
                    })()}

                    {/* DESCRIPTION */}
                    <View style={styles.sectionContainer}>
                        <Text style={styles.sectionHeader}>Description</Text>
                        <Text style={styles.descriptionText}>{ad.description || "No description provided."}</Text>
                    </View>

                    {/* SOCIAL SHARE SECTION - Moved Here */}
                    <View style={styles.shareContainer}>
                        <Text style={styles.shareTitle}>Share this Vehicle</Text>
                        <View style={styles.shareRow}>
                            <TouchableOpacity style={styles.shareCircle} onPress={handleWhatsAppShare}>
                                <Ionicons name="logo-whatsapp" size={20} color={COLORS.primary} />
                            </TouchableOpacity>
                            <TouchableOpacity style={styles.shareCircle} onPress={handleFacebookShare}>
                                <Ionicons name="logo-facebook" size={20} color={COLORS.primary} />
                            </TouchableOpacity>
                            <TouchableOpacity style={styles.shareCircle} onPress={handleNativeShare}>
                                <Ionicons name="logo-instagram" size={20} color={COLORS.primary} />
                            </TouchableOpacity>
                            <TouchableOpacity style={styles.shareCircle} onPress={handleNativeShare}>
                                <Ionicons name="share-social-outline" size={20} color={COLORS.primary} />
                            </TouchableOpacity>
                        </View>
                    </View>

                    <View style={styles.sellerSection}>
                        <View style={styles.sellerRow}>
                            <View style={styles.sellerAvatar}>
                                <Text style={styles.sellerInitial}>{ad.users?.name?.charAt(0) || 'U'}</Text>
                            </View>
                            <View style={styles.sellerText}>
                                <View style={styles.sellerNameRow}>
                                    <Text style={styles.sellerName} numberOfLines={1}>{ad.users?.name || "Private Seller"}</Text>
                                    <View style={styles.verifiedBadge}>
                                        <Ionicons name="checkmark-circle" size={10} color="white" />
                                        <Text style={styles.verifiedText}>Verified</Text>
                                    </View>
                                </View>
                                <Text style={styles.sellerSubtitle} numberOfLines={1}>Member since 2024 • Very Responsive</Text>
                            </View>
                            <TouchableOpacity style={styles.viewProfileBtn}>
                                <Text style={styles.viewProfileText}>View Profile</Text>
                                <Ionicons name="chevron-forward" size={14} color={COLORS.primary} />
                            </TouchableOpacity>
                        </View>
                    </View>

                    {/* REVIEWS PREVIEW */}
                    <View style={styles.sectionContainer}>
                        <View style={styles.reviewHeaderRow}>
                            <Text style={styles.sectionHeader}>Reviews</Text>
                            <View style={styles.ratingPill}>
                                <Ionicons name="star" size={14} color="#F59E0B" />
                                <Text style={styles.ratingPillText}>{reviewStats.averageRating} ({reviewStats.totalReviews})</Text>
                            </View>
                        </View>

                        {!showReviewForm && (
                            <TouchableOpacity style={styles.addReviewBtn} onPress={() => setShowReviewForm(true)}>
                                <Text style={styles.addReviewText}>Write a Review</Text>
                            </TouchableOpacity>
                        )}

                        {showReviewForm && (
                            <View style={styles.formContainer}>
                                <ReviewForm adId={id as string} onSuccess={handleReviewSuccess} />
                                <TouchableOpacity onPress={() => setShowReviewForm(false)} style={styles.cancelBtn}>
                                    <Text style={styles.cancelText}>Cancel</Text>
                                </TouchableOpacity>
                            </View>
                        )}

                        <ReviewList reviews={reviews.slice(0, 2)} loading={reviewsLoading} />
                        {reviews.length > 2 && (
                            <TouchableOpacity style={styles.seeAllReviews}>
                                <Text style={styles.seeAllText}>See All Reviews</Text>
                            </TouchableOpacity>
                        )}
                    </View>

                    {/* REPORT BUTTON */}
                    <TouchableOpacity style={styles.reportBtn} onPress={() => setShowReportModal(true)}>
                        <Ionicons name="flag-outline" size={16} color={COLORS.text.muted} />
                        <Text style={styles.reportBtnText}>Report this Ad</Text>
                    </TouchableOpacity>

                </View>

                {/* Bottom Padding for Sticky Footer */}
                <View style={{ height: 100 }} />
            </ScrollView>

            {/* STICKY FOOTER ACTION BUTTONS */}
            <View style={styles.footerContainer}>
                <TouchableOpacity style={styles.contactBtn} onPress={handleContactSeller}>
                    <Ionicons name="call" size={20} color={COLORS.primary} />
                    <Text style={styles.contactBtnText}>Call Seller</Text>
                </TouchableOpacity>

                <TouchableOpacity
                    style={[styles.chatBtn, sendingChat && styles.disabledBtn]}
                    onPress={handleChatWithSeller}
                    disabled={sendingChat}
                >
                    {sendingChat ? (
                        <ActivityIndicator size="small" color="white" />
                    ) : (
                        <>
                            <Ionicons name="chatbubble-ellipses-outline" size={22} color="white" />
                            <Text style={styles.chatBtnText}>Chat Now</Text>
                        </>
                    )}
                </TouchableOpacity>
            </View>

            <ReportModal
                visible={showReportModal}
                onClose={() => setShowReportModal(false)}
                onSubmit={handleReportSubmit}
            />

            {/* CONTACT DETAILS MODAL */}
            <Modal
                visible={showContactModal}
                transparent={true}
                animationType="slide"
                onRequestClose={() => setShowContactModal(false)}
            >
                <TouchableOpacity
                    style={styles.modalOverlay}
                    activeOpacity={1}
                    onPress={() => setShowContactModal(false)}
                >
                    <View style={styles.modalContent}>
                        <View style={styles.modalDragBar} />
                        <Text style={styles.modalTitle}>Contact Seller</Text>

                        <View style={styles.contactCard}>
                            <View style={styles.modalSellerInfo}>
                                <View style={[styles.sellerAvatar, { width: 60, height: 60, borderRadius: 30 }]}>
                                    <Text style={[styles.sellerInitial, { fontSize: 24 }]}>{ad.users?.name?.charAt(0) || 'U'}</Text>
                                </View>
                                <Text style={[styles.sellerName, { marginTop: 10 }]}>{ad.users?.name || "Private Seller"}</Text>
                            </View>

                            <View style={styles.contactOptions}>
                                {/* Phone */}
                                {ad?.users?.phone ? (
                                    <TouchableOpacity style={styles.contactOption} onPress={() => Linking.openURL(`tel:${ad.users.phone}`)}>
                                        <View style={[styles.optionIcon, { backgroundColor: '#E0F2FE' }]}>
                                            <Ionicons name="call" size={24} color="#0284C7" />
                                        </View>
                                        <Text style={styles.optionLabel}>{ad.users.phone}</Text>
                                        <Text style={styles.optionSubLabel}>Tap to Call</Text>
                                    </TouchableOpacity>
                                ) : (
                                    <View style={styles.contactOption}>
                                        <View style={[styles.optionIcon, { backgroundColor: '#F1F5F9' }]}>
                                            <Ionicons name="call-outline" size={24} color="#94A3B8" />
                                        </View>
                                        <Text style={[styles.optionLabel, { color: '#94A3B8' }]}>Not Available</Text>
                                    </View>
                                )}

                                {/* Email */}
                                {ad?.users?.email ? (
                                    <TouchableOpacity style={styles.contactOption} onPress={() => Linking.openURL(`mailto:${ad.users.email}`)}>
                                        <View style={[styles.optionIcon, { backgroundColor: '#DCFCE7' }]}>
                                            <Ionicons name="mail" size={24} color="#16A34A" />
                                        </View>
                                        <Text style={styles.optionLabel}>Send Email</Text>
                                        <Text style={styles.optionSubLabel}>Response in ~2 hrs</Text>
                                    </TouchableOpacity>
                                ) : null}
                            </View>
                        </View>

                        <TouchableOpacity style={styles.closeBtn} onPress={() => setShowContactModal(false)}>
                            <Text style={styles.closeBtnText}>Close</Text>
                        </TouchableOpacity>
                    </View>
                </TouchableOpacity>
            </Modal>
        </View>
    );
}

const styles = StyleSheet.create({
    safe: {
        flex: 1,
        backgroundColor: COLORS.background,
    },
    loadingContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: COLORS.background,
    },
    scrollContent: {
        paddingBottom: 40,
    },
    heroSection: {
        height: 260, // Reduced from 320 for a more compact view
        width: '100%',
        backgroundColor: '#eee',
        borderBottomLeftRadius: 30,
        borderBottomRightRadius: 30,
        overflow: 'hidden',
        elevation: 5,
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.1,
        shadowRadius: 10,
    },
    heroImage: {
        width: '100%',
        height: '100%',
    },
    watermarkContainer: {
        ...StyleSheet.absoluteFillObject,
        flexDirection: 'row',
        flexWrap: 'wrap',
        justifyContent: 'space-around',
        alignItems: 'center',
        zIndex: 5,
        opacity: 0.35, // Balanced opacity for visibility
        overflow: 'hidden',
        pointerEvents: 'none',
    },
    watermarkTile: {
        width: width / 3,
        height: 100,
        justifyContent: 'center',
        alignItems: 'center',
        marginVertical: 10,
    },
    watermarkImage: {
        width: 85,
        height: 85,
        tintColor: 'white', // Color updated to white
        opacity: 0.8, // High contrast image opacity
    },
    imageOverlay: {
        ...StyleSheet.absoluteFillObject,
        justifyContent: 'space-between',
        padding: 20,
        paddingTop: 10, // Adjusted as we use SafeAreaView for top actions
        zIndex: 2,
    },
    topActions: {
        flexDirection: 'row',
        justifyContent: 'flex-start', // Back button on left
        marginTop: Platform.OS === 'android' ? StatusBar.currentHeight : 0,
    },
    backBtn: {
        width: 40,
        height: 40,
        borderRadius: 20,
        backgroundColor: 'rgba(0,0,0,0.3)',
        justifyContent: 'center',
        alignItems: 'center',
        marginTop: 10,
    },
    heroBottomRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'flex-end',
        marginBottom: 10,
    },
    imageCountBadge: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: 'rgba(0,0,0,0.6)',
        paddingHorizontal: 12,
        paddingVertical: 6,
        borderRadius: 20,
        gap: 6,
    },
    imageCountText: {
        color: 'white',
        fontWeight: '600',
        fontSize: 12,
    },
    favoriteBtn: {
        width: 44,
        height: 44,
        borderRadius: 22,
        backgroundColor: '#F3F4F6', // Lighter background for white/info section
        justifyContent: 'center',
        alignItems: 'center',
        borderWidth: 1,
        borderColor: '#E5E7EB',
    },

    // Thumbnails
    thumbnailWrapper: {
        marginTop: -30,
        paddingHorizontal: 20,
        zIndex: 10,
    },
    thumbnailList: {
        gap: 12,
        paddingBottom: 10,
    },
    thumbnailContainer: {
        width: 70,
        height: 50,
        borderRadius: 10,
        overflow: 'hidden',
        borderWidth: 2,
        borderColor: 'white',
        elevation: 3,
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.2,
        shadowRadius: 4,
    },
    activeThumbnail: {
        borderColor: COLORS.primary,
        borderWidth: 2,
    },
    thumbnailImage: {
        width: '100%',
        height: '100%',
        resizeMode: 'cover',
    },

    // Main Content
    mainContent: {
        padding: 20,
        marginTop: 10,
        backgroundColor: COLORS.background,
    },
    titleRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 8,
    },
    adTitle: {
        fontSize: 24,
        fontWeight: '800',
        color: '#1F2937',
        flex: 1,
        marginRight: 10,
        letterSpacing: -0.5,
    },
    negotiableBadge: {
        backgroundColor: '#EFF6FF',
        paddingHorizontal: 10,
        paddingVertical: 4,
        borderRadius: 8,
        borderWidth: 1,
        borderColor: '#DBEAFE',
    },
    negotiableText: {
        color: '#2563EB',
        fontSize: 12,
        fontWeight: '700',
    },
    priceText: {
        fontSize: 28,
        fontWeight: '900',
        color: COLORS.primary,
        marginBottom: 12,
    },
    locationContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 20,
    },
    locationText: {
        color: '#6B7280',
        fontSize: 15,
        marginLeft: 6,
        fontWeight: '500',
    },
    dotSeparator: {
        marginHorizontal: 8,
        color: '#D1D5DB',
    },
    postedTime: {
        color: '#9CA3AF',
        fontSize: 14,
    },
    divider: {
        height: 1,
        backgroundColor: '#E5E7EB',
        marginVertical: 20,
    },

    // Specs
    specsContainer: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        rowGap: 24,
    },
    specItem: {
        width: '50%',
        flexDirection: 'row',
        alignItems: 'flex-start',
        marginBottom: 4,
    },
    specIconBox: {
        width: 44,
        height: 44,
        borderRadius: 12,
        backgroundColor: '#F3F4F6',
        justifyContent: 'center',
        alignItems: 'center',
        marginRight: 12,
    },
    specContent: {
        flex: 1,
        justifyContent: 'center',
        height: 44, // Align with icon
    },
    specLabel: {
        fontSize: 12,
        color: '#9CA3AF',
        marginBottom: 2,
        fontWeight: '600',
        textTransform: 'uppercase',
    },
    specValue: {
        fontSize: 15,
        color: '#1F2937',
        fontWeight: '700',
    },

    // Features
    sectionContainer: {
        marginBottom: 24,
    },
    sectionHeader: {
        fontSize: 18,
        fontWeight: '700',
        color: '#111827',
        marginBottom: 16,
    },
    featuresCloud: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        gap: 10,
    },
    featureChip: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#F9FAFB',
        paddingHorizontal: 14,
        paddingVertical: 8,
        borderRadius: 20,
        borderWidth: 1,
        borderColor: '#F3F4F6',
    },
    featureText: {
        marginLeft: 8,
        fontSize: 14,
        color: '#374151',
        fontWeight: '500',
    },
    descriptionText: {
        fontSize: 15,
        lineHeight: 26,
        color: '#4B5563',
    },

    // Share Section
    shareContainer: {
        backgroundColor: '#F8FAFC',
        padding: 20,
        borderRadius: 16,
        alignItems: 'center',
        marginBottom: 24,
        borderWidth: 1,
        borderColor: '#E2E8F0',
    },
    shareTitle: {
        fontSize: 14,
        fontWeight: '600',
        color: '#64748B',
        marginBottom: 16,
        textTransform: 'uppercase',
        letterSpacing: 1,
    },
    shareRow: {
        flexDirection: 'row',
        gap: 20,
    },
    shareCircle: {
        width: 40,
        height: 40,
        borderRadius: 20,
        backgroundColor: 'rgba(35, 92, 248, 0.1)', // Transparent blue
        justifyContent: 'center',
        alignItems: 'center',
        borderWidth: 1,
        borderColor: 'rgba(35, 92, 248, 0.2)',
    },

    // Seller Section
    sellerSection: {
        marginBottom: 24,
        backgroundColor: 'white',
        borderWidth: 1,
        borderColor: '#E5E7EB',
        borderRadius: 16,
        padding: 16, // More breathing room
        elevation: 1,
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.05,
        shadowRadius: 3,
    },
    sellerRow: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    sellerAvatar: {
        width: 44, // Slightly larger for balance
        height: 44,
        borderRadius: 22,
        backgroundColor: COLORS.primary,
        justifyContent: 'center',
        alignItems: 'center',
    },
    sellerInitial: {
        color: 'white',
        fontSize: 18,
        fontWeight: 'bold',
    },
    sellerText: {
        flex: 1,
        flexShrink: 1,
        marginLeft: 10,
        marginRight: 10,
    },
    sellerNameRow: {
        flexDirection: 'row',
        alignItems: 'center',
        flexWrap: 'wrap',
        gap: 4,
    },
    sellerName: {
        fontSize: 15,
        fontWeight: '700',
        color: '#1F2937',
        maxWidth: '70%', // Ensure it doesn't push the badge off-screen
    },
    verifiedBadge: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#10B981',
        paddingHorizontal: 6,
        paddingVertical: 2,
        borderRadius: 10,
        gap: 2,
    },
    verifiedText: {
        color: 'white',
        fontSize: 10,
        fontWeight: '700',
    },
    sellerSubtitle: {
        fontSize: 12, // improved readability
        color: '#6B7280',
        marginTop: 4, // Spacing from name row
    },
    viewProfileBtn: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingHorizontal: 10,
        paddingVertical: 6,
        backgroundColor: '#F3F4F6', // Light background for button definition
        borderRadius: 20,
        gap: 4,
    },
    viewProfileText: {
        color: COLORS.primary,
        fontWeight: '600',
        fontSize: 12,
    },

    // Reviews
    reviewHeaderRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 16,
    },
    ratingPill: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#FFFBEB',
        paddingHorizontal: 10,
        paddingVertical: 5,
        borderRadius: 12,
        gap: 6,
        borderWidth: 1,
        borderColor: '#FEF3C7',
    },
    ratingPillText: {
        fontWeight: '700',
        color: '#D97706',
        fontSize: 14,
    },
    addReviewBtn: {
        alignSelf: 'flex-start',
        borderBottomWidth: 1,
        borderBottomColor: COLORS.primary,
        marginBottom: 16,
    },
    addReviewText: {
        color: COLORS.primary,
        fontWeight: '600',
    },
    formContainer: {
        marginTop: 10,
        marginBottom: 20,
    },
    cancelBtn: {
        marginTop: 10,
        alignItems: 'center',
    },
    cancelText: {
        color: '#6B7280',
    },
    seeAllReviews: {
        marginTop: 16,
        alignItems: 'center',
        paddingVertical: 10,
    },
    seeAllText: {
        color: COLORS.primary,
        fontWeight: '600',
        fontSize: 15,
    },
    reportBtn: {
        flexDirection: 'row',
        alignSelf: 'center',
        alignItems: 'center',
        marginTop: 10,
        padding: 10,
        opacity: 0.7,
    },
    reportBtnText: {
        marginLeft: 8,
        color: COLORS.text.muted,
        fontSize: 14,
    },

    // Footer
    footerContainer: {
        position: 'absolute',
        bottom: 0,
        left: 0,
        right: 0,
        backgroundColor: 'white',
        flexDirection: 'row',
        paddingHorizontal: 20,
        paddingTop: 12, // Reduced top padding
        paddingBottom: Platform.OS === 'ios' ? 30 : 16, // Reduced bottom padding
        borderTopLeftRadius: 24,
        borderTopRightRadius: 24,
        elevation: 20,
        shadowColor: "#000",
        shadowOffset: { width: 0, height: -5 },
        shadowOpacity: 0.1,
        shadowRadius: 10,
        gap: 12,
    },
    contactBtn: {
        flex: 1,
        backgroundColor: '#F3F4F6',
        borderRadius: 12,
        justifyContent: 'center',
        alignItems: 'center',
        flexDirection: 'row',
        paddingVertical: 12, // Reduced vertical padding
        borderWidth: 1,
        borderColor: '#E5E7EB',
    },
    contactBtnText: {
        marginLeft: 8,
        fontSize: 14, // Smaller font
        fontWeight: '700',
        color: '#374151',
    },
    chatBtn: {
        flex: 2,
        backgroundColor: COLORS.primary,
        borderRadius: 12,
        justifyContent: 'center',
        alignItems: 'center',
        flexDirection: 'row',
        paddingVertical: 12, // Reduced vertical padding
        elevation: 4,
        shadowColor: COLORS.primary,
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.3,
        shadowRadius: 6,
    },
    chatBtnText: {
        marginLeft: 8,
        fontSize: 14, // Smaller font
        fontWeight: '700',
        color: 'white',
    },
    disabledBtn: {
        opacity: 0.7,
    },

    // Modal
    modalOverlay: {
        flex: 1,
        backgroundColor: 'rgba(0,0,0,0.5)',
        justifyContent: 'flex-end',
    },
    modalContent: {
        backgroundColor: 'white',
        borderTopLeftRadius: 24,
        borderTopRightRadius: 24,
        padding: 24,
        paddingBottom: 40,
    },
    modalDragBar: {
        width: 40,
        height: 5,
        backgroundColor: '#E5E7EB',
        borderRadius: 3,
        alignSelf: 'center',
        marginBottom: 20,
    },
    modalTitle: {
        fontSize: 22,
        fontWeight: 'bold',
        color: '#1F2937',
        marginBottom: 24,
        textAlign: 'center',
    },
    contactCard: {
        gap: 16,
    },
    modalSellerInfo: {
        alignItems: 'center',
        marginBottom: 20,
    },
    contactOptions: {
        flexDirection: 'row',
        gap: 16,
        justifyContent: 'center',
    },
    contactOption: {
        flex: 1,
        backgroundColor: '#F8FAFC',
        borderRadius: 16,
        padding: 16,
        alignItems: 'center',
        borderWidth: 1,
        borderColor: '#F1F5F9',
    },
    optionIcon: {
        width: 48,
        height: 48,
        borderRadius: 24,
        justifyContent: 'center',
        alignItems: 'center',
        marginBottom: 12,
    },
    optionLabel: {
        fontSize: 14,
        fontWeight: '600',
        color: '#334155',
        marginBottom: 4,
    },
    optionSubLabel: {
        fontSize: 12,
        color: '#94A3B8',
    },
    closeBtn: {
        marginTop: 30,
        backgroundColor: '#F1F5F9',
        paddingVertical: 16,
        borderRadius: 14,
        alignItems: 'center',
    },
    closeBtnText: {
        fontSize: 16,
        fontWeight: '700',
        color: '#64748B',
    },
});
