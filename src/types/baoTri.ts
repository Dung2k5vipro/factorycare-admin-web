import type { LoaiThietBi, ThietBi } from "@/types/thietBi";
import type { NguoiDung } from "@/types/nguoiDung";

export type DonViChuKy = "NGAY" | "TUAN" | "THANG" | "NAM";
export type TrangThaiKeHoach = "HOAT_DONG" | "NGUNG_HOAT_DONG";
export type TrangThaiMauChecklist = "HOAT_DONG" | "NGUNG_HOAT_DONG";
export type TrangThaiPhieuBaoTri =
  | "CHO_THUC_HIEN"
  | "DANG_THUC_HIEN"
  | "HOAN_THANH"
  | "QUA_HAN"
  | "DA_HUY";

export interface PhanTrangBaoTri {
  trang?: number;
  trangHienTai?: number;
  gioiHan?: number;
  soBanGhiMoiTrang?: number;
  tongBanGhi: number;
  tongTrang?: number;
  tongSoTrang?: number;
}

export interface HangMucChecklist {
  id?: number | string;
  noiDung?: string | null;
}

export interface MauChecklist {
  id: number;
  tenMau: string;
  loaiThietBi: Pick<LoaiThietBi, "id" | "tenLoai"> | null;
  danhSachHangMuc: HangMucChecklist[];
  moTa?: string | null;
  trangThai: TrangThaiMauChecklist;
  nguoiTao?: Pick<NguoiDung, "id" | "hoTen"> | null;
  ngayTao?: string | null;
  ngayCapNhat?: string | null;
}

export interface KyThuatVienBaoTri {
  id: number;
  hoTen: string;
  email: string;
  trangThai?: NguoiDung["trangThai"];
}

export interface KeHoachBaoTri {
  id: number;
  thietBi: Pick<ThietBi, "id" | "maThietBi" | "tenThietBi" | "trangThai">;
  mauChecklist: Pick<MauChecklist, "id" | "tenMau" | "trangThai">;
  kyThuatVien: KyThuatVienBaoTri | null;
  giaTriChuKy: number;
  donViChuKy: DonViChuKy;
  ngayBatDau: string;
  ngayBaoTriTiepTheo: string;
  trangThai: TrangThaiKeHoach;
  moTa?: string | null;
  ngayTao?: string | null;
  ngayCapNhat?: string | null;
}

export interface KetQuaChecklist {
  id?: number | string;
  noiDung?: string | null;
  loai?: string | null;
  trangThai?: string | null;
  ghiChu?: string | null;
}

export interface LinhKienThayThe {
  ten?: string | null;
  soLuong?: number | string | null;
}

export interface PhieuBaoTri {
  id: number;
  keHoachBaoTriId: number;
  thietBi: Pick<ThietBi, "id" | "maThietBi" | "tenThietBi" | "trangThai">;
  kyThuatVien: Omit<KyThuatVienBaoTri, "trangThai"> | null;
  ngayDuKien: string;
  thoiGianBatDau?: string | null;
  thoiGianHoanThanh?: string | null;
  trangThai: TrangThaiPhieuBaoTri;
  ketQuaChecklist?: KetQuaChecklist[] | null;
  linhKienThayThe?: LinhKienThayThe[] | null;
  ketQuaBaoTri?: string | null;
  ghiChu?: string | null;
  keHoach: {
    giaTriChuKy: number;
    donViChuKy: DonViChuKy;
    ngayBaoTriTiepTheo: string;
    trangThai: TrangThaiKeHoach;
    tenMauChecklist: string;
  };
  ngayTao?: string | null;
  ngayCapNhat?: string | null;
}

export interface DuLieuKeHoach {
  thietBiId: number;
  mauChecklistId: number;
  kyThuatVienId?: number | null;
  giaTriChuKy: number;
  donViChuKy: DonViChuKy;
  ngayBatDau: string;
  moTa?: string | null;
}

export interface DuLieuMauChecklist {
  tenMau: string;
  loaiThietBiId?: number | null;
  danhSachHangMuc: Array<{ noiDung: string }>;
  moTa?: string | null;
}

export interface BoLocKeHoach {
  trang: number;
  gioiHan: number;
  trangThai?: TrangThaiKeHoach;
  thietBiId?: number;
  kyThuatVienId?: number;
}

export interface BoLocMauChecklist {
  trang: number;
  gioiHan: number;
  trangThai?: TrangThaiMauChecklist;
  loaiThietBiId?: number;
}

export interface BoLocPhieuBaoTri {
  trang: number;
  gioiHan: number;
  trangThai?: TrangThaiPhieuBaoTri;
  thietBiId?: number;
  kyThuatVienId?: number;
  tuNgay?: string;
  denNgay?: string;
}

export interface KetQuaDanhSach<T> {
  danhSach: T[];
  phanTrang: PhanTrangBaoTri;
}

export interface KeHoachSapDenHan {
  keHoachBaoTriId: number;
  thietBi: Pick<ThietBi, "id" | "maThietBi" | "tenThietBi" | "trangThai">;
  kyThuatVien: Omit<KyThuatVienBaoTri, "trangThai"> | null;
  giaTriChuKy: number;
  donViChuKy: DonViChuKy;
  ngayBaoTriTiepTheo: string;
  soNgayConLai: number;
}

export interface KetQuaSapDenHan {
  soNgayCanhBao: number;
  danhSach: KeHoachSapDenHan[];
}

export interface LichSuPhanCong {
  phieuBaoTriId: number;
  keHoachBaoTriId: number;
  kyThuatVien: Omit<KyThuatVienBaoTri, "trangThai"> | null;
  ngayDuKien: string;
  trangThai: TrangThaiPhieuBaoTri;
  thoiGianBatDau?: string | null;
  thoiGianHoanThanh?: string | null;
  ngayTao?: string | null;
  ngayCapNhat?: string | null;
}
