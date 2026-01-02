import { StyleSheet } from 'react-native';

/**
 * Consolidated Header Section Styles
 * Used across multiple pages: Payment History, My Subscription, My Listing, My Rating, Settings
 * 
 * Usage:
 * import { headerSectionStyles } from '@/styles/headerSectionStyles';
 * 
 * Then in your component:
 * <View style={headerSectionStyles.headerWrap}>
 *   <View style={headerSectionStyles.header}>
 *     <View style={headerSectionStyles.headerLeft}>
 *       <Ionicons name="icon-name" size={22} color="#235CF8" style={{ marginRight: 8 }} />
 *       <Text style={headerSectionStyles.headerTitle}>Page Title</Text>
 *     </View>
 *   </View>
 * </View>
 */

export const headerSectionStyles = StyleSheet.create({
    // Wrapper for the header section
    headerWrap: {
        backgroundColor: '#F9FAFB',
    },

    // Main header container
    header: {
        paddingHorizontal: 16,
        paddingVertical: 12,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
    },

    // Left side of header (icon + title)
    headerLeft: {
        flexDirection: 'row',
        alignItems: 'center',
    },

    // Header title text
    headerTitle: {
        color: '#235CF8',
        fontSize: 18,
        fontWeight: '600',
    },
});

// Alternative export for subscriptions page (white background variant)
export const headerSectionStylesWhite = StyleSheet.create({
    headerWrap: {
        backgroundColor: '#fff',
    },
    header: {
        paddingHorizontal: 16,
        paddingVertical: 12,
        flexDirection: 'row',
        alignItems: 'center',
    },
    headerTitle: {
        color: '#235CF8',
        fontSize: 18,
        fontWeight: '600',
    },
});
