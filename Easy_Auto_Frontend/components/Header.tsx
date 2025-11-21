// components/Header.tsx
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { useRouter } from 'expo-router';
import React from 'react';
import { Image, Platform, StatusBar as RNStatusBar, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

export const HEADER_HEIGHT = 120;

type HeaderProps = {
	title?: string;
	showBack?: boolean;
  
	hideLogo?: boolean;
};

export default function Header({ title, showBack = true, hideLogo = false }: HeaderProps) {
	const router = useRouter();

	return (
		<View style={styles.container} pointerEvents="box-none">
			{/* On Android set status bar background to header color so there is no black gap */}
			{Platform.OS === 'android' ? (
				<RNStatusBar backgroundColor="rgba(35,92,248,0.98)" barStyle="light-content" />
			) : null}

			<LinearGradient
				colors={[ 'rgba(35,92,248,0.98)', 'rgba(35,92,248,0.92)' ]}
				start={{ x: 0, y: 0 }}
				end={{ x: 1, y: 0 }}
				style={[styles.header, { height: HEADER_HEIGHT }]}
			>
				<SafeAreaView edges={[ 'top' ]} style={[styles.safe, { height: HEADER_HEIGHT }] }>
					<View style={[styles.row, { height: HEADER_HEIGHT }] }>
						<TouchableOpacity onPress={() => router.back()} style={styles.backButton} accessibilityLabel="Back">
							{showBack ? <Ionicons name="arrow-back" size={22} color="#fff" /> : <View style={{ width: 22 }} />}
						</TouchableOpacity>

						<View style={styles.logoWrap}>
							{!hideLogo && (
								<Image source={require('../assets/images/logo.png')} style={styles.logoImage} resizeMode="contain" />
							)}
							{title ? <Text style={styles.title}>{title}</Text> : null}
						</View>

						<View style={styles.rightSpacer} />
					</View>
				</SafeAreaView>
			</LinearGradient>
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
	},
	header: { flex: 1 },
	safe: { flex: 1 },
	row: { flex: 1, flexDirection: 'row', alignItems: 'center', paddingHorizontal: 12 },
	backButton: { padding: 8, width: 40, alignItems: 'flex-start', justifyContent: 'center' },
	logoWrap: { flex: 1, alignItems: 'center', justifyContent: 'center' },
	logoImage: { width: 120, height: 48 },
	title: { color: '#fff', fontWeight: '700' },
	rightSpacer: { width: 40 },
});
