import { useEffect, useState, useMemo } from "react";
import { getPendingItems, updateItemStatus } from "../api/itemApi";
import type { AdminItem } from "../types/item";
import { PendingItemTable } from "../components/PendingItemTable";
import { ImageCarousel } from "../components/ImageCarousel";

export function PendingApprovalPage() {
  const [items, setItems] = useState<AdminItem[]>([]);
  const [search, setSearch] = useState<string>("");
  const [selectedItem, setSelectedItem] = useState<AdminItem | null>(null);
  const [modalOpen, setModalOpen] = useState<boolean>(false);
  const [confirmAction, setConfirmAction] = useState<"approve" | "reject" | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  // Pagination & filter
    const [successMsg, setSuccessMsg] = useState<string | null>(null);
  const [page, setPage] = useState<number>(1);
  const pageSize = 10;
  const [minPrice, setMinPrice] = useState<string>("");
  const [maxPrice, setMaxPrice] = useState<string>("");
  const [dateFrom, setDateFrom] = useState<string>("");
  const [dateTo, setDateTo] = useState<string>("");

  useEffect(() => {
    fetchItems();
    // eslint-disable-next-line
  }, []);

  async function fetchItems(): Promise<void> {
    setLoading(true);
    setError(null);
    try {
      const data = await getPendingItems();
      setItems(data || []);
    } catch {
      setError("Không thể tải dữ liệu bài đăng");
    }
    setLoading(false);
  }

  const filteredItems = useMemo<AdminItem[]>(() => {
    let result = items;
    if (search) {
      result = result.filter(
        (item) =>
          item.title.toLowerCase().includes(search.toLowerCase()) ||
          item.seller?.fullName?.toLowerCase().includes(search.toLowerCase())
      );
    }
    if (minPrice) {
      result = result.filter(item => item.price >= Number(minPrice));
    }
    if (maxPrice) {
      result = result.filter(item => item.price <= Number(maxPrice));
    }
    if (dateFrom) {
      result = result.filter(item => new Date(item.createdAt) >= new Date(dateFrom));
    }
    if (dateTo) {
      result = result.filter(item => new Date(item.createdAt) <= new Date(dateTo));
    }
    return result;
  }, [items, search, minPrice, maxPrice, dateFrom, dateTo]);

  const totalPages: number = Math.ceil(filteredItems.length / pageSize) || 1;
  const pagedItems: AdminItem[] = filteredItems.slice((page - 1) * pageSize, page * pageSize);

  function openDetail(item: AdminItem): void {
    setSelectedItem(item);
    setModalOpen(true);
  }
  function closeDetail(): void {
    setSelectedItem(null);
    setModalOpen(false);
    setConfirmAction(null);
  }
  async function handleAction(action: "approve" | "reject"): Promise<void> {
    if (!selectedItem) return;
    setLoading(true);
    setSuccessMsg(null);
    setError(null);
    try {
      await updateItemStatus(selectedItem._id, action === "approve" ? "ACTIVE" : "DELETED");
      setSuccessMsg(action === "approve" ? "Duyệt bài đăng thành công!" : "Đã ẩn/xóa bài đăng.");
      await fetchItems();
    } catch {
      setError("Có lỗi khi cập nhật trạng thái bài đăng.");
    }
    closeDetail();
    setLoading(false);
  }

  return (
    <div>
      <div className="page-header">
        <h2>Duyệt bài đăng bán</h2>
        <div className="page-filters">
          <input
            className="border px-3 py-2 rounded w-64"
            placeholder="Tìm kiếm theo tiêu đề hoặc người bán..."
            value={search}
            onChange={e => setSearch(e.target.value)}
          />
          <input
            className="border px-2 py-2 rounded w-28 ml-2"
            type="number"
            placeholder="Giá từ"
            value={minPrice}
            onChange={e => setMinPrice(e.target.value)}
          />
          <input
            className="border px-2 py-2 rounded w-28 ml-2"
            type="number"
            placeholder="Giá đến"
            value={maxPrice}
            onChange={e => setMaxPrice(e.target.value)}
          />
          <input
            className="border px-2 py-2 rounded w-36 ml-2"
            type="date"
            placeholder="Từ ngày"
            value={dateFrom}
            onChange={e => setDateFrom(e.target.value)}
          />
          <input
            className="border px-2 py-2 rounded w-36 ml-2"
            type="date"
            placeholder="Đến ngày"
            value={dateTo}
            onChange={e => setDateTo(e.target.value)}
          />
          <button className="ml-2 px-3 py-2 rounded bg-gray-200 hover:bg-gray-300 text-sm" onClick={() => { setSearch(""); setMinPrice(""); setMaxPrice(""); setDateFrom(""); setDateTo(""); setPage(1); }}>Xoá lọc</button>
        </div>
      </div>
      {successMsg && (
        <div className="text-green-600 p-4 font-semibold">{successMsg}</div>
      )}
      {loading ? (
        <div className="text-gray-500 p-4">Đang tải dữ liệu...</div>
      ) : error ? (
        <div className="text-red-500 p-4">{error}</div>
      ) : (
        <>
          <PendingItemTable items={pagedItems} onViewDetail={openDetail} />
          {/* Pagination */}
          <div className="flex justify-center mt-4 gap-2">
            <button disabled={page === 1} onClick={() => setPage(page - 1)} className="px-3 py-1 rounded bg-gray-200 disabled:opacity-50">Trước</button>
            <span className="px-2">Trang {page} / {totalPages}</span>
            <button disabled={page === totalPages} onClick={() => setPage(page + 1)} className="px-3 py-1 rounded bg-gray-200 disabled:opacity-50">Sau</button>
          </div>
        </>
      )}
      {/* Modal chi tiết */}
      {modalOpen && selectedItem && (
        <div className="fixed inset-0 z-50 flex items-center justify-center">
          <div className="absolute inset-0 bg-black opacity-40" onClick={closeDetail} />
          <div className="relative bg-white rounded-lg shadow-xl w-full max-w-2xl mx-4 p-6">
            <h3 className="text-xl font-semibold mb-2">Chi tiết bài đăng</h3>
            <div className="flex flex-col md:flex-row gap-4">
              <div className="flex-1">
                {/* Carousel ảnh */}
                <ImageCarousel images={selectedItem.images || []} />
                <div className="mb-2"><span className="font-semibold">Tiêu đề:</span> {selectedItem.title}</div>
                <div className="mb-2"><span className="font-semibold">Người bán:</span> {selectedItem.seller?.fullName || "-"}</div>
                <div className="mb-2"><span className="font-semibold">Giá:</span> {selectedItem.price?.toLocaleString("vi-VN")} đ</div>
                <div className="mb-2"><span className="font-semibold">Tình trạng:</span> {selectedItem.condition}</div>
                <div className="mb-2"><span className="font-semibold">Thương hiệu:</span> {selectedItem.brand || "-"}</div>
                <div className="mb-2"><span className="font-semibold">Model:</span> {selectedItem.modelName || "-"}</div>
                <div className="mb-2"><span className="font-semibold">Danh mục:</span> {selectedItem.category} {selectedItem.subcategory ? "/ " + selectedItem.subcategory : ""}</div>
                <div className="mb-2"><span className="font-semibold">Vị trí:</span> [{selectedItem.location?.coordinates?.join(", ")}]</div>
                <div className="mb-2"><span className="font-semibold">Mô tả:</span> {selectedItem.description}</div>
                <div className="mb-2"><span className="font-semibold">Lượt xem:</span> {selectedItem.views} | <span className="font-semibold">Yêu thích:</span> {selectedItem.favoritesCount}</div>
                <div className="mb-2"><span className="font-semibold">Ngày đăng:</span> {new Date(selectedItem.createdAt).toLocaleString()}</div>
                <div className="mb-2"><span className="font-semibold">Ngày cập nhật:</span> {new Date(selectedItem.updatedAt).toLocaleString()}</div>
                <div className="mb-2"><span className="font-semibold">Có thương lượng:</span> {selectedItem.isNegotiable ? "Có" : "Không"}</div>
              </div>
            </div>
            <div className="flex justify-end gap-3 mt-4">
              <button className="px-4 py-2 rounded bg-gray-100 text-gray-700 hover:bg-gray-200" onClick={closeDetail}>
                Đóng
              </button>
              <button className="px-4 py-2 rounded bg-red-600 text-white hover:bg-red-700" onClick={() => setConfirmAction("reject")}>Từ chối/Xóa</button>
              <button className="px-4 py-2 rounded bg-green-600 text-white hover:bg-green-700" onClick={() => setConfirmAction("approve")}>Duyệt</button>
            </div>
            {/* Modal xác nhận */}
            {confirmAction && (
              <div className="fixed inset-0 z-60 flex items-center justify-center">
                <div className="absolute inset-0 bg-black opacity-40" />
                <div className="relative bg-white rounded-lg shadow-xl p-6 w-full max-w-sm mx-4">
                  <h4 className="text-lg font-semibold mb-2">Xác nhận thao tác</h4>
                  <p className="mb-4">Bạn có chắc muốn {confirmAction === "approve" ? "duyệt" : "từ chối/xóa"} bài đăng này?</p>
                  <div className="flex justify-end gap-3">
                    <button className="px-4 py-2 rounded bg-gray-100 text-gray-700 hover:bg-gray-200" onClick={() => setConfirmAction(null)}>
                      Huỷ
                    </button>
                    <button className={`px-4 py-2 rounded text-white ${confirmAction === "approve" ? "bg-green-600 hover:bg-green-700" : "bg-red-600 hover:bg-red-700"}`} onClick={() => handleAction(confirmAction)}>
                      Xác nhận
                    </button>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      )}
      {loading && (
        <div className="fixed inset-0 z-50 flex items-center justify-center">
          <div className="bg-white px-6 py-4 rounded shadow text-lg">Đang xử lý...</div>
        </div>
      )}
    </div>
  );
}
