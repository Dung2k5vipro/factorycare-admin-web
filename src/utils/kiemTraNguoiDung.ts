import type { TrangThaiNguoiDung, VaiTro } from "@/types/nguoiDung";

const DANH_SACH_VAI_TRO: VaiTro[] = [
  "QUAN_TRI_VIEN",
  "KY_THUAT_VIEN",
  "NHAN_VIEN",
];

const DANH_SACH_TRANG_THAI: TrangThaiNguoiDung[] = [
  "HOAT_DONG",
  "NGUNG_HOAT_DONG",
];

export function kiemTraHoTen(hoTen: string) {
  return hoTen.trim() ? "" : "Họ tên không được để trống.";
}

export function kiemTraEmail(email: string) {
  const emailDaTrim = email.trim();
  if (!emailDaTrim) return "Email không được để trống.";
  if (!/^\S+@\S+\.\S+$/.test(emailDaTrim)) {
    return "Email không đúng định dạng.";
  }
  return "";
}

export function kiemTraSoDienThoai(soDienThoai: string, batBuoc = false) {
  const soDienThoaiDaTrim = soDienThoai.trim();
  if (!soDienThoaiDaTrim && !batBuoc) return "";
  if (!soDienThoaiDaTrim || soDienThoaiDaTrim.length < 10) {
    return "Số điện thoại phải có đủ 10 chữ số.";
  }
  if (soDienThoaiDaTrim.length > 10) {
    return "Số điện thoại chỉ được gồm 10 chữ số.";
  }
  if (!/^\d{10}$/.test(soDienThoaiDaTrim)) {
    return "Số điện thoại chỉ được chứa chữ số.";
  }
  return "";
}

export function kiemTraVaiTro(vaiTro: string): vaiTro is VaiTro {
  return DANH_SACH_VAI_TRO.includes(vaiTro as VaiTro);
}

export function kiemTraTrangThai(trangThai: string): trangThai is TrangThaiNguoiDung {
  return DANH_SACH_TRANG_THAI.includes(trangThai as TrangThaiNguoiDung);
}

export function kiemTraIdNguoiDung(idNguoiDung: number) {
  return Number.isInteger(idNguoiDung) && idNguoiDung > 0;
}

export function kiemTraTepAnhDaiDien(tep: File | null) {
  if (!tep) return "";
  return tep.type.startsWith("image/")
    ? ""
    : "Ảnh đại diện phải là tệp hình ảnh.";
}

export function docTepAnhDaiDien(tep: File) {
  return new Promise<string>((resolve, reject) => {
    const boDoc = new FileReader();
    boDoc.onload = () => resolve(String(boDoc.result));
    boDoc.onerror = () => reject(new Error("Không thể đọc tệp ảnh."));
    boDoc.readAsDataURL(tep);
  });
}
