// src/types/item.ts

export type ItemCategory =
  | "PHONE"
  | "LAPTOP"
  | "TABLET"
  | "WATCH"
  | "HEADPHONE"
  | "ACCESSORY"
  | "OTHER";

export type ItemCondition = "LIKE_NEW" | "GOOD" | "FAIR" | "POOR";

export type ItemStatus = "ACTIVE" | "PENDING" | "SOLD" | "DELETED";

export interface ItemLocation {
  type: "Point";
  coordinates: [number, number];
}

export interface AdminItem {
  _id: string;
  sellerId: string;

  title: string;
  description: string;

  category: ItemCategory;
  subcategory?: string;
  brand?: string;
  modelName?: string;

  condition: ItemCondition;

  price: number;
  isNegotiable: boolean;

  images: string[];
  location: ItemLocation;

  status: ItemStatus;

  views: number;
  favoritesCount: number;

  createdAt: string;
  updatedAt: string;
}