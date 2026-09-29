import { guiYeuCau } from "./httpClient";
import { LoiHttp } from "@/types/api";
import type {
  BoLocKeHoach,
  BoLocMauChecklist,
  BoLocPhieuBaoTri,
  DuLieuKeHoach,
  DuLieuMauChecklist,
  KeHoachBaoTri,
  KetQuaDanhSach,
  KetQuaSapDenHan,
  LichSuPhanCong,
  MauChecklist,
  PhieuBaoTri,
} from "@/types/baoTri";
import { kiemTraIdHopLe } from "@/utils/baoTri";

function taoThamSoPhanTrang(trang: number, gioiHan: number) {
  return new URLSearchParams({ trang: String(trang), gioiHan: String(gioiHan) });
}

function kiemTraId(id: number, tenDoiTuong: string) {
  if (!kiemTraIdHopLe(id)) throw new LoiHttp(0, `${tenDoiTuong} không hợp lệ.`);
}

export function layDanhSachKeHoach(boLoc: BoLocKeHoach) {
  const thamSo = taoThamSoPhanTrang(boLoc.trang, boLoc.gioiHan);
  if (boLoc.trangThai) thamSo.set("trangThai", boLoc.trangThai);
  if (boLoc.thietBiId) thamSo.set("thietBiId", String(boLoc.thietBiId));
  if (boLoc.kyThuatVienId)
    thamSo.set("kyThuatVienId", String(boLoc.kyThuatVienId));
  return guiYeuCau<KetQuaDanhSach<KeHoachBaoTri>>(
    `/bao-tri/ke-hoach?${thamSo}`,
  );
}

export function layChiTietKeHoach(idKeHoach: number) {
  kiemTraId(idKeHoach, "Kế hoạch bảo trì");
  return guiYeuCau<KeHoachBaoTri>(`/bao-tri/ke-hoach/${idKeHoach}`);
}

export function taoKeHoach(duLieuKeHoach: DuLieuKeHoach) {
  return guiYeuCau<KeHoachBaoTri>("/bao-tri/ke-hoach", {
    method: "POST",
    body: JSON.stringify(duLieuKeHoach),
  });
}

export function capNhatKeHoach(
  idKeHoach: number,
  duLieuKeHoach: Partial<Omit<DuLieuKeHoach, "thietBiId" | "kyThuatVienId">>,
) {
  kiemTraId(idKeHoach, "Kế hoạch bảo trì");
  return guiYeuCau<KeHoachBaoTri>(`/bao-tri/ke-hoach/${idKeHoach}`, {
    method: "PUT",
    body: JSON.stringify(duLieuKeHoach),
  });
}

export function ngungHoatDongKeHoach(idKeHoach: number) {
  kiemTraId(idKeHoach, "Kế hoạch bảo trì");
  return guiYeuCau<KeHoachBaoTri>(`/bao-tri/ke-hoach/${idKeHoach}`, {
    method: "DELETE",
  });
}

export function phanCongKeHoach(idKeHoach: number, kyThuatVienId: number) {
  kiemTraId(idKeHoach, "Kế hoạch bảo trì");
  kiemTraId(kyThuatVienId, "Kỹ thuật viên");
  return guiYeuCau<{
    keHoachBaoTriId: number;
    phieuBaoTriId: number;
    kyThuatVienId: number;
  }>(`/bao-tri/ke-hoach/${idKeHoach}/phan-cong`, {
    method: "POST",
    body: JSON.stringify({ kyThuatVienId }),
  });
}

export function layLichSuPhanCong(idKeHoach: number) {
  kiemTraId(idKeHoach, "Kế hoạch bảo trì");
  return guiYeuCau<{ danhSach: LichSuPhanCong[] }>(
    `/bao-tri/ke-hoach/${idKeHoach}/lich-su-phan-cong`,
  );
}

export function layDanhSachMauChecklist(boLoc: BoLocMauChecklist) {
  const thamSo = taoThamSoPhanTrang(boLoc.trang, boLoc.gioiHan);
  if (boLoc.trangThai) thamSo.set("trangThai", boLoc.trangThai);
  if (boLoc.loaiThietBiId)
    thamSo.set("loaiThietBiId", String(boLoc.loaiThietBiId));
  return guiYeuCau<KetQuaDanhSach<MauChecklist>>(
    `/bao-tri/checklist?${thamSo}`,
  );
}

export function layChiTietMauChecklist(idMauChecklist: number) {
  kiemTraId(idMauChecklist, "Mẫu checklist");
  return guiYeuCau<MauChecklist>(`/bao-tri/checklist/${idMauChecklist}`);
}

export function taoMauChecklist(duLieuMauChecklist: DuLieuMauChecklist) {
  return guiYeuCau<MauChecklist>("/bao-tri/checklist", {
    method: "POST",
    body: JSON.stringify(duLieuMauChecklist),
  });
}

export function capNhatMauChecklist(idMauChecklist: number, duLieuMauChecklist: DuLieuMauChecklist) {
  kiemTraId(idMauChecklist, "Mẫu checklist");
  return guiYeuCau<MauChecklist>(`/bao-tri/checklist/${idMauChecklist}`, {
    method: "PUT",
    body: JSON.stringify(duLieuMauChecklist),
  });
}

export function ngungHoatDongMauChecklist(idMauChecklist: number) {
  kiemTraId(idMauChecklist, "Mẫu checklist");
  return guiYeuCau<MauChecklist>(`/bao-tri/checklist/${idMauChecklist}`, {
    method: "DELETE",
  });
}

export function layDanhSachPhieu(boLoc: BoLocPhieuBaoTri) {
  const thamSo = taoThamSoPhanTrang(boLoc.trang, boLoc.gioiHan);
  if (boLoc.trangThai) thamSo.set("trangThai", boLoc.trangThai);
  if (boLoc.thietBiId) thamSo.set("thietBiId", String(boLoc.thietBiId));
  if (boLoc.kyThuatVienId)
    thamSo.set("kyThuatVienId", String(boLoc.kyThuatVienId));
  if (boLoc.tuNgay) thamSo.set("tuNgay", boLoc.tuNgay);
  if (boLoc.denNgay) thamSo.set("denNgay", boLoc.denNgay);
  return guiYeuCau<KetQuaDanhSach<PhieuBaoTri>>(
    `/bao-tri/phieu?${thamSo}`,
  );
}

export function layChiTietPhieu(idPhieu: number) {
  kiemTraId(idPhieu, "Phiếu bảo trì");
  return guiYeuCau<PhieuBaoTri>(`/bao-tri/phieu/${idPhieu}`);
}

export function layDanhSachSapDenHan() {
  return guiYeuCau<KetQuaSapDenHan>("/bao-tri/sap-den-han");
}
