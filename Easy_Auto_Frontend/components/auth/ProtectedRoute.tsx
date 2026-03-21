import { useEffect } from 'react';
import { useRouter } from 'expo-router';
import { useAuth } from '@/contexts/AuthContext';
import { View, StyleSheet } from 'react-native';
import Loading from '@/components/ui/Loading';
import COLORS from '@/constants/Colors';

interface ProtectedRouteProps {
  children: React.ReactNode;
  redirectTo?: string;
}

/**
 * Wrapper component that protects a route from unauthorized access
 * Shows loading state while checking auth, redirects if not authenticated
 * 
 * @example
 * export default function ProtectedScreen() {
 *   return (
 *     <ProtectedRoute>
 *       <YourScreenContent />
 *     </ProtectedRoute>
 *   );
 * }
 */
export function ProtectedRoute({ children, redirectTo = '/auth/login' }: ProtectedRouteProps) {
  const { isAuthenticated, isLoading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!isLoading && !isAuthenticated) {
      console.log('Protected route: User not authenticated, redirecting to login');
      router.replace(redirectTo as any);
    }
  }, [isAuthenticated, isLoading, redirectTo]);

  // Show loading while checking auth
  if (isLoading) {
    return (
      <View style={styles.loadingContainer}>
        <Loading size="large" />
      </View>
    );
  }

  // Don't render children if not authenticated
  if (!isAuthenticated) {
    return null;
  }

  // Render protected content
  return <>{children}</>;
}

const styles = StyleSheet.create({
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
  },
});
