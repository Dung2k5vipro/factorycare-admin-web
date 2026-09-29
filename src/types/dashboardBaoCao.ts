import type { KetQuaSuaChua, MucDoSuCo, TrangThaiSuCo } from "@/types/suCo";
import type { TrangThaiPhieuBaoTri } from "@/types/baoTri";
import type { TrangThaiThietBi } from "@/types/thietBi";

export type KhoangThoiGianDashboard =
  | "7_NGAY"
  | "30_NGAY"
  | "THANG_NAY"
  | "TUY_CHINH";

export type LoaiBaoCao = "su-co" | "sua-chua" | "bao-tri" | "thiet-bi";
export type ThuTuSapXep = "ASC" | "DESC";
export type DinhDangXuat = "excel" | "pdf";

export interface ThamSoDashboard {
  khoangThoiGian: KhoangThoiGianDashboard;
  tuNgay?: string;
  denNgay?: string;
  soNgayCanhBao?: number;
  gioiHanTop?: number;
}

export interface ThietBiRutGon {
  id: number;
  maThietBi: string;
  tenThietBi: string;
}

export interface KyThuatVienRutGon {
  id: number;
  hoTen: string;
}

export interface DiemThongKe {
  soLuong: number;
  trangThai?: string;
  mucDo?: string;
  ketQua?: string;
  ngay?: string;
}

export interface DuLieuDashboardTongQuan {
  boLoc: {
    khoangThoiGian: KhoangThoiGianDashboard;
    tuNgay: string;
    denNgay: string;
    soNgayCanhBao: number;
    gioiHanTop: number;
  };
  kpi: {
    tongThietBiDangQuanLy: number;
    tongHoSoThietBi: number;
    soSuCoMo: number;
    soSuCoNghiemTrongMo: number;
    soBaoTriSapDenHan: number;
    soBaoTriQuaHan: number;
    thoiGianXuLySuCoTrungBinh: {
      giaTri: number | null;
      donVi: "PHUT";
      soSuCoDuocTinh: number;
    };
  };
  bieuDo: {
    thietBiTheoTrangThai: Array<{ trangThai: TrangThaiThietBi; soLuong: number }>;
    suCoTheoMucDo: Array<{ mucDo: MucDoSuCo; soLuong: number }>;
    suCoTheoThoiGian: Array<{ ngay: string; soLuong: number }>;
    baoTriTheoTrangThai: Array<{ trangThai: TrangThaiPhieuBaoTri; soLuong: number }>;
  };
  topThietBiNhieuSuCo: Array<
    ThietBiRutGon & { trangThai: TrangThaiThietBi; soSuCo: number }
  >;
  canChuY: {
    suCoNghiemTrong: Array<{
      id: number;
      maSuCo: string;
      tieuDe: string;
      mucDo: MucDoSuCo;
      trangThai: TrangThaiSuCo;
      thoiGianBao: string;
      thietBi: ThietBiRutGon;
    }>;
    baoTriQuaHan: Array<{
      phieuBaoTriId: number;
      keHoachBaoTriId: number;
      ngayDuKien: string;
      trangThai: TrangThaiPhieuBaoTri;
      soNgayQuaHan: number;
      thietBi: ThietBiRutGon;
      kyThuatVien: KyThuatVienRutGon | null;
    }>;
  };
  ghiChuDuLieu?: {
    kpiThietBiVaCongViecDangMo?: string;
    metricLichSu?: string;
  };
}

export interface BoLocBaoCao {
  trang: number;
  gioiHan: number;
  tuNgay?: string;
  denNgay?: string;
  thietBiId?: number;
  loaiThietBiId?: number;
  viTriId?: number;
  kyThuatVienId?: number;
  mucDo?: MucDoSuCo;
  trangThai?: TrangThaiSuCo | TrangThaiPhieuBaoTri | TrangThaiThietBi;
  ketQua?: KetQuaSuaChua;
  sapXepTheo?: string;
  thuTu?: ThuTuSapXep;
}

export interface PhanTrangBaoCao {
  trang: number;
  gioiHan: number;
  tongBanGhi: number;
  tongTrang: number;
}

export interface BoLocBaoCaoDaApDung {
  tuNgay: string | null;
  denNgay: string | null;
  thietBiId: number | null;
  loaiThietBiId: number | null;
  viTriId: number | null;
  kyThuatVienId: number | null;
  mucDo: MucDoSuCo | null;
  trangThai: TrangThaiSuCo | TrangThaiPhieuBaoTri | TrangThaiThietBi | null;
  ketQua: KetQuaSuaChua | null;
  sapXepTheo: string;
  thuTu: ThuTuSapXep;
}

interface KetQuaBaoCaoCoBan {
  boLoc: BoLocBaoCaoDaApDung;
  phanTrang: PhanTrangBaoCao;
  truongThoiGian: string | null;
}

