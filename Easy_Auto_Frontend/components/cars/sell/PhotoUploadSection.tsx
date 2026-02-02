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
                        <Ionicons name="add" size={32} color="#235CF8" style={{ marginTop: 2 }} />
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
    section: { backgroundColor: 'white', borderRadius: 12, padding: 20, marginBottom: 16, elevation: 2, shadowColor: '#000', shadowOffset: { width: 0, height: 1 }, shadowOpacity: 0.05, shadowRadius: 4 },
    sectionTitle: { fontSize: 18, fontWeight: 'bold', color: '#1F2937' },
    sectionSubtitle: { fontSize: 13, color: '#6B7280', marginBottom: 16 },
    unlimitedText: { color: '#059669', fontWeight: '600' }, // Green text for unlimited message
    // Simplified layout styles for flex wrap
    photoContainerUniform: { position: 'relative', width: 70, height: 70, marginBottom: 4 },
    carPhotoUniform: { width: 70, height: 70, borderRadius: 8 },
    removePhotoButtonUniform: { position: 'absolute', top: -8, right: -8, backgroundColor: '#EF4444', borderRadius: 12, width: 24, height: 24, justifyContent: 'center', alignItems: 'center', zIndex: 2 },
    addPhotoButtonUniform: { width: 70, height: 70, backgroundColor: '#F8F9FA', borderRadius: 8, borderWidth: 2, borderColor: '#235CF8', borderStyle: 'dashed', justifyContent: 'center', alignItems: 'center', flexDirection: 'column' },
    addPhotoTextUniform: { fontSize: 11, color: '#235CF8', fontWeight: '600', marginBottom: 2 },
    pricePill: { backgroundColor: '#E0F2FE', borderRadius: 16, paddingVertical: 4, paddingHorizontal: 12, marginLeft: 8 },
    pricePillText: { fontSize: 12, color: '#0A4D92', fontWeight: '500' },
    upsellContainer: { marginTop: 12, padding: 12, backgroundColor: '#FFF7ED', borderRadius: 8, borderWidth: 1, borderColor: '#FFEDD5' },
    upsellText: { fontSize: 14, color: '#9A3412', marginBottom: 8 },
    upsellButton: { backgroundColor: '#EA580C', paddingVertical: 8, borderRadius: 6, alignItems: 'center' },
    upsellButtonText: { color: 'white', fontWeight: '600', fontSize: 14 },
});

export default PhotoUploadSection;
