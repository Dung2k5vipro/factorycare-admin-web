"use client";

import { FormEvent, useEffect, useState } from "react";
import BoLocBaoCao from "@/components/bao-cao/BoLocBaoCao";
import NoiDungBaoCao from "@/components/bao-cao/NoiDungBaoCao";
import { layBaoCao, xuatBaoCao } from "@/services/dashboardBaoCao.service";
import { layDanhSachNguoiDung } from "@/services/nguoiDung.service";
import { layDanhSachLoaiThietBi, layDanhSachThietBi } from "@/services/thietBi.service";
import { layDanhSachViTriQuanLy } from "@/services/viTri.service";
import type { BoLocBaoCao as KieuBoLocBaoCao, DinhDangXuat, KetQuaBaoCao, LoaiBaoCao } from "@/types/dashboardBaoCao";
import type { NguoiDung } from "@/types/nguoiDung";
import type { CayViTri } from "@/types/quanLyThietBi";
import type { LoaiThietBi, ThietBi } from "@/types/thietBi";
import { CAU_HINH_SAP_XEP, kiemTraNgayBaoCao, layThongBaoLoiModule5 } from "@/utils/dashboardBaoCao";

const SO_BAN_GHI_MOI_TRANG = 10;

function taoBoLocMacDinh(loaiBaoCao: LoaiBaoCao): KieuBoLocBaoCao {
  return {
    trang: 1,
    gioiHan: SO_BAN_GHI_MOI_TRANG,
    sapXepTheo: CAU_HINH_SAP_XEP[loaiBaoCao][0].giaTri,
    thuTu: "DESC",
  };
}

