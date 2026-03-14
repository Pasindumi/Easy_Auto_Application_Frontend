import { Ionicons } from '@expo/vector-icons';
import React from 'react';
import { ScrollView, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';
import COLORS from '@/constants/Colors';

interface SearchFilterBarProps {
    searchQuery: string;
    onSearchChange: (text: string) => void;
    selectedFilter: string;
    onFilterChange: (key: string) => void;
    filterOptions: { key: string; label: string }[];
    onFilterButtonPress: () => void;
}

const SearchFilterBar: React.FC<SearchFilterBarProps> = ({
    searchQuery,
    onSearchChange,
    selectedFilter,
    onFilterChange,
    filterOptions,
    onFilterButtonPress,
}) => {
    return (
        <View>
            {/* Modern Search Bar */}
            <View style={styles.searchSection}>
                <View style={styles.searchContainer}>
                    <Ionicons name="search-outline" size={20} color="#9CA3AF" />
                    <TextInput
                        placeholder="Search cars, brands, models..."
                        value={searchQuery}
                        onChangeText={onSearchChange}
                        style={styles.searchInput}
                        placeholderTextColor="#9CA3AF"
                    />
                    <TouchableOpacity
                        style={styles.filterButton}
                        onPress={onFilterButtonPress}
                        activeOpacity={0.7}
                    >
                        <Ionicons name="options-outline" size={20} color="#235CF8" />
                    </TouchableOpacity>
                </View>
            </View>

            {/* Filter Chips */}
            <View style={styles.filtersSection}>
                <ScrollView
                    horizontal
                    showsHorizontalScrollIndicator={false}
                    contentContainerStyle={styles.filtersContainer}
                >
                    {filterOptions.map((filter) => (
                        <TouchableOpacity
                            key={filter.key}
                            style={[
                                styles.filterChip,
                                selectedFilter === filter.key && styles.filterChipActive,
                            ]}
                            onPress={() => onFilterChange(filter.key)}
                            activeOpacity={0.7}
                        >
                            <Text
                                style={[
                                    styles.filterChipText,
                                    selectedFilter === filter.key && styles.filterChipTextActive,
                                ]}
                            >
                                {filter.label}
                            </Text>
                        </TouchableOpacity>
                    ))}
                </ScrollView>
            </View>
        </View>
    );
};

const styles = StyleSheet.create({
    searchSection: {
        paddingHorizontal: 16,
        paddingTop: 24,
        paddingBottom: 16,
    },
    searchContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#FFFFFF',
        borderRadius: 20,
        paddingHorizontal: 16,
        height: 56,
        gap: 12,
        shadowColor: COLORS.shadowPremium || '#235CF8',
        shadowOpacity: 0.08,
        shadowRadius: 15,
        shadowOffset: { width: 0, height: 6 },
        elevation: 5,
        borderWidth: 1,
        borderColor: '#F1F5F9',
    },
    searchInput: {
        flex: 1,
        fontSize: 16,
        color: COLORS.text.primary,
        fontWeight: '600',
        padding: 0,
    },
    filterButton: {
        width: 40,
        height: 40,
        alignItems: 'center',
        justifyContent: 'center',
        borderRadius: 12,
        backgroundColor: COLORS.primaryLight,
        borderWidth: 1,
        borderColor: 'rgba(35, 92, 248, 0.1)',
    },
    filtersSection: {
        marginBottom: 12,
    },
    filtersContainer: {
        paddingHorizontal: 16,
        gap: 10,
    },
    filterChip: {
        paddingHorizontal: 18,
        paddingVertical: 10,
        borderRadius: 15,
        backgroundColor: '#FFFFFF',
        borderWidth: 1.5,
        borderColor: '#F3F4F6',
        shadowColor: '#000',
        shadowOpacity: 0.02,
        shadowRadius: 5,
        shadowOffset: { width: 0, height: 2 },
        elevation: 1,
    },
    filterChipActive: {
        backgroundColor: COLORS.primary,
        borderColor: COLORS.primary,
        shadowColor: COLORS.primary,
        shadowOpacity: 0.2,
        shadowRadius: 8,
        shadowOffset: { width: 0, height: 4 },
        elevation: 4,
    },
    filterChipText: {
        fontSize: 13,
        fontWeight: '700',
        color: COLORS.text.muted,
    },
    filterChipTextActive: {
        color: '#FFFFFF',
    },
});

export default SearchFilterBar;
