export type TrangThaiThietBi =
  | "DANG_HOAT_DONG"
  | "DANG_BAO_TRI"
  | "DANG_HONG"
  | "NGUNG_HOAT_DONG"
  | "THANH_LY";

export interface LoaiThietBi {
  id: number;
  tenLoai: string;
  moTa?: string | null;
  ngayTao?: string;
  ngayCapNhat?: string;
}
export interface ViTri {
  id: number;
  tenViTri: string;
  loaiViTri?: string;
}
export interface LoNhap {
  id: number;
  maLo: string;
}
export interface ThietBi {
  id: number;
  maThietBi: string;
  tenThietBi: string;
  loaiThietBiId: number;
  loaiThietBi?: LoaiThietBi | null;
  viTriId?: number | null;
  viTri?: ViTri | null;
  loNhapId?: number | null;
  loNhap?: LoNhap | null;
  soSerial?: string | null;
  model?: string | null;
  hangSanXuat?: string | null;
  maQr?: string | null;
  anhThietBi?: string | null;
  giaMua?: number | null;
  ngayBatDauBaoHanh?: string | null;
  ngayHetBaoHanh?: string | null;
  trangThai: TrangThaiThietBi;
  moTa?: string | null;
}
export interface PhanTrangThietBi {
  trang: number;
  gioiHan: number;
  tongBanGhi: number;
  tongTrang: number;
}
export interface KetQuaDanhSachThietBi {
  danhSach: ThietBi[];
  phanTrang: PhanTrangThietBi;
}
export interface BoLocThietBi {
  trang: number;
  gioiHan: number;
  tuKhoa?: string;
  loaiThietBiId?: number;
  viTriId?: number;
  trangThai?: TrangThaiThietBi;
}
export interface DuLieuThemThietBi {
  tenThietBi: string;
  loaiThietBiId: number;
  viTriId: number | null;
  loNhapId: number | null;
  soSerial?: string;
  model?: string;
  hangSanXuat?: string;
  anhThietBi?: string | null;
  giaMua?: number | null;
  ngayBatDauBaoHanh?: string | null;
  ngayHetBaoHanh?: string | null;
  trangThai: TrangThaiThietBi;
  moTa?: string;
}
