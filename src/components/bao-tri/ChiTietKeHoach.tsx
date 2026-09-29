"use client";

import { useEffect, useState } from "react";
import BieuMauKeHoach from "./BieuMauKeHoach";
import {
  layChiTietKeHoach,
  layLichSuPhanCong,
  ngungHoatDongKeHoach,
  phanCongKeHoach,
} from "@/services/baoTri.service";
import type {
  KeHoachBaoTri,
  KyThuatVienBaoTri,
  LichSuPhanCong,
  MauChecklist,
} from "@/types/baoTri";
import type { ThietBi } from "@/types/thietBi";
import {
  NHAN_DON_VI_CHU_KY,
  NHAN_TRANG_THAI_KE_HOACH,
  NHAN_TRANG_THAI_PHIEU,
  dinhDangNgay,
  dinhDangNgayGio,
  layTenLoi,
  layLopTrangThai,
} from "@/utils/baoTri";

interface ChiTietKeHoachProps {
  idKeHoach: number | null;
  danhSachThietBi: ThietBi[];
  danhSachMauChecklist: MauChecklist[];
  danhSachKyThuatVien: KyThuatVienBaoTri[];
  xuLyDongChiTiet: () => void;
  xuLyCapNhat: (thongBao: string) => void;
}

export default function ChiTietKeHoach({ idKeHoach, danhSachThietBi, danhSachMauChecklist, danhSachKyThuatVien, xuLyDongChiTiet, xuLyCapNhat }: ChiTietKeHoachProps) {
  const [keHoach, datKeHoach] = useState<KeHoachBaoTri | null>(null);
  const [danhSachPhieu, datDanhSachPhieu] = useState<LichSuPhanCong[]>([]);
  const [kyThuatVienId, datKyThuatVienId] = useState("");
  const [dangTai, datDangTai] = useState(true);
  const [dangPhanCong, datDangPhanCong] = useState(false);
  const [dangNgungHoatDong, datDangNgungHoatDong] = useState(false);
  const [dangMoChinhSua, datDangMoChinhSua] = useState(false);
  const [loi, datLoi] = useState("");
  const [loiPhanCong, datLoiPhanCong] = useState("");
  const [lanTaiLai, datLanTaiLai] = useState(0);

  useEffect(() => {
    if (idKeHoach === null) return;
    let dangHoatDong = true;
    Promise.all([layChiTietKeHoach(idKeHoach), layLichSuPhanCong(idKeHoach)])
      .then(([chiTiet, lichSu]) => {
        if (!dangHoatDong) return;
        datKeHoach(chiTiet);
        datDanhSachPhieu(lichSu.danhSach);
        datKyThuatVienId(chiTiet.kyThuatVien ? String(chiTiet.kyThuatVien.id) : "");
      })
      .catch((loiTai) => {
        if (dangHoatDong) datLoi(layTenLoi(loiTai, "Không thể tải chi tiết kế hoạch."));
      })
      .finally(() => { if (dangHoatDong) datDangTai(false); });
    return () => { dangHoatDong = false; };
  }, [idKeHoach, lanTaiLai]);

  if (idKeHoach === null) return null;
  const coTheThaoTac = keHoach?.trangThai === "HOAT_DONG" && keHoach.thietBi.trangThai !== "THANH_LY";

  function xuLyTaiLaiChiTiet() {
    datDangTai(true);
    datLoi("");
    datLanTaiLai((soLan) => soLan + 1);
  }

  async function xuLyPhanCong() {
    if (!keHoach || dangPhanCong) return;
    const idKyThuatVienDaChon = Number(kyThuatVienId);
    const kyThuatVien = danhSachKyThuatVien.find((kyThuatVienTrongDanhSach) => kyThuatVienTrongDanhSach.id === idKyThuatVienDaChon);
    if (!Number.isInteger(idKyThuatVienDaChon) || idKyThuatVienDaChon <= 0 || !kyThuatVien) {
      datLoiPhanCong("Vui lòng chọn kỹ thuật viên hợp lệ.");
      return;
    }
    if (keHoach.kyThuatVien?.id === idKyThuatVienDaChon) {
      datLoiPhanCong("Kỹ thuật viên này đang được phân công.");
      return;
    }
    if (!window.confirm(keHoach.kyThuatVien ? "Đổi kỹ thuật viên phụ trách?" : "Phân công kỹ thuật viên?")) return;
    datDangPhanCong(true);
    datLoiPhanCong("");
    try {
      await phanCongKeHoach(keHoach.id, idKyThuatVienDaChon);
      xuLyCapNhat("Đã phân công kỹ thuật viên.");
      xuLyTaiLaiChiTiet();
    } catch (loiGui) {
      datLoiPhanCong(layTenLoi(loiGui, "Không thể phân công kỹ thuật viên."));
      xuLyTaiLaiChiTiet();
    } finally {
      datDangPhanCong(false);
    }
  }

  async function xuLyNgungHoatDong() {
    if (!keHoach || dangNgungHoatDong || !window.confirm("Ngừng kế hoạch bảo trì này?")) return;
    datDangNgungHoatDong(true);
    try {
      await ngungHoatDongKeHoach(keHoach.id);
      xuLyCapNhat("Đã ngừng kế hoạch bảo trì.");
      xuLyDongChiTiet();
    } catch (loiGui) {
      datLoi(layTenLoi(loiGui, "Không thể ngừng kế hoạch bảo trì."));
      xuLyTaiLaiChiTiet();
    } finally {
      datDangNgungHoatDong(false);
    }
  }

  return (
    <>
      <div className="lop-phu" role="presentation" onMouseDown={(suKien) => suKien.target === suKien.currentTarget && xuLyDongChiTiet()}>
        <section className="hop-thoai hop-thoai-chi-tiet hop-thoai-rong" role="dialog" aria-modal="true" aria-labelledby="tieu-de-chi-tiet-ke-hoach">
          <header className="dau-hop-thoai"><h2 id="tieu-de-chi-tiet-ke-hoach">Chi tiết kế hoạch</h2><button className="nut-dong" type="button" onClick={xuLyDongChiTiet} aria-label="Đóng">×</button></header>
          {dangTai ? <div className="trang-thai-du-lieu"><span className="vong-xoay" /> Đang tải...</div> : loi || !keHoach ? <div className="trang-thai-du-lieu"><p className="tieu-de-loi">{loi || "Không tìm thấy kế hoạch bảo trì."}</p><button className="nut nut-phu" onClick={xuLyTaiLaiChiTiet}>Thử lại</button></div> : <div className="noi-dung-chi-tiet">
            <div className="dau-chi-tiet-bao-tri"><div><strong>{keHoach.thietBi.maThietBi} · {keHoach.thietBi.tenThietBi}</strong><span>{keHoach.mauChecklist.tenMau}</span></div><span className={`huy-hieu ${layLopTrangThai(keHoach.trangThai)}`}>{NHAN_TRANG_THAI_KE_HOACH[keHoach.trangThai]}</span></div>
            <dl className="luoi-thong-tin">
              <div><dt>Chu kỳ</dt><dd>{keHoach.giaTriChuKy} {NHAN_DON_VI_CHU_KY[keHoach.donViChuKy].toLowerCase()}</dd></div>
              <div><dt>Kỹ thuật viên</dt><dd>{keHoach.kyThuatVien?.hoTen || "Chưa phân công"}</dd></div>
              <div><dt>Ngày bắt đầu</dt><dd>{dinhDangNgay(keHoach.ngayBatDau)}</dd></div>
              <div><dt>Ngày bảo trì tiếp theo</dt><dd>{dinhDangNgay(keHoach.ngayBaoTriTiepTheo)}</dd></div>
              <div><dt>Ngày tạo</dt><dd>{dinhDangNgayGio(keHoach.ngayTao)}</dd></div>
              <div><dt>Cập nhật</dt><dd>{dinhDangNgayGio(keHoach.ngayCapNhat)}</dd></div>
            </dl>
            <section className="muc-chi-tiet-bao-tri"><h3>Mô tả</h3><p>{keHoach.moTa || "Không có mô tả."}</p></section>
            {coTheThaoTac && <section className="muc-chi-tiet-bao-tri"><h3>{keHoach.kyThuatVien ? "Tái phân công" : "Phân công"}</h3><div className="hang-phan-cong"><select value={kyThuatVienId} disabled={dangPhanCong} onChange={(suKien) => { datKyThuatVienId(suKien.target.value); datLoiPhanCong(""); }}><option value="">Chọn kỹ thuật viên</option>{danhSachKyThuatVien.map((kyThuatVien) => <option key={kyThuatVien.id} value={kyThuatVien.id}>{kyThuatVien.hoTen} · {kyThuatVien.email}</option>)}</select><button className="nut nut-chinh" type="button" disabled={dangPhanCong} onClick={() => void xuLyPhanCong()}>{dangPhanCong ? "Đang lưu..." : "Xác nhận"}</button></div>{loiPhanCong && <span className="loi-truong">{loiPhanCong}</span>}</section>}
            <section className="muc-chi-tiet-bao-tri"><h3>Phiếu bảo trì liên quan</h3>{danhSachPhieu.length === 0 ? <p className="chu-phu">Chưa có phiếu bảo trì.</p> : <div className="khung-bang bang-trong-chi-tiet"><table><thead><tr><th>Ngày dự kiến</th><th>Kỹ thuật viên</th><th>Trạng thái</th><th>Hoàn thành</th></tr></thead><tbody>{danhSachPhieu.map((phieu) => <tr key={phieu.phieuBaoTriId}><td>{dinhDangNgay(phieu.ngayDuKien)}</td><td>{phieu.kyThuatVien?.hoTen || "Chưa phân công"}</td><td><span className={`huy-hieu ${layLopTrangThai(phieu.trangThai)}`}>{NHAN_TRANG_THAI_PHIEU[phieu.trangThai]}</span></td><td>{dinhDangNgayGio(phieu.thoiGianHoanThanh)}</td></tr>)}</tbody></table></div>}</section>
            {coTheThaoTac && <footer className="chan-chi-tiet"><button className="nut nut-phu" type="button" onClick={() => datDangMoChinhSua(true)}>Cập nhật</button><button className="nut nut-nguy-hiem" type="button" disabled={dangNgungHoatDong} onClick={() => void xuLyNgungHoatDong()}>{dangNgungHoatDong ? "Đang xử lý..." : "Ngừng kế hoạch"}</button></footer>}
          </div>}
        </section>
      </div>
      <BieuMauKeHoach dangMo={dangMoChinhSua} keHoach={keHoach} danhSachThietBi={danhSachThietBi} danhSachMauChecklist={danhSachMauChecklist} danhSachKyThuatVien={danhSachKyThuatVien} xuLyDongBieuMau={() => datDangMoChinhSua(false)} xuLyLuuThanhCong={(thongBao) => { datDangMoChinhSua(false); xuLyCapNhat(thongBao); xuLyTaiLaiChiTiet(); }} />
    </>
  );
}
