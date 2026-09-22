import { guiYeuCau } from "./httpClient";
import { LoiHttp } from "@/types/api";
import type { BoLocSuCo, KetQuaDanhSachKyThuatVien, KetQuaDanhSachSuCo, SuCo } from "@/types/suCo";
import { kiemTraNgay } from "@/utils/dinhDangSuCo";

const DANH_SACH_MUC_DO = ["THAP", "TRUNG_BINH", "CAO", "NGHIEM_TRONG"];
const DANH_SACH_TRANG_THAI = ["MOI", "DA_PHAN_CONG", "DANG_XU_LY", "DA_XU_LY", "DA_HUY"];

export function kiemTraIdSuCo(id: unknown): id is number {
  return typeof id === "number" && Number.isSafeInteger(id) && id > 0;
}

export function layDanhSachSuCo(boLoc: BoLocSuCo) {
  if (!kiemTraIdSuCo(boLoc.trang) || !kiemTraIdSuCo(boLoc.gioiHan) || boLoc.gioiHan > 100) {
    throw new LoiHttp(0, "Thông tin phân trang không hợp lệ.");
  }
  if ((boLoc.thietBiId !== undefined && !kiemTraIdSuCo(boLoc.thietBiId)) ||
      (boLoc.kyThuatVienId !== undefined && !kiemTraIdSuCo(boLoc.kyThuatVienId)) ||
      (boLoc.mucDo !== undefined && !DANH_SACH_MUC_DO.includes(boLoc.mucDo)) ||
      (boLoc.trangThai !== undefined && !DANH_SACH_TRANG_THAI.includes(boLoc.trangThai)) ||
      (boLoc.tuNgay !== undefined && !kiemTraNgay(boLoc.tuNgay)) ||
      (boLoc.denNgay !== undefined && !kiemTraNgay(boLoc.denNgay)) ||
      (boLoc.tuNgay && boLoc.denNgay && boLoc.tuNgay > boLoc.denNgay) ||
      (boLoc.tuKhoa !== undefined && (typeof boLoc.tuKhoa !== "string" || boLoc.tuKhoa.trim().length > 200))) {
    throw new LoiHttp(0, "Bộ lọc không hợp lệ.");
  }
  const thamSo = new URLSearchParams({ trang: String(boLoc.trang), gioiHan: String(boLoc.gioiHan) });
  if (boLoc.tuKhoa?.trim()) thamSo.set("tuKhoa", boLoc.tuKhoa.trim());
  if (boLoc.mucDo) thamSo.set("mucDo", boLoc.mucDo);
  if (boLoc.trangThai) thamSo.set("trangThai", boLoc.trangThai);
  if (boLoc.thietBiId) thamSo.set("thietBiId", String(boLoc.thietBiId));
  if (boLoc.kyThuatVienId) thamSo.set("kyThuatVienId", String(boLoc.kyThuatVienId));
  if (boLoc.tuNgay) thamSo.set("tuNgay", boLoc.tuNgay);
  if (boLoc.denNgay) thamSo.set("denNgay", boLoc.denNgay);
  return guiYeuCau<KetQuaDanhSachSuCo>(`/su-co?${thamSo}`);
}

export function layChiTietSuCo(id: number) {
  if (!kiemTraIdSuCo(id)) throw new LoiHttp(0, "Mã sự cố không hợp lệ.");
  return guiYeuCau<SuCo>(`/su-co/${id}`);
}

export function layDanhSachKyThuatVien(trang = 1, tuKhoa = "") {
  if (!kiemTraIdSuCo(trang)) throw new LoiHttp(0, "Trang không hợp lệ.");
  if (typeof tuKhoa !== "string" || tuKhoa.trim().length > 200) {
    throw new LoiHttp(0, "Từ khóa tìm kỹ thuật viên không hợp lệ.");
  }
  const thamSo = new URLSearchParams({ trang: String(trang), gioiHan: "100" });
  if (tuKhoa.trim()) thamSo.set("tuKhoa", tuKhoa.trim());
  return guiYeuCau<KetQuaDanhSachKyThuatVien>(`/su-co/ky-thuat-vien?${thamSo}`);
}

export function phanCongKyThuatVien(suCoId: number, kyThuatVienId: number) {
  if (!kiemTraIdSuCo(suCoId) || !kiemTraIdSuCo(kyThuatVienId)) {
    throw new LoiHttp(0, "Mã sự cố hoặc kỹ thuật viên không hợp lệ.");
  }
  return guiYeuCau<SuCo>(`/su-co/${suCoId}/phan-cong`, {
    method: "POST",
    body: JSON.stringify({ kyThuatVienId }),
  });
}
