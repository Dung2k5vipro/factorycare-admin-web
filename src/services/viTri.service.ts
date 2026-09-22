import { guiYeuCau } from "./httpClient";
import { LoiHttp } from "@/types/api";
import type {
  CayViTri,
  DuLieuViTri,
  KetQuaDanhSach,
  LoaiViTri,
} from "@/types/quanLyThietBi";
import {
  kiemTraIdQuanLy,
  kiemTraLoaiViTri,
} from "@/utils/kiemTraQuanLyThietBi";
export function layCayViTri() {
  return guiYeuCau<CayViTri[]>("/vi-tri/cay");
}
export function layDanhSachViTriQuanLy(boLoc: {
  trang: number;
  gioiHan: number;
  tuKhoa?: string;
  loaiViTri?: LoaiViTri;
}) {
  const thamSo = new URLSearchParams({
    trang: String(boLoc.trang),
    gioiHan: String(boLoc.gioiHan),
  });
  if (boLoc.tuKhoa?.trim()) thamSo.set("tuKhoa", boLoc.tuKhoa.trim());
  if (boLoc.loaiViTri) thamSo.set("loaiViTri", boLoc.loaiViTri);
  return guiYeuCau<KetQuaDanhSach<CayViTri>>(`/vi-tri?${thamSo}`);
}
export function themViTri(duLieu: DuLieuViTri) {
  if (!kiemTraLoaiViTri(duLieu.loaiViTri))
    throw new LoiHttp(0, "Loại vị trí không hợp lệ.");
  return guiYeuCau<CayViTri>("/vi-tri", {
    method: "POST",
    body: JSON.stringify(duLieu),
  });
}
export function capNhatViTri(id: number, duLieu: DuLieuViTri) {
  if (!kiemTraIdQuanLy(id) || !kiemTraLoaiViTri(duLieu.loaiViTri))
    throw new LoiHttp(0, "Dữ liệu vị trí không hợp lệ.");
  return guiYeuCau<CayViTri>(`/vi-tri/${id}`, {
    method: "PUT",
    body: JSON.stringify(duLieu),
  });
}
export function layChiTietViTri(id: number) {
  if (!kiemTraIdQuanLy(id)) throw new LoiHttp(0, "Mã vị trí không hợp lệ.");
  return guiYeuCau<CayViTri>(`/vi-tri/${id}`);
}
