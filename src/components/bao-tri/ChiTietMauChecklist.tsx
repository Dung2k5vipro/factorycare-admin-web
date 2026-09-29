"use client";

import { useEffect, useState } from "react";
import BieuMauChecklist from "./BieuMauChecklist";
import { layChiTietMauChecklist, ngungHoatDongMauChecklist } from "@/services/baoTri.service";
import type { MauChecklist } from "@/types/baoTri";
import { NHAN_TRANG_THAI_MAU, dinhDangNgayGio, layLopTrangThai, layTenLoi } from "@/utils/baoTri";

interface ChiTietMauChecklistProps {
  idMauChecklist: number | null;
  xuLyDongChiTiet: () => void;
  xuLyCapNhat: (thongBao: string) => void;
}

export default function ChiTietMauChecklist({ idMauChecklist, xuLyDongChiTiet, xuLyCapNhat }: ChiTietMauChecklistProps) {
  const [mauChecklist, datMauChecklist] = useState<MauChecklist | null>(null);
  const [dangTai, datDangTai] = useState(true);
  const [dangNgungHoatDong, datDangNgungHoatDong] = useState(false);
  const [dangMoChinhSua, datDangMoChinhSua] = useState(false);
  const [loi, datLoi] = useState("");
  const [lanTaiLai, datLanTaiLai] = useState(0);

  useEffect(() => {
    if (idMauChecklist === null) return;
    let dangHoatDong = true;
    layChiTietMauChecklist(idMauChecklist).then((chiTietMauChecklist) => { if (dangHoatDong) datMauChecklist(chiTietMauChecklist); }).catch((loiTai) => { if (dangHoatDong) datLoi(layTenLoi(loiTai, "Không thể tải mẫu checklist.")); }).finally(() => { if (dangHoatDong) datDangTai(false); });
    return () => { dangHoatDong = false; };
  }, [idMauChecklist, lanTaiLai]);

  if (idMauChecklist === null) return null;

  function xuLyTaiLaiChiTiet() {
    datDangTai(true);
    datLoi("");
    datLanTaiLai((soLan) => soLan + 1);
  }

  async function xuLyNgungHoatDong() {
    if (!mauChecklist || dangNgungHoatDong || !window.confirm("Ngừng sử dụng mẫu checklist này?")) return;
    datDangNgungHoatDong(true);
    try {
      await ngungHoatDongMauChecklist(mauChecklist.id);
      xuLyCapNhat("Đã ngừng hoạt động mẫu checklist.");
      xuLyDongChiTiet();
    } catch (loiGui) {
      datLoi(layTenLoi(loiGui, "Không thể ngừng mẫu checklist."));
      xuLyTaiLaiChiTiet();
    } finally { datDangNgungHoatDong(false); }
  }

  return <>
    <div className="lop-phu" role="presentation" onMouseDown={(suKien) => suKien.target === suKien.currentTarget && xuLyDongChiTiet()}>
      <section className="hop-thoai hop-thoai-chi-tiet" role="dialog" aria-modal="true" aria-labelledby="tieu-de-chi-tiet-mau">
        <header className="dau-hop-thoai"><h2 id="tieu-de-chi-tiet-mau">Chi tiết mẫu checklist</h2><button className="nut-dong" type="button" onClick={xuLyDongChiTiet} aria-label="Đóng">×</button></header>
        {dangTai ? <div className="trang-thai-du-lieu"><span className="vong-xoay" /> Đang tải...</div> : loi || !mauChecklist ? <div className="trang-thai-du-lieu"><p className="tieu-de-loi">{loi || "Không tìm thấy mẫu checklist."}</p><button className="nut nut-phu" onClick={xuLyTaiLaiChiTiet}>Thử lại</button></div> : <div className="noi-dung-chi-tiet">
          <div className="dau-chi-tiet-bao-tri"><div><strong>{mauChecklist.tenMau}</strong><span>{mauChecklist.loaiThietBi?.tenLoai || "Dùng chung"}</span></div><span className={`huy-hieu ${layLopTrangThai(mauChecklist.trangThai)}`}>{NHAN_TRANG_THAI_MAU[mauChecklist.trangThai]}</span></div>
          <dl className="luoi-thong-tin"><div><dt>Người tạo</dt><dd>{mauChecklist.nguoiTao?.hoTen || "-"}</dd></div><div><dt>Số hạng mục</dt><dd>{mauChecklist.danhSachHangMuc.length}</dd></div><div><dt>Ngày tạo</dt><dd>{dinhDangNgayGio(mauChecklist.ngayTao)}</dd></div><div><dt>Cập nhật</dt><dd>{dinhDangNgayGio(mauChecklist.ngayCapNhat)}</dd></div></dl>
          <section className="muc-chi-tiet-bao-tri"><h3>Hạng mục</h3>{mauChecklist.danhSachHangMuc.length === 0 ? <p>Chưa có hạng mục.</p> : <ol className="danh-sach-ket-qua">{mauChecklist.danhSachHangMuc.map((hangMuc, viTri) => <li key={`${hangMuc.id ?? "muc"}-${viTri}`}>{hangMuc.noiDung || "Hạng mục không có nội dung"}</li>)}</ol>}</section>
          <section className="muc-chi-tiet-bao-tri"><h3>Mô tả</h3><p>{mauChecklist.moTa || "Không có mô tả."}</p></section>
          {mauChecklist.trangThai === "HOAT_DONG" && <footer className="chan-chi-tiet"><button className="nut nut-phu" type="button" onClick={() => datDangMoChinhSua(true)}>Cập nhật</button><button className="nut nut-nguy-hiem" type="button" disabled={dangNgungHoatDong} onClick={() => void xuLyNgungHoatDong()}>{dangNgungHoatDong ? "Đang xử lý..." : "Ngừng hoạt động"}</button></footer>}
        </div>}
      </section>
    </div>
    <BieuMauChecklist dangMo={dangMoChinhSua} mauChecklist={mauChecklist} xuLyDongBieuMau={() => datDangMoChinhSua(false)} xuLyLuuThanhCong={(thongBao) => { datDangMoChinhSua(false); xuLyCapNhat(thongBao); xuLyTaiLaiChiTiet(); }} />
  </>;
}
