import { guiYeuCau } from "./httpClient";
import { LoiHttp } from "@/types/api";
import {
  kiemTraIdNguoiDung,
  kiemTraTrangThai,
  kiemTraVaiTro,
} from "@/utils/kiemTraNguoiDung";
import type {
  BoLocNguoiDung,
  DuLieuCapNhatNguoiDung,
  DuLieuThemNguoiDung,
  KetQuaDanhSachNguoiDung,
  NguoiDung,
} from "@/types/nguoiDung";

export function layDanhSachNguoiDung(boLoc: BoLocNguoiDung) {
  const thamSo = new URLSearchParams({
    trang: String(boLoc.trang),
    gioiHan: String(boLoc.gioiHan),
  });

  if (boLoc.tuKhoa) thamSo.set("tuKhoa", boLoc.tuKhoa);
  if (boLoc.vaiTro) thamSo.set("vaiTro", boLoc.vaiTro);
  if (boLoc.trangThai) thamSo.set("trangThai", boLoc.trangThai);

  return guiYeuCau<KetQuaDanhSachNguoiDung>(
    `/nguoi-dung?${thamSo.toString()}`,
  );
}

export function themNguoiDung(duLieuNguoiDung: DuLieuThemNguoiDung) {
  return guiYeuCau<NguoiDung>("/nguoi-dung", {
    method: "POST",
    body: JSON.stringify(duLieuNguoiDung),
  });
}

export function layChiTietNguoiDung(id: number) {
  if (!kiemTraIdNguoiDung(id)) {
    throw new LoiHttp(0, "Mã người dùng không hợp lệ.");
  }
  return guiYeuCau<NguoiDung>(`/nguoi-dung/${id}`);
}

export function capNhatNguoiDung(
  id: number,
  duLieuNguoiDung: DuLieuCapNhatNguoiDung,
) {
  if (!kiemTraIdNguoiDung(id)) {
    throw new LoiHttp(0, "Mã người dùng không hợp lệ.");
  }
  if (!kiemTraVaiTro(duLieuNguoiDung.vaiTro)) {
    throw new LoiHttp(0, "Vai trò không hợp lệ.");
  }
  return guiYeuCau<NguoiDung>(`/nguoi-dung/${id}`, {
    method: "PUT",
    body: JSON.stringify(duLieuNguoiDung),
  });
}

export function doiVaiTroNguoiDung(
  nguoiDung: NguoiDung,
  vaiTro: NguoiDung["vaiTro"],
) {
  if (!kiemTraIdNguoiDung(nguoiDung.id) || !kiemTraVaiTro(vaiTro)) {
    throw new LoiHttp(0, "Vai trò không hợp lệ.");
  }
  return capNhatNguoiDung(nguoiDung.id, {
    hoTen: nguoiDung.hoTen,
    email: nguoiDung.email,
    soDienThoai: nguoiDung.soDienThoai,
    anhDaiDien: nguoiDung.anhDaiDien,
    vaiTro,
  });
}

export function capNhatTrangThaiNguoiDung(
  id: number,
  trangThai: NguoiDung["trangThai"],
) {
  if (!kiemTraIdNguoiDung(id) || !kiemTraTrangThai(trangThai)) {
    throw new LoiHttp(0, "Trạng thái không hợp lệ.");
  }
  return guiYeuCau<NguoiDung>(`/nguoi-dung/${id}/trang-thai`, {
    method: "PATCH",
    body: JSON.stringify({ trangThai }),
  });
}
