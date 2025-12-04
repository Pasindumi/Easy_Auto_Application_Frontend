// components/ListingCard.tsx
import { Ionicons } from "@expo/vector-icons";
import React from "react";
import { Image, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import StatusBadge, { StatusType } from "../status/StatusBadge";


export interface Listing {
  id: string;
  title: string;
  price: string;
  km: string;
  views: number;
  likes: number;
  messages: number;
  status: StatusType | string; // incoming may be capitalized
  image: any;
}

interface ListingCardProps {
  item: Listing;
  index: number;
  isSelected: boolean;
  onToggleSelect: (id: string) => void;
  onEdit: (id: string) => void;
  onBoost: (id: string) => void;
  onShare: (id: string) => void;
  cardSize?: "small" | "normal";
}

export default function ListingCard({
  item,
  isSelected,
  onToggleSelect,
  onEdit,
  onBoost,
  onShare,
  cardSize = "normal",
}: ListingCardProps) {
  const imageSize = cardSize === "small" ? 70 : 80;
  const cardPadding = cardSize === "small" ? 10 : 12;

  // FIX: Convert to lowercase so StatusBadge works
  const statusLower = item.status.toLowerCase() as StatusType;

  return (
    <View style={[styles.card, { padding: cardPadding }]}>
      <TouchableOpacity onPress={() => onToggleSelect(item.id)} style={styles.checkboxWrapper}>
        <View style={[styles.checkbox, isSelected && styles.checkboxActive]}>
          {isSelected && <Ionicons name="checkmark" size={12} color="#fff" />}
        </View>
      </TouchableOpacity>

      <View style={{ flexDirection: "row", marginTop: 8 }}>
        <Image
          source={item.image}
          style={{ width: imageSize, height: imageSize, borderRadius: 10 }}
          resizeMode="cover"
        />

        <View style={{ flex: 1, marginLeft: 10 }}>
          <View style={{ flexDirection: "row", justifyContent: "space-between", alignItems: "center" }}>
            <Text style={{ fontSize: cardSize === "small" ? 14 : 16, fontWeight: "600" }} numberOfLines={1}>
              {item.title}
            </Text>

            {/* Status Badge */}
            <StatusBadge status={statusLower} />
          </View>

          <Text style={{ fontSize: cardSize === "small" ? 12 : 14, color: "#6B7280", marginTop: 2 }}>
            {item.price} • {item.km}
          </Text>

          {/* Stats */}
          <View style={{ flexDirection: "row", marginTop: 4 }}>
            <View style={styles.statGroup}>
              <Ionicons name="eye-outline" size={12} color="#9CA3AF" />
              <Text style={styles.statText}>{item.views}</Text>
            </View>

            <View style={styles.statGroup}>
              <Ionicons name="heart-outline" size={12} color="#9CA3AF" />
              <Text style={styles.statText}>{item.likes}</Text>
            </View>

            <View style={styles.statGroup}>
              <Ionicons name="chatbubble-outline" size={12} color="#9CA3AF" />
              <Text style={styles.statText}>{item.messages}</Text>
            </View>
          </View>

          {/* Actions */}
          <View style={styles.actionsRow}>
            <TouchableOpacity onPress={() => onEdit(item.id)} style={styles.actionBtn}>
              <Ionicons name="create-outline" size={14} color="#235CF8" />
              <Text style={styles.actionText}>Edit</Text>
            </TouchableOpacity>

            <TouchableOpacity onPress={() => onBoost(item.id)} style={styles.actionBtn}>
              <Ionicons name="rocket-outline" size={14} color="#235CF8" />
              <Text style={styles.actionText}>Boost</Text>
            </TouchableOpacity>

            <TouchableOpacity onPress={() => onShare(item.id)} style={styles.actionBtn}>
              <Ionicons name="share-social-outline" size={14} color="#235CF8" />
              <Text style={styles.actionText}>Share</Text>
            </TouchableOpacity>
          </View>

        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: "#fff",
    borderRadius: 12,
    marginHorizontal: 16,
    marginBottom: 12,
    elevation: 1,
  },
  checkboxWrapper: {
    position: "absolute",
    top: 8,
    left: 8,
    zIndex: 10,
  },
  checkbox: {
    width: 18,
    height: 18,
    borderRadius: 4,
    borderWidth: 2,
    borderColor: "#D1D5DB",
    backgroundColor: "#fff",
    alignItems: "center",
    justifyContent: "center",
  },
  checkboxActive: {
    backgroundColor: "#235CF8",
    borderColor: "#235CF8",
  },
  statGroup: {
    flexDirection: "row",
    marginRight: 12,
  },
  statText: {
    fontSize: 11,
    color: "#6B7280",
    marginLeft: 2,
  },
  actionsRow: {
    flexDirection: "row",
    marginTop: 6,
    justifyContent: "space-between",
  },
  actionBtn: {
    flexDirection: "row",
    alignItems: "center",
    marginRight: 12,
  },
  actionText: {
    fontSize: 12,
    color: "#235CF8",
    marginLeft: 4,
  },
});
