import { guiYeuCau, guiYeuCauMultipart } from "./httpClient";
import { LoiHttp } from "@/types/api";
import type {
  DuLieuLoNhap,
  KetQuaDanhSach,
  LoNhap,
} from "@/types/quanLyThietBi";
import {
  kiemTraIdQuanLy,
  kiemTraSoTienKhongAm,
} from "@/utils/kiemTraQuanLyThietBi";
function kiemTraDuLieuLoNhap(duLieu: DuLieuLoNhap) {
  if (!duLieu.maLo.trim()) throw new LoiHttp(0, "Mã lô không được để trống.");
  if (!duLieu.ngayNhap || Number.isNaN(new Date(duLieu.ngayNhap).getTime()))
    throw new LoiHttp(0, "Ngày nhập không hợp lệ.");
  const loiTien = kiemTraSoTienKhongAm(duLieu.tongGiaTri, "Tổng giá trị");
  if (loiTien) throw new LoiHttp(0, loiTien);
  if (
    duLieu.nhaCungCapId !== null &&
    duLieu.nhaCungCapId !== undefined &&
    !kiemTraIdQuanLy(duLieu.nhaCungCapId)
  )
    throw new LoiHttp(0, "Nhà cung cấp không hợp lệ.");
}
function taoFormData(duLieu: DuLieuLoNhap) {
  const formData = new FormData();
  formData.append("maLo", duLieu.maLo.trim());
  if (duLieu.nhaCungCapId)
    formData.append("nhaCungCapId", String(duLieu.nhaCungCapId));
  if (duLieu.soHoaDon?.trim())
    formData.append("soHoaDon", duLieu.soHoaDon.trim());
  formData.append("ngayNhap", duLieu.ngayNhap);
  if (duLieu.tongGiaTri !== null && duLieu.tongGiaTri !== undefined)
    formData.append("tongGiaTri", String(duLieu.tongGiaTri));
  if (duLieu.ghiChu?.trim()) formData.append("ghiChu", duLieu.ghiChu.trim());
  if (duLieu.fileHoaDon) formData.append("fileHoaDon", duLieu.fileHoaDon);
  return formData;
}
export function layDanhSachLoNhapQuanLy(boLoc: {
  trang: number;
  gioiHan: number;
  tuKhoa?: string;
  nhaCungCapId?: number;
}) {
  const thamSo = new URLSearchParams({
    trang: String(boLoc.trang),
    gioiHan: String(boLoc.gioiHan),
  });
  if (boLoc.tuKhoa?.trim()) thamSo.set("tuKhoa", boLoc.tuKhoa.trim());
  if (boLoc.nhaCungCapId)
    thamSo.set("nhaCungCapId", String(boLoc.nhaCungCapId));
  return guiYeuCau<KetQuaDanhSach<LoNhap>>(`/lo-nhap?${thamSo}`);
}
export function themLoNhap(duLieu: DuLieuLoNhap) {
  kiemTraDuLieuLoNhap(duLieu);
  return guiYeuCauMultipart<LoNhap>("/lo-nhap", taoFormData(duLieu));
}
export function capNhatLoNhap(id: number, duLieu: DuLieuLoNhap) {
  if (!kiemTraIdQuanLy(id)) throw new LoiHttp(0, "Mã lô không hợp lệ.");
  kiemTraDuLieuLoNhap(duLieu);
  return guiYeuCauMultipart<LoNhap>(
    `/lo-nhap/${id}`,
    taoFormData(duLieu),
    "PUT",
  );
}
export function layChiTietLoNhap(id: number) {
  if (!kiemTraIdQuanLy(id)) throw new LoiHttp(0, "Mã lô không hợp lệ.");
  return guiYeuCau<LoNhap>(`/lo-nhap/${id}`);
}
export function layThietBiTheoLo(id: number) {
  if (!kiemTraIdQuanLy(id)) throw new LoiHttp(0, "Mã lô không hợp lệ.");
  return guiYeuCau<KetQuaDanhSach<unknown>>(
    `/lo-nhap/${id}/thiet-bi?trang=1&gioiHan=100`,
  );
}
