import type {
  KhoangThoiGianDashboard,
  LoaiBaoCao,
} from "@/types/dashboardBaoCao";
import { NHAN_KET_QUA_SUA_CHUA, NHAN_MUC_DO_SU_CO, NHAN_TRANG_THAI_SU_CO } from "@/utils/dinhDangSuCo";
import { NHAN_TRANG_THAI_PHIEU } from "@/utils/baoTri";
import { NHAN_TRANG_THAI_THIET_BI } from "@/utils/kiemTraThietBi";

export const NHAN_KHOANG_THOI_GIAN: Record<KhoangThoiGianDashboard, string> = {
  "7_NGAY": "7 ngày",
  "30_NGAY": "30 ngày",
  THANG_NAY: "Tháng này",
  TUY_CHINH: "Tùy chỉnh",
};

export const NHAN_LOAI_BAO_CAO: Record<LoaiBaoCao, string> = {
  "su-co": "Sự cố",
  "sua-chua": "Sửa chữa",
  "bao-tri": "Bảo trì",
  "thiet-bi": "Thiết bị",
};

export const NHAN_TONG_QUAN: Record<string, string> = {
  tongSuCo: "Tổng sự cố",
  soDangMo: "Đang mở",
  soDaXuLy: "Đã xử lý",
  soDaHuy: "Đã hủy",
  soNghiemTrongDangMo: "Nghiêm trọng đang mở",
  thoiGianXuLyTrungBinh: "Xử lý trung bình",
  tongHoSo: "Tổng hồ sơ",
  soDaSuaXong: "Đã sửa xong",
  soSuaMotPhan: "Sửa một phần",
  soKhongSuaDuoc: "Không sửa được",
  thoiGianSuaChuaTrungBinh: "Sửa chữa trung bình",
  tongPhieu: "Tổng phiếu",
  soHoanThanh: "Hoàn thành",
  soDangThucHien: "Đang thực hiện",
  soQuaHan: "Quá hạn",
  tongDangQuanLy: "Đang quản lý",
  soDangHoatDong: "Đang hoạt động",
  soDangBaoTri: "Đang bảo trì",
  soDangHong: "Đang hỏng",
  soNgungHoatDong: "Ngừng hoạt động",
  soThanhLy: "Thanh lý",
};

export const CAU_HINH_SAP_XEP: Record<LoaiBaoCao, Array<{ giaTri: string; nhan: string }>> = {
  "su-co": [
    { giaTri: "thoiGianBao", nhan: "Thời gian báo" },
    { giaTri: "maSuCo", nhan: "Mã sự cố" },
    { giaTri: "mucDo", nhan: "Mức độ" },
    { giaTri: "trangThai", nhan: "Trạng thái" },
  ],
  "sua-chua": [
    { giaTri: "ngayTao", nhan: "Ngày tạo" },
    { giaTri: "thoiGianHoanThanh", nhan: "Thời gian hoàn thành" },
    { giaTri: "ketQua", nhan: "Kết quả" },
  ],
  "bao-tri": [
    { giaTri: "ngayDuKien", nhan: "Ngày dự kiến" },
    { giaTri: "thoiGianHoanThanh", nhan: "Thời gian hoàn thành" },
    { giaTri: "trangThai", nhan: "Trạng thái" },
  ],
  "thiet-bi": [
    { giaTri: "maThietBi", nhan: "Mã thiết bị" },
    { giaTri: "tenThietBi", nhan: "Tên thiết bị" },
    { giaTri: "trangThai", nhan: "Trạng thái" },
    { giaTri: "ngayTao", nhan: "Ngày tạo" },
  ],
};

export function layNhanEnum(giaTri: string) {
  return (
    NHAN_TRANG_THAI_THIET_BI[giaTri as keyof typeof NHAN_TRANG_THAI_THIET_BI] ??
    NHAN_TRANG_THAI_SU_CO[giaTri as keyof typeof NHAN_TRANG_THAI_SU_CO] ??
    NHAN_MUC_DO_SU_CO[giaTri as keyof typeof NHAN_MUC_DO_SU_CO] ??
    NHAN_TRANG_THAI_PHIEU[giaTri as keyof typeof NHAN_TRANG_THAI_PHIEU] ??
    NHAN_KET_QUA_SUA_CHUA[giaTri as keyof typeof NHAN_KET_QUA_SUA_CHUA] ??
    giaTri
  );
}

export function kiemTraNgayBaoCao(giaTri: string) {
  if (!/^\d{4}-\d{2}-\d{2}$/.test(giaTri)) return false;
  const [nam, thang, ngay] = giaTri.split("-").map(Number);
  const ngayKiemTra = new Date(Date.UTC(nam, thang - 1, ngay));
  return (
    ngayKiemTra.getUTCFullYear() === nam &&
    ngayKiemTra.getUTCMonth() === thang - 1 &&
    ngayKiemTra.getUTCDate() === ngay
  );
}

export function dinhDangSo(giaTri: number) {
  return new Intl.NumberFormat("vi-VN").format(giaTri);
}

export function dinhDangNgayBaoCao(giaTri?: string | null) {
  if (!giaTri) return "—";
  const ngay = new Date(giaTri);
  if (Number.isNaN(ngay.getTime())) return "—";
  return new Intl.DateTimeFormat("vi-VN", { dateStyle: "short" }).format(ngay);
}

export function dinhDangNgayGioBaoCao(giaTri?: string | null) {
  if (!giaTri) return "—";
  const ngay = new Date(giaTri);
  if (Number.isNaN(ngay.getTime())) return "—";
  return new Intl.DateTimeFormat("vi-VN", {
    dateStyle: "short",
    timeStyle: "short",
  }).format(ngay);
}

export function dinhDangThoiLuongPhut(giaTri: number | null, coDuLieu = true) {
  if (!coDuLieu || giaTri === null || giaTri === undefined) return "Chưa đủ dữ liệu";
  if (giaTri < 60) return `${dinhDangSo(giaTri)} phút`;
  const soGio = giaTri / 60;
  return `${new Intl.NumberFormat("vi-VN", { maximumFractionDigits: 1 }).format(soGio)} giờ`;
}

export function layThongBaoLoiModule5(loi: unknown, macDinh: string) {
  return loi instanceof Error && loi.message ? loi.message : macDinh;
}

