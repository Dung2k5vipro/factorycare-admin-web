import { guiYeuCau, guiYeuCauMultipart } from "./httpClient";
import { LoiHttp } from "@/types/api";
import type {
  BoLocThietBi,
  DuLieuThemThietBi,
  KetQuaDanhSachThietBi,
  LoaiThietBi,
  ThietBi,
  TrangThaiThietBi,
  ViTri,
  LoNhap,
} from "@/types/thietBi";
import type {
  DuLieuDieuChuyen,
  KetQuaImport,
  LichSuDieuChuyen,
} from "@/types/quanLyThietBi";
import {
  kiemTraIdHopLe,
  kiemTraTrangThaiThietBi,
} from "@/utils/kiemTraThietBi";

function chuanHoaNgay(ngay?: string | null) {
  return ngay?.match(/^\d{4}-\d{2}-\d{2}/)?.[0] ?? ngay;
}

function chuanHoaThietBi(thietBi: ThietBi): ThietBi {
  return {
    ...thietBi,
    loaiThietBiId: thietBi.loaiThietBi?.id ?? thietBi.loaiThietBiId,
    viTriId: thietBi.viTri?.id ?? thietBi.viTriId ?? null,
    loNhapId: thietBi.loNhap?.id ?? thietBi.loNhapId ?? null,
    ngayBatDauBaoHanh: chuanHoaNgay(thietBi.ngayBatDauBaoHanh),
    ngayHetBaoHanh: chuanHoaNgay(thietBi.ngayHetBaoHanh),
  };
}

