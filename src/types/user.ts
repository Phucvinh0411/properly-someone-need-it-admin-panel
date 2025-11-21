// src/types/user.ts

export interface AdminLocation {
  type: "Point";
  coordinates: [number, number];
}

export interface AdminUserAddress {
  city: string;
  district?: string;
  location?: AdminLocation;
}

export interface AdminUser {
  _id: string; // ObjectId dưới dạng string
  fullName: string;
  phone: string;
  avatar?: string;

  address: AdminUserAddress;

  rating: number;
  reviewCount: number;
  successfulTrades: number;
  cancelledTrades: number;
  trustScore: number;

  isVerified: boolean;
  verifiedAt?: string; // Date serialized từ backend

  isBanned: boolean;
  banReason?: string;
  bannedAt?: string;

  fcmTokens: string[];
  lastActiveAt: string;

  createdAt: string;
  updatedAt: string;
}