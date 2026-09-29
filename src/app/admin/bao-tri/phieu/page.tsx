"use client";

import { FormEvent, useEffect, useState } from "react";
import ChiTietPhieuBaoTri from "@/components/bao-tri/ChiTietPhieuBaoTri";
import { layDanhSachPhieu } from "@/services/baoTri.service";
import { layDanhSachNguoiDung } from "@/services/nguoiDung.service";
import { layDanhSachThietBi } from "@/services/thietBi.service";
import type { PhieuBaoTri, TrangThaiPhieuBaoTri } from "@/types/baoTri";
import type { NguoiDung } from "@/types/nguoiDung";
import type { ThietBi } from "@/types/thietBi";
import { NHAN_TRANG_THAI_PHIEU, dinhDangNgay, dinhDangNgayGio, layLopTrangThai, layTenLoi, layTongSoTrang } from "@/utils/baoTri";

const SO_BAN_GHI_MOI_TRANG = 10;

export default function TrangPhieuBaoTri() {
  const [danhSachPhieu, datDanhSachPhieu] = useState<PhieuBaoTri[]>([]);
  const [danhSachThietBi, datDanhSachThietBi] = useState<ThietBi[]>([]);
  const [danhSachKyThuatVien, datDanhSachKyThuatVien] = useState<NguoiDung[]>([]);
  const [trangThaiDangLoc, datTrangThaiDangLoc] = useState<TrangThaiPhieuBaoTri | "">("");
  const [thietBiDangLoc, datThietBiDangLoc] = useState("");
  const [kyThuatVienDangLoc, datKyThuatVienDangLoc] = useState("");
  const [tuNgayNhap, datTuNgayNhap] = useState("");
  const [denNgayNhap, datDenNgayNhap] = useState("");
  const [tuNgay, datTuNgay] = useState("");
  const [denNgay, datDenNgay] = useState("");
  const [loiKhoangNgay, datLoiKhoangNgay] = useState("");
  const [trangHienTai, datTrangHienTai] = useState(1);
  const [tongSoTrang, datTongSoTrang] = useState(0);
  const [dangTai, datDangTai] = useState(true);
  const [loiTaiDuLieu, datLoiTaiDuLieu] = useState("");
  const [idPhieuDangChon, datIdPhieuDangChon] = useState<number | null>(null);
  const [lanTaiLai, datLanTaiLai] = useState(0);

  useEffect(() => {
    const thamSo = new URLSearchParams(window.location.search);
    const idPhieu = Number(thamSo.get("phieuId"));
    const trangThai = thamSo.get("trangThai") || "";
    const boDem = window.setTimeout(() => {
      if (Number.isSafeInteger(idPhieu) && idPhieu > 0) datIdPhieuDangChon(idPhieu);
      if (trangThai in NHAN_TRANG_THAI_PHIEU) {
        datTrangThaiDangLoc(trangThai as TrangThaiPhieuBaoTri);
      }
    }, 0);
    return () => window.clearTimeout(boDem);
  }, []);

  useEffect(() => {
    let dangHoatDong = true;
    layDanhSachPhieu({ trang: trangHienTai, gioiHan: SO_BAN_GHI_MOI_TRANG, trangThai: trangThaiDangLoc || undefined, thietBiId: thietBiDangLoc ? Number(thietBiDangLoc) : undefined, kyThuatVienId: kyThuatVienDangLoc ? Number(kyThuatVienDangLoc) : undefined, tuNgay: tuNgay || undefined, denNgay: denNgay || undefined }).then((ketQuaDanhSach) => { if (dangHoatDong) { datDanhSachPhieu(ketQuaDanhSach.danhSach); datTongSoTrang(layTongSoTrang(ketQuaDanhSach.phanTrang)); } }).catch((loi) => { if (dangHoatDong) datLoiTaiDuLieu(layTenLoi(loi, "Không thể tải danh sách phiếu bảo trì.")); }).finally(() => { if (dangHoatDong) datDangTai(false); });
    return () => { dangHoatDong = false; };
  }, [trangHienTai, trangThaiDangLoc, thietBiDangLoc, kyThuatVienDangLoc, tuNgay, denNgay, lanTaiLai]);

  useEffect(() => {
    let dangHoatDong = true;
    Promise.all([layDanhSachThietBi({ trang: 1, gioiHan: 100 }), layDanhSachNguoiDung({ trang: 1, gioiHan: 100, vaiTro: "KY_THUAT_VIEN", trangThai: "HOAT_DONG" })]).then(([ketQuaThietBi, ketQuaKyThuatVien]) => { if (dangHoatDong) { datDanhSachThietBi(ketQuaThietBi.danhSach); datDanhSachKyThuatVien(ketQuaKyThuatVien.danhSach.filter((nguoiDung) => nguoiDung.vaiTro === "KY_THUAT_VIEN")); } }).catch(() => { /* Bộ lọc liên kết không chặn danh sách phiếu. */ });
    return () => { dangHoatDong = false; };
  }, []);

  function xuLyApDungKhoangNgay(suKien: FormEvent<HTMLFormElement>) {
    suKien.preventDefault();
    if (tuNgayNhap && denNgayNhap && tuNgayNhap > denNgayNhap) {
      datLoiKhoangNgay("Từ ngày không được lớn hơn đến ngày.");
      return;
    }
    datDangTai(true);
    datLoiTaiDuLieu("");
    datLoiKhoangNgay("");
    datTuNgay(tuNgayNhap);
    datDenNgay(denNgayNhap);
    datTrangHienTai(1);
  }

  function xuLyXoaBoLoc() {
    datDangTai(true); datLoiTaiDuLieu(""); datTrangThaiDangLoc(""); datThietBiDangLoc(""); datKyThuatVienDangLoc(""); datTuNgayNhap(""); datDenNgayNhap(""); datTuNgay(""); datDenNgay(""); datLoiKhoangNgay(""); datTrangHienTai(1);
  }

  const dangLoc = Boolean(trangThaiDangLoc || thietBiDangLoc || kyThuatVienDangLoc || tuNgay || denNgay || tuNgayNhap || denNgayNhap);

  return <>
    <section className="the-noi-dung">
      <div className="bo-loc bo-loc-phieu"><select value={trangThaiDangLoc} onChange={(suKien) => { datDangTai(true); datLoiTaiDuLieu(""); datTrangThaiDangLoc(suKien.target.value as TrangThaiPhieuBaoTri | ""); datTrangHienTai(1); }} aria-label="Lọc trạng thái phiếu"><option value="">Tất cả trạng thái</option><option value="CHO_THUC_HIEN">Chờ thực hiện</option><option value="DANG_THUC_HIEN">Đang thực hiện</option><option value="HOAN_THANH">Hoàn thành</option><option value="QUA_HAN">Quá hạn</option><option value="DA_HUY">Đã hủy</option></select><select value={thietBiDangLoc} onChange={(suKien) => { datDangTai(true); datLoiTaiDuLieu(""); datThietBiDangLoc(suKien.target.value); datTrangHienTai(1); }} aria-label="Lọc theo thiết bị"><option value="">Tất cả thiết bị</option>{danhSachThietBi.map((thietBi) => <option key={thietBi.id} value={thietBi.id}>{thietBi.maThietBi} · {thietBi.tenThietBi}</option>)}</select><select value={kyThuatVienDangLoc} onChange={(suKien) => { datDangTai(true); datLoiTaiDuLieu(""); datKyThuatVienDangLoc(suKien.target.value); datTrangHienTai(1); }} aria-label="Lọc theo kỹ thuật viên"><option value="">Tất cả kỹ thuật viên</option>{danhSachKyThuatVien.map((kyThuatVien) => <option key={kyThuatVien.id} value={kyThuatVien.id}>{kyThuatVien.hoTen}</option>)}</select><form className="loc-khoang-ngay" onSubmit={xuLyApDungKhoangNgay}><label>Từ<input type="date" value={tuNgayNhap} onChange={(suKien) => { datTuNgayNhap(suKien.target.value); datLoiKhoangNgay(""); }} /></label><label>Đến<input type="date" value={denNgayNhap} onChange={(suKien) => { datDenNgayNhap(suKien.target.value); datLoiKhoangNgay(""); }} /></label><button className="nut nut-phu" type="submit">Áp dụng</button></form><button className="nut nut-phu" type="button" onClick={xuLyXoaBoLoc} disabled={!dangLoc}>Xóa bộ lọc</button>{loiKhoangNgay && <span className="loi-truong loi-khoang-ngay">{loiKhoangNgay}</span>}</div>
      {dangTai ? <div className="trang-thai-du-lieu"><span className="vong-xoay" /> Đang tải...</div> : loiTaiDuLieu ? <div className="trang-thai-du-lieu"><p className="tieu-de-loi">{loiTaiDuLieu}</p><button className="nut nut-phu" onClick={() => datLanTaiLai((soLan) => soLan + 1)}>Thử lại</button></div> : danhSachPhieu.length === 0 ? <div className="trang-thai-du-lieu"><div className="bieu-tuong-rong">□</div><p>{dangLoc ? "Không tìm thấy dữ liệu phù hợp." : "Chưa có phiếu bảo trì."}</p></div> : <div className="khung-bang"><table><thead><tr><th>Thiết bị</th><th>Ngày dự kiến</th><th>Kỹ thuật viên</th><th>Trạng thái</th><th>Bắt đầu</th><th>Hoàn thành</th><th aria-label="Thao tác" /></tr></thead><tbody>{danhSachPhieu.map((phieu) => <tr key={phieu.id} className="dong-co-the-chon" onClick={() => datIdPhieuDangChon(phieu.id)}><td><strong className="ten-chinh-bang">{phieu.thietBi.maThietBi}</strong><span className="chu-phu-bang">{phieu.thietBi.tenThietBi}</span></td><td>{dinhDangNgay(phieu.ngayDuKien)}</td><td>{phieu.kyThuatVien?.hoTen || "Chưa phân công"}</td><td><span className={`huy-hieu ${layLopTrangThai(phieu.trangThai)}`}>{NHAN_TRANG_THAI_PHIEU[phieu.trangThai]}</span></td><td>{dinhDangNgayGio(phieu.thoiGianBatDau)}</td><td>{dinhDangNgayGio(phieu.thoiGianHoanThanh)}</td><td><button className="nut-hanh-dong" aria-label={`Xem phiếu bảo trì ${phieu.thietBi.maThietBi}`} onClick={(suKien) => { suKien.stopPropagation(); datIdPhieuDangChon(phieu.id); }}>...</button></td></tr>)}</tbody></table></div>}
      {!dangTai && !loiTaiDuLieu && tongSoTrang > 0 && <footer className="phan-trang"><span>Trang {trangHienTai} / {tongSoTrang}</span><div><button className="nut-trang" disabled={trangHienTai <= 1} onClick={() => { datDangTai(true); datTrangHienTai((trang) => trang - 1); }}>‹</button><button className="nut-trang dang-chon">{trangHienTai}</button><button className="nut-trang" disabled={trangHienTai >= tongSoTrang} onClick={() => { datDangTai(true); datTrangHienTai((trang) => trang + 1); }}>›</button></div></footer>}
    </section>
    <ChiTietPhieuBaoTri key={idPhieuDangChon ?? "dong"} idPhieu={idPhieuDangChon} xuLyDongChiTiet={() => datIdPhieuDangChon(null)} />
  </>;
}
