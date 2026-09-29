"use client";

import { useEffect, useState } from "react";
import { layChiTietPhieu } from "@/services/baoTri.service";
import type { KetQuaChecklist, LinhKienThayThe, PhieuBaoTri } from "@/types/baoTri";
import { NHAN_DON_VI_CHU_KY, NHAN_TRANG_THAI_PHIEU, dinhDangNgay, dinhDangNgayGio, layLopTrangThai, layTenLoi } from "@/utils/baoTri";

interface ChiTietPhieuBaoTriProps {
  idPhieu: number | null;
  xuLyDongChiTiet: () => void;
}

function layDanhSachAnToan<T>(giaTri: T[] | null | undefined): T[] {
  return Array.isArray(giaTri) ? giaTri : [];
}

function layNoiDungChecklist(hangMuc: KetQuaChecklist) {
  return typeof hangMuc?.noiDung === "string" && hangMuc.noiDung.trim() ? hangMuc.noiDung : "Hạng mục không có nội dung";
}

function layTenLinhKien(linhKien: LinhKienThayThe) {
  return typeof linhKien?.ten === "string" && linhKien.ten.trim() ? linhKien.ten : "Linh kiện không có tên";
}

export default function ChiTietPhieuBaoTri({ idPhieu, xuLyDongChiTiet }: ChiTietPhieuBaoTriProps) {
  const [phieuBaoTri, datPhieuBaoTri] = useState<PhieuBaoTri | null>(null);
  const [dangTai, datDangTai] = useState(true);
  const [loi, datLoi] = useState("");
  const [lanTaiLai, datLanTaiLai] = useState(0);

  useEffect(() => {
    if (idPhieu === null) return;
    let dangHoatDong = true;
    layChiTietPhieu(idPhieu).then((chiTietPhieu) => { if (dangHoatDong) datPhieuBaoTri(chiTietPhieu); }).catch((loiTai) => { if (dangHoatDong) datLoi(layTenLoi(loiTai, "Không thể tải chi tiết phiếu bảo trì.")); }).finally(() => { if (dangHoatDong) datDangTai(false); });
    return () => { dangHoatDong = false; };
  }, [idPhieu, lanTaiLai]);

  if (idPhieu === null) return null;
  function xuLyTaiLaiChiTiet() {
    datDangTai(true);
    datLoi("");
    datLanTaiLai((soLan) => soLan + 1);
  }
  const danhSachKetQua = layDanhSachAnToan(phieuBaoTri?.ketQuaChecklist);
  const danhSachLinhKien = layDanhSachAnToan(phieuBaoTri?.linhKienThayThe);

  return <div className="lop-phu" role="presentation" onMouseDown={(suKien) => suKien.target === suKien.currentTarget && xuLyDongChiTiet()}>
    <section className="hop-thoai hop-thoai-chi-tiet hop-thoai-phieu" role="dialog" aria-modal="true" aria-labelledby="tieu-de-chi-tiet-phieu">
      <header className="dau-hop-thoai"><h2 id="tieu-de-chi-tiet-phieu">Chi tiết phiếu bảo trì</h2><button className="nut-dong" type="button" onClick={xuLyDongChiTiet} aria-label="Đóng">×</button></header>
      {dangTai ? <div className="trang-thai-du-lieu"><span className="vong-xoay" /> Đang tải...</div> : loi || !phieuBaoTri ? <div className="trang-thai-du-lieu"><p className="tieu-de-loi">{loi || "Không tìm thấy phiếu bảo trì."}</p><button className="nut nut-phu" onClick={xuLyTaiLaiChiTiet}>Thử lại</button></div> : <div className="noi-dung-chi-tiet">
        <div className="dau-chi-tiet-bao-tri"><div><strong>{phieuBaoTri.thietBi.maThietBi} · {phieuBaoTri.thietBi.tenThietBi}</strong><span>{phieuBaoTri.keHoach.tenMauChecklist}</span></div><span className={`huy-hieu ${layLopTrangThai(phieuBaoTri.trangThai)}`}>{NHAN_TRANG_THAI_PHIEU[phieuBaoTri.trangThai]}</span></div>
        <section className="muc-chi-tiet-bao-tri"><h3>Tổng quan</h3><dl className="luoi-thong-tin"><div><dt>Ngày dự kiến</dt><dd>{dinhDangNgay(phieuBaoTri.ngayDuKien)}</dd></div><div><dt>Kỹ thuật viên</dt><dd>{phieuBaoTri.kyThuatVien?.hoTen || "Chưa phân công"}</dd></div><div><dt>Chu kỳ kế hoạch</dt><dd>{phieuBaoTri.keHoach.giaTriChuKy} {NHAN_DON_VI_CHU_KY[phieuBaoTri.keHoach.donViChuKy].toLowerCase()}</dd></div><div><dt>Ngày bảo trì tiếp theo</dt><dd>{dinhDangNgay(phieuBaoTri.keHoach.ngayBaoTriTiepTheo)}</dd></div></dl></section>
        <section className="muc-chi-tiet-bao-tri"><h3>Thời gian</h3><dl className="luoi-thong-tin"><div><dt>Bắt đầu</dt><dd>{dinhDangNgayGio(phieuBaoTri.thoiGianBatDau)}</dd></div><div><dt>Hoàn thành</dt><dd>{dinhDangNgayGio(phieuBaoTri.thoiGianHoanThanh)}</dd></div></dl></section>
        <section className="muc-chi-tiet-bao-tri"><h3>Checklist</h3>{danhSachKetQua.length === 0 ? <p className="chu-phu">Chưa có kết quả checklist.</p> : <div className="khung-bang bang-trong-chi-tiet"><table><thead><tr><th>Nội dung</th><th>Loại</th><th>Trạng thái</th><th>Ghi chú</th></tr></thead><tbody>{danhSachKetQua.map((ketQuaChecklist, viTri) => <tr key={`${ketQuaChecklist.id ?? "ket-qua"}-${viTri}`}><td>{layNoiDungChecklist(ketQuaChecklist)}</td><td>{ketQuaChecklist.loai || "-"}</td><td>{ketQuaChecklist.trangThai || "-"}</td><td className="o-noi-dung-dai">{ketQuaChecklist.ghiChu || "-"}</td></tr>)}</tbody></table></div>}</section>
        <section className="muc-chi-tiet-bao-tri"><h3>Linh kiện thay thế</h3>{danhSachLinhKien.length === 0 ? <p className="chu-phu">Không có linh kiện thay thế.</p> : <div className="khung-bang bang-trong-chi-tiet"><table><thead><tr><th>Tên linh kiện</th><th>Số lượng</th></tr></thead><tbody>{danhSachLinhKien.map((linhKien, viTri) => <tr key={`${linhKien.ten ?? "linh-kien"}-${viTri}`}><td>{layTenLinhKien(linhKien)}</td><td>{linhKien.soLuong ?? "-"}</td></tr>)}</tbody></table></div>}</section>
        <section className="muc-chi-tiet-bao-tri luoi-ket-qua-bao-tri"><div><h3>Kết quả bảo trì</h3><p>{phieuBaoTri.ketQuaBaoTri || "Chưa có kết quả bảo trì."}</p></div><div><h3>Ghi chú</h3><p>{phieuBaoTri.ghiChu || "Không có ghi chú."}</p></div></section>
      </div>}
    </section>
  </div>;
}
