import { Stack } from "expo-router";

export default function AdminLayout() {
  return (
    <Stack
      screenOptions={{
        headerShown: false,
        header: () => null,
        presentation: "card",
        animation: "slide_from_right",
        animationDuration: 350,
        gestureEnabled: true,
        gestureDirection: "horizontal",
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
    </Stack>
  );
}

