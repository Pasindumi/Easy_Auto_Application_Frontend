import { useEffect } from 'react';
import { useRouter, useSegments, usePathname } from 'expo-router';
import { useAuth } from '../contexts/AuthContext';

/**
 * Hook to protect routes that require authentication
 * Call this in any protected screen or component
 * Automatically redirects to login if not authenticated
 * 
 * @param redirectTo - Optional custom redirect path (defaults to /auth/login)
 */
export function useProtectedRoute(redirectTo: string = '/auth/login') {
  const { isAuthenticated, isLoading } = useAuth();
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    if (isLoading) return;

    if (!isAuthenticated) {
      console.log(`Protected route accessed without auth: ${pathname}. Redirecting to ${redirectTo}`);
      // Redirect to login
      router.replace(redirectTo as any);
    }
  }, [isAuthenticated, isLoading, pathname]);

  return { isAuthenticated, isLoading };
}

/**
 * Hook to guard specific actions
 * Returns a function that checks auth before executing an action
 * If not authenticated, redirects to login
 * 
 * @example
 * const guardAction = useActionGuard();
 * 
 * const handleFavorite = guardAction(() => {
 *   // This only runs if user is authenticated
 *   addToFavorites(adId);
 * });
 */
export function useActionGuard(redirectTo: string = '/auth/login') {
  const { isAuthenticated } = useAuth();
  const router = useRouter();

  return <T extends (...args: any[]) => any>(action: T) => {
    return ((...args: Parameters<T>) => {
      if (!isAuthenticated) {
        console.log('Action blocked - not authenticated. Redirecting to login.');
        // Redirect to login
        router.push(redirectTo as any);
        return;
      }

      // Execute the action
      return action(...args);
    }) as T;
  };
}

/**
 * Hook to check if user can access a feature
 * Returns boolean and doesn't redirect
 * Useful for conditional rendering
 * 
 * @example
 * const canAccess = useCanAccess();
 * 
 * {canAccess ? (
 *   <Button onPress={handleAction}>Do Action</Button>
 * ) : (
 *   <Button onPress={() => router.push('/auth/login')}>Login to continue</Button>
 * )}
 */
export function useCanAccess() {
  const { isAuthenticated } = useAuth();
  return isAuthenticated;
}

/**
 * Hook that returns a wrapper function for protected actions
 * Similar to useActionGuard but with a promise-based interface
 * 
 * @example
 * const withAuth = useRequireAuth();
 * 
 * const handleCreateAd = withAuth(async () => {
 *   // This only runs if authenticated
 *   await createAd(adData);
 * });
 */
export function useRequireAuth(redirectTo: string = '/auth/login') {
  const { isAuthenticated } = useAuth();
  const router = useRouter();

  return <T extends (...args: any[]) => Promise<any>>(action: T) => {
    return (async (...args: Parameters<T>): Promise<ReturnType<T> | undefined> => {
      if (!isAuthenticated) {
        console.log('Protected action blocked - redirecting to login');
        router.push(redirectTo as any);
        return;
      }

      return action(...args);
    }) as T;
  };
}