export interface DongBaoCaoSuCo {
  id: number;
  maSuCo: string;
  tieuDe: string;
  mucDo: MucDoSuCo;
  trangThai: TrangThaiSuCo;
  thoiGianBao: string;
  thoiGianHoanThanh: string | null;
  thietBi: ThietBiRutGon;
  loaiThietBi: { id: number; tenLoai: string } | null;
  viTriHienTai: { id: number; tenViTri: string } | null;
  kyThuatVien: KyThuatVienRutGon | null;
}

export interface KetQuaBaoCaoSuCo extends KetQuaBaoCaoCoBan {
  loaiBaoCao: "su-co";
  tongQuan: {
    tongSuCo: number;
    soDangMo: number;
    soDaXuLy: number;
    soDaHuy: number;
    soNghiemTrongDangMo: number;
    thoiGianXuLyTrungBinh: { giaTri: number | null; donVi: "PHUT" };
  };
  thongKe: {
    theoTrangThai: Array<{ trangThai: TrangThaiSuCo; soLuong: number }>;
    theoMucDo: Array<{ mucDo: MucDoSuCo; soLuong: number }>;
    theoThoiGian: Array<{ ngay: string; soLuong: number }>;
  };
  danhSach: DongBaoCaoSuCo[];
}

export interface DongBaoCaoSuaChua {
  id: number;
  suCoId: number;
  maSuCo: string;
  nguyenNhan: string | null;
  cachXuLy: string | null;
  ketQua: KetQuaSuaChua;
  thoiGianBatDau: string | null;
  thoiGianHoanThanh: string | null;
  ghiChu: string | null;
  ngayTao: string;
  thietBi: ThietBiRutGon;
  loaiThietBi: { id: number; tenLoai: string } | null;
  viTriHienTai: { id: number; tenViTri: string } | null;
  kyThuatVien: KyThuatVienRutGon | null;
}

export interface KetQuaBaoCaoSuaChua extends KetQuaBaoCaoCoBan {
  loaiBaoCao: "sua-chua";
  tongQuan: {
    tongHoSo: number;
    soDaSuaXong: number;
    soSuaMotPhan: number;
    soKhongSuaDuoc: number;
    thoiGianSuaChuaTrungBinh: { giaTri: number | null; donVi: "PHUT" };
  };
  thongKe: {
    theoKetQua: Array<{ ketQua: KetQuaSuaChua; soLuong: number }>;
    theoKyThuatVien: Array<{ kyThuatVien: KyThuatVienRutGon; soLuong: number }>;
  };
  danhSach: DongBaoCaoSuaChua[];
}

export interface DongBaoCaoBaoTri {
  id: number;
  keHoachBaoTriId: number;
  ngayDuKien: string;
  thoiGianBatDau: string | null;
  thoiGianHoanThanh: string | null;
  trangThai: TrangThaiPhieuBaoTri;
  daQuaHan: boolean;
  ketQuaBaoTri: string | null;
  thietBi: ThietBiRutGon;
  loaiThietBi: { id: number; tenLoai: string } | null;
  viTriHienTai: { id: number; tenViTri: string } | null;
  kyThuatVien: KyThuatVienRutGon | null;
}

export interface KetQuaBaoCaoBaoTri extends KetQuaBaoCaoCoBan {
  loaiBaoCao: "bao-tri";
  tongQuan: {
    tongPhieu: number;
    soHoanThanh: number;
    soDangThucHien: number;
    soQuaHan: number;
    soDaHuy: number;
  };
  thongKe: {
    theoTrangThai: Array<{ trangThai: TrangThaiPhieuBaoTri; soLuong: number }>;
    theoKyThuatVien: Array<{
      kyThuatVien: KyThuatVienRutGon | null;
      soLuong: number;
    }>;
  };
  danhSach: DongBaoCaoBaoTri[];
}

export interface DongBaoCaoThietBi extends ThietBiRutGon {
  trangThai: TrangThaiThietBi;
  model: string | null;
  hangSanXuat: string | null;
  ngayTao: string;
  loaiThietBi: { id: number; tenLoai: string } | null;
  viTriHienTai: { id: number; tenViTri: string } | null;
  soSuCo: number;
  soBaoTriQuaHan: number;
}

export interface KetQuaBaoCaoThietBi extends KetQuaBaoCaoCoBan {
  loaiBaoCao: "thiet-bi";
  tongQuan: {
    tongHoSo: number;
    tongDangQuanLy: number;
    soDangHoatDong: number;
    soDangBaoTri: number;
    soDangHong: number;
    soNgungHoatDong: number;
    soThanhLy: number;
  };
  thongKe: {
    theoTrangThai: Array<{ trangThai: TrangThaiThietBi; soLuong: number }>;
    theoLoai: Array<{
      loaiThietBi: { id: number; tenLoai: string };
      soLuong: number;
    }>;
    theoViTri: Array<{
      viTri: { id: number; tenViTri: string } | null;
      soLuong: number;
    }>;
  };
  danhSach: DongBaoCaoThietBi[];
  ghiChu?: string;
}

export type KetQuaBaoCao =
  | KetQuaBaoCaoSuCo
  | KetQuaBaoCaoSuaChua
  | KetQuaBaoCaoBaoTri
  | KetQuaBaoCaoThietBi;
