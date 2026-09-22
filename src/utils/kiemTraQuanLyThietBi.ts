import type { LoaiViTri } from "@/types/quanLyThietBi";

export const DANH_SACH_LOAI_VI_TRI: LoaiViTri[] = [
  "NHA_MAY",
  "XUONG",
  "DAY_CHUYEN",
  "KHU_VUC",
];

export const NHAN_LOAI_VI_TRI: Record<LoaiViTri, string> = {
  NHA_MAY: "Nhà máy",
  XUONG: "Xưởng",
  DAY_CHUYEN: "Dây chuyền",
  KHU_VUC: "Khu vực",
};

export function kiemTraSoDienThoai(soDienThoai: string, batBuoc = false) {
  const giaTri = soDienThoai.trim();

  if (!giaTri && !batBuoc) return "";
  if (giaTri.length < 10) return "Số điện thoại phải có đủ 10 chữ số.";
  if (giaTri.length > 10) return "Số điện thoại chỉ được gồm 10 chữ số.";

  return /^\d{10}$/.test(giaTri) ? "" : "Số điện thoại chỉ được chứa chữ số.";
}

export function kiemTraEmailKhongBatBuoc(email: string) {
  const giaTri = email.trim();

  return !giaTri || /^\S+@\S+\.\S+$/.test(giaTri)
    ? ""
    : "Email không đúng định dạng.";
}

export function kiemTraIdQuanLy(giaTri: number | null | undefined) {
  return Number.isInteger(giaTri) && Number(giaTri) > 0;
}

export function kiemTraLoaiViTri(giaTri: string): giaTri is LoaiViTri {
  return DANH_SACH_LOAI_VI_TRI.includes(giaTri as LoaiViTri);
}

export function kiemTraSoTienKhongAm(
  giaTri: string | number | null | undefined,
  nhan: string,
) {
  if (giaTri === "" || giaTri === null || giaTri === undefined) return "";

  const so = Number(giaTri);
  if (!Number.isFinite(so)) return `${nhan} phải là số hợp lệ.`;

  return so < 0 ? `${nhan} không được nhỏ hơn 0.` : "";
}
