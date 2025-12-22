import { BottomTabBarButtonProps } from '@react-navigation/bottom-tabs';
import { PlatformPressable } from '@react-navigation/elements';
import * as Haptics from 'expo-haptics';

export function HapticTab(props: BottomTabBarButtonProps) {
  return (
    <PlatformPressable
      {...props}
      onPressIn={(ev) => {
        // Add haptic feedback on both iOS and Android for better UX
        try {
          Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
        } catch (error) {
          // Silently fail if haptics are not available
        }
        props.onPressIn?.(ev);
      }}
    />
  );
}
