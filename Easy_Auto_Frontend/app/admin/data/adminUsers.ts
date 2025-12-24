// Admin Users Management Dummy Data

export type UserRole = "admin" | "user" | "premium";
export type UserStatus = "active" | "suspended" | "pending";

export interface User {
  id: string;
  name: string;
  email: string;
  phone: string;
  avatar: string;
  role: UserRole;
  status: UserStatus;
  verified: boolean;
  registrationDate: string;
  lastActive: string;
  adsPosted: number;
  totalRevenue: number;
  location: string;
}

export const ADMIN_USERS_DATA: User[] = [
  {
    id: "1",
    name: "John Anderson",
    email: "john.anderson@example.com",
    phone: "+94 77 123 4567",
    avatar: "https://i.pravatar.cc/150?img=12",
    role: "premium",
    status: "active",
    verified: true,
    registrationDate: "2024-01-15",
    lastActive: "2 hours ago",
    adsPosted: 12,
    totalRevenue: 45000,
    location: "Colombo, Sri Lanka",
  },
  {
    id: "2",
    name: "Sarah Mitchell",
    email: "sarah.mitchell@example.com",
    phone: "+94 77 234 5678",
    avatar: "https://i.pravatar.cc/150?img=5",
    role: "user",
    status: "active",
    verified: true,
    registrationDate: "2024-02-20",
    lastActive: "1 day ago",
    adsPosted: 5,
    totalRevenue: 18000,
    location: "Kandy, Sri Lanka",
  },
  {
    id: "3",
    name: "Michael Chen",
    email: "michael.chen@example.com",
    phone: "+94 77 345 6789",
    avatar: "https://i.pravatar.cc/150?img=33",
    role: "admin",
    status: "active",
    verified: true,
    registrationDate: "2023-11-10",
    lastActive: "Just now",
    adsPosted: 0,
    totalRevenue: 0,
    location: "Galle, Sri Lanka",
  },
  {
    id: "4",
    name: "Emma Williams",
    email: "emma.williams@example.com",
    phone: "+94 77 456 7890",
    avatar: "https://i.pravatar.cc/150?img=9",
    role: "premium",
    status: "active",
    verified: true,
    registrationDate: "2024-03-05",
    lastActive: "5 hours ago",
    adsPosted: 8,
    totalRevenue: 32000,
    location: "Negombo, Sri Lanka",
  },
  {
    id: "5",
    name: "David Brown",
    email: "david.brown@example.com",
    phone: "+94 77 567 8901",
    avatar: "https://i.pravatar.cc/150?img=14",
    role: "user",
    status: "suspended",
    verified: false,
    registrationDate: "2024-04-12",
    lastActive: "2 weeks ago",
    adsPosted: 3,
    totalRevenue: 8500,
    location: "Malabe, Sri Lanka",
  },
  {
    id: "6",
    name: "Lisa Garcia",
    email: "lisa.garcia@example.com",
    phone: "+94 77 678 9012",
    avatar: "https://i.pravatar.cc/150?img=10",
    role: "user",
    status: "pending",
    verified: false,
    registrationDate: "2024-05-18",
    lastActive: "3 days ago",
    adsPosted: 1,
    totalRevenue: 2500,
    location: "Gampaha, Sri Lanka",
  },
  {
    id: "7",
    name: "James Wilson",
    email: "james.wilson@example.com",
    phone: "+94 77 789 0123",
    avatar: "https://i.pravatar.cc/150?img=52",
    role: "premium",
    status: "active",
    verified: true,
    registrationDate: "2024-01-28",
    lastActive: "Today",
    adsPosted: 15,
    totalRevenue: 58000,
    location: "Colombo, Sri Lanka",
  },
  {
    id: "8",
    name: "Sophia Martinez",
    email: "sophia.martinez@example.com",
    phone: "+94 77 890 1234",
    avatar: "https://i.pravatar.cc/150?img=47",
    role: "user",
    status: "active",
    verified: true,
    registrationDate: "2024-03-22",
    lastActive: "Yesterday",
    adsPosted: 4,
    totalRevenue: 12000,
    location: "Kandy, Sri Lanka",
  },
  {
    id: "9",
    name: "Robert Taylor",
    email: "robert.taylor@example.com",
    phone: "+94 77 901 2345",
    avatar: "https://i.pravatar.cc/150?img=15",
    role: "user",
    status: "active",
    verified: false,
    registrationDate: "2024-04-30",
    lastActive: "1 week ago",
    adsPosted: 2,
    totalRevenue: 5000,
    location: "Matara, Sri Lanka",
  },
  {
    id: "10",
    name: "Olivia Johnson",
    email: "olivia.johnson@example.com",
    phone: "+94 77 012 3456",
    avatar: "https://i.pravatar.cc/150?img=20",
    role: "premium",
    status: "active",
    verified: true,
    registrationDate: "2024-02-14",
    lastActive: "30 min ago",
    adsPosted: 10,
    totalRevenue: 40000,
    location: "Colombo, Sri Lanka",
  },
];

// User statistics
export const USER_STATS = {
  total: ADMIN_USERS_DATA.length,
  active: ADMIN_USERS_DATA.filter((u) => u.status === "active").length,
  suspended: ADMIN_USERS_DATA.filter((u) => u.status === "suspended").length,
  pending: ADMIN_USERS_DATA.filter((u) => u.status === "pending").length,
  premium: ADMIN_USERS_DATA.filter((u) => u.role === "premium").length,
  verified: ADMIN_USERS_DATA.filter((u) => u.verified).length,
};
