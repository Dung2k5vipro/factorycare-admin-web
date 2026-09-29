"use client";

import { FormEvent, useEffect, useState } from "react";
import BieuMauChecklist from "@/components/bao-tri/BieuMauChecklist";
import ChiTietMauChecklist from "@/components/bao-tri/ChiTietMauChecklist";
import { layDanhSachMauChecklist } from "@/services/baoTri.service";
import { layDanhSachLoaiThietBi } from "@/services/thietBi.service";
import type { MauChecklist, TrangThaiMauChecklist } from "@/types/baoTri";
import type { LoaiThietBi } from "@/types/thietBi";
import { NHAN_TRANG_THAI_MAU, dinhDangNgayGio, layLopTrangThai, layTenLoi, layTongSoTrang } from "@/utils/baoTri";

const SO_BAN_GHI_MOI_TRANG = 10;

export default function TrangMauChecklist() {
  const [danhSachMauChecklist, datDanhSachMauChecklist] = useState<MauChecklist[]>([]);
  const [danhSachLoaiThietBiGoiY, datDanhSachLoaiThietBiGoiY] = useState<LoaiThietBi[]>([]);
  const [trangThaiDangLoc, datTrangThaiDangLoc] = useState<TrangThaiMauChecklist | "">("");
  const [tenLoaiThietBiNhap, datTenLoaiThietBiNhap] = useState("");
  const [idLoaiThietBiDangLoc, datIdLoaiThietBiDangLoc] = useState("");
  const [trangHienTai, datTrangHienTai] = useState(1);
  const [tongSoTrang, datTongSoTrang] = useState(0);
  const [dangTai, datDangTai] = useState(true);
  const [loiTaiDuLieu, datLoiTaiDuLieu] = useState("");
  const [loiLoaiThietBi, datLoiLoaiThietBi] = useState("");
  const [dangApDungLoaiThietBi, datDangApDungLoaiThietBi] = useState(false);
  const [dangMoBieuMau, datDangMoBieuMau] = useState(false);
  const [idMauDangChon, datIdMauDangChon] = useState<number | null>(null);
  const [thongBaoThanhCong, datThongBaoThanhCong] = useState("");
  const [lanTaiLai, datLanTaiLai] = useState(0);

  useEffect(() => {
    let dangHoatDong = true;
    layDanhSachMauChecklist({ trang: trangHienTai, gioiHan: SO_BAN_GHI_MOI_TRANG, trangThai: trangThaiDangLoc || undefined, loaiThietBiId: idLoaiThietBiDangLoc ? Number(idLoaiThietBiDangLoc) : undefined }).then((ketQuaDanhSach) => { if (dangHoatDong) { datDanhSachMauChecklist(ketQuaDanhSach.danhSach); datTongSoTrang(layTongSoTrang(ketQuaDanhSach.phanTrang)); } }).catch((loi) => { if (dangHoatDong) datLoiTaiDuLieu(layTenLoi(loi, "Không thể tải danh sách mẫu checklist.")); }).finally(() => { if (dangHoatDong) datDangTai(false); });
    return () => { dangHoatDong = false; };
  }, [trangHienTai, trangThaiDangLoc, idLoaiThietBiDangLoc, lanTaiLai]);

  useEffect(() => {
    let dangHoatDong = true;
    const boDem = window.setTimeout(() => {
      layDanhSachLoaiThietBi({ trang: 1, gioiHan: 20, tuKhoa: tenLoaiThietBiNhap.trim() || undefined })
        .then((ketQuaDanhSach) => {
          if (dangHoatDong) datDanhSachLoaiThietBiGoiY(ketQuaDanhSach.danhSach);
        })
        .catch(() => {
          if (dangHoatDong) datDanhSachLoaiThietBiGoiY([]);
        });
    }, 250);
    return () => {
      dangHoatDong = false;
      window.clearTimeout(boDem);
    };
  }, [tenLoaiThietBiNhap]);

  function xuLyTaiLaiDanhSach() { datDangTai(true); datLoiTaiDuLieu(""); datLanTaiLai((soLan) => soLan + 1); }
  function hienThiThongBao(thongBao: string) { datThongBaoThanhCong(thongBao); window.setTimeout(() => datThongBaoThanhCong(""), 4000); }
  function xuLyLuuThanhCong(thongBao: string) { datDangMoBieuMau(false); hienThiThongBao(thongBao); xuLyTaiLaiDanhSach(); }
  async function xuLyApDungLoaiThietBi(suKien: FormEvent<HTMLFormElement>) {
    suKien.preventDefault();
    if (dangApDungLoaiThietBi) return;
    const tenLoaiThietBi = tenLoaiThietBiNhap.trim();
    if (!tenLoaiThietBi) {
      datIdLoaiThietBiDangLoc("");
      datLoiLoaiThietBi("");
      datTrangHienTai(1);
      datDangTai(true);
      datLanTaiLai((soLan) => soLan + 1);
      return;
    }
    datDangApDungLoaiThietBi(true);
    datLoiLoaiThietBi("");
    try {
      const ketQuaLoaiThietBi = await layDanhSachLoaiThietBi({ trang: 1, gioiHan: 20, tuKhoa: tenLoaiThietBi });
      const loaiThietBi = ketQuaLoaiThietBi.danhSach.find((loaiTrongDanhSach) => loaiTrongDanhSach.tenLoai.trim().toLocaleLowerCase("vi-VN") === tenLoaiThietBi.toLocaleLowerCase("vi-VN"));
      if (!loaiThietBi) {
        datLoiLoaiThietBi("Không tìm thấy loại thiết bị phù hợp.");
        return;
      }
      datTenLoaiThietBiNhap(loaiThietBi.tenLoai);
      datIdLoaiThietBiDangLoc(String(loaiThietBi.id));
      datTrangHienTai(1);
      datDangTai(true);
      datLoiTaiDuLieu("");
      datLanTaiLai((soLan) => soLan + 1);
    } catch (loi) {
      datLoiLoaiThietBi(layTenLoi(loi, "Không thể tìm loại thiết bị."));
    } finally {
      datDangApDungLoaiThietBi(false);
    }
  }
  function xuLyXoaBoLoc() { datDangTai(true); datLoiTaiDuLieu(""); datLoiLoaiThietBi(""); datTrangThaiDangLoc(""); datTenLoaiThietBiNhap(""); datIdLoaiThietBiDangLoc(""); datTrangHienTai(1); datLanTaiLai((soLan) => soLan + 1); }
  const dangLoc = Boolean(trangThaiDangLoc || idLoaiThietBiDangLoc || tenLoaiThietBiNhap);

  return <>
    <section className="thanh-cong-cu"><button className="nut nut-chinh" onClick={() => datDangMoBieuMau(true)}>Tạo mẫu checklist</button></section>
    {thongBaoThanhCong && <div className="thong-bao thanh-cong" role="status">{thongBaoThanhCong}</div>}
    <section className="the-noi-dung">
      <div className="bo-loc bo-loc-checklist"><select value={trangThaiDangLoc} onChange={(suKien) => { datDangTai(true); datLoiTaiDuLieu(""); datTrangThaiDangLoc(suKien.target.value as TrangThaiMauChecklist | ""); datTrangHienTai(1); }} aria-label="Lọc trạng thái mẫu"><option value="">Tất cả trạng thái</option><option value="HOAT_DONG">Hoạt động</option><option value="NGUNG_HOAT_DONG">Ngừng hoạt động</option></select><form className="loc-loai-thiet-bi" onSubmit={(suKien) => void xuLyApDungLoaiThietBi(suKien)}><input list="goi-y-loai-thiet-bi-loc-checklist" value={tenLoaiThietBiNhap} placeholder="Nhập loại thiết bị" aria-label="Nhập loại thiết bị để lọc" onChange={(suKien) => { datTenLoaiThietBiNhap(suKien.target.value); datLoiLoaiThietBi(""); }} /><datalist id="goi-y-loai-thiet-bi-loc-checklist">{danhSachLoaiThietBiGoiY.map((loaiThietBi) => <option key={loaiThietBi.id} value={loaiThietBi.tenLoai} />)}</datalist><button className="nut nut-phu" type="submit" disabled={dangApDungLoaiThietBi}>{dangApDungLoaiThietBi ? "Đang tìm..." : "Lọc"}</button>{loiLoaiThietBi && <span className="loi-truong">{loiLoaiThietBi}</span>}</form><button className="nut nut-phu" type="button" onClick={xuLyXoaBoLoc} disabled={!dangLoc}>Xóa bộ lọc</button></div>
      {dangTai ? <div className="trang-thai-du-lieu"><span className="vong-xoay" /> Đang tải...</div> : loiTaiDuLieu ? <div className="trang-thai-du-lieu"><p className="tieu-de-loi">{loiTaiDuLieu}</p><button className="nut nut-phu" onClick={xuLyTaiLaiDanhSach}>Thử lại</button></div> : danhSachMauChecklist.length === 0 ? <div className="trang-thai-du-lieu"><div className="bieu-tuong-rong">✓</div><p>{dangLoc ? "Không tìm thấy dữ liệu phù hợp." : "Chưa có mẫu checklist."}</p></div> : <div className="khung-bang"><table><thead><tr><th>Tên mẫu</th><th>Loại thiết bị</th><th>Số hạng mục</th><th>Người tạo</th><th>Trạng thái</th><th>Cập nhật</th><th aria-label="Thao tác" /></tr></thead><tbody>{danhSachMauChecklist.map((mauChecklist) => <tr key={mauChecklist.id} className="dong-co-the-chon" onClick={() => datIdMauDangChon(mauChecklist.id)}><td><strong className="ten-chinh-bang">{mauChecklist.tenMau}</strong></td><td>{mauChecklist.loaiThietBi?.tenLoai || "Dùng chung"}</td><td>{Array.isArray(mauChecklist.danhSachHangMuc) ? mauChecklist.danhSachHangMuc.length : 0}</td><td>{mauChecklist.nguoiTao?.hoTen || "-"}</td><td><span className={`huy-hieu ${layLopTrangThai(mauChecklist.trangThai)}`}>{NHAN_TRANG_THAI_MAU[mauChecklist.trangThai]}</span></td><td>{dinhDangNgayGio(mauChecklist.ngayCapNhat)}</td><td><button className="nut-hanh-dong" aria-label={`Xem mẫu ${mauChecklist.tenMau}`} onClick={(suKien) => { suKien.stopPropagation(); datIdMauDangChon(mauChecklist.id); }}>...</button></td></tr>)}</tbody></table></div>}
      {!dangTai && !loiTaiDuLieu && tongSoTrang > 0 && <footer className="phan-trang"><span>Trang {trangHienTai} / {tongSoTrang}</span><div><button className="nut-trang" disabled={trangHienTai <= 1} onClick={() => { datDangTai(true); datTrangHienTai((trang) => trang - 1); }}>‹</button><button className="nut-trang dang-chon">{trangHienTai}</button><button className="nut-trang" disabled={trangHienTai >= tongSoTrang} onClick={() => { datDangTai(true); datTrangHienTai((trang) => trang + 1); }}>›</button></div></footer>}
    </section>
    <BieuMauChecklist dangMo={dangMoBieuMau} xuLyDongBieuMau={() => datDangMoBieuMau(false)} xuLyLuuThanhCong={xuLyLuuThanhCong} />
    <ChiTietMauChecklist key={idMauDangChon ?? "dong"} idMauChecklist={idMauDangChon} xuLyDongChiTiet={() => datIdMauDangChon(null)} xuLyCapNhat={(thongBao) => { hienThiThongBao(thongBao); xuLyTaiLaiDanhSach(); }} />
  </>;
}
