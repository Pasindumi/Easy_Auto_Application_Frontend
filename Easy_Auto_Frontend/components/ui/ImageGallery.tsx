import React, { useState, useRef } from 'react';
import {
    View,
    StyleSheet,
    Dimensions,
    TouchableOpacity,
    Text,
    Modal,
    Platform,
    Animated,
} from 'react-native';
import { Image } from 'expo-image';
import { Ionicons } from '@expo/vector-icons';
import { FlashList } from '@shopify/flash-list';

const { width, height } = Dimensions.get('window');

interface ImageGalleryProps {
    images: { image_url: string | null }[];
    visible: boolean;
    initialIndex?: number;
    onClose: () => void;
}

export default function ImageGallery({
    images,
    visible,
    initialIndex = 0,
    onClose,
}: ImageGalleryProps) {
    const [currentIndex, setCurrentIndex] = useState(initialIndex);
    const listRef = useRef<any>(null);

    // Fade animation for controls
    const fadeAnim = useRef(new Animated.Value(1)).current;
    const [controlsVisible, setControlsVisible] = useState(true);

    const toggleControls = () => {
        Animated.timing(fadeAnim, {
            toValue: controlsVisible ? 0 : 1,
            duration: 200,
            useNativeDriver: true,
        }).start(() => setControlsVisible(!controlsVisible));
    };

    const handleScroll = (event: any) => {
        const index = Math.round(event.nativeEvent.contentOffset.x / width);
        if (index !== currentIndex && index >= 0 && index < images.length) {
            setCurrentIndex(index);
        }
    };

    if (!visible) return null;

    return (
        <Modal
            visible={visible}
            transparent={false}
            animationType="fade"
            onRequestClose={onClose}
            presentationStyle="fullScreen"
        >
            <View style={styles.container}>
                {/* Close Button Header */}
                <Animated.View style={[styles.header, { opacity: fadeAnim }]}>
                    <TouchableOpacity style={styles.closeButton} onPress={onClose}>
                        <Ionicons name="close" size={28} color="#FFF" />
                    </TouchableOpacity>
                    <Text style={styles.counterText}>
                        {currentIndex + 1} / {images.length}
                    </Text>
                </Animated.View>

                {/* Main Swipeable Gallery */}
                <TouchableOpacity 
                    activeOpacity={1} 
                    style={styles.galleryWrapper}
                    onPress={toggleControls}
                >
                    <FlashList
                        ref={listRef}
                        data={images}
                        horizontal
                        pagingEnabled
                        showsHorizontalScrollIndicator={false}
                        initialScrollIndex={initialIndex}
                        onScroll={handleScroll}
                        scrollEventThrottle={16}
                        renderItem={({ item }: { item: any }) => (
                            <View style={styles.imageContainer}>
                                <Image
                                    source={item.image_url ? { uri: item.image_url } : require('@/assets/images/car.jpg')}
                                    style={styles.image}
                                    contentFit="contain"
                                    transition={200}
                                />
                            </View>
                        )}
                    />
                </TouchableOpacity>

                {/* Footer Controls / Thumbnail Strip */}
                <Animated.View style={[styles.footer, { opacity: fadeAnim }]}>
                    {images.length > 1 && (
                        <View style={styles.thumbnailContainer}>
                            <FlashList
                                data={images}
                                horizontal
                                showsHorizontalScrollIndicator={false}
                                extraData={currentIndex}
                                renderItem={({ item, index }: { item: any, index: number }) => (
                                    <TouchableOpacity
                                        onPress={() => {
                                            setCurrentIndex(index);
                                            listRef.current?.scrollToIndex({ index, animated: true });
                                        }}
                                        style={[
                                            styles.thumbnailWrapper,
                                            index === currentIndex && styles.thumbnailActive,
                                        ]}
                                    >
                                        <Image
                                            source={item.image_url ? { uri: item.image_url } : require('@/assets/images/car.jpg')}
                                            style={styles.thumbnail}
                                            contentFit="cover"
                                        />
                                    </TouchableOpacity>
                                )}
                            />
                        </View>
                    )}
                </Animated.View>
            </View>
        </Modal>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#000',
    },
    header: {
        position: 'absolute',
        top: Platform.OS === 'ios' ? 50 : 30,
        left: 0,
        right: 0,
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingHorizontal: 20,
        zIndex: 10,
    },
    closeButton: {
        width: 44,
        height: 44,
        borderRadius: 22,
        backgroundColor: 'rgba(255,255,255,0.2)',
        justifyContent: 'center',
        alignItems: 'center',
    },
    counterText: {
        color: '#FFF',
        fontSize: 16,
        fontWeight: '600',
        backgroundColor: 'rgba(0,0,0,0.5)',
        paddingHorizontal: 12,
        paddingVertical: 6,
        borderRadius: 14,
        overflow: 'hidden',
    },
    galleryWrapper: {
        flex: 1,
        justifyContent: 'center',
    },
    imageContainer: {
        width: width,
        height: height,
        justifyContent: 'center',
        alignItems: 'center',
    },
    image: {
        width: '100%',
        height: '100%',
    },
    footer: {
        position: 'absolute',
        bottom: Platform.OS === 'ios' ? 40 : 20,
        left: 0,
        right: 0,
        zIndex: 10,
    },
    thumbnailContainer: {
        height: 70,
        paddingHorizontal: 10,
    },
    thumbnailWrapper: {
        width: 60,
        height: 60,
        marginHorizontal: 6,
        borderRadius: 8,
        overflow: 'hidden',
        borderWidth: 2,
        borderColor: 'transparent',
        opacity: 0.6,
    },
    thumbnailActive: {
        borderColor: '#FFF',
        opacity: 1,
    },
    thumbnail: {
        width: '100%',
        height: '100%',
    },
});
