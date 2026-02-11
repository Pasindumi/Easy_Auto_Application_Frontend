// Admin Analytics Dummy Data
// Centralized data for the admin analytics page

export interface RevenueData {
  date: string;
  value: number;
  label: string;
}

export interface UserGrowthData {
  date: string;
  newUsers: number;
  activeUsers: number;
}

export interface AdPerformanceData {
  category: string;
  views: number;
  clicks: number;
  conversions: number;
  revenue: number;
}

export interface TrafficSource {
  source: string;
  visits: number;
  percentage: number;
  color: string;
}

export interface TopPerformingAd {
  id: string;
  title: string;
  views: number;
  clicks: number;
  conversionRate: number;
  revenue: number;
}

// Revenue Data (Last 30 days)
export const REVENUE_DATA: RevenueData[] = [
  { date: "Jan 1", value: 12450, label: "$12.4K" },
  { date: "Jan 5", value: 15200, label: "$15.2K" },
  { date: "Jan 10", value: 13800, label: "$13.8K" },
  { date: "Jan 15", value: 18750, label: "$18.7K" },
  { date: "Jan 20", value: 16200, label: "$16.2K" },
  { date: "Jan 25", value: 21400, label: "$21.4K" },
  { date: "Jan 30", value: 19800, label: "$19.8K" },
];

// User Growth Data (Last 7 days)
export const USER_GROWTH_DATA: UserGrowthData[] = [
  { date: "Mon", newUsers: 45, activeUsers: 420 },
  { date: "Tue", newUsers: 52, activeUsers: 445 },
  { date: "Wed", newUsers: 38, activeUsers: 435 },
  { date: "Thu", newUsers: 61, activeUsers: 468 },
  { date: "Fri", newUsers: 48, activeUsers: 452 },
  { date: "Sat", newUsers: 55, activeUsers: 478 },
  { date: "Sun", newUsers: 42, activeUsers: 460 },
];

// Ad Performance by Category
export const AD_PERFORMANCE_DATA: AdPerformanceData[] = [
  {
    category: "Luxury Cars",
    views: 15420,
    clicks: 1240,
    conversions: 89,
    revenue: 125000,
  },
  {
    category: "SUV",
    views: 22300,
    clicks: 1890,
    conversions: 142,
    revenue: 98000,
  },
  {
    category: "Sedan",
    views: 18900,
    clicks: 1520,
    conversions: 118,
    revenue: 76000,
  },
  {
    category: "Sports Cars",
    views: 12400,
    clicks: 980,
    conversions: 76,
    revenue: 145000,
  },
  {
    category: "Electric",
    views: 16700,
    clicks: 1340,
    conversions: 95,
    revenue: 112000,
  },
];

// Traffic Sources
export const TRAFFIC_SOURCES: TrafficSource[] = [
  { source: "Direct", visits: 45200, percentage: 42, color: "#3B82F6" },
  { source: "Organic Search", visits: 32400, percentage: 30, color: "#10B981" },
  { source: "Social Media", visits: 18900, percentage: 18, color: "#F59E0B" },
  { source: "Referral", visits: 8900, percentage: 8, color: "#8B5CF6" },
  { source: "Paid Ads", visits: 2600, percentage: 2, color: "#EF4444" },
];

// Top Performing Ads
export const TOP_PERFORMING_ADS: TopPerformingAd[] = [
  {
    id: "1",
    title: "BMW 3 Series 2021",
    views: 15420,
    clicks: 1240,
    conversionRate: 8.0,
    revenue: 45000,
  },
  {
    id: "2",
    title: "Mercedes-Benz C-Class",
    views: 13800,
    clicks: 1100,
    conversionRate: 8.0,
    revenue: 52000,
  },
  {
    id: "3",
    title: "Audi A4 Premium",
    views: 12600,
    clicks: 980,
    conversionRate: 7.8,
    revenue: 48000,
  },
  {
    id: "4",
    title: "Tesla Model 3",
    views: 14200,
    clicks: 1150,
    conversionRate: 8.1,
    revenue: 55000,
  },
  {
    id: "5",
    title: "Porsche 911",
    views: 9800,
    clicks: 780,
    conversionRate: 8.0,
    revenue: 125000,
  },
];

// Summary Statistics
export const ANALYTICS_SUMMARY = {
  totalRevenue: {
    value: "$456,780",
    change: "+12.5%",
    changeType: "up" as const,
    period: "vs last month",
  },
  totalUsers: {
    value: "8,420",
    change: "+8.1%",
    changeType: "up" as const,
    period: "vs last month",
  },
  totalAds: {
    value: "1,248",
    change: "+5.2%",
    changeType: "up" as const,
    period: "vs last week",
  },
  conversionRate: {
    value: "7.8%",
    change: "+0.5%",
    changeType: "up" as const,
    period: "vs last month",
  },
  avgSessionDuration: {
    value: "4m 32s",
    change: "+12s",
    changeType: "up" as const,
    period: "vs last month",
  },
  bounceRate: {
    value: "32.4%",
    change: "-2.1%",
    changeType: "down" as const,
    period: "vs last month",
  },
};

