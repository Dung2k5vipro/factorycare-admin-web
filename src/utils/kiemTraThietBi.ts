import type { TrangThaiThietBi } from "@/types/thietBi";
export const DANH_SACH_TRANG_THAI_THIET_BI: TrangThaiThietBi[] = [
  "DANG_HOAT_DONG",
  "DANG_BAO_TRI",
  "DANG_HONG",
  "NGUNG_HOAT_DONG",
  "THANH_LY",
];
export const NHAN_TRANG_THAI_THIET_BI: Record<TrangThaiThietBi, string> = {
  DANG_HOAT_DONG: "Đang hoạt động",
  DANG_BAO_TRI: "Đang bảo trì",
  DANG_HONG: "Đang hỏng",
  NGUNG_HOAT_DONG: "Ngừng hoạt động",
  THANH_LY: "Thanh lý",
};
export function kiemTraIdHopLe(giaTri: number | null | undefined) {
  return Number.isInteger(giaTri) && Number(giaTri) > 0;
}
export function kiemTraTenThietBi(giaTri: string) {
  return giaTri.trim() ? "" : "Tên thiết bị không được để trống.";
}
export function kiemTraTenLoaiThietBi(giaTri: string) {
  return giaTri.trim() ? "" : "Tên loại thiết bị không được để trống.";
}
export function kiemTraTrangThaiThietBi(
  giaTri: string,
): giaTri is TrangThaiThietBi {
  return DANH_SACH_TRANG_THAI_THIET_BI.includes(giaTri as TrangThaiThietBi);
}
export function kiemTraGiaMua(giaTri: string | number | null | undefined) {
  if (giaTri === "" || giaTri === null || giaTri === undefined) return "";
  const so = Number(giaTri);
  if (!Number.isFinite(so)) return "Giá mua phải là số hợp lệ.";
  return so < 0 ? "Giá mua không được nhỏ hơn 0." : "";
}
export function kiemTraNgayBaoHanh(
  ngayBatDau: string | null | undefined,
  ngayKetThuc: string | null | undefined,
) {
  if (!ngayBatDau || !ngayKetThuc) return "";
  return ngayKetThuc < ngayBatDau
    ? "Ngày hết bảo hành phải sau hoặc bằng ngày bắt đầu."
    : "";
}
