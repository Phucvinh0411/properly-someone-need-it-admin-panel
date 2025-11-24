// src/api/itemApi.ts
import axiosClient from "./axiosClient";
import type { AdminItem } from "../types/item";

// Lấy danh sách item đang pending
export async function getPendingItems(): Promise<AdminItem[]> {
  const res = await axiosClient.get(`/items/admin?status=PENDING`);
  return res.data?.data ?? res.data;
}

// Cập nhật trạng thái item
export async function updateItemStatus(
  itemId: string,
  status: string
): Promise<AdminItem> {
  const res = await axiosClient.patch(`/items/${encodeURIComponent(itemId)}/status`, { status });
  return res.data?.data ?? res.data;
}

// Lấy toàn bộ item cho admin
export async function fetchItems(): Promise<AdminItem[]> {
  const res = await axiosClient.get(`/items/admin`);
  return res.data?.data ?? res.data;
}
