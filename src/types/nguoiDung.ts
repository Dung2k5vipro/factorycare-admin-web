export type VaiTro = "QUAN_TRI_VIEN" | "KY_THUAT_VIEN" | "NHAN_VIEN";
export type TrangThaiNguoiDung = "HOAT_DONG" | "NGUNG_HOAT_DONG";

export interface NguoiDung {
  id: number;
  hoTen: string;
  email: string;
  soDienThoai?: string | null;
  anhDaiDien?: string | null;
  vaiTro: VaiTro;
  trangThai: TrangThaiNguoiDung;
  ngayTao?: string;
  ngayCapNhat?: string;
}

export interface PhanTrang {
  trang: number;
  gioiHan: number;
  tongBanGhi: number;
  tongTrang: number;
}

export interface KetQuaDanhSachNguoiDung {
  danhSach: NguoiDung[];
  phanTrang: PhanTrang;
}

export interface BoLocNguoiDung {
  trang: number;
  gioiHan: number;
  tuKhoa?: string;
  vaiTro?: VaiTro;
  trangThai?: TrangThaiNguoiDung;
}

export interface DuLieuThemNguoiDung {
  hoTen: string;
  email: string;
  matKhau: string;
  soDienThoai?: string;
  anhDaiDien?: string | null;
  vaiTro: VaiTro;
}

export interface DuLieuCapNhatNguoiDung {
  hoTen: string;
  email: string;
  soDienThoai?: string | null;
  anhDaiDien?: string | null;
  vaiTro: VaiTro;
}
