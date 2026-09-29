"use client";

import { FormEvent, useEffect, useState } from "react";
import { capNhatKeHoach, taoKeHoach } from "@/services/baoTri.service";
import type {
  DonViChuKy,
  KeHoachBaoTri,
  KyThuatVienBaoTri,
  MauChecklist,
} from "@/types/baoTri";
import type { ThietBi } from "@/types/thietBi";
import { layTenLoi } from "@/utils/baoTri";

interface BieuMauKeHoachProps {
  dangMo: boolean;
  keHoach?: KeHoachBaoTri | null;
  danhSachThietBi: ThietBi[];
  danhSachMauChecklist: MauChecklist[];
  danhSachKyThuatVien: KyThuatVienBaoTri[];
  xuLyDongBieuMau: () => void;
  xuLyLuuThanhCong: (thongBao: string) => void;
}

interface DuLieuNhapKeHoach {
  thietBiId: string;
  mauChecklistId: string;
  kyThuatVienId: string;
  giaTriChuKy: string;
  donViChuKy: DonViChuKy;
  ngayBatDau: string;
  moTa: string;
}

const DU_LIEU_BAN_DAU: DuLieuNhapKeHoach = {
  thietBiId: "",
  mauChecklistId: "",
  kyThuatVienId: "",
  giaTriChuKy: "",
  donViChuKy: "NGAY",
  ngayBatDau: "",
  moTa: "",
};

function taoDuLieuNhap(keHoach?: KeHoachBaoTri | null): DuLieuNhapKeHoach {
  if (!keHoach) return DU_LIEU_BAN_DAU;
  return {
    thietBiId: String(keHoach.thietBi.id),
    mauChecklistId: String(keHoach.mauChecklist.id),
    kyThuatVienId: keHoach.kyThuatVien ? String(keHoach.kyThuatVien.id) : "",
    giaTriChuKy: String(keHoach.giaTriChuKy),
    donViChuKy: keHoach.donViChuKy,
    ngayBatDau: keHoach.ngayBatDau,
    moTa: keHoach.moTa || "",
  };
}

