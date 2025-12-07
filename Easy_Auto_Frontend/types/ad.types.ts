export type AdStatus = 'all' | 'pending' | 'active' | 'rejected' | 'expired';
export type NavTab = 'Dashboard' | 'Ads' | 'Users' | 'Analytics' | 'Settings';

export interface Ad {
  id: string;
  title: string;
  price: string;
  priceNum: number;
  location: string;
  userName: string;
  userEmail: string;
  userPhone: string;
  views: number;
  likes: number;
  messages: number;
  status: Exclude<AdStatus, 'all'>; // 'all' is a filter state, not an ad property
  postedDate: string;
  expiryDate: string;
  description: string;
  mileage: string;
  year: number;
  fuelType: string;
  transmission: string;
  image: any; // Using 'any' for require() images, ideally ImageSourcePropType
}
