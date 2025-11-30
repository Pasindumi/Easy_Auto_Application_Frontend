import { Stack } from "expo-router";

export default function AdminLayout() {
  return (
    <Stack
      screenOptions={{
        headerShown: false,
        header: () => null,
        presentation: "card",
        animation: "default",
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
    </Stack>
  );
}

