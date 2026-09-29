export type MucDoSuCo = "THAP" | "TRUNG_BINH" | "CAO" | "NGHIEM_TRONG";
export type TrangThaiSuCo = "MOI" | "DA_PHAN_CONG" | "DANG_XU_LY" | "CHO_LINH_KIEN" | "DA_XU_LY" | "DA_HUY";
export type KetQuaSuaChua = "DA_SUA_XONG" | "SUA_MOT_PHAN" | "KHONG_SUA_DUOC";

export interface LinhKienThayThe {
  tenLinhKien: string;
  soLuong: number;
  donVi?: string | null;
  ghiChu?: string | null;
}

export interface HoSoSuaChua {
  id: number;
  suCoId: number;
  kyThuatVien?: KyThuatVienSuCo | null;
  nguyenNhan: string | null;
  cachXuLy: string | null;
  linhKienThayThe: LinhKienThayThe[] | null;
  ketQua: KetQuaSuaChua | null;
  thoiGianBatDau: string | null;
  thoiGianHoanThanh: string | null;
  ghiChu: string | null;
  hinhAnhSuaChua?: string[] | string | null;
  hinhAnh?: string[] | string | null;
}

export interface KyThuatVienSuCo {
  id: number;
  hoTen: string;
  email?: string | null;
  soDienThoai?: string | null;
  trangThai?: "HOAT_DONG" | "NGUNG_HOAT_DONG";
}

export interface SuCo {
  id: number;
  maSuCo: string;
  tieuDe: string;
  mucDo: MucDoSuCo;
  trangThai: TrangThaiSuCo;
  thietBi: {
    id: number;
    maThietBi: string;
    tenThietBi: string;
    trangThai?: string;
    viTri?: { id: number; tenViTri: string } | null;
  };
  nguoiBao: { id: number; hoTen: string; email?: string | null };
  kyThuatVien: KyThuatVienSuCo | null;
  thoiGianBao: string;
  thoiGianPhanCong?: string | null;
  moTa?: string;
  hinhAnh?: string[] | string | null;
  hinhAnhSuaChua?: string[] | string | null;
  thoiGianXayRa?: string | null;
  thoiGianHoanThanh?: string | null;
  danhSachHoSoSuaChua?: HoSoSuaChua[];
  hoSoSuaChua?: HoSoSuaChua | HoSoSuaChua[] | null;
}

export interface PhanTrangSuCo {
  trang: number;
  gioiHan: number;
  tongBanGhi: number;
  tongTrang: number;
}

export interface BoLocSuCo {
  trang: number;
  gioiHan: number;
  tuKhoa?: string;
  mucDo?: MucDoSuCo;
  trangThai?: TrangThaiSuCo;
  thietBiId?: number;
  kyThuatVienId?: number;
  tuNgay?: string;
  denNgay?: string;
}

export interface KetQuaDanhSachSuCo {
  danhSach: SuCo[];
  phanTrang: PhanTrangSuCo;
}

export interface KetQuaDanhSachKyThuatVien {
  danhSach: KyThuatVienSuCo[];
  phanTrang: PhanTrangSuCo;
}
