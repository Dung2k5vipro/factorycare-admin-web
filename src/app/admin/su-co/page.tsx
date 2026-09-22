"use client";

import { useEffect, useState } from "react";
import ChiTietSuCo from "@/components/su-co/ChiTietSuCo";
import { layDanhSachSuCo, layDanhSachKyThuatVien } from "@/services/suCo.service";
import { layDanhSachThietBi } from "@/services/thietBi.service";
import { LoiHttp } from "@/types/api";
import type { ThietBi } from "@/types/thietBi";
import type { BoLocSuCo, KyThuatVienSuCo, MucDoSuCo, SuCo, TrangThaiSuCo } from "@/types/suCo";
import { dinhDangThoiGian, kiemTraNgay, NHAN_MUC_DO_SU_CO, NHAN_TRANG_THAI_SU_CO } from "@/utils/dinhDangSuCo";

const SO_BAN_GHI_MOI_TRANG = 10;

export default function TrangSuCo() {
  const [boLoc, datBoLoc] = useState<BoLocSuCo>({ trang: 1, gioiHan: SO_BAN_GHI_MOI_TRANG });
  const [tuKhoaNhap, datTuKhoaNhap] = useState("");
  const [tuNgayNhap, datTuNgayNhap] = useState("");
  const [denNgayNhap, datDenNgayNhap] = useState("");
  const [loiKhoangNgay, datLoiKhoangNgay] = useState("");
  const [danhSachSuCo, datDanhSachSuCo] = useState<SuCo[]>([]);
  const [tongSoTrang, datTongSoTrang] = useState(0);
  const [tongSoBanGhi, datTongSoBanGhi] = useState(0);
  const [dangTai, datDangTai] = useState(true);
  const [loiTai, datLoiTai] = useState("");
  const [suCoIdDangChon, datSuCoIdDangChon] = useState<number | null>(null);
  const [thongBao, datThongBao] = useState("");
  const [lanTaiLai, datLanTaiLai] = useState(0);
  const [danhSachKyThuatVien, datDanhSachKyThuatVien] = useState<KyThuatVienSuCo[]>([]);
  const [tuKhoaKyThuatVien, datTuKhoaKyThuatVien] = useState("");
  const [trangKyThuatVien, datTrangKyThuatVien] = useState(1);
  const [tongTrangKyThuatVien, datTongTrangKyThuatVien] = useState(0);
  const [kyThuatVienDaChon, datKyThuatVienDaChon] = useState<KyThuatVienSuCo | null>(null);
  const [danhSachThietBi, datDanhSachThietBi] = useState<ThietBi[]>([]);
  const [tuKhoaThietBi, datTuKhoaThietBi] = useState("");
  const [trangThietBi, datTrangThietBi] = useState(1);
  const [tongTrangThietBi, datTongTrangThietBi] = useState(0);
  const [thietBiDaChon, datThietBiDaChon] = useState<ThietBi | null>(null);

  useEffect(() => {
    let dangHoatDong = true;
    layDanhSachSuCo(boLoc)
      .then((ketQua) => {
        if (!dangHoatDong) return;
        datDanhSachSuCo(ketQua.danhSach);
        datTongSoTrang(ketQua.phanTrang.tongTrang);
        datTongSoBanGhi(ketQua.phanTrang.tongBanGhi);
      })
      .catch((loi) => { if (dangHoatDong) { datDanhSachSuCo([]); datLoiTai((loi as LoiHttp).message || "Không thể tải danh sách sự cố."); } })
      .finally(() => { if (dangHoatDong) datDangTai(false); });
    return () => { dangHoatDong = false; };
  }, [boLoc, lanTaiLai]);

  useEffect(() => {
    const tuKhoa = tuKhoaNhap.trim();
    if (tuKhoa === (boLoc.tuKhoa || "")) return;
    const boDem = window.setTimeout(() => capNhatBoLoc({ tuKhoa: tuKhoa || undefined }), 350);
    return () => window.clearTimeout(boDem);
  }, [tuKhoaNhap, boLoc.tuKhoa]);

  useEffect(() => {
    let dangHoatDong = true;
    const boDem = window.setTimeout(() => {
      layDanhSachKyThuatVien(trangKyThuatVien, tuKhoaKyThuatVien)
        .then((ketQua) => { if (dangHoatDong) { datDanhSachKyThuatVien(ketQua.danhSach); datTongTrangKyThuatVien(ketQua.phanTrang.tongTrang); } })
      .catch(() => { if (dangHoatDong) { datDanhSachKyThuatVien([]); datTongTrangKyThuatVien(0); } });
    }, 250);
    return () => { dangHoatDong = false; window.clearTimeout(boDem); };
  }, [trangKyThuatVien, tuKhoaKyThuatVien]);

  useEffect(() => {
    let dangHoatDong = true;
    const boDem = window.setTimeout(() => {
      layDanhSachThietBi({ trang: trangThietBi, gioiHan: 100, tuKhoa: tuKhoaThietBi.trim() || undefined })
        .then((ketQua) => { if (dangHoatDong) { datDanhSachThietBi(ketQua.danhSach); datTongTrangThietBi(ketQua.phanTrang.tongTrang); } })
        .catch(() => { if (dangHoatDong) { datDanhSachThietBi([]); datTongTrangThietBi(0); } });
    }, 250);
    return () => { dangHoatDong = false; window.clearTimeout(boDem); };
  }, [trangThietBi, tuKhoaThietBi]);

  function capNhatBoLoc(thayDoi: Partial<BoLocSuCo>) {
    datDangTai(true);
    datLoiTai("");
    datBoLoc((hienTai) => ({ ...hienTai, ...thayDoi, trang: 1 }));
  }

  function xoaBoLoc() {
    datTuKhoaNhap("");
    datTuNgayNhap("");
    datDenNgayNhap("");
    datLoiKhoangNgay("");
    datTuKhoaKyThuatVien("");
    datTuKhoaThietBi("");
    datKyThuatVienDaChon(null);
    datThietBiDaChon(null);
    datDangTai(true);
    datLoiTai("");
    datBoLoc({ trang: 1, gioiHan: SO_BAN_GHI_MOI_TRANG });
  }

  function xuLyLocNgay() {
    if ((tuNgayNhap && !kiemTraNgay(tuNgayNhap)) || (denNgayNhap && !kiemTraNgay(denNgayNhap)) ||
        (tuNgayNhap && denNgayNhap && tuNgayNhap > denNgayNhap)) {
      datLoiKhoangNgay("Khoảng thời gian không hợp lệ.");
      return;
    }
    datLoiKhoangNgay("");
    capNhatBoLoc({ tuNgay: tuNgayNhap || undefined, denNgay: denNgayNhap || undefined });
  }

  function taiLaiDanhSach() {
    datDangTai(true);
    datLoiTai("");
    datLanTaiLai((soLan) => soLan + 1);
  }

  const dangLoc = Boolean(boLoc.tuKhoa || boLoc.mucDo || boLoc.trangThai || boLoc.kyThuatVienId || boLoc.thietBiId || boLoc.tuNgay || boLoc.denNgay);

  return <>
    {thongBao && <div className="thong-bao thanh-cong" role="status">{thongBao}</div>}
    <section className="the-noi-dung">
      <div className="bo-loc bo-loc-su-co">
        <div className="o-tim-kiem"><span aria-hidden="true">⌕</span><input aria-label="Tìm kiếm sự cố" placeholder="Mã sự cố, tiêu đề hoặc thiết bị" maxLength={200} value={tuKhoaNhap} onChange={(suKien) => datTuKhoaNhap(suKien.target.value)} /></div>
        <select aria-label="Lọc theo mức độ" value={boLoc.mucDo || ""} onChange={(suKien) => capNhatBoLoc({ mucDo: (suKien.target.value || undefined) as MucDoSuCo | undefined })}><option value="">Tất cả mức độ</option>{Object.entries(NHAN_MUC_DO_SU_CO).map(([mucDo, nhan]) => <option key={mucDo} value={mucDo}>{nhan}</option>)}</select>
        <select aria-label="Lọc theo trạng thái" value={boLoc.trangThai || ""} onChange={(suKien) => capNhatBoLoc({ trangThai: (suKien.target.value || undefined) as TrangThaiSuCo | undefined })}><option value="">Tất cả trạng thái</option>{Object.entries(NHAN_TRANG_THAI_SU_CO).map(([trangThai, nhan]) => <option key={trangThai} value={trangThai}>{nhan}</option>)}</select>
        <div className="bo-loc-lien-ket"><input aria-label="Tìm kỹ thuật viên" placeholder="Tìm kỹ thuật viên" maxLength={200} value={tuKhoaKyThuatVien} onChange={(suKien) => { datTuKhoaKyThuatVien(suKien.target.value); datTrangKyThuatVien(1); }} /><select aria-label="Lọc theo kỹ thuật viên" value={boLoc.kyThuatVienId || ""} onChange={(suKien) => { const kyThuatVien = danhSachKyThuatVien.find((nguoi) => nguoi.id === Number(suKien.target.value)) || null; datKyThuatVienDaChon(kyThuatVien); capNhatBoLoc({ kyThuatVienId: kyThuatVien?.id }); }}><option value="">Tất cả kỹ thuật viên</option>{kyThuatVienDaChon && !danhSachKyThuatVien.some((nguoi) => nguoi.id === kyThuatVienDaChon.id) && <option value={kyThuatVienDaChon.id}>{kyThuatVienDaChon.hoTen}</option>}{danhSachKyThuatVien.map((nguoi) => <option key={nguoi.id} value={nguoi.id}>{nguoi.hoTen}</option>)}</select>{tongTrangKyThuatVien > 1 && <div className="phan-trang-bo-loc"><button type="button" disabled={trangKyThuatVien <= 1} onClick={() => datTrangKyThuatVien((trang) => trang - 1)}>‹</button><span>{trangKyThuatVien}/{tongTrangKyThuatVien}</span><button type="button" disabled={trangKyThuatVien >= tongTrangKyThuatVien} onClick={() => datTrangKyThuatVien((trang) => trang + 1)}>›</button></div>}</div>
        <div className="bo-loc-lien-ket"><input aria-label="Tìm thiết bị" placeholder="Tìm thiết bị" maxLength={200} value={tuKhoaThietBi} onChange={(suKien) => { datTuKhoaThietBi(suKien.target.value); datTrangThietBi(1); }} /><select aria-label="Lọc theo thiết bị" value={boLoc.thietBiId || ""} onChange={(suKien) => { const thietBi = danhSachThietBi.find((muc) => muc.id === Number(suKien.target.value)) || null; datThietBiDaChon(thietBi); capNhatBoLoc({ thietBiId: thietBi?.id }); }}><option value="">Tất cả thiết bị</option>{thietBiDaChon && !danhSachThietBi.some((muc) => muc.id === thietBiDaChon.id) && <option value={thietBiDaChon.id}>{thietBiDaChon.maThietBi} · {thietBiDaChon.tenThietBi}</option>}{danhSachThietBi.map((muc) => <option key={muc.id} value={muc.id}>{muc.maThietBi} · {muc.tenThietBi}</option>)}</select>{tongTrangThietBi > 1 && <div className="phan-trang-bo-loc"><button type="button" disabled={trangThietBi <= 1} onClick={() => datTrangThietBi((trang) => trang - 1)}>‹</button><span>{trangThietBi}/{tongTrangThietBi}</span><button type="button" disabled={trangThietBi >= tongTrangThietBi} onClick={() => datTrangThietBi((trang) => trang + 1)}>›</button></div>}</div>
        <div className="bo-loc-ngay"><label>Từ ngày<input type="date" value={tuNgayNhap} onChange={(suKien) => { datTuNgayNhap(suKien.target.value); datLoiKhoangNgay(""); }} /></label><label>Đến ngày<input type="date" value={denNgayNhap} onChange={(suKien) => { datDenNgayNhap(suKien.target.value); datLoiKhoangNgay(""); }} /></label><button className="nut nut-phu" type="button" onClick={xuLyLocNgay}>Lọc ngày</button></div>
        <button className="nut nut-phu" type="button" onClick={xoaBoLoc} disabled={!dangLoc && !tuKhoaNhap && !tuNgayNhap && !denNgayNhap && !tuKhoaKyThuatVien && !tuKhoaThietBi}>Xóa bộ lọc</button>
      </div>
      {loiKhoangNgay && <div className="thong-bao loi" role="alert">{loiKhoangNgay}</div>}
      {!dangTai && !loiTai && <div className="thong-ke-nho">Tổng <strong>{tongSoBanGhi}</strong> sự cố</div>}
      {dangTai ? (
        <div className="trang-thai-du-lieu"><span className="vong-xoay" /> Đang tải...</div>
      ) : loiTai ? (
        <div className="trang-thai-du-lieu">
          <p>{loiTai}</p>
          <button className="nut nut-phu" type="button" onClick={taiLaiDanhSach}>Thử lại</button>
        </div>
      ) : danhSachSuCo.length === 0 ? (
        <div className="trang-thai-du-lieu">
          <p>{dangLoc ? "Không tìm thấy sự cố phù hợp." : "Chưa có sự cố."}</p>
        </div>
      ) : (
        <div className="khung-bang">
          <table>
            <thead><tr><th>Mã sự cố</th><th>Thiết bị</th><th>Người báo</th><th>Mức độ</th><th>Trạng thái</th><th>Kỹ thuật viên</th><th>Thời gian báo</th><th>Thao tác</th></tr></thead>
            <tbody>
              {danhSachSuCo.map((suCo) => (
                <tr key={suCo.id}>
                  <td><strong>{suCo.maSuCo}</strong></td>
                  <td>{suCo.thietBi?.maThietBi} · {suCo.thietBi?.tenThietBi}</td>
                  <td>{suCo.nguoiBao?.hoTen || "—"}</td>
                  <td><span className={`huy-hieu muc-do-${suCo.mucDo.toLowerCase()}`}>{NHAN_MUC_DO_SU_CO[suCo.mucDo] || suCo.mucDo}</span></td>
                  <td>{NHAN_TRANG_THAI_SU_CO[suCo.trangThai] || suCo.trangThai}</td>
                  <td>{suCo.kyThuatVien?.hoTen || "Chưa phân công"}</td>
                  <td>{dinhDangThoiGian(suCo.thoiGianBao)}</td>
                  <td><button className="nut-hanh-dong nut-xem-su-co" type="button" onClick={() => datSuCoIdDangChon(suCo.id)} aria-label={`Xem sự cố ${suCo.maSuCo}`}>Xem</button></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
      {!dangTai && !loiTai && tongSoTrang > 0 && <footer className="phan-trang"><span>Trang {boLoc.trang} / {tongSoTrang}</span><div><button className="nut-trang" type="button" disabled={boLoc.trang <= 1} onClick={() => { datDangTai(true); datBoLoc((hienTai) => ({ ...hienTai, trang: hienTai.trang - 1 })); }}>‹</button><button className="nut-trang dang-chon" type="button" aria-current="page">{boLoc.trang}</button><button className="nut-trang" type="button" disabled={boLoc.trang >= tongSoTrang} onClick={() => { datDangTai(true); datBoLoc((hienTai) => ({ ...hienTai, trang: hienTai.trang + 1 })); }}>›</button></div></footer>}
    </section>
    <ChiTietSuCo key={suCoIdDangChon ?? "dong"} suCoId={suCoIdDangChon} dongChiTiet={() => datSuCoIdDangChon(null)} khiCapNhat={(thongBaoMoi) => { datThongBao(thongBaoMoi); taiLaiDanhSach(); }} />
  </>;
}
