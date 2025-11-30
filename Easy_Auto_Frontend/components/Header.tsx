// components/Header.tsx
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import React from 'react';
import { Platform, StatusBar as RNStatusBar, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

export const HEADER_HEIGHT = 88;

type HeaderProps = {
	title?: string;
	showBack?: boolean;
	hideLogo?: boolean;
};

export default function Header({ title, showBack = true, hideLogo = false }: HeaderProps) {
	const router = useRouter();

	return (
		<View style={styles.container} pointerEvents="box-none">
			{/* Status Bar */}
			{Platform.OS === 'android' ? (
				<RNStatusBar backgroundColor="#235CF8" barStyle="light-content" />
			) : null}

			<SafeAreaView edges={['top']} style={styles.safe}>
				<View style={styles.header}>
					{/* Back Button - Modern minimalist design */}
					<TouchableOpacity 
						onPress={() => router.back()} 
						style={styles.backButton} 
						accessibilityLabel="Back"
						activeOpacity={0.7}
					>
						{showBack ? (
							<Ionicons name="chevron-back" size={22} color="#FFFFFF" />
						) : (
							<View style={{ width: 22 }} />
						)}
					</TouchableOpacity>

					{/* Logo/Title - Centered */}
					<View style={styles.logoWrap}>
						{!hideLogo && !title && (
							<Text style={styles.logoText}>Easy Auto</Text>
						)}
						{title && <Text style={styles.title}>{title}</Text>}
					</View>

					{/* Right Spacer for balance */}
					<View style={styles.rightSpacer} />
				</View>
			</SafeAreaView>
		</View>
	);
}

const styles = StyleSheet.create({
	container: {
		position: 'absolute',
		top: 0,
		left: 0,
		right: 0,
		height: HEADER_HEIGHT,
		zIndex: 50,
		elevation: 50,
		backgroundColor: '#235CF8',
	},
	safe: {
		flex: 1,
		backgroundColor: '#235CF8',
	},
	header: {
		flex: 1,
		flexDirection: 'row',
		alignItems: 'center',
		paddingHorizontal: 20,
		backgroundColor: '#235CF8',
		borderBottomLeftRadius: 20,
		borderBottomRightRadius: 20,
	},
	backButton: {
		width: 40,
		height: 40,
		alignItems: 'center',
		justifyContent: 'center',
		borderRadius: 12,
	},
	logoWrap: {
		flex: 1,
		alignItems: 'center',
		justifyContent: 'center',
		paddingHorizontal: 16,
	},
	logoText: {
		color: '#FFFFFF',
		fontSize: 18,
		fontWeight: '700',
		letterSpacing: -0.3,
	},
	title: {
		color: '#FFFFFF',
		fontSize: 17,
		fontWeight: '600',
		letterSpacing: -0.2,
	},
	rightSpacer: {
		width: 40,
	},
});
