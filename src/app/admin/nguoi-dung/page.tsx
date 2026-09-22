"use client";

import { useEffect, useState } from "react";
import ChiTietNguoiDung from "@/components/nguoi-dung/ChiTietNguoiDung";
import ThemNguoiDung from "@/components/nguoi-dung/ThemNguoiDung";
import { layDanhSachNguoiDung } from "@/services/nguoiDung.service";
import type { LoiHttp } from "@/types/api";
import type { NguoiDung, TrangThaiNguoiDung, VaiTro } from "@/types/nguoiDung";

const SO_BAN_GHI_MOI_TRANG = 10;
const NHAN_VAI_TRO: Record<VaiTro, string> = {
  QUAN_TRI_VIEN: "Quản trị viên",
  KY_THUAT_VIEN: "Kỹ thuật viên",
  NHAN_VIEN: "Nhân viên",
};
const NHAN_TRANG_THAI: Record<TrangThaiNguoiDung, string> = {
  HOAT_DONG: "Hoạt động",
  NGUNG_HOAT_DONG: "Ngừng hoạt động",
};

export default function TrangDanhSachNguoiDung() {
  const [danhSachNguoiDung, datDanhSachNguoiDung] = useState<NguoiDung[]>([]);
  const [tuKhoaNhap, datTuKhoaNhap] = useState("");
  const [tuKhoaTimKiem, datTuKhoaTimKiem] = useState("");
  const [vaiTroDangLoc, datVaiTroDangLoc] = useState<VaiTro | "">("");
  const [trangThaiDangLoc, datTrangThaiDangLoc] = useState<TrangThaiNguoiDung | "">("");
  const [trangHienTai, datTrangHienTai] = useState(1);
  const [tongSoTrang, datTongSoTrang] = useState(0);
  const [dangTai, datDangTai] = useState(true);
  const [loiTaiDuLieu, datLoiTaiDuLieu] = useState("");
  const [dangMoBieuMau, datDangMoBieuMau] = useState(false);
  const [idNguoiDungDangChon, datIdNguoiDungDangChon] = useState<number | null>(null);
  const [thongBaoThanhCong, datThongBaoThanhCong] = useState("");
  const [lanTaiLai, datLanTaiLai] = useState(0);

  useEffect(() => {
    let dangHoatDong = true;
    layDanhSachNguoiDung({ trang: trangHienTai, gioiHan: SO_BAN_GHI_MOI_TRANG, tuKhoa: tuKhoaTimKiem || undefined, vaiTro: vaiTroDangLoc || undefined, trangThai: trangThaiDangLoc || undefined })
      .then((ketQua) => {
        if (!dangHoatDong) return;
        datDanhSachNguoiDung(ketQua.danhSach);
        datTongSoTrang(ketQua.phanTrang.tongTrang);
      })
      .catch((loi) => {
        if (dangHoatDong) {
          datLoiTaiDuLieu(
            (loi as LoiHttp).message || "Không thể tải danh sách người dùng.",
          );
        }
      })
      .finally(() => { if (dangHoatDong) datDangTai(false); });
    return () => { dangHoatDong = false; };
  }, [trangHienTai, tuKhoaTimKiem, vaiTroDangLoc, trangThaiDangLoc, lanTaiLai]);

  useEffect(() => {
    const tuKhoaMoi = tuKhoaNhap.trim();
    if (tuKhoaMoi === tuKhoaTimKiem) return;

    const boDem = window.setTimeout(() => {
      datDangTai(true);
      datLoiTaiDuLieu("");
      datTrangHienTai(1);
      datTuKhoaTimKiem(tuKhoaMoi);
    }, 400);
    return () => window.clearTimeout(boDem);
  }, [tuKhoaNhap, tuKhoaTimKiem]);

  function taiLaiDanhSach() { datDangTai(true); datLoiTaiDuLieu(""); datLanTaiLai((soLan) => soLan + 1); }
  function xoaBoLoc() { datDangTai(true); datLoiTaiDuLieu(""); datTuKhoaNhap(""); datTuKhoaTimKiem(""); datVaiTroDangLoc(""); datTrangThaiDangLoc(""); datTrangHienTai(1); }
  function hienThongBao(thongBao: string) { datThongBaoThanhCong(thongBao); window.setTimeout(() => datThongBaoThanhCong(""), 4000); }
  function xuLyThemThanhCong() { datDangMoBieuMau(false); datTrangHienTai(1); hienThongBao("Thêm người dùng thành công."); taiLaiDanhSach(); }
  function xuLyCapNhat(thongBao: string) { hienThongBao(thongBao); taiLaiDanhSach(); }

  const dangLoc = Boolean(tuKhoaTimKiem || vaiTroDangLoc || trangThaiDangLoc);

  return (
    <>
      <section className="thanh-cong-cu"><button className="nut nut-chinh" onClick={() => datDangMoBieuMau(true)}>Thêm người dùng</button></section>
      {thongBaoThanhCong && <div className="thong-bao thanh-cong" role="status">{thongBaoThanhCong}</div>}
      <section className="the-noi-dung">
        <div className="bo-loc">
          <div className="o-tim-kiem"><span aria-hidden="true">⌕</span><input value={tuKhoaNhap} onChange={(suKien) => datTuKhoaNhap(suKien.target.value)} placeholder="Tìm kiếm" aria-label="Tìm kiếm người dùng" /></div>
          <select value={vaiTroDangLoc} onChange={(suKien) => { datDangTai(true); datLoiTaiDuLieu(""); datVaiTroDangLoc(suKien.target.value as VaiTro | ""); datTrangHienTai(1); }} aria-label="Lọc theo vai trò"><option value="">Tất cả vai trò</option><option value="QUAN_TRI_VIEN">Quản trị viên</option><option value="KY_THUAT_VIEN">Kỹ thuật viên</option><option value="NHAN_VIEN">Nhân viên</option></select>
          <select value={trangThaiDangLoc} onChange={(suKien) => { datDangTai(true); datLoiTaiDuLieu(""); datTrangThaiDangLoc(suKien.target.value as TrangThaiNguoiDung | ""); datTrangHienTai(1); }} aria-label="Lọc theo trạng thái"><option value="">Tất cả trạng thái</option><option value="HOAT_DONG">Hoạt động</option><option value="NGUNG_HOAT_DONG">Ngừng hoạt động</option></select>
          <button className="nut nut-phu" onClick={xoaBoLoc} disabled={!dangLoc}>Xóa bộ lọc</button>
        </div>
        {dangTai ? <div className="trang-thai-du-lieu"><span className="vong-xoay" /> Đang tải...</div> : loiTaiDuLieu ? <div className="trang-thai-du-lieu"><p>{loiTaiDuLieu}</p><button className="nut nut-phu" onClick={taiLaiDanhSach}>Thử lại</button></div> : danhSachNguoiDung.length === 0 ? <div className="trang-thai-du-lieu"><p>{dangLoc ? "Không tìm thấy người dùng phù hợp." : "Chưa có người dùng."}</p></div> : <div className="khung-bang"><table><thead><tr><th>Họ tên</th><th>Email</th><th>Số điện thoại</th><th>Vai trò</th><th>Trạng thái</th><th>Ngày tạo</th><th aria-label="Thao tác" /></tr></thead><tbody>{danhSachNguoiDung.map((nguoiDung) => <tr key={nguoiDung.id} onClick={() => datIdNguoiDungDangChon(nguoiDung.id)} className="dong-co-the-chon"><td><span className="ten-nguoi-dung"><span className="avatar avatar-bang">{nguoiDung.hoTen.slice(0, 1).toUpperCase()}</span><strong>{nguoiDung.hoTen}</strong></span></td><td>{nguoiDung.email}</td><td>{nguoiDung.soDienThoai || "-"}</td><td><span className={`huy-hieu vai-tro-${nguoiDung.vaiTro.toLowerCase()}`}>{NHAN_VAI_TRO[nguoiDung.vaiTro]}</span></td><td><span className={`trang-thai ${nguoiDung.trangThai === "HOAT_DONG" ? "hoat-dong" : "ngung-hoat-dong"}`}><i />{NHAN_TRANG_THAI[nguoiDung.trangThai]}</span></td><td>{nguoiDung.ngayTao ? new Intl.DateTimeFormat("vi-VN").format(new Date(nguoiDung.ngayTao)) : "-"}</td><td><button className="nut-hanh-dong" onClick={(suKien) => { suKien.stopPropagation(); datIdNguoiDungDangChon(nguoiDung.id); }} aria-label={`Xem ${nguoiDung.hoTen}`}>...</button></td></tr>)}</tbody></table></div>}
        {!dangTai && !loiTaiDuLieu && tongSoTrang > 0 && <footer className="phan-trang"><span>Trang {trangHienTai} / {tongSoTrang}</span><div><button className="nut-trang" onClick={() => { datDangTai(true); datTrangHienTai((trang) => trang - 1); }} disabled={trangHienTai <= 1}>‹</button><button className="nut-trang dang-chon">{trangHienTai}</button><button className="nut-trang" onClick={() => { datDangTai(true); datTrangHienTai((trang) => trang + 1); }} disabled={trangHienTai >= tongSoTrang}>›</button></div></footer>}
      </section>
      <ThemNguoiDung dangMo={dangMoBieuMau} dongBieuMau={() => datDangMoBieuMau(false)} khiThemThanhCong={xuLyThemThanhCong} />
      <ChiTietNguoiDung key={idNguoiDungDangChon ?? "dong"} idNguoiDung={idNguoiDungDangChon} dongChiTiet={() => datIdNguoiDungDangChon(null)} khiCapNhat={xuLyCapNhat} />
    </>
  );
}
