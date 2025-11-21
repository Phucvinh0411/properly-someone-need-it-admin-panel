import { API_BASE_URL } from "./config";

async function handleRes(res: Response) {
  if (!res.ok) throw new Error(await res.text() || res.statusText);
  return res.json();
}

/** Lấy tất cả orders (dùng để tính thống kê theo seller) */
export async function fetchOrders(): Promise<any[]> {
  const res = await fetch(`${API_BASE_URL}/orders`);
  return handleRes(res);
}