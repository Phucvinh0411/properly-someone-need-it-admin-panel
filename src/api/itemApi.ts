export async function getPendingItems(): Promise<AdminItem[]> {
  const res = await axios.get(`${API_BASE_URL}/items?status=PENDING`);
  return res.data;
}

export async function updateItemStatus(itemId: string, status: string): Promise<any> {
  const res = await axios.patch(`${API_BASE_URL}/items/${itemId}/status`, { status });
  return res.data;
}
// src/api/itemApi.ts
import axios from "axios";
import { API_BASE_URL } from "./config";
import type { AdminItem } from "../types/item";

export async function fetchItems(): Promise<AdminItem[]> {
  const res = await axios.get(`${API_BASE_URL}/items`);
  return res.data;
}
