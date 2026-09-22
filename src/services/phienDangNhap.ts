import type { NguoiDung } from "@/types/nguoiDung";

const KHOA_TOKEN = "factorycare_token";
const KHOA_NGUOI_DUNG = "factorycare_nguoi_dung";

export function luuPhienDangNhap(token: string, nguoiDung: NguoiDung) {
  localStorage.setItem(KHOA_TOKEN, token);
  localStorage.setItem(KHOA_NGUOI_DUNG, JSON.stringify(nguoiDung));
}

export function layToken() {
  if (typeof window === "undefined") return null;
  return localStorage.getItem(KHOA_TOKEN);
}

export function layNguoiDungDaLuu(): NguoiDung | null {
  if (typeof window === "undefined") return null;

  const chuoiNguoiDung = localStorage.getItem(KHOA_NGUOI_DUNG);
  if (!chuoiNguoiDung) return null;

  try {
    return JSON.parse(chuoiNguoiDung) as NguoiDung;
  } catch {
    xoaPhienDangNhap();
    return null;
  }
}

export function xoaPhienDangNhap() {
  if (typeof window === "undefined") return;
  localStorage.removeItem(KHOA_TOKEN);
  localStorage.removeItem(KHOA_NGUOI_DUNG);
}