export function layDanhSachLoaiThietBi(boLoc: {
  trang: number;
  gioiHan: number;
  tuKhoa?: string;
}) {
  const thamSo = new URLSearchParams({
    trang: String(boLoc.trang),
    gioiHan: String(boLoc.gioiHan),
  });
  if (boLoc.tuKhoa?.trim()) thamSo.set("tuKhoa", boLoc.tuKhoa.trim());
  return guiYeuCau<{
    danhSach: LoaiThietBi[];
    phanTrang: { tongTrang: number };
  }>(`/loai-thiet-bi?${thamSo}`);
}
export function themLoaiThietBi(duLieu: { tenLoai: string; moTa?: string }) {
  return guiYeuCau<LoaiThietBi>("/loai-thiet-bi", {
    method: "POST",
    body: JSON.stringify(duLieu),
  });
}
export function capNhatLoaiThietBi(
  id: number,
  duLieu: { tenLoai: string; moTa?: string },
) {
  if (!kiemTraIdHopLe(id))
    throw new LoiHttp(0, "Mã loại thiết bị không hợp lệ.");
  return guiYeuCau<LoaiThietBi>(`/loai-thiet-bi/${id}`, {
    method: "PUT",
    body: JSON.stringify(duLieu),
  });
}
export function layDanhSachViTri() {
  return guiYeuCau<{ danhSach: ViTri[]; phanTrang?: unknown }>(
    "/vi-tri?trang=1&gioiHan=100",
  );
}
export function layDanhSachLoNhap() {
  return guiYeuCau<{ danhSach: LoNhap[]; phanTrang?: unknown }>(
    "/lo-nhap?trang=1&gioiHan=100",
  );
}
export async function layDanhSachThietBi(boLoc: BoLocThietBi) {
  const thamSo = new URLSearchParams({
    trang: String(boLoc.trang),
    gioiHan: String(boLoc.gioiHan),
  });
  if (boLoc.tuKhoa) thamSo.set("tuKhoa", boLoc.tuKhoa);
  if (boLoc.loaiThietBiId)
    thamSo.set("loaiThietBiId", String(boLoc.loaiThietBiId));
  if (boLoc.viTriId) thamSo.set("viTriId", String(boLoc.viTriId));
  if (boLoc.trangThai) thamSo.set("trangThai", boLoc.trangThai);
  const ketQua = await guiYeuCau<KetQuaDanhSachThietBi>(`/thiet-bi?${thamSo}`);
  return {
    ...ketQua,
    danhSach: ketQua.danhSach.map(chuanHoaThietBi),
  };
}
export async function layChiTietThietBi(id: number) {
  if (!kiemTraIdHopLe(id)) throw new LoiHttp(0, "Mã thiết bị không hợp lệ.");
  return chuanHoaThietBi(await guiYeuCau<ThietBi>(`/thiet-bi/${id}`));
}
export async function themThietBi(duLieu: DuLieuThemThietBi) {
  return chuanHoaThietBi(await guiYeuCau<ThietBi>("/thiet-bi", {
    method: "POST",
    body: JSON.stringify(duLieu),
  }));
}
export async function capNhatThietBi(id: number, duLieu: Partial<DuLieuThemThietBi>) {
  if (!kiemTraIdHopLe(id)) throw new LoiHttp(0, "Mã thiết bị không hợp lệ.");
  return chuanHoaThietBi(await guiYeuCau<ThietBi>(`/thiet-bi/${id}`, {
    method: "PUT",
    body: JSON.stringify(duLieu),
  }));
}
export async function capNhatTrangThaiThietBi(
  id: number,
  trangThai: TrangThaiThietBi,
) {
  if (!kiemTraIdHopLe(id) || !kiemTraTrangThaiThietBi(trangThai))
    throw new LoiHttp(0, "Trạng thái thiết bị không hợp lệ.");
  return chuanHoaThietBi(await guiYeuCau<ThietBi>(`/thiet-bi/${id}/trang-thai`, {
    method: "PATCH",
    body: JSON.stringify({ trangThai }),
  }));
}
export function layQrThietBi(id: number) {
  if (!kiemTraIdHopLe(id)) throw new LoiHttp(0, "Mã thiết bị không hợp lệ.");
  return guiYeuCau<{ maQr?: string; noiDungQr?: string; anhQr?: string }>(
    `/thiet-bi/${id}/qr`,
  );
}
export function dieuChuyenThietBi(id: number, duLieu: DuLieuDieuChuyen) {
  if (!kiemTraIdHopLe(id) || !kiemTraIdHopLe(duLieu.viTriMoiId))
    throw new LoiHttp(0, "Mã thiết bị hoặc vị trí không hợp lệ.");
  return guiYeuCau<ThietBi>(`/thiet-bi/${id}/dieu-chuyen`, {
    method: "POST",
    body: JSON.stringify(duLieu),
  });
}
export function layLichSuDieuChuyen(id: number, trang = 1, gioiHan = 10) {
  if (!kiemTraIdHopLe(id)) throw new LoiHttp(0, "Mã thiết bị không hợp lệ.");
  return guiYeuCau<{
    danhSach: LichSuDieuChuyen[];
    phanTrang: { tongTrang: number };
  }>(`/thiet-bi/${id}/lich-su-dieu-chuyen?trang=${trang}&gioiHan=${gioiHan}`);
}
export async function layBaoHanhThietBi(id: number) {
  if (!kiemTraIdHopLe(id)) throw new LoiHttp(0, "Mã thiết bị không hợp lệ.");
  const ketQua = await guiYeuCau<{
    ngayBatDauBaoHanh?: string | null;
    ngayHetBaoHanh?: string | null;
  }>(`/thiet-bi/${id}/bao-hanh`);
  return {
    ...ketQua,
    ngayBatDauBaoHanh: chuanHoaNgay(ketQua.ngayBatDauBaoHanh),
    ngayHetBaoHanh: chuanHoaNgay(ketQua.ngayHetBaoHanh),
  };
}
export function capNhatBaoHanhThietBi(
  id: number,
  ngayBatDauBaoHanh: string,
  ngayHetBaoHanh: string,
) {
  if (!kiemTraIdHopLe(id)) throw new LoiHttp(0, "Mã thiết bị không hợp lệ.");
  return guiYeuCau<ThietBi>(`/thiet-bi/${id}/bao-hanh`, {
    method: "PATCH",
    body: JSON.stringify({ ngayBatDauBaoHanh, ngayHetBaoHanh }),
  });
}
export function xemTruocNhapThietBi(tep: File) {
  const duLieu = new FormData();
  duLieu.append("tep", tep);
  return guiYeuCauMultipart<KetQuaImport>("/thiet-bi/import/preview", duLieu);
}
export function nhapThietBi(tep: File) {
  const duLieu = new FormData();
  duLieu.append("tep", tep);
  return guiYeuCauMultipart<KetQuaImport>("/thiet-bi/import", duLieu);
}
