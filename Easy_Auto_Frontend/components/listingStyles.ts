// components/listingStyles.ts
import { StyleSheet } from "react-native";

export default StyleSheet.create({
  // Container
  container: { flex: 1, backgroundColor: "#F9FAFB" },

  // Header (used by Header.tsx)
  headerWrapper: { backgroundColor: "#235CF8" },
  headerRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 20,
    paddingVertical: 14,
    backgroundColor: "#235CF8",
  },
  headerTitle: { fontSize: 17, fontWeight: "600", color: "#fff", letterSpacing: 0.3 },

  


  // Total Row
  totalRow: { flexDirection: "row", justifyContent: "space-between", alignItems: "center", paddingHorizontal: 20, paddingBottom: 12 },
  totalText: { fontSize: 14, fontWeight: "500", color: "#6B7280" },
  clearFilterText: { fontSize: 14, fontWeight: "600", color: "#235CF8" },

  // Boost card (kept same)
  boostCard: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#F0F7FF",
    borderRadius: 16,
    padding: 16,
    marginHorizontal: 20,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: "#DBEAFE",
    gap: 12,
    shadowColor: "#235CF8",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.06,
    shadowRadius: 8,
    elevation: 3,
  },
  boostIconWrapper: { width: 44, height: 44, borderRadius: 12, backgroundColor: "#DBEAFE", alignItems: "center", justifyContent: "center" },
  boostContent: { flex: 1, gap: 4 },
  boostTitle: { fontSize: 15, fontWeight: "600", color: "#111827" },
  boostDescription: { fontSize: 12, fontWeight: "400", color: "#6B7280", marginBottom: 8 },
  progressBar: { height: 6, backgroundColor: "#E5E7EB", borderRadius: 3, overflow: "hidden" },
  progressFill: { height: 6, backgroundColor: "#25dd6fff", borderRadius: 3 },
  boostMeta: { alignItems: "flex-end", gap: 4 },
  boostPercent: { fontSize: 15, fontWeight: "700", color: "#235CF8" },

  // Bulk actions
  bulkActionsBar: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    backgroundColor: "#fff",
    marginHorizontal: 20,
    marginBottom: 12,
    padding: 12,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: "#E5E7EB",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.06,
    shadowRadius: 6,
    elevation: 3,
  },
  bulkActionsLeft: { flexDirection: "row", gap: 8, flex: 1 },
  bulkActionButton: { flexDirection: "row", alignItems: "center", paddingVertical: 8, paddingHorizontal: 12, borderRadius: 8, backgroundColor: "#F0F7FF", gap: 6 },
  bulkActionButtonDanger: { backgroundColor: "#FEF3F2" },
  bulkActionText: { fontSize: 13, fontWeight: "600", color: "#235CF8" },
  bulkActionTextDanger: { color: "#EF4444" },

  // Select all row
  selectAllRow: { flexDirection: "row", alignItems: "center", paddingHorizontal: 20, paddingVertical: 12, marginBottom: 8, gap: 10 },
  selectAllText: { fontSize: 14, fontWeight: "500", color: "#111827" },
  selectedCount: { marginLeft: "auto", fontSize: 13, fontWeight: "600", color: "#235CF8" },

  // Listing Card
  listingCard: { backgroundColor: "#fff", marginHorizontal: 20, marginBottom: 16, borderRadius: 20, overflow: "hidden", borderWidth: 1, borderColor: "#F0F0F0", shadowColor: "#000", shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.05, shadowRadius: 8, elevation: 3 },
  lastCard: { marginBottom: 24 },

  // Card header / checkbox
  cardHeader: { position: "absolute", top: 16, left: 16, zIndex: 10 },
  checkboxWrapper: { width: 24, height: 24, alignItems: "center", justifyContent: "center" },
  checkbox: { width: 22, height: 22, borderRadius: 6, borderWidth: 2, borderColor: "#D1D5DB", alignItems: "center", justifyContent: "center", backgroundColor: "#fff" },
  checkboxActive: { backgroundColor: "#235CF8", borderColor: "#235CF8" },

  cardBody: { flexDirection: "row", padding: 16, paddingTop: 48, gap: 14 },
  imageWrapper: { position: "relative" },
  carImage: { width: 104, height: 78, borderRadius: 14, backgroundColor: "#F5F5F5" },
  imageBadge: { position: "absolute", top: 8, right: 8, width: 22, height: 22, borderRadius: 11, backgroundColor: "#10B981", alignItems: "center", justifyContent: "center", borderWidth: 2.5, borderColor: "#fff" },
  activeIndicatorDot: { width: 7, height: 7, borderRadius: 3.5, backgroundColor: "#fff" },

  contentSection: { flex: 1, gap: 10 },
  titleRow: { flexDirection: "row", justifyContent: "space-between", alignItems: "flex-start", gap: 10, marginBottom: 4 },
  title: { flex: 1, fontSize: 17, fontWeight: "600", color: "#111827", letterSpacing: -0.2 },

  statusBadge: { flexDirection: "row", alignItems: "center", paddingHorizontal: 9, paddingVertical: 5, borderRadius: 10, gap: 6 },
  activeBadge: { backgroundColor: "#ECFDF5", borderWidth: 1, borderColor: "#D1FAE5" },
  pauseBadge: { backgroundColor: "#FEF3F2", borderWidth: 1, borderColor: "#FEE4E2" },
  statusIndicator: { width: 6, height: 6, borderRadius: 3 },
  statusIndicatorActive: { backgroundColor: "#10B981" },
  statusIndicatorPaused: { backgroundColor: "#EF4444" },
  statusText: { fontSize: 11, fontWeight: "600", color: "#6B7280", letterSpacing: 0.3 },
  activeStatusText: { color: "#10B981" },

  priceSection: { flexDirection: "row", alignItems: "baseline", gap: 10, marginTop: 2 },
  price: { fontSize: 19, fontWeight: "700", color: "#235CF8", letterSpacing: -0.3 },
  mileage: { fontSize: 13, fontWeight: "500", color: "#9CA3AF", letterSpacing: 0.1 },

  statsSection: { flexDirection: "row", gap: 18, marginTop: 6, paddingTop: 10, borderTopWidth: 1, borderTopColor: "#F5F5F5" },
  statItem: { flexDirection: "row", alignItems: "center", gap: 5 },
  statValue: { fontSize: 13, fontWeight: "500", color: "#6B7280" },

  actionButtonsRow: { flexDirection: "row", backgroundColor: "#FAFAFA", borderTopWidth: 1, borderTopColor: "#F0F0F0", height: 56 },
  actionButton: { flex: 1, flexDirection: "row", alignItems: "center", justifyContent: "center", gap: 6, height: "100%" },
  actionDivider: { width: 1, backgroundColor: "#F0F0F0", height: 32, alignSelf: "center" },
  actionLabel: { fontSize: 13, fontWeight: "600", color: "#235CF8", letterSpacing: 0.1 },

  // Empty state
  emptyContainer: { paddingVertical: 80, paddingHorizontal: 40, alignItems: "center", justifyContent: "center" },
  emptyIconWrapper: { width: 96, height: 96, borderRadius: 48, backgroundColor: "#F9FAFB", alignItems: "center", justifyContent: "center", marginBottom: 24, borderWidth: 1, borderColor: "#F3F4F6" },
  emptyTitle: { fontSize: 18, fontWeight: "600", color: "#111827", marginBottom: 8, textAlign: "center" },
  emptyMessage: { fontSize: 14, fontWeight: "400", color: "#6B7280", textAlign: "center", lineHeight: 20, marginBottom: 24 },
  emptyButton: { flexDirection: "row", alignItems: "center", backgroundColor: "#235CF8", paddingHorizontal: 24, paddingVertical: 12, borderRadius: 12, gap: 8 },
  emptyButtonText: { fontSize: 14, fontWeight: "600", color: "#fff" },

  listContent: { paddingBottom: 32 },
});
