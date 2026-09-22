import { guiYeuCau } from "./httpClient";
import type { NguoiDung } from "@/types/nguoiDung";

interface KetQuaDangNhap {
  nguoiDung: NguoiDung;
  token: string;
}

export function dangNhap(email: string, matKhau: string) {
  return guiYeuCau<KetQuaDangNhap>(
    "/xac-thuc/dang-nhap",
    {
      method: "POST",
      body: JSON.stringify({ email, matKhau }),
    },
    false,
  );
}

export function layThongTinNguoiDungHienTai() {
  return guiYeuCau<NguoiDung>("/xac-thuc/toi");
}

export function guiYeuCauDangXuat() {
  return guiYeuCau<null>("/xac-thuc/dang-xuat", { method: "POST" });
}
