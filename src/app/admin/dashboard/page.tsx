"use client";

import { FormEvent, useEffect, useState } from "react";
import BieuDoCot from "@/components/dashboard/BieuDoCot";
import BieuDoDuong from "@/components/dashboard/BieuDoDuong";
import DanhSachCanChuY from "@/components/dashboard/DanhSachCanChuY";
import TheKpi from "@/components/dashboard/TheKpi";
import { layDashboardTongQuan } from "@/services/dashboardBaoCao.service";
import type {
  DuLieuDashboardTongQuan,
  KhoangThoiGianDashboard,
  ThamSoDashboard,
} from "@/types/dashboardBaoCao";
import {
  NHAN_KHOANG_THOI_GIAN,
  dinhDangSo,
  dinhDangThoiLuongPhut,
  kiemTraNgayBaoCao,
  layNhanEnum,
  layThongBaoLoiModule5,
} from "@/utils/dashboardBaoCao";

const DANH_SACH_MAU_BIEU_DO = ["#0f766e", "#0284c7", "#d97706", "#be123c", "#64748b"];

export default function TrangDashboard() {
  const [duLieuTongQuan, datDuLieuTongQuan] = useState<DuLieuDashboardTongQuan | null>(null);
  const [khoangThoiGian, datKhoangThoiGian] = useState<KhoangThoiGianDashboard>("30_NGAY");
  const [tuNgay, datTuNgay] = useState("");
  const [denNgay, datDenNgay] = useState("");
  const [soNgayCanhBao, datSoNgayCanhBao] = useState("7");
  const [boLocDaApDung, datBoLocDaApDung] = useState<ThamSoDashboard>({
    khoangThoiGian: "30_NGAY",
    soNgayCanhBao: 7,
    gioiHanTop: 5,
  });
  const [dangTai, datDangTai] = useState(true);
  const [loiTaiDuLieu, datLoiTaiDuLieu] = useState("");
  const [loiBoLoc, datLoiBoLoc] = useState("");
  const [lanTaiLai, datLanTaiLai] = useState(0);

  useEffect(() => {
    let dangHoatDong = true;
    layDashboardTongQuan(boLocDaApDung)
      .then((duLieuDashboard) => {
        if (dangHoatDong) datDuLieuTongQuan(duLieuDashboard);
      })
      .catch((loi) => {
        if (dangHoatDong) {
          datDuLieuTongQuan(null);
          datLoiTaiDuLieu(layThongBaoLoiModule5(loi, "Không thể tải Dashboard."));
        }
      })
      .finally(() => {
        if (dangHoatDong) datDangTai(false);
      });
    return () => {
      dangHoatDong = false;
    };
  }, [boLocDaApDung, lanTaiLai]);

  function xuLyApDungBoLoc(suKien: FormEvent<HTMLFormElement>) {
    suKien.preventDefault();
    const soNgay = Number(soNgayCanhBao);
    if (!Number.isInteger(soNgay) || soNgay < 1 || soNgay > 90) {
      datLoiBoLoc("Số ngày cảnh báo phải từ 1 đến 90.");
      return;
    }
    if (
      khoangThoiGian === "TUY_CHINH" &&
      (!tuNgay || !denNgay || !kiemTraNgayBaoCao(tuNgay) || !kiemTraNgayBaoCao(denNgay) || tuNgay > denNgay)
    ) {
      datLoiBoLoc("Ngày bắt đầu phải trước hoặc bằng ngày kết thúc.");
      return;
    }
    datLoiBoLoc("");
    datDangTai(true);
    datLoiTaiDuLieu("");
    datBoLocDaApDung({
      khoangThoiGian,
      tuNgay: khoangThoiGian === "TUY_CHINH" ? tuNgay : undefined,
      denNgay: khoangThoiGian === "TUY_CHINH" ? denNgay : undefined,
      soNgayCanhBao: soNgay,
      gioiHanTop: 5,
    });
  }

  function xuLyTaiLaiDuLieu() {
    datDangTai(true);
    datLoiTaiDuLieu("");
    datLanTaiLai((lan) => lan + 1);
  }

  const danhSachThietBi = duLieuTongQuan?.bieuDo.thietBiTheoTrangThai.map((thongKeTrangThai, viTri) => ({
    nhan: layNhanEnum(thongKeTrangThai.trangThai),
    giaTri: thongKeTrangThai.soLuong,
    mau: DANH_SACH_MAU_BIEU_DO[viTri % DANH_SACH_MAU_BIEU_DO.length],
    duongDan: `/admin/thiet-bi?trangThai=${thongKeTrangThai.trangThai}`,
  })) ?? [];
  const danhSachMucDo = duLieuTongQuan?.bieuDo.suCoTheoMucDo.map((thongKeMucDo, viTri) => ({
    nhan: layNhanEnum(thongKeMucDo.mucDo),
    giaTri: thongKeMucDo.soLuong,
    mau: DANH_SACH_MAU_BIEU_DO[(viTri + 2) % DANH_SACH_MAU_BIEU_DO.length],
    duongDan: `/admin/su-co?mucDo=${thongKeMucDo.mucDo}`,
  })) ?? [];
  const danhSachBaoTri = duLieuTongQuan?.bieuDo.baoTriTheoTrangThai.map((thongKeTrangThai, viTri) => ({
    nhan: layNhanEnum(thongKeTrangThai.trangThai),
    giaTri: thongKeTrangThai.soLuong,
    mau: DANH_SACH_MAU_BIEU_DO[(viTri + 1) % DANH_SACH_MAU_BIEU_DO.length],
    duongDan: `/admin/bao-tri/phieu?trangThai=${thongKeTrangThai.trangThai}`,
  })) ?? [];

  return (
    <div className="trang-dashboard">
      <form className="thanh-loc-dashboard" onSubmit={xuLyApDungBoLoc}>
        <label>
          Khoảng thời gian
          <select value={khoangThoiGian} onChange={(suKien) => { datKhoangThoiGian(suKien.target.value as KhoangThoiGianDashboard); datLoiBoLoc(""); }}>
            {Object.entries(NHAN_KHOANG_THOI_GIAN).map(([giaTri, nhan]) => <option key={giaTri} value={giaTri}>{nhan}</option>)}
          </select>
        </label>
        {khoangThoiGian === "TUY_CHINH" && <>
          <label>Từ ngày<input type="date" value={tuNgay} onChange={(suKien) => { datTuNgay(suKien.target.value); datLoiBoLoc(""); }} /></label>
          <label>Đến ngày<input type="date" value={denNgay} onChange={(suKien) => { datDenNgay(suKien.target.value); datLoiBoLoc(""); }} /></label>
        </>}
        <label>
          Cảnh báo trước
          <span className="o-co-don-vi"><input type="number" min="1" max="90" value={soNgayCanhBao} onChange={(suKien) => { datSoNgayCanhBao(suKien.target.value); datLoiBoLoc(""); }} /><i>ngày</i></span>
        </label>
        <button className="nut nut-chinh" type="submit" disabled={dangTai}>Áp dụng</button>
        <button className="nut nut-phu" type="button" onClick={xuLyTaiLaiDuLieu} disabled={dangTai}>Làm mới</button>
        {loiBoLoc && <span className="loi-truong loi-dashboard">{loiBoLoc}</span>}
      </form>

      {dangTai ? (
        <div className="trang-thai-du-lieu the-noi-dung"><span className="vong-xoay" /> Đang tải Dashboard...</div>
      ) : loiTaiDuLieu ? (
        <div className="trang-thai-du-lieu the-noi-dung"><p className="tieu-de-loi">{loiTaiDuLieu}</p><button className="nut nut-phu" onClick={xuLyTaiLaiDuLieu}>Thử lại</button></div>
      ) : duLieuTongQuan && <>
        <section className="luoi-kpi" aria-label="Chỉ số tổng quan">
          <TheKpi nhan="Thiết bị đang quản lý" giaTri={dinhDangSo(duLieuTongQuan.kpi.tongThietBiDangQuanLy)} ghiChu={`${dinhDangSo(duLieuTongQuan.kpi.tongHoSoThietBi)} hồ sơ`} tongMau="xanh" />
          <TheKpi nhan="Sự cố đang mở" giaTri={dinhDangSo(duLieuTongQuan.kpi.soSuCoMo)} ghiChu="Trạng thái hiện tại" tongMau="cam" />
          <TheKpi nhan="Sự cố nghiêm trọng" giaTri={dinhDangSo(duLieuTongQuan.kpi.soSuCoNghiemTrongMo)} ghiChu="Chưa xử lý xong" tongMau="do" />
          <TheKpi nhan="Bảo trì sắp đến hạn" giaTri={dinhDangSo(duLieuTongQuan.kpi.soBaoTriSapDenHan)} ghiChu={`Trong ${duLieuTongQuan.boLoc.soNgayCanhBao} ngày`} tongMau="lam" />
          <TheKpi nhan="Bảo trì quá hạn" giaTri={dinhDangSo(duLieuTongQuan.kpi.soBaoTriQuaHan)} ghiChu="Trạng thái hiện tại" tongMau="do" />
          <TheKpi nhan="Xử lý sự cố trung bình" giaTri={dinhDangThoiLuongPhut(duLieuTongQuan.kpi.thoiGianXuLySuCoTrungBinh.giaTri, duLieuTongQuan.kpi.thoiGianXuLySuCoTrungBinh.soSuCoDuocTinh > 0)} ghiChu={`${dinhDangSo(duLieuTongQuan.kpi.thoiGianXuLySuCoTrungBinh.soSuCoDuocTinh)} sự cố được tính`} tongMau="tim" />
        </section>

        <div className="luoi-bieu-do-dashboard">
          <BieuDoCot tieuDe="Thiết bị theo trạng thái" danhSach={danhSachThietBi} />
          <BieuDoDuong tieuDe="Sự cố theo thời gian" danhSach={duLieuTongQuan.bieuDo.suCoTheoThoiGian.map((thongKeNgay) => ({ nhan: thongKeNgay.ngay, giaTri: thongKeNgay.soLuong }))} />
          <BieuDoCot tieuDe="Sự cố theo mức độ" danhSach={danhSachMucDo} />
          <BieuDoCot tieuDe="Bảo trì theo trạng thái" danhSach={danhSachBaoTri} />
        </div>

        <DanhSachCanChuY duLieuDashboard={duLieuTongQuan} />
      </>}
    </div>
  );
}