export default function TrangBaoCao() {
  const [loaiBaoCao, datLoaiBaoCao] = useState<LoaiBaoCao>("su-co");
  const [boLocNhap, datBoLocNhap] = useState<KieuBoLocBaoCao>(() => taoBoLocMacDinh("su-co"));
  const [boLocDaApDung, datBoLocDaApDung] = useState<KieuBoLocBaoCao>(() => taoBoLocMacDinh("su-co"));
  const [ketQuaBaoCao, datKetQuaBaoCao] = useState<KetQuaBaoCao | null>(null);
  const [danhSachThietBi, datDanhSachThietBi] = useState<ThietBi[]>([]);
  const [danhSachLoaiThietBi, datDanhSachLoaiThietBi] = useState<LoaiThietBi[]>([]);
  const [danhSachViTri, datDanhSachViTri] = useState<CayViTri[]>([]);
  const [danhSachKyThuatVien, datDanhSachKyThuatVien] = useState<NguoiDung[]>([]);
  const [dangTai, datDangTai] = useState(true);
  const [dinhDangDangXuat, datDinhDangDangXuat] = useState<DinhDangXuat | null>(null);
  const [loiTaiDuLieu, datLoiTaiDuLieu] = useState("");
  const [loiBoLoc, datLoiBoLoc] = useState("");
  const [thongBaoXuat, datThongBaoXuat] = useState("");
  const [lanTaiLai, datLanTaiLai] = useState(0);

  useEffect(() => {
    let dangHoatDong = true;
    Promise.all([
      layDanhSachThietBi({ trang: 1, gioiHan: 100 }),
      layDanhSachLoaiThietBi({ trang: 1, gioiHan: 100 }),
      layDanhSachViTriQuanLy({ trang: 1, gioiHan: 100 }),
      layDanhSachNguoiDung({ trang: 1, gioiHan: 100, vaiTro: "KY_THUAT_VIEN", trangThai: "HOAT_DONG" }),
    ]).then(([thietBi, loaiThietBi, viTri, kyThuatVien]) => {
      if (!dangHoatDong) return;
      datDanhSachThietBi(thietBi.danhSach);
      datDanhSachLoaiThietBi(loaiThietBi.danhSach);
      datDanhSachViTri(viTri.danhSach);
      datDanhSachKyThuatVien(kyThuatVien.danhSach.filter((nguoiDung) => nguoiDung.vaiTro === "KY_THUAT_VIEN"));
    }).catch(() => undefined);
    return () => { dangHoatDong = false; };
  }, []);

  useEffect(() => {
    let dangHoatDong = true;
    layBaoCao(loaiBaoCao, boLocDaApDung)
      .then((ketQuaBaoCaoMoi) => {
        if (dangHoatDong) datKetQuaBaoCao(ketQuaBaoCaoMoi);
      })
      .catch((loi) => {
        if (dangHoatDong) {
          datKetQuaBaoCao(null);
          datLoiTaiDuLieu(layThongBaoLoiModule5(loi, "Không thể tải báo cáo."));
        }
      })
      .finally(() => {
        if (dangHoatDong) datDangTai(false);
      });
    return () => { dangHoatDong = false; };
  }, [boLocDaApDung, lanTaiLai, loaiBaoCao]);

  function xuLyDoiLoaiBaoCao(loaiMoi: LoaiBaoCao) {
    const boLocMoi = taoBoLocMacDinh(loaiMoi);
    datLoaiBaoCao(loaiMoi);
    datBoLocNhap(boLocMoi);
    datBoLocDaApDung(boLocMoi);
    datKetQuaBaoCao(null);
    datLoiBoLoc("");
    datThongBaoXuat("");
    datDangTai(true);
    datLoiTaiDuLieu("");
  }

  function xuLyCapNhatBoLoc(phanBoLocThayDoi: Partial<KieuBoLocBaoCao>) {
    datBoLocNhap((boLocHienTai) => ({ ...boLocHienTai, ...phanBoLocThayDoi }));
    datLoiBoLoc("");
    datThongBaoXuat("");
  }

  function xuLyApDungBoLoc(suKien: FormEvent<HTMLFormElement>) {
    suKien.preventDefault();
    if (
      (boLocNhap.tuNgay && !kiemTraNgayBaoCao(boLocNhap.tuNgay)) ||
      (boLocNhap.denNgay && !kiemTraNgayBaoCao(boLocNhap.denNgay)) ||
      (boLocNhap.tuNgay && boLocNhap.denNgay && boLocNhap.tuNgay > boLocNhap.denNgay)
    ) {
      datLoiBoLoc("Ngày bắt đầu phải trước hoặc bằng ngày kết thúc.");
      return;
    }
    const boLocMoi = { ...boLocNhap, trang: 1 };
    datDangTai(true);
    datLoiTaiDuLieu("");
    datBoLocNhap(boLocMoi);
    datBoLocDaApDung(boLocMoi);
    datLoiBoLoc("");
  }

  function xuLyXoaBoLoc() {
    const boLocMoi = taoBoLocMacDinh(loaiBaoCao);
    datBoLocNhap(boLocMoi);
    datBoLocDaApDung(boLocMoi);
    datLoiBoLoc("");
    datThongBaoXuat("");
    datDangTai(true);
    datLoiTaiDuLieu("");
  }

  function xuLyDoiTrang(trang: number) {
    datDangTai(true);
    datBoLocNhap((boLocHienTai) => ({ ...boLocHienTai, trang }));
    datBoLocDaApDung((boLocHienTai) => ({ ...boLocHienTai, trang }));
  }

  async function xuLyXuatBaoCao(dinhDang: DinhDangXuat) {
    if (dinhDangDangXuat) return;
    datDinhDangDangXuat(dinhDang);
    datThongBaoXuat("");
    try {
      await xuatBaoCao(loaiBaoCao, boLocDaApDung, dinhDang);
      datThongBaoXuat(`Đã tải báo cáo ${dinhDang === "pdf" ? "PDF" : "Excel"}.`);
    } catch (loi) {
      datThongBaoXuat(layThongBaoLoiModule5(loi, "Không thể xuất báo cáo."));
    } finally {
      datDinhDangDangXuat(null);
    }
  }

  const coDuLieuXuat = Boolean(ketQuaBaoCao && ketQuaBaoCao.phanTrang.tongBanGhi > 0);

  return (
    <div className="trang-bao-cao">
      <section className="the-noi-dung khung-bo-loc-bao-cao">
        <BoLocBaoCao
          loaiBaoCao={loaiBaoCao}
          boLoc={boLocNhap}
          danhSachThietBi={danhSachThietBi}
          danhSachLoaiThietBi={danhSachLoaiThietBi}
          danhSachViTri={danhSachViTri}
          danhSachKyThuatVien={danhSachKyThuatVien}
          dangTai={dangTai}
          loiBoLoc={loiBoLoc}
          xuLyDoiLoaiBaoCao={xuLyDoiLoaiBaoCao}
          xuLyCapNhatBoLoc={xuLyCapNhatBoLoc}
          xuLyApDungBoLoc={xuLyApDungBoLoc}
          xuLyXoaBoLoc={xuLyXoaBoLoc}
        />
        <div className="thanh-xuat-bao-cao">
          <span>Xuất báo cáo theo bộ lọc đã áp dụng</span>
          <button className="nut nut-phu" type="button" disabled={!coDuLieuXuat || Boolean(dinhDangDangXuat)} onClick={() => void xuLyXuatBaoCao("pdf")}>{dinhDangDangXuat === "pdf" ? "Đang xuất..." : "PDF"}</button>
          <button className="nut nut-phu" type="button" disabled={!coDuLieuXuat || Boolean(dinhDangDangXuat)} onClick={() => void xuLyXuatBaoCao("excel")}>{dinhDangDangXuat === "excel" ? "Đang xuất..." : "Excel"}</button>
        </div>
        {thongBaoXuat && <div className={`thong-bao ${thongBaoXuat.startsWith("Đã tải") ? "thanh-cong" : "loi"}`} role="status">{thongBaoXuat}</div>}
      </section>

      {dangTai ? <div className="trang-thai-du-lieu the-noi-dung"><span className="vong-xoay" /> Đang tải báo cáo...</div> : loiTaiDuLieu ? <div className="trang-thai-du-lieu the-noi-dung"><p className="tieu-de-loi">{loiTaiDuLieu}</p><button className="nut nut-phu" onClick={() => { datDangTai(true); datLoiTaiDuLieu(""); datLanTaiLai((soLan) => soLan + 1); }}>Thử lại</button></div> : ketQuaBaoCao && <NoiDungBaoCao ketQuaBaoCao={ketQuaBaoCao} xuLyDoiTrang={xuLyDoiTrang} />}
    </div>
  );
}
