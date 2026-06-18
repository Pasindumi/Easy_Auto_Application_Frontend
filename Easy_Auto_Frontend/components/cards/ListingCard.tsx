// components/ListingCard.tsx
import { Ionicons } from "@expo/vector-icons";
import React, { useMemo } from "react";
import { Image, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import StatusBadge, { StatusType } from "../status/StatusBadge";
import { useTheme } from "@/contexts/ThemeContext";


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
  const { colors, isDarkMode } = useTheme();
  const imageSize = cardSize === "small" ? 70 : 80;
  const cardPadding = cardSize === "small" ? 10 : 12;

  // FIX: Convert to lowercase so StatusBadge works
  const statusLower = item.status.toLowerCase() as StatusType;

  const themeStyles = useMemo(() => getStyles(colors, isDarkMode), [colors, isDarkMode]);

  return (
    <View style={[themeStyles.card, { padding: cardPadding }]}>
      <TouchableOpacity onPress={() => onToggleSelect(item.id)} style={themeStyles.checkboxWrapper}>
        <View style={[themeStyles.checkbox, isSelected && themeStyles.checkboxActive]}>
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
            <Text style={{ fontSize: cardSize === "small" ? 14 : 16, fontWeight: "600", color: colors.text.primary }} numberOfLines={1}>
              {item.title}
            </Text>

            {/* Status Badge */}
            <StatusBadge status={statusLower} />
          </View>

          <Text style={{ fontSize: cardSize === "small" ? 12 : 14, color: colors.text.muted, marginTop: 2 }}>
            {item.price} • {item.km}
          </Text>

          {/* Stats */}
          <View style={{ flexDirection: "row", marginTop: 4 }}>
            <View style={themeStyles.statGroup}>
              <Ionicons name="eye-outline" size={12} color={colors.text.muted} />
              <Text style={themeStyles.statText}>{item.views}</Text>
            </View>

            <View style={themeStyles.statGroup}>
              <Ionicons name="heart-outline" size={12} color={colors.text.muted} />
              <Text style={themeStyles.statText}>{item.likes}</Text>
            </View>

            <View style={themeStyles.statGroup}>
              <Ionicons name="chatbubble-outline" size={12} color={colors.text.muted} />
              <Text style={themeStyles.statText}>{item.messages}</Text>
            </View>
          </View>

          {/* Actions */}
          <View style={themeStyles.actionsRow}>
            <TouchableOpacity onPress={() => onEdit(item.id)} style={themeStyles.actionBtn}>
              <Ionicons name="create-outline" size={14} color={colors.primary} />
              <Text style={themeStyles.actionText}>Edit</Text>
            </TouchableOpacity>

            <TouchableOpacity onPress={() => onBoost(item.id)} style={themeStyles.actionBtn}>
              <Ionicons name="rocket-outline" size={14} color={colors.primary} />
              <Text style={themeStyles.actionText}>Boost</Text>
            </TouchableOpacity>

            <TouchableOpacity onPress={() => onShare(item.id)} style={themeStyles.actionBtn}>
              <Ionicons name="share-social-outline" size={14} color={colors.primary} />
              <Text style={themeStyles.actionText}>Share</Text>
            </TouchableOpacity>
          </View>

        </View>
      </View>
    </View>
  );
}

const getStyles = (colors: any, isDarkMode: boolean) => StyleSheet.create({
  card: {
    backgroundColor: colors.backgroundSecondary,
    borderRadius: 12,
    marginHorizontal: 16,
    marginBottom: 12,
    elevation: 2,
    shadowColor: colors.shadow,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
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
    borderColor: colors.border,
    backgroundColor: colors.background,
    alignItems: "center",
    justifyContent: "center",
  },
  checkboxActive: {
    backgroundColor: colors.primary,
    borderColor: colors.primary,
  },
  statGroup: {
    flexDirection: "row",
    marginRight: 12,
  },
  statText: {
    fontSize: 11,
    color: colors.text.muted,
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
    color: colors.primary,
    marginLeft: 4,
  },
});

