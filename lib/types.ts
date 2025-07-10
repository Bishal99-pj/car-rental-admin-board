export interface User {
  id: string;
  email: string;
  name: string;
  role: 'admin' | 'user';
  createdAt: Date;
}

export interface Listing {
  id: string;
  title: string;
  description: string;
  price: number;
  location: string;
  carModel: string;
  carYear: number;
  mileage: number;
  fuelType: 'gasoline' | 'diesel' | 'electric' | 'hybrid';
  transmission: 'manual' | 'automatic';
  images: string[];
  status: ListingStatus;
  userId: string;
  createdAt: Date;
  updatedAt: Date;
}

export type ListingStatus = 'pending' | 'approved' | 'rejected';

export interface AuditLog {
  id: string;
  action: 'approve' | 'reject' | 'edit' | 'login' | 'logout';
  adminId: string;
  adminName: string;
  listingId?: string;
  listingTitle?: string;
  details?: string;
  timestamp: Date;
}

export interface LoginCredentials {
  email: string;
  password: string;
}

export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  error?: string;
} 