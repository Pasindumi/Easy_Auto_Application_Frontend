import { Ionicons } from '@expo/vector-icons';
import React from 'react';
import { Image, StyleSheet, Text, TouchableOpacity, View } from 'react-native';

interface Props {
    selectedImages: string[];
    removeImage: (index: number) => void;
    addImage?: () => void; // Callback to trigger image picker
    title?: string;
    subtitle?: string;
    pricePill?: string;
}

const PhotoUploadSection: React.FC<Props> = ({
    selectedImages,
    removeImage,
    addImage,
    title = "Car Photos",
    subtitle = "Upload up to 5 photos. First photo will be the cover image",
    pricePill
}) => {

    // Split images for display rows
    const firstRow = selectedImages.slice(0, 3);
    const secondRow = selectedImages.slice(3, 5); // Max 5

    // Check if we need to show the upsell
    const showUpsell = selectedImages.length >= 5;

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
            <Text style={styles.sectionSubtitle}>{subtitle}</Text>

            <View style={{ alignItems: 'center' }}>
                <View style={styles.photoRowUniform}>
                    {[0, 1, 2].map((i) => (
                        selectedImages[i] ? (
                            <View key={i} style={styles.photoContainerUniform}>
                                <Image source={{ uri: selectedImages[i] }} style={styles.carPhotoUniform} />
                                <TouchableOpacity
                                    style={styles.removePhotoButtonUniform}
                                    onPress={() => removeImage(i)}
                                >
                                    <Ionicons name="close" size={16} color="white" />
                                </TouchableOpacity>
                            </View>
                        ) : (
                            // Only show placeholder if we haven't reached limit, or just empty boxes
                            // Design choice: show empty box if < limit
                            i < 5 ? (
                                <View key={i} style={styles.photoPlaceholderUniform}>
                                    <Ionicons name="car-outline" size={32} color="#C1C9D2" />
                                </View>
                            ) : null
                        )
                    ))}
                </View>

                <View style={styles.photoRowUniform}>
                    {[3, 4].map((i) => (
                        selectedImages[i] ? (
                            <View key={i} style={styles.photoContainerUniform}>
                                <Image source={{ uri: selectedImages[i] }} style={styles.carPhotoUniform} />
                                <TouchableOpacity
                                    style={styles.removePhotoButtonUniform}
                                    onPress={() => removeImage(i)}
                                >
                                    <Ionicons name="close" size={16} color="white" />
                                </TouchableOpacity>
                            </View>
                        ) : (
                            <View key={i} style={styles.photoPlaceholderUniform}>
                                <Ionicons name="car-outline" size={32} color="#C1C9D2" />
                            </View>
                        )
                    ))}

                    {/* Add Photo Button - Only if < 5 */}
                    {selectedImages.length < 5 && addImage && (
                        <TouchableOpacity style={styles.addPhotoButtonUniform} onPress={addImage}>
                            <Text style={styles.addPhotoTextUniform}>Add Photo</Text>
                            <Ionicons name="add" size={32} color="#235CF8" style={{ marginTop: 2 }} />
                        </TouchableOpacity>
                    )}
                </View>
            </View>

            {/* Upsell Message */}
            {showUpsell && (
                <View style={styles.upsellContainer}>
                    <Text style={styles.upsellText}>
                        Got more images to upload? Start faster by adding 10 more images for a fee of <Text style={{ fontWeight: 'bold' }}>LKR 750</Text> or add package.
                    </Text>
                    <TouchableOpacity style={styles.upsellButton}>
                        <Text style={styles.upsellButtonText}>Add Package</Text>
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
    photoRowUniform: { flexDirection: 'row', gap: 12, marginBottom: 12, justifyContent: 'flex-start' },
    photoContainerUniform: { position: 'relative', width: 70, height: 70, marginRight: 4 },
    carPhotoUniform: { width: 70, height: 70, borderRadius: 8 },
    removePhotoButtonUniform: { position: 'absolute', top: -8, right: -8, backgroundColor: '#EF4444', borderRadius: 12, width: 24, height: 24, justifyContent: 'center', alignItems: 'center', zIndex: 2 },
    photoPlaceholderUniform: { width: 70, height: 70, backgroundColor: '#F3F4F6', borderRadius: 8, borderWidth: 1, borderColor: '#E5E7EB', justifyContent: 'center', alignItems: 'center' },
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
