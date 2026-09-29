export const NHAN_MUC_DO_SU_CO = {
  THAP: "Thấp",
  TRUNG_BINH: "Trung bình",
  CAO: "Cao",
  NGHIEM_TRONG: "Nghiêm trọng",
};

export const NHAN_TRANG_THAI_SU_CO = {
  MOI: "Mới",
  DA_PHAN_CONG: "Đã phân công",
  DANG_XU_LY: "Đang xử lý",
  CHO_LINH_KIEN: "Chờ linh kiện",
  DA_XU_LY: "Đã xử lý",
  DA_HUY: "Đã hủy",
};

export const NHAN_KET_QUA_SUA_CHUA = {
  DA_SUA_XONG: "Đã sửa xong",
  SUA_MOT_PHAN: "Sửa một phần",
  KHONG_SUA_DUOC: "Không sửa được",
};

export function kiemTraNgay(ngay: string) {
  if (!/^\d{4}-\d{2}-\d{2}$/.test(ngay)) return false;
  const [nam, thang, ngayTrongThang] = ngay.split("-").map(Number);
  const ngayKiemTra = new Date(Date.UTC(nam, thang - 1, ngayTrongThang));
  return ngayKiemTra.getUTCFullYear() === nam && ngayKiemTra.getUTCMonth() === thang - 1 && ngayKiemTra.getUTCDate() === ngayTrongThang;
}

export function dinhDangThoiGian(thoiGian?: string | null) {
  if (!thoiGian) return "—";
  const ngay = new Date(thoiGian);
  return Number.isNaN(ngay.getTime()) ? "—" : new Intl.DateTimeFormat("vi-VN", { dateStyle: "short", timeStyle: "short" }).format(ngay);
}
