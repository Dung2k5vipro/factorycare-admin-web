export type LoaiViTri = "NHA_MAY" | "XUONG" | "DAY_CHUYEN" | "KHU_VUC";
export interface CayViTri {
  id: number;
  tenViTri: string;
  loaiViTri: LoaiViTri;
  viTriChaId?: number | null;
  moTa?: string | null;
  con?: CayViTri[];
}
export interface NhaCungCap {
  id: number;
  tenNhaCungCap: string;
  nguoiLienHe?: string | null;
  soDienThoai?: string | null;
  email?: string | null;
  diaChi?: string | null;
  ghiChu?: string | null;
  ngayTao?: string;
  ngayCapNhat?: string;
}
export interface LoNhap {
  id: number;
  maLo: string;
  nhaCungCapId?: number | null;
  nhaCungCap?: NhaCungCap | null;
  soHoaDon?: string | null;
  fileHoaDon?: string | null;
  ngayNhap?: string;
  tongGiaTri?: number | null;
  ghiChu?: string | null;
}
export interface LichSuDieuChuyen {
  id: number;
  viTriCu?: { id: number; tenViTri: string } | null;
  viTriMoi?: { id: number; tenViTri: string } | null;
  ngayDieuChuyen?: string;
  nguoiThucHien?: { hoTen: string } | null;
  lyDo?: string | null;
  ghiChu?: string | null;
}
export interface DuLieuNhaCungCap {
  tenNhaCungCap: string;
  nguoiLienHe?: string;
  soDienThoai?: string;
  email?: string;
  diaChi?: string;
  ghiChu?: string;
}
export interface DuLieuViTri {
  tenViTri: string;
  loaiViTri: LoaiViTri;
  viTriChaId?: number | null;
  moTa?: string;
}
export interface DuLieuLoNhap {
  maLo: string;
  nhaCungCapId?: number | null;
  soHoaDon?: string;
  ngayNhap: string;
  tongGiaTri?: number | null;
  ghiChu?: string;
  fileHoaDon?: File | null;
}
export interface DuLieuDieuChuyen {
  viTriMoiId: number;
  lyDo?: string;
  ghiChu?: string;
}
export interface KetQuaDanhSach<T> {
  danhSach: T[];
  phanTrang: {
    trang: number;
    gioiHan: number;
    tongBanGhi: number;
    tongTrang: number;
  };
}
export interface KetQuaImport {
  tongSoDong?: number;
  soDongHopLe?: number;
  soDongLoi?: number;
  danhSachDongHopLe?: Array<{ dong: number; duLieu: Record<string, unknown> }>;
  danhSachLoi?: Array<{ dong: number; cot?: string; thongBao: string }>;
}
