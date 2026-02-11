import COLORS from '@/constants/Colors';
import { Ionicons } from '@expo/vector-icons';
import React from 'react';
import { Image, StyleSheet, Text, TouchableOpacity, View } from 'react-native';



interface Props {
    selectedImages: string[];
    removeImage: (index: number) => void;
    addImage?: () => void;
    title?: string;
    subtitle?: string;
    pricePill?: string;
    freeImageCount?: number;
    onViewPackages?: () => void;
    extraImagePrice?: number;
    isUnlimited?: boolean;
    activePackageName?: string | null;
}

const PhotoUploadSection: React.FC<Props> = ({
    selectedImages,
    removeImage,
    addImage,
    title = "Car Photos",
    subtitle: customSubtitle,
    pricePill,
    freeImageCount = 5,
    onViewPackages,
    extraImagePrice = 0,
    isUnlimited = false,
    activePackageName
}) => {

    const effectivelyUnlimited = isUnlimited || freeImageCount >= 99;

    let subtitle = customSubtitle;
    if (!subtitle) {
        if (effectivelyUnlimited) {
            subtitle = activePackageName
                ? `You have subscribed to ${activePackageName}, so you can upload unlimited images!`
                : "You can upload unlimited images!";
        } else {
            subtitle = `Upload up to ${freeImageCount} photos for free.`;
        }
    }

    // Only show upsell if NOT unlimited AND over limit
    const showUpsell = !effectivelyUnlimited && selectedImages.length > freeImageCount;

    return (
        <View style={styles.section}>
            <View style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 12 }}>
                <Text style={styles.sectionTitle}>{title}</Text>
                {pricePill && (
                    <View style={styles.pricePill}>
                        <Text style={styles.pricePillText}>{pricePill}</Text>
                    </View>
                )}
            </View>

            <Text style={[styles.sectionSubtitle, effectivelyUnlimited && styles.unlimitedText]}>{subtitle}</Text>

            <View style={{ alignItems: 'center', flexDirection: 'row', flexWrap: 'wrap', gap: 12 }}>
                {/* Render all selected images */}
                {selectedImages.map((uri, i) => (
                    <View key={i} style={styles.photoContainerUniform}>
                        <Image source={{ uri }} style={styles.carPhotoUniform} />
                        <TouchableOpacity
                            style={styles.removePhotoButtonUniform}
                            onPress={() => removeImage(i)}
                        >
                            <Ionicons name="close" size={16} color="white" />
                        </TouchableOpacity>
                    </View>
                ))}

                {/* Always Show Add Button if addImage is provided */}
                {addImage && (
                    <TouchableOpacity style={styles.addPhotoButtonUniform} onPress={addImage}>
                        <Text style={styles.addPhotoTextUniform}>Add Photo</Text>
                        <Ionicons name="add" size={32} color="#3B82F6" style={{ marginTop: 2 }} />
                    </TouchableOpacity>
                )}
            </View>

            {/* Upsell Message */}
            {showUpsell && (
                <View style={styles.upsellContainer}>
                    <Text style={styles.upsellText}>
                        <Text style={{ fontWeight: 'bold' }}>Extra images selected.</Text>
                        {extraImagePrice && extraImagePrice > 0
                            ? ` You have exceeded the free limit. An extra fee of ${new Intl.NumberFormat('en-LK', { style: 'currency', currency: 'LKR' }).format((selectedImages.length - freeImageCount) * extraImagePrice)} will apply.`
                            : ` You have exceeded the free limit of ${freeImageCount} images. Additional charges will apply.`
                        }
                    </Text>
                    <TouchableOpacity
                        style={styles.upsellButton}
                        onPress={onViewPackages}
                    >
                        <Text style={styles.upsellButtonText}>View Packages</Text>
                    </TouchableOpacity>
                </View>
            )}
        </View>
    );
};



const styles = StyleSheet.create({
    section: {
        backgroundColor: COLORS.white,
        borderRadius: 20,
        padding: 20,
        marginBottom: 16,
        elevation: 2,
        shadowColor: COLORS.shadow,
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.05,
        shadowRadius: 10,
        borderWidth: 1,
        borderColor: COLORS.border
    },
    sectionTitle: { fontSize: 18, fontWeight: '800', color: COLORS.text.primary },
    sectionSubtitle: { fontSize: 13, color: COLORS.text.muted, marginBottom: 20, lineHeight: 20 },
    unlimitedText: { color: '#10B981', fontWeight: '600' },

    photoContainerUniform: {
        position: 'relative',
        width: 80,
        height: 80,
        marginBottom: 8,
        shadowColor: COLORS.shadow,
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
        elevation: 2,
    },
    carPhotoUniform: { width: 80, height: 80, borderRadius: 12 },
    removePhotoButtonUniform: {
        position: 'absolute',
        top: -6,
        right: -6,
        backgroundColor: '#EF4444',
        borderRadius: 12,
        width: 24,
        height: 24,
        justifyContent: 'center',
        alignItems: 'center',
        zIndex: 2,
        borderWidth: 2,
        borderColor: COLORS.white
    },

    addPhotoButtonUniform: {
        width: 80,
        height: 80,
        backgroundColor: '#EFF6FF',
        borderRadius: 12,
        borderWidth: 2,
        borderColor: '#BFDBFE',
        borderStyle: 'dashed',
        justifyContent: 'center',
        alignItems: 'center',
        flexDirection: 'column'
    },
    addPhotoTextUniform: { fontSize: 10, color: '#3B82F6', fontWeight: '700', marginTop: 4 },

    pricePill: { backgroundColor: '#E0F2FE', borderRadius: 16, paddingVertical: 4, paddingHorizontal: 12, marginLeft: 8 },
    pricePillText: { fontSize: 12, color: '#0A4D92', fontWeight: '600' },

    upsellContainer: { marginTop: 16, padding: 16, backgroundColor: '#FFF7ED', borderRadius: 12, borderWidth: 1, borderColor: '#FED7AA' },
    upsellText: { fontSize: 14, color: '#9A3412', marginBottom: 12, lineHeight: 20 },
    upsellButton: { backgroundColor: '#EA580C', paddingVertical: 10, borderRadius: 10, alignItems: 'center' },
    upsellButtonText: { color: COLORS.white, fontWeight: '700', fontSize: 14 },
});

export default PhotoUploadSection;
