import { guiYeuCau } from "./httpClient";
import { LoiHttp } from "@/types/api";
import type {
  DuLieuNhaCungCap,
  KetQuaDanhSach,
  NhaCungCap,
} from "@/types/quanLyThietBi";
import {
  kiemTraEmailKhongBatBuoc,
  kiemTraIdQuanLy,
  kiemTraSoDienThoai,
} from "@/utils/kiemTraQuanLyThietBi";
function kiemTraDuLieuNhaCungCap(duLieu: DuLieuNhaCungCap) {
  if (!duLieu.tenNhaCungCap.trim())
    throw new LoiHttp(0, "Tên nhà cung cấp không được để trống.");
  const loiSo = kiemTraSoDienThoai(duLieu.soDienThoai || "");
  if (loiSo) throw new LoiHttp(0, loiSo);
  const loiEmail = kiemTraEmailKhongBatBuoc(duLieu.email || "");
  if (loiEmail) throw new LoiHttp(0, loiEmail);
}
export function layDanhSachNhaCungCap(boLoc: {
  trang: number;
  gioiHan: number;
  tuKhoa?: string;
}) {
  const thamSo = new URLSearchParams({
    trang: String(boLoc.trang),
    gioiHan: String(boLoc.gioiHan),
  });
  if (boLoc.tuKhoa?.trim()) thamSo.set("tuKhoa", boLoc.tuKhoa.trim());
  return guiYeuCau<KetQuaDanhSach<NhaCungCap>>(`/nha-cung-cap?${thamSo}`);
}
export function themNhaCungCap(duLieu: DuLieuNhaCungCap) {
  kiemTraDuLieuNhaCungCap(duLieu);
  return guiYeuCau<NhaCungCap>("/nha-cung-cap", {
    method: "POST",
    body: JSON.stringify(duLieu),
  });
}
export function capNhatNhaCungCap(id: number, duLieu: DuLieuNhaCungCap) {
  if (!kiemTraIdQuanLy(id))
    throw new LoiHttp(0, "Mã nhà cung cấp không hợp lệ.");
  kiemTraDuLieuNhaCungCap(duLieu);
  return guiYeuCau<NhaCungCap>(`/nha-cung-cap/${id}`, {
    method: "PUT",
    body: JSON.stringify(duLieu),
  });
}
export function layChiTietNhaCungCap(id: number) {
  if (!kiemTraIdQuanLy(id))
    throw new LoiHttp(0, "Mã nhà cung cấp không hợp lệ.");
  return guiYeuCau<NhaCungCap>(`/nha-cung-cap/${id}`);
}
