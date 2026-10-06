"use client";

import { useEffect, useState } from "react";
import BieuMauKeHoach from "@/components/bao-tri/BieuMauKeHoach";
import ChiTietKeHoach from "@/components/bao-tri/ChiTietKeHoach";
import { layDanhSachKeHoach, layDanhSachMauChecklist, layDanhSachSapDenHan } from "@/services/baoTri.service";
import { layDanhSachNguoiDung } from "@/services/nguoiDung.service";
import { layDanhSachThietBi } from "@/services/thietBi.service";
import type { KeHoachBaoTri, KeHoachSapDenHan, MauChecklist, TrangThaiKeHoach } from "@/types/baoTri";
import type { NguoiDung } from "@/types/nguoiDung";
import type { ThietBi } from "@/types/thietBi";
import { NHAN_DON_VI_CHU_KY, NHAN_TRANG_THAI_KE_HOACH, dinhDangNgay, layLopTrangThai, layTenLoi, layTongSoTrang } from "@/utils/baoTri";

const SO_BAN_GHI_MOI_TRANG = 10;
const SO_KE_HOACH_CANH_BAO_HIEN_THI = 3;

export default function TrangKeHoachBaoTri() {
  const [danhSachKeHoach, datDanhSachKeHoach] = useState<KeHoachBaoTri[]>([]);
  const [danhSachThietBi, datDanhSachThietBi] = useState<ThietBi[]>([]);
  const [danhSachMauChecklist, datDanhSachMauChecklist] = useState<MauChecklist[]>([]);
  const [danhSachKyThuatVien, datDanhSachKyThuatVien] = useState<NguoiDung[]>([]);
  const [danhSachSapDenHan, datDanhSachSapDenHan] = useState<KeHoachSapDenHan[]>([]);
  const [soNgayCanhBao, datSoNgayCanhBao] = useState(0);
  const [trangThaiDangLoc, datTrangThaiDangLoc] = useState<TrangThaiKeHoach | "">("");
  const [thietBiDangLoc, datThietBiDangLoc] = useState("");
  const [kyThuatVienDangLoc, datKyThuatVienDangLoc] = useState("");
  const [trangHienTai, datTrangHienTai] = useState(1);
  const [tongSoTrang, datTongSoTrang] = useState(0);
  const [dangTai, datDangTai] = useState(true);
  const [loiTaiDuLieu, datLoiTaiDuLieu] = useState("");
  const [loiDuLieuChon, datLoiDuLieuChon] = useState("");
  const [loiSapDenHan, datLoiSapDenHan] = useState("");
  const [dangMoBieuMau, datDangMoBieuMau] = useState(false);
  const [idKeHoachDangChon, datIdKeHoachDangChon] = useState<number | null>(null);
  const [thongBaoThanhCong, datThongBaoThanhCong] = useState("");
  const [lanTaiLai, datLanTaiLai] = useState(0);

  useEffect(() => {
    let dangHoatDong = true;
    layDanhSachKeHoach({ trang: trangHienTai, gioiHan: SO_BAN_GHI_MOI_TRANG, trangThai: trangThaiDangLoc || undefined, thietBiId: thietBiDangLoc ? Number(thietBiDangLoc) : undefined, kyThuatVienId: kyThuatVienDangLoc ? Number(kyThuatVienDangLoc) : undefined })
      .then((ketQuaDanhSach) => { if (dangHoatDong) { datDanhSachKeHoach(ketQuaDanhSach.danhSach); datTongSoTrang(layTongSoTrang(ketQuaDanhSach.phanTrang)); } })
      .catch((loi) => { if (dangHoatDong) datLoiTaiDuLieu(layTenLoi(loi, "Không thể tải danh sách kế hoạch bảo trì.")); })
      .finally(() => { if (dangHoatDong) datDangTai(false); });
    return () => { dangHoatDong = false; };
  }, [trangHienTai, trangThaiDangLoc, thietBiDangLoc, kyThuatVienDangLoc, lanTaiLai]);

  useEffect(() => {
    let dangHoatDong = true;
    Promise.all([
      layDanhSachThietBi({ trang: 1, gioiHan: 100 }),
      layDanhSachMauChecklist({ trang: 1, gioiHan: 100, trangThai: "HOAT_DONG" }),
      layDanhSachNguoiDung({ trang: 1, gioiHan: 100, vaiTro: "KY_THUAT_VIEN", trangThai: "HOAT_DONG" }),
    ]).then(([ketQuaThietBi, ketQuaMauChecklist, ketQuaKyThuatVien]) => {
      if (!dangHoatDong) return;
      datDanhSachThietBi(ketQuaThietBi.danhSach);
      datDanhSachMauChecklist(ketQuaMauChecklist.danhSach);
      datDanhSachKyThuatVien(ketQuaKyThuatVien.danhSach.filter((nguoiDung) => nguoiDung.vaiTro === "KY_THUAT_VIEN" && nguoiDung.trangThai === "HOAT_DONG"));
    }).catch((loi) => { if (dangHoatDong) datLoiDuLieuChon(layTenLoi(loi, "Không thể tải dữ liệu lựa chọn.")); });
    return () => { dangHoatDong = false; };
  }, [lanTaiLai]);

  useEffect(() => {
    let dangHoatDong = true;
    layDanhSachSapDenHan().then((ketQuaSapDenHan) => {
      if (!dangHoatDong) return;
      datDanhSachSapDenHan(ketQuaSapDenHan.danhSach);
      datSoNgayCanhBao(ketQuaSapDenHan.soNgayCanhBao);
      datLoiSapDenHan("");
    }).catch((loi) => {
      if (dangHoatDong) datLoiSapDenHan(layTenLoi(loi, "Không thể tải kế hoạch sắp đến hạn."));
    });
    return () => { dangHoatDong = false; };
  }, [lanTaiLai]);

  function xuLyTaiLaiDanhSach() { datDangTai(true); datLoiTaiDuLieu(""); datLoiDuLieuChon(""); datLanTaiLai((soLan) => soLan + 1); }
  function hienThiThongBao(thongBao: string) { datThongBaoThanhCong(thongBao); window.setTimeout(() => datThongBaoThanhCong(""), 4000); }
  function xuLyCapNhatThanhCong(thongBao: string) { datDangMoBieuMau(false); hienThiThongBao(thongBao); xuLyTaiLaiDanhSach(); }
  function xuLyXoaBoLoc() { datDangTai(true); datLoiTaiDuLieu(""); datTrangThaiDangLoc(""); datThietBiDangLoc(""); datKyThuatVienDangLoc(""); datTrangHienTai(1); }
  const dangLoc = Boolean(trangThaiDangLoc || thietBiDangLoc || kyThuatVienDangLoc);
  const soKeHoachCanhBaoConLai = Math.max(
    0,
    danhSachSapDenHan.length - SO_KE_HOACH_CANH_BAO_HIEN_THI
  );

  return <>
    <section className="thanh-cong-cu"><button className="nut nut-chinh" onClick={() => datDangMoBieuMau(true)} disabled={Boolean(loiDuLieuChon)}>Tạo kế hoạch</button></section>
    {thongBaoThanhCong && <div className="thong-bao thanh-cong" role="status">{thongBaoThanhCong}</div>}
    {loiDuLieuChon && <div className="thong-bao loi" role="alert">{loiDuLieuChon} <button className="nut-link" type="button" onClick={xuLyTaiLaiDanhSach}>Thử lại</button></div>}
    {loiSapDenHan && <div className="thong-bao loi" role="alert">{loiSapDenHan} <button className="nut-link" type="button" onClick={xuLyTaiLaiDanhSach}>Thử lại</button></div>}
    {danhSachSapDenHan.length > 0 && (
      <section className="the-canh-bao-bao-tri" aria-labelledby="tieu-de-canh-bao-bao-tri">
        <div className="noi-dung-canh-bao-bao-tri">
          <strong id="tieu-de-canh-bao-bao-tri">
            {danhSachSapDenHan.length} lịch bảo trì sắp tới
          </strong>
          <span>Cần thực hiện trong {soNgayCanhBao} ngày tới</span>
        </div>
        <div className="danh-sach-canh-bao-ngan">
          {danhSachSapDenHan
            .slice(0, SO_KE_HOACH_CANH_BAO_HIEN_THI)
            .map((keHoachSapDenHan) => (
              <button
                key={keHoachSapDenHan.keHoachBaoTriId}
                type="button"
                aria-label={`Xem lịch bảo trì của ${keHoachSapDenHan.thietBi.tenThietBi}`}
                onClick={() => datIdKeHoachDangChon(keHoachSapDenHan.keHoachBaoTriId)}
              >
                <strong title={keHoachSapDenHan.thietBi.tenThietBi}>
                  {keHoachSapDenHan.thietBi.tenThietBi}
                </strong>
                <span className="ma-thiet-bi-canh-bao">
                  {keHoachSapDenHan.thietBi.maThietBi}
                </span>
                <time dateTime={keHoachSapDenHan.ngayBaoTriTiepTheo}>
                  Hạn {dinhDangNgay(keHoachSapDenHan.ngayBaoTriTiepTheo)}
                </time>
              </button>
            ))}
          {soKeHoachCanhBaoConLai > 0 && (
            <span className="so-luong-canh-bao-con-lai">
              Còn {soKeHoachCanhBaoConLai} lịch khác
            </span>
          )}
        </div>
      </section>
    )}
    <section className="the-noi-dung">
      <div className="bo-loc bo-loc-bao-tri"><select value={trangThaiDangLoc} onChange={(suKien) => { datDangTai(true); datLoiTaiDuLieu(""); datTrangThaiDangLoc(suKien.target.value as TrangThaiKeHoach | ""); datTrangHienTai(1); }} aria-label="Lọc trạng thái kế hoạch"><option value="">Tất cả trạng thái</option><option value="HOAT_DONG">Hoạt động</option><option value="NGUNG_HOAT_DONG">Ngừng hoạt động</option></select><select value={thietBiDangLoc} onChange={(suKien) => { datDangTai(true); datLoiTaiDuLieu(""); datThietBiDangLoc(suKien.target.value); datTrangHienTai(1); }} aria-label="Lọc theo thiết bị"><option value="">Tất cả thiết bị</option>{danhSachThietBi.map((thietBi) => <option key={thietBi.id} value={thietBi.id}>{thietBi.maThietBi} · {thietBi.tenThietBi}</option>)}</select><select value={kyThuatVienDangLoc} onChange={(suKien) => { datDangTai(true); datLoiTaiDuLieu(""); datKyThuatVienDangLoc(suKien.target.value); datTrangHienTai(1); }} aria-label="Lọc theo kỹ thuật viên"><option value="">Tất cả kỹ thuật viên</option>{danhSachKyThuatVien.map((kyThuatVien) => <option key={kyThuatVien.id} value={kyThuatVien.id}>{kyThuatVien.hoTen}</option>)}</select><button className="nut nut-phu" type="button" onClick={xuLyXoaBoLoc} disabled={!dangLoc}>Xóa bộ lọc</button></div>
      {dangTai ? <div className="trang-thai-du-lieu"><span className="vong-xoay" /> Đang tải...</div> : loiTaiDuLieu ? <div className="trang-thai-du-lieu"><p className="tieu-de-loi">{loiTaiDuLieu}</p><button className="nut nut-phu" onClick={xuLyTaiLaiDanhSach}>Thử lại</button></div> : danhSachKeHoach.length === 0 ? <div className="trang-thai-du-lieu"><div className="bieu-tuong-rong">◇</div><p>{dangLoc ? "Không tìm thấy dữ liệu phù hợp." : "Chưa có kế hoạch bảo trì."}</p></div> : <div className="khung-bang"><table><thead><tr><th>Thiết bị</th><th>Mẫu checklist</th><th>Kỹ thuật viên</th><th>Chu kỳ</th><th>Ngày bắt đầu</th><th>Bảo trì tiếp theo</th><th>Trạng thái</th><th aria-label="Thao tác" /></tr></thead><tbody>{danhSachKeHoach.map((keHoach) => <tr key={keHoach.id} className="dong-co-the-chon" onClick={() => datIdKeHoachDangChon(keHoach.id)}><td><strong className="ten-chinh-bang">{keHoach.thietBi.maThietBi}</strong><span className="chu-phu-bang">{keHoach.thietBi.tenThietBi}</span></td><td>{keHoach.mauChecklist.tenMau}</td><td>{keHoach.kyThuatVien?.hoTen || "Chưa phân công"}</td><td>{keHoach.giaTriChuKy} {NHAN_DON_VI_CHU_KY[keHoach.donViChuKy].toLowerCase()}</td><td>{dinhDangNgay(keHoach.ngayBatDau)}</td><td>{dinhDangNgay(keHoach.ngayBaoTriTiepTheo)}</td><td><span className={`huy-hieu ${layLopTrangThai(keHoach.trangThai)}`}>{NHAN_TRANG_THAI_KE_HOACH[keHoach.trangThai]}</span></td><td><button className="nut-hanh-dong" aria-label={`Xem kế hoạch ${keHoach.thietBi.maThietBi}`} onClick={(suKien) => { suKien.stopPropagation(); datIdKeHoachDangChon(keHoach.id); }}>...</button></td></tr>)}</tbody></table></div>}
      {!dangTai && !loiTaiDuLieu && tongSoTrang > 0 && <footer className="phan-trang"><span>Trang {trangHienTai} / {tongSoTrang}</span><div><button className="nut-trang" disabled={trangHienTai <= 1} onClick={() => { datDangTai(true); datTrangHienTai((trang) => trang - 1); }}>‹</button><button className="nut-trang dang-chon">{trangHienTai}</button><button className="nut-trang" disabled={trangHienTai >= tongSoTrang} onClick={() => { datDangTai(true); datTrangHienTai((trang) => trang + 1); }}>›</button></div></footer>}
    </section>
    <BieuMauKeHoach dangMo={dangMoBieuMau} danhSachThietBi={danhSachThietBi} danhSachMauChecklist={danhSachMauChecklist} danhSachKyThuatVien={danhSachKyThuatVien} xuLyDongBieuMau={() => datDangMoBieuMau(false)} xuLyLuuThanhCong={xuLyCapNhatThanhCong} />
    <ChiTietKeHoach key={idKeHoachDangChon ?? "dong"} idKeHoach={idKeHoachDangChon} danhSachThietBi={danhSachThietBi} danhSachMauChecklist={danhSachMauChecklist} danhSachKyThuatVien={danhSachKyThuatVien} xuLyDongChiTiet={() => datIdKeHoachDangChon(null)} xuLyCapNhat={(thongBao) => { hienThiThongBao(thongBao); xuLyTaiLaiDanhSach(); }} />
  </>;
}
