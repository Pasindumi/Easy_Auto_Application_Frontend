// Admin Dashboard Dummy Data
// Centralized data for the admin dashboard

export interface DashboardStats {
  totalAds: {
    value: string;
    label: string;
    trend: "up" | "down" | "neutral";
    trendValue: string;
  };
  totalIncome: {
    value: string;
    label: string;
    trend: "up" | "down" | "neutral";
    trendValue: string;
  };
  totalUsers: {
    value: string;
    label: string;
    trend: "up" | "down" | "neutral";
    trendValue: string;
  };
  reports: {
    value: string;
    label: string;
    trend: "up" | "down" | "neutral";
    trendValue: string;
  };
}

export interface QuickAction {
  id: string;
  icon: string;
  label: string;
  description: string;
  badge?: number;
  action: string; // route or action identifier
}

export interface RecentActivity {
  id: string;
  icon: string;
  title: string;
  description: string;
  time: string;
  color: string;
}

export interface Notification {
  id: string;
  title: string;
  time: string;
  unread: boolean;
  icon: string;
  color: string;
}

export interface ProfileInfo {
  name: string;
  email: string;
  imageUrl: string;
}

// Dashboard Stats Data
export const DASHBOARD_STATS: DashboardStats = {
  totalAds: {
    value: "168",
    label: "Active Listing",
    trend: "up",
    trendValue: "+12%",
  },
  totalIncome: {
    value: "Rs. 765,370",
    label: "This Month",
    trend: "up",
    trendValue: "+8.5%",
  },
  totalUsers: {
    value: "150",
    label: "Registered",
    trend: "up",
    trendValue: "+5.2%",
  },
  reports: {
    value: "56",
    label: "Pending",
    trend: "down",
    trendValue: "-3",
  },
};

// Quick Actions Data
export const QUICK_ACTIONS: QuickAction[] = [
  {
    id: "1",
    icon: "car",
    label: "Manage Ads",
    description: "View and approve pending ads",
    badge: 12,
    action: "/admin/ads",
  },
  {
    id: "2",
    icon: "people",
    label: "User Management",
    description: "Manage registered users",
    action: "/admin/users",
  },
  {
    id: "3",
    icon: "document-text",
    label: "Reports",
    description: "Review flagged content",
    badge: 5,
    action: "/admin/reports",
  },
  {
    id: "4",
    icon: "stats-chart",
    label: "Analytics",
    description: "View platform statistics",
    action: "/admin/analytics",
  },
];

// Recent Activity Data
export const RECENT_ACTIVITIES: RecentActivity[] = [
  {
    id: "1",
    icon: "checkmark-circle",
    title: "Ad Approved",
    description: "Mercedes-Benz C-Class approved",
    time: "5 min ago",
    color: "#235CF8",
  },
  {
    id: "2",
    icon: "car",
    title: "New Listing Added",
    description: "BMW X5 posted by Jane Smith",
    time: "15 min ago",
    color: "#10B981",
  },
  {
    id: "3",
    icon: "cash",
    title: "Payment Received",
    description: "Rs. 15,000 from Premium subscription",
    time: "1 hour ago",
    color: "#F59E0B",
  },
  {
    id: "4",
    icon: "alert-circle",
    title: "Reported Listing",
    description: "Listing ID #1234 needs review",
    time: "2 hours ago",
    color: "#EF4444",
  },
];

// Notifications Data
export const NOTIFICATIONS: Notification[] = [
  {
    id: "1",
    title: "New user registered",
    time: "2 min ago",
    unread: true,
    icon: "person-add",
    color: "#235CF8",
  },
  {
    id: "2",
    title: "Payment received",
    time: "15 min ago",
    unread: true,
    icon: "cash",
    color: "#10B981",
  },
  {
    id: "3",
    title: "Listing reported",
    time: "1 hour ago",
    unread: false,
    icon: "alert-circle",
    color: "#F59E0B",
  },
];

// Profile Info
export const ADMIN_PROFILE: ProfileInfo = {
  name: "Sajid Admani",
  email: "sajid@easyauto.com",
  imageUrl:
    "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=200&h=200&fit=crop&auto=format",
};

// Time Filters
export const TIME_FILTERS = ["Today", "Week", "Month", "Year"];
