import { Stack } from "expo-router";

export default function AdminLayout() {
  return (
    <Stack
      screenOptions={{
        headerShown: false,
        header: () => null,
        presentation: "card",
        animation: "slide_from_right",
        animationDuration: 250,
        animationTypeForReplace: "push",
        gestureEnabled: true,
        gestureDirection: "horizontal",
        fullScreenGestureEnabled: true,
      }}
    >
      <Stack.Screen
        name="index"
        options={{
          headerShown: false,
          header: () => null,
          title: "",
        }}
      />
      <Stack.Screen
        name="ads"
        options={{
          headerShown: false,
          header: () => null,
          title: "Ads Management",
          animation: "slide_from_right",
        }}
      />
      <Stack.Screen
        name="users"
        options={{
          headerShown: false,
          header: () => null,
          title: "User Management",
          animation: "slide_from_right",
        }}
      />
      <Stack.Screen
        name="analytics"
        options={{
          headerShown: false,
          header: () => null,
          title: "Analytics",
          animation: "slide_from_right",
        }}
      />
    </Stack>
  );
}
