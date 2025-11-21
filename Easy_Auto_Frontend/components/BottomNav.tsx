import { Ionicons } from "@expo/vector-icons";
import { usePathname, useRouter } from "expo-router";
import React from "react";
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

export default function BottomNav() {
  const router = useRouter();
  const pathname = usePathname(); // get current route automatically

  // Determine active tab based on current route
  const getActiveKey = (): "home" | "buy" | "compare" | "chat" | "profile" => {
    if (pathname === "/") return "home";
    if (pathname === "/buy-car") return "buy";
    if (pathname === "/compare") return "compare";
    if (pathname === "/chat") return "chat";
    if (pathname === "/profile") return "profile";
    return "home";
  };

  const activeKey = getActiveKey();

  const handleNavPress = (key: "home" | "buy" | "compare" | "chat" | "profile") => {
    switch (key) {
      case "home": router.push("/"); break;
      case "buy": router.push("/buy-car"); break;
      case "compare": router.push("/compare"); break;
      case "chat": router.push("/chat"); break;
      case "profile": router.push("/profile"); break;
    }
  };

  return (
    <SafeAreaView edges={["bottom"]} style={styles.safeArea}>
      <View style={styles.container}>
        {/* HOME TAB */}
        <TouchableOpacity style={styles.tab} onPress={() => handleNavPress("home")}>
          <Ionicons
            name={activeKey === "home" ? "home" : "home-outline"}
            size={28}
            color={activeKey === "home" ? "#235CF8" : "#B4B4B4"}
          />
          <Text style={[styles.label, { color: activeKey === "home" ? "#235CF8" : "#B4B4B4" }]}>
            Home
          </Text>
        </TouchableOpacity>

        {/* BUY A CAR TAB */}
        <TouchableOpacity style={styles.tab} onPress={() => handleNavPress("buy")}>
          <Ionicons
            name={activeKey === "buy" ? "car-sport" : "car-sport-outline"}
            size={28}
            color={activeKey === "buy" ? "#235CF8" : "#B4B4B4"}
          />
          <Text style={[styles.label, { color: activeKey === "buy" ? "#235CF8" : "#B4B4B4" }]}>
            Buy a Car
          </Text>
        </TouchableOpacity>

        {/* COMPARE TAB */}
        <TouchableOpacity style={styles.tab} onPress={() => handleNavPress("compare")}>
          <Ionicons
            name={activeKey === "compare" ? "scale" : "scale-outline"}
            size={28}
            color={activeKey === "compare" ? "#235CF8" : "#B4B4B4"}
          />
          <Text style={[styles.label, { color: activeKey === "compare" ? "#235CF8" : "#B4B4B4" }]}>
            Compare
          </Text>
        </TouchableOpacity>

        {/* CHAT TAB */}
        <TouchableOpacity style={styles.tab} onPress={() => handleNavPress("chat")}>
          <Ionicons
            name={activeKey === "chat" ? "chatbubble" : "chatbubble-outline"}
            size={28}
            color={activeKey === "chat" ? "#235CF8" : "#B4B4B4"}
          />
          <Text style={[styles.label, { color: activeKey === "chat" ? "#235CF8" : "#B4B4B4" }]}>
            Chat
          </Text>
        </TouchableOpacity>

        {/* PROFILE TAB */}
        <TouchableOpacity style={styles.tab} onPress={() => handleNavPress("profile")}>
          <Ionicons
            name={activeKey === "profile" ? "person" : "person-outline"}
            size={28}
            color={activeKey === "profile" ? "#235CF8" : "#B4B4B4"}
          />
          <Text style={[styles.label, { color: activeKey === "profile" ? "#235CF8" : "#B4B4B4" }]}>
            Profile
          </Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: { backgroundColor: "#fff" },
  container: {
    flexDirection: "row",
    justifyContent: "space-between",
    paddingVertical: 10,
    paddingHorizontal: 22,
    backgroundColor: "#fff",
    borderTopWidth: 0.3,
    borderTopColor: "#ddd",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: -2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 10,
  },
  tab: { alignItems: "center", justifyContent: "center", flex: 1 },
  label: { fontSize: 12, marginTop: 4, fontWeight: "500" },
});
