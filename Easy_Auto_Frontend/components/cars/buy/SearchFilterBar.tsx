import { Ionicons } from '@expo/vector-icons';
import React from 'react';
import { ScrollView, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';

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
        paddingTop: 20,
        paddingBottom: 16,
    },
    searchContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#FFFFFF',
        borderRadius: 16,
        paddingHorizontal: 16,
        paddingVertical: 14,
        gap: 12,
        shadowColor: '#000',
        shadowOpacity: 0.05,
        shadowRadius: 10,
        shadowOffset: { width: 0, height: 2 },
        elevation: 3,
    },
    searchInput: {
        flex: 1,
        fontSize: 16,
        color: '#111827',
        padding: 0,
    },
    filterButton: {
        width: 40,
        height: 40,
        alignItems: 'center',
        justifyContent: 'center',
        borderRadius: 10,
        backgroundColor: '#F0F4FF',
    },
    filtersSection: {
        marginBottom: 8,
    },
    filtersContainer: {
        paddingHorizontal: 16,
        gap: 8,
    },
    filterChip: {
        paddingHorizontal: 16,
        paddingVertical: 8,
        borderRadius: 20,
        backgroundColor: '#FFFFFF',
        borderWidth: 1,
        borderColor: '#E5E7EB',
    },
    filterChipActive: {
        backgroundColor: '#235CF8',
        borderColor: '#235CF8',
    },
    filterChipText: {
        fontSize: 14,
        fontWeight: '600',
        color: '#6B7280',
    },
    filterChipTextActive: {
        color: '#FFFFFF',
    },
});

export default SearchFilterBar;
