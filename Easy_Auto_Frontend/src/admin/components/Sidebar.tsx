import React, { useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Platform, useWindowDimensions } from 'react-native';
import { useRouter, usePathname } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { COLORS } from '@/constants/Colors';

const MENU_ITEMS = [
    { name: 'Dashboard', icon: 'grid-outline', route: '/admin' },
    { name: 'Sell Ads', icon: 'car-sport-outline', route: '/admin/ads' },
    { name: 'Vehicle Types', icon: 'list-outline', route: '/admin/vehicle-types' },
    { name: 'Attributes', icon: 'options-outline', route: '/admin/attributes' },
    { name: 'Settings', icon: 'settings-outline', route: '/admin/settings' },
];

export const AdminSidebar = ({ isCollapsed, toggleCollapse, isMobile }: { isCollapsed: boolean, toggleCollapse: () => void, isMobile: boolean }) => {
    const router = useRouter();
    const pathname = usePathname();

    const handleLogout = () => {
        // Clear token logic here (implementation depends on storage used)
        localStorage.removeItem('adminToken');
        router.replace('/admin/login' as any);
    };

    return (
        <View style={[styles.sidebar, isCollapsed ? styles.collapsed : styles.expanded]}>
            <View style={styles.header}>
                {!isCollapsed && <Text style={styles.headerText}>Easy Auto Admin</Text>}
                <TouchableOpacity onPress={toggleCollapse} style={styles.collapseBtn}>
                    <Ionicons name={isCollapsed ? "chevron-forward" : "chevron-back"} size={24} color={COLORS.white} />
                </TouchableOpacity>
            </View>

            <View style={styles.menu}>
                {MENU_ITEMS.map((item) => {
                    const isActive = pathname === item.route || (item.route !== '/admin' && pathname.startsWith(item.route));
                    return (
                        <TouchableOpacity
                            key={item.route}
                            style={[styles.menuItem, isActive && styles.activeItem]}
                            onPress={() => router.push(item.route as any)}
                        >
                            <Ionicons name={item.icon as any} size={24} color={isActive ? COLORS.primary : COLORS.white} />
                            {!isCollapsed && <Text style={[styles.menuText, isActive && styles.activeText]}>{item.name}</Text>}
                        </TouchableOpacity>
                    );
                })}
            </View>

            <View style={styles.footer}>
                <TouchableOpacity style={styles.menuItem} onPress={handleLogout}>
                    <Ionicons name="log-out-outline" size={24} color="#FF6B6B" />
                    {!isCollapsed && <Text style={[styles.menuText, { color: '#FF6B6B' }]}>Logout</Text>}
                </TouchableOpacity>
            </View>
        </View>
    );
};

const styles = StyleSheet.create({
    sidebar: {
        backgroundColor: COLORS.secondary,
        height: '100%',
        paddingVertical: 20,
        borderRightWidth: 1,
        borderRightColor: '#E5E7EB',
        transition: 'width 0.3s ease' as any, // Web transition
    },
    expanded: {
        width: 250,
    },
    collapsed: {
        width: 70,
        alignItems: 'center',
    },
    header: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingHorizontal: 20,
        marginBottom: 40,
        height: 40,
    },
    headerText: {
        color: COLORS.white,
        fontSize: 18,
        fontWeight: 'bold',
    },
    collapseBtn: {
        padding: 5,
    },
    menu: {
        flex: 1,
    },
    menuItem: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingVertical: 15,
        paddingHorizontal: 20,
        marginBottom: 5,
        cursor: 'pointer', // Web cursor
    },
    activeItem: {
        backgroundColor: COLORS.white,
        borderLeftWidth: 4,
        borderLeftColor: COLORS.primary,
    },
    menuText: {
        color: '#9CA3AF',
        marginLeft: 15,
        fontSize: 15,
        fontWeight: '500',
    },
    activeText: {
        color: COLORS.primary,
        fontWeight: 'bold',
    },
    footer: {
        paddingBottom: 20,
    }
} as any);

export default AdminSidebar;