export default function BieuMauKeHoach({
  dangMo,
  keHoach,
  danhSachThietBi,
  danhSachMauChecklist,
  danhSachKyThuatVien,
  xuLyDongBieuMau,
  xuLyLuuThanhCong,
}: BieuMauKeHoachProps) {
  const [duLieuNhap, datDuLieuNhap] = useState(() => taoDuLieuNhap(keHoach));
  const [loi, datLoi] = useState<Record<string, string>>({});
  const [dangLuu, datDangLuu] = useState(false);

  useEffect(() => {
    if (dangMo) {
      datDuLieuNhap(taoDuLieuNhap(keHoach));
      datLoi({});
    }
  }, [dangMo, keHoach]);

  if (!dangMo) return null;

  function xuLyCapNhatTruong(tenTruong: keyof DuLieuNhapKeHoach, giaTri: string) {
    datDuLieuNhap((duLieuNhapCu) => ({ ...duLieuNhapCu, [tenTruong]: giaTri }));
    datLoi((loiHienTai) => ({ ...loiHienTai, [tenTruong]: "", chung: "" }));
  }

  function kiemTraDuLieu() {
    const loiMoi: Record<string, string> = {};
    const thietBiId = Number(duLieuNhap.thietBiId);
    const mauChecklistId = Number(duLieuNhap.mauChecklistId);
    const kyThuatVienId = Number(duLieuNhap.kyThuatVienId);
    const giaTriChuKy = Number(duLieuNhap.giaTriChuKy);
    const thietBi = danhSachThietBi.find((thietBiTrongDanhSach) => thietBiTrongDanhSach.id === thietBiId);
    const mauChecklist = danhSachMauChecklist.find(
      (mauTrongDanhSach) => mauTrongDanhSach.id === mauChecklistId,
    );

    const coPhaiThietBiHienTai = Boolean(keHoach && keHoach.thietBi.id === thietBiId);
    const coPhaiMauHienTai = Boolean(keHoach && keHoach.mauChecklist.id === mauChecklistId);
    if (!Number.isInteger(thietBiId) || thietBiId <= 0 || (!thietBi && !coPhaiThietBiHienTai)) {
      loiMoi.thietBiId = "Vui lòng chọn thiết bị hợp lệ.";
    } else if (!keHoach && thietBi?.trangThai === "THANH_LY") {
      loiMoi.thietBiId = "Không thể lập kế hoạch cho thiết bị đã thanh lý.";
    }
    if (
      !Number.isInteger(mauChecklistId) ||
      mauChecklistId <= 0 ||
      !mauChecklist && !coPhaiMauHienTai
    ) {
      loiMoi.mauChecklistId = "Vui lòng chọn mẫu checklist hợp lệ.";
    } else if (mauChecklist && mauChecklist.trangThai !== "HOAT_DONG" && !coPhaiMauHienTai) {
      loiMoi.mauChecklistId = "Mẫu checklist đã ngừng hoạt động.";
    }
    if (
      !keHoach &&
      (!Number.isInteger(kyThuatVienId) ||
        kyThuatVienId <= 0 ||
        !danhSachKyThuatVien.some((kyThuatVien) => kyThuatVien.id === kyThuatVienId))
    ) {
      loiMoi.kyThuatVienId = "Kỹ thuật viên không hợp lệ.";
    }
    if (!/^\d+$/.test(duLieuNhap.giaTriChuKy) || !Number.isInteger(giaTriChuKy) || giaTriChuKy <= 0) {
      loiMoi.giaTriChuKy = "Chu kỳ phải là số nguyên lớn hơn 0.";
    }
    if (!/^(NGAY|TUAN|THANG|NAM)$/.test(duLieuNhap.donViChuKy)) {
      loiMoi.donViChuKy = "Đơn vị chu kỳ không hợp lệ.";
    }
    if (!/^\d{4}-\d{2}-\d{2}$/.test(duLieuNhap.ngayBatDau)) {
      loiMoi.ngayBatDau = "Vui lòng chọn ngày bắt đầu hợp lệ.";
    }
    if (duLieuNhap.moTa.trim().length > 10000) {
      loiMoi.moTa = "Mô tả không được vượt quá 10000 ký tự.";
    }
    datLoi(loiMoi);
    return Object.keys(loiMoi).length === 0;
  }

  async function xuLyLuu(suKien: FormEvent<HTMLFormElement>) {
    suKien.preventDefault();
    if (dangLuu || !kiemTraDuLieu()) return;
    datDangLuu(true);
    try {
      const duLieuKeHoachChung = {
        mauChecklistId: Number(duLieuNhap.mauChecklistId),
        giaTriChuKy: Number(duLieuNhap.giaTriChuKy),
        donViChuKy: duLieuNhap.donViChuKy,
        ngayBatDau: duLieuNhap.ngayBatDau,
        moTa: duLieuNhap.moTa.trim() || null,
      };
      if (keHoach) {
        const duLieuCapNhat: Partial<typeof duLieuKeHoachChung> = { ...duLieuKeHoachChung };
        if (Number(duLieuNhap.mauChecklistId) === keHoach.mauChecklist.id) {
          delete duLieuCapNhat.mauChecklistId;
        }
        await capNhatKeHoach(keHoach.id, duLieuCapNhat);
        xuLyLuuThanhCong("Đã cập nhật kế hoạch bảo trì.");
      } else {
        await taoKeHoach({
          ...duLieuKeHoachChung,
          thietBiId: Number(duLieuNhap.thietBiId),
          kyThuatVienId: Number(duLieuNhap.kyThuatVienId),
        });
        xuLyLuuThanhCong("Đã tạo kế hoạch bảo trì.");
      }
    } catch (loiGui) {
      datLoi((loiHienTai) => ({
        ...loiHienTai,
        chung: layTenLoi(loiGui, "Không thể lưu kế hoạch bảo trì."),
      }));
    } finally {
      datDangLuu(false);
    }
  }

  function xuLyDong() {
    if (!dangLuu) xuLyDongBieuMau();
  }

  return (
    <div className="lop-phu" role="presentation" onMouseDown={(suKien) => suKien.target === suKien.currentTarget && xuLyDong()}>
      <section className="hop-thoai" role="dialog" aria-modal="true" aria-labelledby="tieu-de-ke-hoach">
        <header className="dau-hop-thoai"><h2 id="tieu-de-ke-hoach">{keHoach ? "Cập nhật kế hoạch" : "Tạo kế hoạch bảo trì"}</h2><button className="nut-dong" type="button" onClick={xuLyDong} aria-label="Đóng">×</button></header>
        <form className="bieu-mau bieu-mau-them" onSubmit={xuLyLuu}>
          {loi.chung && <div className="thong-bao loi" role="alert">{loi.chung}</div>}
          <div className="luoi-hai-cot">
            <div className="nhom-truong"><label htmlFor="ke-hoach-thiet-bi">Thiết bị <em>*</em></label><select id="ke-hoach-thiet-bi" value={duLieuNhap.thietBiId} disabled={dangLuu || Boolean(keHoach)} onChange={(suKien) => xuLyCapNhatTruong("thietBiId", suKien.target.value)}><option value="">Chọn thiết bị</option>{keHoach && !danhSachThietBi.some((thietBi) => thietBi.id === keHoach.thietBi.id) && <option value={keHoach.thietBi.id}>{keHoach.thietBi.maThietBi} · {keHoach.thietBi.tenThietBi}</option>}{danhSachThietBi.filter((thietBi) => thietBi.trangThai !== "THANH_LY" || thietBi.id === keHoach?.thietBi.id).map((thietBi) => <option key={thietBi.id} value={thietBi.id}>{thietBi.maThietBi} · {thietBi.tenThietBi}</option>)}</select>{loi.thietBiId && <span className="loi-truong">{loi.thietBiId}</span>}</div>
            <div className="nhom-truong"><label htmlFor="ke-hoach-checklist">Mẫu checklist <em>*</em></label><select id="ke-hoach-checklist" value={duLieuNhap.mauChecklistId} disabled={dangLuu} onChange={(suKien) => xuLyCapNhatTruong("mauChecklistId", suKien.target.value)}><option value="">Chọn mẫu checklist</option>{keHoach && !danhSachMauChecklist.some((mauChecklist) => mauChecklist.id === keHoach.mauChecklist.id) && <option value={keHoach.mauChecklist.id}>{keHoach.mauChecklist.tenMau} (hiện tại)</option>}{danhSachMauChecklist.map((mauChecklist) => <option key={mauChecklist.id} value={mauChecklist.id}>{mauChecklist.tenMau}</option>)}</select>{loi.mauChecklistId && <span className="loi-truong">{loi.mauChecklistId}</span>}</div>
            <div className="nhom-truong"><label htmlFor="gia-tri-chu-ky">Giá trị chu kỳ <em>*</em></label><input id="gia-tri-chu-ky" type="text" inputMode="numeric" pattern="[0-9]*" value={duLieuNhap.giaTriChuKy} disabled={dangLuu} onChange={(suKien) => xuLyCapNhatTruong("giaTriChuKy", suKien.target.value.replace(/\D/g, ""))} />{loi.giaTriChuKy && <span className="loi-truong">{loi.giaTriChuKy}</span>}</div>
            <div className="nhom-truong"><label htmlFor="don-vi-chu-ky">Đơn vị chu kỳ <em>*</em></label><select id="don-vi-chu-ky" value={duLieuNhap.donViChuKy} disabled={dangLuu} onChange={(suKien) => xuLyCapNhatTruong("donViChuKy", suKien.target.value)}><option value="NGAY">Ngày</option><option value="TUAN">Tuần</option><option value="THANG">Tháng</option><option value="NAM">Năm</option></select>{loi.donViChuKy && <span className="loi-truong">{loi.donViChuKy}</span>}</div>
            <div className="nhom-truong"><label htmlFor="ngay-bat-dau">Ngày bắt đầu <em>*</em></label><input id="ngay-bat-dau" type="date" value={duLieuNhap.ngayBatDau} disabled={dangLuu} onChange={(suKien) => xuLyCapNhatTruong("ngayBatDau", suKien.target.value)} />{loi.ngayBatDau && <span className="loi-truong">{loi.ngayBatDau}</span>}</div>
            {!keHoach && <div className="nhom-truong"><label htmlFor="ke-hoach-ky-thuat-vien">Kỹ thuật viên <em>*</em></label><select id="ke-hoach-ky-thuat-vien" value={duLieuNhap.kyThuatVienId} disabled={dangLuu} onChange={(suKien) => xuLyCapNhatTruong("kyThuatVienId", suKien.target.value)}><option value="">Chọn kỹ thuật viên</option>{danhSachKyThuatVien.map((kyThuatVien) => <option key={kyThuatVien.id} value={kyThuatVien.id}>{kyThuatVien.hoTen} · {kyThuatVien.email}</option>)}</select>{loi.kyThuatVienId && <span className="loi-truong">{loi.kyThuatVienId}</span>}</div>}
          </div>
          <div className="nhom-truong"><label htmlFor="mo-ta-ke-hoach">Mô tả</label><textarea id="mo-ta-ke-hoach" rows={4} value={duLieuNhap.moTa} disabled={dangLuu} onChange={(suKien) => xuLyCapNhatTruong("moTa", suKien.target.value)} />{loi.moTa && <span className="loi-truong">{loi.moTa}</span>}</div>
          <footer className="chan-hop-thoai"><button className="nut nut-phu" type="button" onClick={xuLyDong} disabled={dangLuu}>Hủy</button><button className="nut nut-chinh" type="submit" disabled={dangLuu}>{dangLuu ? "Đang lưu..." : keHoach ? "Lưu thay đổi" : "Tạo kế hoạch"}</button></footer>
        </form>
      </section>
    </div>
  );
}
