"use client";

import Image from "next/image";
import { useEffect, useState } from "react";
import TheoDoiSuaChua from "./TheoDoiSuaChua";
import { LoiHttp } from "@/types/api";
import type { KyThuatVienSuCo, SuCo } from "@/types/suCo";
import { kiemTraIdSuCo, layChiTietSuCo, layDanhSachKyThuatVien, phanCongKyThuatVien } from "@/services/suCo.service";
import { dinhDangThoiGian, NHAN_MUC_DO_SU_CO } from "@/utils/dinhDangSuCo";


function layDuongDanAnh(duongDan: string) {
  const giaTri = duongDan.trim();
  if (/^https?:\/\//i.test(giaTri)) return giaTri;
  if (!giaTri.startsWith("/")) return null;
  const diaChiApi = process.env.NEXT_PUBLIC_API_BASE_URL || process.env.NEXT_PUBLIC_API_URL || "http://localhost:3000/api";
  return `${new URL(diaChiApi).origin}${giaTri}`;
}

function HinhAnhSuCo({ danhSachAnh }: { danhSachAnh?: string[] }) {
  const [anhDangXem, datAnhDangXem] = useState<string | null>(null);
  const [anhBiLoi, datAnhBiLoi] = useState<string[]>([]);
  const danhSachDuongDan = Array.isArray(danhSachAnh)
    ? danhSachAnh.filter((anh): anh is string => typeof anh === "string").map(layDuongDanAnh).filter((anh): anh is string => Boolean(anh))
    : [];

  if (danhSachDuongDan.length === 0) return <p className="chu-phu">Chưa có hình ảnh.</p>;

  return <>
    <div className="danh-sach-anh-su-co">
      {danhSachDuongDan.map((anh, viTri) => anhBiLoi.includes(anh) ?
        <span className="anh-su-co-loi" key={`${anh}-${viTri}`}>Không tải được ảnh</span> :
        <button className="nut-anh-su-co" type="button" key={`${anh}-${viTri}`} onClick={() => datAnhDangXem(anh)} aria-label={`Xem ảnh sự cố ${viTri + 1}`}>
          <Image src={anh} alt={`Ảnh sự cố ${viTri + 1}`} width={120} height={90} unoptimized onError={() => datAnhBiLoi((danhSach) => [...danhSach, anh])} />
        </button>)}
    </div>
    {anhDangXem && <div className="lop-phu lop-phu-anh" role="dialog" aria-modal="true" aria-label="Ảnh sự cố" onClick={() => datAnhDangXem(null)}>
      <button className="nut-dong-anh" type="button" onClick={() => datAnhDangXem(null)} aria-label="Đóng ảnh">×</button>
      <Image src={anhDangXem} alt="Ảnh sự cố" width={960} height={720} unoptimized onClick={(suKien) => suKien.stopPropagation()} onError={() => { datAnhBiLoi((danhSach) => [...danhSach, anhDangXem]); datAnhDangXem(null); }} />
    </div>}
  </>;
}

interface ChiTietSuCoProps {
  suCoId: number | null;
  dongChiTiet: () => void;
  khiCapNhat: (thongBao: string) => void;
}

export default function ChiTietSuCo({ suCoId, dongChiTiet, khiCapNhat }: ChiTietSuCoProps) {
  const [suCo, datSuCo] = useState<SuCo | null>(null);
  const [dangTai, datDangTai] = useState(true);
  const [loiTai, datLoiTai] = useState("");
  const [danhSachKyThuatVien, datDanhSachKyThuatVien] = useState<KyThuatVienSuCo[]>([]);
  const [trangKyThuatVien, datTrangKyThuatVien] = useState(1);
  const [tongTrangKyThuatVien, datTongTrangKyThuatVien] = useState(0);
  const [tuKhoaKyThuatVien, datTuKhoaKyThuatVien] = useState("");
  const [kyThuatVienId, datKyThuatVienId] = useState("");
  const [loiKyThuatVien, datLoiKyThuatVien] = useState("");
  const [loiTaiKyThuatVien, datLoiTaiKyThuatVien] = useState("");
  const [dangTaiKyThuatVien, datDangTaiKyThuatVien] = useState(false);
  const [lanTaiKyThuatVien, datLanTaiKyThuatVien] = useState(0);
  const [dangXuLy, datDangXuLy] = useState(false);
  const [loiXuLy, datLoiXuLy] = useState("");

  async function taiChiTiet() {
    if (!kiemTraIdSuCo(suCoId)) return;
    datDangTai(true);
    datLoiTai("");
    try {
      datSuCo(await layChiTietSuCo(suCoId));
    } catch (loi) {
      datLoiTai((loi as LoiHttp).message || "Không thể tải sự cố.");
    } finally {
      datDangTai(false);
    }
  }

  useEffect(() => {
    if (!kiemTraIdSuCo(suCoId)) return;
    let dangHoatDong = true;
    layChiTietSuCo(suCoId)
      .then((ketQua) => { if (dangHoatDong) datSuCo(ketQua); })
      .catch((loi) => { if (dangHoatDong) datLoiTai((loi as LoiHttp).message || "Không thể tải sự cố."); })
      .finally(() => { if (dangHoatDong) datDangTai(false); });
    return () => { dangHoatDong = false; };
  }, [suCoId]);

  const coThePhanCong = suCo?.trangThai === "MOI" || suCo?.trangThai === "DA_PHAN_CONG";
  useEffect(() => {
    if (!coThePhanCong) return;
    let dangHoatDong = true;
    const boDem = window.setTimeout(() => {
      datDangTaiKyThuatVien(true);
      datLoiTaiKyThuatVien("");
      layDanhSachKyThuatVien(trangKyThuatVien, tuKhoaKyThuatVien)
        .then((ketQua) => {
          if (!dangHoatDong) return;
          datDanhSachKyThuatVien(ketQua.danhSach);
          datTongTrangKyThuatVien(ketQua.phanTrang.tongTrang);
        })
        .catch((loi) => {
          if (!dangHoatDong) return;
          datDanhSachKyThuatVien([]);
          datTongTrangKyThuatVien(0);
          datLoiTaiKyThuatVien((loi as LoiHttp).message || "Không thể tải kỹ thuật viên.");
        })
        .finally(() => { if (dangHoatDong) datDangTaiKyThuatVien(false); });
    }, 250);
    return () => { dangHoatDong = false; window.clearTimeout(boDem); };
  }, [coThePhanCong, trangKyThuatVien, tuKhoaKyThuatVien, lanTaiKyThuatVien]);

  async function xuLyPhanCong() {
    if (!suCo || !kiemTraIdSuCo(suCo.id) || !coThePhanCong) return;
    const id = Number(kyThuatVienId);
    if (!kiemTraIdSuCo(id) || !danhSachKyThuatVien.some((kyThuatVien) => kyThuatVien.id === id)) {
      datLoiKyThuatVien("Vui lòng chọn kỹ thuật viên.");
      return;
    }
    if (suCo.kyThuatVien?.id === id) {
      datLoiKyThuatVien("Kỹ thuật viên này đang được phân công.");
      return;
    }
    if (!window.confirm(suCo.kyThuatVien ? "Đổi kỹ thuật viên phụ trách?" : "Phân công kỹ thuật viên?")) return;
    datDangXuLy(true);
    datLoiXuLy("");
    try {
      await phanCongKyThuatVien(suCo.id, id);
      datKyThuatVienId("");
      await taiChiTiet();
      khiCapNhat("Phân công thành công.");
    } catch (loi) {
      const loiHttp = loi as LoiHttp;
      if (loiHttp.maTrangThai === 409) {
        await taiChiTiet();
        khiCapNhat("");
        datLoiXuLy("Sự cố đã được cập nhật. Vui lòng kiểm tra lại.");
      } else {
        datLoiXuLy(loiHttp.message || "Không thể phân công sự cố.");
      }
    } finally {
      datDangXuLy(false);
    }
  }

  if (suCoId === null) return null;
  return <div className="lop-phu" role="dialog" aria-modal="true" aria-labelledby="tieu-de-chi-tiet-su-co">
    <div className="hop-thoai hop-thoai-chi-tiet">
      <div className="dau-hop-thoai"><h2 id="tieu-de-chi-tiet-su-co">{suCo?.maSuCo || "Chi tiết sự cố"}</h2><button className="nut-dong" type="button" onClick={dongChiTiet} aria-label="Đóng">×</button></div>
      {dangTai ? <div className="trang-thai-du-lieu"><span className="vong-xoay" /> Đang tải...</div> : loiTai ? <div className="trang-thai-du-lieu"><p>{loiTai}</p><button className="nut nut-phu" type="button" onClick={() => void taiChiTiet()}>Thử lại</button></div> : suCo && <div className="noi-dung-chi-tiet">
        <h3 className="tieu-de-su-co">{suCo.tieuDe}</h3>
        <dl className="luoi-thong-tin">
          <div><dt>Thiết bị</dt><dd>{suCo.thietBi?.maThietBi} · {suCo.thietBi?.tenThietBi}</dd></div>
          <div><dt>Người báo</dt><dd>{suCo.nguoiBao?.hoTen || "—"}{suCo.nguoiBao?.email ? ` · ${suCo.nguoiBao.email}` : ""}</dd></div>
          <div><dt>Mức độ</dt><dd>{NHAN_MUC_DO_SU_CO[suCo.mucDo] || suCo.mucDo}</dd></div>
          <div><dt>Vị trí thiết bị</dt><dd>{suCo.thietBi?.viTri?.tenViTri || "—"}</dd></div>
          <div><dt>Thời gian xảy ra</dt><dd>{dinhDangThoiGian(suCo.thoiGianXayRa)}</dd></div>
          <div><dt>Thời gian báo</dt><dd>{dinhDangThoiGian(suCo.thoiGianBao)}</dd></div>
        </dl>
        <section className="muc-chi-tiet-su-co"><h3>Mô tả</h3><p>{suCo.moTa || "—"}</p></section>
        <section className="muc-chi-tiet-su-co"><h3>Hình ảnh</h3><HinhAnhSuCo danhSachAnh={suCo.hinhAnh} /></section>
        <TheoDoiSuaChua suCo={suCo} />
        {coThePhanCong && <section className="muc-chi-tiet-su-co"><h3>{suCo.kyThuatVien ? "Đổi kỹ thuật viên" : "Phân công"}</h3>
          <div className="nhom-truong"><label htmlFor="tim-ky-thuat-vien">Tìm kỹ thuật viên</label><input id="tim-ky-thuat-vien" value={tuKhoaKyThuatVien} maxLength={200} onChange={(suKien) => { datTuKhoaKyThuatVien(suKien.target.value); datTrangKyThuatVien(1); datKyThuatVienId(""); datLoiKyThuatVien(""); }} placeholder="Tên hoặc email" /></div>
          <div className="nhom-truong"><label htmlFor="chon-ky-thuat-vien">Kỹ thuật viên</label><select id="chon-ky-thuat-vien" value={kyThuatVienId} disabled={dangTaiKyThuatVien || Boolean(loiTaiKyThuatVien)} onChange={(suKien) => { datKyThuatVienId(suKien.target.value); datLoiKyThuatVien(""); }}><option value="">Chọn kỹ thuật viên</option>{danhSachKyThuatVien.map((kyThuatVien) => <option key={kyThuatVien.id} value={kyThuatVien.id}>{kyThuatVien.hoTen} · {kyThuatVien.email}</option>)}</select>{loiKyThuatVien && <span className="loi-truong">{loiKyThuatVien}</span>}{loiTaiKyThuatVien && <span className="loi-truong">{loiTaiKyThuatVien} <button className="nut-link" type="button" onClick={() => datLanTaiKyThuatVien((lanTai) => lanTai + 1)}>Thử lại</button></span>}</div>
          {tongTrangKyThuatVien > 1 && <div className="phan-trang"><span>Trang {trangKyThuatVien} / {tongTrangKyThuatVien}</span><div><button className="nut-trang" type="button" disabled={trangKyThuatVien <= 1} onClick={() => { datTrangKyThuatVien((trang) => trang - 1); datKyThuatVienId(""); }}>‹</button><button className="nut-trang" type="button" disabled={trangKyThuatVien >= tongTrangKyThuatVien} onClick={() => { datTrangKyThuatVien((trang) => trang + 1); datKyThuatVienId(""); }}>›</button></div></div>}
          {loiXuLy && <div className="thong-bao loi" role="alert">{loiXuLy}</div>}
          <button className="nut nut-chinh" type="button" disabled={dangXuLy || dangTaiKyThuatVien || Boolean(loiTaiKyThuatVien)} onClick={() => void xuLyPhanCong()}>{dangXuLy ? "Đang lưu..." : suCo.kyThuatVien ? "Đổi kỹ thuật viên" : "Phân công"}</button>
        </section>}
      </div>}
    </div>
  </div>;
}
