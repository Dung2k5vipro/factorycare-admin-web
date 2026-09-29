import type {
  DonViChuKy,
  TrangThaiKeHoach,
  TrangThaiMauChecklist,
  TrangThaiPhieuBaoTri,
} from "@/types/baoTri";

export const NHAN_DON_VI_CHU_KY: Record<DonViChuKy, string> = {
  NGAY: "Ngày",
  TUAN: "Tuần",
  THANG: "Tháng",
  NAM: "Năm",
};

export const NHAN_TRANG_THAI_KE_HOACH: Record<TrangThaiKeHoach, string> = {
  HOAT_DONG: "Hoạt động",
  NGUNG_HOAT_DONG: "Ngừng hoạt động",
};

export const NHAN_TRANG_THAI_MAU: Record<TrangThaiMauChecklist, string> = {
  HOAT_DONG: "Hoạt động",
  NGUNG_HOAT_DONG: "Ngừng hoạt động",
};

export const NHAN_TRANG_THAI_PHIEU: Record<TrangThaiPhieuBaoTri, string> = {
  CHO_THUC_HIEN: "Chờ thực hiện",
  DANG_THUC_HIEN: "Đang thực hiện",
  HOAN_THANH: "Hoàn thành",
  QUA_HAN: "Quá hạn",
  DA_HUY: "Đã hủy",
};

export function kiemTraIdHopLe(giaTri: unknown): giaTri is number {
  return Number.isInteger(giaTri) && Number(giaTri) > 0;
}

export function dinhDangNgay(giaTri?: string | null) {
  if (!giaTri) return "-";
  const phanNgay = giaTri.match(/^\d{4}-\d{2}-\d{2}/)?.[0];
  if (!phanNgay) return "-";
  const [nam, thang, ngay] = phanNgay.split("-").map(Number);
  const ngayHopLe = new Date(nam, thang - 1, ngay);
  if (
    Number.isNaN(ngayHopLe.getTime()) ||
    ngayHopLe.getFullYear() !== nam ||
    ngayHopLe.getMonth() !== thang - 1 ||
    ngayHopLe.getDate() !== ngay
  ) {
    return "-";
  }
  return new Intl.DateTimeFormat("vi-VN").format(ngayHopLe);
}

export function dinhDangNgayGio(giaTri?: string | null) {
  if (!giaTri) return "-";
  const ngay = new Date(giaTri);
  if (Number.isNaN(ngay.getTime())) return "-";
  return new Intl.DateTimeFormat("vi-VN", {
    dateStyle: "medium",
    timeStyle: "short",
  }).format(ngay);
}

export function layTongSoTrang(phanTrang?: {
  tongTrang?: number;
  tongSoTrang?: number;
}) {
  return phanTrang?.tongTrang ?? phanTrang?.tongSoTrang ?? 0;
}

export function layTenLoi(loi: unknown, thongBaoMacDinh: string) {
  return loi instanceof Error && loi.message ? loi.message : thongBaoMacDinh;
}

export function layLopTrangThai(trangThai: string) {
  return `bao-tri-${trangThai.toLowerCase().replaceAll("_", "-")}`;
}
