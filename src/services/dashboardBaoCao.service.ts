import { guiYeuCau, guiYeuCauTep } from "./httpClient";
import { LoiHttp } from "@/types/api";
import type {
  BoLocBaoCao,
  DinhDangXuat,
  DuLieuDashboardTongQuan,
  KetQuaBaoCao,
  LoaiBaoCao,
  ThamSoDashboard,
} from "@/types/dashboardBaoCao";
import { kiemTraNgayBaoCao } from "@/utils/dashboardBaoCao";

const DUONG_DAN_BAO_CAO: Record<LoaiBaoCao, string> = {
  "su-co": "/bao-cao/su-co",
  "sua-chua": "/bao-cao/sua-chua",
  "bao-tri": "/bao-cao/bao-tri",
  "thiet-bi": "/bao-cao/thiet-bi",
};

const DANH_SACH_LOAI_BAO_CAO: LoaiBaoCao[] = [
  "su-co",
  "sua-chua",
  "bao-tri",
  "thiet-bi",
];

function kiemTraIdTuyChon(giaTri?: number) {
  return giaTri === undefined || (Number.isSafeInteger(giaTri) && giaTri > 0);
}

function kiemTraBoLoc(boLoc: BoLocBaoCao) {
  if (
    !Number.isSafeInteger(boLoc.trang) ||
    boLoc.trang < 1 ||
    !Number.isSafeInteger(boLoc.gioiHan) ||
    boLoc.gioiHan < 1 ||
    boLoc.gioiHan > 100
  ) {
    throw new LoiHttp(0, "Thông tin phân trang không hợp lệ.");
  }

  if (
    !kiemTraIdTuyChon(boLoc.thietBiId) ||
    !kiemTraIdTuyChon(boLoc.loaiThietBiId) ||
    !kiemTraIdTuyChon(boLoc.viTriId) ||
    !kiemTraIdTuyChon(boLoc.kyThuatVienId)
  ) {
    throw new LoiHttp(0, "Bộ lọc liên kết không hợp lệ.");
  }

  if (
    (boLoc.tuNgay && !kiemTraNgayBaoCao(boLoc.tuNgay)) ||
    (boLoc.denNgay && !kiemTraNgayBaoCao(boLoc.denNgay)) ||
    (boLoc.tuNgay && boLoc.denNgay && boLoc.tuNgay > boLoc.denNgay)
  ) {
    throw new LoiHttp(
      0,
      "Ngày bắt đầu phải trước hoặc bằng ngày kết thúc.",
    );
  }
}

function taoThamSoBaoCao(boLoc: BoLocBaoCao) {
  kiemTraBoLoc(boLoc);
  const thamSo = new URLSearchParams({
    trang: String(boLoc.trang),
    gioiHan: String(boLoc.gioiHan),
  });
  const danhSachGiaTri: Array<[string, string | number | undefined]> = [
    ["tuNgay", boLoc.tuNgay],
    ["denNgay", boLoc.denNgay],
    ["thietBiId", boLoc.thietBiId],
    ["loaiThietBiId", boLoc.loaiThietBiId],
    ["viTriId", boLoc.viTriId],
    ["kyThuatVienId", boLoc.kyThuatVienId],
    ["mucDo", boLoc.mucDo],
    ["trangThai", boLoc.trangThai],
    ["ketQua", boLoc.ketQua],
    ["sapXepTheo", boLoc.sapXepTheo],
    ["thuTu", boLoc.thuTu],
  ];
  for (const [ten, giaTri] of danhSachGiaTri) {
    if (giaTri !== undefined && giaTri !== "") thamSo.set(ten, String(giaTri));
  }
  return thamSo;
}

export function layDashboardTongQuan(thamSoDashboard: ThamSoDashboard) {
  const { khoangThoiGian, tuNgay, denNgay } = thamSoDashboard;
  if (
    khoangThoiGian === "TUY_CHINH" &&
    (!tuNgay || !denNgay || !kiemTraNgayBaoCao(tuNgay) || !kiemTraNgayBaoCao(denNgay) || tuNgay > denNgay)
  ) {
    throw new LoiHttp(
      0,
      "Ngày bắt đầu phải trước hoặc bằng ngày kết thúc.",
    );
  }
  const soNgayCanhBao = thamSoDashboard.soNgayCanhBao ?? 7;
  const gioiHanTop = thamSoDashboard.gioiHanTop ?? 5;
  if (!Number.isInteger(soNgayCanhBao) || soNgayCanhBao < 1 || soNgayCanhBao > 90) {
    throw new LoiHttp(0, "Số ngày cảnh báo phải từ 1 đến 90.");
  }
  if (!Number.isInteger(gioiHanTop) || gioiHanTop < 1 || gioiHanTop > 20) {
    throw new LoiHttp(0, "Giới hạn danh sách cần chú ý phải từ 1 đến 20.");
  }

  const thamSo = new URLSearchParams({
    khoangThoiGian,
    soNgayCanhBao: String(soNgayCanhBao),
    gioiHanTop: String(gioiHanTop),
  });
  if (khoangThoiGian === "TUY_CHINH") {
    thamSo.set("tuNgay", tuNgay as string);
    thamSo.set("denNgay", denNgay as string);
  }
  return guiYeuCau<DuLieuDashboardTongQuan>(`/dashboard/tong-quan?${thamSo}`);
}

export function layBaoCao(loaiBaoCao: LoaiBaoCao, boLoc: BoLocBaoCao) {
  if (!DANH_SACH_LOAI_BAO_CAO.includes(loaiBaoCao)) {
    throw new LoiHttp(0, "Loại báo cáo không hợp lệ.");
  }
  if (loaiBaoCao === "thiet-bi" && (boLoc.tuNgay || boLoc.denNgay || boLoc.kyThuatVienId)) {
    throw new LoiHttp(0, "Báo cáo thiết bị không hỗ trợ ngày hoặc kỹ thuật viên.");
  }
  return guiYeuCau<KetQuaBaoCao>(
    `${DUONG_DAN_BAO_CAO[loaiBaoCao]}?${taoThamSoBaoCao(boLoc)}`,
  );
}

export async function xuatBaoCao(
  loaiBaoCao: LoaiBaoCao,
  boLoc: BoLocBaoCao,
  dinhDang: DinhDangXuat,
) {
  if (!DANH_SACH_LOAI_BAO_CAO.includes(loaiBaoCao)) {
    throw new LoiHttp(0, "Loại báo cáo không hợp lệ.");
  }
  const thamSo = taoThamSoBaoCao(boLoc);
  thamSo.set("dinhDang", dinhDang);
  const { tep, tenTep } = await guiYeuCauTep(
    `/bao-cao/${loaiBaoCao}/export?${thamSo}`,
  );
  const duongDanTam = URL.createObjectURL(tep);
  const lienKet = document.createElement("a");
  lienKet.href = duongDanTam;
  lienKet.download = tenTep;
  document.body.appendChild(lienKet);
  lienKet.click();
  lienKet.remove();
  URL.revokeObjectURL(duongDanTam);
}

